"""
API Views for the Shipay fintech application.

This module contains all REST API endpoints for user authentication, wallet operations,
and transaction management with comprehensive security measures and validation.
"""

from django.shortcuts import render
from django.contrib.auth.models import User
from django.db import transaction
from django.utils import timezone
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from axes.decorators import axes_dispatch
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, permissions, status
from rest_framework.response import Response
import django_filters
from decimal import Decimal

from .models import Wallet, Transaction
from .serializers import (
    MyTokenObtainPairSerializer, UserSerializer, WalletSerializer, TransactionSerializer,
    DepositSerializer, WithdrawSerializer, TransferSerializer
)

def axes_lockout_response(request, credentials, *args, **kwargs):
    """
    Custom response handler for Django Axes lockout events.
    
    This function is called when a user account is locked due to
    excessive failed login attempts. It returns a user-friendly
    error message without revealing sensitive information.
    
    Args:
        request: The HTTP request object
        credentials: The login credentials that triggered the lockout
        *args: Additional positional arguments
        **kwargs: Additional keyword arguments
        
    Returns:
        JsonResponse: A 403 Forbidden response with lockout message
    """
    return JsonResponse({
        'detail': 'Your account has been locked due to too many failed login attempts. Please try again later.'
    }, status=403)

class DecoratedTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT token obtain view with Django Axes integration.
    
    This view extends the standard JWT token obtain view to include
    brute force protection through Django Axes middleware.
    """
    serializer_class = MyTokenObtainPairSerializer

    @method_decorator(axes_dispatch)
    def post(self, request, *args, **kwargs):
        """
        Handle POST requests for token authentication.
        
        The axes_dispatch decorator automatically handles rate limiting
        and account lockout based on failed login attempts.
        """
        return super().post(request, *args, **kwargs)

# ==============================================================================
# Authentication Views
# ==============================================================================

class RegisterView(generics.CreateAPIView):
    """
    User registration endpoint.
    
    Allows new users to create accounts with username, email, and password.
    Includes comprehensive validation and automatically creates a wallet
    for the new user through Django signals.
    
    Endpoint: POST /api/auth/register/
    """
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

# ==============================================================================
# Wallet & Transaction Management Views
# ==============================================================================

class WalletView(generics.RetrieveAPIView):
    """
    Wallet information retrieval endpoint.
    
    Returns the authenticated user's wallet details including balance,
    currency, and creation date. Only accessible to authenticated users.
    
    Endpoint: GET /api/wallet/
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WalletSerializer

    def get_object(self):
        """Return the wallet associated with the authenticated user."""
        return self.request.user.wallet

class TransactionFilter(django_filters.FilterSet):
    """
    Advanced filtering for transaction queries.
    
    Provides filtering capabilities for transaction lists including
    date range filtering and transaction type filtering.
    """
    start_date = django_filters.DateFilter(field_name="created_at", lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name="created_at", lookup_expr='lte')

    class Meta:
        model = Transaction
        fields = ['transaction_type', 'start_date', 'end_date']

class TransactionListView(generics.ListAPIView):
    """
    Transaction history endpoint with advanced filtering.
    
    Returns a paginated list of transactions for the authenticated user
    with support for filtering by transaction type and date range.
    
    Endpoint: GET /api/transactions/
    Query Parameters:
        - transaction_type: Filter by type (deposit, withdraw, transfer)
        - start_date: Filter transactions from this date (YYYY-MM-DD)
        - end_date: Filter transactions until this date (YYYY-MM-DD)
        - page: Page number for pagination
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TransactionSerializer
    filterset_class = TransactionFilter 

    def get_queryset(self):
        """Return transactions for the authenticated user's wallet."""
        user_wallet = self.request.user.wallet
        return Transaction.objects.filter(wallet=user_wallet).order_by('-created_at')

# ==============================================================================
# Financial Transaction Views
# ==============================================================================

