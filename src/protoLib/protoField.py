# -*- encoding: utf-8 -*-

from utilsBase import _PROTOFN_ , verifyStr

from django.db.models.fields import NOT_PROVIDED

# Equivalencia de tipos 
TypeEquivalence = { 
        'BooleanField'  :'bool',
        'CharField'     :'string',
        'DateField'     :'date', 
        'DateTimeField' :'datetime', 
        'DecimalField'  :'decimal',
        'FloatField'    :'decimal',
        'ForeignKey'    :'foreigntext',
        'IntegerField'  :'int',
        'TextField'     :'text',
        'TimeField'     :'time',
        'AutoField'     :'autofield'
    }


def setFieldDict(protoFields ,  field ):

    #Verifico si existe en el diccionario 
    pField = protoFields.get( field.name, {} )
    
    pField['name'] = field.name 
    pField['type'] = TypeEquivalence.get( field.__class__.__name__, 'string')
    
    #Verifica si existe parametrizacion a nivel de modelo.campo 
    modelField = getattr(field , 'protoExt', {})
    
    
    #TODO:  useNull  para definirlo sobre el modelo 
    
    # Recorrer el dict Field y agregar las prop q no estan  protoField
    setFieldProperty(  pField, 'allowBlank',  True, field, 'blank', False   )
    setFieldProperty(  pField, 'tooltip',  '', field, 'help_text', ''  )

    
#    TODO: Error msg es un dictionario con varios tipos de errores
#    my_default_errors = {
#        'required': 'This field is required',
#        'blank' : '',
#        'invalid_choice': '',
#        'invalid': 'Enter a valid value',
#        'null': 'This field is required',
#        }    
#    setFieldProperty(  pField, 'invalidText',  '', field, 'error_messages', ''  )
    
    
    # Agrega y/o sobreEscribe las propiedades definidas en protoExt 
    for mProp in modelField:
        if pField.get( mProp, '') == '': 
            pField[ mProp ] = modelField[ mProp ] 

    # Si no existe el verbose name verificar los defautls del modelo 
    if pField.get( 'header', '') == '':
        pField['header'] = verifyStr( field.verbose_name,  field.name ) 

    # Otras propiedades a mapear 
    if ( getattr( field, 'editable', False ) == False ) or (  pField['type'] == 'autofield'): 
        pField['readOnly'] = True   

    # Defaults 
    if (field.default is not None) and (field.default is not NOT_PROVIDED):                     
        if pField['type'] == 'int' or pField['type'] == 'decimal':
            setFieldProperty(  pField, 'defaultValue', 0 , field, 'default', 0  )
        
        elif pField['type'] == 'bool':
            setFieldProperty(  pField, 'defaultValue', False , field, 'default', False  )

        else:
            setFieldProperty(  pField, 'defaultValue', '' , field, 'default', ''  )


    if field.__class__.__name__ == 'CharField' and field.choices:
        pField['type'] = 'combo'
        pField['choices'] = field.choices  

    elif field.__class__.__name__ == 'TextField':
        pField['vType'] = 'plainText' # 'htmlText'

        
    elif  field.__class__.__name__ == 'ForeignKey':
#       Verificado ( q pasa cuando existen dos ref al mismo maestro )  
        pField['fkId'] = field.attname                              # Campo q contiene el ID 
        
        # Nombre del modelo referenciado
        pField['zoomModel'] = field.rel.to._meta.app_label + '.' + field.rel.to.__name__                   
        
        # Agrega la referencia al ID 
        fKey = { 
             'name':       field.attname, 
             'fkField':    field.name ,                                 # Campo de base a mostrar 
             'hidden':     True,  
             'type':  'foreignid',
             }
        protoFields[fKey['name']] = fKey 

    
    #Lo retorna al diccionario
    pField['fromModel'] = True 
    protoFields[ pField['name'] ] = pField 


def setFieldProperty( pField, pProperty, pDefault, field, fProperty, fpDefault ):
    # Lee la propiedad del campo,  si es igual al default no la carga, excepto para los defaultValue 
    vAux = getattr( field, fProperty, fpDefault  )
    if ( type( vAux )  == type( pDefault )) and ( vAux != pDefault ):  
        pField[ pProperty ] = vAux
    elif fProperty == 'default': 
        pField[ pProperty ] = vAux
        


#----------------------------------------------------------
#DGT:  choice,  Convierte las propiedades en una lista  
#        a = []
#        for c in field.choices:
#            a[c[0]] = c[1]              //  Dict
#            a.push ( [ c[0], c[1] ])    //  List



