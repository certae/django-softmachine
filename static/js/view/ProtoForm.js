Ext.define('ProtoUL.view.ProtoForm', {
	extend: 'Ext.form.Panel',
    alias: 'widget.protoform',

    requires: ['Ext.form.field.Text', 'Ext.form.*'],

    initComponent: function () {
        this.addEvents('create');

        // Recupera la clase para obtener la meta ------------------------------------------
        var myMeta = this.myMeta ; 
        var _pForm = this; 

        // Definicion de Fields        ------------------------------------------
        var myColumns = [];
        for (var ix in myMeta.fields ) {
            var vFld  =  myMeta.fields[ix];

            // if (!vFld.header || vFld.storeOnly) {continue;}
            
            var col = {
                name:  vFld.name,
                xtype: 'textfield',  // 'protoZoom',
                fieldLabel: vFld.header,
                allowBlank: false, 
                hidden: vFld.hidden

                // width: vFld.width ,
                // minWidth: vFld.minWidth 
                // renderer: this.formatDate,                
            };

            myColumns.push(col);

        };
        
        this.myColumns = myColumns; 

        
        Ext.apply(this, {
            activeRecord: null,
            iconCls: 'icon-user',
            frame: true,
            title: 'User -- All fields are required',
            defaultType: 'textfield',
            bodyPadding: 5,
            fieldDefaults: {
                anchor: '100%',
                xtype: 'textfield',
                labelAlign: 'right'
            },
            items: myColumns, 
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->',
                {
                    iconCls: 'icon-save',
                    itemId: 'save',
                    text: 'Save',
                    disabled: true,
                    scope: this,
                    handler: this.onSave
                }, {
                    iconCls: 'icon-user-add',
                    text: 'Create',
                    scope: this,
                    handler: this.onCreate
                }, {
                    iconCls: 'icon-reset',
                    text: 'Reset',
                    scope: this,
                    handler: this.onReset
                }]
            }]
        });
        this.callParent();
    },

    setActiveRecord: function (record) {
        this.activeRecord = record;
        if (record) {
            this.down('#save').enable();
            this.getForm().loadRecord(record);
        } else {
            this.down('#save').disable();
            this.getForm().reset();
        }
    },

    onSave: function () {
        var active = this.activeRecord
        var form = this.getForm();

        if (!active) {
            return;
        }
        if (form.isValid()) {
            form.updateRecord(active);
            this.onReset();
        }
    },

    onCreate: function () {
        var form = this.getForm();

        if (form.isValid()) {
            this.fireEvent('create', this, form.getValues());
            form.reset();
        }

    },

    onReset: function () {
        this.setActiveRecord(null);
        this.getForm().reset();
    }
});