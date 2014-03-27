# -*- coding: utf-8 -*-

from django.http import HttpResponse
from models import getDjangoModel 
from utilsBase import getReadableError
from protoGrid import  getBaseModelName, getModelDetails
from utilsWeb import JsonError

import json

PROTO_PREFIX = "prototype.ProtoTable."

def protoGetDetailsTree(request):
    """ return full field tree 
    """

    if not request.user.is_authenticated(): 
        return JsonError('readOnly User')

    if request.method != 'POST':
        return JsonError( 'invalid message' ) 
    
    viewCode = request.POST.get('viewCode', '') 
    viewEntity  = getBaseModelName( viewCode )
    
    try: 
        model = getDjangoModel(viewEntity)
    except Exception,  e:
        jsondict = { 'success':False, 'message': getReadableError( e ) }
        context = json.dumps( jsondict)
        return HttpResponse(context, content_type="application/json")

    detailList = []
    if viewCode.startswith( PROTO_PREFIX )  and viewCode != viewEntity :
        # -------------------------------------------------------------------------  Prototipos 
        protoEntityId = request.POST.get( 'protoEntityId' )
        if not protoEntityId >= 0:
            return JsonError('invalid idEntity')

        try:  
            from prototype.actions.viewDefinition import GetDetailsConfigTree
            detailList = GetDetailsConfigTree(  protoEntityId )
        except: 
            return JsonError( 'invalid idEntity')

    else: 
        modelDetails = getModelDetails( model )
        for detail in modelDetails: 
            addDetailToList( detailList,  detail ,  ''  )
    
        
    # Codifica el mssage json 
    context = json.dumps( detailList )
    return HttpResponse(context, content_type="application/json")



def addDetailToList(  detailList , detail,  detailPath   ):
    """ return parcial detail tree  ( Called from protoGetFieldTree )
    
    detailList    : Lista con los detalles 
    detail        : registro del detalle 
    detailField   : jerarquia vista desde el campo  
    detailPath    : jerarquia inversa vista desde el maestro 
    """


    if len( detailPath ) > 0:
        detailPath += '/'  
    detailPath +=  detail[ 'menuText' ]
    

    # Agrega el campo solicitado
    menuDetail = {
        "id"            : detailPath ,  
        "conceptDetail" : detail[ 'conceptDetail' ] , 
        "detailField"   : detail[ 'detailField' ] ,                    
        "masterField"   : 'pk',                
        "leaf"          : True 
        }
    
    detailList.append( menuDetail ) 
    
    # Evita demasiada recursividad ( 5 niveles debe ser mas q suficiente )
    # Si el mismo campo ya aparece en el camino seguramente es una autoreferencia
    detailField =  detail[ 'detailField' ]
    if detailField.count( '__') > 5 or detailField.count( '__' + detail[ 'detailName' ] + '__' ) > 0:
        return 

    else: 
        detailChild= []
        model = getDjangoModel( detail[ 'conceptDetail' ]  )
        modelDetails = getModelDetails( model )
        for sDetail in modelDetails: 
            sDetail[ 'detailField' ] = sDetail[ 'detailName' ] + '__' + detail[ 'detailField' ] 
            addDetailToList( detailChild,  sDetail ,  detailPath  )
    
        # Si el modelo de base es el modelo de trabajo, no entro al loop 
        if len( detailChild ) > 0:  
            menuDetail['leaf'] = False 
            menuDetail['children'] = detailChild