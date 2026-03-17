from .rules import apply_hard_rules
from .model import predict_probability
from risk_engine.models import RiskSnapshot
from .features import compute_protocol_age_days


def risk_band(score):
    if score < 3:
        return "low"
    elif score < 6:
        return "medium"
    return "high"


def compute_and_store_risk(protocol, features):
    REQUIRED_FEATURES = [
        "tvl_change_24h",
        "tvl_change_7d",
        "liquidity_depth",
        "utilisation_ratio",
        "oracle_price_std",
        "liquidation_spike_ratio"
    ]

    for f in REQUIRED_FEATURES:
        features.setdefault(f, 0)
        
    features["protocol_age_days"] = compute_protocol_age_days(
        features.get("listed_at_timestamp", 0)
    )

    flags = apply_hard_rules(features)

    prob = predict_probability(features)

    score = round(prob * 10, 2)

    level = risk_band(score)

    if "SEVERE_TVL_DROP" in flags:
        score = max(score, 8.5)

    level = risk_band(score)

    RiskSnapshot.objects.create(
        protocol=protocol,
        score=score,
        level=level
    )

    return {
        "risk_score": score,
        "level": level,
        "flags": flags
    }