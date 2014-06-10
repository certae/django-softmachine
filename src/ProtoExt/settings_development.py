import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, '../db/testproto.db'),
    }
}

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
    'protoLib',
    'prototype',
    'alltests',
    'rai'
)

FIXTURE_DIRS = (
    'src/alltests/fixtures/',
)


HOST_DOMAIN = ''

#used for debug
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL = 'protoext@gmail.com'