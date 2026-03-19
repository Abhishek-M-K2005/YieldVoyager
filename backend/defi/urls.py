from django.urls import path
from .views import PortfolioView, ProtocolListView

urlpatterns = [
    path("protocols/", ProtocolListView.as_view()),
    path("portfolio/", PortfolioView.as_view()),
]
