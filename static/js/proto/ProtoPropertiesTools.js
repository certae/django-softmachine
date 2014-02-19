/*
 * Dario Gomez  1206
 *
 * Debe prepara las propiedades con los valores por defeco adecuados, y
 * presentarlos en el panel de propiedades ( q permite manejra el edito de combos )
 *
 */


function prepareProperties( record , myMeta,  propPanel  ){
    /* Pepara la tabla de propiedades
     * retorna propPanel
     */

    var template = {};

    // var parentType = ''
    // if ( record.parentNode ) parentType  =  record.parentNode.data.text

    // La data configurada
    var __ptConfig  =  _SM.clone( record.data.__ptConfig ),
        __ptType = record.data.__ptType,
        __ptText = record.data.text, 
        myFieldDict = _SM.getFieldDict( myMeta );

    if ( __ptType  in _SM.objConv( [ 'field', 'formField' ]) ) {

        // Default Data ( aplica los defaults a la pcl y luego a la definicion del campo )
        template = getTemplate( __ptType, false, myFieldDict[ __ptText  ] );
        __ptConfig[ 'name' ]  = __ptText;

    // } else if ( __ptType  in _SM.objConv( [ 'detailDef', 'sheetConfig' ]) ) {
        // template = getTemplate( __ptType, false  )

    }  else {
        // Default Data ( El nombre del nodo es el tipo de datos real )
        template = getTemplate( __ptType , false  );
    }

    // Default Data ( aplica los defaults a la definicion del campo )
    __ptConfig = Ext.apply(  template.__ptConfig, __ptConfig   );

    // Solo maneja las propiedades propias de la version
    __ptConfig = clearPhantonProps( __ptConfig,  __ptType );

    propPanel.setSource( __ptConfig );
    propPanel.setCombos( template.__ppChoices );
    propPanel.setTypes( template.__ppTypes );

    propPanel.readOnlyProps = ['__ptType', 'name'].concat ( template.__roProperties );
    propPanel.sourceInfo = template.__ptHelp;

};




function getTemplate( ptType, forForm,  metaField  )  {
    // TODO:  agregar en la definicion del campo un colList para hacer un combo automatico con los nombres de campo
    //@forForm boolean for Form Definition

    var prps = {}, qtips = {}, choices = {}, ppTypes = {};
    var prpName, prpValue, prpHelp, prpChoices, prpDict, prpType;

    // Lee la plantilla de la variable publica
    var objConfig = _MetaObjects[ ptType ] || {};

    // Recorre el vector de propieades
    // puede ser solo el nombre o la tupla name, value
    // [ 'x' , { 'name' : 'xxx' , 'value' : '' }]
    for (var ix in objConfig.properties  ) {
        var prp  = objConfig.properties[ ix ];

        // Trae los valores directamente
        if ( _SM.typeOf( prp ) == 'object' ) {
            prpName = prp.name;
            prpValue = prp.value;
        } else {
            prpName = prp;
            prpValue =  _MetaProperties[ prpName ] || null;
        }


        prpHelp =  _MetaProperties[ prpName + '.help'];
        prpChoices =  _MetaProperties[ prpName + '.choices'];
        prpType =  _MetaProperties[ prpName + '.type'];

        // Para presentacion en la forma o en las propiedades
        if (forForm) {
            if ( prpValue )  prps[ prpName ] = prpValue;

        } else {
            prps[ prpName ] = prpValue || '';
            qtips[ prpName ] = prpHelp;
            if ( prpChoices )   choices[ prpName ] = prpChoices;
            if ( prpType )   ppTypes[ prpName ] = prpType;
        }


    }

    // Si es un campo obtiene los defaults de fields
    if ( metaField ) {
        prpDict = _SM.getFormFieldDefinition( metaField );
        prps = Ext.apply( prps, prpDict   );
    }

    // Garantiza q no venga una definicion generica ( solo para los formFields )
    if ( forForm && ( ! prps.xtype  )) prps.xtype = ptType;
    if ( ( prps.xtype == 'formField' ) &&  ( ptType == 'formField' )) prps.xtype = 'textfield';


    return {'__ptConfig' : prps,
            '__ptHelp' : qtips,
            '__ppChoices' : choices,
            '__ppTypes' : ppTypes,
            '__roProperties' : objConfig.roProperties || []
            };

}





// function getObjs( prItems ) {
    // //recorrido geenerico de objetos
    // var key, obj, prop, owns = Object.prototype.hasOwnProperty;
    // for (key in prItems ) {
        // if (owns.call(prItems, key)) {
            // obj = prItems[key];
            // for (prop in obj ) {
                // // using obj.hasOwnProperty might cause you headache if there is
                // // obj.hasOwnProperty = function(){return false;}
                // // but owns will always work
                // if (owns.call(obj, prop)) {
                    // console.log(prop, "=", obj[prop]);
                // }
            // }
        // }
    // }
// }
