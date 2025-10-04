"""
Serializers for the Shipay fintech application.

This module contains all Django REST Framework serializers for data validation,
serialization, and deserialization of API requests and responses.
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Wallet, Transaction
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT authentication serializer with Django Axes integration.
    
    Extends the standard JWT serializer to handle account lockout scenarios
    and provide consistent error messages for authentication failures.
    """
    def validate(self, attrs):
        """
        Validate authentication credentials with lockout protection.
        
        Checks for account lockout status and provides appropriate error
        messages for both locked accounts and invalid credentials.
        """
        request = self.context.get('request')
        # Check if account is locked due to failed login attempts
        if request and getattr(request, 'axes_is_locked_out', False):
            raise serializers.ValidationError(
                {"detail": "Your account has been locked due to too many failed login attempts. Please try again later."}
            )

        try:
            data = super().validate(attrs)
        except AuthenticationFailed:
            # Invalid username/password combination
            raise serializers.ValidationError({"detail": "No active account found with the given credentials."})

        return data

    @classmethod
    def get_token(cls, user):
        """
        Generate JWT token with additional user information.
        
        Adds username to the token payload for easy identification
        in subsequent API requests.
        """
        token = super().get_token(user)
        token['username'] = user.username
        return token


class UserSerializer(serializers.ModelSerializer):
    """
    User registration and profile serializer.
    
    Handles user account creation with comprehensive validation including
    username format checking, email uniqueness, and password requirements.
    """
    password = serializers.CharField(write_only=True, min_length=6)
    email = serializers.EmailField(required=True)
    username = serializers.CharField(min_length=3, max_length=150)
    first_name = serializers.CharField(required=True, max_length=150)
    last_name = serializers.CharField(required=True, max_length=150)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')

    def validate_username(self, value):
        """
        Validate username format and uniqueness.
        
        Ensures username contains only alphanumeric characters, underscores,
        and hyphens, and is not already taken by another user.
        """
        if not value.replace('_', '').replace('-', '').isalnum():
            raise serializers.ValidationError("Username can only contain letters, numbers, underscores, and hyphens.")
        return value

    def validate_email(self, value):
        """
        Validate email uniqueness.
        
        Ensures the email address is not already registered to another user.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate(self, attrs):
        """
        Cross-field validation for user registration.
        
        Performs additional validation checks that require multiple fields.
        """
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "A user with this username already exists."})
        return attrs

    def create(self, validated_data):
        """
        Create a new user account with hashed password.
        
        Creates a new user instance with properly hashed password and
        all required profile information.
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class WalletSerializer(serializers.ModelSerializer):
    """
    Wallet information serializer for API responses.
    
    Serializes wallet data including user information, balance, currency,
    and creation timestamp for display in API responses.
    """
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Wallet
        fields = ('id', 'user', 'username', 'balance', 'currency', 'created_at')
        read_only_fields = ('user', 'username')


class TransactionSerializer(serializers.ModelSerializer):
    """
    Transaction history serializer for API responses.
    
    Serializes complete transaction data including type, amount, status,
    counterparty information, and timestamps.
    """
    class Meta:
        model = Transaction
        fields = '__all__'


class DepositSerializer(serializers.Serializer):
    """
    Deposit transaction validation serializer.
    
    Validates deposit amounts with business rules including minimum
    amount requirements and maximum transaction limits.
    """
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0.01)

    def validate_amount(self, value):
        """
        Validate deposit amount against business rules.
        
        Ensures amount is positive and within maximum transaction limits.
        """
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0.")
        if value > 1000000:  # 1 million EGP limit
            raise serializers.ValidationError("Amount cannot exceed 1,000,000 EGP.")
        return value


class WithdrawSerializer(serializers.Serializer):
    """
    Withdrawal transaction validation serializer.
    
    Validates withdrawal amounts with business rules including minimum
    amount requirements and maximum transaction limits.
    """
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0.01)

    def validate_amount(self, value):
        """
        Validate withdrawal amount against business rules.
        
        Ensures amount is positive and within maximum transaction limits.
        """
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0.")
        if value > 1000000:  # 1 million EGP limit
            raise serializers.ValidationError("Amount cannot exceed 1,000,000 EGP.")
        return value


class TransferSerializer(serializers.Serializer):
    """
    Transfer transaction validation serializer.
    
    Validates transfer requests including recipient username format
    and transfer amount against business rules.
    """
    recipient_username = serializers.CharField(max_length=150)
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0.01)

    def validate_recipient_username(self, value):
        """
        Validate recipient username format.
        
        Ensures recipient username follows the same format rules as
        regular usernames (alphanumeric, underscores, hyphens only).
        """
        if not value.replace('_', '').replace('-', '').isalnum():
            raise serializers.ValidationError("Recipient username can only contain letters, numbers, underscores, and hyphens.")
        return value

    def validate_amount(self, value):
        """
        Validate transfer amount against business rules.
        
        Ensures amount is positive and within maximum transaction limits.
        """
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0.")
        if value > 1000000:  # 1 million EGP limit
            raise serializers.ValidationError("Amount cannot exceed 1,000,000 EGP.")
        return value
