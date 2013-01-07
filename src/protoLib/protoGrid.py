# -*- coding: utf-8 -*-

from django.contrib.admin.sites import  site


from utilsBase import verifyList, copyProps, list2dict
from protoUdp import verifyUdpDefinition 
from protoField import  setFieldDict


def getProtoAdmin( model ):
    """ Carga la protoDefinicion, del modelo y luego del admin,
    * La definicion del admin sirve para definir los EntryPoint, 
    * pero no es necesario, la protoDefinicion se puede guardar directamente 
    * en el modelo 
    """ 

    #DGT Siempre existe, la creacion del site la asigna por defecto 
    model_admin = site._registry.get( model )

    # Si no esta registrado genera una definicion en blanco         
    if not model_admin: 
        model_admin = {}
        
    protoMeta = getattr( model, 'protoExt', {})
    protoMeta = copyProps( protoMeta, getattr( model_admin, 'protoExt', {}) )
    
    return  model_admin, protoMeta



class ProtoGridFactory(object):
    """ Construye la definicion por defecto de la interface 
    """ 

    def __init__(self, model, protoOption, model_admin, protoMeta  ):
            
        self.protoOption = protoOption  
        self.model = model              # the model to use as reference
        self.storeFields = ''           # holds the Query Fields
         
        # retoma las variables del modelo 
        self.model_admin =  model_admin
        self.protoMeta = protoMeta

        # Obtiene el nombre de la entidad 
        self.title = self.model._meta.verbose_name.title()

        # Obtiene los campos, si llega una lista la convierte en dict
        # fields es la lista final,  
        # fieldsDict es el dictionario de trabajo, se lee de la variable protoExt.fields  
        # * [ 'xx' , {'name': 'xy'}]  si es una lista, permite solo el nombre del campo o la def del campo
        # * { {'name': 'xy' }, { ..  si es un dictionario debe estar bien estructurado          
        self.fields = []                
        self.fieldsDict = self.protoMeta.get( 'fields', {})
        if type( self.fieldsDict ).__name__ == type( [] ).__name__ :  
            self.fieldsDict = list2dict( self.fieldsDict, 'name')

        #UDPs para poder determinar el valor por defecto ROnly 
        self.pUDP = self.protoMeta.get( 'protoUdp', {}) 
        cUDP = verifyUdpDefinition( self.pUDP )


        # Configuracion de la grilla 
        self.gridConfig = self.protoMeta.get( 'gridConfig', {})

        # lista de campos para la presentacion en la grilla 
        pListDisplay = verifyList( self.gridConfig.get( 'listDisplay', []) )
        if not pListDisplay: 
            pListDisplay = verifyList( getattr(self.model_admin , 'list_display', []))

            # Por defecto solo vienen  Chk, _str_
            try: pListDisplay.remove('action_checkbox')
            except ValueError:  pass
    
            # if pListDisplay and (pListDisplay[0] == '__str__'): pListDisplay = []
            
        self.gridConfig['listDisplay'] = pListDisplay 
        
        
        # Se leen los excluidos del admin, no se requiere 
        # en protoMeta, pues los campos se enumeran explicitamente 
        protoExclude = verifyList( getattr(self.model_admin , 'exclude', []))

        #Se leen los readonly fields para setear el attr readOnly = true 
        pReadOnlyFlds = verifyList( self.gridConfig.get( 'readOnlyFields', []) )
        if not pReadOnlyFlds:
            pReadOnlyFlds =  verifyList( getattr(self.model_admin , 'readonly_fields', []))   

        self.gridConfig['readOnlyFields'] = pReadOnlyFlds 

        # @@ Por alguna Ext no retiene el IdProperty ( idInternal al hacer click en las filas )     
        # idName = model._meta.pk.name   
        
        # La lista de campos del admin sirve de base, pues puede haber muchos mas campos en proto q en admin
        # Si solo queda el __str__ , asume todos los campos del modelo
        iCount = len( pListDisplay )  
        if ( iCount == 0  ) or ( iCount == 1 and (pListDisplay[0] == '__str__')) :
            # Se crean los campos con base al modelo ( trae todos los campos del modelo )
            for field in self.model._meta._fields():
                if field.name in protoExclude: continue
                setFieldDict (  self.fieldsDict , field )

            for field in self.model._meta._many_to_many():
                if field.name in protoExclude: continue
                setFieldDict (  self.fieldsDict , field )

        else : 
            for fName in pListDisplay:
                if fName in protoExclude: continue
                try:
                    # Recibe los parametros de los campos del modelo  
                    field = self.model._meta.get_field(fName )
                    setFieldDict (  self.fieldsDict , field )
                except: 
                    # Si no es parte del modelo, se asegura q exista en el diccionario
                    fdict = self.fieldsDict.get( fName, {} )
                    if not fdict: 
                        fdict['name'] = fName
                        self.fieldsDict[ fName ] = fdict

                        if fName == '__str__':
                            setDefaultField( fdict, self.model , self.protoOption  )
                                                        
                        # Si no es una UDP y no esta en diccionario debe ser ReadOnly 
                        if not (cUDP.udpTable and fName.startswith( cUDP.propertyPrefix + '__')):  
                            fdict[ 'readOnly' ] = True
                


        # Agrega el __str__ que sirve de base para los zooms
        fName = '__str__' 
        fdict = self.fieldsDict.get( fName , {}) 
        if not fdict: 
            fdict['name'] = fName
            self.fieldsDict[ fName ] = fdict
            
            setDefaultField ( fdict, self.model, self.protoOption )
             


        # Genera la lista de campos y agrega el nombre al diccionario 
        for key in self.fieldsDict:        
            fdict = self.fieldsDict[ key ]
            if (fdict.get( 'name', '') == '') : fdict[ 'name' ] = key  

            if key in pReadOnlyFlds: fdict[ 'readOnly' ] = True

            # TODO: Repasa las propiedades de base, ver por q no esta pasando trayendo las props de base ( ie:  defaulValue )  
            if ((fdict.get( 'fromModel', False) == False ) and not ( key.startswith( 'udp__') )):
                try: 
                    field = self.model._meta.get_field( key )
                    setFieldDict ( self.fieldsDict , field )
                    fdict = self.fieldsDict[ key ]
                except: 
                    #Es posible q se puedan configuar propiedades no pertenecientes a la tabla como editables???
                    fdict[ 'readOnly' ] = True
                    pass 

            self.fields.append(fdict)



    def getFieldSets(self):
        """ El field set determina la distribucion de los campos en la forma
        """ 
        
        pForm = self.protoMeta.get( 'protoForm', { 'items' : [] }) 
        prFieldSet = pForm[ 'items' ]
        
        # Si no han sido definido genera por defecto  
        if ( len( prFieldSet )   == 0 ):

            # Toma la lista del field set si no existe lo crea de base, 
            baseFieldSet = verifyList( getattr(self.model_admin , 'fieldsets', []))
            
            if (len( baseFieldSet )  == 0 ):        
                # Genera la lista de campos y agrega el nombre al diccionario

                prBlank = []                
                prItems = []                
                prTexts = []
                prChecks = []
                prN2N = []
