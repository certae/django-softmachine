
Ext.define('ProtoUL.UI.GridController', {
    extend: 'Ext.Base',

    // Parametros de entrada 
    myMeta : null, 
    myGrid : null, 
    store : null,   
    
    constructor: function (config) {
        Ext.apply(this, config || {});
    }, 
    
    
    addNavigationPanel: function() {
        /*
         * Configuracion del NavigationPanel, tiene en cuenta el manejo de detalles
         * y agrega el maximo del almacenamiento local.
         * 
         */  

        var me = this.myGrid; 
        var navPanel = ['-']; 

        var comboPageSize = new Ext.form.ComboBox({
            name : 'perpage',
            width: 60,
            store: new Ext.data.ArrayStore({
                fields: ['id'],
                data  : _ComboPageSize
            }),
            mode : 'local',
            value: '50',
            listWidth     : 60,
            triggerAction : 'all',
            displayField  : 'id',
            valueField    : 'id',
            editable      : false,
            forceSelection: true
        });

        comboPageSize.on('select', function(combo, record) {
            me.store.pageSize = parseInt( combo.getValue(), 10);
            me.store.load(); 
            if ( me.store.currentPage != 1 ) {
                me.store.loadPage(1);
            }
        }, me );            

        // Extraccion de grilla detalle        
        if ( me.protoIsDetailGrid ) {
            navPanel.push ({
                text: _detailViewNewTab,
                iconCls : 'icon-promote',
                handler : onMenuPromoteDetail
            })  
        } 

        navPanel.push( comboPageSize, _gridBbPerPage );
        
        var myNavPanel =   {
                xtype: 'pagingtoolbar',
                border : false, 
                dock: 'bottom',
                store: me.store,
                displayInfo: true,
                items: navPanel,
                afterPageText : _gridBbOf  + ' {0}',
                beforePageText : _gridBbPage, 
                
                firstText : _gridFirstText, 
                nextText : _gridNextText, 
                prevText : _gridPrevText, 
                lastText : _gridLastText, 
                refreshText : _gridRefreshText,  

                displayMsg: _gridBbShow + ' : {0} - {1} ' + _gridBbOf +' {2}'
                // emptyMsg: "No register to display"
            }

        me.addDocked( myNavPanel  )

        function onMenuPromoteDetail() {

            var detDef = me.detailDefinition 

            __TabContainer.addTabPanel(
                   me.store.protoOption , 
                   me.store.getProxy().extraParams.baseFilter, 
                   me.detailTitle 
           ); 
            
        };


    }, 
    
    addGridTools : function()  {
    
        var editTools =    [{
                itemId: 'toolRowAdd',
                tooltip: 'rowAdd',  
                type: 'rowAdd',
                hidden: true,
                width : 20, 
                scope: this,
                handler: this.onEditAction
            }, {
                itemId: 'toolRowCopy',
                tooltip: 'rowCopy',  
                type: 'rowCopy',
                hidden: true,
                width : 20, 
                scope: this,
                handler: this.onEditAction
            }, {
                itemId: 'toolRowDel',
                type: 'rowDel',
                tooltip: 'rowDel',  
                hidden: true,
                width : 30, 
                scope: this,
                handler: this.onEditAction
            }, {
                itemId: 'toolFormAdd',
                tooltip: 'formAdd',  
                type: 'formAdd',
                width : 20, 
                hidden: true,
                scope: this,
                handler: this.onEditAction
            }, {
                itemId: 'toolFormUpd',
                tooltip: 'formUpd',  
                hidden: true,
                type: 'formUpd',
                width : 20, 
                scope: this,
                handler: this.onEditAction
            }, {
                itemId: 'toolFormView',
                tooltip: 'formView',  
                type: 'formView',
                width : 20, 
                scope: this,
                handler: this.onEditAction
            }, {
                itemId: 'toolMetaConfig',
                tooltip: 'Show MetaConfig',  
                type: 'metaConfig',
                width : 20, 
                scope: this,
                handler: showMetaConfig
            }]
        
            this.myGrid.addTools( editTools )
            this.setEditMode( false )
        
            function showMetaConfig() {
                if ( ! this.configCtrl  ) {
                    this.configCtrl = Ext.create('ProtoUL.UI.ConfigController', { myMeta : this.myMeta });    
                }
                this.configCtrl.showMetaConfig()
            }
        
        
    }, 
    
    setEditMode: function ( bEdit) {

        this.myGrid.editable = bEdit
        var myExtGrid = this.myGrid._extGrid    

        setToolMode ( myExtGrid, '#toolRowAdd', bEdit )
        setToolMode ( myExtGrid, '#toolRowCopy', bEdit )
        setToolMode ( myExtGrid, '#toolRowDel', bEdit )

        setToolMode ( myExtGrid, '#toolFormAdd', bEdit ) 
        setToolMode ( myExtGrid, '#toolFormUpd', bEdit )
        setToolMode ( myExtGrid, '#toolFormView', !bEdit )

        setToolMode ( myExtGrid, '#toolMetaConfig',  !bEdit ) 

        function setToolMode( myExtGrid, myToolBt, bEdit ) {
            if ( bEdit ) { myExtGrid.down( myToolBt ).show(); }
            else  { myExtGrid.down( myToolBt ).hide(); }
            
        }

    }, 
    
    
//  --------------------------------------------------------------------------


    onEditAction: function ( ev, obj, head, btn   ){

        if ( ! this.formController  ) {
            this.formController = Ext.create('ProtoUL.UI.FormController', { myMeta: this.myMeta});
        }  

        // 'toolFormAdd', 'toolFormUpd', 'toolFormView', 'toolRowAdd', 'toolRowCopy', 'toolRowDel',
        switch( btn.itemId ){ 
            case 'toolFormAdd' :
                this.myGrid.addNewRecord()
                this.formController.openLinkedForm ( this.myGrid.selected    )
                break;

            case 'toolFormUpd' : 
                if ( validaSelected( this.myGrid.selected )) {
                     this.formController.openLinkedForm ( this.myGrid.selected    )
                } 
                break;

            case 'toolFormView' : 
                if ( validaSelected( this.myGrid.selected )) {
                     this.formController.openLinkedForm ( this.myGrid.selected , true   )
                } 
                break;

            case 'toolRowAdd' : 
                this.myGrid.addNewRecord()
                break;

            case 'toolRowCopy' :
                this.myGrid.duplicateRecord()
                break;

            case 'toolRowDel' :         
                this.myGrid.deleteCurrentRecord()
                break;
        }        

        function validaSelected( myReg )  {
            if ( ! myReg ) {
                errorMessage( 'Form', 'No record selected')
                return false 
            }
            return true 
        }
        
    } 
    
    
})

