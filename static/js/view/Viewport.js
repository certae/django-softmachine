/*
 * 
 */
Ext.define('ProtoUL.view.Viewport', {
    extend: 'Ext.container.Viewport',

    requires: [
        'ProtoUL.view.MenuTree',
        'ProtoUL.view.ProtoTabContainer'
    ],

    initComponent: function () {

        Ext.apply(this, {
            layout: 'border',
            autoRender: true, 
            padding: 5,
            defaults: { 
                split: true
            },
            items: [
                this.createHeaderPanel(),
                this.createMenuPanel(),
                this.createProtoTabContainer(),
                this.createFooterPanel()
            ] 
            
        });


        this.callParent(arguments);
        
        
    },

    createFooterPanel: function() {

        // Sb Global 
        
        __StBar = Ext.create('Ext.ux.StatusBar', {
                id: 'my-status',
                region:'south', 
                // border : false, 
                margins:'0 0 0 0',
                split: false,
                collapsible: false,
                           
                // defaults to use when the status is cleared:
                defaultText: 'Ok',
                defaultIconCls: 'x-status-valid',
        
                // values to set initially:
                text: 'Ready',
                iconCls: 'ready-icon', 
        
                // any standard Toolbar items:
                items: [{
                // xtype:'tbfill'
            // },{
                    xtype:'splitbutton',
                    text: 'Login'
                }]
            }) 
            
        return __StBar           

    }, 


    // Eventos despues de cargado el panel 
    afterRender: function () {
        this.callParent(arguments);

        __StBar.showBusy( 'loading ... ', 3000)            

        // Carga las PCI de autoload
        // TODO: Esto podria ser un llamado configurado por usuario  
        for (var autoPci in _AUTOLOAD_PCI) {
            this.loadPciFromMenu(_AUTOLOAD_PCI[autoPci]);
        }

        // Referencia a la ventana del viewPort 
        _mainWin = this

        // __StBar.showError( '!@#@$ ... ')            
        // __StBar.showWarning( 'mmm ... ')            
                 
    },
    
    

    createHeaderPanel: function () {
        
        var headerPanel = {
            region:'north',            
            margins:'0 0 0 0',
            // border : false, 
            split: false,
            collapsible: false,
            layout: {
                type: 'hbox',
                align:'middle'
            },
            items:[{
                 margins:'5 5',
                 xtype: 'box',
                 html: '<span class="title">' + _siteTitle + '</span><br><span class="subtitle">' + _versionProto + '</span>', 
                 height: 56
            }]

        }

        return headerPanel;
    },
     
    

    createMenuPanel: function () {

        if (_MENU_COLLAPSED == undefined) {_MENU_COLLAPSED = false};
        
        this.menuPanel = {
            region: 'west',
            width: 300,
            title : 'Composants du Dictionnaire',
            collapsible: true,
            // border : false, 
            collapsed: _MENU_COLLAPSED,
            
            // Solo en el panel de menus
            xtype: 'menuTree'

            // ---------------------  manejo de favoritos 
            // layout: 'accordion',
            // items: [{
                // // title: 'Menu',
                // layout: 'fit',
                // xtype: 'menuTree'
                // // xtype: 'treepanel',
            // }, {
                // title: 'Favorits',
                // hidden: true, 
            // }]            
        }
        // );

        // listeners: {
            // scope: this,
            // feedselect: this.onFeedSelect
        // };

        return this.menuPanel;
    },


    loadPciFromMenu: function( menuOpt ){
        
        
        // *** El truco es q no se crea el modelo, solo se define
        var protoOption = menuOpt ;  
        var thisRef = this ;
        
//        console.log( protoOption, ' Loading MasterPanel ...')

        var options = {
            scope: this, 
            success: function (obj, result, request) { 
                thisRef.protoTabContainer.addTabPanel( protoOption );
            },
            failure: function ( obj, result, request) { 
                return ;  
            }
        }

        if (  loadPci( protoOption, true, options ) ) {
            // El modelo ya ha sido cargado ( la cll meta es global )     
            this.protoTabContainer.addTabPanel(protoOption );
            
        }   
        
    },   

    createProtoTabContainer: function(){
       this.protoTabContainer = Ext.create('widget.protoTabContainer', {
            region: 'center',
            border : false, 
            minWidth: 300 
        }); 
        return this.protoTabContainer;
    }

});