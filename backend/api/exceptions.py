# api/exceptions.py
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import PermissionDenied
from rest_framework.exceptions import AuthenticationFailed, NotAuthenticated

def custom_exception_handler(exc, context):
    """
    Custom DRF exception handler:
    - If the request has axes_is_locked_out (set by django-axes middleware), return 403 lockout message.
    - If PermissionDenied occurs (often axes lockout), return lockout message.
    - If AuthenticationFailed -> return 401 with credentials message.
    - If NotAuthenticated -> return 401 with 'credentials not provided'.
    - Else -> fallback to DRF default response.
    """
    # first run the default handler
    response = exception_handler(exc, context)

    request = context.get('request') if context else None

    # If django-axes middleware flagged the request as locked out
    if request and getattr(request, 'axes_is_locked_out', False):
        return Response(
            {"detail": "Account locked: Too many failed login attempts. Please try again later."},
            status=status.HTTP_403_FORBIDDEN
        )

    # Some versions may raise PermissionDenied for lockouts — treat as lockout
    if isinstance(exc, PermissionDenied):
        return Response(
            {"detail": "Account locked: Too many failed login attempts. Please try again later."},
            status=status.HTTP_403_FORBIDDEN
        )

    # Wrong credentials -> 401
    if isinstance(exc, AuthenticationFailed):
        return Response(
            {"detail": "No active account found with the given credentials."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if isinstance(exc, NotAuthenticated):
        return Response(
            {"detail": "Authentication credentials were not provided."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # fallback to whatever DRF returned (might be None)
    return response
