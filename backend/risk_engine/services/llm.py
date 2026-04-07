import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Set up your LLM client here
client = None
types = None
llm_init_error = None

try:
    from google import genai
    from google.genai import types
    
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        client = genai.Client(api_key=api_key)
    else:
        llm_init_error = "GEMINI_API_KEY not found in environment variables."
except ImportError:
    llm_init_error = "google-genai package not installed or import error."
    print(f"Warning: {llm_init_error} LLM features disabled.")
except Exception as e:
    llm_init_error = f"Error initializing LLM client: {e}"
    print(llm_init_error)

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
    ### DeFi Risk Analysis & Investment Recommendation
    
    You are a professional DeFi risk analyst. Provide a highly detailed, data-driven, and technical analysis. 
    **MANDATORY:** Start your response IMMEDIATELY with the analysis. Do NOT use any introductory greetings, roleplay (e.g., "Ah, my esteemed client"), or pleasantries.
    
    - User Wallet: {user_wallet_address} ({user_balance} ETH)
    - Risk Profile: {user_risk_tolerance.upper()} tolerance
    - Investment Goal: {user_investment_goal}
    
    ### PROTOCOL DATA (LIVE)
    - 24h TVL Change: {model_features.get('tvl_change_24h')}
    - 7d TVL Change: {model_features.get('tvl_change_7d', 'N/A')}
    - Log Liquidity Depth: {model_features.get('log_liquidity_depth')}
    - Protocol Age: {model_features.get('protocol_age_days')} days
    
    ### MULTI-MODEL ENSEMBLE SCORES
    - Aggregate Risk Score: {risk_result.get('risk_score')} / 10.0
    - Risk Level: {risk_result.get('level')}
    - Model Breakdown: {individual_str}
    
    ### HISTORICAL CONTEXT (RAG)
    {chromadb_context}

    **RESPONSE STRUCTURE (VERBOSE):**
    1. **Extended Technical Analysis:** Deep dive into the {risk_result.get('risk_score')} score. Explain exactly what the 10 models are seeing in the TVL and liquidity data.
    2. **Comparative Insights:** Contrast the 24h/7d LIVE metrics against the provided RAG context.
    3. **Strategic Prediction:** Based on {user_risk_tolerance.upper()} and {user_investment_goal}, what is the absolute BEST multi-step move for {user_balance} ETH? Be specific.
    """

    if not client:
        error_msg = llm_init_error or "LLM client not initialized."
        return (
            f"**Simulated AI Response ({error_msg}):**\\n\\n"
            f"The protocol has an aggregate risk score of {risk_result.get('risk_score')}/10 ({risk_result.get('level')}). "
            f"Based on your {user_risk_tolerance} risk tolerance and {user_balance} ETH balance, "
            f"please invest cautiously. Historical context: {chromadb_context[:100]}..."
        )

    try:
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction="You are a professional DeFi risk analyst. Your responses must be technical, verbose, and structured. START IMMEDIATELY with the analysis.",
                max_output_tokens=4096,
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
    ### Ecosystem-Wide "Best Pick" Pick Analysis
    
    You are a professional DeFi ecosystem advisor. Provide a technical, lengthy, and data-backed "Best Pick" recommendation.
    **MANDATORY:** Start your response IMMEDIATELY with the analysis. Do NOT use any introductory greetings, roleplay, or pleasantries.
    
    - User Profile: {user_balance} ETH | {user_risk_tolerance.upper()} Tolerance | {user_investment_goal} Goal
    
    ### ECOSYSTEM SCORES (Multi-Model Aggregates)
    {scores_str}
    
    ### HISTORICAL CONTEXT (RAG)
    {chromadb_context}

    **RESPONSE STRUCTURE (VERBOSE):**
    1. **Deep Ecosystem Analysis:** Compare the current scores against ChromaDB historical baselines.
    2. **Strategic Filtering:** Why protocols were eliminated based on {user_risk_tolerance.upper()} and {user_investment_goal}.
    3. **The Absolute Best Deployment:** Crown one protocol as the winner and provide a technical execution plan for {user_balance} ETH.
    """

    if not client:
        error_msg = llm_init_error or "LLM client not initialized."
        return (
            f"**Simulated AI Response ({error_msg}):**\\n\\n"
            f"Based on your {user_risk_tolerance.upper()} risk tolerance, the best option right now is the lowest-risk protocol shown above. Historical market data confirms stable conditions."
        )

    try:
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction="You are a professional DeFi ecosystem advisor. Your responses must be technical, lengthy, and structured. START IMMEDIATELY with the analysis.",
                max_output_tokens=4096,
                temperature=0.7
            )
        )
        return response.text.strip()
        
    except Exception as e:
        return f"Error generating explanation: {str(e)}"
