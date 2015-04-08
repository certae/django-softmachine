# -*- coding: utf-8 -*-

# Do not delete
# from django.db import load_backend
# myBackend = load_backend('postgresql_psycopg2') # or 'mysql', 'sqlite3', 'oracle'
# myConnection = myBackend.DatabaseWrapper({})
# myCursor = myConnection.cursor()

# ----------------------------------------------------

import keyword, re, traceback
from prototype.models import Model, Entity, Property, Relationship
from protoLib.protoAuth import getUserProfile
from protoLib.utilsDb import setDefaults2Obj
from protoLib.utilsBase import slugify

from django.db import connections, transaction, IntegrityError, DatabaseError
from django.db.transaction import TransactionManagementError


# Coleccion de entidades a importar
pEntities = {}


def getDbSchemaDef(dProject , request):
    readSchemaDef(dProject)
    writeSchemaDef(dProject , request)


def readSchemaDef(dProject):

    if dProject.dbEngine == 'sqlite3':
        dProject.dbEngine = 'django.db.backends.sqlite3'
    elif  dProject.dbEngine == 'mysql':
        dProject.dbEngine = 'django.db.backends.mysql'
    elif  dProject.dbEngine == 'postgres':
        dProject.dbEngine = 'django.db.backends.postgresql_psycopg2'
    elif  dProject.dbEngine == 'oracle':
        dProject.dbEngine = 'django.db.backends.oracle'


    # Add connection information dynamically..
    pCode = slugify( dProject.code )
    connections.databases[ pCode ] = {
            'ENGINE': dProject.dbEngine ,
            'NAME':  dProject.dbName ,
            'USER':  dProject.dbUser ,
            'PASSWORD': dProject.dbPassword ,
            'HOST': dProject.dbHost ,
            'PORT':dProject.dbPort,
          }

    # Prepara el nombre de la tabla
    table2model = lambda table_name: table_name.title().replace('_', '').replace(' ', '').replace('-', '')

    # Ensure the remaining default connection information is defined.
    # connections.databases.ensure_defaults('new-alias')
    connection = connections[ pCode ]
    cursor = connection.cursor()

    for table_name in connection.introspection.get_table_list(cursor):

        pEntity = { 'code' : table2model(table_name)  }
        pEntities[ pEntity['code'] ] = pEntity

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

            if att_name in ['smowninguser_id', 'smowningteam_id', 'smcreatedby_id', 'smmodifiedby_id',
                            'smregstatus', 'smwflowstatus',
                            'smcreatedon', 'smmodifiedon',
                            'smuuid' ] :
                continue

            pProperty = { 'code' :  att_name , 'notes' : ''}
            pProperties.append(pProperty)


            if i in relations:
                rel_to = relations[i][1] == table_name and "'self'" or table2model(relations[i][1])
                pProperty['refEntity'] = rel_to

                if att_name.endswith('_id'):
                    att_name = att_name[:-3]
                    pProperty['code'] = att_name
                    pProperty['notes'] += 'id removed from colName;'

            else:

                field_type, field_params, field_notes = get_field_type(connection, table_name, row)
                pProperty.update(field_params)
                pProperty['notes'] += field_notes

                # Add primary_key and unique, if necessary.
                if column_name in indexes:
                    if indexes[column_name]['primary_key']:
                        pProperty['isPrimary'] = True
                    elif indexes[column_name]['unique']:
                        pProperty['isRequired'] = True


            if keyword.iskeyword(att_name):
                att_name += '_field'
                pProperty['code'] = att_name
                pProperty['notes'] += 'field renamed because it was a reserved word;'

            if  unicode(column_name) != unicode(att_name) :
                pProperty['dbName'] = column_name

            # Don't output 'id = meta.AutoField(isPrimary=True)', because
            # that's assumed if it doesn't exist.
            if att_name == 'id' and field_type == 'AutoField' and pProperty['primary_key']:
                continue

            # Add 'null' and 'blank', if the 'null_ok' flag was present in the
            # table description.
            if row[6]:  # If it's NULL...
                if not field_type in ('TextField', 'CharField'):
                    pProperty['isNullable'] = False
                else:
                    pProperty['isRequired'] = True

            pProperty['baseType'] = field_type

            if len(pProperty['notes']) == 0:
                del pProperty['notes']


    # Tournarrount sqlite introspection  
    # FOREIGN KEY (syncObjectTypeID) REFERENCES syncObjectTypes(syncObjectTypeID) not supported 
    # Django v1.6.10  Dgt 150128
    table_def = [] 
    if dProject.dbEngine == 'django.db.backends.sqlite3':
        cursor.execute("""
            SELECT name, sql FROM sqlite_master
            WHERE type = 'table' AND NOT name in ('sqlite_sequence')
            """)
    
        table_def = [(row[0], row[1] ) for row in cursor.fetchall()]

    for table_name, table_sch in table_def:
        table_sch = table_sch[table_sch.index('(') + 1:table_sch.rindex(')')] 

        if not ("foreign" in table_sch.lower() ): 
            continue 
 
        try:
            pEntity = pEntities[ table2model(table_name)  ]
        except NotImplementedError:
            continue

        # Walk through and look for references to other tables. SQLite doesn't
        # really have enforced references, but since it echoes out the SQL used
        # to create the table we can look for REFERENCES statements used there.
        for field_desc in table_sch.split(','):
            field_desc = field_desc.strip().replace(' ','').lower()

            # This is the issue d'expetion 
            if not field_desc.startswith("foreignkey"): 
                continue 
            
            m = re.search('references(\S*) ?\(["|]?(.*)["|]?\)', field_desc, re.I)
            if not m:
                continue
            table_ref, col_base = [s.strip('"') for s in m.groups()]

            try:
                att_name = re.match('foreignkey\(([^\)]*)\).*', field_desc, re.I).groups()[0]
            except NotImplementedError:
                continue
            
            for pProperty in pEntity[ 'properties' ]:
                if  att_name != pProperty['code']: continue  
                if not 'refEntity' in pProperty:
                    pProperty['refEntity'] = table2model(table_ref)


