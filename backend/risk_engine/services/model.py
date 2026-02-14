import os
import joblib
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "risk_xgb_model.pkl")

model = joblib.load(MODEL_PATH)

FEATURE_ORDER = [
    "tvl_change_24h",
    "tvl_change_7d",
    "liquidity_depth",
    "utilisation_ratio",
    "oracle_price_std",
    "liquidation_spike_pool",
    "protocol_age_days",
    "audit_count",
]

def predict_probability(features_dict):
    vector = np.array([[features_dict[f] for f in FEATURE_ORDER]])
    prob = model.predict_proba(vector)[0][1]
    return float(prob)
