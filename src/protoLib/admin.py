# -*- coding: utf-8 -*-

from models import ProtoDefinition, ProtoBussinesUnit, ProtoGroup, ProtoSite, ProtoUser
from django.contrib  import admin           

import django.contrib.admin

class protoDefinitionAdmin(django.contrib.admin.ModelAdmin):

    protoExt = {'title': 'proto Definition' , 
                'gridConfig' : { 
                    'listDisplay' : ( 'code', 'description', 'active', 'overWrite'), 
                    'searchFields' : ( 'code', 'description', 'metaDefinition' ),  
                    'sortFields' :( 'code',  ) 
                    }, 

                # Incluye la metadefinicion ( no aparece en el listDisplay ) 
                # formatea el campo code para hacer el vinculo a una nueva forma. 
                'fields' : { 
                    'metaDefinition' : {},  
                    'code': {'cellLink' : True,  'zoomModel' : '@cellValue' },
                  },        
                
                "sheetConfig": {
                    'protoSheetProperties' :(  'metaDefinition', ), 
                    'protoSheets' :  [        
                            {
                              'name'    : 'DEFAULT' ,                         
                              'title'   : "meta",                        
                              'template': '{{metaDefinition}}'  
                              },
                            ] 
                    }
                }




admin.site.register(ProtoDefinition, protoDefinitionAdmin)


admin.site.register(ProtoBussinesUnit)
admin.site.register(ProtoGroup)
admin.site.register(ProtoSite)
admin.site.register(ProtoUser)