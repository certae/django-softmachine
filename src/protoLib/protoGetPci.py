# -*- coding: utf-8 -*-

from django.http import HttpResponse
from protoGrid import getSearcheableFields, getProtoViewName, setDefaultField , getProtoAdmin
from protoLib import protoGrid
from protoField import  setFieldDict
from models import getDjangoModel, ProtoDefinition
from utilsBase import getReadableError, copyProps

import django.utils.simplejson as json


# Dgt 12/10/28 Permite la carga directa de json de definicion. 
PROTOVERSION = '4.23'


def protoGetPCI(request):
    """ return full metadata (columns, renderers, totalcount...)
    """
    
    if request.method != 'GET':
        return 
    
    protoOption = request.GET.get('protoOption', '') 
    protoConcept, view = getProtoViewName( protoOption )
    
    try: 
        model = getDjangoModel(protoConcept)
    except Exception,  e:
        jsondict = { 'success':False, 'message': getReadableError( e ) }
        context = json.dumps( jsondict)
        return HttpResponse(context, mimetype="application/json")
    
    # Verifica si la info de protoExt co 
    
    # created : El objeto es nuevo
    # protoDef : PCI leida de la DB 
    protoDef, created = ProtoDefinition.objects.get_or_create(code = protoOption, defaults={'code': protoOption})
    
    # El default solo parece funcionar al insertar en la Db
    if created: protoDef.overWrite = True
    
    # Si es nuevo o no esta activo lee Django 
    if created or ( not protoDef.active   ) :

        model_admin, protoMeta  = getProtoAdmin( model )
        version = protoMeta.get( 'version' )

        # La version determina q es una carga completa de la meta y no es necesario reconstruirla
        # solo en caso de q la definicion no este en la Db        
        if not version: 

            # Verifica si existe una propiedad ProtoMeta es la copia de la meta cargada a la Db,
            grid = protoGrid.ProtoGridFactory( model, protoOption, model_admin, protoMeta )
            protoMeta = createProtoMeta( model, grid, protoConcept, protoOption  )
    
        # Guarda la Meta si es nuevo o si se especifica overWrite
        if  created or protoDef.overWrite: 
            protoDef.metaDefinition = json.dumps( protoMeta ) 
            protoDef.description = protoMeta['description'] 
            protoDef.save()    


    else:
        protoMeta = json.loads( protoDef.metaDefinition ) 


    # Verifica la view y copia las propiedades necesarias, ( un protoView no sera editable ) 
    if view: 
        protoMeta = getProtoViewObj( protoMeta, view )    
    
    # La definicion del arbol es fija, pues las cols deben ser siempre uniformes sin importar el tipo de modelo.
    pStyle = protoMeta.get( 'pciStyle', '')      
    if pStyle == 'tree':
        # Los campos base minimos son :   
        #     Id          : id del registro  ( automatico ) 
        #     __str__     : valor semantico del registro   
        #     protoView   : permite redefinir el panel de detalles y la navegacion 
    
        #    El arbol se defina a medida q el usuario haga drill-down en cada detalle, 
        #    la construccion del arbol es responsabilidad del frontEnd 

        pFields =  []
        pFields.append ( { "name": "__str__","type": "string"} )
        pFields.append ( { "name": "protoView","type": "string"} )
        pFields.append ( { "name":"id", "type":"autofield","fromModel":True} )
    
        protoMeta['fields'] = pFields 
        protoMeta['hiddenFields'] = ["id"]
        protoMeta['listDisplay'] = ["__str__", "protoView"]

    
    jsondict = {
        'success':True,
        'message': '',
        'metaData':{
            # The name of the property which contains the Array of row objects. ...
            'root': 'rows',

            #Name of the property within a row object that contains a record identifier value. ...
            'idProperty': protoMeta['idProperty'],

            #Name of the property from which to retrieve the total number of records in t
            'totalProperty':'totalCount',

            #Name of the property from which to retrieve the success attribute. ...
            'successProperty':'success',
            
            #The name of the property which contains a response message. (optional)
            'messageProperty': 'message', 
            }, 
        'protoMeta': protoMeta,
        'rows':[],
        'totalCount': 0, 
    }
    
    # Codifica el mssage json 
    context = json.dumps( jsondict)
    return HttpResponse(context, mimetype="application/json")



# protoGetPCI ----------------------------


