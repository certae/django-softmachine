/* Dgt 1302
 * Generic window that receive a series of typed parameters and return a object with user response
 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.ux.parameterWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.parameterWin',

    parameters: [],
    isUpload: false,
    width: 400,
    minWidth: 300,

    title: 'Parameters form',
    layout: 'fit',

    acceptText: 'Accept',
    cancelText: 'Cancel',

    options: {
        acceptFn: null,
        cancelFn: null
    },

    initComponent: function() {
        var ix, myField, me = this, myFields = [];

        for (ix in this.parameters ) {
            myField = _SM.getFormFieldDefinition(this.parameters[ix]);
            myFields.push(myField);
            if (myField.xtype === "filefield"){
                me.isUpload = true;
            }
        }

        Ext.applyIf(this.options, {
            scope: this,
            acceptFn: Ext.emptyFn,
            cancelFn: Ext.emptyFn
        });

        var fnHandler = Ext.emptyFn;
        if (me.isUpload) {
        	fnHandler = me.doUploadAction;
        } else {
        	fnHandler = me.accept;
        }
        var actionButtons = [{
            text: this.cancelText,
            iconCls: "icon-cancel",
            scope: this,
            handler: this.cancel
        }, {
            text: this.acceptText,
            iconCls: "icon-accept",
            scope: this,
            handler: fnHandler,
            disabled: true,
            formBind: true
        }];

        Ext.apply(this, {
            items: [{
                xtype: 'form',
                autoScroll: true,
                monitorValid: true,
                items: [{
                    xtype: 'fieldset',
                    defaultType: 'textfield',
                    layout: "column",
                    defaults: {
                        padding: "2 2",
                        columnWidth: 1
                    },
                    fieldDefaults: {
                        labelAlign: 'left',
                        labelWidth: 150,
                        msgTarget: 'side'
                    },
                    items: myFields
                }],
                buttons: actionButtons
            }]
        });

        me.callParent(arguments);
    },

    accept: function() {

        var form, myFields, myField, myReponse, ix;

        form = this.down('form').getForm();
        if (form.isValid()) {

            myFields = form.getFields().items;
            myReponse = [];

            for (ix in myFields ) {
                myField = myFields[ix];
                myReponse.push({
                    parameter: myField.getName(),
                    value: myField.getValue()
                });

                if ( myField.fkId && myField.zoomRecord ) {
                    myReponse.push({
                        parameter : myField.fkId,
                        value : myField.zoomRecord.data.id
                    });
                };

            }
            this.options.acceptFn.call(this.options.scope, myReponse);
            this.close();
        }
    },

    cancel: function() {
        this.options.cancelFn.call(this.options.scope);
        this.close();
    },

    doUploadAction: function() {
        var me = this;
        var form = me.down('form').getForm();
        if (form.isValid()) {
            form.submit({
                url: _SM._PConfig.urlLoadFile,
                method: 'POST',
                waitMsg: 'Uploading your file...',
                success: function(f, a) {
                    var result = a.result, data = result.data;
                    me.close();
                },
                failure: function(f, a) {
                    Ext.Msg.alert('Failure', a.failureType + ': error, try again later!');
                }
            });
        }
    }

});
