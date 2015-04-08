# -*- coding: utf-8 -*-


ONDELETE_TYPES = (  
        ('CASCADE', 'Cascade deletes; the default' ), 
        ('PROTECT', 'Prevent deletion of the referenced object by raising ProtectedError, a subclass of django.db.IntegrityError'),
        ('SET_NULL', 'Set the ForeignKey null; this is only possible if null is True'), 
        ('SET_DEFAULT', 'Set the ForeignKey to its default value; a default for the ForeignKey must be set.  @function si possible'), 
        ('DO_NOTHING', 'Use default Db constraint')
    ) 



BASE_TYPES = ( ( 'string', 'string' ),
               ( 'text', 'text' ),  
               ( 'bool', 'bool' ), 
               ( 'int', 'int' ),
               ( 'sequence', 'sequence' ),
               ( 'decimal', 'decimal' ), 
               ( 'money', 'money' ), 
               ( 'combo', 'combo' ),  
               ( 'date',  'date' ),
               ( 'datetime', 'datetime' ), 
               ( 'time', 'time' )
              ) 

CRUD_TYPES = (  
                ('storeOnly', 'No se presentan nunca (los id, jsonTypes, etc )' ),  
                ('readOnly',  'No se guarda nunca (usado por reglas de gestion)' ), 
                ('insertOnly','No se actualiza (un campo absorbido al momento de la creacion, ej:direccion de envio'),
                ('updateOnly','Al insertar nulo o VrDefault, (estado inicial fijo)'),  
              ) 

DB_ENGINE = (  
                ('sqlite3', 'sqlLite3' ),  
                ('postgres',  'Postgress' ), 
                ('mysql','mySQL'),
              ) 

# -----------------------------------------------------------------



def docProperty2Field( fName, propDict, fBase = 'info' ):
    """ Genera la definicion del campo en la pci a partir de un diccionario (RAI) 
    """

    from protoLib.utilsBase import slugify
    fCode = slugify( fName )

    field =  { 
        "name"    : '{0}__{1}'.format( fBase, fCode ), 
        "header"  : propDict.get('code', fName),
        "type"    : propDict.get('baseType', 'string'), 
        "required": propDict.get('isRequired', False),
        "tooltip" : propDict.get('description',''), 
        "vType"   : propDict.get('vType',''),   
        "choices" : propDict.get('prpChoices', '') ,
        "prpDefault" : propDict.get('prpDefault', '') , 
        "prpLength"  : propDict.get('prpLength', '') , 
        "prpScale"   : propDict.get('prpScale', '') , 
        "crudType"   : propDict.get('crudType', '') , 
        "readOnly": propDict.get('isReadOnly', False) ,
    }
    
    return field 
