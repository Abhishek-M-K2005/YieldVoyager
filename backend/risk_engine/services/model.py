import os

try:
    import joblib
    import numpy as np
    ML_LIBRARIES_AVAILABLE = True
except ImportError:
    ML_LIBRARIES_AVAILABLE = False

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "risk_xgb_model.pkl")

# Check if model exists and libraries are available
model = None
if ML_LIBRARIES_AVAILABLE and os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
    except Exception:
        pass


FEATURE_ORDER = [
    "tvl_change_24h",
    "tvl_change_7d",
    "liquidity_depth",
    "utilization_ratio",
    "oracle_price_std",
    "liquidation_spike_ratio",
    "protocol_age_days",
    "audit_count",
]

def predict_probability(features_dict):
    if model and ML_LIBRARIES_AVAILABLE:
        try:
            vector = np.array([[features_dict[f] for f in FEATURE_ORDER]])
            prob = model.predict_proba(vector)[0][1]
            return float(prob)
        except Exception:
            pass # Fall back to heuristic on error

    # Fallback heuristic if model/libs are missing
    score_contribution = 0
    if features_dict.get("tvl_change_24h", 0) < -0.05: score_contribution += 0.2
    if features_dict.get("tvl_change_7d", 0) < -0.10: score_contribution += 0.3
    if features_dict.get("liquidity_depth", 0) < 1_000_000: score_contribution += 0.2
    if features_dict.get("utilization_ratio", 0) > 0.8: score_contribution += 0.1
    if features_dict.get("oracle_price_std", 0) > 0.05: score_contribution += 0.2
    
    return min(max(score_contribution, 0), 1.0)
