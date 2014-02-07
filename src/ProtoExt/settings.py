# -*- coding: utf-8 -*-

# Django settings for PROTO project.
import os.path
PPATH = os.path.abspath( os.path.join( os.path.dirname(__file__), os.pardir )).replace('\\','/')

if ('/src' in PPATH):
    PPATH = os.path.abspath(os.path.join( PPATH, os.pardir )).replace('\\','/')

# Django settings for modelibra project.
DEBUG = True
TEMPLATE_DEBUG = DEBUG
  
ADMINS = (
     ('Dario Gomez', 'certae_dariogomez@gmail.com'),
)

MANAGERS = ADMINS

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
TIME_ZONE = 'America/Montreal'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'fr-ca'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

# Formateo de numeros ???
USE_THOUSAND_SEPARATOR = True
NUMBER_GROUPING = 1
#DECIMAL_SEPARATOR = '.'
#THOUSAND_SEPARATOR = ','

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = ''

# URL that handles the media served from MEDIA_ROOT. Make sure to use a trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
#MEDIA_URL = 'http://127.0.0.1:8000/static/'
MEDIA_URL = ''

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"

#STATIC_ROOT = os.path.join( PPATH , 'static' )
STATIC_ROOT = ''


#DAJAXICE_MEDIA_PREFIX="dajaxice"
USE_DJANGO_JQUERY = True


# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
with open('/etc/secret_key.txt') as f:
    SECRET_KEY = f.read().strip()

    
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
    'django.template.loaders.eggs.Loader',
)

TEMPLATE_CONTEXT_PROCESSORS = ("django.contrib.auth.context_processors.auth",
                               "django.core.context_processors.csrf",
                               "django.core.context_processors.debug",
                               "django.core.context_processors.i18n",
                               "django.core.context_processors.media",
                               "django.core.context_processors.static",
                               "django.core.context_processors.request",
                               "django.contrib.messages.context_processors.messages"
                               )

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
)

ROOT_URLCONF = 'ProtoExt.urls'
WSGI_APPLICATION = 'ProtoExt.wsgi.application'

TEMPLATE_DIRS = (
    PPATH + '/templates',
)
# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}


AUTH_PROFILE_MODULE = 'protoLib.UserProfile'

# Variables prototipeur
PROTO_APP = {}

#HOST_DOMAIN = 'loli.fsa.ulaval.ca/artdev'
HOST_DOMAIN = ''
EMAIL_USE_TLS = True

if DEBUG :
    from settings_development import *
else :
    from settings_production import *

