from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from eth_account.messages import encode_defunct
from eth_account import Account
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .auth import generate_nonce

# Create your views here.
class NonceView(APIView):
    def post(self, request):
        address = request.data['address'].lower()
        user, _ = User.objects.get_or_create(wallet_address=address)
        user.nonce = generate_nonce()
        user.save()
        return Response({"nonce": user.nonce})


class VerifySignatureView(APIView):
    def post(self, request):
        address = request.data['address'].lower()
        signature = request.data['signature']

        user = User.objects.get(wallet_address=address)
        message = encode_defunct(text=user.nonce)
        recovered = Account.recover_message(message, signature=signature)

        if recovered.lower() != address:
            return Response({"error": "Invalid signature"}, status=401)

        refresh = RefreshToken.for_user(user)

        user.nonce = generate_nonce()  # invalidate old nonce
        user.save()

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        })
