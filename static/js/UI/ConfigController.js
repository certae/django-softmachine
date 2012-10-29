
Ext.define('ProtoUL.UI.ConfigController', {
    extend: 'Ext.Base',

    //@required
    protoOption : null, 

    
    constructor: function (config) {
        Ext.apply(this, config || {});
    },
    
    getActions: function() {
        // Se deben crear en forma indepnediente ( limitacion de Ext ) 

        // var tbConfig = Ext.getCmp( ideTbConfig )

        var me = this;         
        var myActions = [];

        myActions.push( myActionConfig( 'Meta', 'Meta Config', 'icon-configMeta' ))
        myActions.push( myActionConfig( 'Form', 'Form Config', 'icon-configForm' ))
        myActions.push( myActionConfig( 'Fields', 'Add Fields', 'icon-configFields' ))
        myActions.push( myActionConfig( 'Details', 'Add Details', 'icon-configDetails' ))
        myActions.push( myActionConfig( 'Reset', 'Reset loaded meta', 'icon-configReset' ))

        return myActions   

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
            _cllPCI = [];
            break;
        }

    }, 
        

    showMetaConfig: function() {

        var myPcl = Ext.widget('protoPcl', {
            myMeta :  _cllPCI[ this.protoOption ], 
            editable : true  
        });

        this.showConfigWin( myPcl ) 
        
    }, 

     
    showFieldTree: function() {
    
        var fieldsTree = Ext.create('ProtoUL.proto.ProtoFieldSelector', {
            protoOption : this.protoOption, 
            myMeta :  _cllPCI[ this.protoOption ] 
        });
    
        this.showConfigWin( fieldsTree ) 
    
    }, 
    
    
    showProtoDesigner: function() {

        var protoDesigner = Ext.widget('protoDesigner', {
            myMeta :  _cllPCI[ this.protoOption ], 
            protoOption : this.protoOption 
        });

        this.showConfigWin( protoDesigner ) 
    }, 
    

    showDetailsTree: function() {

        var detailsTree = Ext.create('ProtoUL.proto.ProtoDetailSelector', {
            protoOption : this.protoOption, 
            myMeta :  _cllPCI[ this.protoOption ] 
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
