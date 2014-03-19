/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.ResizeHandle
 * The Resizehandles for Figures.

 * <pre>
 * Possible Type:
 * 
 *     1             2               3
 *     O-----------O-------------O
 *     |                         |
 *     |                         |
 *   8 O           + 9           O 4
 *     |                         |
 *     |                         |
 *     O-----------O-------------O
 *   7             6               5
 * </pre>
 * 
 * @author Andreas Herz
 * @extends draw2d.shape.basic.Rectangle
 */
draw2d.ResizeHandle = draw2d.shape.basic.Rectangle.extend({
    NAME : "draw2d.ResizeHandle",

    DEFAULT_COLOR : "#00bdee",
    
    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     *
     * @param {draw2d.Canvas} canvas the related canvas element
     * @param {Number} type the type of the ResizeHandle.
     */
    init: function( figure , type) {
 
      this._super();

      // required in the SelectionEditPolicy to indicate the type of figure
      // which the user clicks
      this.isResizeHandle=true;
    
      this.owner = figure;
      this.type = type;
      this.command = null;
      this.commandMove=null;
      this.commandResize=null;
      
      this.setDimension();

      this.setBackgroundColor(this.DEFAULT_COLOR);
      this.setColor("#7A7A7A");
      this.setStroke(1);
      this.setSelectable(false);
      this.setRadius(0);
    },
    

    /**
     * @method
     *
     * @param asPrimarySelection
     * @private
     */
    select: function(asPrimarySelection){
        // it is not possible to select a resize handle. This makes no sense
        // return silently without any action
    },
    
    /**
     * @method
     * 
     * @private
     */
    unselect: function(){
        // it is not possible to unselect a resize handle. This makes no sense
        // return silently without any action
    },
    
    
    /**
     * @method
     * The edge of the rectangle for the snapTo mechanism.
     * 
     * @return
     */

    getSnapToDirection:function()
    {
      switch(this.type)
      {
        case 1:
         return draw2d.SnapToHelper.NORTH_WEST;
        case 2:
         return draw2d.SnapToHelper.NORTH;
        case 3:
         return draw2d.SnapToHelper.NORTH_EAST;
        case 4:
         return draw2d.SnapToHelper.EAST;
        case 5:
         return draw2d.SnapToHelper.SOUTH_EAST;
        case 6:
         return draw2d.SnapToHelper.SOUTH;
        case 7:
         return draw2d.SnapToHelper.SOUTH_WEST;
        case 8:
         return draw2d.SnapToHelper.WEST;
        case 9:
         return draw2d.SnapToHelper.NSEW;
        default :
         return draw2d.SnapToHelper.EAST;
      }
    },
    
    /**
     * @method
     * enrich the nomrla rectangle shape with the cursor information for resize
     * 
     * @inheritdoc
     */
    createShapeElement : function(){
       var shape= this._super();
       
       switch(this.type)
       {
         case 1:
          shape.attr({"cursor":"nw-resize"});
          break;
         case 2:
             shape.attr({"cursor":"n-resize"});
             break;
         case 3:
             shape.attr({"cursor":"ne-resize"});
             break;
         case 4:
             shape.attr({"cursor":"e-resize"});
             break;
         case 5:
             shape.attr({"cursor":"se-resize"});
             break;
         case 6:
             shape.attr({"cursor":"s-resize"});
             break;
         case 7:
             shape.attr({"cursor":"sw-resize"});
             break;
         case 8:
             shape.attr({"cursor":"w-resize"});
             break;
       }

       return shape;
    },

    
    /**
     * @method
     * Will be called if the drag and drop action beginns. You can return [false] if you
     * want avoid that the figure can be move.
     * 
    * @return {boolean} true whenever the drag drop operation is allowed.
     **/
    onDragStart : function()
    {
        // This happens if the selected figure has set the "nonResizeable" flag
        // In this case the ResizeHandle can't be dragged. => no resize
        //
        if (!this.isDraggable()) {
            return false;
        }

        this.ox = this.getAbsoluteX();
        this.oy = this.getAbsoluteY();

        this.commandMove = this.owner.createCommand(new draw2d.command.CommandType(draw2d.command.CommandType.MOVE));
        this.commandResize = this.owner.createCommand(new draw2d.command.CommandType(draw2d.command.CommandType.RESIZE));

        return true;
    },
    
    
    /**
     * @method 
     * Called by the framework if the figure is moved by user interaction.
     * 
     * @param {Number} dx the move x offset
     * @param {Number} dy the move y offset
     * @param {Number} dx2 The x diff since the last call of this dragging operation
     * @param {Number} dy2 The y diff since the last call of this dragging operation
     * 
     * @return {boolean}
     */
    onDrag : function(dx, dy, dx2, dy2)
    {
        if (this.isDraggable() === false) {
            return;
        }

        var oldX = this.getAbsoluteX();
        var oldY = this.getAbsoluteY();
        
        // call the super.drag method with all snapTo### handler and adjustments
        this._super(dx, dy, dx2, dy2);

        var diffX = this.getAbsoluteX() - oldX;
        var diffY = this.getAbsoluteY() - oldY;

        var obj = this.owner;
        var objPosX = obj.getAbsoluteX();
        var objPosY = obj.getAbsoluteY();
        var objWidth = obj.getWidth();
        var objHeight = obj.getHeight();

        switch (this.type) {
        case 1:
            obj.setDimension(objWidth - diffX, objHeight - diffY);
            obj.setPosition(objPosX + (objWidth - obj.getWidth()), objPosY + (objHeight - obj.getHeight()));
            break;
        case 2:
            obj.setDimension(objWidth, objHeight - diffY);
            obj.setPosition(objPosX, objPosY + (objHeight - obj.getHeight()));
            break;
        case 3:
            obj.setDimension(objWidth + diffX, objHeight - diffY);
            obj.setPosition(objPosX, objPosY + (objHeight - obj.getHeight()));
            break;
        case 4:
            obj.setDimension(objWidth + diffX, objHeight);
            break;
        case 5:
            obj.setDimension(objWidth + diffX, objHeight + diffY);
            break;
        case 6:
            obj.setDimension(objWidth, objHeight + diffY);
            break;
        case 7:
            obj.setDimension(objWidth - diffX, objHeight + diffY);
            obj.setPosition(objPosX + (objWidth - obj.getWidth()), objPosY);
            break;
        case 8:
            obj.setDimension(objWidth - diffX, objHeight);
            obj.setPosition(objPosX + (objWidth - obj.getWidth()), objPosY);
            break;
        }
    },

    /**
     * @method
     * Will be called after a drag and drop action.<br>
     *
     * @private
     **/
    onDragEnd : function()
    {
        if (!this.isDraggable()) {
            return;
        }

        // An non draggable resizeHandle doesn't create a move/resize command.
        // This happens if the selected figure has set the "nonResizeable" flag.
        //
        if (this.commandMove !== null) {
            this.commandMove.setPosition(this.owner.getX(), this.owner.getY());
            this.canvas.getCommandStack().execute(this.commandMove);
            this.commandMove = null;
        }

        if (this.commandResize !== null) {
            this.commandResize.setDimension(this.owner.getWidth(), this.owner.getHeight());
            this.canvas.getCommandStack().execute(this.commandResize);
            this.commandResize = null;
        }

        this.canvas.hideSnapToHelperLines();
    },

    /**
     * Set the position of the object.<br>
     * The ResizeHandle overrides the Figure.setPosition method. The base
     * class updates the resize handles during the update of the Dimension/Position. This
     * is not neccessary for the ResizeHandles. Performance issue.
     * 
     * @param {Number} x The new x coordinate of the figure
     * @param {Number} y The new y coordinate of the figure
     **/
    setPosition:function(x ,y )
    {
      // don't call base implementation. Base implementation will show ResizeHandles...but I'm the ResizeHandle
    if(x instanceof draw2d.geo.Point){
        this.x = x.x;
        this.y = x.y;
     }
     else{
        this.x= x;
        this.y= y;
     }
      
      this.repaint();
    },
    
 
    /**
     * @method
     * Set the new dimension of the the ResizeHandle. IF you didn't pass any width/height the best default fo rthe
     * platform will be used.
     * 
     * @param {Number} [width] new width of the resize handle
     * @param {Number} [height] new width of the resize handle
     */
    setDimension: function(width, height)
    {
    	if(typeof height !=="undefined"){
    		this._super(width, height);
    	}
    	else{
	        if(draw2d.isTouchDevice){
	        	this._super(15,15);
	        }
	        else{
	        	this._super(8,8);
	        }
    	}
    	
        var offset= this.getWidth();
        var offset2 = offset/2;
        
        switch(this.type)
        {
          case 1:
            this.setSnapToGridAnchor(new draw2d.geo.Point(offset,offset));
            break;
          case 2:
            this.setSnapToGridAnchor(new draw2d.geo.Point(offset2,offset));
            break;
          case 3:
            this.setSnapToGridAnchor(new draw2d.geo.Point(0,offset));
            break;
          case 4:
            this.setSnapToGridAnchor(new draw2d.geo.Point(0,offset2));
            break;
          case 5:
            this.setSnapToGridAnchor(new draw2d.geo.Point(0,0));
            break;
          case 6:
            this.setSnapToGridAnchor(new draw2d.geo.Point(offset2,0));
            break;
          case 7:
            this.setSnapToGridAnchor(new draw2d.geo.Point(offset,0));
            break;
          case 8:
            this.setSnapToGridAnchor(new draw2d.geo.Point(offset,offset2));
            break;
          case 9:
            this.setSnapToGridAnchor(new draw2d.geo.Point(offset2,offset2));
            break;
        }
        
    },
    
    /**
     * @method
     * Show the ResizeHandle and add it to the canvas.<br>
     * Additional bring it in to the front of other figures.
     *
     * @param {draw2d.Canvas} canvas the canvas to use
     * @param {Number} x the x-positin
     * @param {Number} y the y-position
     **/
    show:function(canvas)
    {
      // don't call the parent function. The parent functions delete this object
      // and a resize handle can't be deleted.
      this.setCanvas(canvas);
    
      this.canvas.resizeHandles.add(this);
      this.shape.toFront();
    },
    
    /**
     * @method
     * Hide the resize handle and remove it from the cnavas.
     *
     **/
    hide:function()
    {
      // don't call the parent function. The parent functions delete this object
      // and a resize handle shouldn't be deleted.
      if(this.shape===null){
        return;
      }
        
      this.canvas.resizeHandles.remove(this);
      this.setCanvas(null);
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
        if(this.getAlpha()<0.9){
            attributes.fill="#e6e6e8";
        }
        else{
            attributes.fill = "90-#b8c8ec-#e6e6e8";
        }
        
         
        this._super(attributes);
    },
    

    /**
     * @method
     * return true if the element can be used in combination with the 
     * SnapToHelper feature.
     *
     * @return [boolean]
     **/
    supportsSnapToHelper:function()
    {
    	return true;
    },
    
    
    /**
     * @method
     * Override this method and redirect them to the cavas. A ResizeHandle didn't support
     * Keyboard interaction at the moment.
     *
     * @param {Number} keyCode the id of the pressed key
     * @param {boolean} ctrl true if the user has pressed the CTRL/STRG key as well.
     **/
    onKeyDown:function(keyCode, ctrl)
    {
      // don't call the parent function. The parent functions delete this object
      // and a resize handle can't be deleted.
      this.canvas.onKeyDown(keyCode,ctrl);
    },
    
    
    fireMoveEvent:function()
    {
      // A resizeHandle doesn't fire this event.
      // Normally this set the document dirty. This is not necessary for a ResizeHandle.
    }
});