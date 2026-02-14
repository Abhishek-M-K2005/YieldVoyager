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