# -*- encoding: utf-8 -*-

from utilsBase import _PROTOFN_ , verifyStr

from django.db.models.fields import NOT_PROVIDED

def setFieldDict(protoFields ,  field ):

    #Verifico si existe en el diccionario 
    pField = protoFields.get( field.name, {} )
    
    pField['name'] = field.name 
    pField['type'] = field.__class__.__name__
    
    #Verifica si existe parametrizacion a nivel de modelo.campo 
    modelField = getattr(field , 'protoExt', {})
    
    
    #TODO:  useNull  para definirlo sobre el modelo 
    
    # Recorrer el dict Field y agregar las prop q no estan  protoField
    setFieldProperty(  pField, 'allowBlank',  True, field, 'blank', False   )
    setFieldProperty(  pField, 'tooltip',  '', field, 'help_text', ''  )

    bDefault = (field.default is not None) and (field.default is not NOT_PROVIDED)
    
#    Error msg es un dictionario con varios tipos de errores
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
    if getattr( field, 'editable', False ) == False: 
        pField['readOnly'] = True   

    if  field.__class__.__name__ == 'DateTimeField':
#       pField['type'] = 'datetime'
        pField['type'] = 'date'
        pField['dateFormat'] = 'Y-m-d'


    elif  field.__class__.__name__ == 'DateField':
        pField['type'] = 'date'
        pField['dateFormat'] = 'Y-m-d'

    elif  field.__class__.__name__ == 'TimeField':
        pField['type'] = 'time'
        if bDefault:                     
            setFieldProperty(  pField, 'defaultValue', '' , field, 'default', ''  )
        
    elif field.__class__.__name__ == 'IntegerField':
        pField['type'] = 'int'
        if bDefault:                     
            setFieldProperty(  pField, 'defaultValue', 0 , field, 'default', 0  )
        
    elif field.__class__.__name__ == 'DecimalField':
        pField['type'] = 'decimal'
        if bDefault:                     
            setFieldProperty(  pField, 'defaultValue', 0.0 , field, 'default', 0.0 )

    elif field.__class__.__name__ == 'BooleanField':
        pField['type'] = 'bool'
        if bDefault:                     
            setFieldProperty(  pField, 'defaultValue', False , field, 'default', False  )

    elif field.__class__.__name__ == 'CharField':
        pField['type'] = 'string'
        if bDefault:                     
            setFieldProperty(  pField, 'defaultValue', '' , field, 'default', ''  )

        if field.choices:
            pField['type'] = 'combo'
            pField['choices'] = field.choices  

    elif field.__class__.__name__ == 'TextField':
        pField['type'] = 'text'
        if bDefault:                     
            setFieldProperty(  pField, 'defaultValue', '' , field, 'default', ''  )

        
    elif  field.__class__.__name__ == 'ForeignKey':

@@@@@@@@@@@@@@222   Verificar q pasa cuando existen dos ref al mismo maestro 


        pField['type'] = 'foreigntext'
        pField['fkId'] = field.attname                              # Campo q contiene el ID 
        pField['zoomModel'] = field.rel.to.__name__                 # Nombre del modelo referenciado  
        
        # Agrega la referencia al ID 
        fKey = { 
             'name':       field.attname, 
             'fkField':    field.name ,                                 # Campo de base a mostrar 
             'type':  'foreignid',                                      # pseudo type ( hidden = true, etc.... ) 
             }
        protoFields[fKey['name']] = fKey 

    elif  field.__class__.__name__ == 'AutoField':
        pField['type'] = 'autofield'

    
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
