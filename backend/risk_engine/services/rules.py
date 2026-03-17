def apply_hard_rules(features):

    flags = []

    tvl24 = features.get("tvl_change_24h", 0)
    tvl7 = features.get("tvl_change_7d", 0)

    impermanent = features.get("impermanent_loss_risk", 0)
    age = features.get("protocol_age_days", 0)
    oracle_std = features.get("oracle_price_std", 0)
    liq_spike = features.get("liquidation_spike_ratio", 0)

    if tvl24 < -0.05:
        flags.append("SEVERE_TVL_DROP")

    if abs(tvl24) > 0.30 and abs(tvl7) > 0.40:
        flags.append("TVL_VOLATILITY_SPIKE")

    if impermanent == 1:
        flags.append("IMPERMANENT_LOSS_RISK")

    if age < 180:
        flags.append("NEW_PROTOCOL")

    if oracle_std > 0.08:
        flags.append("ORACLE_PRICE_INSTABILITY")

    if liq_spike > 2:
        flags.append("LIQUIDATION_SPIKE")

    return flags