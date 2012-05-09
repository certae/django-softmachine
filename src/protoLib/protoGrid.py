# -*- coding: utf-8 -*-

#import sys 
#from django.forms.models import model_to_dict

from django.db import models
from django.contrib.admin.sites import  site

from django.conf import settings

from utilsBase import _PROTOFN_ , verifyStr, verifyList, verifyUdpDefinition
from protoField import  setFieldDict

class ProtoGridFactory(object):

    def __init__(self, model, view ):
            
        self.model = model              # the model to use as reference
        self.fields = []                # holds the extjs fields
        self.storeFields = ''           # holds the Query Fields
         
        self.view  = view 

        # Obtiene el nombre de la entidad 
        self.title = self.model._meta.verbose_name.title()

        #DGT Siempre existe, la creacion del site la asigna por defecto 
        self.model_admin = site._registry.get( model )

        self.protoAdmin = getattr(self.model_admin, 'protoExt', {})
        self.protoAdmin =  getProtoViewObj( self.protoAdmin, view   )
        
        self.protoFields = self.protoAdmin.get( 'protoFields', {}) 

        # lista de campos para la presentacion en la grilla 
        self.protoListDisplay = verifyList( self.protoAdmin.get( 'listDisplay', []) )
        if len( self.protoListDisplay ) == 0: 
            self.protoListDisplay = verifyList( getattr(self.model_admin , 'list_display', []))
        
        #Se leen los excluidos y se cargan en una sola coleccion 
        protoExclude = verifyList( self.protoAdmin.get( 'excludeFields', []) ) 
        protoExclude.extend ( verifyList( getattr(self.model_admin , 'exclude', [])) )

        #TODO: se leen los readonly fields para setear el attr readOnly = true 
        self.protoReadOnlyFields = verifyList( self.protoAdmin.get( 'readOnlyFields', []) )
        self.protoReadOnlyFields.extend( verifyList( getattr(self.model_admin , 'readonly_fields', [])) )  


        # Por defecto solo vienen  Chk, _str_
        try: self.protoListDisplay.remove('action_checkbox')
        except ValueError:  pass

#        try: self.protoListDisplay.remove('__str__')
#        except ValueError:  pass


#       WHY: Por alguna Ext no retiene el IdProperty ( idInternal al hacer click en las filas )     
#       idName = model._meta.pk.name   
        
        
        # La lista de campos del admin sirve de base, pues puede haber muchos mas campos en proto q en admin 
        if len( self.protoListDisplay ) > 0 :   
            for fName in self.protoListDisplay:
                if fName in protoExclude: continue
                try: field = self.model._meta.get_field(fName )
                except: continue
                setFieldDict (  self.protoFields , field )
                
        else:
            # Se crean los campos con base al modelo ( trae todos los campos del modelo 
            for field in self.model._meta._fields():
                if field.name in protoExclude: continue
                setFieldDict (  self.protoFields , field )


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
                except: pass 

            self.fields.append(fdict)
            self.storeFields +=  ',' + fdict['name'] 
            
        #Recorta la primera ','       
        self.storeFields = self.storeFields[1:]


    def getFieldSets(self):
        """ El field set determina la distribucion de los campos en la forma
        """ 
        
        prFieldSet = self.protoAdmin.get( 'protoFieldSet', []) 

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
def Q2Dict (  storeFields, pRows , cUDP ):
    """ 
        return the row list from given queryset  
    """

    rows = []
    storeFields =  tuple(storeFields[:].split(','))

    if cUDP.udpTable :
        lsProperties =  []
        for fName in storeFields:
            if fName.startswith( cUDP.propertyPrefix + '__'): lsProperties.append(fName)
                

#   Esta forma permite agregar las funciones entre ellas el __unicode__
    for item in pRows:
        rowdict = {}
        for fName in storeFields:
            # UDP Se evaluan despues 
            if cUDP.udpTable and fName.startswith( cUDP.propertyPrefix + '__'): 
                continue  
            
            #Es una funcion 
            if ( '__str__' in fName ):
                try: 
                    val = eval( 'item.__str__'  )
                    val = verifyStr(val , '' )
                except: val = 'fn?'

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
                except: val = 'fn?'

            # Campo del modelo                 
            else:
                try:
                    val = getattr( item, fName  )
                    if isinstance( val,models.Model): 
                        val = verifyStr(val , '' )
                except: val = 'vr?'
            
            rowdict[ fName ] = val
            
        
        if cUDP.udpTable:
            try: 
                bAux = eval ( 'item.' + cUDP.udpTable + '_set.exists()' ) 
            except: bAux = False 
            if bAux: 
                cllUpd = eval ( 'item.' + cUDP.udpTable + '_set.all()' ) 
                
                for lUpd in cllUpd:
                    prpGridName = cUDP.propertyPrefix + '__' + getattr( lUpd, cUDP.propertyName  , '') 
                    if prpGridName in lsProperties:
                        sAux = getattr( lUpd, cUDP.propertyValue, '' ).replace( '\n', '<br>').replace( '\r', '<br>')  
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


# Obtiene los campos visibles del modelo base, se usa como valor por defecto para los searchFields 
def getVisibleFields(  storeFields, model ):

    lFields = ''
    for fName in storeFields.split(','):
        try: field = model._meta.get_field(fName )
        except: continue
        
        if field.__class__.__name__ in ( 'CharField', 'TextField', 'IntegerField', ):
            lFields = ',' + fName  

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

def getProtoViewObj( protoAdmin, view   ):
#   Copia las propiedades de la vista en el protoAdmin 

    protoView = {}
    if view:
        # intenta leer la definicion de la vista             
        protoViews  = protoAdmin.get( 'protoViews', {})
        if protoViews:  
            protoView  = protoViews.get(  view, {})

    if protoView:
        protoCopy = protoAdmin.copy()
        for key in protoView: 
            # evitar recursividad en vistas 
            if key == 'protoViews': continue 
            protoCopy[ key ] = protoView[ key ]
          
        return protoCopy

    else: 
        return protoAdmin

