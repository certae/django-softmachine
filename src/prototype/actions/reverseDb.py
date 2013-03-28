# -*- coding: utf-8 -*-

#from django.db import load_backend
#myBackend = load_backend('postgresql_psycopg2') # or 'mysql', 'sqlite3', 'oracle'
#myConnection = myBackend.DatabaseWrapper({})
#myCursor = myConnection.cursor()

# ----------------------------------------------------

import keyword
import traceback
from django.db import connections
from prototype.models import Model, Entity, Property, Relationship
from protoLib.protoAuth import getUserProfile
from protoLib.utilsDb import setDefaults2Obj

from django.db import transaction


# Coleccion de entidades a importar 
pEntities  = {}

@transaction.commit_manually
def getDbSchemaDef( dProject , request  ):

    if dProject.dbEngine == 'sqlite3': 
        dProject.dbEngine = 'django.db.backends.sqlite3'
    elif  dProject.dbEngine == 'mysql':
        dProject.dbEngine = 'django.db.backends.mysql'
    elif  dProject.dbEngine == 'postgres':
        dProject.dbEngine = 'django.db.backends.postgresql_psycopg2'
    elif  dProject.dbEngine == 'oracle':
        dProject.dbEngine = 'django.db.backends.oracle'


    # Add connection information dynamically..
    connections.databases[ dProject.code ] = {
            'ENGINE': dProject.dbEngine ,
            'NAME':  dProject.dbName ,
            'USER':  dProject.dbUser ,
            'PASSWORD': dProject.dbPassword ,
            'HOST': dProject.dbHost ,
            'PORT':dProject.dbPort,
          }
    
    # Ensure the remaining default connection information is defined.
    # connections.databases.ensure_defaults('new-alias')
    connection = connections[ dProject.code ]
    
    table2model = lambda table_name: table_name.title().replace('_', '').replace(' ', '').replace('-', '')

    #  
    cursor = connection.cursor()
    for table_name in connection.introspection.get_table_list(cursor):

        pEntity =  { 'code' : table2model( table_name )  }
        pEntities[ pEntity['code'] ] =  pEntity

        pProperties = []
        pEntity['properties'] = pProperties
        pEntity['dbName'] = table_name

        try:
            relations = connection.introspection.get_relations(cursor, table_name)
        except NotImplementedError:
            relations = {}

        try:
            indexes = connection.introspection.get_indexes(cursor, table_name)
        except NotImplementedError:
            indexes = {}

        for i, row in enumerate(connection.introspection.get_table_description(cursor, table_name)):
            column_name = row[0]
            att_name = column_name.lower()  

            pProperty = { 'code' :  att_name , 'notes' : ''}
            pProperties.append( pProperty )  

                
            if i in relations:
                rel_to = relations[i][1] == table_name and "'self'" or table2model(relations[i][1])
                pProperty['refEntity']  = rel_to 

                if att_name.endswith('_id'):
                    att_name = att_name[:-3]  
                    pProperty['code'] = att_name
                    pProperty['notes'] += ';id removed from colName'

            else:

                field_type, field_params, field_notes = get_field_type(connection, table_name, row )
                pProperty.update(field_params)
                pProperty['notes'] += ';'.join( field_notes ) 

                # Add primary_key and unique, if necessary.
                if column_name in indexes:
                    if indexes[column_name]['primary_key']:
                        pProperty['isPrimary'] = True
                    elif indexes[column_name]['unique']:
                        pProperty['isRequired'] = True


            if keyword.iskeyword(att_name):
                att_name += '_field'
                pProperty['code'] = att_name
                pProperty['notes'] += ';Field renamed because it was a Python reserved word'
            
            if  unicode( column_name )  !=  unicode( att_name ) :
                pProperty['dbName'] = column_name

            # Don't output 'id = meta.AutoField(isPrimary=True)', because
            # that's assumed if it doesn't exist.
            if att_name == 'id' and field_type == 'AutoField' and pProperty['primary_key']:
                continue

            # Add 'null' and 'blank', if the 'null_ok' flag was present in the
            # table description.
            if row[6]: # If it's NULL...
                if not field_type in ('TextField', 'CharField'):
                    pProperty['isNullable'] = False 
                else: 
                    pProperty['isRequired'] = True
                    
            pProperty['baseType'] = field_type
            
            if len( pProperty['notes']  ) == 0: 
                del pProperty['notes']  


    # ===================================================================================================================
    # -----------------------------  Aqui arranca la escritura en la Db 
    userProfile = getUserProfile( request.user, 'prototype', '' ) 
    defValues = {
        'smOwningTeam' : userProfile.userTeam,
        'smOwningUser' : userProfile.user,
        'smCreatedBy' :  userProfile.user
    }

    # Borra y crea el modelo 
    Model.objects.filter( project = dProject, 
                          code = 'inspectDb', smOwningTeam = userProfile.userTeam).delete() 

    dModel = Model.objects.get_or_create( project = dProject, code = 'inspectDb', 
                          smOwningTeam = userProfile.userTeam, defaults = defValues )[0]

    # Guarda todas las entidades 
    for entityName in pEntities: 
        pEntity = pEntities[ entityName  ]
        pEntity.update( defValues  )
        pEntity['dataEntity']  = getEntity(  entityName , pEntity, dProject,  dModel  )

    transaction.commit()

    # Guarda las relaciones 
    for entityName in pEntities: 
        pEntity = pEntities[ entityName  ]
        dEntity = pEntity['dataEntity']

        for pProperty in pEntity[ 'properties' ]:
            prpName = pProperty['code']
            if 'refEntity' in pProperty:
                saveRelation( dProject, dEntity, dModel, pProperty,  defValues, userProfile, prpName, 1 )
                
            else:  

                saveProperty( dEntity, pProperty, defValues, userProfile, prpName,  1   )

        transaction.commit()


