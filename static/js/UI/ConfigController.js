/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.UI.ConfigController', {
    extend: 'Ext.Base',
    myMeta: null,
    constructor: function(config) {
        Ext.apply(this, config || {});
        this.getProtoConfigBar();
    },

    getProtoConfigBar: function() {
        var me = this;
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
            return myAction;
        }

        // @formatter:off
        var myConfigOpts = [], 
            __MasterDetail = this.__MasterDetail;
        // @formatter:on

        this.viewCode = this.myMeta.viewCode;
        var perms = _SM._UserInfo.perms[this.viewCode];

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

            __MasterDetail.tbConfigOpts = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top',
                hidden: true,
                enableOverflow: true,
                items: [{
                    xtype: 'tbtext',
                    text: '<strong>' + _SM.__language.Text_Config + ':</strong>'
                }]
            });

            __MasterDetail.tbConfigOpts.add(myConfigOpts);
            __MasterDetail.myConfigOpts = myConfigOpts;
            __MasterDetail.protoMasterGrid.addDocked(__MasterDetail.tbConfigOpts);

        }
    },

    configAction: function(prCfgAction) {

        switch(prCfgAction) {
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

    showMetaConfig: function() {

        var myMeta = _SM._cllPCI[this.viewCode];
        if (!myMeta) {
            return;
        }

        var myPcl = Ext.widget('protoPcl', {
            myMeta: myMeta,
            editable: true
        });

        this.showConfigWin(myPcl);

    },

    showCustomConfig: function(metaConfig) {
        var myMeta = _SM._cllPCI[this.viewCode], title;

        if (!myMeta) {
            return;
        }

        var myPcl = Ext.widget('protoPcl', {
            myMeta: myMeta,
            custom: true,
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

    showFieldTree: function() {

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

    showProtoDesigner: function() {

        var myMeta = _SM._cllPCI[this.viewCode];
        if (!myMeta) {
            return;
        }

        var protoDesigner = Ext.widget('protoDesigner', {
            myMeta: myMeta,
            viewCode: this.viewCode
        });

        this.showConfigWin(protoDesigner);
    },

    showDetailsTree: function() {

        var myMeta = _SM._cllPCI[this.viewCode];
        if (!myMeta) {
            return;
        };

        var detailsTree = Ext.create('ProtoUL.proto.ProtoDetailSelector', {
            myMeta: myMeta,
            viewCode: this.viewCode
        });

        this.showConfigWin(detailsTree);

    },

    showConfigWin: function(CnfgItems, title) {

        if (!title) {
            title = 'MetaDefinition';
        }

        var myWin = Ext.widget('window', {
            constrain: true,
            title: title + ' [ ' + this.viewCode + ' ]',
            // closeAction: 'hide',
            width: 900,
            height: 600,
            minHeight: 400,
            minWidth: 400,
            layout: 'fit',

            constrainHeader: true,
            resizable: true,
            maximizable: true,

            collapsible: true,
            // modal: true,
            items: CnfgItems
        });

        myWin.show();

    }

});