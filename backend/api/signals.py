"""
Django signals for the Shipay fintech application.

This module contains signal handlers that automatically create wallets
for new users and process welcome bonuses through the bonus bot system.
"""

from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db import transaction
from .models import Wallet, Transaction
from decimal import Decimal

@receiver(post_save, sender=User)
def create_wallet_and_give_bonus(sender, instance, created, **kwargs):
    """
    Signal handler for new user creation.
    
    Automatically creates a wallet for new users and processes a welcome
    bonus of 1000 EGP from the system bonus bot if available.
    
    Args:
        sender: The User model class
        instance: The User instance being saved
        created: Boolean indicating if this is a new user
        **kwargs: Additional keyword arguments
    """
    if created and not instance.is_superuser:
        # Create wallet for new user
        Wallet.objects.create(user=instance)

        # Process welcome bonus from bonus bot
        try:
            with transaction.atomic():
                bonus_bot_user = User.objects.get(username='shipay_bonus_bot')
                bonus_bot_wallet = bonus_bot_user.wallet
                bonus_amount = Decimal('1000.00')

                # Check if bonus bot has sufficient funds
                if bonus_bot_wallet.balance >= bonus_amount:
                    # Transfer bonus from bot to new user
                    bonus_bot_wallet.balance -= bonus_amount
                    new_user_wallet = instance.wallet
                    new_user_wallet.balance += bonus_amount
                    bonus_bot_wallet.save()
                    new_user_wallet.save()

                    # Create transaction records for audit trail
                    Transaction.objects.create(
                        wallet=new_user_wallet, 
                        transaction_type='transfer',
                        amount=bonus_amount, 
                        counterparty=bonus_bot_user.username, 
                        status='completed'
                    )
                    Transaction.objects.create(
                        wallet=bonus_bot_wallet, 
                        transaction_type='transfer',
                        amount=-bonus_amount, 
                        counterparty=instance.username, 
                        status='completed'
                    )
        except Exception as e:
            # Log warning but don't fail user creation if bonus fails
            print(f"WARNING: Could not process welcome bonus for user {instance.username}. Reason: {e}")
            pass