def saveProperty( dEntity, pProperty, defValues, userProfile, prpName, seq   ):

    Qs = dEntity.property_set.filter( code = prpName, smOwningTeam = userProfile.userTeam ) 

    # si ya existe, debe crear una nueva 
    if Qs.count() > 0 : 
        prpName = '{0}_{1}'.format( prpName.split('.')[0] , seq ) 
        saveProperty( dEntity, pProperty, defValues, userProfile, prpName,  seq +1 )
        return 


    try: 
        dProperty =  dEntity.property_set.create( code = prpName, smOwningTeam = userProfile.userTeam )

        setDefaults2Obj( dProperty, pProperty )    
        setDefaults2Obj( dProperty, defValues )    
        dProperty.save()

    except Exception as e:
        #TODO: Log 
        pass 


def saveRelation( dProject, dEntity, dModel, pProperty,  defValues, userProfile, prpName, seq   ):

    refName = pProperty['refEntity']                
    if refName == 'self':  refName = dEntity.code 
    
    try: 
        dRefEntity =  pEntities[ refName ]
        
        
    except Exception as e:
        anotar q la entiad no existe  y gardar una propiedad 
        npProperty['notes']  ) == 0: 
            del pProperty['notes']  

        pass 
         

    Qs = Relationship.objects.filter( code = prpName, 
                                      entity = dEntity , 
                                      smOwningTeam = userProfile.userTeam )

    if Qs.count() > 0 : 
        prpName = '{0}_{1}'.format( prpName.split('.')[0] , seq ) 
        saveRelation( dProject, dEntity, dModel, pProperty,  defValues, userProfile, prpName, seq + 1 )
        return 

    try: 
        dRelation =  Relationship(  
                         code = prpName ,
                         entity = dEntity , 
                         refEntity = dRefEntity ,  
                         smOwningTeam = userProfile.userTeam 
                         )

        setDefaults2Obj( dRelation, pProperty, ['refEntity'] )    
        setDefaults2Obj( dRelation, defValues )    
        dRelation.save()

    except Exception as e:
        #TODO: Log 
        pass 

    
def getEntity(  entityCode , pEntity, project,  model  ):

    defValues = pEntity.copy()
    defValues['model'] = model
    if 'properties' in defValues: 
        del defValues['properties']
    
    dEntity = Entity.objects.get_or_create( model__project = project , 
                                            code = entityCode,  
                                            defaults = defValues )[0]
    return dEntity


def get_field_type( connection, table_name, row):
    """
    Given the database connection, the table name, and the cursor row
    description, this routine will return the given field type name, as
    well as any additional keyword parameters and notes for the field.
    """
    field_params = {}
    field_notes = []

    try:
        field_type = connection.introspection.get_field_type(row[1], row)
    except KeyError:
        field_type = 'TextField'
        field_notes.append('This field type is a guess.')

    # This is a hook for DATA_TYPES_REVERSE to return a tuple of
    # (field_type, field_params_dict).
    if type(field_type) is tuple:
        field_type, new_params = field_type
        field_params.update(new_params)

    # Add max_length for all CharFields.
    if field_type == 'CharField' and row[3]:
        field_params['max_length'] = row[3]

    if field_type == 'DecimalField':
        field_params['max_digits'] = row[4]
        field_params['decimal_places'] = row[5]

    return field_type, field_params, field_notes

