# -*- coding: utf-8 -*-

#import sys 
#from django.forms.models import model_to_dict
#from django.conf import settings

from django.db import models
from django.contrib.admin.sites import  site


from utilsBase import _PROTOFN_ , verifyStr, verifyList, verifyUdpDefinition, copyProps 
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

        # Si no esta registrado genera una definicion en blanco         
        if not self.model_admin: 
            self.model_admin = {} 

        self.protoAdmin = getattr(self.model, 'protoExt', {})
        self.protoAdmin = copyProps( self.protoAdmin, getattr(self.model_admin, 'protoExt', {}) ) 
        
        self.protoFields = self.protoAdmin.get( 'protoFields', {}) 


        #UDPs para poder determinar el valor por defecto ROnly 
        self.pUDP = self.protoAdmin.get( 'protoUdp', {}) 
        cUDP = verifyUdpDefinition( self.pUDP )
        
        # lista de campos para la presentacion en la grilla 
        self.protoListDisplay = verifyList( self.protoAdmin.get( 'listDisplay', []) )
        if not self.protoListDisplay: 
            self.protoListDisplay = verifyList( getattr(self.model_admin , 'list_display', []))

            # Por defecto solo vienen  Chk, _str_
            try: self.protoListDisplay.remove('action_checkbox')
            except ValueError:  pass
    
            # if self.protoListDisplay and (self.protoListDisplay[0] == '__str__'): self.protoListDisplay = []
        
        #Se leen los excluidos y se cargan en una sola coleccion 
        protoExclude = verifyList( self.protoAdmin.get( 'excludeFields', []) ) 
        protoExclude.extend ( verifyList( getattr(self.model_admin , 'exclude', [])) )

        #Se leen los readonly fields para setear el attr readOnly = true 
        self.protoReadOnlyFields = verifyList( self.protoAdmin.get( 'readOnlyFields', []) )
        self.protoReadOnlyFields.extend( verifyList( getattr(self.model_admin , 'readonly_fields', [])) )  


#       WHY: Por alguna Ext no retiene el IdProperty ( idInternal al hacer click en las filas )     
#       idName = model._meta.pk.name   
        
        
        # La lista de campos del admin sirve de base, pues puede haber muchos mas campos en proto q en admin
        # Si solo queda el __str__ , asume todos los campos del modelo
            
        iCount = len( self.protoListDisplay )  
        if ( iCount == 0  ) or ( iCount == 1 and (self.protoListDisplay[0] == '__str__')) :
            # Se crean los campos con base al modelo ( trae todos los campos del modelo )
            for field in self.model._meta._fields():
                if field.name in protoExclude: continue
                setFieldDict (  self.protoFields , field )

            for field in self.model._meta._many_to_many():
                if field.name in protoExclude: continue
                setFieldDict (  self.protoFields , field )

        else : 
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

                        if fName == '__str__':
                            setDefaultField( fdict, self.model  )
                                                        
                        # Si no es una UDP y no esta en diccionario debe ser ReadOnly 
                        if not (self.pUDP and fName.startswith( cUDP.propertyPrefix + '__')):  
                            fdict[ 'readOnly' ] = True
                


        # Agrega el __str__ que sirve de base para los zooms
        fName = '__str__' 
        fdict = self.protoFields.get( fName , {}) 
        if not fdict: 
            fdict['name'] = fName
            self.protoFields[ fName ] = fdict
            
            setDefaultField ( fdict, self.model  )
             

        # Genera la lista de campos y agrega el nombre al diccionario 
        for key in self.protoFields:        
            fdict = self.protoFields[ key ]
            if (fdict.get( 'name', '') == '') : fdict[ 'name' ] = key  

            if key in self.protoReadOnlyFields: fdict[ 'readOnly' ] = True

            # TODO: Repasa las propiedades de base, ver por q no esta pasando trayendo las props de base ( ie:  defaulValue )  
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

                prItems = []                
                prTexts = []
                prChecks = []
                prN2N = []
                prIds = []
                                
                for key in self.protoFields:
                    vFld = self.protoFields.get( key , {})
                    fType = vFld.get( 'type', 'string' )
                    
                    if ( vFld.get( 'storeOnly', False )): continue
                    
                    if ( fType == 'text') :
                        prTexts.append( { 'name' : key  , '__ptType' : 'formField'} ) 
                         
                    elif ( fType in ['autofield', 'foreignid'] ) :
                        prIds.append( { 'name' : key  , '__ptType' : 'formField'} )

                    elif ( fType  == 'bool' ) :
                        prChecks.append( { 'name' : key  , '__ptType' : 'formField'} )

                    elif ( fType == 'protoN2N' ) :
                        prN2N.append( { 'name' : key  , '__ptType' : 'formField'} )

