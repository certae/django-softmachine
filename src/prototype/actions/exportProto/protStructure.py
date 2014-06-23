# -*- coding: utf-8 -*-


_PROTOSTRUCTURE = {
  "version"  :"140222",

  "Project" : {
      "properties" : ["code","description","dbEngine","dbName","dbUser","dbPassword","dbHost","dbPort"],
      "details" : ["Model", ],
   },


    "Model" :{
      "properties" : ["code","category","modelPrefix","description"],
      "references" : ["projet"],
      "details" : ["Entity"],
    },

    "Entity" :{
      "properties" : ["code","dbName","description"],
      "references" : ["model"],
      "details" : ["Property" ],
    },

    "Property" :{
      "properties" : [
        "code","baseType","prpLength","prpScale",
        "prpDefault","prpChoices", "vType",
        "isReadOnly","isRequired","isNullable",
        "isPrimary","isLookUpResult", "isSensitive","isEssential",
        "crudType","dbName",
        "description","notes",
      ],
      "where" : [ { "isForeign" : False },  ],
      "references" : [ "entity" ],
      "details" : [],
    },

    "Relationship" :{
      "properties" : [
        "code", "relatedName", "isForeign", "prpDefault",
        "baseMin", "baseMax", "refMin", "refMax", "onRefDelete", "typeRelation",
        "isReadOnly","isRequired","isNullable",
        "isPrimary","isLookUpResult", "isSensitive","isEssential",
        "crudType","dbName",
        "description","notes",
      ],
      "references" : ["entity", "refEntity", ],
      "details" : [],
    },

    "PropertyModel" :{
      "properties" : [],
      "references" : ["model"],
      "details" : ["Property"],
    },

}


'''
Exportar vistas
'''

from protoLib.utilsBase import slugify, JSONEncoder, getClassName
from protoLib.models import ProtoDefinition

import json


def exportProtoJson(request, pModel ):

    cViews = {
     'code' :  pModel.code,
     'model':  slugify(pModel.code, '_'),
     'entities' : {},
    }

    for pEntity in pModel.entity_set.all():

        # Do not delete ( dgt )
        cEntity = {
          'code'  : pEntity.code,
          'entity' :  getClassName( pEntity.code ),
          'fullName' : cViews['model' ] + '.' + getClassName( pEntity.code ),
#          'properties' : {},
          'prototypes' : {},
          }

        cViews['entities'][ cEntity['code'] ]  = cEntity

#         Do not delete  ( dgt )
#         for pProperty in pEntity.property_set.all():
#
#
#             cProperty =  {
#                 'code'      : pProperty.code,
#                 'property'  : slugify(pProperty.code, '_'),
#                 'isForeign' : pProperty.isForeign,
#
#                 'baseType'   : pProperty.baseType,
#                 'prpLength'  : pProperty.prpLength,
#                 'prpScale'   : pProperty.prpScale,
#
#                 'isPrimary'   : pProperty.isPrimary,
#                 'isReadOnly'  : pProperty.isReadOnly,
#
#                 'isNullable'  : pProperty.isNullable,
#                 'isRequired'  : pProperty.isRequired,
#                 'isSensitive' : pProperty.isSensitive,
#                 'prpChoices'  : pProperty.prpChoices,
#                 'prpDefault'  : pProperty.prpDefault,
#                 'vType'       : pProperty.vType,
#
#                 'crudType'    : pProperty.crudType,
#                 'description' : pProperty.description,
#                 'notes'       : pProperty.notes,
#
#                 'dbName'      : pProperty.dbName,
#                 'isEssential' : pProperty.isEssential,
#                 'isLookUpResult' : pProperty.isLookUpResult,
#             }
#
#             #TODO: 'propertyModel'  :pProperty.propertyModel,
#
#             if pProperty.isForeign:
#                 cProperty[ 'refEntity' ]    = pProperty.relationship.refEntity.code
#                 cProperty[ 'refCode' ]      = getClassName( pProperty.relationship.refEntity.code )
#
#                 cProperty[ 'baseMax']       = pProperty.relationship.baseMax
#                 cProperty[ 'baseMin']       = pProperty.relationship.baseMin
#                 cProperty[ 'onRefDelete']   = pProperty.relationship.onRefDelete
#                 cProperty[ 'refMax']        = pProperty.relationship.refMax
#                 cProperty[ 'refMin']        = pProperty.relationship.refMin
#                 cProperty[ 'relatedName']   = pProperty.relationship.relatedName
#                 cProperty[ 'typeRelation']  = pProperty.relationship.typeRelation
#
#             cEntity['properties'][ cProperty['code'] ]  = cProperty


        for pPrototype in pEntity.prototype_set.all():

            # Migration proto - App
            sAux = pPrototype.metaDefinition.replace("info__","").replace("-","_" )
            sAux = sAux.replace("prototype.ProtoTable.","" )
            sAux = sAux.replace( '"' + slugify(pModel.code, '_') + '_', '"' + cViews['model' ] + '.' )

            cProto = json.loads( sAux )

            # Propiedades de base
            try:
                del cProto[ 'jsonField' ]
                del cProto[ 'protoEntity' ]
                del cProto[ 'protoEntityId' ]
                del cProto['__ptType']
            except:
                pass

            cProto[ 'localSort' ] = False
            cProto[ 'viewIcon' ]  = 'icon-1'
            cProto[ 'viewEntity' ] = cEntity[ 'fullName']

            # Elimina campos de control de prototypos y redirecciona zooms
            newFields = []
            for fld in cProto['fields'] :
                if fld['name'] in [ 'entity', 'entity_id', 'info' ]:
                    continue
                if fld['name'] == '__str__':
                    try:
                        del fld['cpFromZoom']
                        del fld['cpFromField']
                        del fld['physicalName']
                    except:
                        pass
                try:
                    del fld['__ptType']
                except: pass
                newFields.append( fld )

            cProto['fields'] = newFields

            cPrototype =  {
                'code'           : pPrototype.code,
                'description'    : pPrototype.description,
                'notes'          : cEntity[ 'fullName'],
                'metaDefinition' : cProto
            }

            cEntity['prototypes'][ cPrototype['code'] ]  = cPrototype

            # Creacion de la vista
            try:
                protoDef  = ProtoDefinition.objects.get_or_create(code = cProto[ 'viewCode' ] )[0]
                protoDef.active = True
                protoDef.overWrite = False
                protoDef.description  = cEntity.get('fullName','')  + ' - '  + cProto.get('viewCode','')  + '<br>'
                protoDef.description += cProto.get('shortTitle','')   + '<br>' + cProto.get( 'description','')

                protoDef.metaDefinition = json.dumps( cProto, cls = JSONEncoder )
                protoDef.save()

            except :
                pass


    return json.dumps( cViews , cls = JSONEncoder , sort_keys= True, indent = 4, separators=(',', ':') )