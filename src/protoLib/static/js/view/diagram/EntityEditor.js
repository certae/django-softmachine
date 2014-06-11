Ext.define('ProtoUL.view.diagram.EntityEditor', {
    extend: 'Ext.form.Panel',
    alias: 'widget.entityeditor',

    requires: ['ProtoUL.view.diagram.EntityAttributes', 'Ext.form.FieldSet', 'Ext.form.field.Text', 'Ext.grid.Panel'],

    itemId: 'entityeditor',
    width: 370,
    bodyPadding: 10,
    title: 'Detail',
    autoScroll: true,

    initComponent: function() {
        var me = this;

		if (!me.fieldPicker) {
	        me.fieldPicker = Ext.create('Ext.form.field.Picker', {
	            id: 'colorpicker',
	            createPicker: function() {
	                return Ext.create('Ext.picker.Color', {
	                    resizable: true,
	                    floating: true,
	                    select: function(selColor) {
	                        var editor = Ext.getCmp('colorpicker');
	                        editor.setValue("#" + selColor);
	                        editor.setFieldStyle('background-color:' + editor.getValue() + ' ;background-image: none;');
	                        editor.collapse();
	                    }
	                });
	            },
				listeners: {
					focus: function(obj, event, eOpts) {
						obj.setFieldStyle('background-color:' + obj.getValue() + ' ;background-image: none;');
					}
				}
	        });
		}
        Ext.applyIf(me, {
            items: [{
                xtype: 'propertygrid',
                itemId: 'protoProperty',
                sourceConfig: {
                    tableName: {
                        displayName: '<strong>' + _SM.__language.Label_Table_Name + '</strong>'
                    },
                    isPrimary: {
                        displayName: _SM.__language.Label_Dependency
                    },
                    name: {
                        displayName: '<strong>' + _SM.__language.Label_Connector_Name + '</strong>'
                    },
                    color: {
                        displayName: 'Couleur', //Couleur de la bordure
                        editor: me.fieldPicker
                    },
                    alpha: {
                    	displayName: 'Transparence'
                    }
                },
                listeners: {
                    propertychange: function(source, recordId, value, oldValue, eOpts) {
                        var form = this.up('form');
                        var btSaveTable = form.getDockedItems('toolbar[dock="top"]')[0].getComponent('btSaveTable');
                        btSaveTable.fireEvent('click');
                    }
                }
            }, {
                xtype: 'fieldset'
            }, {
                xtype: 'entityattributes',
                title: _SM.__language.Title_Attributes,
                height: 280
            }]
        });

        this.dockedItems = [{
            xtype: 'toolbar',
            hidden: true,
            items: [{
                iconCls: 'menu_reload',
                itemId: 'btSaveTable',
                text: _SM.__language.Text_UpdateDiagram_Button,
                action: 'savetable'
            }]
        }];

        me.callParent(arguments);
    }
});
