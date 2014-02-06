"""
WSGI config for ProtoExt project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/howto/deployment/wsgi/
"""

import os, sys
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ProtoExt.settings")

# from django.core.wsgi import get_wsgi_application
# application = get_wsgi_application()

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()


path = '/home/SitePrototypeur/ProtoExt/src'
if path not in sys.path:
    sys.path.append(path)