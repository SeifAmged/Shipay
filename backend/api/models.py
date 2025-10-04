"""
Database models for the Shipay fintech application.

This module defines the core data models for user wallets and financial transactions,
including balance tracking, transaction history, and balance reveal functionality.
"""

from django.db import models
from django.conf import settings
from django.utils import timezone
from decimal import Decimal


class Wallet(models.Model):
    """
    User wallet model for storing financial account information.
    
    Each user has exactly one wallet that tracks their balance, currency,
    and balance reveal usage statistics for the premium reveal feature.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        help_text="The user who owns this wallet"
    )
    balance = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=Decimal('0.00'),
        help_text="Current wallet balance in the specified currency"
    )
    currency = models.CharField(
        max_length=3, 
        default='EGP',
        help_text="Currency code for this wallet (default: EGP)"
    )
    created_at = models.DateTimeField(
        default=timezone.now,
        help_text="Timestamp when the wallet was created"
    )
    
    # Balance reveal feature tracking
    balance_reveal_count = models.IntegerField(
        default=0,
        help_text="Number of balance reveals performed today"
    )
    last_balance_reveal = models.DateField(
        null=True, 
        blank=True,
        help_text="Date of the last balance reveal (resets daily)"
    )

    def __str__(self):
        """String representation of the wallet."""
        return f"{self.user.username}'s Wallet"


class Transaction(models.Model):
    """
    Financial transaction model for tracking all wallet operations.
    
    Records deposits, withdrawals, and transfers with full audit trail
    including amounts, counterparties, and transaction status.
    """
    TRANSACTION_TYPES = (
        ('deposit', 'Deposit'),
        ('withdraw', 'Withdraw'),
        ('transfer', 'Transfer'),
    )
    STATUS_CHOICES = (
        ('completed', 'Completed'),
        ('pending', 'Pending'),
        ('failed', 'Failed'),
    )
    
    wallet = models.ForeignKey(
        Wallet, 
        on_delete=models.CASCADE, 
        related_name='transactions',
        help_text="The wallet associated with this transaction"
    )
    transaction_type = models.CharField(
        max_length=10, 
        choices=TRANSACTION_TYPES,
        help_text="Type of transaction performed"
    )
    amount = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        help_text="Transaction amount (positive for deposits, negative for withdrawals)"
    )
    counterparty = models.CharField(
        max_length=255, 
        null=True, 
        blank=True,
        help_text="Username of the other party in transfers or special transaction descriptions"
    )
    status = models.CharField(
        max_length=10, 
        choices=STATUS_CHOICES, 
        default='completed',
        help_text="Current status of the transaction"
    )
    created_at = models.DateTimeField(
        default=timezone.now,
        help_text="Timestamp when the transaction was created"
    )

    def __str__(self):
        """String representation of the transaction."""
        return f"{self.transaction_type} of {self.amount} for {self.wallet.user.username}"