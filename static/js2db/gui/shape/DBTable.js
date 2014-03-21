/**
 * @method
 * Factory method to provide a default connection for all drag&drop connections. You
 * can override this method and customize this for your personal purpose.
 *
 * @param {draw2d.Port} sourcePort port of the source of the connection
 * @param {draw2d.Port} targetPort port of the target of the connection
 * @template
 * @returns {draw2d.Connection}
 */
draw2d.Connection.createConnection = function(sourcePort, targetPort) {
    var conn = new dbModel.shape.TableConnection();//draw2d.Connection();
    // conn.setColor("#5bcaff");
    // conn.setStroke(2);
    
    // Set the endpoint decorations for the connection
    //
    // conn.setSourceDecorator(new draw2d.decoration.connection.BarDecorator());
    // conn.setTargetDecorator(new draw2d.decoration.connection.DiamondDecorator());
    
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

        this.classLabel = this.createLabel("TableName").setPadding(10).setFontColor("#4a4a4a");
        this.header.addFigure(this.classLabel);
        this.stereotypeLabel = this.createLabel("<<Stereotype>>").setFontColor("#5856d6");
        this.header.addFigure(this.stereotypeLabel);

        this.header.setStroke(0).setRadius(this.getRadius());
        this.header.setBackgroundColor("#f7f7f7");

		// this.header.createPort("input");
        // this.header.createPort("output");
        // this.header.createPort("hybrid", new draw2d.layout.locator.TopLocator(this.header));
        
        this.addFigure(this.header);
        
        // this.createPort("hybrid", new draw2d.layout.locator.TopLocator(this.header));
        
        this.contextMenuListeners = new draw2d.util.ArrayList();
    },

    addAttribute: function(index, entity) {
        var label = new dbModel.shape.CustomLabel(entity.text);
        label.setStroke(0);
        label.setRadius(0);
        label.setBackgroundColor(null);
        label.setPadding(5);
        label.setFontColor("#4a4a4a");

        label.createPort("input");
        label.inputPorts.data[0].name = "input" + index;

        label.createPort("output");
        label.outputPorts.data[0].name = "output" + index;

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

    /**
     * @method
     * Return an objects with all important attributes for XML or JSON serialization
     *
     * @returns {Object}
     */
    getPersistentAttributes: function() {
        var memento = this._super();
        // memento.tableName = this.classLabel.text;
        // memento.stereotypeName = this.stereotypeLabel.text;
        memento.header = [];
        memento.tablePorts = [];
        memento.attributes = [];

        this.attributes.each(function(i, e) {
            memento.attributes.push({
                text: e.getText(),
                id: e.id,
                inputPort: e.getInputPorts().data[0].name,
                datatype: e.datatype,
                pk: e.pk,
                unique: e.unique
            });
        });

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

        this.header.resetChildren();
        
		if ( typeof memento.header !== "undefined") {
			$.each(memento.header, $.proxy(function(index, item) {
				var label = this.createLabel(item.text).setPadding(10).setFontColor("#4a4a4a");
				this.header.addFigure(label);
			}, this));
		}
		
        if ( typeof memento.attributes !== "undefined") {
            $.each(memento.attributes, $.proxy(function(i, e) {
                var entity = this.addAttribute(i, e);
                entity.id = e.id;
                entity.datatype = e.datatype;
                entity.pk = e.pk;
                entity.unique = e.unique;
            }, this));
        }

        return this;
    },
    
    onContextMenu: function(figure, x, y) {
    	var me = this;
        me.contextMenuListeners.each(function(i, w) {
            w.onContextMenu(figure, x, y);
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
