# -*- coding: utf-8 -*-

from django.http import HttpResponse
from protoGrid import  getBaseModelName, setDefaultField , getProtoAdmin
from protoLib import protoGrid
from protoField import  setFieldDict, isAdmField
from models import getDjangoModel, ProtoDefinition, CustomDefinition 
from utilsBase import getReadableError, copyProps
from utilsWeb import JsonError, JsonSuccess 

from protoActionEdit import setSecurityInfo
from protoQbe import getSearcheableFields

from protoAuth import getUserProfile, getModelPermissions

import django.utils.simplejson as json
import traceback


#TODO: Vistas parametrizadas por el usuario ( custom ) 


# 12/10/28 Permite la carga directa de json de definicion. 
PROTOVERSION = '130206'


def protoGetPCI(request):
    """ return full metadata (columns, renderers, totalcount...)
    """
    
    if request.method != 'POST':
        return JsonError( 'invalid message' ) 
    
    viewCode = request.POST.get('viewCode', '') 
    viewEntity  = getBaseModelName( viewCode )
    
    try: 
        model = getDjangoModel(viewEntity)
    except :
        return JsonError( 'model not found:' + viewEntity ) 
    
    # 
    userProfile = getUserProfile( request.user, 'getPci', viewEntity  ) 


    # PROTOTIPOS 
    if viewEntity == 'prototype.ProtoTable' and viewEntity != viewCode :
        try:
            protoDef = CustomDefinition.objects.get(code = viewCode, smOwningTeam  = userProfile.userTeam )
            created = False 
        except:
            jsondict = { 'success':False, 'message': viewCode + ' notFound' } 
            return HttpResponse( json.dumps( jsondict), mimetype="application/json")

    else:
        # created : El objeto es nuevo
        # protoDef : PCI leida de la DB 
        protoDef, created = ProtoDefinition.objects.get_or_create(code = viewCode )
    
    
    # Verifica si es una version vieja 
    if created: 
        protoDef.overWrite = True
#    else: 
#        protoMeta = json.loads( protoDef.metaDefinition ) 
#        version = protoMeta.get( 'metaVersion' )
#        if ( version is None ) or ( version < PROTOVERSION ):
#            created = True 
    
    # Si es nuevo o no esta activo lee Django 
    if created or ( not protoDef.active   ) :

        model_admin, protoMeta  = getProtoAdmin( model )
        version = protoMeta.get( 'metaVersion' )

        # La version determina q es una carga completa de la meta y no es necesario reconstruirla
        # solo en caso de q la definicion no este en la Db        
        if ( version is None ) or ( version < PROTOVERSION ): 

            # Verifica si existe una propiedad ProtoMeta es la copia de la meta cargada a la Db,
            grid = protoGrid.ProtoGridFactory( model, viewCode, model_admin, protoMeta )
            protoMeta = createProtoMeta( model, grid, viewEntity, viewCode  )
    
        # Guarda la Meta si es nuevo o si se especifica overWrite
        if  created or protoDef.overWrite: 
            protoDef.metaDefinition = json.dumps( protoMeta ) 
            protoDef.description = protoMeta['description'] 
            protoDef.save()    


    else:
        protoMeta = json.loads( protoDef.metaDefinition ) 
        protoMeta['viewCode'] = viewCode  

    
    # La definicion del arbol es fija, pues las cols deben ser siempre uniformes sin importar el tipo de modelo.
#    pStyle = protoMeta.get( 'pciStyle', '')      
#    if pStyle == 'tree':  setTreeDefinition()


    customCode = '_custom.' + viewCode 
    try:
        custom = CustomDefinition.objects.get(code = customCode, smOwningTeam  = userProfile.userTeam )
        custom = json.loads( custom.metaDefinition )
        protoMeta['custom'] = custom['custom']  
    except: pass
    
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
        'permissions': getModelPermissions( request.user, model ),
        
        'rows':[],
        'totalCount': 0, 
    }
    
    # Codifica el mssage json 
    context = json.dumps( jsondict)
    return HttpResponse(context, mimetype="application/json")



# protoGetPCI ----------------------------


