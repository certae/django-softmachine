from ProtoExt.settings import PPATH

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': PPATH + '/db/testproto.db',
    }
}

ALLOWED_HOSTS = [
    'localhost', # Allow domain and subdomains
    '127.0.0.1', # Also allow FQDN and subdomains
    '127.0.0.1:8000',
]

if PPATH.startswith('/'):
    EXT_PATH = '/u/data/ExtJs'
else:
    EXT_PATH = 'd:/data/ExtJs'
    
# URL prefix for static files.
STATIC_URL = '/static/'


# Additional locations of static files ( Dev Only  ) 
STATICFILES_DIRS = (
    PPATH + '/static',
    EXT_PATH
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

INSTALLED_APPS = (
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django.contrib.auth',
    'django.contrib.admin',
    'django.contrib.admindocs',
#     'south',
    'protoLib',
    'prototype',
    'll',
    'alltests'
)

FIXTURE_DIRS = (
    'src/alltests/fixtures/',
)

#used for debug
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL = 'protoext@gmail.com'