/*
 *  grid
 * -  store  ( proxy )   
 * -  - model ( reader )  *** 
 */
Ext.define('ProtoUL.view.ProtoGrid' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.protoGrid',
    
    //DGT**  
    stripeRows: true, 

    //requires: ['Ext.toolbar.Paging'],
    // iconCls: 'icon-grid',

	initComponent: function() {
        //console.log ( this.protoConcept + '  grid init'  ); 

		// Recupera la clase para obtener la meta ------------------------------------------
        var myMeta = _cllPCI[ this.protoConcept ] ; 

        var modelClassName = _PConfig.clsBaseModel + this.protoConcept ; 
        if  (! Ext.ClassManager.isCreated( modelClassName )){
            //console.log ( this.protoConcept, ' ERROR Pci  not loaded ' );
            return 
        } ;

        // VErifica si el store viene como parametro ( Detail )
        if (typeof this.protoFilterBase == 'undefined') {
            var myFilter = '{"pk" : 0,}'            
	        // TODO: Agregar parametro Autoload
	        var myFilter = ''
        } else {
            var myFilter = ''
        };   
        
        //console.log (  this.protoConcept, ' Loading store ...  '  ); 
        var myStore = Ext.create('Ext.data.Store', {
            model : modelClassName, 
            autoLoad: true,
            pageSize: _PAGESIZE,
            remoteSort: true,
            proxy : {
                type: 'ajax',
                url : 'protoExt/protoList/', 
                reader : {
                    type: 'json',
                    root: 'rows',
                    successProperty: 'success',
                    totalProperty: 'totalCount',
                },
                extraParams : {
                    protoConcept : this.protoConcept,
                    protoFilter : myFilter,
                    protoFilterBase: this.protoFilterBase, 
                    queryFields  : myMeta.queryFields.toString(),
                },
                // sorters: [{
                    // property: 'leaf',
                    // direction: 'ASC'
                // },],
            },
            listeners: {
                'load' :  function(store,records,options) {
                    this.loaded = true;
                }
            }, 
                    
        });

        myStore.proxy.actionMethods.read = 'POST';


        // Definicion de Columnas y Fields        ------------------------------------------
        var myColumns = [];

        // DGT adding RowNumberer  
        myColumns.push(Ext.create('Ext.grid.RowNumberer',{"width":37 }));


        // DGT** Creacion de columnas  
        for (var ix in myMeta.fields ) {
            var vFld  =  myMeta.fields[ix]; 
            var col = {
                dataIndex: vFld.name,
                text: vFld.header,
                sortable: vFld.sortable,
                flex: vFld.flex,
                hidden: vFld.hidden,
                width: vFld.width ,
                // editor:  { xtype: _gridTypeEditor[vFld.type] }, 
                // renderer: this.formatDate,                
            };

            myColumns.push(col);

        }
        
        // myColumns = [{"xtype":"rownumberer","width":30},{"text":"ID","sortable":true,"dataIndex":"id","hidden":true},{"text":"First Name","sortable":true,"dataIndex":"first","editor":{"xtype":"textfield"}},{"text":"Last Name","sortable":true,"dataIndex":"last","editor":{"xtype":null}},{"text":"Email","sortable":true,"dataIndex":"email","editor":{"xtype":"textfield"}}]; 
                
        this.columns = myColumns;  
        this.store = myStore; 
        this.dockedItems = [{
            xtype: 'pagingtoolbar',
            dock:'bottom',
            store: myStore,
            displayInfo: true,
            displayMsg: 'Displaying  {0} - {1} of {2}',
            emptyMsg: "No register to display"
        },];

        
        this.callParent(arguments);

        // listeners: {
            // itemclick: function () {
                // var data = grid_company.getSelectionModel().selected.items[0].data;
                // grid_product.setTitle(data.name + ' Products List');
                // store_product.clearFilter();
                // store_product.filter('company_id', data.id);
                // store_product.load();
            // }
        // }

	},
	
});



