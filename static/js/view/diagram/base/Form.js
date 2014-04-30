/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.view.diagram.base.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.diagramform',

    requires: ['Ext.form.Panel', 'Ext.form.field.Text'],

    title: 'Edit/Create Diagram',
    layout: 'fit',
    autoShow: true,
    width: 280,
    itemId: 'diagramform',

    iconCls: 'icon-pclDetails',

    initComponent: function() {
        this.items = [{
            xtype: 'form',
            padding: '5 5 0 5',
            border: false,
            style: 'background-color: #fff;',

            fieldDefaults: {
                anchor: '100%',
                labelAlign: 'left',
                combineErrors: true,
                msgTarget: 'side'
            },

            items: [{
                xtype: 'textfield',
                name: 'id',
                fieldLabel: 'id',
                hidden: true
            }, {
            	xtype: 'textfield',
                name: 'projectID',
                fieldLabel: 'projectID',
                hidden: true
            }, {
                xtype: 'textfield',
                name: 'code',
                allowBlank: false,
                fieldLabel: _SM.__language.GridColumn_Name,
                validator: function(val) {
                    if (!Ext.isEmpty(Ext.String.trim(val))) {
                        return true;
                    } else {
                        return "Value cannot be empty";
                    }
                }
            }, {
                xtype: 'textfield',
                name: 'smUUID',
                readOnly: true,
                fieldLabel: 'UUID',
                hidden: true
            }]
        }];

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            id: 'buttons',
            ui: 'footer',
            items: ['->', {
                iconCls: 'icon-save',
                text: _SM.__language.Text_Save_Button,
                action: 'save'
            }, {
                iconCls: 'icon-reset',
                text: _SM.__language.Text_Cancel_Button,
                scope: this,
                handler: this.close
            }]
        }];

        this.callParent(arguments);
    }
}); 