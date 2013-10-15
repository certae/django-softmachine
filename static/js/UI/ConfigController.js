"use strict";
/*jslint nomen: true */
/*global Ext */
/*global _SM */
/*global ProtoUL */

Ext.define('ProtoUL.UI.ConfigController', {
    extend: 'Ext.Base',
    myMeta : null,
    constructor: function (config) {
        Ext.apply(this, config || {});
<<<<<<< HEAD
        this.getProtoConfigBar();
    },

    getProtoConfigBar: function () {
=======
        this.getProtoConfigBar()
    },

    getProtoConfigBar: function() {
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

        var me = this;
        var myConfigOpts = [];
        var __MasterDetail = this.__MasterDetail;

<<<<<<< HEAD
        this.viewCode = this.myMeta.viewCode;
        var perms = _SM._UserInfo.perms[this.viewCode];

        function onClickConfigAction(btn) {
            me.configAction(btn.prCfgAction);
        }

        function myActionConfig(action, name, icon) {

            var myAction = Ext.create('Ext.Action', {
                text: name,
                iconCls: icon,
                prCfgAction: action,
                scope: me,
                handler: onClickConfigAction
            });
=======
        this.viewCode = this.myMeta.viewCode
        var perms = _SM._UserInfo.perms[ this.viewCode ]
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

            return myAction;
        }

<<<<<<< HEAD
        if (perms.config) {
            myConfigOpts.push(myActionConfig('Form', _SM.__language.MetaConfig_Form_Config, 'icon-configForm'));
            myConfigOpts.push(myActionConfig('Fields', _SM.__language.MetaConfig_Add_Fields, 'icon-configFields'));
            myConfigOpts.push(myActionConfig('Details', _SM.__language.MetaConfig_Add_Details, 'icon-configDetails'));
            myConfigOpts.push(myActionConfig('Config', _SM.__language.MetaConfig_Base_Config, 'icon-configCustom'));
            myConfigOpts.push(myActionConfig('Meta', _SM.__language.MetaConfig_Meta_Config, 'icon-configMeta'));
        } else if (perms.custom) {
            myConfigOpts.push(myActionConfig('Custom', _SM.__language.MetaConfig_Custom_Config, 'icon-configCustom'));
        }

        // Modificacion del entorno
        if (myConfigOpts.length > 0) {
=======
        if (  perms.config ) {
           myConfigOpts.push(myActionConfig('Form', _SM.__language.MetaConfig_Form_Config, 'icon-configForm'))
           myConfigOpts.push(myActionConfig('Fields', _SM.__language.MetaConfig_Add_Fields, 'icon-configFields'))
           myConfigOpts.push(myActionConfig('Details', _SM.__language.MetaConfig_Add_Details, 'icon-configDetails'))
           myConfigOpts.push(myActionConfig('Config', _SM.__language.MetaConfig_Base_Config, 'icon-configCustom'))
           myConfigOpts.push(myActionConfig('Meta', _SM.__language.MetaConfig_Meta_Config, 'icon-configMeta'))

        } else if (  perms.custom  ) {
           myConfigOpts.push(myActionConfig('Custom', _SM.__language.MetaConfig_Custom_Config, 'icon-configCustom'))
        }

        // Modificacion del entorno
        if ( myConfigOpts.length > 0  ) {
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

            __MasterDetail.tbConfigOpts = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top',
                hidden : true,
                enableOverflow : true,
                items: [{
                    xtype   : 'tbtext',
                    text: '<b>' + _SM.__language.Text_Config + ':<b>'
                }]
            });

            __MasterDetail.tbConfigOpts.add(myConfigOpts);
            __MasterDetail.myConfigOpts = myConfigOpts;
<<<<<<< HEAD
            __MasterDetail.protoMasterGrid.addDocked(__MasterDetail.tbConfigOpts);
        }
    },

    configAction: function (prCfgAction) {

        switch (prCfgAction) {
=======
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
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
        case 'Meta':
            this.showMetaConfig();
            break;
        case 'Custom':
            this.showCustomConfig(false);
            break;
        case 'Config':
            this.showCustomConfig(true);
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

<<<<<<< HEAD
    showMetaConfig: function () {

        var myMeta = _SM._cllPCI[this.viewCode];
        if (!myMeta) {
            return;
        }

        var myPcl = Ext.widget('protoPcl', {
            myMeta:  myMeta,
            editable: true
        });

        this.showConfigWin(myPcl);
=======
    },


    showMetaConfig: function() {

        var myMeta =  _SM._cllPCI[ this.viewCode ]
        if ( ! myMeta ) return

        var myPcl = Ext.widget('protoPcl', {
            myMeta :  myMeta,
            editable : true
        });

        this.showConfigWin( myPcl )

>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
    },

    showCustomConfig: function (metaConfig) {
        var myMeta = _SM._cllPCI[this.viewCode], title;

<<<<<<< HEAD
        if (!myMeta) {
            return;
        }

        var myPcl = Ext.widget('protoPcl', {
            myMeta:  myMeta,
            custom:  true,
            metaConfig: metaConfig,
            editable: true
        });

        if (metaConfig) {
            title = 'Base Config';
        } else {
            title = 'Custom Config';
        }

        this.showConfigWin(myPcl);
    },

    showFieldTree: function () {

        var myMeta = _SM._cllPCI[this.viewCode];
        if (!myMeta) {
            return;
        }

        var fieldsTree = Ext.create('ProtoUL.proto.ProtoFieldSelector', {
            viewCode: this.viewCode,
            myMeta: myMeta
        });

        this.showConfigWin(fieldsTree);
    },

    showProtoDesigner: function () {

        var myMeta =  _SM._cllPCI[this.viewCode];
        if (!myMeta) {
            return;
        }

        var protoDesigner = Ext.widget('protoDesigner', {
            myMeta: myMeta,
            viewCode: this.viewCode
        });

        this.showConfigWin(protoDesigner);
    },
=======
    showCustomConfig: function( metaConfig ) {
        var myMeta =  _SM._cllPCI[ this.viewCode ],
            title

        if ( ! myMeta ) return

        var myPcl = Ext.widget('protoPcl', {
            myMeta :  myMeta,
            custom :  true,
            metaConfig : metaConfig,
            editable : true
        });

        if ( metaConfig )  {
            title = 'Base Config'
        } else { title = 'Custom Config' }

        this.showConfigWin( myPcl )
    },


    showFieldTree: function() {

        var myMeta =  _SM._cllPCI[ this.viewCode ]
        if ( ! myMeta ) return

        var fieldsTree = Ext.create('ProtoUL.proto.ProtoFieldSelector', {
            viewCode : this.viewCode,
            myMeta : myMeta
        });

        this.showConfigWin( fieldsTree )

    },


    showProtoDesigner: function() {

        var myMeta =  _SM._cllPCI[ this.viewCode ]
        if ( ! myMeta ) return

        var protoDesigner = Ext.widget('protoDesigner', {
            myMeta :  myMeta,
            viewCode : this.viewCode
        });

        this.showConfigWin( protoDesigner )
    },

>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e

    showDetailsTree: function () {

<<<<<<< HEAD
        var myMeta = _SM._cllPCI[this.viewCode];
        if (!myMeta) {
            return;
        }

        var detailsTree = Ext.create('ProtoUL.proto.ProtoDetailSelector', {
            myMeta: myMeta,
            viewCode: this.viewCode
        });

        this.showConfigWin(detailsTree);
    },

    showConfigWin: function (CnfgItems, title) {

        if (!title) {
            title = 'MetaDefinition';
        }

        var myWin  = Ext.widget('window', {
            constrain: true,
            title: title + ' [ ' + this.viewCode + ' ]',
=======
        var myMeta =  _SM._cllPCI[ this.viewCode ]
        if ( ! myMeta ) return

        var detailsTree = Ext.create('ProtoUL.proto.ProtoDetailSelector', {
            myMeta :  myMeta,
            viewCode : this.viewCode
        });

        this.showConfigWin( detailsTree )

    },

    showConfigWin: function( CnfgItems , title ) {

        if ( ! title ) { title = 'MetaDefinition' }

        var myWin  = Ext.widget('window', {
            constrain: true,
            title : title + ' [ ' + this.viewCode + ' ]',
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
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
<<<<<<< HEAD

        myWin.show();
    }
});
=======

        myWin.show()

    }


})
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
