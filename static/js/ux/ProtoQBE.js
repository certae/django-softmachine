Ext.define('Ext.ux.protoQBE', {
    extend: 'Ext.window.Window',
    alias: 'widget.protoqbe',
    iconCls: 'icon-filter',
    protoOption: null,
    defaultType: 'textfield',
    autoHeigth: true,
    campos:[],
    titulo:'',
    //width: 530,
    modal: true,
    campos: {},
    aceptar: function () { },
    cancelar: function () { },
    plain: true,
    titulo: '',

    initComponent: function () {
        me = this;

        var fields = new Array();

        if (me.titulo != '') me.titulo = '-' + me.titulo;

        var resp = me.campos;

        for (i = 0; i < resp.length; i++) {
            var nom = '';
            if (resp[i].require == true) {
                var req = _requiredField;
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
                    allowBlank: !resp[i].require,
                    //width: 300,
                    protoOption:me.protoOption,
                    editable: true,
                    xtype: "HelpQbe",
                    //query: "select OPCION from W0menus"
                }


            );

        }

      

        

        Ext.applyIf(me, {

            title: me.protoOption + me.titulo,

            items: [
                {
                    xtype: 'form',
                    items: fields,
                    autoScroll: true,
                    labelWidth: 150,
                    autoHeigth: true,
                    maxHeight: 360,
                    width:510,
                    monitorValid: true,
                    frame: true,
                    bodyStyle: 'padding:5px 10px 0',
                    buttons: [
                       {
                           xtype: 'button',
                           width: 10,
                           text: 'Aceptar',
                           formBind: true,
                           iconCls: "icon-ok",
                           handler: function () {
                               var campos = me.down('form').items.items;
                              
                               var qbe = '';
                               for (i = 0; i < campos.length; i++) {
                                   if (campos[i].down('triggerfield').getValue().trim() != '') {
                                       qbe += campos[i].down('triggerfield').getName() + "$( " + campos[i].down('triggerfield').getValue() + " ),";
                                   }
                               }
                               if (qbe != '') {
                                   qbe = qbe.substring(0, qbe.length - 1);
                               }
                               me.aceptar(qbe);
                               me.close();
                           }



                       }, {
                           xtype: 'button',
                           text: 'Cancelar',
                           iconCls: "icon-cancelar",
                           width: 10,
                           action: 'clickCancelar',
                           handler:function(){
                                me.cancelar();
                                me.close();
                           }
                       }

                    ]

                }
            ]



        });


        me.callParent(arguments);
    }

});


