# -*- coding: utf-8 -*-

#import sys 
#from django.forms.models import model_to_dict

from django.db import models
from django.contrib.admin.sites import  site

from django.conf import settings

from utilsBase import _PROTOFN_ , verifyStr, verifyList, verifyUdpDefinition
from protoField import  setFieldDict

class ProtoGridFactory(object):

    def __init__(self, model  ):
            
        self.model = model              # the model to use as reference
        self.fields = []                # holds the extjs fields
        self.storeFields = ''           # holds the Query Fields
         

        # Obtiene el nombre de la entidad 
        self.title = self.model._meta.verbose_name.title()

        #DGT Siempre existe, la creacion del site la asigna por defecto 
        self.model_admin = site._registry.get( model )

        self.protoAdmin = getattr(self.model_admin, 'protoExt', {})
        self.protoFields = self.protoAdmin.get( 'protoFields', {}) 


        #UDPs para poder determinar el valor por defecto ROnly 
        self.pUDP = self.protoAdmin.get( 'protoUdp', {}) 
        cUDP = verifyUdpDefinition( self.pUDP )
        
        # lista de campos para la presentacion en la grilla 
        self.protoListDisplay = verifyList( self.protoAdmin.get( 'listDisplay', []) )
        if len( self.protoListDisplay ) == 0: 
            self.protoListDisplay = verifyList( getattr(self.model_admin , 'list_display', []))

            # Por defecto solo vienen  Chk, _str_
            try: self.protoListDisplay.remove('action_checkbox')
            except ValueError:  pass
    
            # Si solo queda el __str__ , lo elimina para q asuma todos los campos del modelo
            if (self.protoListDisplay[0] == '__str__'): self.protoListDisplay = []
        
        #Se leen los excluidos y se cargan en una sola coleccion 
        protoExclude = verifyList( self.protoAdmin.get( 'excludeFields', []) ) 
        protoExclude.extend ( verifyList( getattr(self.model_admin , 'exclude', [])) )

        #Se leen los readonly fields para setear el attr readOnly = true 
        self.protoReadOnlyFields = verifyList( self.protoAdmin.get( 'readOnlyFields', []) )
        self.protoReadOnlyFields.extend( verifyList( getattr(self.model_admin , 'readonly_fields', [])) )  


#       WHY: Por alguna Ext no retiene el IdProperty ( idInternal al hacer click en las filas )     
#       idName = model._meta.pk.name   
        
        
        # La lista de campos del admin sirve de base, pues puede haber muchos mas campos en proto q en admin 
        if len( self.protoListDisplay ) > 0 :   
            for fName in self.protoListDisplay:
                if fName in protoExclude: continue
                try:
                    # Recibe los parametros de los campos del modelo  
                    field = self.model._meta.get_field(fName )
                    setFieldDict (  self.protoFields , field )
                except: 
                    # Si no es parte del modelo, se asegura q exista en el diccionario
                    fdict = self.protoFields.get( fName, {} )
                    if not fdict: 
                        fdict['name'] = fName
                        self.protoFields[ fName ] = fdict
                        
                        # Si no es una UDP y no esta en diccionario debe ser ReadOnly 
                        if not (self.pUDP and fName.startswith( cUDP.propertyPrefix + '__')):  
                            fdict[ 'readOnly' ] = True
                
        else:
            # Se crean los campos con base al modelo ( trae todos los campos del modelo 
            for field in self.model._meta._fields():
                if field.name in protoExclude: continue
                setFieldDict (  self.protoFields , field )


        # Agrega el __str__ que sirve de base para los zooms
        key = '__str__' 
        if not self.protoFields.get( key , {}) :
            self.protoFields[ key ] = { 'name' : key , 'header' : 'metaDescription'}         

        # Genera la lista de campos y agrega el nombre al diccionario 
        for key in self.protoFields:        
            fdict = self.protoFields[ key ]
            if (fdict.get( 'name', '') == '') : fdict[ 'name' ] = key  

            if key in self.protoReadOnlyFields: fdict[ 'readOnly' ] = True

            # Repasa las propiedades de base, ver por q no esta pasando trayendo las props de base ( ie:  defaulValue )  
            if ((fdict.get( 'fromModel', False) == False ) and not ( key.startswith( 'udp__') )):
                try: 
                    field = self.model._meta.get_field( key )
                    setFieldDict ( self.protoFields , field )
                    fdict = self.protoFields[ key ]
                except: 
                    #Es posible q se puedan configuar propiedades no pertenecientes a la tabla como editables???
                    fdict[ 'readOnly' ] = True
                    pass 

            self.fields.append(fdict)
