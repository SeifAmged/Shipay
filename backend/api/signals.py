from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db import transaction
from .models import Wallet, Transaction
from decimal import Decimal

@receiver(post_save, sender=User)
def create_wallet_and_give_bonus(sender, instance, created, **kwargs):
    if created and not instance.is_superuser:
        # The signal now only creates the wallet. The default value is handled by the model.
        Wallet.objects.create(user=instance)

        # The rest of the bonus logic will now work correctly
        try:
            with transaction.atomic():
                bonus_bot_user = User.objects.get(username='shipay_bonus_bot')
                bonus_bot_wallet = bonus_bot_user.wallet
                bonus_amount = Decimal('1000.00')

                if bonus_bot_wallet.balance >= bonus_amount:
                    bonus_bot_wallet.balance -= bonus_amount
                    new_user_wallet = instance.wallet # Get the newly created wallet
                    new_user_wallet.balance += bonus_amount
                    bonus_bot_wallet.save()
                    new_user_wallet.save()

                    Transaction.objects.create(
                        wallet=new_user_wallet, transaction_type='transfer',
                        amount=bonus_amount, counterparty=bonus_bot_user.username, status='completed'
                    )
                    Transaction.objects.create(
                        wallet=bonus_bot_wallet, transaction_type='transfer',
                        amount=-bonus_amount, counterparty=instance.username, status='completed'
                    )
        except Exception as e:
            print(f"WARNING: Could not process welcome bonus for user {instance.username}. Reason: {e}")
            pass