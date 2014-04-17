/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.command.CommandRemoveVertexPoint
 * 
 * Remove a vertex from a polyline or polygon
 *
 * @inheritable
 * @author Andreas Herz
 * 
 * @extends draw2d.command.Command
 */
draw2d.command.CommandRemoveVertex = draw2d.command.Command.extend({
    NAME : "draw2d.command.CommandRemoveVertex", 
  
    /**
     * @constructor
     * Create a new Command objects which add a vertex to a PloyLine.
     *
     * @param {draw2d.shape.basic.PolyLine} line the related line
     * @param {Number} index the index where to add
     * @param {Number} x the x coordinate for the new vertex
     * @param {Number} y the y coordinate for the new vertex
     */
    init : function(line, index)
    {
        this._super(draw2d.Configuration.i18n.command.deleteVertex);
        
        this.line = line;
        this.index = index;
        this.oldPoint = line.getVertices().get(index).clone();
    },
    
  
    /**
     * @method
     * Returns [true] if the command can be execute and the execution of the
     * command modify the model. A CommandMove with [startX,startX] == [endX,endY] should
     * return false. <br>
     * the execution of the Command doesn't modify the model.
     *
     * @return {boolean}
     **/
    canExecute:function()
    {
      // return false if we doesn't modify the model => NOP Command
      return true;
    },
    
    /**
     * @method
     * Execute the command the first time
     * 
     **/
    execute:function()
    {
       this.redo();
    },
    
    /**
     * @method
     *
     * Undo the move command
     *
     **/
    undo:function()
    {
    	this.line.insertVertexAt(this.index, this.oldPoint.x, this.oldPoint.y);
    },
    
    /**
     * @method
     * 
     * Redo the move command after the user has undo this command
     *
     **/
    redo:function()
    {
    	this.line.removeVertexAt(this.index);
    }
});