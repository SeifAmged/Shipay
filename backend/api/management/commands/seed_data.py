import random
from datetime import datetime, timedelta
from decimal import Decimal
from django.utils import timezone
from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth.models import User
from django.db.models.signals import post_save

from api.models import Wallet, Transaction
from api.signals import create_wallet_and_give_bonus


class Command(BaseCommand):
    help = 'Seeds the database with 20 realistic users, 100 transactions each, and a bonus bot.'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('🚀 Starting large database seeding process...'))

        # 1️⃣ Temporarily disable the wallet creation signal
        post_save.disconnect(create_wallet_and_give_bonus, sender=User)
        self.stdout.write('🔌 Welcome bonus signal DISCONNECTED for seeding.')

        with transaction.atomic():
            # 2️⃣ Clean existing non-superusers
            User.objects.filter(is_superuser=False).delete()

            # 3️⃣ Create the bonus bot
            self.stdout.write('🤖 Creating the bonus bot user...')
            bonus_bot, created = User.objects.get_or_create(username='shipay_bonus_bot')
            if created:
                bonus_bot.set_password('2468')
                bonus_bot.save()

            bot_wallet, _ = Wallet.objects.get_or_create(user=bonus_bot)
            bot_wallet.balance = Decimal('9999999999.99')
            bot_wallet.save()
            self.stdout.write('✅ Bonus bot is ready with full balance.')

            # 4️⃣ Generate random users
            first_names = [
                'Ahmed', 'Mohamed', 'Mahmoud', 'Ali', 'Khaled', 'Youssef', 'Omar', 'Amr',
                'Tarek', 'Mostafa', 'Hassan', 'Hussein', 'Ibrahim', 'Karim', 'Mazen',
                'Fatma', 'Aya', 'Mariam', 'Sara', 'Hana'
            ]
            last_names = [
                'El-Sayed', 'Hassan', 'Ali', 'Mansour', 'Ibrahim', 'Fahmy', 'Shalaby',
                'Abdel-Rahman', 'Ghanem', 'El-Masry', 'Kamel', 'Salama', 'Diab',
                'Ramadan', 'El-Sharkawy', 'Nassar', 'Hamdy', 'Tawfik', 'Fawzy', 'Aziz'
            ]

            self.stdout.write('👥 Creating 20 random users...')
            users = []
            for i in range(20):
                user = User.objects.create_user(
                    username=f'{random.choice(first_names).lower()}{i+1}',
                    password='qwe',
                    email=f'user{i+1}@test.com',
                    first_name=random.choice(first_names),
                    last_name=random.choice(last_names),
                )
                wallet = Wallet.objects.create(user=user)
                wallet.balance = Decimal(str(round(random.uniform(2000, 10000), 2)))
                wallet.save()
                users.append(user)

            self.stdout.write(f'✅ {len(users)} users created and funded.')

            # 5️⃣ Generate realistic transactions
            self.stdout.write('💸 Creating 100 transactions for each user...')
            start_date = timezone.make_aware(datetime(2024, 1, 1))
            end_date = timezone.now()

            for user in users:
                wallet = user.wallet
                balance = wallet.balance

                for _ in range(100):
                    created_at = start_date + timedelta(seconds=random.randint(0, int((end_date - start_date).total_seconds())))
                    txn_type = random.choice(['deposit', 'withdraw', 'transfer'])
                    amount = Decimal(str(round(random.uniform(10, 500), 2)))
                    counterparty = None

                    if txn_type == 'withdraw':
                        if balance >= amount:
                            balance -= amount
                            Transaction.objects.create(
                                wallet=wallet,
                                transaction_type='withdraw',
                                amount=-amount,
                                status='completed',
                                created_at=created_at,
                            )
                    elif txn_type == 'transfer':
                        recipient = random.choice([u for u in users if u != user])
                        if balance >= amount:
                            balance -= amount
                            Transaction.objects.create(
                                wallet=wallet,
                                transaction_type='transfer',
                                amount=-amount,
                                status='completed',
                                created_at=created_at,
                                counterparty=recipient.username,
                            )
                    else:  # deposit
                        balance += amount
                        Transaction.objects.create(
                            wallet=wallet,
                            transaction_type='deposit',
                            amount=amount,
                            status='completed',
                            created_at=created_at,
                        )

                wallet.balance = balance
                wallet.save()

            self.stdout.write(f'✅ {len(users) * 100} total transactions created successfully.')

        # 6️⃣ Reconnect the signal
        post_save.connect(create_wallet_and_give_bonus, sender=User)
        self.stdout.write('🔁 Welcome bonus signal RECONNECTED for live usage.')

        self.stdout.write(self.style.SUCCESS('🎉 Database seeding complete!')) 
