# api/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Wallet, Transaction
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT login serializer that:
    - checks request.axes_is_locked_out (set by axes middleware) and returns locked message
    - on AuthenticationFailed returns consistent message
    """
    def validate(self, attrs):
        request = self.context.get('request')
        # If django-axes middleware flagged the request as locked out -> return lock message
        if request and getattr(request, 'axes_is_locked_out', False):
            raise serializers.ValidationError(
                {"detail": "Your account has been locked due to too many failed login attempts. Please try again later."}
            )

        try:
            data = super().validate(attrs)
        except AuthenticationFailed:
            # wrong username/password
            raise serializers.ValidationError({"detail": "No active account found with the given credentials."})

        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    email = serializers.EmailField(required=True)
    username = serializers.CharField(min_length=3, max_length=150)
    first_name = serializers.CharField(required=True, max_length=150)
    last_name = serializers.CharField(required=True, max_length=150)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')

    def validate_username(self, value):
        if not value.replace('_', '').replace('-', '').isalnum():
            raise serializers.ValidationError("Username can only contain letters, numbers, underscores, and hyphens.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate(self, attrs):
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "A user with this username already exists."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class WalletSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Wallet
        fields = ('id', 'user', 'username', 'balance', 'currency', 'created_at')
        read_only_fields = ('user', 'username')


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


class DepositSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0.01)

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0.")
        if value > 1000000:  # 1 million EGP limit
            raise serializers.ValidationError("Amount cannot exceed 1,000,000 EGP.")
        return value


class WithdrawSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0.01)

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0.")
        if value > 1000000:  # 1 million EGP limit
            raise serializers.ValidationError("Amount cannot exceed 1,000,000 EGP.")
        return value


class TransferSerializer(serializers.Serializer):
    recipient_username = serializers.CharField(max_length=150)
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0.01)

    def validate_recipient_username(self, value):
        if not value.replace('_', '').replace('-', '').isalnum():
            raise serializers.ValidationError("Recipient username can only contain letters, numbers, underscores, and hyphens.")
        return value

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0.")
        if value > 1000000:  # 1 million EGP limit
            raise serializers.ValidationError("Amount cannot exceed 1,000,000 EGP.")
        return value
