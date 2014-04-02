from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from ProtoExt.settings import PPATH, DEBUG
from ProtoExt.generic_views import DirectTemplateView

import django.contrib.admin
django.contrib.admin.autodiscover()



urlpatterns = patterns('',
    url(r'^admin/', include(django.contrib.admin.site.urls)) ,

    url(r'^protoLib/', include('protoLib.urls')),

#    Use for production instalation and for load json configuration files
    url(r'static/(?P<path>.*)$', 'django.views.static.serve',{'document_root': PPATH + '/static'}),
    url(r'resources/(?P<path>.*)$', 'django.views.static.serve',{'document_root': PPATH + '/static'}),
    url(r'media/(?P<path>.*)$', 'django.views.static.serve',{'document_root': PPATH + '/static'}),

#   Archivos generados
    url(r'getFile/(?P<path>.*)$', 'protoLib.downloadFile.getFile', {}),
    
    # Pour executer les tests avec Jasmine
    url(r'^extjs-tests', TemplateView.as_view(template_name='extjs-tests.html')),
)

if DEBUG :
    urlpatterns += patterns('',
        url(r'^protoExt$', TemplateView.as_view(template_name='protoExt.html')),
        url(r'^protoExtReset$', DirectTemplateView.as_view(template_name='protoExt.html',extra_context={ 'isPasswordReseted': True })),
    )
else :
    urlpatterns += patterns('',
        url(r'^protoExt$', TemplateView.as_view(template_name='protoExt_production.html')),
        url(r'^protoExtReset$', DirectTemplateView.as_view(template_name='protoExt.html',extra_context={ 'isPasswordReseted': True })),
    )
    