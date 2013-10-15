# -*- encoding: utf-8 -*-

from protoLib.utilsBase import verifyStr
from django.db.models.fields import NOT_PROVIDED


# Equivalencia de tipos
TypeEquivalence = {
    'BooleanField': 'bool',
    'CharField': 'string',
    'DateField': 'date',
    'DateTimeField': 'datetime',
    'DecimalField': 'decimal',
    'FloatField': 'decimal',
    'ForeignKey': 'foreigntext',
    'IntegerField': 'int',
    'TextField': 'text',
    'TimeField': 'time',
    'AutoField': 'autofield',
    'ManyToManyField': 'protoN2N',
    'OneToOneField': 'proto121',
    'JSONField': 'jsonfield',
}


<<<<<<< HEAD
def setFieldDict(protoFields,  field):

    # Verifico si existe en el diccionario
=======
def setFieldDict(protoFields, field):

    #Verifico si existe en el diccionario
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    pField = protoFields.get(field.name, {})

    pField['name'] = field.name
    pField['type'] = TypeEquivalence.get(field.__class__.__name__, 'string')

<<<<<<< HEAD
    # Verifica si existe parametrizacion a nivel de modelo.campo
    modelField = getattr(field, 'protoExt', {})

    # TODO:  useNull  para definirlo sobre el modelo
    # Recorrer el dict Field y agregar las prop q no estan  protoField
    setFieldProperty(pField, 'tooltip',  '', field, 'help_text', '')
=======
    #Verifica si existe parametrizacion a nivel de modelo.campo
    modelField = getattr(field, 'protoExt', {})

    #TODO:  useNull  para definirlo sobre el modelo

    # Recorrer el dict Field y agregar las prop q no estan  protoField
    setFieldProperty(pField, 'tooltip', '', field, 'help_text', '')
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

#    TODO: Error msg es un dictionario con varios tipos de errores
#    my_default_errors = {
#        'required': 'This field is required',
#        'blank' : '',
#        'invalid_choice': '',
#        'invalid': 'Enter a valid value',
#        'null': 'This field is required',
#        }
<<<<<<< HEAD
# setFieldProperty(  pField, 'invalidText',  '', field, 'error_messages',
# ''  )
=======
#    setFieldProperty(  pField, 'invalidText',  '', field, 'error_messages', ''  )

>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    # Agrega y/o sobreEscribe las propiedades definidas en protoExt
    for mProp in modelField:
        if pField.get(mProp, '') == '':
            pField[mProp] = modelField[mProp]

    # Si no existe el verbose name verificar los defautls del modelo
    if pField.get('header', '') == '':
<<<<<<< HEAD
        pField['header'] = verifyStr(field.verbose_name,  field.name)
=======
        pField['header'] = verifyStr(field.verbose_name, field.name)
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    # Otras propiedades a mapear
    if (getattr(field, 'editable', False) is False) or (pField['type'] == 'autofield'):
        pField['readOnly'] = True

    if (getattr(field, 'blank', False) is False):
        pField['required'] = True

    # Defaults
    if (field.default is not None) and (field.default is not NOT_PROVIDED):
        if pField['type'] == 'int' or pField['type'] == 'decimal':
            setFieldProperty(pField, 'prpDefault', 0, field, 'default', 0)

#        elif pField['type'] == 'bool':  FIX:  ( trae un proxy )
#            setFieldProperty(  pField, 'prpDefault', False , field, 'default', False  )
#        else:
# setFieldProperty(  pField, 'prpDefault', '' , field, 'default', ''  )

    # Comportamiento en la grilla por defecto
    pField['searchable'] = True
    pField['sortable'] = True

    if field.choices:
        pField['type'] = 'combo'

        cbChoices = []
        for opt in field.choices:
            cbChoices.append(opt[0])

        pField['choices'] = ','.join(cbChoices)

    elif field.__class__.__name__ == 'TextField':
        pField['vType'] = 'plainText'  # 'htmlText'

    elif field.__class__.__name__ == 'JSONField':
        pField['type'] = 'text'
        pField['readOnly'] = True
        pField['sortable'] = False

    elif field.__class__.__name__ == 'ManyToManyField':
        tmpModel = field.rel.through._meta
        relModel = field.related.parent_model._meta

        pField['searchable'] = False
        pField['sortable'] = False

        pField['vType'] = 'protoN2N'
