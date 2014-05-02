Ext.define('Ext.ux.protoQBE', {
    extend: 'Ext.window.Window',
    alias: 'widget.protoqbe',
    iconCls: 'icon-filter',

    viewCode: null,
    defaultType: 'textfield',
    autoHeigth: true,

    resizable: false,
    plain: true,
    modal: true,

    titulo: '',
    campos: {},

    aceptar: function() {
    },
    cancelPress: function() {
    },

    initComponent: function() {
        me = this;

        var fields = new Array();

        if (me.titulo !== '')
            me.titulo = '-' + me.titulo;

        var resp = me.campos;
        for ( i = 0; i < resp.length; i += 1) {
            var nom = '';
            if (resp[i].required == true) {
                var req = _SM._requiredField;
                nom = '<strong>' + resp[i].name + '</strong>';
            } else {
                nom = resp[i].name;
                var req = "";
            }

            fields.push({
                fieldLabel: Ext.util.Format.capitalize(nom),
                afterLabelTextTpl: req,
                name: resp[i].name,
                allowBlank: !resp[i].required,
                width: 300,
                viewCode: me.viewCode,
                editable: true,
                xtype: "HelpQbe",
                hideTrigger: !resp[i].qbeHelp,
                enterKey: this.accept
            });

        }

        Ext.applyIf(me, {

            title: me.viewCode + me.titulo,

            items: [{
                xtype: 'form',
                items: fields,
                autoScroll: true,
                labelWidth: 150,
                autoHeigth: true,
                maxHeight: 400,
                width: 350,
                flex: 1,

                monitorValid: true,
                frame: true,
                bodyStyle: 'padding:5px 10px 0',
                buttons: [{
                    xtype: 'button',
                    width: 10,
                    text: _SM.__language.Text_Accept_Button,
                    formBind: true,
                    iconCls: "icon-accept",
                    handler: this.accept

                }, {
                    xtype: 'button',
                    text: _SM.__language.Text_Cancel_Button,
                    iconCls: "icon-cancel",
                    width: 10,
                    handler: this.cancel
                }]

            }]

        });


        me.callParent(arguments);
    },

    accept: function() {
        var form = me.down('form').getForm();
        if (form.isValid()) {
            var campos = me.down('form').items.items;
            arrFilterQbe = new Array();
            var qbe = '';
            for ( i = 0; i < campos.length; i++) {
                if (campos[i].getValue().trim() !== '') {
                    var t = {
                        property: campos[i].getName(),
                        filterStmt: campos[i].getValue()
                    };
                    arrFilterQbe.push(t);
                }
            }

            me.aceptar(arrFilterQbe);
            me.close();
        }

    },

    cancel: function() {
        me.cancelPress();
        me.close();
    }
});