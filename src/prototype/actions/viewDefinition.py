# -*- coding: utf-8 -*-

from protoLib.utilsBase import stripAccents
from viewTemplate import baseDefinition

PROTO_PREFIX = "prototype.ProtoTable."

def getViewDefinition( pEntity, viewTitle  ):

    entityName = getViewCode( pEntity  )
    
    infoEntity = baseDefinition( pEntity, entityName, viewTitle )
    infoEntity['gridConfig']['baseFilter'] = [ { 'property':'entity', 'filterStmt' : '=' + entityName } ]

    for pProperty in pEntity.propertySet.all():

        fName  = stripAccents( 'info__' + pProperty.code ) 
        
        field = {
            "name"    : fName,
            "header"  : pProperty.code ,
            "readOnly": pProperty.isReadOnly,
            "required": pProperty.isRequired or not pProperty.isNullable,
            "toolTip" : pProperty.description or '', 
            "type"    : pProperty.baseType or 'string'
        }

        # Si es un campo heredado ( Se maneja ahora en la pci generada, estos campos fueron suprimidos del modelo 
        #if len( pProperty.cpFromModel or '' ) > 0 and len( pProperty.cpFromField or '' ) > 0 :  
        #    field["cpFromModel"] = 'info__' + stripAccents( pProperty.cpFromModel )   
        #    field["cpFromField"] = 'info__' + stripAccents( pProperty.cpFromField ) 
        #    # un campo heredado no tiene por q ser requerido   
        #    del field[ "required" ]

        # hace las veces de __str__ 
        if pProperty.isUnique:
            infoEntity['returnField'] = fName 

        if pProperty.isForeign: 
            field["zoomModel"]= PROTO_PREFIX + getViewCode( pProperty.relationship.refEntity ) 
            field["fkId"]     = fName + "_id"
            field["type"]     = "foreigntext"
            
            #No es ncesario pues el modelo tiene su filtro de base
            #field["zoomFilter"]= [{'property':'entity', 'filterStmt' : pEntity.code } ]

            fieldId = {
                "fkField": fName, 
                "name"   : fName + "_id",
                "readOnly": True,
                "hidden": True,
                "type": "foreignid"
            }

            infoEntity['fields'].append( fieldId )
        
        infoEntity['fields'].append( field )

        if pProperty.isEssential or pProperty.isPrimary or pProperty.isRequired: 
            infoEntity['gridConfig']['listDisplay'].append( fName )
    
        infoEntity['protoForm']['items'][0]['items'].append( { "name": fName, "__ptType": "formField" } )

        
    #  __str__, __unicode__            
    if infoEntity.get( 'returnField', '' ) ==  '': 
        infoEntity['returnField'] = 'info' 
            

    # Details
    for pDetail in pEntity.fKeysRefSet.all():
        
        detail =  {
            "detailField": "info__" + stripAccents( pDetail.code ) + "_id",
            "conceptDetail": PROTO_PREFIX + getViewCode( pDetail.entity  ),
            "detailName": stripAccents( pDetail.entity.code ),
            "menuText": pDetail.entity.code ,
            "masterField": "pk"
        }
                    
        infoEntity['protoDetails'].append( detail ) 
                
            
    return infoEntity
    
def getViewCode( pEntity, viewTitle = None ):
    if viewTitle is None: viewTitle = pEntity.code
    return stripAccents( pEntity.model.code + '-' + viewTitle )
