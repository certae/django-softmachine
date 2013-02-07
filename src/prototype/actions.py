# -*- coding: utf-8 -*-

import django.utils.simplejson as json

from datetime import datetime
from django.contrib import admin
from models import Model, Entity 

from protoLib.models import ProtoDefinition, CustomDefinition
from protoLib.protoActionEdit import setSecurityInfo 
from protoLib.utilsBase import JSONEncoder

def doModelPrototype( modeladmin, request, queryset ):
    """ 
    funcion para crear el prototipo sobre 'protoTable' con la definicion del diccionario
    a partir de Model  
    
    TODO:  MD, absorcion, Menu  
    """

#   Listade opciones definidas 
#    opts = modeladmin.opts 

#   El QSet viene con la lista de Ids  
    if queryset.count() == 0:
        return 'No record selected' 

#   Recorre los registros selccionados   
    for pModel in queryset:
        getEntities( pModel.entity_set.all() , request  )
        
    
doModelPrototype.short_description = "Create prototypes for the model"

# --------------------------------------------------------------------------------

def getEntities( queryset , request ):

    userProfile  = request.user.get_profile()   

#   Recorre los registros selccionados   
    for pEntity in queryset:
        infoEntity  = getProtoEntityDefinition ( pEntity, '' )
        protoOption = infoEntity[ 'protoOption' ]
        
        try:
            rec = CustomDefinition.objects.get(code = protoOption, owningHierachy  = userProfile.userHierarchy )
            created = False 
        except CustomDefinition.DoesNotExist:
            created = True 
            rec = CustomDefinition( code = protoOption )
        
        rec.metaDefinition = json.dumps( infoEntity, cls=JSONEncoder ) 
        rec.description = infoEntity['description'] 
        rec.active = True 
        
        setSecurityInfo( rec, {}, userProfile, created   )
        rec.save()


def getProtoEntityDefinition( pEntity, viewName ):
    
    infoEntity = baseDefinition( pEntity )
    infoEntity['gridConfig']['baseFilter'] = [ { 'property':'entity', 'filterStmt' : '=' + pEntity.code } ]

    for pProperty in pEntity.propertySet.all():

        fName = 'info__' + pProperty.code
        
        field = {
            "name"    : fName,
            "header"  : pProperty.code ,
            "readOnly": pProperty.isReadOnly,
            "required": pProperty.isRequired or not pProperty.isNullable ,
            "toolTip" : pProperty.description, 
            "type"    : "string"
        }

        # hace las veces de __str__ 
        if pProperty.isUnique:
            infoEntity['returnField'] = fName 

        if pProperty.isForeign: 
            field["zoomModel"]= "prototype.ProtoTable." + pProperty.relationship.code
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
            "detailField": "info__" + pDetail.code + "_id",
            "conceptDetail": "prototype.ProtoTable." + pDetail.entity.code,
            "detailName": pDetail.entity.code,
            "menuText": pDetail.entity.code.capitalize(),
            "masterField": "pk"
        }
                    
        infoEntity['protoDetails'].append ( detail ) 
                
            
    return infoEntity
    
        



def baseDefinition( pEntity ):
    
    return  {
    "__ptType": "pcl",
    "protoConcept": "prototype.ProtoTable",
    "protoOption" : "prototype.ProtoTable." + pEntity.code,
    "protoView"   : "prototype.ProtoTable." + pEntity.code, 
    "description" : pEntity.description ,
    "jsonField"   : "info" ,
    "protoIcon"   : "icon-1",
    "shortTitle"  : pEntity.code,
    "updateTime"  : datetime.now(),
    "metaVersion" : "13.0131",
    "idProperty"  : "id",
    "fields": [
        {
            "name": "id",
            "readOnly": True,
            "hidden": True,
            "type": "autofield"
        },
        {
            "name": "entity",
            "readOnly": True,
            "hidden": True,
            "defaultValue" : pEntity.code, 
        },
        {
            "name": "info",
            "searchable": True,
            "readOnly": True,
            "hidden": True,
            "type": "text",
        },               
        {
            "zoomModel": "auth.User",
            "name": "owningUser",
            "fkId": "owningUser_id",
            "readOnly": True,
            "type": "foreigntext"
        },
        {
            "name": "modifiedOn",
            "readOnly": True,
            "type": "datetime"
        },
        {
            "fkField": "createdBy",
            "name": "createdBy_id",
            "readOnly": True,
            "hidden": True,
            "type": "foreignid"
        },
        {
            "fkField": "owningUser",
            "name": "owningUser_id",
            "readOnly": True,
            "hidden": True,
            "type": "foreignid"
        },
        {
            "zoomModel": "protoLib.OrganisationTree",
            "name": "owningHierachy",
            "fkId": "owningHierachy_id",
            "readOnly": True,
            "type": "foreigntext"
        },
        {
            "name": "createdOn",
            "readOnly": True,
            "type": "datetime"
        },
        {
            "zoomModel": "auth.User",
            "name": "modifiedBy",
            "fkId": "modifiedBy_id",
            "readOnly": True,
            "type": "foreigntext"
        },
        {
            "name": "regStatus",
            "readOnly": True,
            "type": "string"
        },
        {
            "zoomModel": "auth.User",
            "name": "createdBy",
            "fkId": "createdBy_id",
            "required": True,
            "readOnly": True,
            "type": "foreigntext"
        },
        {
            "fkField": "owningHierachy",
            "name": "owningHierachy_id",
            "readOnly": True,
            "hidden": True,
            "type": "foreignid"
        },
        {
            "fkField": "modifiedBy",
            "name": "modifiedBy_id",
            "readOnly": True,
            "hidden": True,
            "type": "foreignid"
        },
        {
            "name": "wflowStatus",
            "readOnly": True,
            "type": "string"
        }
    ],
    "protoDetails": [],
    "gridConfig": {
        "listDisplay": [],
        "baseFilter": [],
        "searchFields": [ "info",],
        "sortFields": [],
        "hiddenFields": [ "id", "info", "entity" ],
        "readOnlyFields": [],
    },
    "protoForm": {
        "__ptType": "protoForm",
        "items": [
            {
                "__ptType": "fieldset",
                "fsLayout": "2col",
                "items": []
            },
            {
                "__ptType": "fieldset",
                "collapsible": True,
                "title": "Admin",
                "collapsed": True,
                "fsLayout": "2col",
                "items": [
                    {
                        "__ptType": "formField",
                        "name": "owningUser"
                    },
                    {
                        "__ptType": "formField",
                        "name": "owningHierachy"
                    },
                    {
                        "__ptType": "formField",
                        "name": "modifiedBy"
                    },
                    {
                        "__ptType": "formField",
                        "name": "createdBy"
                    },
                    {
                        "__ptType": "formField",
                        "name": "modifiedOn"
                    },
                    {
                        "__ptType": "formField",
                        "name": "createdOn"
                    },
                    {
                        "__ptType": "formField",
                        "name": "regStatus"
                    },
                    {
                        "__ptType": "formField",
                        "name": "wflowStatus"
                    }
                ]
            }
        ]
    }
}    
    