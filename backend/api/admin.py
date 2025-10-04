"""
Django admin configuration for the Shipay fintech application.

This module configures the Django admin interface for managing wallets,
transactions, and other application data with appropriate display options
and search capabilities.
"""

from django.contrib import admin
from .models import Wallet, Transaction

class WalletAdmin(admin.ModelAdmin):
    """
    Admin configuration for Wallet model.
    
    Provides list display, search functionality, and filtering options
    for wallet management in the Django admin interface.
    """
    list_display = ('user', 'balance', 'currency', 'created_at')
    search_fields = ('user__username',)

class TransactionAdmin(admin.ModelAdmin):
    """
    Admin configuration for Transaction model.
    
    Provides comprehensive list display, filtering, and search options
    for transaction management in the Django admin interface.
    """
    list_display = ('wallet', 'transaction_type', 'amount', 'status', 'created_at')
    list_filter = ('transaction_type', 'status', 'created_at')
    search_fields = ('wallet__user__username',)

# Register models with admin interface
admin.site.register(Wallet, WalletAdmin)
admin.site.register(Transaction, TransactionAdmin)

# Note: AccessAttempt and AccessLog models are automatically registered by django-axes
