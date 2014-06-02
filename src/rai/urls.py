from django.conf.urls import patterns, url
from rai.raccordement import getModeleRaccordement, createRaccordement

urlpatterns = patterns('',
    url('getModeleRaccordement/$', getModeleRaccordement),
    url('createRaccordement/$', createRaccordement),
)