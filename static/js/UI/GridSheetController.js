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
         
        // Los zooms ( initialConfig ) no deben manejar sheets
        if ( !( me.initialConfig.hideSheet || myMeta.gridConfig.hideSheet ) && ( myMeta.sheetConfig.protoSheetProperties.length > 0 )) {
            me.IdeSheet = Ext.id();
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

        var pSheetProps = myMeta.sheetConfig.protoSheetProperties;
        if ( !pSheetProps ) {
          return;  
        }

        var pSheets = myMeta.sheetConfig.protoSheets;
        var pSheetSelector = myMeta.sheetConfig.protoSheetSelector || '';
        var pSheetCriteria = me.rowData[ pSheetSelector ] 
        var pSheet = undefined;  
        
        for ( var ix in pSheets  ) {
            pSheet  =  pSheets[ix]; 
            if ( pSheet.name == pSheetCriteria ) {break; }
        };

       if (  pSheet == undefined ) { return }; 
        
       var pTemplate = pSheet.template ; 

       for (var ix in pSheetProps) {
            var vFld  =  pSheetProps[ix]; 

            var pKey = '{{' + vFld + '}}';
            var pValue =  me.rowData[ vFld ];
            
            if ( vFld == 'metaDefinition' ) {
                pValue = FormatJsonStr( pValue )
            }
            
            pTemplate = pTemplate.replace( pKey , pValue  ); 

        }

        var sheet = Ext.getCmp( me.IdeSheet );
        sheet.setTitle( pSheet.title );
        sheet.update( pTemplate );

        // Expone el template 
        me.sheetHtml = pTemplate ;             

    }
        
})