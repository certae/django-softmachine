/**
 * @method
 * Factory method to provide a default connection for all drag&drop connections. You
 * can override this method and customize this for your personal purpose.
 *
 * @param {draw2d.Port} sourcePort port of the source of the connection
 * @param {draw2d.Port} targetPort port of the target of the connection
 * @template
 * @returns {dbModel.shape.TableConnection}
 */
draw2d.Connection.createConnection = function(sourcePort, targetPort, callback) {
    var conn = new dbModel.shape.TableConnection();
    var labelSource = sourcePort.getParent().header.getChildren().data[0];
    var labelTarget = targetPort.getParent().header.getChildren().data[0];
    conn.label.setText(labelSource.getText() + "_" + labelTarget.getText());
    conn.isNew = true;

    return conn;
};

dbModel.shape.DBTable = draw2d.shape.layout.VerticalLayout.extend({

    NAME: "dbModel.shape.DBTable",

    init: function() {
        this._super();

        // just some color attributes for the rendering/gradient
        this.setBackgroundColor("#dbddde");
        this.setColor("#d7d7d7");
        this.setStroke(1);
        this.setRadius(3);

        this.attributes = new draw2d.util.ArrayList();
        this.header = new draw2d.shape.layout.VerticalLayout();

        this.classLabel = this.createLabel("TableName").setPadding(10).setFontColor("#5856d6");
        this.header.addFigure(this.classLabel);

        this.header.setStroke(0).setRadius(this.getRadius());
        this.header.setBackgroundColor("#f7f7f7");

        this.addFigure(this.header);

        this.contextMenuListeners = new draw2d.util.ArrayList();
        this.onDropConnectionListeners = new draw2d.util.ArrayList();
        this.newConnector = null;
    },

    addAttribute: function(index, entity) {
        var label = new dbModel.shape.CustomLabel(entity.text);
        label.setStroke(0);
        label.setBold(entity.pk);
        if (entity.pk) {
            label.setCssClass('primary_key');
        }
        label.setRadius(0);
        label.setBackgroundColor(null);
        label.setPadding(5);
        label.setFontColor("#4a4a4a");
        label.addContextMenuListener(this);

        this.addFigure(label);

        this.attributes.add(label);
        return label;
    },

    removeFigure: function(figure) {
        this._super(figure);
        this.attributes.remove(figure);

        return this;
    },

    /**
     * @method
     * help method to create some labels
     *
     * @param {String} txt the label to display
     * @returns {draw2d.shape.basic.Label}
     */
    createLabel: function(txt) {
        var label = new dbModel.shape.CustomLabel(txt);
        label.setStroke(0);
        label.setRadius(0);
        label.setBackgroundColor(null);
        label.setPadding(5);
        label.addContextMenuListener(this);

        return label;
    },

    setName: function(name) {
        this.classLabel.setText(name);
    },

	getNewConnector: function() {
        return this.newConnector;
    },
    
    setNewConnector: function(connector) {
        this.newConnector = connector;
    },

    createCustomizedPort: function(type, name, position) {
        var newPort = null;
        switch(type) {
            case "draw2d_InputPort":
                newPort = new draw2d.InputPort();
                newPort.onConnect = function(connection) {
                    if (connection.isNew) {
                        var table = this.getParent();
                        table.setNewConnector(connection);
						connection.isNew = false;
                    }
                };
                newPort.onDragLeave = function(figure) {
                    this._super = function(figure) {
                        if (!( figure instanceof draw2d.Port)) {
                            return;
                        }
                    };
                    if ( figure instanceof draw2d.OutputPort) {
                        this._super(figure);
                    } else if ( figure instanceof draw2d.HybridPort) {
                        this._super(figure);
                    }
                    var table = this.getParent();
                    table.onDropConnection(table.getNewConnector());
                    table.setNewConnector(null);
                };
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

        var locator;
        switch(position) {
            case "default":
                break;
            case "right":
                locator = new dbModel.locator.PortRightLocator(this);
                break;
            case "left":
                locator = new dbModel.locator.PortLeftLocator(this);
                break;
            case "top":
                locator = new draw2d.layout.locator.TopLocator(this);
                break;
            case "bottom":
                locator = new draw2d.layout.locator.BottomLocator(this);
                break;
            default:
                throw "Unknown position [" + position + "] of port requested";
        }

        var userData = [];
        userData.push({
            position: position
        });
        newPort.setUserData(userData);
        newPort.setName(name);

        this.addPort(newPort, locator);
        // relayout the ports
        this.setDimension(this.width, this.height);

        this.layoutPorts();
        return newPort;
    },

    /**
     * @method
     * Return an objects with all important attributes for XML or JSON serialization
     *
     * @returns {Object}
     */
    getPersistentAttributes: function() {
        var memento = this._super();

        if (this.header.getChildren().size > 0) {
            memento.tableName = this.header.getChildren().data[0].getText();
        }

        memento.tablePorts = [];
        this.getPorts().each(function(index, port) {
            var pos;
            var userData = port.getUserData();
            if (userData !== null) {
                pos = userData[userData.length - 1];
            }
            if ( typeof pos === "undefined") {
                pos = "default";
            } else {
                pos = pos.position;
            }
            memento.tablePorts.push({
                type: port.getCssClass(),
                name: port.getName(),
                position: pos
            });
        });

        memento.attributes = [];
        this.attributes.each(function(i, e) {
            memento.attributes.push({
                text: e.getText(),
                id: e.id,
                datatype: e.datatype,
                pk: e.pk,
                fk: e.fk,
                isRequired: e.isRequired,
                isNullable: e.isNullable
            });
        });

        return memento;
    },

	updateHeader: function(memento){
		this.header.resetChildren();

        if ( typeof memento.tableName !== "undefined") {
            var label = this.createLabel(memento.tableName).setPadding(10).setFontColor("#5856d6");
            this.header.addFigure(label);
        }	
	},
	
	updateAttributes: function(memento) {
        if ( typeof memento.attributes !== "undefined") {
            $.each(memento.attributes, $.proxy(function(i, e) {
                var entity = this.addAttribute(i, e);
                entity.id = e.id;
                entity.datatype = e.datatype;
                entity.pk = e.pk;
                entity.fk = e.fk;
                entity.isRequired = e.isRequired;
                entity.isNullable = e.isNullable;
            }, this));
        }
    },
    /**
     * @method
     * Read all attributes from the serialized properties and transfer them into the shape.
     *
     * @param {Object} memento
     * @return
     */
    setPersistentAttributes: function(memento) {
        this._super(memento);

        this.updateHeader(memento);

        if ( typeof memento.tablePorts !== "undefined") {
            $.each(memento.tablePorts, $.proxy(function(index, item) {
                this.createCustomizedPort(item.type, item.name, item.position);
            }, this));
        }

        this.updateAttributes(memento);

        return this;
    },

    onContextMenu: function(figure, x, y) {
        var me = this;
        me.contextMenuListeners.each(function(i, w) {
            w.onContextMenu(figure, x, y);
        });
    },

    addContextMenuListener: function(w) {
        if (w !== null) {
            if ( typeof w === "function") {
                this.contextMenuListeners.add({
                    onContextMenu: w
                });
            } else if ( typeof w.onContextMenu === "function") {
                this.contextMenuListeners.add(w);
            } else {
                throw "Object doesn't implement required callback method [onContextMenu]";
            }
        }
    },

    addOnDropConnectionListener: function(w) {
        if (w !== null) {
            if ( typeof w === "function") {
                this.onDropConnectionListeners.add({
                    onDropConnection: w
                });
            } else if ( typeof w.onDropConnection === "function") {
                this.onDropConnectionListeners.add(w);
            } else {
                throw "Object doesn't implement required callback method [onDropConnection]";
            }
        }
    },

    onDropConnection: function(connection) {
        var me = this;
        me.onDropConnectionListeners.each(function(i, w) {
            w.onDropConnection(connection, me);
        });
    },
    /**
     * @method
     * unregister the listener from the connection.
     *
     * @param {Object/Function} w The object which will be removed from the selection eventing
     **/
    removeContextMenuListener: function(/*:Object*/w) {
        this.contextMenuListeners = this.contextMenuListeners.grep(function(listener) {
            return listener !== w && listener.onContextMenu !== w;
        });
    }
});
