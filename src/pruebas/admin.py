# -*- coding: utf-8 -*-

from models import *  
from django.contrib  import admin           

import django.contrib.admin

class PruebaMAdmin(django.contrib.admin.ModelAdmin):

    protoExt = {'title': 'Maestro' }
    protoExt[ 'protoMenuIx' ] = 1 
    protoExt[ 'listDisplay' ] = ( 'prCode', 'prDescription', '__str__', 'id')
    protoExt[ 'readOnlyFields' ] = ( ) 

    protoExt[ 'searchFields' ] = ( 'prCode', 'prDescription' ) 
    protoExt[ 'sortFields' ] = ( 'prCode', 'prDescription' )
    
    # Valores iniciales ( initialFilter maneja el autoload )   
    protoExt[ 'initialSort' ] = () 
    protoExt[ 'initialFilter' ] = {}


#admin.site.register(PruebaM, PruebaMAdmin)
admin.site.register(PruebaM )





class PruebaAdmin(django.contrib.admin.ModelAdmin):

#TODO:  Definir Validations por campo 
#    validations: [{
#        type: 'length',
#        field: 'name',
#        min: 1
#    }]

 
    protoExt = {'protoIcon': 'property' }
    protoExt[ 'title' ] = 'Tableu de test'

    protoExt[ 'hideRowNumbers' ] = True 
    protoExt[ 'protoMenuIx' ] = 2 
    protoExt[ 'listDisplay' ] = ( 'id', 'prCode', 'prMaestro1','prMaestro1_id', 'prDescription') 

    protoExt[ 'protoFields' ] =  {        
#        'prInteger': {'subType' : 'stopLight', 'stoplightRY': 33 ,  'stoplightYG': 67}
     }

    protoExt[ 'protoViews' ] =  {        
        'prueba2': {
            'title' : 'Tableu de test (resume)', 
            'description' : 'Esta es la description del concpeto concepto', 
            'listDisplay' : ( 'prChoice', 'prInteger' ), 
            'protoMenuIx' : 3
            }
     }


admin.site.register(Prueba, PruebaAdmin)

#admin.site.register(Prueba )






                    