from django.urls import path
from .views import NonceView, VerifySignatureView

urlpatterns = [
    path("nonce/", NonceView.as_view()),
    path("verify/", VerifySignatureView.as_view()),
]
