from django.conf.urls import patterns, url
from rai.raccordement import getModeleRaccordement, createRaccordement, deleteRaccordement, listRaccordement

urlpatterns = patterns('',
    url('getModeleRaccordement/$', getModeleRaccordement),
    url('createRaccordement/$', createRaccordement),
    url('deleteRaccordement/$', deleteRaccordement),
    url('listRaccordement/$', listRaccordement),
)