# -*- coding: utf-8 -*-

from models import *  
from django.contrib  import admin           

import django.contrib.admin

class PruebaAdmin(django.contrib.admin.ModelAdmin):

#TODO:  Definir Validations por campo 
#    validations: [{
#        type: 'length',
#        field: 'name',
#        min: 1
#    }]

 
    protoExt = {'protoIcon': 'property' }
    protoExt[ 'title' ] = 'Tableau de bord'

    protoExt[ 'hideRowNumbers' ] = True 
    protoExt[ 'protoMenuIx' ] = 0 


    protoExt[ 'protoFields' ] =  {        
        'prInteger': {'subType' : 'stopLight', 'stoplightRY': 33 ,  'stoplightYG': 67}
     }

    protoExt[ 'protoViews' ] =  {        
        'prueba2': {
            'title' : 'prueba2', 
            'description' : 'Esta es la description del concpeto concepto', 
            'gridColumns' : ( 'prChoice', 'prInteger' )
            }
     }



admin.site.register(Prueba, PruebaAdmin)





                    