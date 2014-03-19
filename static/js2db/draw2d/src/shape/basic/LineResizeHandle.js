/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.shape.basic.LineResizeHandle
 * Base class for selection handle for connections and normal lines.
 * 
 *
 * @inheritable
 * @author Andreas Herz
 * @extends draw2d.shape.basic.Circle
 */
draw2d.shape.basic.LineResizeHandle = draw2d.shape.basic.Circle.extend({
    NAME : "draw2d.shape.basic.LineResizeHandle",

    init : function(figure)
    {
        this._super();
        this.owner = figure;
        // required in the SelectionEditPolicy to indicate the type of figure
        // which the user clicks
        this.isResizeHandle=true;
         
        if (draw2d.isTouchDevice) {
            this.setDimension(20, 20);
        }
        else {
            this.setDimension(10, 10);
        }

        this.setBackgroundColor("#00bdee");
        this.setColor("#7A7A7A");
        this.setStroke(1);
        this.setSelectable(false);

        this.currentTarget = null;
    },

    createShapeElement : function(){
        var shape= this._super();
        
        shape.attr({"cursor":"move"});
        return shape;
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
     * Return the port below the ResizeHandle.
     * 
     * @template
     * @return {draw2d.Port}
     */
    getRelatedPort:function()
    {
      return null;
    },
    

    /**
     * @method
     * Return the port of the other side of the related connection.
     * 
     * @template
     * @return {draw2d.Port}
     */
    getOppositePort:function()
    {
      return null;
    },
    
    
    /**
     * @method
     * Trigger the repaint of the element
     * 
     * @template
     * @param attributes
     */
    repaint:function(attributes){
        if(this.repaintBlocked===true || this.shape===null){
            return;
        }
        
        if(typeof attributes === "undefined"){
            attributes= {};
        }
        
        if(this.getAlpha()<0.9){
            attributes.fill="#b4e391";
        }
        else{
            attributes.fill="r(.4,.3)#b4e391-#61c419:60-#299a0b";
        }
        
        this._super(attributes);
    },

    /**
     * Will be called if the drag and drop action beginns. You can return [false] if you
     * want avoid the that the figure can be move.
     *
     * @param {Number} x The x position where the mouse has been clicked in the figure
     * @param {Number} y The y position where the mouse has been clicked in the figure
     * @type {boolean}
     **/
    onDragStart : function()
    {
        this.command = this.getCanvas().getCurrentSelection().createCommand(new draw2d.command.CommandType(draw2d.command.CommandType.MOVE_BASEPOINT));

        return true;
    },
    
     
    /**
     * @method
     * Called from the framework during a drag&drop operation
     * 
     * @param {Number} dx the x difference between the start of the drag drop operation and now
     * @param {Number} dy the y difference between the start of the drag drop operation and now
     * @param {Number} dx2 The x diff since the last call of this dragging operation
     * @param {Number} dy2 The y diff since the last call of this dragging operation
     * @return {boolean}
     **/
    onDrag : function(dx, dy, dx2, dy2)
    {
        this.setPosition(this.x + dx2, this.y + dy2);

        var port = this.getOppositePort();

        var target = port!==null?port.getDropTarget(this.getX(), this.getY(), null): null;

        // the hovering element has been changed
        if (target !== this.currentTarget) {

            if (this.currentTarget !== null) {
                this.currentTarget.onDragLeave(port);
                this.currentTarget.setGlow(false);
            }

            if (target !== null) {
                this.currentTarget = target.onDragEnter(port);
                if(this.currentTarget!==null){
                    this.currentTarget.setGlow(true);
                }
            }
        }

        return true;
    },
    
    /**
     * @method Called after a drag and drop action.<br>
     *         Sub classes can override this method to implement additional stuff. Don't forget to call the super implementation via <code>this._super();</code>
     * @return {boolean}
     */
    onDragEnd : function()
    {
        if (!this.isDraggable()) {
            return false;
        }
  
        var port = this.getOppositePort();
        if (port !== null) {
            if (this.currentTarget !== null) {
                
                this.onDrop(this.currentTarget);
                this.currentTarget.onDragLeave(port);
                this.currentTarget.setGlow(false);
                this.currentTarget = null;
            }
        }
        
        this.owner.isMoving=false;
        // A Connection is stuck to the corresponding ports. So we must reset the position
        // to the origin port if we doesn't drop the ResizeHandle on a other port.
        //
        if (this.getCanvas().getCurrentSelection() instanceof draw2d.Connection) {
            if (this.command !== null) {
                this.command.cancel();
            }
        }
        //
        else {
            // An non draggable resizeHandle doesn't create a move/resize command.
            // This happens if the selected figure has set "isResizeable=false".
            //
            if (this.command !== null) {
                this.getCanvas().getCommandStack().execute(this.command);
            }
        }
        this.command = null;
        this.getCanvas().hideSnapToHelperLines();

        return true;
    },


    /**
     * @method
     * Controls the location of the resize handle 
     *
     * @template
     **/
    relocate:function(){
    	
    },
    
    
    /**
     * @method
     * The LineResizeHandle didn't support the SnapToHelper feature if the
     * corresponding object is an Connection. A Connection is always bounded to
     * Port. In this case it makes no sense to use a Grid or Geometry for snapping.
     *
     * @return {boolean} return false if the corresponding object didn't support snapTo
     **/
    supportsSnapToHelper:function()
    {
      if(this.getCanvas().getCurrentSelection() instanceof draw2d.Connection){
        return false;
      }
        
      return true;
    },
    
    /**
     * @method
     * Show the ResizeHandle and add it to the canvas.<br>
     * Additional bring it in to the front of other figures.
     *
     * @param {draw2d.Canvas} canvas the canvas to use
     * @param {Number} x the x-position
     * @param {Number} y the y-position
     **/
    show:function(canvas, x, y)
    {
      // don't call the parent function. The parent functions make this object selectable/deleteable
      // and a resize handle can't be deleted.
      this.setCanvas(canvas);
      this.setPosition(x,y);
      this.shape.toFront();
      this.canvas.resizeHandles.add(this);
    },
    
    /**
     * @method
     * Hide the resize handle and remove it from the canvas.
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
     * @method
     * Override this method and redirect them to the canvas. A ResizeHandle didn't support
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