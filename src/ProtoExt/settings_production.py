from settings import PPATH

DATABASES = {
   'default': {
       'ENGINE': 'django.db.backends.mysql',
       'NAME':   'mysql',
       'USER': 'manager',
       'PASSWORD': 'manager',
       'HOST': 'localhost',
       'PORT': '3306',
   }, 
#    'default': {
#        'ENGINE': 'django.db.backends.postgresql_psycopg2',
#        'NAME':   'protoExt',
#    },
}

# If true we will have problems with ExtJS
#CSRF_COOKIE_SECURE = True
#SESSION_COOKIE_SECURE = True

ALLOWED_HOSTS = [
    'localhost', # Allow domain and subdomains
    '127.0.0.1', # Also allow FQDN and subdomains
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
    'protoLib',
    'prototype',
    'll',
)

HOST_DOMAIN = 'loli.fsa.ulaval.ca/artdev'

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'protoext@gmail.com'
EMAIL_HOST_PASSWORD = 'protoext1234'
DEFAULT_FROM_EMAIL = 'protoext@gmail.com'