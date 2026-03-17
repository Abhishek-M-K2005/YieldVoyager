import chromadb
import uuid
import os
import logging

logger = logging.getLogger(__name__)

# Initialize ChromaDB client pointing to local storage
CHROMA_PERSIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "chroma_db")
try:
    client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)
    collection = client.get_or_create_collection(name="protocol_risk_contexts")
except Exception as e:
    logger.error(f"Failed to initialize ChromaDB: {e}")
    collection = None

def store_protocol_context(protocol_name, features, risk_score, risk_level):
    """
    Embeds protocol metadata and risk score into ChromaDB for later retrieval by the LLM.
    """
    if collection is None:
        return
        
    try:
        # Create a text representation of the protocol's state
        document_text = (
            f"Protocol: {protocol_name}. "
            f"Risk Level: {risk_level} (Score {risk_score}/10). "
            f"TVL Change 24h: {features.get('tvl_change_24h')}. "
            f"TVL Change 7d: {features.get('tvl_change_7d')}. "
            f"Liquidity Depth: ${features.get('liquidity_depth')}. "
            f"Age: {features.get('protocol_age_days')} days."
        )
        
        # We use protocol_name as ID to easily upsert/update the latest context
        doc_id = f"context_{protocol_name.lower().replace(' ', '_')}"
        
        collection.upsert(
            documents=[document_text],
            metadatas=[{"protocol": protocol_name, "risk_score": risk_score, "level": risk_level}],
            ids=[doc_id]
        )
        logger.info(f"Stored Vector DB context for {protocol_name}")
    except Exception as e:
        logger.error(f"Failed to store context in ChromaDB: {e}")

def get_similar_contexts(query_text, n_results=2):
    """
    Retrieves similar contextual documents from ChromaDB.
    """
    if collection is None:
        return []
        
    try:
        results = collection.query(
            query_texts=[query_text],
            n_results=n_results
        )
        if results and results['documents'] and len(results['documents']) > 0:
            return results['documents'][0]
        return []
    except Exception as e:
        logger.error(f"Failed to query ChromaDB: {e}")
        return []
