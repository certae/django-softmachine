
DATABASES = {
   'default': {
       'ENGINE': 'django.db.backends.mysql',
       'NAME':   'mysql',
       'USER': '',
       'PASSWORD': '',
       'HOST': 'localhost',
       'PORT': '3306',
   }
}

ALLOWED_HOSTS = [
    'localhost', # Allow domain and subdomains
    '127.0.0.1',
]


WSGI_APPLICATION = 'softmachine.wsgi.application'

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
)

HOST_DOMAIN = 'loli.fsa.ulaval.ca/rai'

EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'protoext@gmail.com'
DEFAULT_FROM_EMAIL = 'protoext@gmail.com'
with open('/etc/email_key.txt') as f:
    EMAIL_HOST_PASSWORD = f.read().strip()