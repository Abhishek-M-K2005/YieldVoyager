from rest_framework.views import APIView
from rest_framework.response import Response
from defi.models import Protocol
from rest_framework import status
from .services.scoring import  compute_and_store_risk
from django.shortcuts import get_object_or_404

class ProtocolRiskView(APIView):
    def post(self, request, protocol_id):
        protocol = get_object_or_404(Protocol, id=protocol_id)
        
        
        features = {

            "tvl_change_24h": request.data.get("tvl_change_24h"),
            "tvl_change_7d": request.data.get("tvl_change_7d"),
            "liquidity_depth": request.data.get("liquidity_depth"),
            "utilization_ratio": request.data.get("utilization_ratio"),
            "oracle_price_std": request.data.get("oracle_price_std"),
            "liquidation_spike_ratio": request.data.get("liquidation_spike_ratio"),
            "impermanent_loss_risk": request.data.get("impermanent_loss_risk"),
            "protocol_age_days": request.data.get("protocol_age_days")
        }
        
        result = compute_and_store_risk(protocol, features)
        
        return Response({
            "protocol": protocol.name,
            **result
        }, status = status.HTTP_200_OK)
        
        