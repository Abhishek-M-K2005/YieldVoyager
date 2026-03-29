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

def generate_risk_explanation(model_features, risk_result, user_wallet_address, user_balance, user_risk_tolerance="medium", user_investment_goal="Unknown", chromadb_context="No historical context available."):
    """
    Calls an LLM to explain the risk score and recommend investment strategies.
    
    Args:
        ...
    """

    # Extract individual model scores if available
    individual_scores = risk_result.get("individual_model_scores", {})
    individual_str = str(individual_scores) if individual_scores else "N/A"

    prompt = f"""
    You are an expert DeFi (Decentralized Finance) AI risk analyst and investment advisor.
    
    A user is considering deploying funds. Based on the RAG context, multi-model outputs, and user profile, predict the best way for them to invest their money and explain the risks.
    
    ### User Profile
    - Wallet Address: {user_wallet_address}
    - Wallet Balance: {user_balance} ETH
    - Risk Tolerance: {user_risk_tolerance.upper()}
    - Investment Goal: {user_investment_goal}
    
    ### Current Protocol Metrics
    - 24h TVL Change: {model_features.get('tvl_change_24h')}
    - 7d TVL Change: {model_features.get('tvl_change_7d', 'N/A')}
    - Liquidity Depth: ${model_features.get('liquidity_depth')}
    - Protocol Age: {model_features.get('protocol_age_days')} days
    
    ### AI Risk Engine (10-Model Ensemble)
    - Aggregate Risk Score: {risk_result.get('risk_score')} / 10.0
    - Risk Level: {risk_result.get('level')}
    - Individual Model Outputs: {individual_str}
    
    ### Historical Market Snapshot (ChromaDB RAG Context)
    {chromadb_context}

    Please provide a structured response:
    1. **Risk Analysis:** Why the risk score is what it is, highlighting any divergence between the 10 individual models. Note warning signs.
    2. **Contextual Shift:** How the current metrics contrast with the historical ChromaDB snapshots.
    3. **Investment Prediction & Recommendation:** Predict the BEST way for THIS specific user to invest based on their {user_risk_tolerance.upper()} tolerance, {user_balance} ETH balance, and {user_investment_goal} goal. Be specific on sizing or alternatives.
    """

    if not client:
        return (
            f"**Simulated AI Response (No API Key found):**\\n\\n"
            f"The protocol has an aggregate risk score of {risk_result.get('risk_score')}/10 ({risk_result.get('level')}). "
            f"Based on your {user_risk_tolerance} risk tolerance and {user_balance} ETH balance, "
            f"please invest cautiously. Historical context: {chromadb_context[:100]}..."
        )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction="You are a helpful DeFi risk assistant.",
                max_output_tokens=300,
                temperature=0.7
            )
        )
        return response.text.strip()
        
    except Exception as e:
        return f"Error generating explanation: {str(e)}"

def generate_best_protocol_explanation(protocol_scores, user_wallet_address, user_balance, user_risk_tolerance="medium", user_investment_goal="Unknown", chromadb_context=""):
    """
    Calls Gemini to act as a robo-advisor across the entire DeFi ecosystem.
    """
    scores_str = ""
    for prot, data in protocol_scores.items():
        scores_str += f"- {prot}: Risk Score {data['score']}/10 ({data['level']})\\n"

    prompt = f"""
    You are an expert DeFi (Decentralized Finance) AI risk analyst and investment advisor.
    
    A user is deciding where to deploy their capital across multiple active protocols. Analyze all available protocols, consider the ChromaDB historical market context, and make an absolute "Best Pick" recommendation based on their unique profile.
    
    ### User Profile
    - Wallet Address: {user_wallet_address}
    - Wallet Balance: {user_balance} ETH
    - Risk Tolerance: {user_risk_tolerance.upper()}
    - Investment Goal: {user_investment_goal}
    
    ### Ecosystem Protocol Scores (10-Model Aggregates)
    {scores_str}
    
    ### Historical Market Snapshot (ChromaDB RAG Context)
    {chromadb_context}

    Please provide a structured response:
    1. **Ecosystem Overview:** A brief summary of the current market state based on the ChromaDB snapshot.
    2. **Protocol Analysis:** Why you discarded certain high-risk or low-reward protocols based on the User's Risk Tolerance.
    3. **The Best Pick:** Crown the absolute best protocol for this user's funds. Explain exactly why this protocol aligns with their {user_risk_tolerance.upper()} tolerance and {user_investment_goal} goal, and recommend an action plan for their {user_balance} ETH.
    """

    if not client:
        return (
            f"**Simulated AI Response (No API Key found):**\\n\\n"
            f"Based on your {user_risk_tolerance.upper()} risk tolerance, the best option right now is the lowest-risk protocol shown above. Historical market data confirms stable conditions."
        )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction="You are a brilliant DeFi ecosystem advisor.",
                max_output_tokens=400,
                temperature=0.7
            )
        )
        return response.text.strip()
        
    except Exception as e:
        return f"Error generating explanation: {str(e)}"
