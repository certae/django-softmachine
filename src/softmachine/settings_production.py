from ProtoExt.settings import PPATH
# DATABASES = {
#    'default': {
#        'ENGINE': 'django.db.backends.mysql',
#        'NAME':   'mysql',
#        'USER': '',
#        'PASSWORD': '',
#        'HOST': 'localhost',
#        'PORT': '3306',
#    }
# }

DATABASES = {
   'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': PPATH + '/db/testproto.db',
    }
}

ALLOWED_HOSTS = [
    'localhost', # Allow domain and subdomains
    '127.0.0.1',
    '132.203.51.6',
    '.ulaval.ca',  # Also allow FQDN and subdomains
]


WSGI_APPLICATION = 'ProtoExt.wsgi.application'

TEMPLATE_DIRS = (
    PPATH + '/templates',
)

# URL prefix for static files.  ( Relative for prod )
# Example: "http://media.lawrence.com/static/"
STATIC_URL = 'static/'


INSTALLED_APPS = (
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django.contrib.auth',
    'django.contrib.admin',
    'django.contrib.admindocs',
    'south',
    'protoLib',
    'prototype',
#     'll',
)

HOST_DOMAIN = 'loli.fsa.ulaval.ca/artdev'

EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'protoext@gmail.com'
DEFAULT_FROM_EMAIL = 'protoext@gmail.com'
with open('/etc/email_key.txt') as f:
    EMAIL_HOST_PASSWORD = f.read().strip()

