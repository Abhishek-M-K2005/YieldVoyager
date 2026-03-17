import requests
from apscheduler.schedulers.background import BackgroundScheduler
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

def fetch_defillama_data():
    """
    Fetches the latest TVL from DeFiLlama and updates Protocol/Vault in db.
    """
    # Import inside function to avoid AppRegistryNotReady issues
    from defi.models import Protocol, Vault
    
    logger.info("Fetching data from DeFiLlama...")
    try:
        # 1. Fetch protocols from DeFiLlama
        response = requests.get("https://api.llama.fi/protocols")
        if response.status_code != 200:
            logger.error(f"Failed to fetch from DeFiLlama: {response.text}")
            return
            
        data = response.json()
        
        # We'll just take the top 10 for demonstration to keep it fast and light
        top_protocols = data[:10]
        
        for p_data in top_protocols:
            name = p_data.get('name')
            chain = p_data.get('chain', 'Ethereum')
            tvl = p_data.get('tvl', 0)
            url = p_data.get('url', '')
            
            # Update or create Protocol
            protocol, created = Protocol.objects.get_or_create(
                name=name,
                defaults={'chain': chain, 'website': url, 'risk_level': 'medium'}
            )
            
            # Since DeFiLlama /protocols endpoint doesn't give APYs per vault easily,
            # we'll create a default vault or update the main one based on TVL,
            # with a mock APY for demonstration logic
            vault, v_created = Vault.objects.get_or_create(
                protocol=protocol,
                asset='USD',
                defaults={'apy': 5.0, 'tvl': tvl}
            )
            
            # If not newly created, update TVL
            if not v_created:
                vault.tvl = tvl
                # Randomize APY slightly or fetch from actual yield endpoint if needed
                vault.save()
                
            # Here we could call risk_engine's update for ML scoring instantly
            from risk_engine.services.scoring import compute_and_store_risk
            
            # Mock features derived from DeFiLlama data
            features = {
                "tvl_change_24h": p_data.get('change_1d', 0) / 100.0 if p_data.get('change_1d') else 0.0,
                "tvl_change_7d": p_data.get('change_7d', 0) / 100.0 if p_data.get('change_7d') else 0.0,
                "liquidity_depth": tvl,
                "utilization_ratio": 0.5, # Mock
                "oracle_price_std": 0.02, # Mock
                "liquidation_spike_ratio": 1.0, # Mock
                "protocol_age_days": 365, # Mock
            }
            
            try:
                result = compute_and_store_risk(protocol, features)
                
                # Store this freshly calculated context into ChromaDB for LLM retrieval
                from risk_engine.services.vector_db import store_protocol_context
                store_protocol_context(
                    protocol_name=name,
                    features=features,
                    risk_score=result.get("risk_score"),
                    risk_level=result.get("level")
                )
                
            except Exception as e:
                logger.error(f"Failed to compute risk for {name}: {e}")
                
        logger.info("Successfully completed DeFiLlama sync.")
            
    except Exception as e:
        logger.error(f"Error in fetch_defillama_data: {e}")

def start_scheduler():
    scheduler = BackgroundScheduler()
    # Run every 15 minutes
    scheduler.add_job(fetch_defillama_data, 'interval', minutes=15, id='defillama_sync', replace_existing=True)
    scheduler.start()
