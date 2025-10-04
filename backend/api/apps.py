"""
Django app configuration for the Shipay API application.

This module configures the API app and ensures that signal handlers
are properly registered when the application starts.
"""

from django.apps import AppConfig

class ApiConfig(AppConfig):
    """
    Configuration class for the Shipay API application.
    
    Handles app initialization and ensures that signal handlers
    are properly connected when Django starts up.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        """
        Initialize the app and import signal handlers.
        
        This method is called when Django starts up and ensures that
        all signal handlers are properly registered.
        """
        import api.signals