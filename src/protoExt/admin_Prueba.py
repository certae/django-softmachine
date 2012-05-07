# -*- coding: utf-8 -*-

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
        'prueba1': {}, 
        'prueba2': {
            'title' : 'prueba2', 
            'description' : 'Esta es la description del concpeto concepto', 
            'gridColumns' : ( 'prChoice', 'prInteger' )
            }
     }


#    protoExt[ 'gridColumns' ] = ( 'code', 'concept__model__code' )
#    protoExt[ 'readOnlyFields' ] = ( 'code', 'concept__model__code' ) 
#    protoExt[ 'searchFields' ] = ( 'code', 'concept__model__code' ) 
#    protoExt[ 'sortFields' ] = ( 'code', 'concept__model__code' )
#    protoExt[ 'baseFilter' ] = { 'isForeign': False  }
#    protoExt[ 'description' ] = 'Esta es la description del concpeto concepto'
    
    # Valores iniciales ( initialFilter maneja el autoload )   
#    protoExt[ 'initialSort' ] = ( 'code', 'concept__model__code', ) 
#    protoExt[ 'initialFilter' ] = {}
#    protoExt[ 'protoDetails' ] = [ 
#        {   'menuText': 'Propiétés d''élément de donnée', 
#            'conceptDetail': 'protoExt.Udp', 
#            'detailField': 'metaObj__pk', 
#            'masterField': 'pk'}, 
#        ]

#    protoExt[ 'protoUdp' ] =   { 
#        'udpTable': 'udp', 
#        'propertyName': 'code', 
#        'propertyValue': 'valueUdp', 
#        'propertyPrefix' : 'udp',           
#         }




                    