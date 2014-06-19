from pciProperties import getSimpleProperties, _MetaProperties
from pciObjects import _METAOBJECTS
from ProtoStore import SM_loadPci, SM_getFormFieldDefinition
from Tools import SM_clone

####################### EMPLACEMENT ###################
def getTemplate(ptType,forForm,metaField) :
    # TODO:  agregar en la definicion del campo un colList para hacer un combo automatico con los nombres de campo
    #@forForm boolean for Form Definition

    prps = {}
    qtips = {}
    choices = {}
    ppTypes = {}
    #prpName, prpValue, prpHelp, prpChoices, prpDict, prpType;

    # Lee la plantilla de la variable publica
    objConfig = _METAOBJECTS.get(ptType) or {}

    # Recorre el vector de propieades
    # puede ser solo el nombre o la tupla name, value
    # [ 'x' , { 'name' : 'xxx' , 'value' : '' }]
    for ix in objConfig.get('properties') :
        prp  = ix;

        #Trae los valores directamente
        if (type(prp) == dict) :
            prpName = prp.get('name')
            prpValue = prp.get('value')
        else :
            prpName = prp;
            prpValue = _MetaProperties.get(prpName) #or None


        prpHelp = _MetaProperties.get(prpName + '.help')
        prpChoices = _MetaProperties.get(prpName + '.choices')
        prpType = _MetaProperties.get(prpName + '.type')

        # Para presentacion en la forma o en las propiedades
        if forForm :
            if prpValue :
                prps[prpName] = prpValue

        else :
            prps[prpName] = prpValue or ''
            qtips[prpName] = prpHelp
            if prpChoices :
                choices[prpName] = prpChoices
            if prpType :
                ppTypes[prpName] = prpType


    # Si es un campo obtiene los defaults de fields
    if metaField :
        prpDict = SM_getFormFieldDefinition(metaField);
        prps = prpDict #apply( prps, prpDict)


    # Garantiza q no venga una definicion generica ( solo para los formFields )
    if (forForm and (not prps.get('xtype'))):
        prps['xtype'] = ptType
    if ((prps.get('xtype') == 'formField' ) and ( ptType == 'formField')):
        prps['xtype'] = 'textfield'


    return {'__ptConfig' : prps,
            '__ptHelp' : qtips,
            '__ppChoices' : choices,
            '__ppTypes' : ppTypes,
            '__roProperties' : objConfig.get('roProperties') or []
            }

#################################
def defineFormLayout(this) :

    def setFieldDefaults(prLayout, key) :
        # Asigna los fieldDefaults q vienen en los contenedores
        sAux = prLayout.get(key)
        if (sAux) :
            prLayout['fieldDefaults'][key] = sAux


    def defineProtoFormItem(me, protoObj, protoIx) :
        
        sDataType = type(protoObj);

        
        if (sDataType == dict) :
            # Configura el objeto
            if (not protoObj.get('__ptConfig')):
                protoObj['__ptConfig'] = getSimpleProperties(protoObj,None);
                
            if (protoObj.get('__ptConfig') and (not(protoObj['__ptConfig'].get('name')))):
                protoObj['__ptConfig']['name'] = protoIx;

            __ptType = protoObj['__ptConfig'].get('__ptType') or protoObj.get('__ptType')
                
            if (not __ptType):
                # print( 'El objeto no tiene tipo definido' , protoObj )
                return 

            elif (__ptType == 'formField'):
                # protoIx es el field Name, si no viene debe buscarlo en __ptConfig [ name ]
                protoIx = protoObj.get('name') or protoObj['__ptConfig'].get('name')

                myFld = me['myFieldDict'].get(protoIx);

                if(myFld):                        
                    template = getTemplate(__ptType, True, myFld);

#                     if (myFld.required && !myFld.fkId && me.newForm) {
#                         template.__ptConfig.listeners.render = function(field) {
#                             Ext.Ajax.request({
#                                 url : _SM._PConfig.urlGetNextIncrement,
#                                 method : 'GET',
#                                 params : {
#                                     fieldName : myFld.name,
#                                     viewEntity : me.myMeta.viewEntity
#                                 },
#                                 success : function(result, request) {
#                                     var jsonData = Ext.decode(result.responseText);
#                                     if (jsonData.increment) {
#                                         field.setValue(jsonData.increment);
#                                     }
#                                 },
#                                 failure : function() {
#                                     console.log('failure on get increment');
#                                 }
#                             });
#                         };
#                     }
                    
                    template['__ptConfig'] = protoObj.get('__ptConfig')
                    prLayout = template.get('__ptConfig')

                    # ReadOnlyCls
                    if (prLayout.get('xtype') == 'protoZoom') :
                        prLayout['readOnlyCls'] = 'protoLink'
                        
                    elif (prLayout.get('xtype') != 'checkbox'):
                        prLayout['readOnlyCls'] = 'protofield-readonly'
                        

                else :
                    # El campo no existe en la definicion:  es un label
                    # Incluso los campos calculados deben existir en la definicion
                    # print( 'invalid formField,name  :' , protoObj )
                    prLayout = {'text' : protoIx,
                                'xtype' : 'label',
                                'margin' : '4',
                                'padding' : '4',
                                'border' : 1,
                                'tooltip' : 'field definition not found',
                                'style' : {'borderColor' : 'red',
                                            'borderStyle' : 'solid',
                                            'bodyStyle' : ';border-right:none;border-left:none;border-top:none;'
                                            }
                                }
                    

            elif (__ptType == 'protoGrid'):
                #########################A REVOIR###############################################################
                if (SM_loadPci(protoObj.get('viewCode'), False)): 

                    template = getTemplate(__ptType, True, myFld)
                    template['__ptConfig'] = protoObj['__ptConfig']
                    prLayout = template['__ptConfig']
                    ######################################################################################
                    if ((not prLayout.get('minWidth')) or (prLayout['minWidth'] < 100)) :
                        prLayout['minWidth'] = 250;
                        
                    # Inicia la grilla sin datos
                    prLayout['initialFilter'] = [{
                        'property' : 'pk',
                        'filterStmt' : -1
                    }]
                        
                    if(protoObj.get('__ptConfig') and protoObj['__ptConfig'].get('name')):
                        del protoObj['__ptConfig']['name']
                            
                else :
                    prLayout = {
                                'xtype' : 'label',
                                'margin' : '4',
                                'padding' : '4',
                                'border' : 1,
                                'text' : 'ERROR: grid definition not found '+ str(protoObj) + '[viewCode]',                  
                                'style' :{
                                          'borderColor' : 'red',
                                          'borderStyle' : 'solid',
                                          'bodyStyle' : ';border-right:none;border-left:none;border-top:none;'
                                          }
                                }
                    print('defineProtoFormItem', protoObj,'[viewCode] not found!!') #SM.errorMessage

                    
            elif(__ptType == 'htmlset'):
                template = getTemplate(__ptType, True, False)
                template['__ptConfig'] = protoObj.get('__ptConfig')
                prLayout = template['__ptConfig'] 
                
                if(protoObj.get('items')):
                    prLayout['htlmFields'] = protoObj['items']
                        
                if((protoObj.get('__ptConfig')) and (protoObj['__ptConfig'].get('name'))):
                    del protoObj['__ptConfig']['name']

            elif(__ptType == 'detailButton'):
                template = getTemplate(__ptType, True, False)
                template.get['__ptConfig'] = protoObj.get('__ptConfig')
                prLayout = template.get('__ptConfig')
                prLayout['minWidth'] = 100;

            else :
                template = getTemplate(__ptType, True, False)
                template['__ptConfig'] = protoObj.get('__ptConfig')
                prLayout = template.get('__ptConfig')

                # Agrega los items
                prLayout['items'] = [];
                prItems = protoObj.get('items')

                if(prItems):
                    for ix in prItems :
                        if (ix['indexOf']("__pt") == 0):
                            continue;
                        
                        prVar = ix;
                        prFld = defineProtoFormItem(me, protoObj, prVar, ix);
                        if (prFld):
                            prLayout['items'].append(prFld);          
                
                #Establece el layout  ( Columns )
                sAux = prLayout.get('fsLayout')
                if sAux :                    
                    prLayout['defaultType'] = 'textfield'
                    prLayout['layout'] = 'column'
                    prLayout['defaults'] = {
                        'padding' : '2 2'
                    }

                    if(sAux == "1col") :
                        prLayout['defaults']['columnWidth'] = 1
                    elif(sAux == "2col"):
                        prLayout['defaults']['columnWidth'] = 0.5
                    elif(sAux == "3col"):
                        prLayout['defaults']['columnWidth'] = 0.33
                    
                    del prLayout['fsLayout']

                    #Parametros de labels
                    prLayout['fieldDefaults'] = {}
                    setFieldDefaults(prLayout, 'labelAlign')
                    setFieldDefaults(prLayout, 'labelWidth')
                    setFieldDefaults(prLayout, 'hideLabel')


                #Tooltip
  

        elif (sDataType == list):
            prLayout = [];
            for ix in protoObj :
                prVar = ix

                #Si es un array el padre es ../..
                prFld = defineProtoFormItem(me, prVar, ix)
                if (prFld):
                    prLayout.append(prFld)             
            
        return prLayout
        

    # @formatter:off
    # @formatter:on
    me = this
    myFormDefinition = SM_clone(this.get('myMeta').get('formConfig'))

    me['prFormLayout'] = []

    for ixV in myFormDefinition.get('items'):
        lObj = ixV
        # Envia el contenedor y el objeto
        prItem = defineProtoFormItem(me, {'__ptType' : 'panel'}, lObj)
        me['prFormLayout'].append(prItem)
            
    return me.get('prFormLayout')
