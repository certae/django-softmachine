/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.Connection
 * See the example:
 *
 *     @example preview small frame
 *     
 *     // create and add two nodes which contains Ports (In and OUT)
 *     //
 *     var start = new draw2d.shape.node.Start();
 *     var end   = new draw2d.shape.node.End();
        
 *     // ...add it to the canvas 
 *     canvas.addFigure( start, 50,50);
 *     canvas.addFigure( end, 230,80);
 *          
 *     // Create a Connection and connect the Start and End node
 *     //
 *     var c = new draw2d.Connection();
 *      
 *     // Set the endpoint decorations for the connection
 *     //
 *     c.setSourceDecorator(new draw2d.decoration.connection.BarDecorator());
 *     c.setTargetDecorator(new draw2d.decoration.connection.DiamondDecorator());   
 *     // Connect the endpoints with the start and end port
 *     //
 *     c.setSource(start.getOutputPort(0));
 *     c.setTarget(end.getInputPort(0));
 *           
 *     // and finally add the connection to the canvas
 *     canvas.addFigure(c);
 *     
 * Connections figures are used to display a line between two points. The Connection interface extends 
 * {@link draw2d.shape.basic.PolyLine PolyLine}.<br>
 * The source and target endpoints of a connection are each defined using a {@link draw2d.layout.anchor.ConnectionAnchor ConnectionAnchor}. 
 * These endpoints, along with any other points on the connection, are set by the connection's  {@link draw2d.layout.connection.ConnectionRouter ConnectionRouter}. 
 * <br>
 * Usually every connection in a drawing has the same router instance. Connections with 
 * common endpoints can share anchor instances as well.
 * 
 * <h2>Connection Usage</h2>
 * 
 * Connections are created and added just like any other figure. Unlike normal figures, you must not set the 
 * bounds of a connection. Instead, you must provide the source and target port and let the connection router 
 * calculate the connection's points. The connection then determines its own bounding box.<br>
 * <br>
 * A connection has a simple router by default - one that can connect the source and target anchors. But additional routers 
 * are available and can be set on the connection. Some routers can handle constraints for the connection. Note that when 
 * setting a routing constraint on a connection, you must first set the router which will use that constraint.<br>
 * <br>
 * 
 * <b>TODO:<br></b>
 * <i>
 * A convenient way to share the router with all connections and to place connections above the drawing is to use a 
 * ConnectionLayer. The layer has a connection router property which it shares with every child that's a connection. 
 * You can update this property and easily change every connection's router at once.
 * </i>
 * <br>
 * <br>
 * <h2>Routing and Anchors</h2>
 * A connection always has a router and it must set at least two ports on the connection: the source and target 
 * endpoints. By default, or when set to null, the connection's routing will be performed by an internal default router. 
 * The ends are placed with the help of {@link draw2d.layout.anchor.ConnectionAnchor anchors}. An 
 * {@link draw2d.layout.anchor.ConnectionAnchor anchors} is a fixed or calculated location, usually associated with some 
 * figure. For example, the {@link draw2d.layout.anchor.ChopboxConnectionAnchor ChopboxAnchor} finds the point at which a 
 * line going to the reference point intersects a box, such as the bounds of a figure. The reference point is either 
 * the anchor at the opposite end, or a bendpoint or some other point nearest to the anchor. 
 * <br>
 * {@img jsdoc_chopbox.gif ChopboxAnchor}
 * <br>
 * The router calculates the endpoints and any other points in the middle of the connection. It then sets the points on the 
 * connection by calling {@link draw2d.shape.basic.PolyLine#addPoint Polyline.addPoint}. The connection's existing point list 
 * can be reused to reduce garbage, but the points must be set on the connection anyway so that it knows about any changes made.
 * <br>
 * <h2>Adding Decorations and Children to Connections</h2>
 * Like most figures, Connection supports the addition of children. The children might be a label that 
 * decorate the connection. The placement of each type of decoration can vary, so a {@link draw2d.layout.locator.ConnectionLocator ConnectionLocator} 
 * is used to delegate to each child's constraint object, a Locator. <br>
 * <br>
 * {@link draw2d.decoration.connection.Decorator Decorator} can be used to create and render a rotatable shape at 
 * the end or start of a connection like arrows or boxes. Examples are {@link draw2d.decoration.connection.ArrowDecorator ArrowDecorator},  
 * {@link draw2d.decoration.connection.BarDecorator BarDecorator} or {@link draw2d.decoration.connection.CircleDecorator CircleDecorator}
 * <br>
 * <h2>Connection Layout</h2>
 * Connections extend the process of validation and layout to include routing. Since layout is the process of positioning children, routing must 
 * come first. This allows a child's locator to operate on the connection's newly-routed points.<br>
 * Check out [Class System Guide](#!/guide/class_system) for additional reading.
 * 
 * @inheritable
 * @author Andreas Herz
 * @extends draw2d.shape.basic.PolyLine
 */
draw2d.Connection = draw2d.shape.basic.PolyLine.extend({
    NAME : "draw2d.Connection",

    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     * @param {draw2d.layout.connection.ConnectionRouter} router The router to use for this connection
     */
    init: function( router) {
      this._super(router );
      
      this.sourcePort = null;
      this.targetPort = null;
    
      this.oldPoint=null;
      
      this.sourceDecorator = null; /*:draw2d.ConnectionDecorator*/
      this.targetDecorator = null; /*:draw2d.ConnectionDecorator*/
      
      // decoration of the polyline
      //
      this.sourceDecoratorNode = null;
      this.targetDecoratorNode=null;
      
      this.setColor("#1B1B1B");
      this.setStroke(1);
      
      this.isMoving=false;
   },
    

    /**
     * @private
     **/
    disconnect : function()
    {
        if (this.sourcePort !== null) {
            this.sourcePort.detachMoveListener(this);
            this.fireSourcePortRouteEvent();
        }

        if (this.targetPort !== null) {
            this.targetPort.detachMoveListener(this);
            this.fireTargetPortRouteEvent();
        }
    },
    
    
    /**
     * @private
     **/
    reconnect : function()
    {
        if (this.sourcePort !== null) {
            this.sourcePort.attachMoveListener(this);
            this.fireSourcePortRouteEvent();
        }

        if (this.targetPort !== null) {
            this.targetPort.attachMoveListener(this);
            this.fireTargetPortRouteEvent();
        }
        this.routingRequired =true;
        this.repaint();
    },
    
    
    /**
     * You can't drag&drop the resize handles of a connector.
     * @type boolean
     **/
    isResizeable : function()
    {
        return this.isDraggable();
    },
    
   
    /**
     * @method
     * Add a child figure to the Connection. The hands over figure doesn't support drag&drop 
     * operations. It's only a decorator for the connection.<br>
     * Mainly for labels or other fancy decorations :-)
     *
     * @param {draw2d.Figure} figure the figure to add as decoration to the connection.
     * @param {draw2d.layout.locator.ConnectionLocator} locator the locator for the child. 
    **/
    addFigure : function(child, locator)
    {
        // just to ensure the right interface for the locator.
        // The base class needs only 'draw2d.layout.locator.Locator'.
        if(!(locator instanceof draw2d.layout.locator.ConnectionLocator)){
           throw "Locator must implement the class draw2d.layout.locator.ConnectionLocator"; 
        }
        
        this._super(child, locator);
    },
    

    /**
     * @method
     * Set the ConnectionDecorator for this object.
     *
     * @param {draw2d.decoration.connection.Decorator} the new source decorator for the connection
     **/
    setSourceDecorator:function( decorator)
    {
      this.sourceDecorator = decorator;
      this.routingRequired = true;
      if(this.sourceDecoratorNode!==null){
          this.sourceDecoratorNode.remove();
          this.sourceDecoratorNode=null;
      }
      this.repaint();
    },
    
    /**
     * @method
     * Get the current source ConnectionDecorator for this object.
     *
     * @returns draw2d.decoration.connection.Decorator
     **/
    getSourceDecorator:function()
    {
      return this.sourceDecorator;
    },
    
    /**
     * @method
     * Set the ConnectionDecorator for this object.
     *
     * @param {draw2d.decoration.connection.Decorator} the new target decorator for the connection
     **/
    setTargetDecorator:function( decorator)
    {
      this.targetDecorator = decorator;
      this.routingRequired =true;
      if(this.targetDecoratorNode!==null){
          this.targetDecoratorNode.remove();
          this.targetDecoratorNode=null;
      }      
      this.repaint();
    },
    
    /**
     * @method
     * Get the current target ConnectionDecorator for this object.
     *
     * @returns draw2d.decoration.connection.Decorator
     **/
    getTargetDecorator:function()
    {
      return this.targetDecorator;
    },
    

    /**
     * @method
     * Calculate the path of the polyline.
     * 
     * @private
     */
    calculatePath: function()
    {
        
        if(this.sourcePort===null || this.targetPort===null){
            return;
        }
        
        this._super();
    },
    
    /**
     * @private
     **/
    repaint:function(attributes)
    {
      if(this.repaintBlocked===true || this.shape===null){
          return;
      }
      
      if(this.sourcePort===null || this.targetPort===null){
          return;
      }

      this._super(attributes);

	    // paint the decorator if any exists
	    //
        if(this.targetDecorator!==null && this.targetDecoratorNode===null){
	      	this.targetDecoratorNode= this.targetDecorator.paint(this.getCanvas().paper);
	    }
	
	    if(this.sourceDecorator!==null && this.sourceDecoratorNode===null){
	      	this.sourceDecoratorNode= this.sourceDecorator.paint(this.getCanvas().paper);
	    }

	    
	    // translate/transform the decorations to the end/start of the connection 
	    // and rotate them as well
	    //
	    if(this.sourceDecoratorNode!==null){
	    	var start = this.getPoints().get(0);
	  	    this.sourceDecoratorNode.transform("r"+this.getStartAngle()+"," + start.x + "," + start.y +" t" + start.x + "," + start.y);
	  	    // propagate the color and the opacity to the decoration as well
	  	    this.sourceDecoratorNode.attr({"stroke":"#"+this.lineColor.hex(), opacity:this.alpha});
            this.sourceDecoratorNode.forEach($.proxy(function(shape){
                shape.node.setAttribute("class",this.cssClass!==null?this.cssClass:"");
            },this));
	    }
	    
        if(this.targetDecoratorNode!==null){
	    	var end = this.getPoints().getLastElement();
            this.targetDecoratorNode.transform("r"+this.getEndAngle()+"," + end.x + "," + end.y+" t" + end.x + "," + end.y);
            this.targetDecoratorNode.attr({"stroke":"#"+this.lineColor.hex(), opacity:this.alpha});
            this.targetDecoratorNode.forEach($.proxy(function(shape){
                shape.node.setAttribute("class",this.cssClass!==null?this.cssClass:"");
            },this));
        }

    },
    
    /**
     * @method
     * The x-offset related to the canvas.
     * Didn't provided by a connection. Return always '0'. This is required
     * for children position calculation. (e.g. Label decoration)
     * 
     * @return {Number} the x-offset to the parent figure
     **/
    getAbsoluteX :function()
    {
        return 0;
    },


    /**
     * @method
     * The y-offset related to the canvas.
     * Didn't provided by a connection. Return always '0'. This is required
     * for children position calculation. (e.g. Label decoration)
     * 
     * @return {Number} The y-offset to the parent figure.
     **/
    getAbsoluteY :function()
    {
        return 0;
    },


    postProcess: function(postProcessCache)
    {
    	this.router.postProcess(this, this.getCanvas(), postProcessCache);
    },
    
    /**
     * @method
     * Called by the framework during drag&drop operations.
     * 
     * @param {draw2d.Figure} draggedFigure The figure which is currently dragging
     * 
     * @return {draw2d.Figure} the figure which should receive the drop event or null if the element didnt want a drop event
     * @template
     **/
    onDragEnter : function( draggedFigure )
    {
        if(draggedFigure instanceof draw2d.shape.basic.LineResizeHandle){
            return null;
        }
        
//    	this.setGlow(true);
    	
    	return this;
    },
 
    /**
     * @method
     * Called if the DragDrop object leaving the current hover figure.
     * 
     * @param {draw2d.Figure} draggedFigure The figure which is currently dragging
     * @template
     **/
    onDragLeave:function( draggedFigure )
    {
//    	this.setGlow(false);
    },


    /**
     * Return the recalculated position of the start point
     * 
     * @return draw2d.geo.Point
     **/
    getStartPoint:function()
     {
      if(this.isMoving===false){
         return this.sourcePort.getConnectionAnchorLocation(this.targetPort.getConnectionAnchorReferencePoint());
      }

      return this._super();
     },
    
    
    /**
     * Return the recalculated position of the start point
     *
     * @return draw2d.geo.Point
     **/
     getEndPoint:function()
     {
      if(this.isMoving===false){
         return this.targetPort.getConnectionAnchorLocation(this.sourcePort.getConnectionAnchorReferencePoint());
      }
      
      return this._super();
     },
    
    /**
     * @method
     * Set the new source port of this connection. This enforce a repaint of the connection.
     *
     * @param {draw2d.Port} port The new source port of this connection.
     * 
     **/
    setSource:function( port)
    {
      if(this.sourcePort!==null){
        this.sourcePort.detachMoveListener(this);
        this.sourcePort.onDisconnect(this);
      }
    
      this.sourcePort = port;
      if(this.sourcePort===null){
        return;
      }
      this.routingRequired = true;
      this.fireSourcePortRouteEvent();
      this.sourcePort.attachMoveListener(this);
      if(this.canvas!==null){
          this.sourcePort.onConnect(this);
      }
      this.setStartPoint(port.getAbsoluteX(), port.getAbsoluteY());
    },
    
    /**
     * @method
     * Returns the source port of this connection.
     *
     * @type draw2d.Port
     **/
    getSource:function()
    {
      return this.sourcePort;
    },
    
    /**
     * @method
     * Set the target port of this connection. This enforce a repaint of the connection.
     * 
     * @param {draw2d.Port} port The new target port of this connection
     **/
    setTarget:function( port)
    {
      if(this.targetPort!==null){
        this.targetPort.detachMoveListener(this);
        this.targetPort.onDisconnect(this);
      }
    
      this.targetPort = port;
      if(this.targetPort===null){
        return;
      }
      
      this.routingRequired = true;
      this.fireTargetPortRouteEvent();
      this.targetPort.attachMoveListener(this);
      if(this.canvas!==null){
         this.targetPort.onConnect(this);
      }
      this.setEndPoint(port.getAbsoluteX(), port.getAbsoluteY());
    },
    
    /**
     * @method
     * Returns the target port of this connection.
     *
     * @type draw2d.Port
     **/
    getTarget:function()
    {
      return this.targetPort;
    },
    
    /**
     * @method
     * Method returns true if the connection has at least one common port with the given connection.
     * 
     * @param {draw2d.Connection} other
     * @returns {Boolean}
     */
    sharingPorts:function(other){
        return this.sourcePort== other.sourcePort ||
               this.sourcePort== other.targetPort ||
               this.targetPort== other.sourcePort ||
               this.targetPort== other.targetPort;
    },

    
    /**
     * @method
     * Set the canvas element of this figures.
     * 
     * @param {draw2d.Canvas} canvas the new parent of the figure or null
     */
    setCanvas: function( canvas )
    {
       this._super(canvas);
       

       if(this.sourceDecoratorNode!==null){
           this.sourceDecoratorNode.remove();
           this.sourceDecoratorNode=null;
       }
       
       if(this.targetDecoratorNode!==null){
           this.targetDecoratorNode.remove();
           this.targetDecoratorNode=null;
       }
       
       if(this.canvas===null){
           this.router.onUninstall(this);
           
           if(this.sourcePort!==null){
               this.sourcePort.detachMoveListener(this);
               this.sourcePort.onDisconnect(this);
           }
           if(this.targetPort!==null){
               this.targetPort.detachMoveListener(this);
               this.targetPort.onDisconnect(this);
           }
       }
       else{
           this.router.onInstall(this);
           
           if(this.sourcePort!==null){
               this.sourcePort.attachMoveListener(this);
               this.sourcePort.onConnect(this);
           }
           if(this.targetPort!==null){
               this.targetPort.attachMoveListener(this);
               this.targetPort.onConnect(this);
           }
       }

    },

    /**
     * @method
     * Fired by the given figure if the position/dimension of the figure has been changed. This
     * will be called if you have registered this event before.
     * 
     * @param {draw2d.Figure} figure The moved figure
     **/
    onOtherFigureIsMoving:function( figure)
    {
      if(figure===this.sourcePort){
        this.setStartPoint(this.sourcePort.getAbsoluteX(), this.sourcePort.getAbsoluteY());
      }
      else{
        this.setEndPoint(this.targetPort.getAbsoluteX(), this.targetPort.getAbsoluteY());
      }
      this._super(figure);
    },
    

    /**
     * Returns the angle of the connection at the output port (source)
     *
     **/
    getStartAngle:function()
    {
    	// return a good default value if the connection is not routed at the 
    	//  moment
    	if( this.lineSegments.getSize()===0){
    		return 0;
    	}
    	
      var p1 = this.lineSegments.get(0).start;
      var p2 = this.lineSegments.get(0).end;
      if(this.router instanceof draw2d.layout.connection.SplineConnectionRouter)
      {
       p2 = this.lineSegments.get(5).end;
      }
      var length = Math.sqrt((p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y));
      var angle = -(180/Math.PI) *Math.asin((p1.y-p2.y)/length);
    
      if(angle<0)
      {
         if(p2.x<p1.x){
           angle = Math.abs(angle) + 180;
         }
         else{
           angle = 360- Math.abs(angle);
         }
      }
      else
      {
         if(p2.x<p1.x){
           angle = 180-angle;
         }
      }
      return angle;
    },
    
    getEndAngle:function()
    {
      // return a good default value if the connection is not routed at the 
      //  moment
      if (this.lineSegments.getSize() === 0) {
        return 90;
      }
    
      var p1 = this.lineSegments.get(this.lineSegments.getSize()-1).end;
      var p2 = this.lineSegments.get(this.lineSegments.getSize()-1).start;
      if(this.router instanceof draw2d.layout.connection.SplineConnectionRouter)
      {
       p2 = this.lineSegments.get(this.lineSegments.getSize()-5).end;
      }
      var length = Math.sqrt((p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y));
      var angle = -(180/Math.PI) *Math.asin((p1.y-p2.y)/length);
    
      if(angle<0)
      {
         if(p2.x<p1.x){
           angle = Math.abs(angle) + 180;
         }
         else{
           angle = 360- Math.abs(angle);
         }
      }
      else
      {
         if(p2.x<p1.x){
           angle = 180-angle;
         }
      }
      return angle;
    },
    
    
    /**
     * @private
     **/
    fireSourcePortRouteEvent:function()
    {
        // enforce a repaint of all connections which are related to this port
        // this is required for a "FanConnectionRouter" or "ShortesPathConnectionRouter"
        //
       var connections = this.sourcePort.getConnections();
       for(var i=0; i<connections.getSize();i++)
       {
          connections.get(i).repaint();
       }
    },
    
    /**
     * @private
     **/
    fireTargetPortRouteEvent:function()
    {
        // enforce a repaint of all connections which are related to this port
        // this is required for a "FanConnectionRouter" or "ShortesPathConnectionRouter"
        //
       var connections = this.targetPort.getConnections();
       for(var i=0; i<connections.getSize();i++)
       {
          connections.get(i).repaint();
       }
    },
    
    
    /**
     * @method
     * Returns the Command to perform the specified Request or null.
      *
     * @param {draw2d.command.CommandType} request describes the Command being requested
     * @return {draw2d.command.Command} null or a Command
     **/
    createCommand:function( request)
    {
      if(request.getPolicy() === draw2d.command.CommandType.MOVE_BASEPOINT)
      {
        // DragDrop of a connection doesn't create a undo command at this point. This will be done in
        // the onDrop method
        return new draw2d.command.CommandReconnect(this);
      }

      return this._super(request);
    },
    
    
    /**
     * @method 
     * Return an objects with all important attributes for XML or JSON serialization
     * 
     * @returns {Object}
     */
    getPersistentAttributes : function()
    {
        var memento = this._super();

        var parentNode = this.getSource().getParent();
        while(parentNode.getParent()!==null){
        	parentNode = parentNode.getParent();
        }
        memento.source = {
                  node:parentNode.getId(),
                  port: this.getSource().getName()
                };
        
        var parentNode = this.getTarget().getParent();
        while(parentNode.getParent()!==null){
        	parentNode = parentNode.getParent();
        }
        memento.target = {
                  node:parentNode.getId(),
                  port:this.getTarget().getName()
                };
       
        return memento;
    },
    
    /**
     * @method 
     * Read all attributes from the serialized properties and transfer them into the shape.
     * 
     * @param {Object} memento
     * @returns 
     */
    setPersistentAttributes : function(memento)
    {
        this._super(memento);
        
        // nothing to to for the connection creation. This will be done in the draw2d.io.Reader 
        // implementation
        //
    }
});

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
draw2d.Connection.createConnection=function(sourcePort, targetPort){
    
    return new draw2d.Connection();
};


/**
 * The default ConnectionRouter for the running applicaiton. Set this to your wanted implementation
 * {@link draw2d.layout.connection.ConnectionRouter}
 */
draw2d.Connection.DEFAULT_ROUTER= new draw2d.layout.connection.ManhattanConnectionRouter();
//draw2d.Connection.DEFAULT_ROUTER= new draw2d.layout.connection.DirectRouter();
//draw2d.Connection.DEFAULT_ROUTER= new draw2d.layout.connection.ManhattanBridgedConnectionRouter();
//draw2d.Connection.DEFAULT_ROUTER= new draw2d.layout.connection.FanConnectionRouter();
//draw2d.Connection.DEFAULT_ROUTER= new draw2d.layout.connection.SplineConnectionRouter();
        