def createProtoMeta( model, grid, viewEntity , viewCode ):


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
             'baseFilter': grid.gridConfig.get( 'baseFilter', []),
             'initialFilter': grid.gridConfig.get( 'initialFilter', []),

             # Toma las definidas en la grilla 
             'listDisplay' : grid.gridConfig.get( 'listDisplay', []),
             'readOnlyFields' : grid.gridConfig.get( 'readOnlyFields', []),
             
             # Garantiza q existan en la definicion 
             'hideRowNumbers' : grid.gridConfig.get( 'hideRowNumbers',False),  
             'filterSetABC': grid.gridConfig.get( 'filterSetABC', ''),

             'hiddenFields': grid.protoMeta.get( 'hiddenFields', ['id', ]),
         } 


    #---------- Ahora las propiedades generales de la PCI 
    viewIcon  = grid.protoMeta.get( 'viewIcon', 'icon-1') 

    pDescription = grid.protoMeta.get( 'description', '')
    if len(pDescription) == 0:  pDescription = grid.protoMeta.get( 'title', grid.title)
    
    #FIX: busca el id en la META  ( id_field = model._meta.pk.name ) 
    id_field = u'id'

    protoTmp = { 
         'metaVersion' : PROTOVERSION ,
         'viewCode' : viewCode,           
         'viewEntity' : viewEntity,           
         'idProperty': grid.protoMeta.get( 'idProperty', id_field ),
         'shortTitle': grid.protoMeta.get( 'shortTitle', grid.title ),
         'description': pDescription ,
         'viewIcon': viewIcon,

         'fields': grid.fields, 
         'gridConfig' : gridConfig,  
         'gridSets': grid.protoMeta.get( 'gridSets', {}),

         'detailsConfig': grid.get_details() , 
         'formConfig': grid.getFieldSets(),  

#        El resto  no las carga pues ya estan en la meta ... 
         }
    

    return copyProps( grid.protoMeta, protoTmp ) 
    

# ------------------------------------------------------------------------


def protoSaveProtoObj(request):
    """ Save full metadata
    
    * objetos del tipo _XXX                   se guardan siempre en customDefinition 
    * objetos del tipo prototype.protoTable   se guardan siempre en customDefinition
     
    * Solo los adminstradores tienen el derecho de guardar pcls
    
    custom :  Los objetos de tipo custom, manejan la siguiente llave 
    
        _ColSet.[viewCode]        listDisplaySet  
        _QrySet.[viewCode]        filterSet
        _menu 
    
    Para manejar el modelo en las generacion de protoPci's  se usa :
    
        prototype.protoTable.[protoModel-viewCode]  --> al leer la pcl se leera prototype.protoTable.[protoModel-viewCode]
    
    """

    if request.method != 'POST':
        return JsonError( 'invalid message' ) 

    custom = False  
    viewCode = request.POST.get('viewCode', '')

    userProfile = getUserProfile( request.user, 'saveObjs', viewCode  ) 

    # Reglas para definir q se guarda  
    if viewCode.find( '_' ) == 0  :  custom = True 
    if viewCode.find( 'prototype.ProtoTable.' ) == 0  :  custom = True 

    # Carga la meta 
    sMeta = request.POST.get('protoMeta', '')
    
    # Es customProperty 
    if custom: 

        try:
            protoDef, created = CustomDefinition.objects.get_or_create(code = viewCode, smOwningTeam = userProfile.userTeam )
        except Exception as e:
            return JsonError(  getReadableError( e ) ) 
            
        setSecurityInfo( protoDef, {}, userProfile, created  )

    # Solo los administradores pueden cargar en protoDefinition 
    elif request.user.is_superuser: 

        try:
            protoDef, created = ProtoDefinition.objects.get_or_create(code = viewCode )
        except Exception as e:
            return JsonError(  getReadableError( e ) ) 

        # borra el custom por q confunde haecer modif en un lado y otro 
        try:
            CustomDefinition.objects.filter(code = '_custom.' + viewCode, smOwningTeam = userProfile.userTeam ).delete()
        except:  pass


    else: return JsonError('Q paso, como llego aqui?') 
 
    # El default solo parece funcionar al insertar en la Db
    protoDef.active = True 
    protoDef.overWrite = False 
    protoDef.metaDefinition = sMeta 
    protoDef.save()    

    return  JsonSuccess( { 'message': 'Ok' } )


