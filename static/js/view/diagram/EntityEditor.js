
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
    width: 345,
    bodyPadding: 10,
    title: 'Detail',
    autoScroll: true,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
            	{
            		xtype: 'protoProperty'
            	},
            	{
					xtype: 'fieldset'
				},
                {
                    xtype: 'entityattributes',
					height: 280
                }
            ]
        });

		this.dockedItems = [{
            xtype: 'toolbar',
            items: [{
                iconCls: 'menu_reload',
                itemId: 'btSaveTable',
                text: 'Update diagram',
                action: 'savetable'
            }]
        }];
        
        me.callParent(arguments);
    },
    
    getFigureFromJSONData : function(jsonData, figureId) {
		for (var i = 0; i < jsonData.length; i++) {
			if (jsonData[i].id === figureId) {
				return jsonData[i];
			}
		}
	},
	
    onSelectionChanged : function(figure){
		if (figure !== null) {
			this.figure = figure;
			if (figure.cssClass === 'dbModel_shape_DBTable' || figure.cssClass === 'DBTable') {
				this.expand();
				
				var masterRecord = this.getComponent('protoProperty');
				
				var gridDetail = this.getComponent('entityattributes');
				
				var writer = new draw2d.io.json.Writer();
				var canvas = this.ownerCt.getComponent('contentPanel');
				var jsonData = "";
			    writer.marshal(canvas.view, function(json){
					jsonData = json;
			    });
				var myObj = this.getFigureFromJSONData(jsonData, figure.id);
	    		
	    		if (typeof myObj !== 'undefined'){
					masterRecord.setSource(myObj);
					gridDetail.getStore().loadRawData(myObj.attributes);
				}
			} else {
				this.collapse();
			}
		}
	},
	
	stackChanged:function(event) {
		var canvas = this.ownerCt.getComponent('contentPanel');
		if(event.isPostChangeEvent()){
			if (typeof this.figure !== 'undefined'){
				var masterRecord = this.getComponent('protoProperty');
					
				var gridDetail = this.getComponent('entityattributes');
				
				var writer = new draw2d.io.json.Writer();
				var canvas = this.ownerCt.getComponent('contentPanel');
				var jsonData = "";
				writer.marshal(canvas.view, function(json){
					jsonData = json;
				});
				var myObj = this.getFigureFromJSONData(jsonData, this.figure.id);
				
				if (typeof myObj !== 'undefined'){
					masterRecord.setSource(myObj);
					gridDetail.getStore().loadRawData(myObj.attributes);
				}
			}
			if (event.command.label==="Connecting Ports"){
				event.command.connection.addContextMenuListener(canvas);
			}
		}
		if(event.isPreChangeEvent()){
			if (event.command.label==="Add Shape") {
				event.command.figure.addContextMenuListener(canvas);
			}
		}
	}

});