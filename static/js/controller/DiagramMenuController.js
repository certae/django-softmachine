Ext.define('ProtoUL.controller.DiagramMenuController', {
    extend: 'Ext.app.Controller',

    refs: [
        {
            ref: 'diagramCanvas',
            selector: '#contentPanel'
        },
        {
            ref: 'diagramToolbar',
            selector: '#diagramtoolbar'
        }
    ],

	updateJsonDocument: function() {
		var writer = new draw2d.io.json.Writer();
		writer.marshal(this.getDiagramCanvas().getView(), function(json){
			jsonDocument = json;
		});
	},
	
	addOrUpdateJSONDocument : function(data) {
		var isAdd = true;
		for (var i = 0; i < jsonDocument.length; i++) {
			if (jsonDocument[i].id === data.id) {
				jsonDocument[i] = data;
				isAdd = false;
			}
		}
		if (isAdd) {
			jsonDocument.push(data);
		}
	},
	
	enableToolbarButton: function(button) {
		var toolbarButton = this.getDiagramToolbar().getComponent(button);
		toolbarButton.setDisabled(false);
	},
	
	onSearchMenuClick: function (menu, item, e, opt) {
        var controller = this;
        switch(item.itemId) {
        	case 'getAllTables':
        		Ext.Ajax.request({
				    url: _SM._PConfig.urlGetTableJSONDiagram,
				    params: {
				        id: 1
				    },
				    success: function(response){
				        var text = response.responseText;
						var outcome = Ext.JSON.decode(text);
						for(var i = 0; i < outcome.tables.length; i += 1) {
							controller.addOrUpdateJSONDocument(outcome.tables[i]);
						}
						for(var i = 0; i < outcome.connectors.length; i += 1) {
							controller.addOrUpdateJSONDocument(outcome.connectors[i]);
						}
						controller.getDiagramCanvas().reload();
				    }
				});
        		break;
            case 'getJSONTable':
            	Ext.Ajax.request({
				    url: _SM._PConfig.urlGetTableJSONDiagram,
				    params: {
				        id: 1
				    },
				    success: function(response){
				        var text = response.responseText;
						var outcome = Ext.JSON.decode(text);
				    }
				});
                break;
            default:
                break;
        }
    },
    
    init: function(application) {
        this.control({
			'#SearchMenu': {
                click: this.onSearchMenuClick
            }
        });
    }
    
});
