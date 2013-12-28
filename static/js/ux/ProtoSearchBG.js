/*
 * Barra de busqueda 
 */


Ext.define('ProtoUL.ux.ProtoSearchBG', {
    extend : 'Ext.toolbar.Toolbar',
    alias :  'widget.protoSearch',

    /**
     * @private
     * MetaData  initialization
     */
    myMeta: null, 

    /**
     * @private
     * Component initialization override:  ToolBar setup
     */
    initComponent : function() {

        var me = this;
        var myMeta = this.myMeta; 

        
        // Load Data button 
        var searchBtn = new Ext.button.Button({
            tooltip: _SM.__language.Tooltip_Filter_Grid_Button,
            iconCls: 'icon-filter', 
            handler: onClickSearchBtn
        });

        // var QBEBtn = new Ext.button.Button({
            // tooltip: _SM.__language.Text_Toolbar_Advanced_Filter,
            // iconCls: 'icon-filterqbe',
            // handler: onClickViewQBE
        // });

        var clearBtn = new Ext.button.Button({
            tooltip: _SM.__language.Text_Toolbar_Remove_Filters,
            handler: onClickClearFilter,
            iconCls: 'icon-filterdelete'
        });
        
        // Criteria 
        var searchCr = new Ext.form.TextField({
            emptyText: _SM.__language.Text_Toolbar_Search_Field,
            enableKeyEvents : true,  
            width: 200, 
            listeners: {
                keydown: function( me, e ) { 
                    if (e.getKey() == e.ENTER ) {
                        onClickSearchBtn ( searchBtn  );
                       }
                }}
        });

        me.protoEnable =  ( me.myMeta.gridConfig.searchFields.length > 0  ) ;

        Ext.apply(me, {
            border : false,
            disabled : ! me.protoEnable,
            items:  [  
                searchCr,
                searchBtn,
                // QBEBtn,
                clearBtn 
            ]
        });


        me.addEvents('qbeLoadData');
        me.callParent();
        
        // Inicializa Combos 
        clearCombos();     

        function onClickSearchBtn ( btn ) { 
            var sFilter = searchCr.getValue();
            var sTitle = '" ' + searchCr.getValue() + ' "';
            
            me.fireEvent('qbeLoadData', me, [{ 'property' :  '_allCols' , 'filterStmt' : sFilter }], sTitle );
        }
    
        //BG 
        function onClickClearFilter (item ){
            // resetea los fitros tambien 
            clearCombos();
            me.fireEvent('qbeLoadData', me, [], '' , [] );
        }

        function onClickViewQBE(item) {
            data = me.myMeta;
            resp = data.fields;
            
            var QBE = Ext.create('Ext.ux.protoQBE', {
                
                campos: data.fields,
                viewCode: data.viewCode,
                titulo: data.shortTitle,
                aceptar: function (qbe) {
                    console.log('ok');
                    // TODO: preparar el titulo del qbe, con campo y valor 
                    me.fireEvent('qbeLoadData', me, qbe, '** qbe' );
                }
            }).show();
               
        }

        //BG
        function clearCombos ( ){
            // comboCols.setValue('');
            // comboOp.setValue(''); 
            searchCr.setValue(''); 
        } 
    
    } 

});

