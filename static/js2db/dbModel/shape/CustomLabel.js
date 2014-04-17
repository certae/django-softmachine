dbModel.shape.CustomLabel = draw2d.shape.basic.Label.extend({
    
    init: function(text) {
        this._super(text);
        this.contextMenuListeners = new draw2d.util.ArrayList();
    },
    
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