"""
WSGI config for myproject project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/howto/deployment/wsgi/
"""

import os
# GETTING-STARTED: change 'myproject' to your project name:
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
