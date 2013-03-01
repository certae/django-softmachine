# -*- coding: utf-8 -*-

from protoLib.utilsBase import stripAccents
from viewTemplate import baseDefinition
from prototype.models import Entity

PROTO_PREFIX = "prototype.ProtoTable."


def getViewDefinition( pEntity, viewTitle  ):

    entityName = getViewCode( pEntity  )

    infoEntity = baseDefinition( pEntity, entityName, viewTitle  )
    infoEntity['gridConfig']['baseFilter'] = [ { 'property':'entity', 'filterStmt' : '=' + entityName } ]

    #para crear el campo __str__:  se arma con las llaves definidas como primarias o unicas 
    __str__Base = []
    infoEntity['gridConfig']['listDisplay'].append( '__str__' )

    for pProperty in pEntity.propertySet.all():

        fName  = stripAccents( 'info__' + pProperty.code ) 
        field = property2Field( fName, pProperty.__dict__ )

        if pProperty.isForeign: 
            field["zoomModel"]= PROTO_PREFIX + getViewCode( pProperty.relationship.refEntity ) 
            field["fkId"]     = fName + "_id"
            field["type"]     = "foreigntext"

            infoEntity['fields'].append( getFkId( fName ) )
        
        infoEntity['fields'].append( field )

        if pProperty.isPrimary:
            infoEntity['returnField'] = fName 

        # hace las veces de __str__ 
        if pProperty.isUnique or pProperty.isPrimary:
            __str__Base.append( fName )

        elif  pProperty.isEssential : 
            infoEntity['gridConfig']['listDisplay'].append( fName )

        # forma y ordenamiento    
        infoEntity['gridConfig']['sortFields'].append( fName )
        infoEntity['formConfig']['items'][0]['items'].append( { "name": fName, "__ptType": "formField" } )

    #  __str__, __unicode__
    field = {
        "flex": 1,
        "sortable": True,
        "name": "__str__",
        "fkId": "id",
        "zoomModel": PROTO_PREFIX + stripAccents( viewTitle  ),
        "cellLink": True,
        "header": viewTitle,
        "readOnly": True,
        "type": "string",
        "physicalName" : '@str(' + ','.join(__str__Base) + ')'
    }
    fName = '__str__'
    infoEntity['fields'].append( field )
    infoEntity['gridConfig']['sortFields'].append( fName )
            
    return infoEntity

    
def getViewCode( pEntity, viewTitle = None ):

    if viewTitle is None: viewTitle = pEntity.code
    return stripAccents( pEntity.model.code + '-' + viewTitle )


def property2Field( fName, propDict, infoField = False, fBase = '' ):
    """ Genera la definicion del campo en la pci """
    
    field =  { 
        "name"    : fName,
        "header"  : propDict.get('code', fName),
        "readOnly": propDict.get('isReadOnly', False) ,
        "required": propDict.get('isRequired', False),
        "tooltip" : propDict.get('description',''), 
        "vType"   : propDict.get('vType',''),   
        "type"    : propDict.get('baseType', 'string'), 
        "choices" : propDict.get('prpChoices', '') ,
        "prpDefault" : propDict.get('prpDefault', '') , 
        "prpLength"  : propDict.get('prpLength', '') , 
        "prpScale"   : propDict.get('prpScale', '') , 
        "crudType"   : propDict.get('crudType', '') , 
        
    }
    
    if infoField :  
        field["id"] = fBase + fName
        field["text"] = fName
        field["leaf"] = True
        field["checked"] = False
    return field 


def getFkId( fName, infoField = False, fBase = '' ):
    """ Crea el id de los zooms """ 

    fNameId = fName + "_id"
    field =  { 
        "fkField": fNameId, 
        "name"   : fNameId,
        "readOnly": True,
        "hidden": True,
        "type": "foreignid"
    }
    
    if infoField :  
        field["id"] = fBase + fNameId
        field["text"] = fNameId
        field["leaf"] = True
        field["checked"] = False
        
    return field 
  

#  ------------------------------------------------------------------

def GetProtoFieldsTree(  protoEntityId ):
    """  Obtiene la lista de campos q puedn heredarse de los zooms 
    """    
    
    fieldList = []
    try:
        pEntity = Entity.objects.get( id = protoEntityId )
    except: 
        return fieldList 
    
    addProtoFiedToList( fieldList,  pEntity , '' , '' )
    return fieldList 


        
def addProtoFiedToList( fieldList,  pEntity , fieldBase, zoomName   ): 
    """ Recorre los campos e itera con los fk ( solo un nivel 'fieldBase' )
    """    

    for pProperty in pEntity.propertySet.all():

        fName  = stripAccents( 'info__' + pProperty.code ) 

        field = property2Field( fName, pProperty.__dict__ , True,  fieldBase  )

        # Si es un campo heredado ( Se maneja ahora en la pci generada 
        if len( fieldBase ) > 0 :  
            field["cpFromZoom"] = 'info__' + zoomName   
            field["cpFromField"] = fName 
            field["required"] = False 
            field["readOnly"] = True 
            field["leaf"] = True

        elif pProperty.isForeign:
            # Agrega el Id  
            fieldList.append( getFkId( fName , True, fieldBase ))
            
            # Agrega los parametros del zoom 
            zoomEntity = pProperty.relationship.refEntity
            
            field["zoomModel"]= PROTO_PREFIX + getViewCode( zoomEntity  ) 
            field["fkId"]     = fName + "_id"
            field["type"]     = "foreigntext"

            fkFieldList= []
            addProtoFiedToList( fkFieldList, zoomEntity, fName, stripAccents( zoomEntity.code ) )

            field["leaf"] = False 
            field["children"] = fkFieldList
      
        fieldList.append( field )
        
    # agrega las props de seguridad         
    if len( fieldBase ) == 0 :  
        for fName in ['smOwningUser','smOwningTeam','smCreatedBy','smModifiedBy','smWflowStatus','smRegStatus','smCreatedOn','smModifiedOn']: 
            propDict = { "name" : fName, "readOnly": True }
            field = property2Field( fName, propDict, True  )
            fieldList.append( field )


#  ------------------------------------------------------------------


def GetDetailsConfigTree( protoEntityId ):
    
    lDetails = []

    try:
        pEntity = Entity.objects.get( id = protoEntityId )
    except: 
        return lDetails 
    
    # Details
    for pDetail in pEntity.fKeysRefSet.all():
        
        detail =  {
            "detailField": "info__" + stripAccents( pDetail.code ) + "_id",
            "conceptDetail": PROTO_PREFIX + getViewCode( pDetail.entity  ),
            "detailName": stripAccents( pDetail.entity.code ),
            "menuText": pDetail.entity.code ,
            "masterField": "pk", 
            
            "id" : stripAccents( pDetail.entity.code ) ,  
            "leaf" : True 
        }


                    
        lDetails.append( detail ) 
                
    return lDetails 
    