def createProtoMeta( model, grid, protoConcept , protoOption ):


    # Los criterios de busqueda ni los ordenamientos son heredados del admin, 
    pSearchFields = grid.gridConfig.get( 'searchFields', []) 
    if len( pSearchFields ) == 0: pSearchFields = getSearcheableFields( model  )

    pSortFields = grid.gridConfig.get( 'sortFields', []) 
    if len( pSortFields )  ==  0: pSortFields = getSearcheableFields( model  )

    # Lista de campos precedidos con '-' para order desc  ( 'campo1' , '-campo2' )
    # * o [{ "property": "code", "direction": "ASC" }, {  
    initialSort = grid.gridConfig.get( 'initialSort', ())
    sortInfo = []
    for sField in initialSort:
        # Si es un string lo convierte en objeto 
        if type( sField ).__name__ == type( '' ).__name__ :  
            sortOrder = 'ASC'
            if sField[0] == '-':
                sortOrder =  'DESC'
                sField = sField[1:]
            sField = { 'property': sField, 'direction' : sortOrder }
            
        sortInfo.append(sField)


    # ----------- Completa las propiedades del gridConfig 
    gridConfig = { 
             'searchFields': pSearchFields, 
             'sortFields': pSortFields, 
             'initialSort': sortInfo,

             # Si no es autoload  -  '{"pk" : 0,}'            
             'initialFilter': grid.gridConfig.get( 'initialFilter', {}),

            # Toma las definidas en la grilla 
            'listDisplay' : grid.gridConfig.get( 'listDisplay', []),
            'readOnlyFields' : grid.gridConfig.get( 'readOnlyFields', []),
             
            # Garantiza q existan en la definicion 
             'hideRowNumbers' : grid.gridConfig.get( 'hideRowNumbers',False),  
             'filterSetABC': grid.gridConfig.get( 'filterSetABC', ''),
             'baseFilter': grid.gridConfig.get( 'baseFilter', {}),
             'filtersSet': grid.gridConfig.get( 'filtersSet', []),
             'hiddenFields': grid.protoMeta.get( 'hiddenFields', ['id', ]),
#            'listDisplaySet':grid.gridConfig.get( 'listDisplaySet', {}) ,     
         } 


    #---------- Ahora las propiedades generales de la PCI 
    protoIcon  = 'icon-%s' % grid.protoMeta.get( 'protoIcon', '1') 

    pDescription = grid.protoMeta.get( 'description', '')
    if len(pDescription) == 0:  pDescription = grid.protoMeta.get( 'title', grid.title)
    
    #FIX: busca el id en la META  ( id_field = model._meta.pk.name ) 
    id_field = u'id'

    # Conf de hojas de info
    pSheets = grid.protoMeta.get( 'sheetConfig', {})

    protoMeta = { 
         'version': PROTOVERSION ,
         'protoOption' : protoOption,           
         'protoConcept' : protoConcept,           
         'idProperty': id_field,
         'shortTitle': grid.protoMeta.get( 'shortTitle', grid.title ),
         'description': pDescription ,
         'protoIcon': protoIcon,
         'helpPath': grid.protoMeta.get( 'helpPath',''),

         'fields': grid.fields, 
         'gridConfig' : gridConfig,  

        # Propiedades extendidas   
         'protoDetails': grid.get_details() , 
         'protoForm': grid.getFieldSets(),  
         'protoUdp': grid.protoMeta.get( 'protoUdp', {}), 

        # DGT: Vistas heredadas del modelo base, zooms,  etc ...
        # Ya no se requieren pues el menu se maneja directamente en el FrontEnd           
        # 'protoViews': grid.protoMeta.get( 'protoViews', {}), 
         
         'sheetConfig' : {
            'protoSheets' : pSheets.get( 'protoSheets', [] ), 
            'protoSheetSelector' : pSheets.get( 'protoSheetSelector', ''), 
            'protoSheetProperties' : pSheets.get( 'protoSheetProperties', ()), 
             }, 
         }

    return protoMeta 


def getProtoViewObj( protoMeta, view   ):
#   Copia las propiedades de la vista en el protoMeta ( La meta resultante no es editable ) 

    protoView = {}
    if view:
        # intenta leer la definicion de la vista             
        protoViews  = protoMeta.get( 'protoViews', {})
        if protoViews:  
            protoView  = protoViews.get(  view, {})

    if protoView:
        protoCopy = protoMeta.copy()
        for key in protoView: 
            # evitar recursividad en vistas 
            if key == 'protoViews': continue 
            protoCopy[ key ] = protoView[ key ]
          
        return protoCopy

    else: 
        return protoMeta

# ------------------------------------------------------------------------


def protoSavePCI(request):
    """ Save full metadata
    """

    if request.method != 'POST':
        return 
    
    protoOption = request.POST.get('protoOption', '') 
    sMeta = request.POST.get('protoMeta', '')
    protoMeta = json.loads( sMeta )
    
    # created : True  ( new ) is a boolean specifying whether a new object was created.
    protoDef, created = ProtoDefinition.objects.get_or_create(code = protoOption, defaults={'code': protoOption})
    
    # El default solo parece funcionar al insertar en la Db
    protoDef.active = True 
    protoDef.overWrite = False 
    protoDef.metaDefinition = sMeta 

    if protoOption == '__menu' :
        protoDef.description = 'Menu'
    else: 
        protoDef.description = protoMeta['description']
     
    protoDef.save()    

    jsondict = {
        'success':True,
        'message': 'Ok',
    }
    
    # Codifica el mssage json 
    context = json.dumps( jsondict)
    return HttpResponse(context, mimetype="application/json")



def protoGetFieldTree(request):
    """ return full field tree 
    """

    if request.method != 'GET':
        return 
    
    protoOption = request.GET.get('protoOption', '') 
