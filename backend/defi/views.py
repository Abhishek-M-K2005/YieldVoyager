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

class MarketSnapshotView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        from .models import Vault, Protocol
        vaults = Vault.objects.all()
        protocols = Protocol.objects.all()

        global_tvl = sum(v.tvl for v in vaults) if vaults.exists() else 0
        active_protocols = protocols.count()
        chains = set(p.chain for p in protocols)
        active_chains = len(chains)

        vaults_data = []
        for v in vaults:
            tvl_num = v.tvl
            if tvl_num >= 1e9:
                tvl_str = f"{(tvl_num / 1e9):.1f}B"
            elif tvl_num >= 1e6:
                tvl_str = f"{(tvl_num / 1e6):.1f}M"
            else:
                tvl_str = f"${tvl_num:,.0f}"

            vaults_data.append({
                "protocol": v.protocol.name,
                "asset": v.asset,
                "apy": v.apy,
                "tvl": tvl_str,
                "risk_level": getattr(v.protocol, 'risk_level', 'Medium')
            })
            
        return Response({
            "globals": {
                "total_tvl": global_tvl,
                "active_protocols": active_protocols,
                "active_chains": active_chains
            },
            "vaults": vaults_data
        })
