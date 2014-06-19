from django.conf.urls import patterns, url

from dbDesigner.protoDiagram import getEntitiesJSONDiagram, synchDBFromDiagram, getElementsDiagramFromSelectedTables, synchDiagramFromDB, getDefaultDiagram
from dbDesigner.protoDiagramEntity import saveDiagram, listDiagrams, createDiagram, deleteDiagram, openDiagram

urlpatterns = patterns('',
    url('getEntitiesJSONDiagram/$', getEntitiesJSONDiagram),
    url('synchDBFromDiagram/$', synchDBFromDiagram),
    url('synchDiagramFromDB/$', synchDiagramFromDB),
    url('getElementsDiagramFromSelectedTables/$', getElementsDiagramFromSelectedTables),
    url('getDefaultDiagram/$',getDefaultDiagram),
    url('saveDiagram/$',saveDiagram),
    url('listDiagrams/$', listDiagrams),
    url('createDiagram/$', createDiagram),
    url('deleteDiagram/$', deleteDiagram),
    url('openDiagram/$',openDiagram),
)