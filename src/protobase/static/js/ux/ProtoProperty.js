/*
 *  @Author : Dario Gomez T.  /  Certae Universite Laval Quebec
 *
 *  Enhanced PopertyGrid,
 *      comboProperties
 *      editable   ( True/ False )
 *      QTips
 *      Types
 *
 *  TODO:  OnKey Delete  borrar el valor de la propiedad
 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.ux.ProtoProperty', {
    extend : 'Ext.grid.property.Grid',
    alias : 'widget.protoProperty',
    source : {},
    readOnlyProps : [],
    editable : true,
    sourceInfo : {},
    sourceConfig : {},

    initComponent : function() {
        var me = this;

        Ext.apply(this, {
            stripeRows : true,
            clicksToEdit : 2,
            source : this.source,
            listeners : {
                'beforeedit' : function(editor, e, eOpts) {
                    if ((!me.editable ) || e.record.data.name in _SM.objConv(me.readOnlyProps)) {
                        return false;
                    }
                },
                'itemmouseenter' : function(view, record, item) {
                    var prpName = record.get('name'), msg = me.sourceInfo[prpName];
                    if (prpName && prpName in _SM.objConv(me.readOnlyProps)) {
                        prpName += ' [RO]';
                    }
                    if (msg) {
                        Ext.fly(item).set({
                            'data-qtip' : msg,
                            'data-qtitle' : prpName
                        });
                    }
                },
                scope : me
            }
        });

        this.callParent(arguments);
    },

    setCombos : function(__ptCombos) {
        var prp, l1, cbStore, cbEditor, cbField = 'cbValue', stData;

        if (!__ptCombos) {
            return;
        }

        // Recorre los objetos y busca la definicion de combos
        for (prp in __ptCombos ) {

            l1 = __ptCombos[prp];
            stData = [];
            for ( i = 0; i < l1.length; i++) {
                stData.push({
                    'cbValue' : l1[i]
                });
            }

            // Si ya existe continua ( los objetos no deben tener el mismo nombre )
            if (this.sourceConfig[prp] || _SM.typeOf(l1) !== 'array') {
                continue;
            }

            cbStore = Ext.create('Ext.data.Store', {
                fields : [cbField],
                data : stData
            });

            // Create the combo box, attached to the states data store
            cbEditor = Ext.create('Ext.form.ComboBox', {
                store : cbStore,
                editable : false,
                queryMode : 'local',
                displayField : cbField,
                valueField : cbField
            });

            this.sourceConfig[prp] = {
                editor : cbEditor
            };

        }

    },

    setTypes : function(__ptTypes) {
        var prp, myType, myEditor;
        if (!__ptTypes) {
            return;
        }

        // La idea es generar un customEditor para los campos definidos,
        // copiando el editor que define por defecto el objeto
        // Debe definirse despues de los combos pues la definicion de combo resetea customEditor

        // Recorre los objetos y busca la definicion de typo
        for (prp in __ptTypes ) {

            // Si ya existe continua
            if (this.sourceConfig[prp]) {
                continue;
            }
            // Los tipos definidos son :  'date','string', 'number', 'boolean'
            myType = __ptTypes[prp];
            myEditor = this.editors[myType];
            if (myEditor) {
                this.sourceConfig[prp] = myEditor;
            }
        }
    }
});