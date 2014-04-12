from variables import SM_requiredField, SM_cllPCI, SM_PConfig
from Tools import SM_getModelName, SM_copyProps, SM_typeOf

def SM_getColDefinition(vFld) :

    if (not vFld.get('header')) :
        vFld['header'] = vFld.get('name');

    colDefinition = {
        'dataIndex' : vFld.get('name'),
        'text' : vFld.get('header')
    }

    # Propiedades q seran copiadas a las columnas de la grilla
    lstProps = ['flex', 'width', 'minWidth', 'sortable', 'hidden', 'xtype', 'readOnly', 'render', 'align', 'format', 'tooltip', 'idProtoGrid'];

    colDefinition = SM_copyProps(colDefinition, vFld, True, lstProps);

    # Copia las propiedades de base al editor
    lstProps = ['prpDefault',

    # string
    'required', 'readOnly', 'minLength', 'minLengthText', 'maxLength', 'maxLengthText',

    # int, decimal
    'step',

    # int, decimal, date, datime, time
    'minValue', 'minText', 'maxValue', 'maxText',

    # date, datime
    'disabledDays', 'disabledDaysText', # [0, 6]

     #@zoomModel : Contiene el modelo del FK, se carga automaticamente,
     # puede ser modificado para cargar una vista particular,
     # una buena practica es dejar los modelos de base para los zooms y generar vistas
     # para las opciones de trabajo
     #
    'zoomModel', 'zoomMultiple',

    #@fkId : Llave correspondiente al zoom
    'fkId',

    #@zoomFilter : Filtro de base fijo para el zoom ( puede venir definido en zoomView )
    'zoomFilter',

    #@fromField :  Campos q sera heredados a la entidad base
    'cpFromField', 'cpFromZoom', 'idProtoGrid']
    
    editor = SM_copyProps({}, vFld, True, lstProps)

    # Requerido
    if (vFld.get('required') == True) :
        colDefinition['allowBlank'] = False
        editor['allowBlank'] = False

        colDefinition['allowOnlyWhitespace'] = False
        editor['allowOnlyWhitespace'] = False 

    #TODO: vType ( eMail, IpAdress, etc ... )
    # editor.vtype = 'email'

    # Determina el xType y otros parametros
    if (not vFld.get('type')):
        vFld['type'] = 'string'
    
    if (vFld.get('choices') and len(vFld.get('choices').split(",")) > 1) :
        vFld['type'] = 'combo'

    if (vFld.get('type') == 'string'):
        if (not colDefinition.get('flex')):
            colDefinition['flex'] = 1
            

    elif (vFld.get('type') == 'text'):
        if (not colDefinition.get('flex')) :
            colDefinition['flex'] = 2
            
        colDefinition['renderer'] = 'columnWrap'

    elif (vFld.get('type') == 'int'):
        pass
    
    elif (vFld.get('type') == 'secuence'):
        colDefinition['xtype'] = 'numbercolumn'
        colDefinition['align'] = 'right'
        colDefinition['format'] = '0,000'

        editor['xtype'] = 'numberfield'
        editor['format'] = colDefinition['format']
        editor['align'] = 'right'
        editor['allowDecimals'] = False


    elif (vFld.get('type') =='decimal'):
        pass
    
    elif (vFld.get('type') =='money'):
        colDefinition['xtype'] = 'numbercolumn'
        colDefinition['align'] = 'right'
        colDefinition['format'] = '0,000.00'
        # vFld['renderer'] = 'usMoney'

        editor.xtype = 'numberfield'
        editor.format = colDefinition['format']
        editor.align = 'right'
        editor.allowDecimals = True
        editor.decimalPrecision = 2

    elif (vFld.get('type') =='date'):
        colDefinition['xtype'] = 'datecolumn';
        colDefinition['format'] = 'Y/m/d';

        editor.xtype = 'datefield';
        editor.format = colDefinition['format'];

    elif(vFld.get('type') == 'datetime'):
        pass
        # colDefinition['xtype'] = 'datecolumn'
        # colDefinition['format'] = 'Y/m/d H:i:s'
        # editor.xtype = 'datefield'
        # editor.format = 'Y/m/d'
        # editor.timeFormat = 'H:i'

    elif (vFld.get('type') == 'time'):
        #TODO:  En la edicion de grilla, al regresar cambia el formato
        colDefinition['xtype'] = 'datecolumn';
        colDefinition['format'] = 'H:i';
        #  'H:i:s'

        editor['xtype'] = 'timefield';
        editor['format'] = colDefinition['format'];

    elif (vFld.get('type') ==  'bool'):
        colDefinition['xtype'] = 'mycheckcolumn'
        colDefinition['editable'] = False
        colDefinition['inGrid'] = True

        editor['xtype'] = 'checkbox';
        # editor.cls = 'x-grid-checkheader-editor'

    elif (vFld.get('type') == 'combo'):
        editor['xtype'] = 'combobox'
        editor['typeAhead'] = True
        editor['triggerAction'] = 'all'
        editor['selectOnTab'] = True

        # Lo normal es q venga como una lista de opciones ( string )
        cbChoices = vFld.get('choices')
        if (SM_typeOf(cbChoices) == 'string') :
            cbChoices = cbChoices.split(",");
        else :
            cbChoices = []

        editor['store'] = cbChoices;
        editor['lazyRender'] = True;
        editor['listClass'] = 'x-combo-list-small';

    elif (vFld.get('type') ==  'foreigntext'):
        # El zoom se divide en 2 cols el texto ( _unicode ) y el ID ( foreignid )
        if (not colDefinition.get('flex')) :
            colDefinition['flex'] = 1

        vFld['cellLink'] = True;
        editor['xtype'] = 'protoZoom';
        editor['editable'] = False;

    elif (vFld.get('type') == 'foreignid'):
        # El zoom id debe estar oculto
        # colDefinition['hidden']= true
        editor['xtype'] = 'numberfield';
        editor['hidden'] = True;

    elif (vFld.get('type') == 'autofield'):
        pass


    # Ancho minimo
    if (not colDefinition.get('minWidth')) :
        colDefinition['minWidth'] = 70

    # verificacion de xtype
    if(colDefinition.get('xtype') == 'mycheckcolumn'):
        pass
    
    elif(colDefinition.get('xtype') == 'datecolumn'):
        pass
    
    elif(colDefinition.get('xtype') == 'numbercolumn'):
        pass
    
    elif(colDefinition.get('xtype') == 'checkbox'):
        colDefinition['xtype'] = 'mycheckcolumn'
    
    elif(colDefinition.get('xtype') == 'datefield'):
        colDefinition['xtype'] = 'datecolumn'
    
    elif(colDefinition.get('xtype') == 'numberfield'):
        colDefinition['xtype'] = 'numbercolumn'
    
    else:
        colDefinition['xtype'].remove
    

    # Asigna las coleccoiones de presentacion
    # El foreignid puede ser editable directamente,
    if (((vFld.get('type') == 'autofield' ) or vFld.get('readOnly')) and (vFld.get('type') != 'bool')) :
        colDefinition['renderer'] = cellReadOnly
        
    else :
        colDefinition['editor'] = editor

    # WordWrap
    if (vFld.get('wordWrap') == True) :
        colDefinition['renderer'] = columnWrap

    # Agrega un tool tip con el contenido de la celda
    if(vFld.get('cellToolTip')):
        colDefinition['renderer'] = cellToolTip

    # Formatea el contenido como un hiperLink, TODO: la logica debe estar en otra propiedad
    if(vFld.get('cellLink')):
        colDefinition['renderer'] = cellLink

    # Maneja los subtipos
    
    # vType stopLigth  Maneja el codigo de colores para un semaforo con 3 indicadores, 2 limites Red-Yellow; Yellow-Green
    if (vFld.get('vType') == 'stopLight') :
        colDefinition['renderer'] = cellStopLight


    # sortable por defecto
    if(not colDefinition.get('sortable')):
        colDefinition['sortable'] = False

    return colDefinition;

    #
    def columnWrap(value) :
        return '<div style="white-space:normal; text-align:justify !important";>' + value + "</div>";


    def cellToolTip(value, metaData, record, rowIndex, colIndex, store, view) :
        metaData['tdAttr'] = 'data-qtip="' + value + '"'
        return value


    def cellReadOnly(value, metaData, record, rowIndex, colIndex, store, view) :
        return '<span style="color:grey;">' + value + '</span>'

    def cellLink(value) :
        return '<a href="#">' + value + '</a>'

    def cellStopLight(value, metaData, record, rowIndex, colIndex, store, view) :
        #
        #TODO: Leer las propiedades stopLightRY y  stopLightYG  para comparar,

        #vType stopLigth  Maneja el codigo de colores para un semaforo con 3 indicadores,
        #stopLightRY : valor limite  de Rojo a Amarillo
        #stopLightYG : valor limite  de Amarillo a Verde
        #si el valor RY > YG se asume una secuencia inversa.
        #los valores son comparados estrictamente mayor  X > RY -->  Y
        #/

        cssPrefix = "x-" # Ext.baseCSSPrefix
        cls = []

        if (value > 66) :
            cls.push(cssPrefix + 'grid-stopligth-green')
            
        elif (value > 33) :
            cls.push(cssPrefix + 'grid-stopligth-yellow')
            
        elif (value > 0):
            cls.push(cssPrefix + 'grid-stopligth-red')

        #TODO: Probar <span>  en vez de <div>
        # return '<span style="color:green;">' + val + '</span>';

        return '<div class="' + cls.join(' ') + '">&#160;' + value + '</div>'
    


