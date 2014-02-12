/* Dgt 1302
 * Generic window that receive a series of typed parameters and return a object with user response
 */

Ext.define('ProtoUL.ux.parameterWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.parameterWin',
    
    parameters   : [],
    width      : 400,
    minWidth   : 300,
    
    title    : 'Parameters form',
    layout   : 'fit',

	acceptText : 'Accept',
	cancelText : 'Cancel',

    options : {
        acceptFn  : null,
        cancelFn  : null
    }, 


    initComponent: function () {
        var me = this;
        var myFields = [];

        for (var ix in this.parameters ) {
			var myField = _SM.getFormFieldDefinition(this.parameters[ix]);
			myFields.push(myField);
        }

        Ext.applyIf( this.options, {
            scope: this,
            acceptFn: Ext.emptyFn,
            cancelFn: Ext.emptyFn
        });
        
        Ext.apply(this, {
			items : [{
                    xtype: 'form',
                    autoScroll : true,
                    monitorValid: true,
                    items: [{
                        xtype: 'fieldset',
                        defaultType: 'textfield',
                        layout : "column",
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
                    buttons: [{
                        text: this.cancelText ,
                        iconCls: "icon-cancel",
                        scope : this , 
                        handler: this.cancel
                    }, {
                        text:  this.acceptText ,
                        iconCls: "icon-accept",
                        scope : this , 
                        handler: this.accept,  
                        disabled: true,
                        formBind: true
                    }] 
			}]
        });


        me.callParent(arguments);
    },

    accept: function () {
        var form = this.down('form').getForm();
        if(form.isValid()){

            var myFields = form.getFields().items;
            var myReponse = [];

            for (var ix in myFields ) {
				var myField = myFields[ix];
				myReponse.push({
					parameter : myField.getName(),
					value : myField.getValue()
				});
            }
            this.options.acceptFn.call( this.options.scope, myReponse );
            this.close();
        }
    },

    cancel: function () {
		this.options.cancelFn.call(this.options.scope);
        this.close();
    }    


});