#    protoUdp = request.GET.get('protoUpd', {})
#    cUDP = verifyUdpDefinition( protoUdp )
     
    protoConcept, view = getProtoViewName( protoOption )
    
    try: 
        model = getDjangoModel(protoConcept)
    except Exception,  e:
        jsondict = { 'success':False, 'message': getReadableError( e ) }
        context = json.dumps( jsondict)
        return HttpResponse(context, mimetype="application/json")
    
    
    fieldList = []
    
    # Se crean los campos con base al modelo ( trae todos los campos del modelo 
    for field in model._meta._fields():
        addFiedToList( fieldList,  field , '', [] )
        
    # Add __str__ 
    myField = { 
        'id'        : '__str__' ,  
        'text'      : protoConcept , 
        'checked'   : False,       
        'leaf'      : True 
     }
    
    # Defaults values
    setDefaultField( myField, model , protoOption)
    
    # FormLink redefinition to original view 
    # myField['zoomModel'] =  protoOption  

    
    fieldList.append( myField )

    # Las udps se agregan manualmente, pues habria q crear una tabla para manejar la dependecia con cada tabla  
    # addUpdToList( fieldList,  cUDP )

        
    # Codifica el mssage json 
    context = json.dumps( fieldList )
    return HttpResponse(context, mimetype="application/json")



def addFiedToList(  fieldList , field, fieldBase, fieldOcurrences  ):
    """ return parcial field tree  ( Called from protoGetFieldTree ) 
    """

    fieldId = fieldBase + field.name

    # DEfinicion proveniente del dict ( setFieldDict )  
    protoFields = {}
    setFieldDict ( protoFields , field )
    pField = protoFields[ field.name ]
    
    # fieldBase indica campos de llaves foraneas       
    if fieldBase != '': 
        pField[ 'readOnly' ] = True 
        pField[ 'allowBlank' ] = True 

        if pField['type'] == 'autofield':
            pField['type'] = 'int'
        
    
    #DGT :  Choices armar un string y descomponer al otro lado 
    myField = { 
        'id'         : fieldId , 
        'text'       : field.name, 
        'checked'    : False, 
        'readOnly'   : pField.get( 'readOnly' , False ) , 
        'allowBlank' : pField.get( 'allowBlank' , True  ),  
        'tooltip'    : pField.get( 'tooltip', ''  ),  
        'header'     : pField.get( 'header',  field.name  ),   
        'type'       : pField.get( 'type',  'string'  )  
     }

    # Atributos adicionales de edicion 
    if fieldBase == '': 
#        if hasattr( pField, 'defaultValue' ):   FIX:  trae un proxy
#            myField['defaultValue'] = pField['defaultValue'] 

        if hasattr( pField, 'vType'): 
            myField['vType'] = pField['vType'] 

#        if pField['type'] == 'combo':
#            myField['choices'] = pField['choices'] 

    # Recursividad Fk 
    if pField['type'] != 'foreigntext':
        myField['leaf'] = True

    else:

        # Crea el Id para el fk 
        myFieldId = protoFields[ pField['fkId'] ]

        # Agrega los eltos particulares  
        if ( fieldBase == '') :  
            myField['fkId'] = pField['fkId']

        else:      
            myField['fkId'] = fieldBase + pField['fkId'] 
            myFieldId['fkField']  = myField['id']                    

        # Agrega los eltos del zoom ademas del FkId ( No importa si es base ) 
        if ( True or fieldBase == '') :  
            myField['zoomModel'] = pField['zoomModel']                    
    
            myFieldId['id' ]        = myField['fkId']
            myFieldId['zoomModel']  = myField['zoomModel']                    
            myFieldId['leaf'] = True
            myFieldId['readOnly'] = True
            myFieldId['checked'] = False
            myFieldId['text'] =  pField['fkId']  
            myFieldId['allowBlank'] = myField['allowBlank']  
            myFieldId['type'] =  myFieldId['type']  
    
            fieldList.append( myFieldId )


        # Evita el mismo campo recursivo sobre si mismo.  
        # TODO:  Un mimsmo objeto puede ser refecenciado varias veces, ie  ciudad, etc, la solucion seria solo cortar la recurividad?? 
        if fieldOcurrences.count( field.name ) > 1:
            myField['leaf'] = True
        
        # Evita demasiada recursividad ( 5 niveles debe ser mas q suficiente ) 
        elif len ( fieldOcurrences ) > 5:
            myField['leaf'] = True
            
        else: 
            fieldOcurrences.append( field.name )

            fkFieldList= []
            model = field.rel.to
            for field in model._meta._fields():
                addFiedToList( fkFieldList,  field , fieldId + '__' , fieldOcurrences)
    
            myField['leaf'] = False 
            myField['children'] = fkFieldList
    

    fieldList.append( myField )
    
    
# --------------------------------------------------------------------------

def isFieldDefined( pFields , fName ):
    # Verifica si un campo esta en la lista 
    for pField  in pFields:
        if pField.get( 'name' ) == fName: 
            return True 
    return False 

