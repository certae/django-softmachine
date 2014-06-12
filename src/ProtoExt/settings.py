# -*- coding: utf-8 -*-

# Django settings for PROTO project.
import os.path
PPATH = os.path.abspath( os.path.join( os.path.dirname(__file__), os.pardir )).replace('\\','/')


if ('/src' in PPATH):
    PPATH = os.path.abspath(os.path.join( PPATH, os.pardir )).replace('\\','/')

# Django settings for debugger 
DEBUG = True
TEMPLATE_DEBUG = DEBUG
  
ADMINS = (
     ('Dario Gomez', 'dariogomezt@gmail.com'),
)

MANAGERS = ADMINS


# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'fr-ca'

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/Montreal'






# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

SITE_ID = 1


# A boolean that specifies whether to display numbers using a thousand separator. 
# When USE_L10N is set to True and if this is also set to True, 
# Django will use the values of THOUSAND_SEPARATOR and NUMBER_GROUPING to format numbers.
USE_THOUSAND_SEPARATOR = True
NUMBER_GROUPING = 1
#DECIMAL_SEPARATOR = '.'
#THOUSAND_SEPARATOR = ','

# ------------------    UPLOAD MEDIA 


# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = os.path.join(PPATH, 'media/')
FILE_UPLOAD_PERMISSIONS = 0644


# URL that handles the media served from MEDIA_ROOT. Make sure to use a trailing slash.
# Examples: "http://xxx.com/media/"
MEDIA_URL = '/media/'


# ------------------    STATIC 
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/


#STATIC_ROOT = os.path.join( PPATH , 'static' )
STATIC_ROOT = ''

TEMPLATE_DIRS = (
    PPATH + '/templates',
)

if PPATH.startswith('/'):
    EXT_PATH = '/opt/data/ExtJs'
else:
    EXT_PATH = 'd:/data/ExtJs'

STATICFILES_DIRS = (
    PPATH + '/static',
    EXT_PATH,
)

# URL prefix for admin static files -- CSS, JavaScript and images.
# Make sure to use a trailing slash.
# Examples: "http://foo.com/static/admin/", "/static/admin/".

# DGT: Al cambiar esto deja de funcionar (alguna relacion con STATIC_URL? )
#ADMIN_MEDIA_PREFIX = '/static/'
#ADMIN_MEDIA_PREFIX = '/static/admin/'



# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)


# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
    'django.template.loaders.eggs.Loader',
)

TEMPLATE_CONTEXT_PROCESSORS = ("django.contrib.auth.context_processors.auth",
#                                "django.core.context_processors.csrf",
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
#     'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
)

ROOT_URLCONF = 'ProtoExt.urls'

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
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

# Variables prototypeur
PROTO_APP = {}

EMAIL_USE_TLS = True
if DEBUG :
    from ProtoExt.settings_development import *
    with open( PPATH + '/src/ProtoExt/secret_key.txt') as f:
        SECRET_KEY = f.read().strip()
else :
    from ProtoExt.settings_production import *
    with open('/etc/secret_key.txt') as f:
        SECRET_KEY = f.read().strip()
