from django.apps import AppConfig


class DefiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'defi'

    def ready(self):
        import os
        # Prevent scheduler from running multiple times in dev server
        if os.environ.get('RUN_MAIN', None) != 'true':
            from . import scheduler
            scheduler.start_scheduler()
