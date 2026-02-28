import random
from defi.models import Vault

def get_protocol_features(protocol):
    # In a real scenario, fetch from DefiLlama / TheGraph
    # We will simulate data for demo purposes
    
    total_tvl = sum(v.tvl for v in Vault.objects.filter(protocol=protocol))
    
    # Mock Feature Pipeline
    return {
        "tvl_change_24h": -0.05 + random.uniform(-0.02, 0.02),
        "tvl_change_7d": -0.12 + random.uniform(-0.05, 0.05),
        "liquidity_depth": total_tvl * 0.1,  # Assume 10% liquidity depth
        "utilisation_ratio": 0.65 + random.uniform(-0.1, 0.1),
        "oracle_price_std": 0.08 + random.uniform(-0.01, 0.01),
        "liquidation_spike_ratio": 1.3,
        "protocol_age_days": 600, # Would be calculated from created_at
        "audit_count": 3,
    }

def build_features(protocol_metrics):
    return {
        "tvl_change_24h": protocol_metrics["tvl_change_24h"],
        "tvl_change_7d" : protocol_metrics["tvl_change_7d"],
        "liquidity_depth": protocol_metrics["liquidity_depth"],
        "utilisation_ratio": protocol_metrics["utilisation_ratio"],
        "oracle_price_std": protocol_metrics["oracle_price_std"],
        "liquidation_spike_ratio": protocol_metrics["liquidation_spike_ratio"],
        "protocol_age_days": protocol_metrics["protocol_age_days"],
        "audit_count": protocol_metrics["audit_count"],
    }