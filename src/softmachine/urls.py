from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

from softmachine.settings import PPATH, DEBUG
from protoLib.utils.generic_views import DirectTemplateView

import django.contrib.admin
django.contrib.admin.autodiscover()

# Uncoment to use xadmin
# import xadmin
# xadmin.autodiscover()


urlpatterns = patterns('',
    url(r'^admin/', include(django.contrib.admin.site.urls)) ,
#     url(r'^admin/', include(xadmin.site.urls)),


    url(r'^main$', TemplateView.as_view(template_name='index.html')),
    url(r'^debug$', TemplateView.as_view(template_name='debug.html')),

    url(r'^protoLib/', include('protoLib.urls')),
    url(r'^protoDiagram/', include('dbDesigner.urls')),

#    Use for production instalation and for load json configuration files
    url(r'static/(?P<path>.*)$', 'django.views.static.serve',{'document_root': PPATH + '/static'}),
    url(r'resources/(?P<path>.*)$', 'django.views.static.serve',{'document_root': PPATH + '/static'}),
    url(r'media/(?P<path>.*)$', 'django.views.static.serve',{'document_root': PPATH + '/static'}),

#   Generated files
    url(r'getFile/(?P<path>.*)$', 'protoLib.utils.downloadFile.getFile', {}),

    # Pour executer les tests avec Jasmine
    url(r'^extjs-tests', TemplateView.as_view(template_name='extjs-tests.html')),
)

