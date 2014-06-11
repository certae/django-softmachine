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
LANGUAGE_CODE = 'fr-ca'

TIME_ZONE = 'America/Montreal'

USE_I18N = True

USE_L10N = True

USE_TZ = True

SITE_ID = 1


# A boolean that specifies whether to display numbers using a thousand separator. 
# When USE_L10N is set to True and if this is also set to True, 
# Django will use the values of THOUSAND_SEPARATOR and NUMBER_GROUPING to format numbers.
USE_THOUSAND_SEPARATOR = True
NUMBER_GROUPING = 1

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

STATIC_ROOT = 'static/'

TEMPLATE_DIRS = (
    PPATH + '/templates',
    PPATH + '/src/protoLib/templates',
)

if PPATH.startswith('/'):
    EXT_PATH = '/opt/data/ExtJs'
else:
    EXT_PATH = 'd:/data/ExtJs'

STATICFILES_DIRS = (
    PPATH + '/static',
    PPATH + '/src/protoLib/static',
    EXT_PATH,
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)


# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
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

ROOT_URLCONF = 'softMachine.urls'

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


if DEBUG :
    from softMachine.settings_development import *
    with open( PPATH + '/src/softMachine/secret_key.txt') as f:
        SECRET_KEY = f.read().strip()
else :
    from softMachine.settings_production import *
    with open('/etc/secret_key.txt') as f:
        SECRET_KEY = f.read().strip()