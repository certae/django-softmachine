/**
 * @class TableConnection
 *
 * A simple Connection with a context menu.
 *
 * @author Giovanni Victorette
 * @extend draw2d.Connection
 */
dbModel.shape.TableConnection = draw2d.Connection.extend({
    NAME: "dbModel.shape.TableConnection",

    init: function() {
        this._super();
        this.setRouter(new draw2d.layout.connection.InteractiveManhattanConnectionRouter());

        this.setColor("#5bcaff");
        this.setStroke(2);

        this.label = this.createLabel("New connection");
        // add the new decoration to the connection with a position locator.
        this.addFigure(this.label, new draw2d.layout.locator.ManhattanMidpointLocator(this));

        this.inputCardinality = this.createLabel("1,1");
        this.addFigure(this.inputCardinality, new dbModel.shape.ManhattanRightConnectionLocator(this));
        this.outputCardinality = this.createLabel("0,N");
        this.addFigure(this.outputCardinality, new dbModel.shape.ManhattanLeftConnectionLocator(this));

        this.setUserData({
            "isPrimary": false
        });

        this.contextMenuListeners = new draw2d.util.ArrayList();
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
        label.setFontColor("#0d0d0d");

        return label;
    },

    getConnectionName: function() {
        return this.label.getText();
    },

    /**
     * @method
     * Return an objects with all important attributes for XML or JSON serialization
     *
     * @returns {Object}
     */
    getPersistentAttributes: function() {
        var memento = this._super();
        memento.name = this.label.getText();
        return memento;
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

        if ( typeof memento.name !== "undefined") {
            this.resetChildren();
            // Create any Draw2D figure as decoration for the connection
            //
            this.label = new draw2d.shape.basic.Label(memento.name);
            this.label.setStroke(0);
            this.label.setFontColor("#0d0d0d");

            this.inputCardinality = this.createLabel("1,1");
            if (memento.userData.isPrimary) {
                this.inputCardinality.setCssClass('primary_key');
            }
            this.addFigure(this.inputCardinality, new dbModel.shape.ManhattanRightConnectionLocator(this));
            this.outputCardinality = this.createLabel("0,N");
            this.addFigure(this.outputCardinality, new dbModel.shape.ManhattanLeftConnectionLocator(this));

            // add the new decoration to the connection with a position locator.
            //
            this.addFigure(this.label, new draw2d.layout.locator.ManhattanMidpointLocator(this));

            // Set the endpoint decorations for the connection
            if (memento.userData.useDecorators) {
                this.setSourceDecorator(new draw2d.decoration.connection.BarDecorator());
                this.setTargetDecorator(new draw2d.decoration.connection.DiamondDecorator());
            }
        }

        return this;
    },
    /**
     * @method
     * called by the framework if the figure should show the contextmenu.</br>
     * The strategy to show the context menu depends on the plattform. Either loooong press or
     * right click with the mouse.
     *
     * @param {Number} x the x-coordinate to show the menu
     * @param {Number} y the y-coordinate to show the menu
     * @since 1.1.0
     */
    onContextMenu: function(x, y) {
        var me = this;
        me.contextMenuListeners.each(function(i, w) {
            w.onContextMenu(me, x, y);
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