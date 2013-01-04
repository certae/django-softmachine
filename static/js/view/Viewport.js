/*
 * 
 */
Ext.define('ProtoUL.view.Viewport', {
    extend: 'Ext.container.Viewport',

    // requires: [
        // 'ProtoUL.view.MenuTree',
        // 'ProtoUL.view.ProtoTabContainer'
    // ],

    initComponent: function () {


        // Global ref to VPort  
        mainVP = this 

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
        __StBar = Ext.create('Ext.ux.StatusBar', {
                region:'south', 
                split: false,
                collapsible: false
            }) 
            
        return __StBar           

    }, 


    // Eventos despues de cargado el panel 
    afterRender: function () {
        this.callParent(arguments);

        __StBar.showBusy( 'loading ... ', 'vPort', 3000)            

        // Carga las PCI de autoload
        // TODO: Esto podria ser un llamado configurado por usuario  
        for (var autoPci in _AUTOLOAD_PCI) {
            this.loadPciFromMenu(_AUTOLOAD_PCI[autoPci]);
        }

        // Referencia a la ventana del viewPort 
        _mainWin = this

                 
    },
    
    

    createHeaderPanel: function () {
        
        var headerPanel = {
            region:'north',            
            margins:'0 0 0 0',
            // border : false, 
            collapseMode: 'mini',
            collapsed:true,
            split: false,
            //collapsible: true,
            layout: {
                type: 'hbox',
                align:'middle'
            },
            items:[{
                 margins:'5 5',
                 xtype: 'box',
                 html: '<span class="title">' + _siteTitle + '</span><br><span class="subtitle">' + _versionProto + '</span>', 
                 height: 56,
                 handler: function () {
                     headerPanel.collapse();
                 }
            }]

        }

        return headerPanel;
    },
     
    

    createMenuPanel: function () {

        if (_MENU_COLLAPSED == undefined) {_MENU_COLLAPSED = false};
        
        this.menuPanel = {
            region: 'west',
            width: 300,
            title: __language.Title_Main_Menu,
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
        var me = this ;
        
//        console.log( protoOption, ' Loading MasterPanel ...')

        var options = {
            scope: this, 
            success: function (obj, result, request) {

                me.openProtoOption( protoOption )                
                 
            },
            failure: function ( obj, result, request) { 
                return ;  
            }
        }

        if (  loadPci( protoOption, true, options ) ) {
            // El modelo ya ha sido cargado ( la cll meta es global )     
            me.openProtoOption( protoOption )                
            
        }   

    },   

    openProtoOption: function( protoOption ){
      
        var me = this ;
        var myMeta = _cllPCI[ protoOption ] ;

        if ( myMeta.pciStyle == 'form' ) {
            var formController = Ext.create('ProtoUL.UI.FormController', {});
            formController.openProtoForm.call( formController, protoOption, -1  ) 
        } else {
            me.protoTabContainer.addTabPanel( protoOption );
        }                
        
    },   

    createProtoTabContainer: function(){
       this.protoTabContainer = Ext.create('widget.protoTabContainer', {
            region: 'center',
            border : false, 
            minWidth: 300
//            bodyStyle: "background-image:url(../../Recursos/Imagenes/sm.jpg) !important; background-size:100% 100% !important; background-repeat:no-repeat  !important;"
        }); 
        return this.protoTabContainer;
    }

});