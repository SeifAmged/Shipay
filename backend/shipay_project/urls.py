"""
Main URL configuration for the Shipay fintech project.

This module defines the root URL patterns for the entire Django project,
including admin interface and API endpoints.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Django admin interface
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include('api.urls')), 
]
