from django.urls import path
from .views import ProtocolRiskView

urlpatterns = [
    path("protocol/<int:protocol_id>/", ProtocolRiskView.as_view()),
]