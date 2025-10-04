"""
Custom exception handlers for the Shipay fintech application.

This module provides custom exception handling for Django REST Framework
to provide consistent error responses and integrate with Django Axes
security middleware.
"""

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import PermissionDenied
from rest_framework.exceptions import AuthenticationFailed, NotAuthenticated

def custom_exception_handler(exc, context):
    """
    Custom DRF exception handler with Django Axes integration.
    
    Provides consistent error responses for various authentication and
    authorization scenarios including account lockouts and credential issues.
    
    Args:
        exc: The exception that was raised
        context: Dictionary containing request context information
        
    Returns:
        Response: Custom error response or fallback to default DRF response
    """
    # Run the default DRF exception handler first
    response = exception_handler(exc, context)

    request = context.get('request') if context else None

    # Handle account lockout from Django Axes
    if request and getattr(request, 'axes_is_locked_out', False):
        return Response(
            {"detail": "Account locked: Too many failed login attempts. Please try again later."},
            status=status.HTTP_403_FORBIDDEN
        )

    # Handle PermissionDenied exceptions (often from Axes lockouts)
    if isinstance(exc, PermissionDenied):
        return Response(
            {"detail": "Account locked: Too many failed login attempts. Please try again later."},
            status=status.HTTP_403_FORBIDDEN
        )

    # Handle authentication failures
    if isinstance(exc, AuthenticationFailed):
        return Response(
            {"detail": "No active account found with the given credentials."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Handle missing authentication credentials
    if isinstance(exc, NotAuthenticated):
        return Response(
            {"detail": "Authentication credentials were not provided."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Return default DRF response for other exceptions
    return response
