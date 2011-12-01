# -*- encoding: utf-8 -*-

from utilsBase import _PROTOFN_ , verifyStr

def setFieldDict(protoFields ,  field ):

    #Verifico si existe en el diccionario 
    pField = getattr(  protoFields, field.name , {})
    
    pField['name'] = field.name 
    pField['type'] = field.__class__.__name__
    
    #Verifica si existe parametrizacion a nivel de modelo.campo 
    protoField = getattr(field , 'protoExt', {})
    
    # Field Attrs   ------------------------------------------------------------------
    getUdp( pField, protoField, 'hidden', 'Boolean', False)
    getUdp( pField, protoField, 'filterable', 'Boolean', True )
    getUdp( pField, protoField, 'sortable', 'Boolean', True )
    getUdp( pField, protoField, 'width', 'Numeric', 0 )
    getUdp( pField, protoField, 'align', 'String', '' )
    getUdp( pField, protoField, 'tooltip', 'String', '' )
    getUdp( pField, protoField, 'flex', 'Numeric', 0 )

    
    if getattr( pField , 'header', '') == '':
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

#    elif  field.__class__.__name__ == 'CharField':
#        pField['xtype'] = '??'
        
    elif  field.__class__.__name__ == 'ForeignKey':
        # Dafine la columna __unicode__ de la tabla padre, con el header definido y ocultar la columna de la llave 
        pField['name'] = field.name  + _PROTOFN_ + '__unicode__'
        pField['filterable'] = False
        pField['sortable'] = False
        
        # Agrega la referencia al ID 
        fKey = { 
             'name':    field.name + '_id', 
             'header':  field.name + ' Id',
             'xtype':  'numbercolumn',
             'filterable':  False, 
             'sortable' : False, 
             'hidden':  True, 
             }
        protoFields[fKey['name']] = fKey 

#    La llave si agrega automatica, si se especifico, el usuario decide q hacer con ella 
#    if field.name == model._meta.pk.name:
#        pField['hidden']= True

    
    #Lo retorna al diccionario
    protoFields[pField['name']] = pField 


#----------------------------------------------------------

#LLamados de configuracion,  
#ya no son necesarios pues todo el manejo sera parametrizado en  admin y el recorrido se hace en la coleccion 


def getUdp( pField, protoField, udpCode , udpType, udpDefault ):

    # El atributo ya fue definido en el admin 
    if getattr( pField,  udpCode , '' ) != '': 
        return 


    udpReturn = udpDefault
    try:
        udpReturn = protoField.get( udpCode , udpDefault )
        if ( udpType == 'Boolean' ):
            if (udpReturn[0].lower() in ( 't','y','o', '1')): 
                udpReturn = True
            else: udpReturn = False 

        if ( udpType == 'Numeric' ):
            try:
                udpReturn = int( udpReturn  )
            except: udpReturn = udpDefault

        if (udpReturn != udpDefault ): 
            pField[udpCode] = udpReturn   
    except: 
        pass
    return 