def SM_getFormFieldDefinition(vFld) :

    colDefinition = SM_getColDefinition(vFld)
    formEditor = {'readOnly' : True }

    # Se inicializa ro, en caso de q no se encuentre en el dict

    if (colDefinition.get('editor')) :
        formEditor = colDefinition.get('editor')

    # Field Label
    formEditor['name'] = vFld.name;
    formEditor['fieldLabel'] = vFld.get('fieldLabel') or vFld.get('header') or vFld.get('name')
    formEditor['fieldLabel'] = formEditor.get('fieldLabel').replace('<strong>', '').replace('</strong>', '')
    formEditor.fieldLabel = formEditor.get('fieldLabel').replace('<b>', '').replace('</b>', '')
    if (vFld.get('required')) :
        formEditor['fieldLabel'] = '<strong>' + formEditor['fieldLabel'] + '</strong>'
    
    if (vFld.get('primary')):
        formEditor['afterLabelTextTpl'] = SM_requiredField
    
    formEditor['fieldLabel'] = formEditor.get('fieldLabel').title()


    # Casos especiales
    if( vFld.get('type') == 'text'):
        formEditor['xtype'] = 'textarea'
        formEditor['height'] = 100
        formEditor['labelAlign'] = 'top'

    elif (vFld.get('type') == 'html'):
        formEditor['xtype'] = 'textarea'
        formEditor['height'] = 100
        formEditor['labelAlign'] = 'top'


    # Inicializa los tipos
    formEditor['__ptType'] = 'formField'
    if (not formEditor.get('xtype')) :
        formEditor['xtype'] = 'textfield'
        
    return formEditor


# *********************************************************
def SM_loadPci(viewCode, loadIfNot, options) :
    # TODO: refactor,  ne pas besoin de retourner true/false; retourner toujour option.xx.call( )
    return False

    #      options = options or {}
    #    # Verificar si la opcion esta creada
    #    myMeta = SM_cllPCI[viewCode];

    #    # Verifica modelo
    #    if (myMeta and Ext.ClassManager.isCreated(SM_getModelName(viewCode))) :

    #        # Asigna la llave, pues si se hace una copia seguiria trayendo la misma viewCode de base
    #        myMeta[viewCode] = viewCode
    #        return True

    #    else :
    #        # Solo retorna algo cuando se usa para evaluar
    #        if (not loadIfNot) :
    #            return False
    #        options = {
    #                   'scope' : this,
    #                   'success' : lambda :{}, 
    #                   'failure' : lambda :{}
    #                   }

    
