import os
from django.conf import settings

PPATH = settings.PPATH

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(PPATH, 'db/testproto.db'),
    }
}

ALLOWED_HOSTS = [
    'localhost',  # Allow domain and subdomains
    '127.0.0.1',  # Also allow FQDN and subdomains
]



# URL prefix for static files.
STATIC_URL = '/static/'




INSTALLED_APPS = (
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django.contrib.auth',
    'django.contrib.admin',
    'django.contrib.admindocs',
    'protobase',
    'protoLib',
    'prototype',
    'alltests',
)

FIXTURE_DIRS = (
    'src/alltests/fixtures/',
)


HOST_DOMAIN = ''

# add email settings
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'certae.sm@gmail.com'
EMAIL_HOST_PASSWORD = 'dariogomezt'
DEFAULT_FROM_EMAIL = 'certae.sm@gmail.com'

# used for debug
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
