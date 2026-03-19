from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from auth_web3.models import User as WalletUser
from .models import Position, Protocol


class ProtocolListView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        protocols = Protocol.objects.all()
        data = []
        for p in protocols:
            data.append({
                "id": p.id,
                "name": p.name,
                "chain": p.chain,
                "website": p.website,
                "risk_level": p.risk_level
            })
        return Response(data)


class PortfolioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet_user = WalletUser.objects.get(
            wallet_address=request.user.username.lower()
        )

        positions = Position.objects.filter(user=wallet_user)

        data = []
        for p in positions:
            data.append({
                "protocol": p.vault.protocol.name,
                "chain": p.vault.protocol.chain,
                "asset": p.vault.asset,
                "apy": p.vault.apy,
                "amount": p.amount,
            })

        return Response(data)
