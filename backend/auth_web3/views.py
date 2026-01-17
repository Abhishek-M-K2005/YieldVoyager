from django.contrib.auth.models import User as DjangoUser
from rest_framework.views import APIView
from rest_framework.response import Response
from eth_account.messages import encode_defunct
from eth_account import Account
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User as WalletUser
from .auth import generate_nonce


class NonceView(APIView):
    def post(self, request):
        address = request.data["address"].lower()

        wallet_user, _ = WalletUser.objects.get_or_create(
            wallet_address=address
        )

        wallet_user.nonce = generate_nonce()
        wallet_user.save()

        return Response({"nonce": wallet_user.nonce})


class VerifySignatureView(APIView):
    def post(self, request):
        address = request.data["address"].lower()
        signature = request.data["signature"]

        wallet_user = WalletUser.objects.get(wallet_address=address)

        message = encode_defunct(text=wallet_user.nonce)
        recovered = Account.recover_message(message, signature=signature)

        if recovered.lower() != address:
            return Response({"error": "Invalid signature"}, status=401)

        #  CRITICAL FIX: link wallet → Django auth user
        django_user, _ = DjangoUser.objects.get_or_create(
            username=address
        )

        refresh = RefreshToken.for_user(django_user)

        # rotate nonce
        wallet_user.nonce = generate_nonce()
        wallet_user.save()

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })
