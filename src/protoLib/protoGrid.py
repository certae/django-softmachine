# -*- coding: utf-8 -*-

from django.contrib.admin.sites import  site
from utilsBase import verifyList, copyProps, list2dict
from usrDefProps import verifyUdpDefinition
from protoField import  setFieldDict


def getProtoAdmin(model):
    """ Carga la protoDefinicion, del modelo y luego del admin,
    * La definicion del admin sirve para definir los EntryPoint, 
    * pero no es necesario, la protoDefinicion se puede guardar directamente 
    * en el modelo 
    """

    # Siempre existe, la creacion del site la asigna por defecto
    model_admin = site._registry.get(model)

    # Si no esta registrado genera una definicion en blanco
    if not model_admin:
        model_admin = {}
    protoExclude = getattr(model_admin , 'exclude', [])
    if protoExclude is None:
        protoExclude = []

    protoMeta = getattr(model, 'protoExt', {})
    protoExt = getattr(model_admin, 'protoExt', {})

    protoMeta[ 'exclude'] = protoMeta.get('exclude', []) + protoExclude

    if not isinstance(protoMeta, dict):
        protoMeta = {}
    if not isinstance(protoExt, dict):
        protoExt = {}

    protoMeta = copyProps(protoMeta, protoExt)

    return  model_admin, protoMeta



class ProtoGridFactory(object):
    """ Construye la definicion por defecto de la interface 
    """

    def __init__(self, model, viewCode, model_admin, protoMeta):

        self.model = model# the model to use as reference
        self.title = self.model._meta.verbose_name.title()

        # importa las definiciones del modelo y del admin
        self.model_admin = model_admin
        self.protoMeta = protoMeta

        # garantiza la llave
        self.viewCode = viewCode

        # Inicializa
        self.fields = []
        self.fieldsDict = {}
        self.gridConfig = self.protoMeta.get('gridConfig', {})

        # Los campos deben ser inicialmente un diccionario para poder validarlos
        protoMeta[ 'fields' ] = protoMeta.get('fields', [])
        if isinstance(protoMeta[ 'fields' ], list)  :
            self.fieldsDict = list2dict(protoMeta[ 'fields' ], 'name')


        # UDPs para poder determinar el valor por defecto ROnly
        self.pUDP = self.protoMeta.get('usrDefProps', {})
        verifyUdpDefinition(self.pUDP)

        # lista de campos para la presentacion en la grilla
        pListDisplay = verifyList(self.gridConfig.get('listDisplay', []))
        if not pListDisplay:
            pListDisplay = verifyList(getattr(self.model_admin , 'list_display', []))

            # Por defecto solo vienen  Chk, _str_
            try:
                pListDisplay.remove('action_checkbox')
            except ValueError:
                pass

            if len(pListDisplay) == 0:
                pListDisplay = [ '__str__' ]

        self.gridConfig['listDisplay'] = pListDisplay


        # Se leen los excluidos del admin, no se requiere
        # en la protoDef, pues los campos se enumeran explicitamente
        protoExclude = verifyList(self.protoMeta.get('exclude', []))

        # Se leen los readonly fields para setear el attr readOnly = true
        pReadOnlyFlds = verifyList(self.gridConfig.get('readOnlyFields', []))
        if not pReadOnlyFlds:
            pReadOnlyFlds = verifyList(getattr(self.model_admin , 'readonly_fields', []))

        self.gridConfig['readOnlyFields'] = pReadOnlyFlds

        # @@ Por alguna Ext no retiene el IdProperty ( idInternal al hacer click en las filas )
        # idName = model._meta.pk.name

        # La lista de campos del admin sirve de base, pues puede haber muchos mas campos en proto q en admin
        # Si solo queda el __str__ , asume todos los campos del modelo

#        iCount = len( pListDisplay )
#        if ( iCount == 0  ) or ( iCount == 1 and (pListDisplay[0] == '__str__')) :

        # Se crean los campos con base al modelo ( trae todos los campos del modelo )
        # for field in self.model._meta._fields(): #only for django 1.4
        for field in self.model._meta.fields:
            if field.name in protoExclude:
                continue
            setFieldDict (self.fieldsDict , field)

        # Agrega el __str__ que sirve de base para los zooms
        fName = '__str__'
        fdict = self.fieldsDict.get(fName , {})
        if not fdict:
            fdict['name'] = fName
            self.fieldsDict[ fName ] = fdict

            setDefaultField (fdict, self.model, self.viewCode)


        # Genera la lista de campos y agrega el nombre al diccionario
        for key in self.fieldsDict:
            fdict = self.fieldsDict[ key ]
            if (fdict.get('name', '') == '') :
                fdict[ 'name' ] = key

            if key in pReadOnlyFlds:
                fdict[ 'readOnly' ] = True

            # Repasa las propiedades de base, ver por q no esta pasando trayendo las props de base ( ie:  defaulValue )
            if (not (key.startswith('udp__'))):
                try:
                    field = self.model._meta.get_field(key)
                    setFieldDict (self.fieldsDict , field)
                    fdict = self.fieldsDict[ key ]
                except:
                    # Es posible q se puedan configuar propiedades no pertenecientes a la tabla como editables???
                    fdict[ 'readOnly' ] = True

            self.fields.append(fdict)

    def getFieldSets(self):
        """ El field set determina la distribucion de los campos en la forma
        """

        pForm = self.protoMeta.get('formConfig', { 'items' : [] })
        prFieldSet = pForm[ 'items' ]

        # Si no han sido definido genera por defecto
        if (len(prFieldSet) == 0):

            # Toma la lista del field set si no existe lo crea de base,
            baseFieldSet = verifyList(getattr(self.model_admin , 'fieldsets', []))

            if (len(baseFieldSet) == 0):
                # Genera la lista de campos y agrega el nombre al diccionario

                prBlank = []
                prItems = []
                prTexts = []
                prChecks = []
#               prIds = []
                prAdmin = []

                for key in self.fieldsDict:
                    vFld = self.fieldsDict.get(key , {})
                    fType = vFld.get('type', 'string')

                    if  vFld.get('crudType') == 'storeOnly' :
                        continue

                    if (key in [ 'smOwningUser', 'smOwningTeam', 'smCreatedBy',  'smCreatedOn', 'smModifiedBy', 'smModifiedOn', 'smWflowStatus','smRegStatus',  'smUUID' ]) :
                        prAdmin.append({ 'name' : key  , '__ptType' : 'formField'})

                    elif (fType == 'text') :
                        prTexts.append({ 'name' : key  , '__ptType' : 'formField'})

                    elif (fType in ['autofield', 'foreignid']) :
                        continue

                    elif (fType == 'bool') :
                        prChecks.append({ 'name' : key  , '__ptType' : 'formField'})

                    elif (fType == 'protoN2N') :
                        continue

                    elif (key == '__str__') :
                        continue

                    elif (vFld.get('required', False) == False):
                        prBlank.append({ 'name' : key  , '__ptType' : 'formField'})

                    else:
                        prItems.append({ 'name' : key  , '__ptType' : 'formField'})


                if prItems :
                    prSection = { '__ptType' : 'fieldset', 'fsLayout' : '2col'  }
                    prSection['items'] = prItems
                    prFieldSet.append (prSection)

                if prChecks :
                    prSection = { '__ptType' : 'fieldset', 'fsLayout' : '2col'  }
                    prSection['items'] = prChecks
                    prFieldSet.append (prSection)

                if prBlank :
                    prSection = { '__ptType' : 'fieldset', 'fsLayout' : '2col'  }
                    prSection['items'] = prBlank
                    prFieldSet.append (prSection)

                if prTexts :
                    prSection = { '__ptType' : 'fieldset', 'fsLayout' : '1col'  }
                    prSection['items'] = prTexts
                    prFieldSet.append (prSection)


                if prAdmin :
                    prSection = { '__ptType' : 'fieldset', 'fsLayout' : '2col',
                                  'title' : 'Admin', 'collapsible' : True, 'collapsed' : True  }
                    prSection['items'] = prAdmin
                    prFieldSet.append (prSection)

