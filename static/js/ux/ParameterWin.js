/* Dgt 1302
 * Ventana generica q recibira una serie de parametros tipados, 
 * y retornara un objeto con la respuesta del usuario
 *
 */

Ext.define('ProtoUL.ux.parameterWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.parameterWin',
    
    // Coleccion de campos q se van a mostrar 
    parameters   : [],
    width      : 400,
    minWidth   : 300,
    // frame      : true,
    
    title    : 'Parameters form',
    layout   : 'fit',

    acceptText : 'Accept', //_SM.__language.Text_Accept_Button, 
    cancelText : 'Cancel', //_SM.__language.Text_Cancel_Button, 

    // Custom functions para aceptar y/o cancelar ( como ajax ) 
    options : {
        acceptFn  : null,
        cancelFn  : null
    }, 


    initComponent: function () {
        var me = this;
        var myFields = [];

        //console.log(resp);
        for (var ix in this.parameters ) {
            var myField =  _SM.getFormFieldDefinition( this.parameters[ix] )
            myFields.push( myField ) 
        }

        Ext.applyIf( this.options, {
            scope: this,
            acceptFn: Ext.emptyFn,
            cancelFn: Ext.emptyFn
        });
        
        Ext.apply(this, {

            // waitMsgTarget: true,
            // bodyStyle: 'padding:5px 5px',
            // bodyPadding: 10,

            items: [
                {
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
                }
            ] 
        });


        me.callParent(arguments);
    },

    accept: function () {
        var form = this.down('form').getForm();
        if(form.isValid()){

            var myFields = form.getFields().items;
            var myReponse = [];

            for (var ix in myFields ) {
                var myField = myFields[ix]
                myReponse.push( {parameter: myField.getName(), value: myField.getValue() } ) 
            }
            this.options.acceptFn.call( this.options.scope, myReponse );
            this.close();
        }
    },

    cancel: function () {
        this.options.cancelFn.call( this.options.scope )
        this.close();
    }    


});

