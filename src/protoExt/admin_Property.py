# -*- coding: utf-8 -*-
import django.contrib.admin          

class PropertyAdmin(django.contrib.admin.ModelAdmin):
    verbose_name_plural = 'Elements de donnees' 
    list_display =( 'code',  'description', )

    protoExt = {'protoIcon': 'property' }
    
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
            
          'udp__DEFINITION': {'header' : 'Definition', 'type': 'CharField', 'hidden' : True},  
          'udp__gabarit': {'header' : 'Gabarit', 'hidden' : True},  
     }

#    TEMPLATE =  '<b>Fiche Techinique</b><br>' 
#    TEMPLATE += 'Codigo      : {{code}}<br>'
#    TEMPLATE += 'Description : {{description}}<br>'  
#    TEMPLATE += 'Definition  : {{udp__DEFINITION}}'
    
    TEMPLATE =  '<h1>Fiche descriptive de l&#39;élément de donnée</h1><table border="0" cellpadding="3"><tr><th> Propriété </th><th> Description </th></tr><tr><td>Nom de l&#39;élément de donnée: </td><td>{{code}}</td></tr><tr><td> Nom de la vue de l&#39;élément de donnée:</td><td> Aqui va variable de la FK del nombre del modelo</td></tr><tr><td> Document de référence: </td><td>{{udp__DOCUMENT_DE_REFERENCE}<WBR>}</td></tr><tr><td>Alias: </td><td>{{alias}}</td></tr><tr><td>Type de donnée: </td><td>{{type}}</td></tr><tr><td>Longueur: </td><td>{{longueur}}</td></tr><tr><td>Veleur nulle possible (oui,non)</td><td> la variable de la valeur nulle</td></tr><tr><td>Description: </td><td>{{description}}</td></tr><tr><td>Format: </td><td>{{udp__FORMAT}}</td></tr><tr><td>Gabarit: </td><td>{{udp__GABARIT}}</td></tr><tr><td>Définition: </td><td>{{udp__DEFINITION}}</td></tr><tr><td>Description CN: </td><td>{{udp__DESCRIPTION_CN}}</td></tr><tr><td> Précisions: </td><td>{{udp__PRECISIONS}}</td></tr><tr><td>Validation: </td><td>{{udp__VALIDATION}}</td></tr><tr><td>Validations sur l&#39;élément: </td><td>{{udp__VALIDATIONS_SUR_LE_<WBR>ÉLÉMENT}}</td></tr><tr><td>Validations inter-élément: </td><td>{{udp__VALIDATIONS_INTER-<WBR>ELEMENT}}</td></tr><tr><td>Validation inter-enregistrement: </td><td>{{udp__VALIDATION_INTER-<WBR>ENREGISTREMENT}}</td></tr><tr><td>Source de données externes: </td><td>{{udp__SOURCE_DE_DONNEES_<WBR>EXTERNES}}</td></tr><tr><td>Élément transformé: </td><td>{{udp__ELEMENT_TRANSFORME}}</td></tr><tr><td>Élément transmis: </td><td>{{udp__ELEMENT_TRANSMIS}}</td></tr><tr><td>Domaine de valeurs: </td><td>{{udp__DOMAINE_DE_VALEURS}}</td></tr><tr><td>Entrée en vigueur: </td><td>{{udp__ENTREE_EN_VIGUEUR}}</td></tr><tr><td>Date de la dernière modification: </td><td>{{udp__DATE_DERNIRE_<WBR>MODIFICATION}}</td></tr><tr><td>Requis par: </td><td>{{udp__REQUIS_PAR}}</td></tr><tr><td>Transmission: </td><td>{{udp__TRANSMISSION}}</td></tr></table>'
    protoExt[ 'protoSheet' ] =  {        
          'properties': ( 'code', 'description', 'udp__DEFINITION'  ),   
          'template': TEMPLATE }  

