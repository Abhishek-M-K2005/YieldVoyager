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

from rest_framework.permissions import IsAuthenticated

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet_address = request.user.username
        try:
            user = WalletUser.objects.get(wallet_address=wallet_address)
            data = {
                "wallet_address": user.wallet_address,
                "username": user.username,
                "email": user.email,
                "risk_tolerance": user.risk_tolerance,
                "investment_goal": user.investment_goal,
                "created_at": user.created_at
            }
            return Response(data)
        except WalletUser.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)

    def put(self, request):
        wallet_address = request.user.username
        try:
            user = WalletUser.objects.get(wallet_address=wallet_address)
            user.username = request.data.get("username", user.username)
            user.email = request.data.get("email", user.email)
            user.risk_tolerance = request.data.get("risk_tolerance", user.risk_tolerance)
            user.investment_goal = request.data.get("investment_goal", user.investment_goal)
            user.save()
            return Response({"message": "Profile updated successfully"})
        except WalletUser.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)
