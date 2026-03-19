import os

# Set up your LLM client here
client = None
types = None

try:
    from google import genai
    from google.genai import types
    
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        client = genai.Client(api_key=api_key)
except ImportError:
    print("Warning: google-genai package not installed or import error. LLM features disabled.")
except Exception as e:
    print(f"Error initializing LLM client: {e}")

def generate_risk_explanation(model_features, risk_result, user_wallet_address, user_balance):
    """
    Calls an LLM to explain the risk score given the input features and user context.
    
    Args:
        model_features (dict): The original metrics passed into the ML model (TVL, liquidity, etc.).
        risk_result (dict): The output from the ML Risk Engine (score, level, flags).
        user_wallet_address (str): The connected Web3 wallet address.
        user_balance (float/str): The user's current wallet balance (e.g. in ETH).
        
    Returns:
        str: A natural language explanation of the context and risks.
    """
    
    context_string = "No historical context available."

    # Construct a detailed prompt providing all context to the LLM
    prompt = f"""
    You are an expert DeFi (Decentralized Finance) AI risk analyst.
    
    A user is considering deploying funds into a liquidity pool or protocol. Provide a concise, easy-to-understand explanation of the protocol's current risk assessment. 
    
    ### User Context
    - Wallet Address: {user_wallet_address}
    - Wallet Balance: {user_balance} ETH
    
    ### Protocol Metrics (Model Input)
    - 24h TVL Change: {model_features.get('tvl_change_24h')}
    - 7d TVL Change: {model_features.get('tvl_change_7d', 'N/A')}
    - Liquidity Depth: ${model_features.get('liquidity_depth')}
    - Protocol Age: {model_features.get('protocol_age_days')} days
    
    ### AI Risk Engine Evaluation (Model Output)
    - Risk Score: {risk_result.get('risk_score')} / 10.0
    - Risk Level: {risk_result.get('level')}

    Please explain:
    1. Why the risk score is what it is based on the metrics.
    2. Any specific warning signs (like low liquidity or high volatility).
    3. A recommendation for the user based on their wallet balance (e.g. appropriate sizing).
    """

    if not client:
        return (
            f"**Simulated AI Response (No API Key found):**\n\n"
            f"The protocol has a risk score of {risk_result.get('risk_score')}/10 ({risk_result.get('level')}). "
            f"Based on the liquidity depth of ${model_features.get('liquidity_depth')}, it appears to be a stable protocol. "
            f"However, recent TVL changes ({model_features.get('tvl_change_24h')}) suggest some volatility. "
            f"As a user with {user_balance} ETH, you should consider diversifying your position."
        )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction="You are a helpful DeFi risk assistant.",
                max_output_tokens=250,
                temperature=0.7
            )
        )
        # In the native SDK, the text is at .text
        return response.text.strip()
        
    except Exception as e:
        return f"Error generating explanation: {str(e)}"
