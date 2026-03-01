import requests
from datetime import datetime
from defi.models import Vault
def build_protocol_features(protocol):
    tvl_change_24h, tvl_change_7d = get_tvl_changes(protocol.name)
    
    liquidity_depth = sum(
        vault.tvl for vault in Vault.objects.filter(protocol = protocol)
    )
    
    utilization_ratio = 0.6
    oracle_price_std = 0.05
    liquidation_spike_ratio = 1.1
    
    if hasattr(protocol, "created_at") and protocol.created_at:
        protocol_age_days = (
            datetime.now().date() - protocol.created_at.date()
        ).days
    else:
        protocol_age_days = 365
        
    audit_count = getattr(protocol, "audit_count", 1)
    
    return {
        "tvl_change_24h": tvl_change_24h,
        "tvl_change_7d": tvl_change_7d,
        "liquidity_depth":liquidity_depth,
        "utilisation_ratio": utilisation_ratio,
        "oracle_price_std": oracle_price_std,
        "liquidation_spike_ratio": liquidation_spike_ratio,
        "protocol_age_days": protocol_age_days,
        "audit_count": audit_count,
    }
        
    
def get_tvl_changes(protocol_name):
    try:
        url = f"https://api.llama.fi/protocol/{protocol_name.lower()}"
        response = requests.get(url, timeout = 5)
        data = response.json()
        tvl_data = data.get("tvl", [])
        
        if len(tvl_data) < 8:
            return 0.0, 0.0
        
        latest = tvl_data[-1]["totalLiquidityUSD"]
        tvl_24h_ago = tvl_data[-2]["totalLiquidityUSD"]
        tvl_7d_ago = tvl_data[-8]["totalLiquidityUSD"]
        change_24h = (latest - tvl_24h_ago)/tvl_24h_ago if tvl_change_24h else 0
        change_7h = (latest - tvl_7h_ago)/tvl_7h_ago if tvl_change_7h else 0
        
        return change_24h, change_7d
    except:
        return 0.0, 0.0
    
    