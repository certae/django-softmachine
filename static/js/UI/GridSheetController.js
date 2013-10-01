"use strict";
/*jslint nomen: true */
/*global Ext */
/*global _SM */
/*global ProtoUL */

Ext.define('ProtoUL.UI.GridSheetController', {
    extend: 'Ext.Base',

    // Parametros de entrada
    myGrid : null,

    constructor: function (config) {
        Ext.apply(this, config || {});

    },

    getSheetConfig: function() {

        var me = this.myGrid;
        var myMeta = me.myMeta;


        // Verifia q al menos una hoja sea visible en la grilla
        var hideSheet = true;
        for ( ix in myMeta.sheetConfig  ) {
            var sType = myMeta.sheetConfig[ix].sheetType
            if ( sType == 'gridOnly'  ) continue;
            hideSheet = false;
            break;
        }
        if ( hideSheet ) myMeta.gridConfig.hideSheet = true;


        // Los zooms ( initialConfig ) no deben manejar sheets
        if ( !( me.initialConfig.hideSheet || myMeta.gridConfig.hideSheet )) {
            me.IdeSheet = Ext.id();

            // Ojeto dinamicamente creada con las pSheetProps segun cada plantilla
            // Indice  el sheetName y el indice segun se requieren
            this.pSheetsProps = {}

            return  {
                    region: 'east',
                    id: me.IdeSheet,
                    collapsible: true,
                    collapsed: true ,
                    split: true,
                    flex: 1,
                    layout: 'fit',
                    minSize: 50,
                    autoScroll: true,
                    border: false
            }
        }

    },


    prepareSheet: function( ){

        var me = this.myGrid
        var myMeta = me.myMeta


        // Los zooms ( initialConfig ) no deben manejar sheets
        if ( me.initialConfig.hideSheet || myMeta.gridConfig.hideSheet ) {
            return
        }

        // Si no tiene datos
        if ( ! me.rowData ) {
            renderSheet( '', '' )
            return
        }

        var pSheets = myMeta.sheetConfig;
        var pSheetSelector = myMeta.sheetSelector || '';
        var pSheetCriteria = me.rowData[ pSheetSelector ]
        var pSheet = undefined;

        for ( var ix in pSheets  ) {
            if ( pSheets[ix].sheetType == 'printerOnly' ) {continue ; }

            pSheet  =  pSheets[ix];
            if ( pSheet.name == pSheetCriteria ) {break; }
        };

        if (  pSheet == undefined ) { return };

        // Contruye las pSheetProps a medida q las necesita
        var pTemplate = pSheet.template || '' ;
        var pSheetProps = this.pSheetsProps[  pSheet.name  ]
        if ( !pSheetProps ) {
            pSheetProps = []
             for ( ix in myMeta.fields  ) {
                 var fName = myMeta.fields[ix].name
                 if ( pTemplate.indexOf( '{{' + fName + '}}') > -1  ) {
                     pSheetProps.push(  fName )
                 }
             }
            this.pSheetsProps[  pSheet.name  ] = pSheetProps
        }


       for (var ix in pSheetProps) {
            var vFld  =  pSheetProps[ix];

            var pKey = '{{' + vFld + '}}';
            var pValue =  me.rowData[ vFld ];

            if ( vFld == 'metaDefinition' ) {
                pValue = _SM.FormatJsonStr( pValue )
            }

            pTemplate = pTemplate.replace( new RegExp(pKey, 'g') , pValue  );

        }

        renderSheet( pSheet.title, pTemplate )

        function renderSheet( title, pTempalte ) {

            var sheet = Ext.getCmp( me.IdeSheet );
            sheet.setTitle(  title  );
            sheet.update( pTemplate );

            // Expone el template
            me.sheetHtml = pTemplate ;

        }

    }

})
