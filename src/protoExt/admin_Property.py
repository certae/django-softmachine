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
#        'properties' : ( 'DEFINITION', 'TRANSMISSION', 'gabarit'), 
         }

    protoExt[ 'protoFields' ] =  {        
          'code': {'header' : 'Elm Donnee', 'type': 'CharField' ,  'sortable' : True, 'filterable' : True, 'width': 300 },
          'baseType' : {}, 
          'length' : {}, 
          'concept__code': {'header' : 'Concept', 'type': 'CharField' ,  'sortable' : True, 'filterable' : True, 'width': 300 },  
          'concept__model__code': {'header' : 'Model', 'type': 'CharField' ,  'sortable' : True, 'filterable' : True, 'width': 300 },  

            'isNullable':{ 'hidden' : False },
            'alias':{ 'hidden' : False },
            'description': { 'hidden' : False },
            'udp__DOCUMENTDEREFERENCE' :{ 'hidden' : False },
            'udp__FORMAT': { 'hidden' : False },
            'udp__GABARIT': { 'hidden' : False },
            'udp__DEFINITION': { 'hidden' : False },
            'udp__DESCRIPTIONCN': { 'hidden' : False },
            'udp__PRECISIONS': { 'hidden' : False },
            'udp__VALIDATION': { 'hidden' : False },
            'udp__VALIDATIONSSURELEMENT': { 'hidden' : False },
            'udp__VALIDATIONSINTERELEMENT': { 'hidden' : False },
            'udp__VALIDATION_INTER-ENREGISTREMENT': { 'hidden' : False },
            'udp__SOURCE_DE_DONNEES_EXTERNES': { 'hidden' : False },
            'udp__ELEMENTTRANSFORME': { 'hidden' : False },
            'udp__ELEMENTTRANSMIS': { 'hidden' : False },
            'udp__DOMAINEDEVALEURS': { 'hidden' : False },
            'udp__ENTREEENVIGUEUR': { 'hidden' : False },
            'udp__DATEDERNIREMODIFICATION': { 'hidden' : False },
            'udp__REQUISPAR': { 'hidden' : False },
            'udp__TRANSMISSION': { 'hidden' : False },
     }

    TEMPLATE = '<table id="ficha" border="0" cellpadding="3">'
    TEMPLATE += '<tr class="azul"><td class="negro">Nom de l''élément de donnée: </td><td>{{code}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro"> Nom de la vue de l''élément de donnée:</td><td>{{concept__model__code}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro"> Document de référence: </td><td class="desc">{{udp__DOCUMENTDEREFERENCE}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Alias: </td><td class="desc">{{alias}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Type de donnée: </td><td class="desc">{{baseType}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Longueur: </td><td class="desc">{{length}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Veleur nulle possible (oui,non)</td><td class="desc">{{isNullable}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Description: </td><td class="desc">{{description}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Format: </td><td class="desc">{{udp__FORMAT}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Gabarit: </td><td class="desc">{{udp__GABARIT}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Définition: </td><td class="desc">{{udp__DEFINITION}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Description CN: </td><td class="desc">{{udp__DESCRIPTIONCN}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro"> Précisions: </td><td class="desc">{{udp__PRECISIONS}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Validation: </td><td class="desc">{{udp__VALIDATION}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Validations sur l''élément: </td><td class="desc">{{udp__VALIDATIONSSURELEMENT}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Validations inter-élément: </td><td class="desc">{{udp__VALIDATIONSINTERELEMENT}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Validation inter-enregistrement: </td><td class="desc">{{udp__VALIDATION_INTER-ENREGISTREMENT}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Source de données externes: </td><td class="desc">{{udp__SOURCE_DE_DONNEES_EXTERNES}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Élément transformé: </td><td class="desc">{{udp__ELEMENTTRANSFORME}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Élément transmis: </td><td class="desc">{{udp__ELEMENTTRANSMIS}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Domaine de valeurs: </td><td class="desc">{{udp__DOMAINEDEVALEURS}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Entrée en vigueur: </td><td class="desc">{{udp__ENTREEENVIGUEUR}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Date de la dernière modification: </td><td class="desc">{{udp__DATEDERNIREMODIFICATION}}</td></tr>'
    TEMPLATE += '<tr class="blanco"><td class="negro">Requis par: </td><td class="desc">{{udp__REQUISPAR}}</td></tr>'
    TEMPLATE += '<tr class="azul"><td class="negro">Transmission: </td><td class="desc">{{udp__TRANSMISSION}}</td></tr>'
    TEMPLATE += '</table>'
    
    protoExt[ 'protoSheet' ] =  {        
          'properties': (   'code',
                            'concept__model__code',
                            'isNullable',
                            'udp__DOCUMENTDEREFERENCE',
                            'alias',
                            'baseType',
                            'length',
                            'description',
                            'udp__FORMAT',
                            'udp__GABARIT',
                            'udp__DEFINITION',
                            'udp__DESCRIPTIONCN',
                            'udp__PRECISIONS',
                            'udp__VALIDATION',
                            'udp__VALIDATIONSSURELEMENT',
                            'udp__VALIDATIONSINTERELEMENT',
                            'udp__VALIDATION_INTER-ENREGISTREMENT',
                            'udp__SOURCE_DE_DONNEES_EXTERNES',
                            'udp__ELEMENTTRANSFORME',
                            'udp__ELEMENTTRANSMIS',
                            'udp__DOMAINEDEVALEURS',
                            'udp__ENTREEENVIGUEUR',
                            'udp__DATEDERNIREMODIFICATION',
                            'udp__REQUISPAR',
                            'udp__TRANSMISSION',
                          ),   
          'template': TEMPLATE }  

