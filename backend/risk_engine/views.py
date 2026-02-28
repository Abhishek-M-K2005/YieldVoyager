from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from defi.models import Protocol
from .services.scoring import compute_and_store_risk
from .services.features import get_protocol_features

# Create your views here.
class ProtocolRiskAPIView(APIView):
    def get(self, request, protocol_id):
        protocol = Protocol.objects.get(id=protocol_id)
        
        # Simulate fetching real-time data from pipeline
        protocol_metrics = get_protocol_features(protocol)
        
        result = compute_and_store_risk(protocol, protocol_metrics)
        
        return Response({
            "protocol": protocol.name,
            **result
        })