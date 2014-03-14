
Ext.define('ProtoUL.view.diagram.EntityEditor', {
    extend: 'Ext.form.Panel',
    alias: 'widget.entityeditor',

    requires: [
        'ProtoUL.view.diagram.EntityAttributes',
        'Ext.form.FieldSet',
        'Ext.form.field.Text',
        'Ext.grid.Panel'
    ],

    itemId: 'entityeditor',
    width: 330,
    bodyPadding: 10,
    title: 'Detail',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'fieldset',
                    title: 'Table detail',
                    items: [
                        {
                            xtype: 'textfield',
                            anchor: '100%',
                            itemId: 'tableName',
                            fieldLabel: 'Table name',
                            name: 'tableName'
                        },
                        {
                            xtype: 'textfield',
                            anchor: '100%',
                            itemId: 'tableStereotype',
                            fieldLabel: 'Stereotype'
                        }
                    ]
                },
                {
                    xtype: 'entityattributes'
                }
            ]
        });

        me.callParent(arguments);
    },
    
    onSelectionChanged : function(figure){
		console.log('Image : ', figure);
		if (figure !== null) {
			var tableName = Ext.ComponentQuery.query('field[itemId=tableName]')[0];
			var tableStereotype = Ext.ComponentQuery.query('field[itemId=tableStereotype]')[0];
			
			if (figure.cssClass === 'dbModel_shape_DBTable' || figure.cssClass === 'DBTable') {
				this.expand();
				
				tableName.setValue(figure.classLabel.text);
				tableStereotype.setValue(figure.stereotypeLabel.text);
				
				var masterRecord = "test";
				var gridDetail = this.getComponent('entityattributes');
				
				// gridDetail.getStore().loadRawData(figure.entities['items']);
			} else {
				tableName.setValue(null);
				tableStereotype.setValue(null);
				this.collapse();
			}
		}
	}

});