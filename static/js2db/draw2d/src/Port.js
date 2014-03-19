/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.Port
 * A port is an object that is used to establish a connection between a node and a {@link draw2d.Connection}. The port can 
 * be placed anywhere within a node ( see {@link draw2d.layout.locator.PortLocator} for details)
 * 
 * 
 * @author Andreas Herz
 * @extends draw2d.shape.basic.Circle
 */ 
draw2d.Port = draw2d.shape.basic.Circle.extend({
    NAME : "draw2d.Port",

    DEFAULT_BORDER_COLOR:new draw2d.util.Color("#1B1B1B"),
    
    /**
     * @constructor
     * Creates a new Node element which are not assigned to any canvas.
     * 
     * @param {String} [name] the name of the port.
     */
    init : function( name)
    {
        this.locator = null;
        this.lighterBgColor =null;
        
        this._super();
        
        if (draw2d.isTouchDevice) {
            this.setDimension(25, 25);
        }
        else {
            this.setDimension(10, 10);
        }

        // status var for user interaction
        //
        this.ox = this.x;
        this.oy = this.y;
        this.coronaWidth = 5; // the corona width for the hitTest method. Usefull during drag&drop of ports. Better SnapTo behaviour.
        this.corona = null; // Circle
        
        // currentTarget can be differ from the currentTargetPort. In this case
        // we must store booth of them for notifications hoverEnter/hoverLeft
        this.currentTargetPort = null; // port
        this.currentTarget = null; // Figure

        // visible representation
        //
        this.setBackgroundColor("#4f6870");
        this.setStroke(1);
        this.setColor(this.DEFAULT_BORDER_COLOR);
        this.setSelectable(false);
    
        // avoid "undefined" values. This breaks the code on iOS.
        if(typeof name ==="undefined"){
            this.name = null;
        }
        else{
            this.name = name;
        }
        
        
        this.connectionAnchor = new draw2d.layout.anchor.ConnectionAnchor(this);

        // for dynamic diagrams. A Port can have a value which is set by a connector
        //
        this.value = null; 
        this.maxFanOut = Number.MAX_VALUE;
        
        this.setCanSnapToHelper(false);
        
        this.installEditPolicy(new draw2d.policy.port.IntrusivePortsFeedbackPolicy());
    //    this.installEditPolicy(new draw2d.policy.port.ElasticStrapFeedbackPolicy());
    },

    /**
     * @method
     * set the maximal possible count of connections for this port
     * 
     * @param {Number} count
     */
    setMaxFanOut: function(count)
    {
        this.maxFanOut = Math.max(1,count);
        
        return this;
    },
    
    /**
     * @method
     * return the maximal possible connections (in+out) for this port.
     * 
     * @returns
     */
    getMaxFanOut: function()
    {
        return this.maxFanOut;
    },
    
    /**
     * @method
     * Set the Anchor for this object. An anchor is responsible for the endpoint calculation
     * of an connection. just visible representation.
     *
     * @param {draw2d.layout.anchor.ConnectionAnchor} [anchor] the new source anchor for the connection
     **/
    setConnectionAnchor:function( anchor)
    {
        // set some good defaults.
        if(typeof anchor ==="undefined" || anchor===null)
        {
    		anchor = new draw2d.layout.anchor.ConnectionAnchor( );
    	}
    	
        this.connectionAnchor = anchor;
        this.connectionAnchor.setOwner(this);

        return this;
    },
 
    getConnectionAnchorLocation:function(referencePoint)
    {
    	return this.connectionAnchor.getLocation(referencePoint);
    },
    
    getConnectionAnchorReferencePoint:function()
    {
    	return this.connectionAnchor.getReferencePoint();
    },
 
    
    /**
     * @method
     * Returns the **direction** for the connection in relation to the given port and it's parent.
     * 
     * <p>
     * Possible values:
     * <ul>
     *   <li>up -&gt; 0</li>
     *   <li>right -&gt; 1</li>
     *   <li>down -&gt; 2</li>
     *   <li>left -&gt; 3</li>
     * </ul>
     * <p>
     * 
     * @param {draw2d.Connection} conn the related Connection
     * @param {draw2d.Port} relatedPort the counterpart port
     * @return {Number} the direction.
     */
    getConnectionDirection:function(conn, relatedPort)
    {
       return this.getParent().getBoundingBox().getDirection(this.getAbsolutePosition());
    },
    
    /**
     * @method
     * Set the locator/layouter of the port. A locator is responsive for the x/y arrangement of the 
     * port in relation to the parent node.
     * 
     * @param {draw2d.layout.locator.Locator} locator
     */
    setLocator: function(locator)
    {
        this.locator = locator;

        return this;
    },
    

    /**
     * @method
     * Set the new background color of the figure. It is possible to hands over
     * <code>null</code> to set the background transparent.
     *
     * @param {draw2d.util.Color} color The new background color of the figure
     **/
     setBackgroundColor : function(color)
     {
        // delete cached colors. recalculated in the repaint method 
        this._super(color);
        this.lighterBgColor=this.bgColor.lighter(0.3).hash();;

        return this;
     },

    /**
     * @method
     * Set a value for the port. This is useful for interactive/dynamic diagrams like circuits, simulator,...
     *  
     * @param {Object} value the new value for the port 
     */
    setValue:function(value)
    {
        this.value = value;
        if(this.getParent()!==null){
           this.getParent().onPortValueChanged(this);
        }

        return this;
    },
    
    /**
     * @method
     * Return the user defined value of the port.
     * 
     * @returns {Object}
     */
    getValue:function()
    {
        return this.value;
    },
    
     /**
      * @inheritdoc
      * 
      * @param attributes
      */
     repaint:function(attributes)
     {
         if(this.repaintBlocked===true || this.shape===null){
             return;
         }

         if(typeof attributes === "undefined"){
             attributes= {};
         }
         
         // a port did have the 0/0 coordinate i the center and not in the top/left corner
         //
         attributes.cx = this.getAbsoluteX();
         attributes.cy = this.getAbsoluteY();
         attributes.rx = this.width/2;
         attributes.ry = attributes.rx;
         attributes.cursor = "move";
         
         if(this.getAlpha()<0.9){
             attributes.fill=this.bgColor.hash();
         }
         else{
             attributes.fill = ["90",this.bgColor.hash(),this.lighterBgColor].join("-");
         }
         
         this._super(attributes);
     },
     
    
    /**
     * @inheritdoc
     *
     **/
    onMouseEnter:function()
    {
        this.setStroke(2);
    },
    
    
    /**
     * @inheritdoc
     * 
     **/
    onMouseLeave:function()
    {
        this.setStroke(1);
    },


    /**
     * @method
     * Returns a {@link draw2d.util.ArrayList} of {@link draw2d.Connection}s of all related connections to this port.
     *
     * @type {draw2d.util.ArrayList}
     **/
    getConnections:function()
    {
      var result = new draw2d.util.ArrayList();
    
      // Return all Connections which are bounded to this port
      // In this case this are all movement listener
      var size= this.moveListener.getSize();
      for(var i=0;i<size;i++)
      {
        var target = this.moveListener.get(i);
        if(target instanceof draw2d.Connection){
           result.add(target);
        }
      }
      return result;
    },
    
    
    /**
     * @method
     * Set the parent of this port.
     * Call {@link draw2d.shape.node.Node#addPort} if you want to a port to node. Don't call this method directly.
     *
     * @private
     */
    setParent:function(parent)
    {
      this._super(parent);
      
      if(this.parent!==null){
        this.parent.detachMoveListener(this);
      }
      
      if(this.parent!==null) {
        this.parent.attachMoveListener(this);
      }
    },
    

    /**
     * @method
     * Returns the corona width of the Port. The corona width will be used during the
     * drag&drop of a port.
     *
     * @return {Number}
     **/
    getCoronaWidth:function()
    {
       return this.coronaWidth;
    },
    
    
    /**
     * @method
     * Set the corona width of the Port. The corona width will be used during the
     * drag&drop of a port. You can drop a port in the corona of this port to create
     * a connection. It is not neccessary to drop exactly on the port.
     *
     * @param {Number} width The new corona width of the port
     **/
    setCoronaWidth:function( width)
    {
       this.coronaWidth = width;
    },
    
    /**
     * @inheritdoc
     * 
     * @return {boolean}
     **/
    onDragStart : function()
    {
        // just allow the DragOperation if the port didn't have reached the max fanOut
        // limit.
        if(this.getConnections().getSize() >= this.maxFanOut){
            return false;
        }
        
        // this can happen if the user release the mouse button outside the window during a drag&drop
        // operation
        if(this.isInDragDrop ===true){
            this.onDragEnd();
        }
                
        this.getShapeElement().toFront();
       // don't call the super method. This creates a command and this is not necessary for a port
       this.ox = this.x;
       this.oy = this.y;

        // notify all installed policies
        //
        this.editPolicy.each($.proxy(function(i,e){
            if(e instanceof draw2d.policy.figure.DragDropEditPolicy){
                e.onDragStart(this.canvas, this);
            }
        },this));

        return true;
    },
    
    /**
     * @inheritdoc
     * 
     * @param {Number} dx the x difference between the start of the drag drop operation and now
     * @param {Number} dy the y difference between the start of the drag drop operation and now
     **/
    onDrag:function(dx, dy)
    {
      this.isInDragDrop = true;

      this._super( dx, dy);

      var target=this.getDropTarget(this.getAbsoluteX(),this.getAbsoluteY(), this);
      // the hovering element has been changed
      if(target!==this.currentTarget){
          if(this.currentTarget!==null){
              this.currentTarget.onDragLeave(this);
              this.editPolicy.each($.proxy(function(i,e){
                  if(e instanceof draw2d.policy.port.PortFeedbackPolicy){
                      e.onHoverLeave(this.canvas, this, this.currentTarget);
                  }
              },this));
          }
          
          // possible hoverEnter event
          //
          if(target!==null){
              this.currentTarget= target.onDragEnter(this);
              if(this.currentTarget!==null){
            	  this.currentTargetPort = target;
                  this.editPolicy.each($.proxy(function(i,e){
                      if(e instanceof draw2d.policy.port.PortFeedbackPolicy){
                          e.onHoverEnter(this.canvas, this, this.currentTarget);
                      }
                  },this));
              }
          }
          else{
        	  this.currentTarget = null;
          }
          
      }
    },
    
    
    /**
     * @inheritdoc
     **/
    onDragEnd:function()
    {
      // Don't call the parent implementation. This will create an CommandMove object
      // and store them o the CommandStack for the undo operation. This makes no sense for a
      // port.
      // draw2d.shape.basic.Rectangle.prototype.onDragEnd.call(this); DON'T call the super implementation!!!
    
      this.setAlpha(1.0);
    
      // 1.) Restore the old Position of the node
      //
      this.setPosition(this.ox,this.oy);
    
      this.isInDragDrop =false;
      
      
      // notify all installed policies
      //
      if(this.currentTarget){
	      this.editPolicy.each($.proxy(function(i,e){
	          if(e instanceof draw2d.policy.port.PortFeedbackPolicy){
	              e.onHoverLeave(this.canvas, this, this.currentTarget);
	          }
	      },this));
      }
      
      this.editPolicy.each($.proxy(function(i,e){
          if(e instanceof draw2d.policy.figure.DragDropEditPolicy){
              e.onDragEnd(this.canvas, this);
          }
      },this));

      // Reset the drag&drop flyover information 
      //
      this.currentTarget = null;
    },
    
    /**
     * @method
     * 
     * @param {draw2d.Figure} figure The figure which is currently dragging
     * 
     * @return {draw2d.Figure} the figure which should receive the drop event or null if the element didn't want a drop event
     * @private
     **/
    onDragEnter : function( draggedFigure )
    {
    	// Ports accepts only Ports as DropTarget
    	//
    	if(!(draggedFigure instanceof draw2d.Port)){
    		return null;
    	}
    	
    	// consider the max possible connections for this port
    	//
    	if(this.getConnections().getSize() >= this.maxFanOut){
    	    return null;
    	}
        // Create a CONNECT Command to determine if we can show a Corona. Only valid
        // dropTarget did have a corona
        var request = new draw2d.command.CommandType(draw2d.command.CommandType.CONNECT);
        request.canvas = this.parent.getCanvas();
        request.source = this;
        request.target = draggedFigure;
        var command = draggedFigure.createCommand(request);

        if (command === null) {
            return null;
        }

        return this;
    },
    
    /**
     * @method
     * 
     * @param {draw2d.Figure} figure The figure which is currently dragging
     * @private
     **/
    onDragLeave:function( figure )
    {
		// Ports accepts only Ports as DropTarget
		//
		if(!(figure instanceof draw2d.Port)){
			return;
		}
    },
    
    /**
     * @method
     * Called if the user drop this element onto the dropTarget
     * 
     * @param {draw2d.Figure} dropTarget The drop target.
     * @private
     **/
    onDrop:function(dropTarget)
    {
    	// Ports accepts only Ports as DropTarget
    	//
    	if(!(dropTarget instanceof draw2d.Port)){
    		return;
    	}
 
    	var request = new draw2d.command.CommandType(draw2d.command.CommandType.CONNECT);
        request.canvas = this.parent.getCanvas();
        request.source = dropTarget;
        request.target = this;
        var command = this.createCommand(request);
        
        if(command!==null){
           this.parent.getCanvas().getCommandStack().execute(command);
        }
        this.setGlow(false);
    },
   

    /**
     * @method
     * Callback method if a new connection has created with this port
     * 
     * @param {draw2d.Connection} connection The connection which has been created
     * @since 2.5.1
     * @template
     **/
    onConnect: function(connection){
    },
    
    /**
     * @method
     * Callback method if a new connection has created with this port
     * 
     * @param {draw2d.Connection} connection The connection which has been deleted
     * @since 2.5.1
     * @template
     **/
    onDisconnect: function(connection){
    },
    
    /**
     * @method
     * Callback method of the movement of a figure
     * 
     * @param {draw2d.Figure} figure The figure which has been moved
     **/
    onOtherFigureIsMoving:function( figure)
    {
      this.repaint();
      
      // Falls sich der parent bewegt hat, dann muss der Port dies seinen
      // Connections mitteilen
      this.fireMoveEvent();
    },
    
    /**
     * @method
     * Return the name of this port.
     *
     * @return {String}
     **/
    getName:function()
    {
      return this.name;
    },
    
    /**
     * @method
     * Set the name of this port.
     *
     * @see draw2d.shape.node.Node#getPort
     * @param {String} name The new name of this port.
     **/
    setName:function( name)
    {
      this.name=name;
    },
    
    /**
     * @method
     * Hit test for ports. This method respect the corona diameter of the port for the hit test.
     * 
     * @param {Number} iX
     * @param {Number} iY
     * @returns {Boolean}
     */
    hitTest:function ( iX , iY)
    {
        var x = this.getAbsoluteX()-(this.coronaWidth*2)-this.getWidth()/2;
        var y = this.getAbsoluteY()-(this.coronaWidth*2)-this.getHeight()/2;
        var iX2 = x + this.width + (this.coronaWidth*2);
        var iY2 = y + this.height + (this.coronaWidth*2);
        return (iX >= x && iX <= iX2 && iY >= y && iY <= iY2);
    },
    
    /**
     * @method
     * Highlight this port
     * 
     * @param {boolean} flag indicator if the figure should glow.
     */
    setGlow:function ( flag)
    {
      if(flag===true && this.corona===null)
      {
    	  this.corona = new draw2d.Corona();
    	  this.corona.setDimension(this.getWidth()+(this.getCoronaWidth()*2),this.getWidth()+(this.getCoronaWidth()*2));
          this.corona.setPosition(this.getAbsoluteX()-this.getCoronaWidth()-this.getWidth()/2, this.getAbsoluteY()-this.getCoronaWidth()-this.getHeight()/2);
          
          this.corona.setCanvas(this.getCanvas());

          // important inital 
          this.corona.getShapeElement();
          this.corona.repaint();
          
          // DON'T add them to the document. The corona is just a visual feedback and not part
          // of the canvas document.
         // this.parent.getCanvas().addFigure(this.corona,this.getAbsoluteX()-this.getCoronaWidth()-this.getWidth()/2, this.getAbsoluteY()-this.getCoronaWidth()-this.getHeight()/2);
      }
      else if(flag===false && this.corona!==null)
      {
          this.corona.setCanvas(null);
    	  this.parent.getCanvas().removeFigure(this.corona);
    	  this.corona = null;
      }
      
      return this;
    },
    
    /**
     * @inheritdoc
     *
     * @param {draw2d.command.CommandType} request describes the Command being requested
     * @return {draw2d.command.Command} null or a valid command
     **/
    createCommand:function(request)
    {
       // the port has its own implementation of the CommandMove
       //
       if(request.getPolicy() === draw2d.command.CommandType.MOVE)
       {
         if(!this.isDraggable()){
            return null;
         }
         return new draw2d.command.CommandMovePort(this);
       }
       
       // Connect request between two ports
       //
       if(request.getPolicy() === draw2d.command.CommandType.CONNECT)
       {
         if(request.source.parent.id === request.target.parent.id){
            return null;
         }

         return new draw2d.command.CommandConnect(request.canvas,request.source,request.target, request.source);
       }
    
       return null;
    },
    
    /**
     * @method
     * Called from the figure itself when any positin changes happens. All listenter
     * will be informed.
     * DON'T fire this event if the Port is during a Drag&Drop operation. This can happen
     * if we try to connect two ports
     * 
     * @private
     **/
    fireMoveEvent : function()
    {
        if (this.isInDragDrop === true) {
            return;
        }

        this._super();
    },
 
    /**
     * @method 
     * Return a possible drop target which is under the hands over coordinate. This can be a 
     * 
     * @param {Number} x
     * @param {Number} y
     * @private
     * @return {draw2d.Figure}
     */
    getDropTarget: function (x , y, portToIgnore)
    {
      for(var i=0;i<this.targets.getSize();i++)
      {
        var target = this.targets.get(i);
        if (target!==portToIgnore)
        {
	        if (target.hitTest(x, y)===true)
	        {
	            return target;
	        }
        }
      }
      
      return null;
    },
    
    /**
     * @method 
     * Return a possible drop target which is under the hands over coordinate. This can be a 
     * 
     * @param {Number} x
     * @param {Number} y
     * @private
     * @return {draw2d.Figure}
     */
    getDropTargets: function ()
    {
      return this.targets.clone().grep($.proxy(function(element){
	    	  return element!==this;
	      },this));
    }
});


/**
 * @class draw2d.Corona
 * Glow effect for ports. Just for internal use.
 * 
 * @extend draw2d.shape.basic.Circle
 */
draw2d.Corona = draw2d.shape.basic.Circle.extend({

    /**
     * @constructor
     * Creates a new Node element which are not assigned to any canvas.
     * 
     */
    init : function()
    {
        this._super();
        this.setAlpha(0.3);
        this.setBackgroundColor(new  draw2d.util.Color(178,225,255));
        this.setColor(new draw2d.util.Color(102,182,252));
    },
    
    /**
     * @method
     * the the opacity of the element.
     * 
     * @param {Number} percent
     */
    setAlpha : function(percent)
    {
        this._super(Math.min(0.3, percent));
        this.setDeleteable(false);
        this.setDraggable(false);
        this.setResizeable(false);
        this.setSelectable(false);
        
        return this;
    }
});
