Ext.require([
    'Ext.panel.*',
    'Ext.toolbar.*',
    'Ext.button.*',
    'Ext.container.ButtonGroup',
    'Ext.layout.container.Table'
]);

Ext.onReady(function() {
    
    var fakeHTML = "Lorem ipsum  deserunt mollit anim id est laborum.";
    var SamplePanel = Ext.extend(Ext.Panel, {
        width    : 1000,
        height   : 250,
        layout   : 'hbox', 
        style    : 'margin-top:15px',
        bodyStyle: 'padding:10px',
        renderTo : Ext.getBody(),
        html     : fakeHTML,
        autoScroll: true
    });


    ideTbSearch = Ext.id();
    ideTbDetails = Ext.id();
    ideTbOrder = Ext.id();
    ideTbFilter = Ext.id();
    ideTbViews = Ext.id();

    var tbar1 = Ext.create('Ext.Toolbar', {
        dock: 'top',
        defaults: { 
                scale: 'medium',
                enableToggle: true,
                toggleGroup: 'tb1' , 
                handler: toogleTb2 
            },
        items: [{
            pressed: true,
            text: 'Search',
            iconCls: 'search',
            idTb2  : ideTbSearch
        },'-',{
            text: 'Details',
            iconCls: 'details',
            idTb2  : ideTbDetails
        },'-',{
            text: 'Order',
            iconCls: 'order',
            idTb2  : ideTbOrder
        },'-',{
            text: 'Filter',
            iconCls: 'filter',
            idTb2  : ideTbFilter
        },'-',{
            text: 'Views',
            iconCls: 'views',
            idTb2  : ideTbViews
        }]
    
    });


    var tbar2 = Ext.create('Ext.Toolbar', {
        dock: 'top',
        items: [{
            id : ideTbSearch , 
            xtype: 'buttongroup',
            defaults: { scale: 'small' },
            items: [{
                xtype:'splitbutton',
                text: 'Menu Button',
                iconCls: 'add16',
            },{
                text: 'Format',
                iconCls: 'add16'
            }]
        },{
            id : ideTbDetails, 
            xtype: 'buttongroup',
            hidden : true, 
            defaults: { scale: 'small' },
            items: [{
                text: 'ideTbDetails',
                iconCls: 'add16',
            },{
                text: 'Format',
                iconCls: 'add16'
            }]
        },{
            id : ideTbOrder, 
            xtype: 'buttongroup',
            hidden : true, 
            defaults: { scale: 'small' },
            items: [{
                text: 'ideTbOrder',
                iconCls: 'add16',
            },{
                text: 'Format',
                iconCls: 'add16'
            }]
        },{
            id : ideTbFilter, 
            xtype: 'buttongroup',
            hidden : true, 
            defaults: { scale: 'small' },
            items: [{
                text: 'ideTbFilter',
                iconCls: 'add16',
            },{
                text: 'Format',
                iconCls: 'add16'
            }]
        },{
            id : ideTbViews, 
            xtype: 'buttongroup',
            hidden : true, 
            defaults: { scale: 'small' },
            items: [{
                text: 'ideTbViews',
                iconCls: 'add16',
            },{
                text: 'Format',
                iconCls: 'add16'
            }]
        }]
    });
    tbar2.doLayout();

    panel = new SamplePanel({
        title: 'Standard',
        // items: tbar1,
        
        dockedItems: [
        tbar1, tbar2 
        ]
        
    });

//  ------------------------------------


    function toogleTb2( but  ) {
        
        Ext.each(tbar2.query('buttongroup'), function(button) {
            button.hide();
        }, this);
        
        var tb2 = Ext.getCmp ( but.idTb2  )
        tb2.show()
          
    }; 


});
