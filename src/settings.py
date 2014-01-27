# -*- coding: utf-8 -*-

# Django settings for PROTO project.
import os.path
PPATH = os.path.abspath( os.path.join( os.path.dirname(__file__), os.pardir )).replace('\\','/')

if PPATH.startswith('/'):
    EXT_PATH = '/u/data/ExtJs'
else:
    EXT_PATH = 'd:/data/ExtJs'


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

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = 'static/'

# URL prefix for admin static files -- CSS, JavaScript and images.
# Make sure to use a trailing slash.
# Examples: "http://foo.com/static/admin/", "/static/admin/".

# DGT: Al cambiar esto deja de funcionar (alguna relacion con STATIC_URL? )
#ADMIN_MEDIA_PREFIX = '/static/'
#ADMIN_MEDIA_PREFIX = '/static/admin/'

#DAJAXICE_MEDIA_PREFIX="dajaxice"
USE_DJANGO_JQUERY = True

# Additional locations of static files
STATICFILES_DIRS = (
    PPATH + '/static',
    EXT_PATH
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

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

#HOST = 'loli.fsa.ulaval.ca/artdev'
HOST = ''
EMAIL_USE_TLS = True
#used for debug
#EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

if DEBUG :
    from settings_development import *
else :
    from settings_production import *

