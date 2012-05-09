/*
 * Barra de busqueda 
 */


Ext.define('ProtoUL.ux.ProtoSearchBG', {
    extend : 'Ext.container.ButtonGroup',
    alias :  'widget.protoSearch',

    /**
     * @private
     * MetaData  initialization
     */
	protoMeta: null, 

    /**
     * @private
     * Component initialization override:  ToolBar setup
     */
    initComponent : function() {

    	var me = this;
    	var myMeta = this.protoMeta; 

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
            emptyText: 'dans ...',
            selectOnFocus: true,
            typeAhead: true
        });


        // combo - operation 
        var opStore = new Ext.data.ArrayStore({ 
        	fields: ['code', 'operation'], 
        	data: _ComboFilterOp 
    	}); 
        
        var comboOp = new Ext.form.ComboBox({
            emptyText: 'sélectionner opérator' ,
            store: opStore,
            width: 150,
            mode: 'local',
            triggerAction: 'all',  
            displayField: 'operation',
            valueField: 'code',
            forceSelection: true,
            editable: false
        });

        // Load Data button 
        var searchBtn = new Ext.button.Split({
            text: 'Rechercher',
            handler: onClickLoadData,
            pressed: true,
            iconCls: 'icon-search',
            menu: {
                items: [{
                    text: _tbSearchClearFilter ,
                    handler: onClickClearFilter 
                // }, {
                    // text: 'add filter',
                    // handler: __MasterDetail.onClickFilter
                }]
            }
        });

        // Criteria 
        var searchCr = new Ext.form.TextField({
            emptyText: 'mots-clés recherchés ..',
            enableKeyEvents : true,  
            width: 200, 
            listeners: {
                keydown: function( me, e ) { 
                    if (e.getKey() == e.ENTER ) {
                        onClickLoadData ( searchBtn  )
                       }
                }}
        });


		Ext.apply(me, {
			items:  [
            searchCr,
            comboOp,
            comboCols,
            { xtype: 'tbseparator' },
            searchBtn    
            ]
		});

        me.addEvents('loadData');
		me.callParent();
        
        // Inicializa Combos 
        clearCombos();     


        function configureComboColumns ( tb ){
            // Columnas para el Query del tipo :  newColData = [['idx', 'Id Reg'],['code', 'Code Reg']];
            var colData = [];
            colData[0] = ['', ''];
            j = 1;

            for (var i = 0, len = myMeta.fields.length; i < len; i++) {
                var c = myMeta.fields[i];
                if ( c.name in oc( myMeta.searchFields)  ) { 
                    colData[j] = [c.name, c.header];
                    j += 1;
                }    
            }
            
            return colData ; 
        }; 

        function onClickLoadData ( btn ) { 
    
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
    
        //BG 
        function onClickClearFilter (item ){
            // TODO: Manejara los filtros compuestos ( QBE )
            clearCombos()
            onClickLoadData( {} );
    
        } 

        //BG
        function clearCombos ( ){
            comboCols.setValue('');
            comboOp.setValue(''); 
            searchCr.setValue(''); 
        } 
    
    }	// End Init

});

