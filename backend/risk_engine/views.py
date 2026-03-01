from rest_framework.views import APIView
from rest_framework.response import Response
from defi.models import Protocol
from rest_framework import status
from .services.scoring import  compute_and_store_risk
from django.shortcuts import get_object_or_404

class ProtocolRiskView(APIView):
    def post(self, request, protocol_id):
        protocol = get_object_or_404(Protocol, id=protocol_id)
        
        protocol_metrics = request.data
        
        required_fields = [
            "tvl_change_24h",
            "tvl_change_7d",
            "liquidity_depth",
            "utilization_ratio",
            "oracle_price_std",
            "liquidation_spike_ratio",
            "protocol_age_days",
            "audit_count",
        ]
        for field in required_fields:
            if field not in protocol_metrics:
                return Response(
                    {"error": f"Missing field: {field}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        result = compute_and_store_risk(protocol, protocol_metrics)
        
        return Response({
            "protocol": protocol.name,
            **result
        })
        
        