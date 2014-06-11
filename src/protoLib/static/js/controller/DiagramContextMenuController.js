Ext.define('ProtoUL.controller.DiagramContextMenuController', {
    extend: 'Ext.app.Controller',

	
    refs: [{
        ref: 'diagramCanvas',
        selector: '#contentPanel'
    }, {
        ref: 'tableContextMenu',
        selector: '#tablecontextmenu'
    }],

    getTableFromContextMenu: function(button) {
        var tableContextMenu = button.ownerCt;
        var table;
        if (tableContextMenu.figure.getParent().getCssClass() === "draw2d_shape_layout_VerticalLayout") {
            table = tableContextMenu.figure.getParent().getParent();
        } else {
            table = tableContextMenu.figure.getParent();
        }
        tableContextMenu.close();

        return table;
    },

    createPort: function(type, position) {
        var newPort = null;
        switch(type) {
            case "draw2d_InputPort":
                newPort = new draw2d.InputPort();
                break;
            case "draw2d_OutputPort":
                newPort = new draw2d.OutputPort();
                break;
            case "draw2d_HybridPort":
                newPort = new draw2d.HybridPort();
                break;
            default:
                throw "Unknown type [" + type + "] of port requested";
        }
        var userData = [];
        userData.push({
            position: position
        });
        newPort.setUserData(userData);

        return newPort;
    },
    
    addConnectorRecursive: function(button, e, eOpts) {
        var table = this.getTableFromContextMenu(button);
        if (table.hybridPorts.getSize() === 0) {
            var newPort = this.createPort('draw2d_HybridPort', 'bottom');
            newPort.setName("hybrid" + table.hybridPorts.getSize());
            table.addPort(newPort, new draw2d.layout.locator.BottomLocator(table));

            var inputPort = this.createPort('draw2d_InputPort', 'left');
            inputPort.setName("input" + table.inputPorts.getSize());
            table.addPort(inputPort, new dbModel.locator.PortLeftLocator(table));
            table.layoutPorts();

            var conn = new dbModel.shape.TableConnection();
            conn.setSource(newPort);
            conn.setTarget(inputPort);
            
            var diagramController = this.application.controllers.get('DiagramController');
            diagramController.onDropConnection(conn, table);

            table.getCanvas().addFigure(conn);

            this.application.controllers.get('DiagramController').enableToolbarButton('btSaveDiagram');
        }
    },

    addInputPort: function(button, e, eOpts) {
        var table = this.getTableFromContextMenu(button);
        var diagramController = this.application.controllers.get('DiagramController');

        var positions = Ext.create('ProtoUL.store.PortPositions');
        var options = {
            label: 'Position du port',
            store: positions,
            userData: {controller: diagramController, table: table}
        };
        _SM.ComboBoxPrompt.prompt('Nouveau port', options, function(btn, text, cfg) {
            if (btn == 'ok') {
            	controller = cfg.userData.controller;
				table = cfg.userData.table;
				
				name = "input" + table.inputPorts.getSize();
				table.createCustomizedPort('draw2d_InputPort', name, text);

				controller.enableToolbarButton('btSaveDiagram');
            }
        });
    },

    addOutputPort: function(button, e, eOpts) {
        var table = this.getTableFromContextMenu(button);
        var diagramController = this.application.controllers.get('DiagramController');
		
		var positions = Ext.create('ProtoUL.store.PortPositions');
        var options = {
            label: 'Position du port',
            store: positions,
            userData: {controller: diagramController, table: table}
        };
        _SM.ComboBoxPrompt.prompt('Nouveau port', options, function(btn, text, cfg) {
            if (btn == 'ok') {
            	controller = cfg.userData.controller;
				table = cfg.userData.table;
				
				name = "output" + table.outputPorts.getSize();
				table.createCustomizedPort('draw2d_OutputPort', name, text);

				controller.enableToolbarButton('btSaveDiagram');
            }
        });
    },

    removeUnusedPorts: function(button, e, eOpts) {
        var table = this.getTableFromContextMenu(button);
        table.getPorts().each(function(i, port) {
            if (port.getConnections().size < 1) {
                table.removePort(port);
            }
        });
        table.layoutPorts();
        table.cachedPorts = null;

        this.application.controllers.get('DiagramController').enableToolbarButton('btSaveDiagram');
    },

    init: function(application) {
        this.control({
            "#btAddConnectorRecursive": {
                click: this.addConnectorRecursive
            },
            "#btAddInputPort": {
                click: this.addInputPort
            },
            "#btAddOutputPort": {
                click: this.addOutputPort
            },
            "#btRemoveUnusedPorts": {
                click: this.removeUnusedPorts
            }
        });
    }
});
