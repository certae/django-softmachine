/**
 * @author Giovanni Victorette
 */

Ext.define('ProtoUL.view.diagram.TableContextMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.tablecontextmenu',

    figure: null,

    itemId: 'tablecontextmenu',
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                text: 'Add recursive association',
                handler: function() {
                    if ( typeof this.ownerCt.figure.getParent().getParent() !== "undefined") {
                        var table;
                        if (this.ownerCt.figure.getParent().getCssClass() === "draw2d_shape_layout_VerticalLayout") {
                            table = this.ownerCt.figure.getParent().getParent();
                        } else {
                            table = this.ownerCt.figure.getParent();
                        }
                        if (table.hybridPorts.getSize() === 0) {
                            var newPort = new draw2d.HybridPort();
                            var userData = [];
							userData.push({
								position: "bottom"
							});
							newPort.setUserData(userData);
                            newPort.setName("hybrid" + table.hybridPorts.getSize());
                            table.addPort(newPort, new draw2d.layout.locator.BottomLocator(table));
                            
                            var inputPort = new draw2d.InputPort();
	                        userData = [];
	                        userData.push({
	                            position: "default"
	                        });
	                        inputPort.setUserData(userData);
	                        inputPort.setName("input" + table.inputPorts.getSize());
	                        table.addPort(inputPort);
	                        table.layoutPorts();
                            
                            var conn = new dbModel.shape.TableConnection();
							conn.setSource(newPort);
							conn.setTarget(inputPort);
							conn.setSourceDecorator(new draw2d.decoration.connection.BarDecorator());
    						conn.setTargetDecorator(new draw2d.decoration.connection.DiamondDecorator());
	
							table.getCanvas().addFigure(conn);
                        }
                    }
                }
            }, {
                text: 'Add input port',
                handler: function() {
                    if ( typeof this.ownerCt.figure.getParent() !== "undefined") {
                        var table;
                        if (this.ownerCt.figure.getParent().getCssClass() === "draw2d_shape_layout_VerticalLayout") {
                            table = this.ownerCt.figure.getParent().getParent();
                        } else {
                            table = this.ownerCt.figure.getParent();
                        }
                        var newPort = new draw2d.InputPort();
                        var userData = [];
                        userData.push({
                            position: "default"
                        });
                        newPort.setUserData(userData);
                        newPort.setName("input" + table.inputPorts.getSize());
                        table.addPort(newPort);
                        table.layoutPorts();
                    }
                }
            }, {
            	text: 'Add output port',
                handler: function() {
                    if ( typeof this.ownerCt.figure.getParent() !== "undefined") {
                        var table;
                        if (this.ownerCt.figure.getParent().getCssClass() === "draw2d_shape_layout_VerticalLayout") {
                            table = this.ownerCt.figure.getParent().getParent();
                        } else {
                            table = this.ownerCt.figure.getParent();
                        }
                        var newPort = new draw2d.OutputPort();
                        var userData = [];
                        userData.push({
                            position: "default"
                        });
                        newPort.setUserData(userData);
                        newPort.setName("output" + table.inputPorts.getSize());
                        table.addPort(newPort);
                        table.layoutPorts();
                    }
                }
            }, {
                text: 'Remove unused ports',
                handler: function() {
                    if ( typeof this.ownerCt.figure.getParent() !== "undefined") {
                        var table;
                        if (this.ownerCt.figure.getParent().getCssClass() === "draw2d_shape_layout_VerticalLayout") {
                            table = this.ownerCt.figure.getParent().getParent();
                        } else {
                            table = this.ownerCt.figure.getParent();
                        }
                        table.getPorts().each(function(i, port) {
                            if (port.getConnections().size < 1) {
                                table.removePort(port);
                            }
                        });
                        table.layoutPorts();
                    }
                }
            }]
        });
        me.callParent(arguments);
    },

    getFigure: function() {
        return this.figure;
    }
});
