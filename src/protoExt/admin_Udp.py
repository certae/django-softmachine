from models import *
import django.contrib.admin          
 
class UdpAdmin(django.contrib.admin.ModelAdmin):
    list_display =( 'id', 'metaObj', 'code', 'valueUdp' )
    list_filter = ( 'code', )
    search_fields = ( 'code', 'valueUdp')

#   N'est pas inclu dans le menu 
    protoExt = {}
#    protoExt[ 'protoMenuIx' ] = -1 
    protoExt[ 'description' ] = 'Esta es la description del concpeto concepto'
    

    # Define la apariencia de los campos en la grilla,  
    # model__code es un campo proveniente de un FK, ( absorbido, join ) 
#    protoExt[ 'excludeFields' ] = ( 'metaObj', )           
    protoExt[ 'protoFields' ] =  {        
          'code': {'header' : 'Udp',  'width': 300 },
          'metaObj__code': {'header' : 'Poperty',   'width': 300 },  
#         'metaObj__objType': {'header' : 'objType',  'width': 300 },  
          'metaObj__id': {'header' : 'metaObj Id',  },  
     }

    #TODO: Implementar el manejo de las vistas 
    protoExt['listDisplaySet'] = { 'default' :  ( 'code',  'valueUdp' )}

#-----------
