import os
from dotenv import load_dotenv
from risk_engine.services.llm import generate_risk_explanation

load_dotenv()

def test_binance_risk():
    model_features = {
        'tvl_change_24h': -1.2,
        'tvl_change_7d': 5.5,
        'log_liquidity_depth': 22.4,
        'protocol_age_days': 1200
    }
    
    risk_result = {
        'risk_score': 3.2,
        'level': 'LOW',
        'individual_model_scores': {
            'model_1': 3.1, 'model_2': 3.4, 'model_3': 3.0,
            'model_4': 3.2, 'model_5': 3.5, 'model_6': 3.1,
            'model_7': 3.3, 'model_8': 3.2, 'model_9': 3.1,
            'model_10': 3.2
        }
    }
    
    user_wallet = "0x1234...5678"
    user_balance = 10.5
    user_risk_tolerance = "medium"
    user_investment_goal = "long term growth"
    chromadb_context = "Historical data for Binance shows consistent TVL growth and high liquidity depth. Occasional market volatility impacts 24h metrics but 7d trends remain positive."

    print("--- GENERATING RISK EXPLANATION ---")
    explanation = generate_risk_explanation(
        model_features, 
        risk_result, 
        user_wallet, 
        user_balance, 
        user_risk_tolerance, 
        user_investment_goal, 
        chromadb_context
    )
    print(explanation)

if __name__ == "__main__":
    test_binance_risk()
