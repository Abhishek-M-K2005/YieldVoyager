import os
import joblib
import pandas as pd

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "ml_assets", "models")
_model_instances = []

def load_models():
    """
    Loads all ML models from the ml_assets/models directory.
    Uses joblib to load .pkl files.
    """
    global _model_instances
    if not _model_instances:
        if os.path.exists(MODELS_DIR):
            for file in os.listdir(MODELS_DIR):
                if file.endswith('.pkl'):
                    model_path = os.path.join(MODELS_DIR, file)
                    try:
                        model = joblib.load(model_path)
                        _model_instances.append({"name": file, "model": model})
                        print(f"Loaded model: {file}")
                    except Exception as e:
                        print(f"Error loading model {file}: {e}")
    return _model_instances

def predict_probabilities(features):
    """
    Predict risk probability using all loaded ML models.
    Returns individual scores and an aggregated (average) score.
    """
    models = load_models()
    
    # 1. Base fallback if no models are found (e.g., user hasn't copied them yet)
    if not models:
        score = 0
        tvl24 = features.get("tvl_change_24h", 0)
        if tvl24 < -0.05: score += 0.2
        mock_score = min(max(score, 0), 1.0)
        return {
            "aggregate_score": mock_score,
            "individual_scores": {"mock_model": mock_score}
        }
        
    # 2. Structure features into a DataFrame as expected by most sklearn/xgboost models
    input_df = pd.DataFrame([features])
    
    individual_scores = {}
    total_score = 0
    
    # 3. Perform inference across all 10 models
    for item in models:
        model_name = item["name"]
        model = item["model"]
        try:
            if hasattr(model, "predict_proba"):
                # Assuming index 1 is the positive/risk class for binary classification
                score = model.predict_proba(input_df)[0][1]
            elif hasattr(model, "predict"):
                # For regression models predicting a probability/score directly
                score = model.predict(input_df)[0]
            else:
                score = 0
                
            score = float(score)
            score = min(max(score, 0.0), 1.0) # Clamp between 0 and 1
            
            individual_scores[model_name] = round(score, 4)
            total_score += score
        except Exception as e:
            print(f"Error running inference on {model_name}: {e}")
            
    if not individual_scores:
        return {
            "aggregate_score": 0.5, # Safe fallback
            "individual_scores": {}
        }
            
    # 4. Aggregate output (Average)
    aggregate_score = total_score / len(individual_scores)
    
    return {
        "aggregate_score": round(aggregate_score, 4),
        "individual_scores": individual_scores
    }

