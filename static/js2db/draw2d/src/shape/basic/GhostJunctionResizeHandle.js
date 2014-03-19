/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.basic.GhostJunctionResizeHandle
 * ResizeHandle for a junction point edit policy. Click of this kind of resize handles
 * adds a new junction point to the polyline.
 * 
 *
 * @inheritable
 * @author Andreas Herz
 * @extends draw2d.shape.basic.LineResizeHandle 
 */
draw2d.shape.basic.GhostJunctionResizeHandle = draw2d.shape.basic.LineResizeHandle.extend({
    NAME : "draw2d.shape.basic.GhostJunctionResizeHandle",

    init: function( figure, precursorIndex) {
        this._super(figure);
        this.precursorIndex = precursorIndex;
        
        this.setAlpha(0.35);
    },
   
    createShapeElement : function(){
        var shape= this._super();
        
        shape.attr({"cursor":"pointer"});
        
        return shape;
     },

    /**
     * @method
     * Called when a user clicks on the element
     * 
     * @template
     */
    onClick: function(){
    	var cmd  = new draw2d.command.CommandAddJunctionPoint(this.owner, this.precursorIndex+1,this.getAbsoluteX() + this.getWidth()/2, this.getAbsoluteY() + this.getHeight()/2 );
        this.getCanvas().getCommandStack().execute(cmd);
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
        return true;
    },
    
    /**
     * @method Called after a drag and drop action.<br>
     *         Sub classes can override this method to implement additional stuff. Don't forget to call the super implementation via <code>this._super();</code>
     * @return {boolean}
     */
    onDragEnd : function()
    {
        return true;
    },
    
    
    /**
     * @method
     * Controls the location of the resize handle 
     *
     * @template
     **/
    relocate:function(){
        var p1 = this.owner.getPoints().get(this.precursorIndex);
        var p2 = this.owner.getPoints().get(this.precursorIndex+1);
     
        var x = ((p2.x - p1.x) / 2 + p1.x - this.getWidth()/2)|0;
        var y = ((p2.y - p1.y) / 2 + p1.y - this.getHeight()/2)|0;

   		
  		this.setPosition(x,y);
    }    


});