def predict_probability(features):

    score = 0

    tvl24 = features.get("tvl_change_24h", 0)
    tvl7 = features.get("tvl_change_7d", 0)
    liquidity = features.get("liquidity_depth", 0)
    util_ratio = features.get("utilization_ratio", 0)
    oracle_std = features.get("oracle_price_std", 0)
    liq_spike = features.get("liquidation_spike_ratio", 0)

    if tvl24 < -0.05:
        score += 0.2

    if tvl7 < -0.10:
        score += 0.3

    if liquidity < 1_000_000:
        score += 0.2

    if util_ratio > 0.8:
        score += 0.1

    if oracle_std > 0.05:
        score += 0.2

    if liq_spike > 1.1:
        score += 0.1

    return min(max(score, 0), 1.0)