#            self.storeFields +=  ',' + fdict['name'] 
            
        #Recorta la primera ','       
#        self.storeFields = self.storeFields[1:]


    def getFieldSets(self):
        """ El field set determina la distribucion de los campos en la forma
        """ 
        
        prFieldSet = self.protoAdmin.get( 'protoForm', []) 

        # Si no han sido definido genera por defecto  
        if (len( prFieldSet )  == 0 ):

            # Toma la lista del field set si no existe lo crea de base, 
            baseFieldSet = verifyList( getattr(self.model_admin , 'fieldsets', []))
            
            
            if (len( baseFieldSet )  == 0 ):        
                # Genera la lista de campos y agrega el nombre al diccionario
#                prSection = { 'style' : 'Section', 'frame': True, 'autoScroll': True, 'fields' : [] }
                prSection = { 'style' : 'Section', 'autoScroll': True, 'fields' : [] }
                
                for key in self.protoFields:
                    vFld = self.protoFields.get( key , {})
                    if ( vFld.get( 'storeOnly', False )): continue        
                    prSection['fields'].append(key)

                prFieldSet.append ( prSection )
            
            # si existe un fieldset convierte la estructura                      
            else: 
                for name, opts in baseFieldSet:
#                    prSection = { 'style' : 'Section', 'frame': True, 'autoScroll': True, 'fields' : [] }
                    prSection = { 'style' : 'Section', 'autoScroll': True, 'fields' : [] }
                    
                    if ( name != None ): prSection.title = name  
                    for field in opts['fields']:
#                        if type(field) == tuple:
                        prSection['fields'].append(field)

                    classes = getattr( opts, 'classes', [] )
                    if ( 'collapse' in classes ): prSection['collapsible'] = True 

                    prFieldSet.append( prSection )
            
        return prFieldSet 
            

    def get_details(self):  

        # TODO: Agregar y probar m2m
        # TODO: Configuar el master, cuando es una tabla heredada, hay q buscar el parent oMeta.get_parent_list()  ( y si hay multi herencia ) 
        
        # Inicializa con los valores definidos,   
        details = self.protoAdmin.get( 'protoDetails', []) 

        # Si no han sido definido genera por defecto  
        if (len( details )  == 0 ):        
            opts = self.model._meta

            for rel in opts.get_all_related_objects(): # + opts.get_all_related_many_to_many_objects():
                oMeta = rel.model._meta         
                details.append({
                    "menuText"      : oMeta.verbose_name.title(), 
                    "conceptDetail" : oMeta.app_label + '.' + oMeta.object_name, 
                    "detailField"   : opts.module_name + '__pk',                    # rel.field.attname,
                    "masterField"   : 'pk',                                         #  oMeta.pk.name ,
                    })
    
            # Lo imprime en el debuger para poder copiarlo a la definicion 
            if settings.DEBUG: 
                print opts.object_name, details 
            
        return details 



# Obtiene el diccionario basado en el Query Set 
def Q2Dict (  protoMeta, pRows  ):
    """ 
        return the row list from given queryset  
    """

    pUDP = protoMeta.get( 'protoUdp', {}) 
    cUDP = verifyUdpDefinition( pUDP )
    rows = []

    # Identifica las Udps para solo leer las definidas en la META
    if cUDP.udpTable :
        lsProperties =  []
        for lField  in protoMeta['fields']:
            fName = lField['name']
            if fName.startswith( cUDP.propertyPrefix + '__'): lsProperties.append(fName)
                

