
Ext.define('ProtoUL.UI.ConfigController', {
    extend: 'Ext.Base',

    //@required
    protoOption : null, 

    
    constructor: function (config) {
        Ext.apply(this, config || {});
    },
    
    getUsrActs: function() {
        // Se deben crear en forma indepnediente ( limitacion de Ext ) 
        // var tbConfig = Ext.getCmp( ideTbConfig )

        var me = this;         
        var myOptions = [];


        // if ( _SM._UserInfo.isSuperUser ) { 
            myOptions.push(myActionConfig('Meta', _SM.__language.MetaConfig_Meta_Config, 'icon-configMeta'))
            myOptions.push(myActionConfig('Form', _SM.__language.MetaConfig_Form_Config, 'icon-configForm'))
            myOptions.push(myActionConfig('Fields', _SM.__language.MetaConfig_Add_Fields, 'icon-configFields'))
            myOptions.push(myActionConfig('Details', _SM.__language.MetaConfig_Add_Details, 'icon-configDetails'))
            myOptions.push(myActionConfig('Reset', _SM.__language.MetaConfig_Reset_Meta, 'icon-configReset'))
        // } 

        return myOptions   

        function myActionConfig( action, name, icon ) {
            var myAction = Ext.create ( 'Ext.Action', {
                text:         name,
                iconCls :     icon, 
                prCfgAction : action,
                scope:        me,                     
                handler:      onClickConfigAction
            })
            return myAction   
        } 
        
        function onClickConfigAction( btn ){
            
            me.configAction( btn.prCfgAction )
        }
        
    }, 

    configAction: function( prCfgAction ) {
        
        switch(prCfgAction) {
        case 'Meta':
            this.showMetaConfig();
            break;
        case 'Form':
            this.showProtoDesigner();
            break;
        case 'Fields':
            this.showFieldTree();
            break;
        case 'Details':
            this.showDetailsTree();
            break;
        case 'Reset':
            _SM._cllPCI = [];
            break;
        }

    }, 
        

    showMetaConfig: function() {

        var myPcl = Ext.widget('protoPcl', {
            myMeta :  _SM._cllPCI[ this.protoOption ], 
            editable : true  
        });

        this.showConfigWin( myPcl ) 
        
    }, 

     
    showFieldTree: function() {
    
        var fieldsTree = Ext.create('ProtoUL.proto.ProtoFieldSelector', {
            protoOption : this.protoOption, 
            myMeta :  _SM._cllPCI[ this.protoOption ] 
        });
    
        this.showConfigWin( fieldsTree ) 
    
    }, 
    
    
    showProtoDesigner: function() {

        var protoDesigner = Ext.widget('protoDesigner', {
            myMeta :  _SM._cllPCI[ this.protoOption ], 
            protoOption : this.protoOption 
        });

        this.showConfigWin( protoDesigner ) 
    }, 
    

    showDetailsTree: function() {

        var detailsTree = Ext.create('ProtoUL.proto.ProtoDetailSelector', {
            protoOption : this.protoOption, 
            myMeta :  _SM._cllPCI[ this.protoOption ] 
        });
    
        this.showConfigWin( detailsTree ) 
    
    }, 

    showConfigWin: function( CnfgItems ) {
        
         var myWin  = Ext.widget('window', {
            constrain: true, 
            title : 'MetaDefinition [ ' + this.protoOption + ' ]', 
            // closeAction: 'hide',
            width: 900,
            height: 600,
            minHeight: 400,
            minWidth: 400,
            layout: 'fit',
            resizable: true,
            maximizable: true, 

            collapsible: true,
            // modal: true,
            items: CnfgItems
        });
        
        myWin.show()

    } 

      
})
