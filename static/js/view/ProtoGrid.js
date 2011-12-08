/*
 *  grid
 * -  store  ( proxy )   
 * -  - model ( reader )  *** 
 */
Ext.define('ProtoUL.view.ProtoGrid' ,{
    extend: 'Ext.container.Container',
    // extend: 'Ext.grid.Panel',
    alias : 'widget.protoGrid',

    //requires: ['Ext.toolbar.Paging'],
    // iconCls: 'icon-grid',

    initComponent: function() {
        //console.log ( this.protoConcept + '  grid init'  ); 

        // Recupera la clase para obtener la meta ------------------------------------------
        var myMeta = _cllPCI[ this.protoConcept ] ; 
        var _pGrid = this 

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
        this.store = Ext.create('Ext.data.Store', {
            model : modelClassName, 
            autoLoad: true,
            pageSize: _PAGESIZE,
            remoteSort: false,
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
                    storeFields  : myMeta.storeFields.toString(),
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

        this.store.proxy.actionMethods.read = 'POST';


        // Definicion de Columnas y Fields        ------------------------------------------
        var myColumns = [];

        // DGT adding RowNumberer  
        myColumns.push(Ext.create('Ext.grid.RowNumberer',{"width":37 }));


        // DGT** Creacion de columnas  
        for (var ix in myMeta.fields ) {
            var vFld  =  myMeta.fields[ix];

            if (!vFld.header ||  vFld.storeOnly  ) { continue  }
            
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
        var grid = Ext.create('Ext.grid.Panel', {
            columns : myColumns,   
            store : this.store,  
            stripeRows: true, 
            
            listeners: {
                scope: this,
                itemClick: this.onItemClick
            }
            
        }); 

//-----------
        this.IdeSheet = Ext.id();

        Ext.apply(this, {
            layout: 'border',
            defaults: {
                collapsible: false,
                split: false
            },
            items: [{
                region: 'center',
                flex: 1,
                layout: 'fit',
                minSize: 50,
                items: grid 
            }, {
                id: this.IdeSheet, 
                title: 'Fiche descriptive de lélément de donnée',
                region: 'east',
                flex: 1,
                collapsible: true,
                split: true,
                collapsed: true,
                layout: 'fit',
                minSize: 50,
                html: '' 
            },{
                xtype: 'pagingtoolbar',
                region: 'south',
                store: this.store,
                displayInfo: true,
                displayMsg: 'Total {2}',
                // displayMsg: '{0} - {1} of {2}',
                // emptyMsg: "No register to display"
            }
            ],
        });


//------        
        this.addEvents(
            'itemClick'
        );

        
        this.callParent(arguments);

        //  Datos en el Store this.store.getAt(index)
        // var data = grid_company.getSelectionModel().selected.items[0].data;
        // grid_product.setTitle(data.name + ' Products List');
        
        grid.on({
            itemClick: {fn: function (g, rowIndex, e) {
                // console.log ( g, rowIndex   );
                _pGrid.rowData = rowIndex.data
                
                prepareSheet(  )
                 
                }, 
            scope: this },
        });                 


        function prepareSheet( ){

            var pSheet = myMeta.protoSheet;
            if (pSheet.properties == undefined) {
              return  
            };


            var pTemplate = pSheet.template

            for (var ix in pSheet.properties  ) {
                var vFld  =  pSheet.properties[ix]; 

                var pKey = '{{' + vFld + '}}';
                var pValue =  _pGrid.rowData[ vFld ];
                pTemplate = pTemplate.replace( pKey , pValue  ); 

            }

            var sheet = Ext.getCmp( _pGrid.IdeSheet );
            // sheet.html = pTemplate; 
            sheet.update( pTemplate );

        }

    },
    
    onItemClick: function (g, rowIndex, e) {
        this.fireEvent('itemClick', g, rowIndex, e);
    }
    
});



