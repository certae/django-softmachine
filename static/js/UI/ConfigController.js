
Ext.define('ProtoUL.UI.ConfigController', {
    extend: 'Ext.Base',

    //@Required 
    myMeta : null, 

    constructor: function (config) {
        Ext.apply(this, config || {});
    },
    

    getActions: function() {
        // Se deben crear en forma indepnediente ( limitacion de Ext ) 

        // var tbConfig = Ext.getCmp( ideTbConfig )

        var me = this;         
        var myActions = [];

        myActions.push( myActionConfig( 'Meta', 'icon-configMeta' ))
        myActions.push( myActionConfig( 'Form', 'icon-configForm' ))
        myActions.push( myActionConfig( 'Fields', 'icon-configFields' ))
        myActions.push( myActionConfig( 'Details', 'icon-configDetails' ))
        myActions.push( myActionConfig( 'Reset', 'icon-configReset' ))

        return myActions   

        function myActionConfig( name, icon ) {
            var myAction = Ext.create ( 'Ext.Action', {
                text:         name,
                iconCls :     icon, 
                prCfgAction : name,
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
        
    showMetaConfig: function () {
        var safeConf =  clone( this.myMeta , 0, exclude =['__ptDict'] )
        this.showConfig( 'MetaConfig', safeConf )
    }, 

    showColsConfig: function() {
            
        // var safeConf =  clone( myColumns )
        // var safeConf = { a : { a1 : 1, a2: 2}, b : [ 'b1', 'b2']}
        // var safeConf = { a : { a1 : ['1'], a2: []} }

        var safeConf = clone( this.myMeta , 0, exclude =['__ptDict', 'protoViews'] )
        var treeData = Meta2Tree( safeConf, 'pcl' , 'pcl' ) 
        safeConf = Tree2Meta( treeData ) 

        this.showConfig( 'm2t t2m' , safeConf  )
    }, 
        

    showMetaConfig: function() {

        var myPcl = Ext.widget('protoPcl', {
            myMeta : this.myMeta, 
            editable : true  
        });

        this.showConfigWin( myPcl ) 
        
    }, 


     
    showFieldTree: function() {
    
    
        var fieldsTree = Ext.create('ProtoUL.proto.ProtoFieldSelector', {
            protoOption : this.myMeta.protoOption, 
            myMeta : this.myMeta
        });
    
        this.showConfigWin( fieldsTree ) 
    
    }, 
    
    
    showProtoDesigner: function() {

        var protoDesigner = Ext.widget('protoDesigner', {
            myMeta  : this.myMeta,  
            protoOption : this.myMeta.protoOption 
        });

        this.showConfigWin( protoDesigner ) 
    }, 
    

    showDetailsTree: function() {


        var detailsTree = Ext.create('ProtoUL.proto.ProtoDetailSelector', {
            protoOption : this.myMeta.protoOption, 
            myMeta : this.myMeta
        });
    
        this.showConfigWin( detailsTree ) 
    
    }, 

    showConfigWin: function( CnfgItems ) {
        
         var myWin  = Ext.widget('window', {
            constrain: true, 
            title : 'MetaDefinition [ ' + this.myMeta.protoOption + ' ]', 
            // closeAction: 'hide',
            width: 900,
            height: 600,
            minHeight: 400,
            minWidth: 400,
            layout: 'fit',
            resizable: true,

            collapsible: true,
            // modal: true,
            items: CnfgItems
        });
        
        myWin.show()

    }, 
         
    
    showConfig: function ( title , myConf ) {
        Ext.Msg.show({
           title: title,
           multiline : true,   
           width : 800, 
           height : 600, 
           value: Ext.encode( myConf ) 
           });
    }


      
})