#                prIds = []
                                
                for key in self.fieldsDict:
                    vFld = self.fieldsDict.get( key , {})
                    fType = vFld.get( 'type', 'string' )
                    
                    if ( vFld.get( 'storeOnly', False )): continue
                    
                    if ( fType == 'text') :
                        prTexts.append( { 'name' : key  , '__ptType' : 'formField'} ) 
                         
                    elif ( fType in ['autofield', 'foreignid'] ) :
#                        prIds.append( { 'name' : key  , '__ptType' : 'formField'} )
                        continue

                    elif ( fType  == 'bool' ) :
                        prChecks.append( { 'name' : key  , '__ptType' : 'formField'} )

                    elif ( fType == 'protoN2N' ) :
                        prN2N.append( { 'name' : key  , '__ptType' : 'formField'} )

                    elif ( vFld.get( 'name', '' )  == '__str__' ) :
#                        prTexts.insert( 0, { 'name' : key  , '__ptType' : 'formField'} )
                        continue

                    elif ( vFld.get( 'required', False  )  == False ): 
                        prBlank.append( { 'name' : key  , '__ptType' : 'formField'} )
                         
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

                if prBlank : 
                    prSection = { '__ptType' : 'fieldset','fsLayout' : '2col'  }
                    prSection['items'] = prBlank 
                    prFieldSet.append ( prSection )

                if prTexts : 
                    prSection = { '__ptType' : 'fieldset','fsLayout' : '1col'  }
                    prSection['items'] = prTexts 
                    prFieldSet.append ( prSection )


                if prN2N : 
                    prSection = { '__ptType' : 'fieldset','fsLayout' : '1col'  }
                    prSection['items'] = prN2N 
                    prFieldSet.append ( prSection )

#                if prIds : 
#                    prSection = { '__ptType' : 'fieldset','fsLayout' : '2col'  }
#                    prSection['items'] = prIds 
#                    prFieldSet.append ( prSection )

            
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
            
        return pForm 
        


    def get_details(self):  

        # Inicializa con los valores definidos,   
        details = self.protoMeta.get( 'protoDetails', []) 


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


def setDefaultField ( fdict, model, protoOption ): 
    """ 
        set __str__ properties   
    """
    fdict['header'] = model._meta.verbose_name.title() 
    fdict['type'] =  'string'   
    fdict['readOnly']  = True        
    fdict['flex']      = 1        
    fdict['cellLink']  = True 
#   fdict['zoomModel'] = model._meta.app_label + '.' + model._meta.object_name
    fdict['zoomModel'] = protoOption
    fdict['fkId']      =  'id'  





    
def getProtoViewName( protoOption   ):
#    Verifica si es una instancia del modelo ( vista )
#    Concept Format :    app.model.view 
#    Return :  app.model ,  view 

    if protoOption.count(".") == 2:
        app, model, view = protoOption.split(".")
        protoOption = app + '.' +  model
    
    return protoOption  


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
        setFieldDict (  self.fieldsDict , field )
        fdict = self.fieldsDict[ fName ]
        self.fields.append(fdict)
        return True 
    except: 
        return False 
    
