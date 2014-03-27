/* Dgt 1302
 * Generic window that receive a series of typed parameters and return a object with user response
 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.ux.parameterWin', {
    extend : 'Ext.window.Window',
    alias : 'widget.parameterWin',

    parameters : [],
    width : 400,
    minWidth : 300,

    title : 'Parameters form',
    layout : 'fit',

    acceptText : 'Accept',
    cancelText : 'Cancel',

    options : {
        acceptFn : null,
        cancelFn : null
    },

    initComponent : function() {
        var ix, myField, me = this, myFields = [];

        for (ix in this.parameters ) {
            myField = _SM.getFormFieldDefinition(this.parameters[ix]);
            myFields.push(myField);
        }

        Ext.applyIf(this.options, {
            scope : this,
            acceptFn : Ext.emptyFn,
            cancelFn : Ext.emptyFn
        });

        Ext.apply(this, {
            items : [{
                xtype : 'form',
                autoScroll : true,
                monitorValid : true,
                items : [{
                    xtype : 'fieldset',
                    defaultType : 'textfield',
                    layout : "column",
                    defaults : {
                        padding : "2 2",
                        columnWidth : 1
                    },
                    fieldDefaults : {
                        labelAlign : 'left',
                        labelWidth : 150,
                        msgTarget : 'side'
                    },
                    items : myFields
                }],
                buttons : [{
                    text : this.cancelText,
                    iconCls : "icon-cancel",
                    scope : this,
                    handler : this.cancel
                }, {
                    text : this.acceptText,
                    iconCls : "icon-accept",
                    scope : this,
                    handler : this.accept,
                    disabled : true,
                    formBind : true
                }]
            }]
        });

        me.callParent(arguments);
    },

    accept : function() {

        var form, myFields, myField, myReponse, ix;

        form = this.down('form').getForm();
        if (form.isValid()) {

            myFields = form.getFields().items;
            myReponse = [];

            for (ix in myFields ) {
                myField = myFields[ix];
                myReponse.push({
                    parameter : myField.getName(),
                    value : myField.getValue()
                });
            }
            this.options.acceptFn.call(this.options.scope, myReponse);
            this.close();
        }
    },

    cancel : function() {
        this.options.cancelFn.call(this.options.scope);
        this.close();
    },

    uploadFile : function() {

        var win, me= this;

        win = Ext.widget('window', {
            title : 'Upload Xml',
            modal : true,
            closeAction : 'hide',
            width : 450,
            items : [{
                xtype : 'form',
                bodyPadding : 10,
                fieldDefaults : {
                    labelWidth : 150,
                    anchor : '100%',
                    allowBlank : false
                },
                border : false,
                items : [{
                    xtype : 'textfield',
                    name : 'keyElement',
                    fieldLabel : 'keyElement',
                    value : 'children'
                }, {
                    xtype : 'textfield',
                    name : 'TextElementName',
                    fieldLabel : 'Text element name',
                    value : 'title'
                }, {
                    xtype : 'filefield',
                    name : 'file',
                    fieldLabel : 'File',
                    buttonText : 'Select xml file...'
                }]
            }],
            buttons : [{
                text : 'Upload',
                handler : function() {
                    var form = win.down('form').getForm();
                    if (form.isValid()) {
                        form.submit({
                            url : _SM._PConfig.urlLoadFile, 
                            method: 'POST',
                            // scope: me,
                            waitMsg : 'Uploading your file...',
                            success : function(f, a) {
                                var result = a.result, data = result.data; 
                                win.close();
                            },
                            failure : function(f, a) {
                                Ext.Msg.alert('Failure', a.result.msg);
                            }
                        });
                    }
                }
            }]
        });

        win.show(); 

    }
});
