/*
 * 
 */
Ext.define('ProtoUL.view.Viewport', {
    extend: 'Ext.container.Viewport',

    requires: [
        'ProtoUL.view.MenuTree',
        // 'ProtoUL.view.ProtoProperties',
        'ProtoUL.view.ProtoTabContainer',
        // 'ProtoUL.globals.Tools',
    ],

    initComponent: function(){

        Ext.apply(this, {
            layout: 'border',
            autoRender: true, 
            padding: 5,
            defaults: { 
                split: true
            },
            items: [
                this.createMenuPanel(),
                this.createProtoTabContainer(),
                // this.createPropertyPanel(),
                // this.createHeaderPanel(),
                // this.createFooterPanel(),
                ],
        });

        this.callParent(arguments);
        
        
    },

    // Eventos despues de cargado el panel 
    afterRender: function(){
        this.callParent(arguments);

        // Carga las PCI de autoload
        // TODO: Esto podria ser un llamado configurado por usuario  
        for (var autoPci in _AUTOLOAD_PCI) {
            console.log ( 'AutoLoad' , _AUTOLOAD_PCI[autoPci])
            this.loadPci( _AUTOLOAD_PCI[autoPci] )
        }
        
    },

    createMenuPanel: function(){
        // this.menuPanel = Ext.create('widget.menupanel', {
        this.menuPanel = {
            region: 'west',
            width: 300,
            title : 'Menu',
            collapsible: true,
            
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


    loadPci: function( menuOpt ){
        
        
        // *** El truco es q no se crea el modelo, solo se define
        var protoConcept = menuOpt ;  
        var thisRef = this ;
        
        console.log( protoConcept, ' Loading MasterPanel ...')

        var modelClassName = _PConfig.clsBaseModel + protoConcept ; 
        
        if  (! Ext.ClassManager.isCreated( modelClassName )){
            console.log ( protoConcept, ' Loading  Pci ...  ' ); 

            Ext.Ajax.request({
                method: 'GET',
                url: _PConfig.urlProtoDefinition  ,
                params : { 
                    protoConcept : protoConcept 
                    },
                success: function ( result, request ) { 
                    
                    console.log( protoConcept, ' Pci loaded ');
                    var myResult = Ext.decode( result.responseText )

                    // Colleccion de PCI, 
                    _cllPCI[protoConcept]  = myResult.metaData  
                    DefineProtoModel( myResult.metaData , modelClassName  );
                    
                    thisRef.protoTabContainer.addTabPanel( protoConcept );

                },
                failure: function ( result, request) { 
                    // Se aborta la ejecucion 
                    console.log('Failed', result.responseText); 
                },
            });

        }  else {

            // El modelo ya ha sido cargado ( la cll meta es global )     
            this.protoTabContainer.addTabPanel(protoConcept );
               
        };
        
    },   

    createProtoTabContainer: function(){
       this.protoTabContainer = Ext.create('widget.protoTabContainer', {
            region: 'center',
            minWidth: 300,
        }); 
        return this.protoTabContainer;
    },


});