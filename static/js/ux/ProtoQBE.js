

Ext.define('Ext.ux.protoQBE', {
    extend: 'Ext.window.Window',
    alias: 'widget.protoqbe',
    iconCls: 'icon-filter',
    
    protoOption: null,
    defaultType: 'textfield',
    autoHeigth: true,
    campos: [],
    resizable:false,
    titulo:'',
    //width: 530,
    modal: true,
    campos: {},
    aceptar: function () { },
    cancelPress: function () { },
    plain: true,
    titulo: '',
  
    initComponent: function () {
        me = this;

        var fields = new Array();

        if (me.titulo != '') me.titulo = '-' + me.titulo;

        var resp = me.campos;
        //console.log(resp);
        for (i = 0; i < resp.length; i++) {
            var nom = '';
            //console.log(resp[i].required);
            if (resp[i].required == true) {
                var req = _SM._requiredField;
                nom = '<b>' + resp[i].name + '</b>'
            } else {
                nom = resp[i].name;
                var req = "";
            }

            fields.push(
                {
                    fieldLabel: Ext.util.Format.capitalize(nom),
                    afterLabelTextTpl: req,
                    name: resp[i].name,
                    allowBlank: !resp[i].required,
                    width: 300,
                    protoOption:  me.protoOption,
                    editable: true,
                    xtype: "HelpQbe",
                    //hidden:!resp[i].searchable,
                    //hidden:false,
                    //query: "select OPCION from W0menus"
                    hideTrigger: !resp[i].qbeHelp,
                    enterKey:   this.accept
                }
            );

        }

      

        

        Ext.applyIf(me, {

            title: me.protoOption + me.titulo,
            


            items: [
                {
                    xtype: 'form',
                   // region: 'center',
                    items: fields,
                    autoScroll: true,
                    labelWidth: 150,
                    autoHeigth: true,
                    maxHeight: 400,
                    width: 350,
                    //height:300,
                    flex:1,
                    
                    monitorValid: true,
                    frame: true,
                    bodyStyle: 'padding:5px 10px 0',
                    buttons: [
                       {
                           xtype: 'button',
                           width: 10,
                           text: _SM.__language.Text_Accept_Button,
                           formBind: true,
                           iconCls: "icon-accept",
                           handler: this.accept

                       }, {
                           xtype: 'button',
                           text: _SM.__language.Title_Cancel_Button,
                           iconCls: "icon-cancel",
                           width: 10,
                           handler:this.cancel
                       }

                    ]

                }
            ]



        });


        me.callParent(arguments);
    },

    accept:function () {
        var form = me.down('form').getForm();
        if(form.isValid()){
            var campos = me.down('form').items.items;
            arrFilterQbe = new Array();
            var qbe = '';
            for (i = 0; i < campos.length; i++) {
                if (campos[i].getValue().trim() != '') {
                    var t = {
                        property   : campos[i].getName(),
                        filterStmt : campos[i].getValue()
                    };
                    arrFilterQbe.push(t);
                }
            }

            me.aceptar( arrFilterQbe );
            me.close();
        }
       
    },

    cancel: function () {
        me.cancelPress();
        me.close();
    }

});


