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
            // scale: 'medium', 
            tooltip: __language.Tooltip_Filter_Grid_Button,
            handler: onClickLoadData,
           // pressed: true,
            iconCls: 'icon-filter',
           /* menu: {
                items:[
                     {
                       text: 'Advanced filter QBE' ,
                       iconCls: 'icon-filterqbe',
                       hidden:true,
                       handler: onClickClearFilter 
                     },{
                         text: 'Advanced filter QBE',
                       iconCls: 'icon-filterqbe',
                       handler: onClickViewQBE 
                    }
               ]
             }*/
        });

        var QBEBtn = new Ext.button.Button({
            // scale: 'medium', 
            text: __language.Text_Toolbar_Advanced_Filter,
            iconCls: 'icon-filterqbe',
            handler: onClickViewQBE
           
        });

        var clearBtn = new Ext.button.Button({
            // scale: 'medium', 
            tooltip: _tbSearchClearFilter,
            handler: onClickClearFilter,
            iconCls: 'icon-filterdelete'
        });
        
        // Criteria 
        var searchCr = new Ext.form.TextField({
            emptyText: __language.Text_Toolbar_Search_Field,
            enableKeyEvents : true,  
            width: 200, 
            listeners: {
                keydown: function( me, e ) { 
                    if (e.getKey() == e.ENTER ) {
                        onClickLoadData ( searchBtn  )
                       }
                }}
        });

        me.protoEnable =  ( me.myMeta.gridConfig.searchFields.length > 0  ) 

        Ext.apply(me, {
            border : false,
            disabled : ! me.protoEnable,
            items:  [  
                /*searchCr,
                clearBtn, 
                searchBtn,*/
                QBEBtn
            ]
        });


        me.addEvents('loadData');
        me.callParent();
        
        // Inicializa Combos 
        clearCombos();     

        function onClickLoadData ( btn ) { 
            
            var sFilter = searchCr.getValue();
            var sTitle = ' " ' + searchCr.getValue() + ' "';
            
            me.fireEvent('loadData', me, sFilter, sTitle );

        }
    
        //BG 
        function onClickClearFilter (item ){
            // TODO: Manejara los filtros compuestos ( QBE )
            clearCombos()
            onClickLoadData( {} );
    
        }

        function onClickViewQBE(item) {
            data = me.myMeta;
            resp = data.fields;
            
            var QBE = Ext.create('Ext.ux.protoQBE', {
                
                campos: data.fields,
                protoOption: data.protoOption,
                titulo: data.shortTitle,
                aceptar: function (qbe) {
                    console.log('ok');
                    me.fireEvent('loadData', me, qbe, ' " '+ __language.Text_Toolbar_Advanced_Filter + '"');
                    //ahora de debe filtrar
                }
            }).show();
                      
               
        }

        //BG
        function clearCombos ( ){
            // comboCols.setValue('');
            // comboOp.setValue(''); 
            searchCr.setValue(''); 
        } 
    
    }, 
    
    
    // =========================================================================================================
    
    
    qbeFilter: function() {
        // Abre una forma de QBE con cada campo, sus opciones de busqueda y el criterio 
        
        // Combo Columnas  
        var colStore = new Ext.data.ArrayStore({
            fields: ['colPhysique', 'colName'],
            data: configureComboColumns()  
        });
    
        var comboCols = new Ext.form.ComboBox({
            store: colStore,
            width: 135,
            mode: 'local',
            triggerAction: 'all',
            displayField: 'colName',
            valueField: 'colPhysique',
            forceSelection: true,
            emptyText: __language.Text_Toolbar_In,
            selectOnFocus: true,
            typeAhead: true
        });


        // combo - operation 
        var opStore = new Ext.data.ArrayStore({ 
            fields: ['code', 'operation'], 
            data: _ComboFilterOp 
        }); 
        
        var comboOp = new Ext.form.ComboBox({
            emptyText: __language.Text_Toolbar_Search_Combo,
            store: opStore,
            width: 150,
            mode: 'local',
            triggerAction: 'all',  
            displayField: 'operation',
            valueField: 'code',
            forceSelection: true,
            editable: false
        });



        function configureComboColumns ( tb ){
            // Columnas para el Query del tipo :  newColData = [['idx', 'Id Reg'],['code', 'Code Reg']];
            var colData = [];
            var myFieldDict = getFieldDict(me.myMeta)

            // REcorre los q llegan y genera el obj  header, name         
            for ( var ix in me.myMeta.gridConfig.searchFields ) {
                var name = me.myMeta.gridConfig.searchFields[ix]
                var c = myFieldDict[name]
                if ( ! c ) { 
                    var c = { name : name, header : name }
                }
                colData.push( [c.name, c.header] ) 
            } 

            // Si no llego nada toma los campos del modelo 
            // if ( colData.length == 0 ) { 
                // for (var i = 0, len = me.myMeta.fields.length; i < len; i++) {
                    // var c = me.myMeta.fields[i];
                    // if (!(c.fromModel == true ) || (c.type in oc( 'string', 'text'))) continue
                    // colData.push( [c.name, c.header] ) 
                // }
            // } 

            // Para tomar todos los campos 
            colData.unshift( ['', ''] ) 
            return colData ; 
        }; 


        function onClickQbe( btn ) { 
    
            var sFilter = '';
            var sTitle =  ''; 
            var sCols = comboCols.getValue() || '' 

            var sOps  = comboOp.getValue() || 'icontains'; 
            if ( sOps == '--' ) { sOps = 'icontains' };    
            
            if (searchCr.getValue() == '' ) {
                sFilter = '';
            } else if ((sCols  == '') && (searchCr.getValue() != '' )) {
                sFilter = searchCr.getValue();
                sTitle = ' " ' + searchCr.getValue() + ' "';
            } else {
                sFilter = '{"' + sCols + '__' + sOps + '" : "' + searchCr.getValue() + '",}';

                sTitle = comboOp.getDisplayValue() || 'qui contient';  
                sTitle =  ' " ' + comboCols.getDisplayValue() + " " +  sTitle + " " + searchCr.getValue() + ' "';
            }
            
            me.fireEvent('loadData', me, sFilter, sTitle );
    
        };
        
        
    }
    

});

