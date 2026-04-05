import os
import joblib
import pandas as pd

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ml_assets", "models")
_full_pipeline = None

def load_models():
    """
    Loads the full_pipeline bundle from the ml_assets/models directory.
    Fallback to safe default if missing.
    """
    global _full_pipeline
    if _full_pipeline is None:
        pipeline_path = os.path.join(MODELS_DIR, "full_pipeline.pkl")
        if os.path.exists(pipeline_path):
            try:
                _full_pipeline = joblib.load(pipeline_path)
                print("Loaded full_pipeline.pkl successfully.")
            except Exception as e:
                print(f"Error loading full_pipeline.pkl: {e}")
                _full_pipeline = {}
        else:
            print("full_pipeline.pkl not found!")
            _full_pipeline = {}
    return _full_pipeline

def predict_probabilities(features):
    """
    Predict risk probability using the loaded pipeline bundle.
    Returns individual scores and an aggregated (average) score.
    """
    pipeline = load_models()
    
    # 1. Base fallback if bundle is missing or empty
    if not pipeline or "models" not in pipeline:
        score = 0
        tvl24 = features.get("tvl_change_24h", 0)
        if tvl24 < -0.05: score += 0.2
        mock_score = min(max(score, 0), 1.0)
        return {
            "aggregate_score": mock_score,
            "individual_scores": {"mock_model": mock_score}
        }
        
    # 2. Extract features exactly as expected by the new models
    expected_features = [
        'tvl_change_24h', 'tvl_change_7d', 'tvl_change_3d', 'tvl_momentum',
        'log_liquidity_depth', 'vol_ratio', 'utilisation_ratio', 'oracle_price_std',
        'liquidation_spike_ratio', 'protocol_age_days', 'audit_count'
    ]
    
    # Align features dictionary with what is expected
    aligned_features = {}
    for f in expected_features:
        aligned_features[f] = features.get(f, 0.0)
        
    # Create DataFrame with guaranteed column order
    input_df = pd.DataFrame([aligned_features], columns=expected_features)
    
    individual_scores = {}
    total_score = 0
    models_dict = pipeline.get("models", {})
    
    # 3. Perform inference across all models in the bundle
    for model_name, model in models_dict.items():
        try:
            if hasattr(model, "predict_proba"):
                # Assuming index 1 is the positive/risk class
                score = model.predict_proba(input_df)[0][1]
            elif hasattr(model, "predict"):
                score = model.predict(input_df)[0]
            else:
                score = 0
                
            score = float(score)
            score = min(max(score, 0.0), 1.0)
            
            individual_scores[model_name] = round(score, 4)
            total_score += score
        except Exception as e:
            print(f"Error running inference on {model_name}: {e}")
            
    if not individual_scores:
        return {
            "aggregate_score": 0.5,
            "individual_scores": {}
        }
            
    # 4. Aggregate output (Average)
    aggregate_score = total_score / len(individual_scores)
    
    return {
        "aggregate_score": round(aggregate_score, 4),
        "individual_scores": individual_scores
    }
