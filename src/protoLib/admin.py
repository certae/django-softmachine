# -*- coding: utf-8 -*-

from models import ProtoDefinition, ProtoBussinesUnit, ProtoGroup, ProtoSite, ProtoUdp, ProtoUser
from django.contrib  import admin           

import django.contrib.admin

class protoDefinitionAdmin(django.contrib.admin.ModelAdmin):

    protoExt = {'title': 'proto Definition' }
    protoExt[ 'protoMenuIx' ] = 1 
    protoExt[ 'listDisplay' ] = ( 'code', 'description', 'active', 'overWrite')
    protoExt[ 'readOnlyFields' ] = ( ) 

    protoExt[ 'searchFields' ] = ( 'code', 'description', 'metaDefinition' ) 
    protoExt[ 'sortFields' ] = ( 'code',  )
    
    protoExt[ 'initialSort' ] = () 
    protoExt[ 'initialFilter' ] = {}

    protoExt[ 'protoFields' ] =  { 
      'metaDefinition' : {},  
      'code': {'cellLink' : True,  'zoomModel' : '@cellValue' },
      }       
    
    protoExt[ 'protoSheetProperties' ] = (  'metaDefinition', )

    protoExt[ 'protoSheets' ] =   [        
            {
              'name'    : 'DEFAULT' ,                         
              'title'   : "meta",                        
              'template': '{{metaDefinition}}'  
              },
            ] 


admin.site.register(ProtoDefinition, protoDefinitionAdmin)


#admin.site.register(ProtoBussinesUnit)
#admin.site.register(ProtoGroup)
#admin.site.register(ProtoSite)
#admin.site.register(ProtoUdp)
#admin.site.register(ProtoUser)