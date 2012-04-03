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
        pField['type'] = 'datetime'
        pField['xtype'] = 'datecolumn' 
        pField['dateFormat'] = 'Y-m-d H:i:s'
        pField['format'] = 'Y-m-d H:i:s'
        #pField['editor'] = "new Ext.ux.form.DateTime({hiddenFormat:'Y-m-d H:i', dateFormat:'Y-m-D', timeFormat:'H:i'})"

    elif  field.__class__.__name__ == 'DateField':
        pField['type'] = 'date'
        pField['xtype'] = 'datecolumn' 
        pField['dateFormat'] = 'Y-m-d'
        pField['format'] = 'Y-m-d'
        #pField['renderer'] = 'Ext.util.' 
        #pField['editor'] = "new Ext.form.DateField({format:'Y-m-d'})"
        
    elif field.__class__.__name__ == 'IntegerField':
        pField['xtype'] = 'numbercolumn'
        #pField['editor'] = 'new Ext.form.NumberField()'
        
    elif field.__class__.__name__ == 'BooleanField':
        pField['xtype'] = 'booleancolumn'
        #pField['editor'] = 'new Ext.form.Checkbox()'
        
    elif field.__class__.__name__ == 'DecimalField':
        pField['xtype'] = 'numbercolumn '
        pField['renderer'] = 'function(v) {return (v.toFixed && v.toFixed(2) || 0);}'
        #pField['editor'] = 'new Ext.form.NumberField()'
        
    elif  field.__class__.__name__ == 'ForeignKey':
        # Dafine la columna __unicode__ de la tabla padre, con el header definido y ocultar la columna de la llave 
        pField['xtype'] = 'protoZoom '
        pField['fkName'] = field.name  + _PROTOFN_ + '__unicode__'      # Funcion unicode de retorno 
        pField['fkId'] = field.name + '_id'                             # Campo q contiene el ID 
        
        # Agrega la referencia al ID 
        fKey = { 
             'name':    field.name + '_id', 
             'fkField':    field.name ,                                 # Campo de base a mostrar 
             'xtype':  'protoId',                                       # pseudo type ( hidden = true, etc.... ) 
             }
        protoFields[fKey['name']] = fKey 

#    La llave se agrega automatica, si se especifico, el usuario decide q hacer con ella 
#    if field.name == model._meta.pk.name:
#        pField['hidden']= True

    
    #Lo retorna al diccionario
    protoFields[ pField['name'] ] = pField 


#----------------------------------------------------------


