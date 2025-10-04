"""
URL configuration for the Shipay API application.

This module defines all API endpoints for user authentication, wallet operations,
and transaction management with proper URL routing and naming conventions.
"""

from django.urls import path
from .views import (
    RegisterView,
    WalletView,
    TransactionListView,
    DepositView,
    WithdrawView,
    TransferView,
    DecoratedTokenObtainPairView,
    RevealBalanceView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', DecoratedTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Wallet management endpoints
    path('wallet/', WalletView.as_view(), name='wallet'),
    path('wallet/deposit/', DepositView.as_view(), name='deposit'),
    path('wallet/withdraw/', WithdrawView.as_view(), name='withdraw'),
    path('wallet/transfer/', TransferView.as_view(), name='transfer'),
    path('wallet/reveal-balance/', RevealBalanceView.as_view(), name='reveal-balance'),

    # Transaction history endpoint
    path('transactions/', TransactionListView.as_view(), name='transactions'),
]