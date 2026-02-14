def apply_hard_rules(features):
    flags = []
    if features["oracle_price_std"] > 0.15:
        flags.append("ORACLE_VOLATILITY")
        
    if features["liquidity_depth"] > 1_000_000:
        flags.append("LOW_LIQUIDITY")
        
    if features["tvl_change_7d"] < -0.30:
        flags.append("SEVERE_TVL_DROP")
        
    return flags

