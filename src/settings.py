# -*- coding: utf-8 -*-

# Django settings for PROTO project.
import os.path, sys 
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

DATABASES = {
#    'test': {
#        'ENGINE': 'mysql', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
#        'NAME':   'dictionnaire',
#        'USER': 'root',                      # Not used with sqlite3.
#        'PASSWORD': '1214moi',               # Not used with sqlite3.
#        'HOST': '132.203.51.190',             # Set to empty string for localhost. Not used with sqlite3.
#        'PORT': '3306',                      # Set to empty string for default. Not used with sqlite3.
#    }, 
    'default': {
        'ENGINE': 'mysql', 
        'NAME':   'protogn',
        'USER': 'root',
        'PASSWORD': 'certae1',
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }, 
#    'default': {
#        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
#        'NAME': PPATH + '/db/protoMeta.db',
#    }
}

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
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

#DGT: Formateo de numeros 
USE_THOUSAND_SEPARATOR = True 
NUMBER_GROUPING = 1
#DECIMAL_SEPARATOR = '.'
#THOUSAND_SEPARATOR = ','

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
#MEDIA_ROOT = 'D:/data/PyDjango/protoExt/static/django_qbe'
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
STATIC_URL = '/static/'

# URL prefix for admin static files -- CSS, JavaScript and images.
# Make sure to use a trailing slash.
# Examples: "http://foo.com/static/admin/", "/static/admin/".

# DGT: Al cambiar esto deja de funcionar (alguna relacion con STATIC_URL? )
#ADMIN_MEDIA_PREFIX = '/static/'
ADMIN_MEDIA_PREFIX = '/static/admin/'

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
SECRET_KEY = 'z7jc&(scfm-c5lt-h#(m*epqis54tc)lxm=g+&5+ud$3w783dx'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
    'django.template.loaders.eggs.Loader',
)

TEMPLATE_CONTEXT_PROCESSORS = ("django.contrib.auth.context_processors.auth",
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

ROOT_URLCONF = 'urls'

TEMPLATE_DIRS = (
    PPATH + '/templates',          
    
#    '/home/dario/data/PyDjango/protoExt/src/django_qbe/templates',
#    'D:/data/PyDjango/protoExt/src/django_qbe   /templates',
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

INSTALLED_APPS = (
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.auth',
    'django.contrib.admin',
    'django.contrib.admindocs',
    'django.contrib.sites',
    'protoLib', 
#    'protoDict', 
    'bestingenomics', 
#    'shiny', 
#    'CategoryCle', 
#    'TCO'
#    'django_extensions',
#    'django_qbe'
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


# Variables prototipeur
PROTO_APP = {}

#Los menus se manejan a dos niveles:  app, opcion
#La app por defecto es la app definida en django y las opciones son los modelos 
#un modelo puede definir un nombre de app diferente, el titulo se tomara de esta variable 
#un modelo puede definir mas de una vista ( protoViews ) y cada vista puede definir su propio modelo
#
#Las propiedades de app_menu son :   hidden,   title,  expanded  

# app_menu se usa para ordenar la pre
PROTO_APP['app_menu'] = {
    'auth' : { 'hidden': True, },  
    'sites' : { 'hidden': True },  
#    'admin': { 'hidden': True },
#    'protoDict' : { 'hidden': False, 'title': 'Dictionnaire', 'expanded':False , 'menu_index' : 30  }, 
#    'protoLib': { 'hidden': False, 'title': 'Métadonnée', 'expanded':False, 'menu_index' : 99  },
    } 


#  The next lines show de available settings and its default QBE values.
QBE_AUTOCOMPLETE = True
QBE_EXHIBIT = False
QBE_ADMIN = "admin"
QBE_ADMIN_SITE ="admin.admin_site"
QBE_ACCESS_FOR = lambda user: user.is_staff
QBE_FORMATS_EXPORT = "qbe_formats"
