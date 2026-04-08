from rest_framework.views import APIView
from rest_framework.response import Response
from defi.models import Protocol, Vault
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
import math

from .services.scoring import compute_and_store_risk
from .services.llm import generate_risk_explanation, generate_best_protocol_explanation
from .services.vector_db import get_protocol_metadata, get_similar_contexts


def _clamp_score(value):
    return max(0, min(100, int(round(value))))

class ProtocolRiskView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, protocol_id):
        protocol = get_object_or_404(Protocol, id=protocol_id)
        
        # Directly fetch features from ChromaDB for real-time inference
        metadata = get_protocol_metadata(protocol.name)
        
        # Fallback values
        vault = Vault.objects.filter(protocol=protocol).first()
        tvl_val = vault.tvl if vault else 5000000
        
        features = {
            "tvl_change_24h": metadata.get("tvl_change_24h", 0.0), 
            "tvl_change_7d": metadata.get("tvl_change_7d", 0.0),
            "tvl_change_3d": metadata.get("tvl_change_3d", 0.0),
            "tvl_momentum": metadata.get("tvl_momentum", 0.0),
            "log_liquidity_depth": metadata.get("log_liquidity_depth", math.log(tvl_val) if tvl_val > 0 else 0),
            "vol_ratio": metadata.get("vol_ratio", 1.1),
            "utilisation_ratio": metadata.get("utilisation_ratio", 0.65),
            "oracle_price_std": metadata.get("oracle_price_std", 0.02),
            "liquidation_spike_ratio": metadata.get("liquidation_spike_ratio", 0.1),
            "audit_count": metadata.get("audit_count", 1),
            "protocol_age_days": metadata.get("protocol_age_days", 365)
        }

        # Build radar-chart factors from live model inputs so frontend can render dynamic values.
        audit_count = float(features.get("audit_count", 0) or 0)
        log_liquidity = float(features.get("log_liquidity_depth", 0) or 0)
        util_ratio = float(features.get("utilisation_ratio", 0) or 0)
        tvl_24h = abs(float(features.get("tvl_change_24h", 0) or 0))
        tvl_7d = abs(float(features.get("tvl_change_7d", 0) or 0))
        oracle_std = float(features.get("oracle_price_std", 0) or 0)
        liq_spike = float(features.get("liquidation_spike_ratio", 0) or 0)

        risk_factors = [
            {
                "subject": "Smart Contract",
                "A": _clamp_score(55 + (audit_count * 8) - (liq_spike * 20)),
                "fullMark": 100,
            },
            {
                "subject": "Liquidity",
                "A": _clamp_score(30 + (log_liquidity * 5)),
                "fullMark": 100,
            },
            {
                "subject": "Centralization",
                "A": _clamp_score(100 - (util_ratio * 100)),
                "fullMark": 100,
            },
            {
                "subject": "Volatility",
                "A": _clamp_score(100 - ((tvl_24h * 120) + (tvl_7d * 60) + (oracle_std * 500))),
                "fullMark": 100,
            },
            {
                "subject": "Audit",
                "A": _clamp_score(audit_count * 20),
                "fullMark": 100,
            },
        ]
        
        # LIVE REAL-TIME INFERENCE
        result = compute_and_store_risk(protocol, features)
        
        # User details for LLM
        user_wallet = request.data.get("wallet_address", "Unknown Wallet")
        user_balance = request.data.get("wallet_balance", "Unknown")
        user_risk_tolerance = request.data.get("risk_tolerance", "medium")
        user_investment_goal = request.data.get("investment_goal", "Unknown")

        chromadb_context_docs = get_similar_contexts(protocol.name, n_results=3)
        chromadb_context = "\\n".join(chromadb_context_docs) if chromadb_context_docs else "No historical context available."
        
        # Generate Explanation
        explanation = generate_risk_explanation(
            model_features=features,
            risk_result=result,
            user_wallet_address=user_wallet,
            user_balance=user_balance,
            user_risk_tolerance=user_risk_tolerance,
            user_investment_goal=user_investment_goal,
            chromadb_context=chromadb_context
        )
        
        return Response({
            "protocol": protocol.name,
            **result,
            "risk_factors": risk_factors,
            "llm_explanation": explanation
        }, status=status.HTTP_200_OK)

class BestProtocolView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        user_wallet = request.data.get("wallet_address", "Unknown Wallet")
        user_balance = request.data.get("wallet_balance", "Unknown")
        user_risk_tolerance = request.data.get("risk_tolerance", "medium")
        user_investment_goal = request.data.get("investment_goal", "Unknown")
        
        protocols = Protocol.objects.all()
        protocol_scores = {}
        
        # LIVE REAL-TIME INFERENCE FOR ALL PROTOCOLS
        for p in protocols:
            metadata = get_protocol_metadata(p.name)
            vault = Vault.objects.filter(protocol=p).first()
            tvl_val = vault.tvl if vault else 5000000
            
            features = {
                "tvl_change_24h": metadata.get("tvl_change_24h", 0.0), 
                "tvl_change_7d": metadata.get("tvl_change_7d", 0.0),
                "tvl_change_3d": metadata.get("tvl_change_3d", 0.0),
                "tvl_momentum": metadata.get("tvl_momentum", 0.0),
                "log_liquidity_depth": metadata.get("log_liquidity_depth", math.log(tvl_val) if tvl_val > 0 else 0),
                "vol_ratio": metadata.get("vol_ratio", 1.1),
                "utilisation_ratio": metadata.get("utilisation_ratio", 0.65),
                "oracle_price_std": metadata.get("oracle_price_std", 0.02),
                "liquidation_spike_ratio": metadata.get("liquidation_spike_ratio", 0.1),
                "audit_count": metadata.get("audit_count", 1)
            }
            
            p_result = compute_and_store_risk(p, features)
            
            protocol_scores[p.name] = {
                "score": p_result["risk_score"],
                "level": p_result["level"],
                "individual_model_scores": p_result.get("individual_model_scores", {})
            }
                
        chromadb_context_docs = get_similar_contexts("market overview stable liquidity", n_results=5)
        chromadb_context = "\\n".join(chromadb_context_docs) if chromadb_context_docs else "No historical context available."
        
        explanation = generate_best_protocol_explanation(
            protocol_scores=protocol_scores,
            user_wallet_address=user_wallet,
            user_balance=user_balance,
            user_risk_tolerance=user_risk_tolerance,
            user_investment_goal=user_investment_goal,
            chromadb_context=chromadb_context
        )
        
        best_p = "Unknown"
        best_score = float('inf')
        for name, data in protocol_scores.items():
            if data["score"] < best_score:
                best_score = data["score"]
                best_p = name
                
        return Response({
            "recommended_protocol": best_p,
            "best_score": best_score if best_score != float('inf') else 0,
            "llm_explanation": explanation,
            "all_scores": protocol_scores
        }, status=status.HTTP_200_OK)