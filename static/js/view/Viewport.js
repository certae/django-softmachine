/*
 * 
 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.view.Viewport', {
    extend: 'Ext.container.Viewport',

    // requires: [
        // 'ProtoUL.view.MenuTree',
        // 'ProtoUL.view.ProtoTabContainer'
    // ],

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

        // StatusBar Global 
        _SM.__StBar = Ext.create('Ext.ux.StatusBar', {
                region:'south', 
                split: false,
                collapsible: false
           });
            
        return _SM.__StBar;           

    }, 


    // Eventos despues de cargado el panel 
    afterRender: function () {
        this.callParent(arguments);

        _SM.__StBar.showBusy( 'loading ... ', 'vPort', 3000) ;           

        // Carga las PCI de autoload
        // TODO: Esto podria ser un llamado configurado por usuario  
        for (var autoPci in _SM._AUTOLOAD_PCI) {
            this.loadPciFromMenu(_SM._AUTOLOAD_PCI[autoPci]);
        }

        // Referencia a la ventana del viewPort 
        _SM._mainWin = this;
                 
    },
    
    

    createHeaderPanel: function () {
        
        var headerPanel = {
            region:'north',            
            margins:'0 0 0 0',
            border : false, 
            collapsible: true,
            collapseMode: 'mini',
            
            collapsed:  _SM._siteTitleCollapsed,
            header : false, 
            collapsible: true,
            collapseMode: 'mini',
            split: true,
            splitterResize : false,             
            
            layout: {
                type: 'hbox',
                align:'middle'
            },
            items:[{
                 margins:'5 5',
                 xtype: 'box',
                 html: '<span class="title">' + _SM._siteTitle + '</span><br><span class="subtitle">' + _SM._versionProto + '</span>', 
                 height: 56,
                 handler: function () {
                     headerPanel.collapse();
                 }
            }]

        };

        return headerPanel;
    },
     
    

    createMenuPanel: function () {

        if (_SM._MENU_COLLAPSED == undefined) {_SM._MENU_COLLAPSED = false;};
        
        this.menuPanel = {
            region: 'west',
            width: 300,
            title: _SM.__language.Title_Main_Menu,
            collapsible: true,
            // border : false, 
            collapsed: _SM._MENU_COLLAPSED,
            
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
        };
        // );

        // listeners: {
            // scope: this,
            // feedselect: this.onFeedSelect
        // };

        return this.menuPanel;
    },


    loadPciFromMenu: function( menuOpt ){
        
        
        // *** El truco es q no se crea el modelo, solo se define
        var viewCode = menuOpt ;  
        var me = this ;
        
//        console.log( viewCode, ' Loading MasterPanel ...')

        var options = {
            scope: this, 
            success: function (obj, result, request) {

                me.openProtoOption( viewCode );               
                 
            },
            failure: function ( obj, result, request) { 
                return ;  
            }
        };

        if (  _SM.loadPci( viewCode, true, options ) ) {
            // El modelo ya ha sido cargado ( la cll meta es global )     
            me.openProtoOption( viewCode );               
            
        }   

    },   

    openProtoOption: function( viewCode ){
      
        var me = this ;
        var myMeta = _SM._cllPCI[ viewCode ] ;

        if ( myMeta.pciStyle == 'form' ) {
            var formController = Ext.create('ProtoUL.UI.FormController', {});
            formController.openProtoForm.call( formController, viewCode, -1 , true  );
        } else {
            me.protoTabContainer.addTabPanel( viewCode );
        }                
        
    },   

    createProtoTabContainer: function(){
       this.protoTabContainer = Ext.create('widget.protoTabContainer', {
            region: 'center',
            border : false, 
            minWidth: 300
//          bodyCls: "background-SM2"
        }); 
        return this.protoTabContainer;
    }

});