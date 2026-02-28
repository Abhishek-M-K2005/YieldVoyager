from .model import predict_probability
from .rules import apply_hard_rules
from risk_engine.models import RiskSnapshot

def normalize_score(prob):
    return round(prob * 10, 2)

def risk_band(score):
    if score < 3:
        return "low"
    elif score < 6:
        return "medium"
    else:
        return "high"
    
def compute_and_store_risk(protocol, protocol_metrics):
    features = protocol_metrics
    
    flags = apply_hard_rules(features)
    
    prob = predict_probability(features)
    score = normalize_score(prob)
    level = risk_band(score)
    
    if "SEVERE_TVL_DROP" in flags:
        score = max(score, 8.5)
        level = "high"
        
    snapshot = RiskSnapshot.objects.create(
        protocol=protocol,
        score=score,
        level=level
    )
    
    return {
        "risk_score": score,
        "level": level,
        "flags": flags
    }