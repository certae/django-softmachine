# -*- coding: utf-8 -*-

from models import ProtoDefinition
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

    protoExt[ 'protoFields' ] =  { 'metaDefinition' : {} }       
    protoExt[ 'protoSheetProperties' ] = (  'metaDefinition', )

    protoExt[ 'protoSheets' ] =   {        
          'DEFAULT' : {                        
              'title'   : "meta",                        
              'template': '{{metaDefinition}}'  
              },
            } 

admin.site.register(ProtoDefinition, protoDefinitionAdmin)

