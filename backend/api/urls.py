from django.urls import path
from .views import (
    RegisterView,
    WalletView,
    TransactionListView,
    DepositView,
    WithdrawView,
    TransferView,
    DecoratedTokenObtainPairView,
    RevealBalanceView  # NEW: Added here to prevent NameError
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', DecoratedTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('wallet/', WalletView.as_view(), name='wallet'),
    path('wallet/deposit/', DepositView.as_view(), name='deposit'),
    path('wallet/withdraw/', WithdrawView.as_view(), name='withdraw'),
    path('wallet/transfer/', TransferView.as_view(), name='transfer'),
    path('wallet/reveal-balance/', RevealBalanceView.as_view(), name='reveal-balance'),  # NEW

    path('transactions/', TransactionListView.as_view(), name='transactions'),
]