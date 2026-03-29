from django.urls import path
from .views import ProtocolRiskView, BestProtocolView

urlpatterns = [
    path("protocol/<int:protocol_id>/", ProtocolRiskView.as_view()),
    path("best_protocol/", BestProtocolView.as_view()),
]