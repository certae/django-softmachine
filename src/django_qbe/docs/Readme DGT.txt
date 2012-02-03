Copio el proyecto directamente de git,  el q se instala de pip parece una version vieja

Lo agrego dentro del proyecto, 
   como una app mas
   
   D:\data\PyDjango\protoExt\src\django_qbe
   
   statics

   D:\data\PyDjango\protoExt\static\django_qbe
   
   templates y templatetags
   
   D:\data\PyDjango\protoExt\templates
   
The app should contain a templatetags directory, at the same level as models.py, views.py, etc.
If this doesn’t already exist, create it - don’t forget the __init__.py file to ensure the directory 
is treated as a Python package.

   D:\data\PyDjango\protoExt\src\django_qbe\templatetags


Adding to the project settings::

  INSTALLED_APPS = (
      # [...] django builtins applications
      'django_qbe',
      # [...] Any other application
  )

And adding the urlconf in your project urls.py::

    # qbe
    url(r'^qbe/', include('django_qbe.urls')),


Agregar las estaticas

  TEMPLATE_CONTEXT_PROCESSORS = (
      # [...] django context processors
      'django.core.context_processors.static',
      # [...] Any other context processors
  )

  STATICFILES_DIRS = (
    PPATH + '/static',
#    '/home/dario/data/ExtJs/ext-4.0.7-gpl',
    'd:/data/ExtJs/ext-4.0.7-gpl',


** ---------------------------

Settings
--------

The next lines show de available settings and its default values.

Enable autocompletion tool (work in progress, not enabled yet)::

  QBE_AUTOCOMPLETE = True

Enable an Exhibit faceted navigation for results (not yet implemented)::

  QBE_EXHIBIT = False

Admin module name to add admin urls in results::

  QBE_ADMIN = "admin"

Set your own admin site if it's different to usual *django.contrib.admin.site*::

  QBE_ADMIN_SITE ="admin.admin_site"

Function to control to users with access to QBE::

  QBE_ACCESS_FOR = lambda user: user.is_staff

Path to QBE formats export file, in order to add custom export formats::

  QBE_FORMATS_EXPORT = "qbe_formats"


.. _QBE: http://www.google.com/url?sa=t&source=web&ct=res&cd=2&ved=0CB4QFjAB&url=http%3A%2F%2Fpages.cs.wisc.edu%2F~dbbook%2FopenAccess%2FthirdEdition%2Fqbe.pdf&ei=_UD5S5WSBYP5-Qb-18i8CA&usg=AFQjCNHMv-Pua285zhWT8DevuZFj2gfYKA&sig2=-sTEDWjJhnTaixh2iJfsAw
.. _PyPI: http://pypi.python.org/pypi/django_qbe/
.. _staticfiles: http://docs.djangoproject.com/en/dev/howto/static-files
