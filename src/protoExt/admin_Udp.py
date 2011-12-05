from models import *
import django.contrib.admin          
 
class UdpAdmin(django.contrib.admin.ModelAdmin):
    list_display =( 'id', 'metaObj', 'code', 'valueUdp' )
    list_filter = ( 'code', )
    search_fields = ( 'code', 'valueUdp')

    protoExt = {}
    protoExt[ 'description' ] = 'Esta es la description del concpeto concepto'
    protoExt[ 'menu_index' ] = 0
    

    # Define la apariencia de los campos en la grilla,  
    # model__code es un campo proveniente de un FK, ( absorbido, join ) 
    # upd__format es un campo proveniente de una propiedad personalizada ( UDP )  
    protoExt[ 'protoExclude' ] = ( 'metaObj', )           
    protoExt[ 'protoFields' ] =  {        
          'code': {'header' : 'Udp', 'type': 'CharField' ,  'sortable' : True, 'filterable' : True, 'width': 300 },
          'metaObj__code': {'header' : 'Poperty', 'type': 'CharField' ,  'sortable' : True, 'filterable' : True, 'width': 300 },  
          'metaObj__objType': {'header' : 'objType', 'type': 'CharField' ,  'sortable' : True, 'filterable' : True, 'width': 300 },  
          'metaObj__id': {'header' : 'metaObj Id', 'type': 'IntegerField' ,  'sortable' : True, 'filterable' : True},  
     }

    #TODO: Implementar el manejo de las vistas 
    protoExt['protoViews'] = [
            { 'viewName': 'default', 
              'viewFields': ( 'model__code', 'code',  'description',  'udp__format', 'udp__gabarit'  )},
                                ]

#-----------
