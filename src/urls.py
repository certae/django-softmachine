from django.conf.urls.defaults import patterns, include, url
from django.views.generic.simple import direct_to_template
from settings import PPATH 

# Uncomment the next two lines to enable the admin:
import django.contrib.admin
django.contrib.admin.autodiscover()



urlpatterns = patterns('',
    url(r'^admin/', include(django.contrib.admin.site.urls)) ,
#    url(r'^qbe/', include('django_qbe.urls')),

    url(r'^protoExt$', direct_to_template, { 'template': 'protoExt.html' }),
    url(r'^protoLib/', include('protoLib.urls')),

    url(r'^prueba$', direct_to_template, { 'template': 'prueba.html' }),

#    Use for production instalation and for load json configuration files  
    url(r'static/(?P<path>.*)$', 'django.views.static.serve',{'document_root': PPATH + '/static'}),
    url(r'^resources/(?P<path>.*)$', 'django.views.static.serve',{'document_root': PPATH + '/static'}),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve',{'document_root': PPATH + '/static'}),
)

