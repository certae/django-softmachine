from django.conf.urls.defaults import patterns, include, url
from django.views.generic.simple import direct_to_template

# Uncomment the next two lines to enable the admin:
import django.contrib.admin
django.contrib.admin.autodiscover()



urlpatterns = patterns('',
    url(r'^admin/', include(django.contrib.admin.site.urls)) ,
#    url(r'^qbe/', include('django_qbe.urls')),

    url(r'^protoExt$', direct_to_template, { 'template': 'protoExt.html' }),
    url(r'^protoExt/', include('protoExt.urls')),

    url(r'^prueba$', direct_to_template, { 'template': 'prueba.html' }),

#    Use for production instalation 
#    (r'static/(?P<path>.*)$', 'django.views.static.serve',{'document_root': '/var/www/protoExt/static'}),
    (r'media/(?P<path>.*)$', 'django.views.static.serve',{'document_root': 'D:/data/PyDjango/protoExt/static'}),
)

