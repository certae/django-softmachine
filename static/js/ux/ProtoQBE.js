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
        //console.log(resp);
        for (i = 0; i < resp.length; i++) {
            var nom = '';
            //console.log(resp[i].required);
            if (resp[i].required == true) {
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
                    allowBlank: !resp[i].required,
                    width: 300,
                    protoOption:me.protoOption,
                    editable: true,
                    xtype: "HelpQbe",
                    //hidden:!resp[i].searchable,
                    //hidden:false,
                    //query: "select OPCION from W0menus"
                    hideTrigger: !resp[i].qbeHelp
                    
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
                    width:350,
                    monitorValid: true,
                    frame: true,
                    bodyStyle: 'padding:5px 10px 0',
                    buttons: [
                       {
                           xtype: 'button',
                           width: 10,
                           text: __language.Text_Accept_Button,
                           formBind: true,
                           iconCls: "icon-ok",
                           handler: function () {
                               var campos = me.down('form').items.items;
                               arrQbe = new Array();
                               var qbe = '';
                               for (i = 0; i < campos.length; i++) {
                                   if (campos[i].getValue().trim() != '') {
                                       var t = {
                                           property   : campos[i].getName(),
                                           filterStmt : campos[i].getValue()
                                       };
                                       arrQbe.push(t);
                                       //qbe += campos[i].getName() + "$( " + campos[i].getValue() + " ),";
                                   }
                               }
                               /*if (qbe != '') {
                                   qbe = qbe.substring(0, qbe.length - 1);
                               }*/
                               //me.aceptar(qbe);
                               me.aceptar( arrQbe );
                               me.close();
                           }



                       }, {
                           xtype: 'button',
                           text: __language.Title_Cancel_Button,
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


