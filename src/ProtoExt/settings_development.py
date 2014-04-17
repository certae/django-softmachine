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
]


TEMPLATE_DIRS = (
    PPATH + '/templates',
)

if PPATH.startswith('/'):
    EXT_PATH = '/opt/data/ExtJs'
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
    'alltests',
    'll' 
)

FIXTURE_DIRS = (
    'src/alltests/fixtures/',
)


HOST_DOMAIN = ''

#add email settings
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'protoext@gmail.com'
EMAIL_HOST_PASSWORD = '*****'
DEFAULT_FROM_EMAIL = 'protoext@gmail.com'

#used for debug
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL = 'protoext@gmail.com'