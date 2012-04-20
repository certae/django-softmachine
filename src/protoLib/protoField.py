# -*- encoding: utf-8 -*-

from utilsBase import _PROTOFN_ , verifyStr

def setFieldDict(protoFields ,  field ):

    #Verifico si existe en el diccionario 
    pField = protoFields.get( field.name, {} )
    
    pField['name'] = field.name 
    pField['type'] = field.__class__.__name__
    
    #Verifica si existe parametrizacion a nivel de modelo.campo 
    modelField = getattr(field , 'protoExt', {})
    
    # TODO: Recorrer el dict Field y agregar las prop q no estan  protoFields    ----------
    for mProp in modelField:
        if pField.get( mProp, '') == '': 
            pField[ mProp ] = modelField[ mProp ] 

    # Si no existe el verbose name verificar los defautls del modelo 
    if pField.get( 'header', '') == '':
        pField['header'] = verifyStr( field.verbose_name,  field.name ) 

    if  field.__class__.__name__ == 'DateTimeField':
#        pField['type'] = 'datetime'
        pField['type'] = 'date'
        pField['dateFormat'] = 'Y-m-d'

    elif  field.__class__.__name__ == 'DateField':
        pField['type'] = 'date'
        pField['dateFormat'] = 'Y-m-d'

    elif  field.__class__.__name__ == 'TimeField':
        pField['type'] = 'time'
        
    elif field.__class__.__name__ == 'IntegerField':
        pField['type'] = 'int'
        
    elif field.__class__.__name__ == 'DecimalField':
        pField['type'] = 'decimal'

    elif field.__class__.__name__ == 'BooleanField':
        pField['type'] = 'bool'

    elif field.__class__.__name__ == 'TextField':
        pField['type'] = 'text'

    elif field.choices:
        pField['type'] = 'combo'
        pField['choices'] = field.choices  
        
    elif  field.__class__.__name__ == 'ForeignKey':
        # Dafine la columna __unicode__ de la tabla padre, 
        pField['type'] = 'foreigntext'
        pField['fkName'] = field.name  + _PROTOFN_ + '__unicode__'      # Funcion unicode de retorno 
        pField['fkId'] = field.name + '_id'                             # Campo q contiene el ID 
        pField['descZoom'] = True                                       # Si hace el zoom sobre la descripcion 
        
        # Agrega la referencia al ID 
        fKey = { 
             'name':    field.name + '_id', 
             'fkField':    field.name ,                                 # Campo de base a mostrar 
             'type':  'foreignid',                                      # pseudo type ( hidden = true, etc.... ) 
             }
        protoFields[fKey['name']] = fKey 

    elif  field.__class__.__name__ == 'AutoField':
        pField['type'] = 'autofield'

    
    #Lo retorna al diccionario
    protoFields[ pField['name'] ] = pField 


#----------------------------------------------------------

# Choise,  Borrar despues de probar 
#        a = []
#        for c in field.choices:
#            a[c[0]] = c[1]              //  Dict
#            a.push ( [ c[0], c[1] ])    //  List
