#from django.conf.urls.defaults import patterns, include, url
from django.conf.urls import patterns, include, url  # Necessaire avec Django 1.5

#from django.views.generic.simple import direct_to_template
from django.views.generic import TemplateView  # Necessaire avec Django 1.5
from settings import PPATH

# Uncomment the next two lines to enable the admin:
import django.contrib.admin
django.contrib.admin.autodiscover()


urlpatterns = patterns(
    '',
    url(r'^admin/', include(django.contrib.admin.site.urls)),

    #url(r'^protoExt$', direct_to_template, {'template': 'protoExt.html'}),
    url(r'^protoExt$', TemplateView.as_view(template_name="protoExt.html")),  # Necessaire avec Django1.5

    url(r'^protoLib/', include('protoLib.urls')),

    # url(r'^prueba$', direct_to_template, { 'template': 'prueba.html' }),

    # Use for production instalation and for load json configuration files
    url(r'static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': PPATH + '/static'}),
    url(r'resources/(?P<path>.*)$', 'django.views.static.serve', {'document_root': PPATH + '/static'}),
    url(r'media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': PPATH + '/static'}),

    # Archivos generados
    url(r'getFile/(?P<path>.*)$', 'protoLib.downloadFile.getFile', {}),

    url(r'^extjs-tests', TemplateView.as_view(template_name='extjs-tests.html'))
)