<<<<<<< HEAD
        pField['conceptDetail'] = tmpModel.app_label + \
            '.' + tmpModel.object_name
=======
        pField['conceptDetail'] = tmpModel.app_label + '.' + tmpModel.object_name
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        pField['relatedN2N'] = relModel.app_label + '.' + relModel.object_name
        pField['detailField'] = field.related.var_name + '__pk'
        pField['masterField'] = 'pk'

    elif field.__class__.__name__ == 'ForeignKey' and (not isAdmField(field.name)):

#       Verificado ( q pasa cuando existen dos ref al mismo maestro )
<<<<<<< HEAD
        pField[
            'fkId'] = field.attname                              # Campo q contiene el ID
        pField['searchable'] = False

        # Nombre del modelo referenciado
        pField['zoomModel'] = field.rel.to._meta.app_label + \
            '.' + field.rel.to.__name__

        # Agrega la referencia al ID
        fKey = {
            'name':       field.attname,
            'fkField':    field.name,                                 # Campo de base a mostrar
            'hidden':     True,
            'readOnly':   True,
            'type':  'foreignid',
=======
        pField['fkId'] = field.attname                              # Campo q contiene el ID
        pField['searchable'] = False

        # Nombre del modelo referenciado
        pField['zoomModel'] = field.rel.to._meta.app_label + '.' + field.rel.to.__name__

        # Agrega la referencia al ID
        fKey = {
            'name': field.attname,
            'fkField': field.name,  # Campo de base a mostrar
            'hidden': True,
            'readOnly': True,
            'type': 'foreignid',
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        }
        protoFields[fKey['name']] = fKey

    # Campos autocreados
    if field.auto_created:
        pField['type'] = 'autofield'
        pField['readOnly'] = True
        pField['required'] = False

        pField['searchable'] = False
        pField['sortable'] = False

<<<<<<< HEAD
    # Lo retorna al diccionario
=======
    #Lo retorna al diccionario
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    tmpModel = field.model._meta

    # Ahora se usa el cpFromZoom,  si este campo contiene algo, no se evalua en el modelo
    # solo se evaluan los q contienen el nombre de un campo Zoom
<<<<<<< HEAD
    # pField['FromModel'] = tmpModel.app_label + '.' + tmpModel.object_name
=======
    #pField['FromModel'] = tmpModel.app_label + '.' + tmpModel.object_name
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    protoFields[pField['name']] = pField


def setFieldProperty(pField, pProperty, pDefault, field, fProperty, fpDefault):
<<<<<<< HEAD
    # Lee la propiedad del campo,  si es igual al default no la carga, excepto
    # para los prpDefault
=======
    # Lee la propiedad del campo,  si es igual al default no la carga, excepto para los prpDefault
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    vAux = getattr(field, fProperty, fpDefault)
    if (type(vAux) == type(pDefault)) and (vAux != pDefault):
        pField[pProperty] = vAux
    elif fProperty == 'default':
        pField[pProperty] = vAux


def isAdmField(fName):
<<<<<<< HEAD

    # Los campos de seguridad
    if (fName in ['smOwningUser', 'smCreatedBy', 'smModifiedBy', 'smCreatedOn',
       'smOwningTeam', 'smModifiedOn', 'smWflowStatus', 'smRegStatus'
                  ]):
        return True

    return False
=======
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    # Los campos de seguridad
    if (fName in ['smOwningUser',
                  'smCreatedBy',
                  'smModifiedBy',
                  'smCreatedOn',
                  'smOwningTeam',
                  'smModifiedOn',
                  'smWflowStatus',
                  'smRegStatus'
                  ]):
        return True

    return False

#----------------------------------------------------------
<<<<<<< HEAD
# DGT:  choice,  Convierte las propiedades en una lista
=======
#DGT:  choice,  Convierte las propiedades en una lista
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
#        a = []
#        for c in field.choices:
#            a[c[0]] = c[1]              //  Dict
#            a.push ( [ c[0], c[1] ])    //  List
