# -*- coding: utf-8 -*-

from protoLib.utilsBase import slugify
from protoLib.downloadFile import getFullPath 

from viewDefinition import getViewDefinition, getViewCode, getEntities
from propModelJoin import doPropModelJoin 
from graphModel import generateDotModels

#from protoLib.utilsWeb import JsonError, JsonSuccess 


def doModelPrototype( modeladmin, request, queryset, parameters):
    """ 
    funcion para crear el prototipo sobre 'protoTable' con la definicion del diccionario
    a partir de Model  
    """

#   El QSet viene con la lista de Ids  
    if queryset.count() == 0:
        return  {'success':False, 'message' : 'No record selected' }
        
#   Mensaje de retorno
    returnMsg = '' 

#   Recorre los registros selccionados   
    for pModel in queryset:
        returnTmp = getEntities( pModel.entity_set.all() , request , None  )
        returnMsg += 'Model : ' + pModel.code + ' Entts: ' + returnTmp + '; '    

    return {'success':True, 'message' : returnMsg } 



def doEntityPrototype( modeladmin, request, queryset, parameters ):

#   El QSet viene con la lista de Ids  
    if queryset.count() != 1:
        return  {'success':False, 'message' : 'No record selected' }

    if len( parameters ) != 1: 
        return  {'success':False, 'message' : 'ViewName required!!' }

#   Recorre los registros selccionados   
    returnTmp = 'Entt: ' + getEntities( queryset , request, parameters[0]['value']  )
    return {'success':True, 'message' :  returnTmp } 


def doPropertyModelJoin( modeladmin, request, queryset, parameters):
    """ 
    funcion para unir dos propertyModel 
    """

#   El QSet viene con la lista de Ids  
    if queryset.count() < 2:
        return  {'success':False, 'message' : 'Multiple selection required'}

    return doPropModelJoin ( queryset )


# --------------------------------------------------------------------------------
class nAux: pass


def doModelGraph( modeladmin, request, queryset, parameters):
    """ 
    funcion para crear el modelo grafico 
    a partir de Model ( doModel )   
    el proyecto enviara la el QSet de todos los modelos 
    """

#   El QSet viene con la lista de Ids  
    if queryset.count() != 1:
        return  {'success':False, 'message' : 'No record selected' }


    ns = nAux()
    ns.fileName = 'gm_' + slugify( queryset[0].code ) + '.pdf'
    ns.request = request 

    def print_output( ns, dotdata):
        ns.fileName = ns.fileName.replace( '.pdf', '.dot')
        fullPath = getFullPath( ns.request, ns.fileName )
        fo = open( fullPath , "wb")
        fo.write( dotdata.encode('utf-8'))
        fo.close()

    def render_output(ns , dotdata, **kwargs):
        
        def do_render( ns, dotdata, **kwargs):
            fullPath = getFullPath( ns.request, ns.fileName )
            vizdata = ' '.join(dotdata.split("\n")).strip().encode('utf-8')
            version = pygraphviz.__version__.rstrip("-svn")
            try:
                if [int(v) for v in version.split('.')] < (0, 36):
                    # HACK around old/broken AGraph before version 0.36 (ubuntu ships with this old version)
                    import tempfile
                    tmpfile = tempfile.NamedTemporaryFile()
                    tmpfile.write(vizdata)
                    tmpfile.seek(0)
                    vizdata = tmpfile.name
            except ValueError:
                print_output( ns , dotdata )
                return
    
            graph = pygraphviz.AGraph(vizdata)
            #graph.layout( prog=kwargs['layout'])
            graph.draw( fullPath, format ='pdf', prog= 'dot')
        try:
            import pygraphviz
            do_render( ns, dotdata, **kwargs)

        except ImportError:
            print_output( ns, dotdata )
            
        
#   Envia el QSet con la lista de modelos, 
    dotdata = generateDotModels ( queryset )
    if False : # parameters['outputfile']:
        render_output(ns , dotdata, **parameters)
    else:
        print_output(ns , dotdata)

    return  {'success':True , 'message' : ns.fileName,  'fileName' : ns.fileName }