#                if prIds :
#                    prSection = { '__ptType' : 'fieldset','fsLayout' : '2col'  }
#                    prSection['items'] = prIds
#                    prFieldSet.append ( prSection )


            # si existe un fieldset convierte la estructura
            else:
                for name, opts in baseFieldSet:

                    prSection = { '__ptType' : 'fieldset', 'fsLayout' : '2col' }
                    if (name != None):
                        prSection[ 'title' ] = name.capitalize()

                    classes = getattr(opts, 'classes', [])
                    if ('collapse' in classes):
                        prSection['collapsible'] = True

                    prItems = []
                    for formField in opts['fields']:
                        getFieldsInSet(self, prItems, formField)

                    prSection['items'] = prItems
                    prFieldSet.append(prSection)

        return pForm

    def get_details(self):

        # Inicializa con los valores definidos,
        details = self.protoMeta.get('detailsConfig', [])


        # Si no han sido definido genera por defecto
        if (len(details) == 0):
            details = getModelDetails(self.model)

        return details


def getModelDetails(model):

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

    # Tabla intermedia referenciada en N2N ( desde la tabla base )
    for detail in opts.get_all_related_many_to_many_objects():
        tmpTable = detail.field.rel.through._meta
        if not tmpTable.auto_created:
            continue

        relTable = detail.model._meta
        details.append({
            "menuText"      : tmpTable.object_name,
            "conceptDetail" : tmpTable.app_label + '.' + tmpTable.object_name,
            "relatedN2N"    : relTable.app_label + '.' + relTable.object_name,
            "detailField"   : detail.parent_model._meta.module_name + '__pk',# ???
            "detailName"    : detail.parent_model._meta.module_name,
            "masterField"   : 'pk',
            })

    # Tabla intermedia referenciada en N2N ( desde la tabla referenciada )
    for field in opts._many_to_many():
        tmpTable = field.rel.through._meta
        if not tmpTable.auto_created:
            continue

        relTable = field.related.parent_model._meta
        details.append({
            "menuText"      : tmpTable.object_name,
            "conceptDetail" : tmpTable.app_label + '.' + tmpTable.object_name,
            "relatedN2N"    : relTable.app_label + '.' + relTable.object_name,
            "detailField"   : field.related.var_name + '__pk',
            "detailName"    : field.related.var_name,
            "masterField"   : 'pk',
            })


    return details


def setDefaultField (fdict, model, viewCode):
    """ 
        set __str__ properties   
    """
    fdict['header'] = model._meta.verbose_name.title()
    fdict['type'] = 'string'
    fdict['readOnly'] = True
    fdict['sortable'] = True
    fdict['flex'] = 1
    fdict['cellLink'] = True
    fdict['zoomModel'] = viewCode
    fdict['fkId'] = 'id'




def getBaseModelName(viewCode):
#    Verifica si es una instancia del modelo ( vista )
#    Concept Format :    app.model.view
#    Return :  app.model ,  view

    from protoGetPci import PROTO_PREFIX
    from models import ProtoDefinition

    # import django.utils.simplejson as json
    import json

    if viewCode.count(".") == 2:
        app, model = viewCode.split(".")[:2]
        viewEntity = app + '.' + model
    else:
        viewEntity = viewCode

    if not(viewEntity.startswith(PROTO_PREFIX)  and viewEntity != PROTO_PREFIX):
        try:
            protoDef = ProtoDefinition.objects.get(code=viewEntity)
        except:
            return viewEntity

        protoMeta = json.loads(protoDef.metaDefinition)
        viewEntity = protoMeta.get('viewEntity', viewCode)

    return viewEntity


def getFieldsInSet(self, prItems, formFields):
    # Al recorrer el fieldset pueden venir tuplas o arrays anidados, se manejan en una unica lista

    if type(formFields).__name__ == 'str':
        if verifyField(self, formFields):
            prItems.append ({ 'name' : formFields, '__ptType' : 'formField' })
        return

    for formField in formFields:
        if type(formField).__name__ in [ type(()).__name__, type([]).__name__]:
            getFieldsInSet(self, prItems, formField)
        elif verifyField(self, formField):
            prItems.append ({ 'name' : formField, '__ptType' : 'formField' })


def verifyField(self, fName):
    try:
        # Recibe los parametros de los campos del modelo
        field = self.model._meta.get_field(fName)
        setFieldDict (self.fieldsDict , field)
        fdict = self.fieldsDict[ fName ]
        self.fields.append(fdict)
        return True
    except:
        return False

