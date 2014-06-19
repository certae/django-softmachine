/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.basic.VertexResizeHandle
 * 
 * Selection handle for polyline vertices.
 * 
 *
 * @inheritable
 * @author Andreas Herz
 * @extends draw2d.ResizeHandle 
 */
draw2d.shape.basic.VertexResizeHandle = draw2d.ResizeHandle.extend({
    NAME : "draw2d.shape.basic.VertexResizeHandle",

    SNAP_THRESHOLD   : 3,
    LINE_COLOR       : "#1387E6",
    FADEOUT_DURATION : 300,

    init: function( figure, index) {
        this._super(figure);
        this.index = index;
        this.isDead = false;
        
        this.vline = null;
        this.hline = null;
    },
   
    
    /**
     * @method
     * Called when a user double clicks on the element
     * 
     * @template
     */
    onDoubleClick: function(){
        var cmd  = new draw2d.command.CommandRemoveVertex(this.owner, this.index );
        this.getCanvas().getCommandStack().execute(cmd);

        this.isDead = true;
    },
    
    
    /**
     * @method
     * Will be called after a drag and drop action.<br>
     *
     * @private
     **/
    onDragStart : function()
    {
        if(this.isDead===true){
            return;
        }
        
        this._super();
        this.command = this.getCanvas().getCurrentSelection().createCommand(new draw2d.command.CommandType(draw2d.command.CommandType.MOVE_VERTEX));
        if(this.command!=null){
            this.command.setIndex(this.index);
            this.setAlpha(0.2);
            this.shape.attr({"cursor":"crosshair"});
        }
        
        // Vertex is a reference and not a copy of the point
        this.vertex = this.owner.getVertices().get(this.index).clone();
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
        if (this.isDead===true || this.command == null) {
            return false;
        }

        this.setPosition(this.x + dx2, this.y + dy2);

        // update the polyline for immediately  drag&drop feedback
        //
        this.vertex.translate(dx2, dy2);
        this.owner.setVertex(this.index, this.vertex.x, this.vertex.y);
        
        // update the command for the undo/redo stuff
        //
        this.command.updatePosition(this.vertex.x, this.vertex.y);
        
        // show snapTo lines
        //
        var points = this.owner.getVertices();
        var size = points.getSize();
        var left   = points.get((this.index-1 +size)%size); // % is just to ensure the [0, size] interval
        var right  = points.get((this.index+1)%size);       // % is just to ensure the [0, size] interval
        
        // horizontal guided line
        //
        if(Math.abs(left.x - this.vertex.x)<this.SNAP_THRESHOLD){
            this.showVerticalLine(left.x);
        }
        else if( Math.abs(right.x - this.vertex.x)<this.SNAP_THRESHOLD){
            this.showVerticalLine(right.x);
        }
        else{
            this.hideVerticalLine();
        }
        
        // horizontal guided line
        //
        if(Math.abs(left.y - this.vertex.y)<this.SNAP_THRESHOLD){
            this.showHorizontalLine(left.y);
        }
        else if( Math.abs(right.y - this.vertex.y)<this.SNAP_THRESHOLD){
            this.showHorizontalLine(right.y);
        }
        else{
            this.hideHorizontalLine();
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
        if (this.isDead===true || this.command===null) {
            return false;
        }

        this.shape.attr({"cursor":"move"});
        this.hideVerticalLine();
        this.hideHorizontalLine();
        
        // snapTo
        var points = this.owner.getVertices();
        var size = points.getSize();
        var left   = points.get((this.index-1 +size)%size); // % is just to ensure the [0, size] interval
        var right  = points.get((this.index+1)%size);       // % is just to ensure the [0, size] interval
        
        // Vertical snapTo
        //
        if(Math.abs(left.x - this.vertex.x)<this.SNAP_THRESHOLD){
            this.command.updatePosition(left.x, this.vertex.y);
        }
        else if( Math.abs(right.x - this.vertex.x)<this.SNAP_THRESHOLD){
            this.command.updatePosition(right.x, this.vertex.y);
        }

        // horizontal snapTo
        //
        if(Math.abs(left.y - this.vertex.y)<this.SNAP_THRESHOLD){
            this.command.updatePosition(this.vertex.x, left.y);
        }
        else if( Math.abs(right.y - this.vertex.y)<this.SNAP_THRESHOLD){
            this.command.updatePosition(this.vertex.x, right.y);
        }
        
        var stack = this.getCanvas().getCommandStack();
        
        stack.startTransaction();
        try{
            stack.execute(this.command);
            this.command = null;
            this.getCanvas().hideSnapToHelperLines();
    
            var angle = this.getEnclosingAngle();
            if(angle>178){
                var cmd  = new draw2d.command.CommandRemoveVertex(this.owner, this.index );
                stack.execute(cmd);
            }
        }
        finally{
            stack.commitTransaction();
        }
        
        this.setAlpha(1);

        return true;
    },
    
    
    /**
     * @method
     * Controls the location of the resize handle 
     *
     * @template
     **/
    relocate:function(){

        var resizeWidthHalf = this.getWidth()/2;
        var resizeHeightHalf= this.getHeight()/2;

        var anchor = this.owner.getVertices().get(this.index);
            
        this.setPosition(anchor.x-resizeWidthHalf,anchor.y-resizeHeightHalf);
    },
    
    /**
     * @method
     * Calculates the angle between the siblings 
     * 
     * @returns {Number}
     */
    getEnclosingAngle:function(){
        // calculate the angle between the siblings
        var points = this.owner.getVertices();
        var trans  = this.vertex.getScaled(-1);
        var size = points.getSize();
        var left   = points.get((this.index-1 +size)%size).getTranslated(trans); // % is just to ensure the [0, size] interval
        var right  = points.get((this.index+1)%size).getTranslated(trans);       // % is just to ensure the [0, size] interval
        
        var dot = left.dot(right);
        
        var acos = Math.acos(dot/(left.length() * right.length()));
        return acos*180/Math.PI;
    },
    
    showVerticalLine:function(x){
        if(this.vline!=null){
            return; //silently
        }
        this.vline = this.canvas.paper
                        .path("M " + x + " 0 l 0 " + this.canvas.getHeight())
                        .attr({"stroke":this.LINE_COLOR,"stroke-width":1});
    },
    
    hideVerticalLine:function(){
        if(this.vline==null){
            return;
        }
        var tmp = this.vline;
        tmp.animate({
            opacity: 0.1
        }, this.FADEOUT_DURATION,function(){
            tmp.remove();
        });
        
        this.vline = null;
    },

    
    showHorizontalLine:function(y){
        if(this.hline!=null){
            return;
        }
        
        this.hline = this.canvas.paper
                      .path("M 0 " + y + " l " + this.canvas.getWidth() + " 0")
                      .attr({"stroke":this.LINE_COLOR,"stroke-width":1});
    },

    hideHorizontalLine:function(){
        if(this.hline==null){
            return; //silently
        }
        var tmp = this.hline;
        tmp.animate({
            opacity: 0.1
        }, this.FADEOUT_DURATION,function(){
            tmp.remove();
        });
        this.hline = null;
    }

});