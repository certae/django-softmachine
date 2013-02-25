# -*- coding: utf-8 -*-

from protoLib.utilsBase import stripAccents
from viewTemplate import baseDefinition
from prototype.models import Entity

PROTO_PREFIX = "prototype.ProtoTable."



def getViewDefinition( pEntity, viewTitle  ):

    entityName = getViewCode( pEntity  )

    infoEntity = baseDefinition( pEntity, entityName, viewTitle  )
    infoEntity['gridConfig']['baseFilter'] = [ { 'property':'entity', 'filterStmt' : '=' + entityName } ]

    for pProperty in pEntity.propertySet.all():

        fName  = stripAccents( 'info__' + pProperty.code ) 
        
        field = property2Field( fName, pProperty.__dict__ )
        
        # hace las veces de __str__ 
        if pProperty.isUnique:
            infoEntity['returnField'] = fName 

        if pProperty.isForeign: 
            field["zoomModel"]= PROTO_PREFIX + getViewCode( pProperty.relationship.refEntity ) 
            field["fkId"]     = fName + "_id"
            field["type"]     = "foreigntext"


            infoEntity['fields'].append( getFkId( fName ) )
        
        infoEntity['fields'].append( field )

        if pProperty.isEssential or pProperty.isPrimary or pProperty.isRequired: 
            infoEntity['gridConfig']['listDisplay'].append( fName )
    
        infoEntity['formConfig']['items'][0]['items'].append( { "name": fName, "__ptType": "formField" } )

        
    #  __str__, __unicode__            
    if infoEntity.get( 'returnField', '' ) ==  '': 
        infoEntity['returnField'] = 'info' 
            
    return infoEntity

    
def getViewCode( pEntity, viewTitle = None ):
    if viewTitle is None: viewTitle = pEntity.code
    return stripAccents( pEntity.model.code + '-' + viewTitle )


def property2Field( fName, propDict, infoField = False, fBase = '' ):
    """ Genera la definicion del campo en la pci """
    
    field =  { 
        "name"    : fName,
        "header"  : propDict.get('code', fName),
        "readOnly": propDict.get('isReadOnly') ,
        "required": propDict.get('isRequired', False),
        "toolTip" : propDict.get('description',''), 
        "type"    : propDict.get('baseType', 'string')  
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
    