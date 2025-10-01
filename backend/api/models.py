from django.db import models
from django.conf import settings
from django.utils import timezone
from decimal import Decimal


class Wallet(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    balance = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=Decimal('0.00') # <-- FIX: Set the default as a Decimal
    )
    currency = models.CharField(max_length=3, default='EGP')
    created_at = models.DateTimeField(default=timezone.now)
    
    # --- NEW FIELDS FOR BALANCE REVEAL ---
    balance_reveal_count = models.IntegerField(default=0)  # Number of reveals today
    last_balance_reveal = models.DateField(null=True, blank=True)  # Last reveal date

    def __str__(self):
        return f"{self.user.username}'s Wallet"

class Transaction(models.Model):
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
    
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    counterparty = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='completed')
    # This is the corrected line
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.transaction_type} of {self.amount} for {self.wallet.user.username}"