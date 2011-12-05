from models import *
import django.contrib.admin          

class PropertyAdmin(django.contrib.admin.ModelAdmin):
    verbose_name_plural = 'Elements de donnees' 
    list_display =( 'id',  'code',  'description', )
    list_filter = ( 'concept__model', )
    search_fields = ( 'code', 'superProperty', 'alias') 
    fieldsets = (
        (None, {
            'fields': [ ( 'concept', 'code', ) ]
        }),
    )

    inlines = [
        UpdInline,
        ]

    protoExt = {}
    
    protoExt[ 'protoDetails' ] = [
        {'menuText': 'Udp', 'conceptDetail': 'protoExt.Udp', 'detailField': 'metaObj__pk', 'masterField': 'pk'}, 
        ]

    # Define el manejo de propiedades extendidas ( User defined properties 'UDP'
    # Debe existir una FKey en la tabla UDP apuntando hacia la tabla de base 
    # 'udpFk': 'metaObj',  'basePk': 'id', Son Mapeados por el ORM     
    protoExt[ 'protoUdp' ] =   { 
        'udpTable': 'udp', 
        'propertyName': 'code', 
        'propertyValue': 'valueUdp', 
        'propertyPrefix' : 'udp',           # Las referencias a los campos estaran precedidas por [prefix]__ 
        'properties' : ( 'DEFINITION', 'TRANSMISSION', 'gabarit'), 
         }

    protoExt[ 'protoFields' ] =  {        
          'code': {'header' : 'Elm Donnee', 'type': 'CharField' ,  'sortable' : True, 'filterable' : True, 'width': 300 },
          'concept__code': {'header' : 'Concept', 'type': 'CharField' ,  'sortable' : True, 'filterable' : True, 'width': 300 },  
          'concept__model__code': {'header' : 'Model', 'type': 'CharField' ,  'sortable' : True, 'filterable' : True, 'width': 300 },  
            
          'udp__DEFINITION': {'header' : 'Definition', 'type': 'CharField' , 'width': 300 },  
          'udp__gabarit': {'header' : 'Gabarit', },  
     }

    TEMPLATE =  'Fiche Techinique<br>' 
    TEMPLATE += 'Codigo      : {{code}}<br>'
    TEMPLATE += 'Description : {{description}}<br>'  
    TEMPLATE += 'Definition  : {{udp__DEFINITION}}'
    
    protoExt[ 'protoSheet' ] =  {        
          'properties': ( 'code', 'description', 'udp__DEFINITION'  ),   
          'template': TEMPLATE }  
    