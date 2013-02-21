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
    
    title    : 'Parameters form',
    modal    : false,
    acceptText : _SM.__language.Text_Accept_Button, 
    cancelText : _SM.__language.Text_Cancel_Button, 

    // Custom functions para aceptar y/o cancelar ( como ajax ) 
    options : {
        acceptFn  : null,
        cancelFn  : null
    }, 
        
    frame: true,
    width: 340,
    bodyPadding: 5,
    waitMsgTarget: true,

    defaultType: 'textfield',
    autoHeigth: true,
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 85,
        msgTarget: 'side'
    },

    initComponent: function () {
        var me = this;
        var myFields = new Array();

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
        

        Ext.apply(me, {
            items: [
                {
                    xtype: 'form',
                    autoScroll: true,
                    labelWidth: 150,
                    autoHeigth: true,
                    bodyStyle: 'padding:5px 10px 0',
                    // height:300,
                    maxHeight: 600,
                    width    : 350,
                    frame: true,
                    flex:1,
                    
                    monitorValid: true,

                    items: [{
                        xtype: 'fieldset',
                        defaultType: 'textfield',
                        defaults: { width: 280 },
                        items: myFields, 
                    }],
                    buttons: [{
                        text: this.cancelText ,
                        iconCls: "icon-cancel",
                        handler: this.cancel
                    }, {
                        text:  this.acceptText ,
                        iconCls: "icon-accept",
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
        var form = me.down('form').getForm();
        if(form.isValid()){

            var myFields = me.down('form').items.items;
            var myReponse = [];

            for (var ix in myFields ) {
                var myField = myFields[ix]
                myReponse.push({
                    property   : myFields[i].getName(),
                    filterStmt : myFields[i].getValue()
                }); 
            }
            me.options.acceptFn.call( me.options.scope, myReponse );
            me.close();
        }
    },

    cancel: function () {
        me.options.cancelFn.call( me.options.scope )
        me.close();
    }    


});

