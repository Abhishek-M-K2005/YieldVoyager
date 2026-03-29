from django.urls import path
from .views import PortfolioView, ProtocolListView, MarketSnapshotView

urlpatterns = [
    path("protocols/", ProtocolListView.as_view()),
    path("portfolio/", PortfolioView.as_view()),
    path("vaults/", MarketSnapshotView.as_view()),
]
