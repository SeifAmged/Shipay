# api/admin.py
from django.contrib import admin
from .models import Wallet, Transaction

class WalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance', 'currency', 'created_at')
    search_fields = ('user__username',)

class TransactionAdmin(admin.ModelAdmin):
    list_display = ('wallet', 'transaction_type', 'amount', 'status', 'created_at')
    list_filter = ('transaction_type', 'status', 'created_at')
    search_fields = ('wallet__user__username',)

admin.site.register(Wallet, WalletAdmin)
admin.site.register(Transaction, TransactionAdmin)

# !!! Do not register AccessAttempt or AccessLog here — axes registers them automatically !!!
