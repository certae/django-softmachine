Ext.define('ProtoUL.UI.ConfigController', {
    extend: 'Ext.Base',
    myMeta : null, 
    constructor: function (config) {
        Ext.apply(this, config || {});
        this.getProtoConfigBar()
    }, 
    
    getProtoConfigBar: function() {

        var me = this; 
        var myConfigOpts = [];
        var __MasterDetail = this.__MasterDetail

        this.protoOption = this.myMeta.protoOption 
        var perms = _SM._UserInfo.perms[ this.protoOption ]

        if (  perms.config ) {             myConfigOpts.push(myActionConfig('Meta', _SM.__language.MetaConfig_Meta_Config, 'icon-configMeta'))
            myConfigOpts.push(myActionConfig('Fields', _SM.__language.MetaConfig_Add_Fields, 'icon-configFields'))
            myConfigOpts.push(myActionConfig('Details', _SM.__language.MetaConfig_Add_Details, 'icon-configDetails'))
        }
         
        if (  perms.custom || perms.config ) {
           myConfigOpts.push(myActionConfig('Form', _SM.__language.MetaConfig_Form_Config, 'icon-configForm'))
        }  
        // Modificacion del entorno
        if ( myConfigOpts.length > 0  ) {
            
            __MasterDetail.tbConfigOpts = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top',
                hidden : true,
                enableOverflow : true, 
                items: [{
                    xtype   : 'tbtext',
                    text: '<b>'+_SM.__language.Text_Config+ ':<b>'
                }]
            });

            __MasterDetail.tbConfigOpts.add( myConfigOpts );
            __MasterDetail.myConfigOpts = myConfigOpts;
            __MasterDetail.protoMasterGrid.addDocked( __MasterDetail.tbConfigOpts );

        };  

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
        }

    }, 
        

    showMetaConfig: function() {

        var myMeta =  _SM._cllPCI[ this.protoOption ]
        if ( ! myMeta ) return 

        var myPcl = Ext.widget('protoPcl', {
            myMeta :  myMeta,  
            editable : true  
        });

        this.showConfigWin( myPcl ) 
        
    }, 

     
    showFieldTree: function() {
    
        var myMeta =  _SM._cllPCI[ this.protoOption ]
        if ( ! myMeta ) return 
        
        var fieldsTree = Ext.create('ProtoUL.proto.ProtoFieldSelector', {
            protoOption : this.protoOption, 
            myMeta : myMeta 
        });
    
        this.showConfigWin( fieldsTree ) 
    
    }, 
    
    
    showProtoDesigner: function() {

        var myMeta =  _SM._cllPCI[ this.protoOption ]
        if ( ! myMeta ) return 

        var protoDesigner = Ext.widget('protoDesigner', {
            myMeta :  myMeta,  
            protoOption : this.protoOption 
        });

        this.showConfigWin( protoDesigner ) 
    }, 
    

    showDetailsTree: function() {

        var myMeta =  _SM._cllPCI[ this.protoOption ]
        if ( ! myMeta ) return 

        var detailsTree = Ext.create('ProtoUL.proto.ProtoDetailSelector', {
            myMeta :  myMeta,  
            protoOption : this.protoOption 
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
