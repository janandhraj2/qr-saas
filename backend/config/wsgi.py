import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
application = get_wsgi_application()

# One-time startup: create tables and seed defaults on fresh deployments
# (idempotent — safe on every boot, and required because db.sqlite3 is not
# committed to the repo)
try:
    from django.core.management import call_command
    call_command('migrate', run_syncdb=True, verbosity=0)
    call_command('seed_defaults', verbosity=0)
except Exception:
    pass