# @transaction.commit_on_success
# @transaction.commit_manually
# @transaction.commit_manually(using='my_other_db')
def writeSchemaDef(dProject , request):

    # ===================================================================================================================
    # -----------------------------  Aqui arranca la escritura en la Db
    userProfile = getUserProfile(request.user, 'prototype', '')
    defValues = {
        'smOwningTeam' : userProfile.userTeam,
        'smOwningUser' : userProfile.user,
        'smCreatedBy' :  userProfile.user
    }

    # Borra y crea el modelo
    Model.objects.filter(project=dProject,
                          code='inspectDb', smOwningTeam=userProfile.userTeam).delete()

    dModel = Model.objects.get_or_create(project=dProject, code='inspectDb',
                          smOwningTeam=userProfile.userTeam, defaults=defValues)[0]

    # Guarda todas las entidades
    for entityName in pEntities:
        pEntity = pEntities[ entityName  ]
        pEntity.update(defValues)

        defValuesEnt = pEntity.copy()
        defValuesEnt['model'] = dModel
        if 'properties' in defValuesEnt:
            del defValuesEnt['properties']

        pEntity['dataEntity'] = Entity.objects.get_or_create(
                                              model=dModel,
                                              code=entityName,
                                              defaults=defValuesEnt)[0]


    transaction.commit()

    # Guarda las relaciones
    for entityName in pEntities:
        pEntity = pEntities[ entityName  ]
        dEntity = pEntity['dataEntity']

        for pProperty in pEntity[ 'properties' ]:
            prpName = pProperty['code']
            if 'refEntity' in pProperty:
                saveRelation(dProject, dEntity, dModel, pProperty, defValues, userProfile, prpName, 1)

            else:
                saveProperty(dEntity, pProperty, defValues, userProfile, prpName, 1)


# @transaction.commit_manually
def saveProperty(dEntity, pProperty, defValues, userProfile, prpName, seq):

    try:
        dProperty = dEntity.property_set.create(code=prpName, smOwningTeam=userProfile.userTeam)

        setDefaults2Obj(dProperty, pProperty, ['code'])
        setDefaults2Obj(dProperty, defValues)
        dProperty.save()
        transaction.commit()

    except Exception as e:
        transaction.rollback()
        prpName = '{0}.{1}'.format(prpName.split('.')[0] , seq)
        saveProperty(dEntity, pProperty, defValues, userProfile, prpName, seq + 1)
        return

# @transaction.commit_manually
def saveRelation(dProject, dEntity, dModel, pProperty, defValues, userProfile, prpName, seq):

    refName = pProperty['refEntity']
    if refName in  ['self', "'self'"]:
        refName = dEntity.code

    pRefEntity = pEntities.get(refName , None)
    if pRefEntity is None:
        if not 'notes' in pProperty:
            pProperty[ 'notes' ] = ''
        pProperty[ 'notes' ] += 'refEntity ( {0} ) not found;'.format(refName)
        saveProperty(dEntity, pProperty, defValues, userProfile, prpName, seq)
        return

    dRefEntity = pRefEntity['dataEntity']

    try:
        dRelation = Relationship(
                         code=prpName ,
                         entity=dEntity ,
                         refEntity=dRefEntity ,
                         smOwningTeam=userProfile.userTeam
                         )

        setDefaults2Obj(dRelation, pProperty, ['refEntity', 'code'])
        setDefaults2Obj(dRelation, defValues)
        dRelation.save()
        transaction.commit()

    except IntegrityError:
        transaction.rollback()
        prpName = '{0}.{1}'.format(prpName.split('.')[0] , seq)
        if not 'notes' in pProperty:
            pProperty[ 'notes' ] = ''
        pProperty[ 'notes' ] += 'duplicate field {0} rename to {1};'.format(prpName.split('.')[0], prpName)

        saveRelation(dProject, dEntity, dModel, pProperty, defValues, userProfile, prpName, seq + 1)
        return

    except Exception as e:
        transaction.rollback()
        # log
        return


def get_field_type(connection, table_name, row):
    """
    Given the database connection, the table name, and the cursor row
    description, this routine will return the given field type name, as
    well as any additional keyword parameters and notes for the field.
    """
    field_params = {}
    field_notes = ''

    try:
        field_type = connection.introspection.get_field_type(row[1], row)
    except KeyError:
        field_type = 'TextField'
        field_notes += 'This field type is a guess (specific type);'

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

