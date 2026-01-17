from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from auth_web3.models import User as WalletUser
from .models import Position


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
