import os

# TODO: Set up your LLM client here
# Example using OpenAI:
# import openai
# openai.api_key = os.getenv("OPENAI_API_KEY")

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
    
    # Fetch related context from Vector DB (ChromaDB)
    from risk_engine.services.vector_db import get_similar_contexts
    search_query = f"Risk context for protocol with level {risk_result.get('level')} and {model_features.get('liquidity_depth')} liquidity."
    retrieved_contexts = get_similar_contexts(search_query)
    
    context_string = "\n".join(retrieved_contexts) if retrieved_contexts else "No historical context available."

    # Construct a detailed prompt providing all context to the LLM
    prompt = f"""
    You are an expert DeFi (Decentralized Finance) AI risk analyst.
    
    A user is considering deploying funds into a liquidity pool or protocol. Provide a concise, easy-to-understand explanation of the protocol's current risk assessment. 
    
    ### User Context
    - Wallet Address: {user_wallet_address}
    - Wallet Balance: {user_balance} ETH
    
    ### Protocol Metrics (Model Input)
    - 24h TVL Change: {model_features.get('tvl_change_24h')}
    - 7d TVL Change: {model_features.get('tvl_change_7d')}
    - Liquidity Depth: ${model_features.get('liquidity_depth')}
    - Utilization Ratio: {model_features.get('utilization_ratio')}
    - Oracle Price Std Dev: {model_features.get('oracle_price_std')}
    - Liquidation Spike Ratio: {model_features.get('liquidation_spike_ratio')}
    - Protocol Age: {model_features.get('protocol_age_days')} days
    
    ### AI Risk Engine Evaluation (Model Output)
    - Risk Score: {risk_result.get('risk_score')} / 10.0
    - Risk Level: {risk_result.get('level')}
    - Triggered Hard Flags: {', '.join(risk_result.get('flags', [])) if risk_result.get('flags') else 'None'}
    
    ### Retrieved Context from Vector Database (RAG)
    {context_string}
    
    Please explain specifically WHY the AI Risk engine gave this score based on the provided metrics and the retrieved context. Also, give the user personalized advice considering their current wallet balance. Keep the explanation under 4 sentences.
    """
    
    # ---------------------------------------------------------
    # TODO: Make the actual API call to your LLM provider here.
    # ---------------------------------------------------------
    
    # Example snippet for OpenAI:
    # try:
    #     response = openai.ChatCompletion.create(
    #         model="gpt-4",
    #         messages=[
    #             {"role": "system", "content": "You are a helpful DeFi risk assistant."},
    #             {"role": "user", "content": prompt}
    #         ]
    #     )
    #     return response.choices[0].message.content
    # except Exception as e:
    #     return f"Failed to generate explanation. Error: {str(e)}"
    
    # Temporary mock response until LLM is configured
    return (
        f"Based on the provided metrics, this protocol presents a {risk_result.get('level')} risk "
        f"(Score: {risk_result.get('risk_score')}/10). The TVL change and liquidity depth were the primary factors "
        "in this assessment. Given your balance of {user_balance} ETH, you should ensure you do not over-allocate "
        "your portfolio into high-risk yielding positions."
    )