class DepositView(generics.GenericAPIView):
    """
    Deposit funds into user's wallet.
    
    Allows authenticated users to add funds to their wallet with
    comprehensive validation and atomic database operations.
    
    Endpoint: POST /api/deposit/
    Request Body:
        - amount: Decimal amount to deposit (must be positive)
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DepositSerializer

    def post(self, request, *args, **kwargs):
        """
        Process deposit transaction.
        
        Validates the deposit amount and updates the user's wallet
        balance atomically to ensure data consistency.
        """
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        amount = serializer.validated_data['amount']
        wallet = request.user.wallet
        
        # Use atomic transaction to ensure data consistency
        with transaction.atomic():
            wallet.balance += amount
            wallet.save()
            Transaction.objects.create(
                wallet=wallet, 
                transaction_type='deposit', 
                amount=amount, 
                status='completed'
            )
        return Response(WalletSerializer(wallet).data, status=status.HTTP_200_OK)

class WithdrawView(generics.GenericAPIView):
    """
    Withdraw funds from user's wallet.
    
    Allows authenticated users to withdraw funds from their wallet with
    comprehensive validation and atomic database operations to ensure
    data consistency and prevent insufficient balance withdrawals.
    
    Endpoint: POST /api/wallet/withdraw/
    Request Body:
        - amount: Decimal amount to withdraw (must be positive and not exceed balance)
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WithdrawSerializer

    def post(self, request, *args, **kwargs):
        """
        Process withdrawal transaction.
        
        Validates the withdrawal amount against available balance and updates
        the user's wallet balance atomically to ensure data consistency.
        """
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        amount = serializer.validated_data['amount']
        wallet = request.user.wallet
        
        if wallet.balance < amount:
            return Response({"error": "Insufficient funds."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            wallet.balance -= amount
            wallet.save()
            Transaction.objects.create(
                wallet=wallet, transaction_type='withdraw', amount=amount, status='completed'
            )
        return Response(WalletSerializer(wallet).data, status=status.HTTP_200_OK)

class TransferView(generics.GenericAPIView):
    """
    Transfer funds between user wallets.
    
    Allows authenticated users to transfer funds to other users with
    comprehensive validation including recipient verification, balance
    checking, and self-transfer prevention.
    
    Endpoint: POST /api/wallet/transfer/
    Request Body:
        - recipient_username: Username of the recipient user
        - amount: Decimal amount to transfer (must be positive and not exceed balance)
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TransferSerializer

    def post(self, request, *args, **kwargs):
        """
        Process transfer transaction between users.
        
        Validates recipient existence, prevents self-transfers, checks
        sufficient balance, and performs atomic transfer operations
        to ensure data consistency across both wallets.
        """
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        recipient_username = serializer.validated_data['recipient_username']
        amount = serializer.validated_data['amount']
        
        if request.user.username == recipient_username:
            return Response({"error": "You cannot transfer money to yourself."}, status=status.HTTP_400_BAD_REQUEST)

        sender_wallet = request.user.wallet
        if sender_wallet.balance < amount:
            return Response({"error": "Insufficient funds."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            recipient = User.objects.get(username=recipient_username)
            recipient_wallet = recipient.wallet
        except User.DoesNotExist:
            return Response({"error": "Recipient user not found."}, status=status.HTTP_404_NOT_FOUND)

        with transaction.atomic():
            # Deduct from sender
            sender_wallet.balance -= amount
            sender_wallet.save()
            Transaction.objects.create(
                wallet=sender_wallet, transaction_type='transfer', amount=amount * -1, 
                counterparty=recipient_username, status='completed'
            )

            # Add to recipient
            recipient_wallet.balance += amount
            recipient_wallet.save()
            Transaction.objects.create(
                wallet=recipient_wallet, transaction_type='transfer', amount=amount, 
                counterparty=request.user.username, status='completed'
            )
        return Response({"success": f"Successfully transferred {amount} to {recipient_username}."}, status=status.HTTP_200_OK)

class RevealBalanceView(generics.GenericAPIView):
    """
    Premium balance reveal feature with usage limits and fees.
    
    Allows users to reveal their wallet balance with a freemium model:
    - First 3 reveals per day are free
    - Additional reveals cost 10 EGP each
    - Usage resets daily at midnight
    
    Endpoint: POST /api/wallet/reveal-balance/
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Process balance reveal request with fee calculation.
        
        Tracks daily usage, applies fees for premium reveals, and returns
        current balance along with remaining free reveals for the day.
        """
        wallet = request.user.wallet
        today = timezone.now().date()
        fee = Decimal('10.00')
        free_reveals_left = 3 - wallet.balance_reveal_count

        with transaction.atomic():
            # Reset daily counter if it's a new day
            if wallet.last_balance_reveal != today:
                wallet.balance_reveal_count = 0
                free_reveals_left = 3

            # Increment reveal count
            wallet.balance_reveal_count += 1
            wallet.last_balance_reveal = today

            # Apply fee for premium reveals (beyond 3 free per day)
            fee_deducted = False
            if wallet.balance_reveal_count > 3:
                if wallet.balance < fee:
                    return Response({"error": "Insufficient balance for reveal (10 EGP required)."}, status=status.HTTP_400_BAD_REQUEST)
                wallet.balance -= fee
                fee_deducted = True
                Transaction.objects.create(
                    wallet=wallet,
                    transaction_type='withdraw',
                    amount=-fee,
                    counterparty='Balance Reveal',
                    status='completed'
                )

            wallet.save()

        free_reveals_left = max(0, 3 - wallet.balance_reveal_count)
        return Response({
            'balance': wallet.balance,
            'free_reveals_left': free_reveals_left,
            'fee_deducted': fee_deducted
        }, status=status.HTTP_200_OK)