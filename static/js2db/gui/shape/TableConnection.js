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
        //this.setRouter(new draw2d.layout.connection.InteractiveManhattanConnectionRouter());
        this.setRouter(new draw2d.layout.connection.ManhattanBridgedConnectionRouter());
        //this.setOutlineStroke(1);
        //this.setOutlineColor("#303030");

        this.setColor("#5bcaff");
        this.setStroke(2);
        
        // Set the endpoint decorations for the connection
        this.setSourceDecorator(new draw2d.decoration.connection.BarDecorator());
    	this.setTargetDecorator(new draw2d.decoration.connection.DiamondDecorator());
    
        this.contextMenuListeners = new draw2d.util.ArrayList();
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
    	me.contextMenuListeners.each(function(i,w){
            w.onContextMenu(me, x, y);
        });
    },
    
    addContextMenuListener:function(w)
    {
      if(w!==null)
      {
        if(typeof w ==="function"){
          this.contextMenuListeners.add({onContextMenu: w});
        } 
        else if(typeof w.onContextMenu==="function"){
          this.contextMenuListeners.add(w);
        }
        else{
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
    removeContextMenuListener:function(/*:Object*/ w )
    {
      this.contextMenuListeners = this.contextMenuListeners.grep(function(listener){
          return listener !== w && listener.onContextMenu!==w;
      });
    }
});