#                    elif ( vFld.get( 'name', '' )  == '__str__' ) :
#                        prTexts.insert( 0, { 'name' : key  , '__ptType' : 'formField'} )
                         
                    else:  
                        prItems.append( { 'name' : key  , '__ptType' : 'formField'} )


                if prItems : 
                    prSection = { '__ptType' : 'fieldset','fsLayout' : '2col'  }
                    prSection['items'] = prItems 
                    prFieldSet.append ( prSection )

                if prChecks : 
                    prSection = { '__ptType' : 'fieldset','fsLayout' : '2col'  }
                    prSection['items'] = prChecks 
                    prFieldSet.append ( prSection )

                if prN2N : 
                    prSection = { '__ptType' : 'fieldset','fsLayout' : '1col'  }
                    prSection['items'] = prN2N 
                    prFieldSet.append ( prSection )

                if prTexts : 
                    prSection = { '__ptType' : 'fieldset','fsLayout' : '1col'  }
                    prSection['items'] = prTexts 
                    prFieldSet.append ( prSection )

                if prIds : 
                    prSection = { '__ptType' : 'fieldset','fsLayout' : '2col'  }
                    prSection['items'] = prIds 
                    prFieldSet.append ( prSection )

            
            # si existe un fieldset convierte la estructura                      
            else: 
                for name, opts in baseFieldSet:

                    prSection = { '__ptType' : 'fieldset', 'fsLayout' : '2col' }
                    if ( name != None ): 
                        prSection[ 'title' ]  = name.capitalize()  

                    classes = getattr( opts, 'classes', [] )
                    if ( 'collapse' in classes ): 
                        prSection['collapsible'] =  True   

                    prItems = []
                    for formField in opts['fields']:
                        getFieldsInSet( self, prItems, formField  )
                        
                    prSection['items'] =  prItems   
                    prFieldSet.append( prSection )
            
        return prFieldSet 
        


    def get_details(self):  

        # Inicializa con los valores definidos,   
        details = self.protoAdmin.get( 'protoDetails', []) 


        # Si no han sido definido genera por defecto  
        if (len( details )  == 0 ):        
            details  =  getModelDetails( self.model )
            
        return details 


def getModelDetails( model ):

    details = []
    opts = model._meta
    
    for detail in opts.get_all_related_objects():
        oMeta = detail.model._meta
        details.append({
            "menuText"      : oMeta.object_name.capitalize() + '.' + detail.field.name, 
            "conceptDetail" : oMeta.app_label + '.' + oMeta.object_name, 
            "detailField"   : detail.field.name + '__pk',
            "detailName"    : detail.field.name,
            "masterField"   : 'pk',                                         
            })
    
    # Tabla intermedia referenciada en N2N
    for detail in opts.get_all_related_many_to_many_objects():
        tmpTable = detail.field.rel.through._meta
        if not tmpTable.auto_created:  continue
    
        relTable =  detail.model._meta        
        details.append({
            "menuText"      : tmpTable.object_name, 
            "conceptDetail" : tmpTable.app_label + '.' + tmpTable.object_name, 
            "relatedN2N"    : relTable.app_label + '.' + relTable.object_name,
            "detailField"   : detail.parent_model._meta.module_name + '__pk',    # ??? 
            "detailName"    : detail.parent_model._meta.module_name,  
            "masterField"   : 'pk',                                     
            })
    
    #Campos N2N
    for field in opts._many_to_many():
        tmpTable = field.rel.through._meta
        if not tmpTable.auto_created:  continue
    
        relTable =  field.related.parent_model._meta
        details.append({
            "menuText"      : tmpTable.object_name, 
            "conceptDetail" : tmpTable.app_label + '.' + tmpTable.object_name, 
            "relatedN2N"    : relTable.app_label + '.' + relTable.object_name,
            "detailField"   : field.related.var_name  + '__pk',  
            "detailName"    : field.related.var_name,   
            "masterField"   : 'pk',                                     
            })
    
    
    return details     


def setDefaultField ( fdict, model  ): 
    """ 
        set __str__ properties   
    """
    fdict['header'] = model._meta.verbose_name.title() 
    fdict['type'] =  'string'   
    fdict['readOnly']  = True        
    fdict['allowBlank']  = True        
    fdict['flex']      = 1        
    fdict['cellLink']  = True 
    fdict['zoomModel'] = model._meta.app_label + '.' + model._meta.object_name
    fdict['fkId']      =  'id'  


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

            # N2N
            elif ( lField['type'] == 'protoN2N' ):
                try: 
                    val = list( item.__getattribute__( fName  ).values_list()) 
                except: val = '[]'

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


def getSearcheableFields(  model  ):
# Obtiene los campos visibles del modelo base, se usa como valor por defecto para los searchFields 

    lFields = []
    
    filterableTypes = [ 'CharField', 'TextField', 'IntegerField', 'DecimalField', 'FloatField',  ]
    filterableTypes.extend( [ 'DateField', 'TimeField', 'DateTimeField', 'BooleanField' ])
        
    for field in model._meta._fields():
        if field.__class__.__name__ in filterableTypes:
            lFields.append( field.name )   

    return lFields 

    
def getProtoViewName( protoConcept   ):
#    Verifica si es una instancia del modelo ( vista )
#    Concept Format :    app.model.view 
#    Return :  app.model ,  view 

    if protoConcept.count(".") == 2:
        app, model, view = protoConcept.split(".")
        protoConcept = app + '.' +  model
    else: view = ''
    
    return protoConcept, view 


def getFieldsInSet( self, prItems, formFields ):
    # Al recorrer el fieldset pueden venir tuplas o arrays anidados, se manejan en una unica lista
    
    if type(formFields).__name__ == 'str':
        if verifyField( self, formFields ):
            prItems.append ( { 'name' : formFields, '__ptType' : 'formField' } )
        return 
             
    for formField in formFields:
        if type(formField).__name__ in [ type(()).__name__,  type([]).__name__]:
            getFieldsInSet( self, prItems, formField  )
        elif verifyField( self, formField ):
            prItems.append ( { 'name' : formField, '__ptType' : 'formField' } ) 


def verifyField( self, fName ):
    try:
        # Recibe los parametros de los campos del modelo  
        field = self.model._meta.get_field(fName )
        setFieldDict (  self.protoFields , field )
        fdict = self.protoFields[ fName ]
        self.fields.append(fdict)
        return True 
    except: 
        return False 
    