#   Esta forma permite agregar las funciones entre ellas el __unicode__
    for item in pRows:
        rowdict = {}
        for lField  in protoMeta['fields']:
            fName = lField['name']

            # UDP Se evaluan despues 
            if cUDP.udpTable and fName.startswith( cUDP.propertyPrefix + '__'): 
                continue  
            
            #Es una funcion 
            if ( fName  == '__str__'   ):
                try: 
                    val = eval( 'item.__str__()'  )
                    val = verifyStr(val , '' )
                except: 
                    val = 'Id#' + verifyStr(item.pk, '?')

            elif ( _PROTOFN_ in fName ):
                try: 
                    val = eval( 'item.' + fName.replace( _PROTOFN_,'.') + '()'  )
                    val = verifyStr(val , '' )
                except: val = 'fn?'
                
            # Campo Absorbido
            elif ( '__' in fName ):
                try: 
                    val = eval( 'item.' + fName.replace( '__', '.'))
                    val = verifyStr(val , '' )
                except: val = '__?'

            # Campo del modelo                 
            else:
                try:
                    val = getattr( item, fName  )
                    if isinstance( val,models.Model): 
                        val = verifyStr(val , '' )
                except: val = 'vr?'
                
                # Evita el valor null en el el frontEnd 
                if val is None: val = ''
                
            rowdict[ fName ] = val
            
        
        if cUDP.udpTable:
            try: 
                bAux = eval ( 'item.' + cUDP.udpTable + '_set.exists()' ) 
            except: bAux = False 
            if bAux: 
                cllUDP = eval ( 'item.' + cUDP.udpTable + '_set.all()' ) 
                
                for lUDP in cllUDP:
                    prpGridName = cUDP.propertyPrefix + '__' + getattr( lUDP, cUDP.propertyName  , '') 
                    if prpGridName in lsProperties:
                        sAux = getattr( lUDP, cUDP.propertyValue, '' ).replace( '\n', '<br>').replace( '\r', '<br>')  
                        sAux = sAux.replace( '<br><br>', '<br>')
                        sAux = sAux.replace( '<td><br>', '<td>').replace( '</td><br>', '</td>')
                        sAux = sAux.replace( '<th><br>', '<th>').replace( '</th><br>', '</th>')
                        sAux = sAux.replace( '<tr><br>', '<tr>').replace( '</tr><br>', '</tr>')

                        sAux = sAux.replace( '<br><td>', '<td>').replace( '<br></td>', '</td>')
                        sAux = sAux.replace( '<br><th>', '<th>').replace( '<br></th>', '</th>')
                        sAux = sAux.replace( '<br><tr>', '<tr>').replace( '<br></tr>', '</tr>')

                        
                        rowdict[ prpGridName ] =  sAux 
                

        # Agrega la fila al diccionario
        #Agrega el Id Siempre como idInterno ( no representa una col, idProperty ) 
        rowdict[ 'id'] = item.pk 
        rows.append(rowdict)


    return rows


def getSearcheableFields(  model ):
# Obtiene los campos visibles del modelo base, se usa como valor por defecto para los searchFields 

    lFields = ''
    for field in model._meta._fields():
        if field.__class__.__name__ in ( 'CharField', 'TextField', 'IntegerField', ):
            lFields = ',' + field.name  

    #Recorta la primera ','       
    return lFields[1:].split(',')


    
def getProtoViewName( protoConcept   ):
#    Verifica si es una instancia del modelo ( vista )
#    Concept Format :    app.model.view 
#    Return :  app.model ,  view 

    if protoConcept.count(".") == 2:
        app, model, view = protoConcept.split(".")
        protoConcept = app + '.' +  model
    else: view = ''
    
    return protoConcept, view 