def protoGetFieldTree(request):
    """ return full field tree 
    """

    if request.method != 'POST':
        return JsonError('Invalid message') 
    
    viewCode = request.POST.get('viewCode', '') 
    viewEntity  = getBaseModelName( viewCode )
    
    try: 
        model = getDjangoModel(viewEntity)
    except Exception as e:
        return JsonError(  getReadableError( e ) ) 
    
    fieldList = []
    if viewEntity == 'prototype.ProtoTable' and viewEntity != viewCode :
        # -----------------------------------------------------------------------------------------------------
        # Prototipos 
        protoEntityId = request.POST.get( 'protoEntityId' )
        if not protoEntityId >= 0: return JsonError( 'invalid idEntity')

        try:  
            from prototype.actions.viewDefinition import GetProtoFieldsTree
            fieldList = GetProtoFieldsTree(  protoEntityId )
        except: 
            return JsonError( 'invalid idEntity')

    else: 
        
        # -----------------------------------------------------------------------------------------------------
        # Se crean los campos con base al modelo ( trae todos los campos del modelo 
        for field in model._meta._fields():
            try: 
                addFiedToList( fieldList,  field , ''  )
            except Exception as  e:
                traceback.print_exc()
                return JsonError( getReadableError( e ) ) 
            
        # Add __str__ 
        myField = { 
            'id'        : '__str__' ,  
            'text'      : '__str__' , 
            'checked'   : False,       
            'leaf'      : True 
         }
        
        # Defaults values
        setDefaultField( myField, model , viewCode)
        
        # FormLink redefinition to original view 
        # myField['zoomModel'] =  viewCode  
        
        fieldList.append( myField )

        
    # Codifica el mssage json 
    context = json.dumps( fieldList )
    return HttpResponse(context, mimetype="application/json")



def addFiedToList(  fieldList , field, fieldBase   ):
    """ return parcial field tree  ( Called from protoGetFieldTree ) 
    """

    fieldId = fieldBase + field.name

    # DEfinicion proveniente del dict ( setFieldDict )  
    protoFields = {}
    setFieldDict ( protoFields , field )
    pField = protoFields[ field.name ]
    
    # fieldBase indica campos de llaves foraneas       
    if fieldBase != '': 
        # Los campos heredados son siempre ro y no requeridos  
        pField[ 'readOnly' ] = True 
        pField['required'] = False 
        if pField['type'] == 'autofield': pField['type'] = 'int'

    pField['id']  = fieldId
    pField['text'] =  field.name

    pField['leaf'] = True
    pField['checked'] = False

    # Recursividad Fk 
    if pField['type'] != 'foreigntext':
        pass 

    # no se requiere profundizar en los campos de seguridad ( usr, ... )   
    elif isAdmField( field.name  ): 
        pass 

    # Evita demasiada recursividad ( 5 niveles debe ser mas q suficiente ) 
    elif fieldId.count( '__' ) > 3:   
        pass 

    else:  

        # si es base, Agrega el campo id del zoom   
        # en los campos heredados no se hace zoom ( no se requiere el id )   
        if ( fieldBase == '') :  

            # Obtiene el fkId del diccionario  
            pFieldId = protoFields[ pField['fkId'] ]

            pFieldId['id']  = pFieldId['name']
            pFieldId['text'] =  pFieldId['name']  
            pFieldId['required'] = pField.get( 'required', False )   

            pFieldId['leaf'] = True
            pFieldId['checked'] = False
    
            fieldList.append( pFieldId )

        # itera sobre el campo para heredar de sus padres  
        fkFieldList= []
        model = field.rel.to
        for fAux in model._meta._fields():
            # los id de los campos heredados tampoco se presentan 
            if fAux.name  == 'id' :  continue 
            
            # los campos adm de los heredados no se presentan  
            if isAdmField( fAux.name ): continue 
            
            addFiedToList( fkFieldList,  fAux , fieldId + '__' )

        pField['leaf'] = False 
        pField['children'] = fkFieldList
    
    fieldList.append( pField )


# --------------------------------------------------------------------------

def isFieldDefined( pFields , fName ):
    # Verifica si un campo esta en la lista 
    for pField  in pFields:
        if pField.get( 'name' ) == fName: 
            return True 
    return False 

