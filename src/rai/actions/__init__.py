# -*- coding: utf-8 -*-

import traceback

from protoLib.utilsBase import slugify
from protoLib.utils.downloadFile import getFullPath 



def doFindReplace(modeladmin, request, queryset, parameters):
    """ 
    find and replace sobre la tabla actual 
    parameters   campo,  findText, replaceText 
    """

#   El QSet viene con la lista de Ids  
    if queryset.count() < 1:
        return  {'success':False, 'message' : 'Multiple selection required'}

    if len(parameters) != 3: 
        return  {'success':False, 'message' : 'required: fieldName, findText, replaceText' }

    from protoLib.actions.findReplace import actionFindReplace
    return actionFindReplace(request, queryset, parameters)



def doImportRAI( modeladmin, request, queryset, parameters):

    return doRaiActions( modeladmin, request, queryset, parameters, 'IMPORT' )


def doMatchRAI( modeladmin, request, queryset, parameters):

    return doRaiActions( modeladmin, request, queryset, parameters, 'MATCH' )



def doRaiActions( modeladmin, request, queryset, parameters, action ):
    """ 
    funcion para importar modelos realizados en OMS ( Open Model Spher )  
    """

    from ProtoExt.settings import MEDIA_ROOT

#   El QSet viene con la lista de Ids  
    if queryset.count() != 1:
        return  {'success':False, 'message' : 'No record selected' }

    from protoLib.protoAuth import getUserProfile
    userProfile = getUserProfile( request.user, 'prototype', '' )

    import importOMS_RAI 
    cOMS = importOMS_RAI.importOMS_RAI( userProfile, queryset[0]  )

    if action == 'IMPORT': 

        try: 

            import os 
            fileName = os.path.join(MEDIA_ROOT, 'OMS.exp' ) 
        
            cOMS.loadFile( fileName  )
            cOMS.doImport()
    
            cOMS.doFkMatch( )

    #   Recorre los registros selccionados   
        except Exception as e:
            traceback.print_exc()
            return  {'success':False, 'message' : 'Load error' }

    elif action == 'MATCH': 

        try: 

            cOMS.doRacMatch()

    #   Recorre los registros selccionados   
        except Exception as e:
            traceback.print_exc()
            return  {'success':False, 'message' : 'Load error' }
        
    return {'success':True, 'message' :  'runing ...' } 


def doModelGraph(modeladmin, request, queryset, parameters):
    """ 
    funcion para crear el modelo grafico 
    a partir de Model ( doModel )   
    el proyecto enviara la el QSet de todos los modelos 
    """

#   El QSet viene con la lista de Ids  
    if queryset.count() != 1:
        return  {'success':False, 'message' : 'No record selected' }

    try:

        from graphModel import GraphModel 
        gModel = GraphModel()
    
        gModel.getDiagramDefinition( queryset  )
        dotData = gModel.generateDotModel( )

#   Recorre los registros selccionados   
    except Exception as e:
        traceback.print_exc()
        return  {'success':False, 'message' : 'Load error' }
        pass


#   Genera el archvivo dot     
    fileName = 'gm_' + slugify( queryset[0].code ) + '.dot'
    fullPath = getFullPath( request, fileName )
 
    fo = open( fullPath , "wb")
    fo.write( dotData.encode('utf-8'))
    fo.close()
 
    try:
        import pygraphviz
        fileNamePdf = fileName.replace( '.dot', '.pdf') 
        fullPathPdf = getFullPath( request, fileNamePdf )
 
        graph = pygraphviz.AGraph( fullPath )
        graph.layout( prog= 'dot' )
        graph.draw( fullPathPdf, format ='pdf')
 
        fileName = fileNamePdf
    except ImportError:
        pass

    return  {'success':True , 'message' : fileName,  'fileName' : fileName }


def doMatrixRacc( modeladmin, request, queryset, parameters):

    from rai.actions.actModele import doMatrixRaccordement 

    return doMatrixRaccordement( modeladmin, request, queryset, parameters  )
