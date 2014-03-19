/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.command.CommandAddJunctionPoint
 * 
 * Add a junction point to a polyline
 *
 * @inheritable
 * @author Andreas Herz
 * 
 * @extends draw2d.command.Command
 */
draw2d.command.CommandAddJunctionPoint = draw2d.command.Command.extend({
    NAME : "draw2d.command.CommandAddJunctionPoint", 
  
    /**
     * @constructor
     * Create a new Command objects which add a junction point to a PloyLine.
     *
     * @param {draw2d.shape.basic.PolyLine} line the related line
     * @param {Number} index the index where to add
     * @param {Number} x the x coordinate for the new junction point
     * @param {Number} y the y coordinate for the new junction point
     */
    init : function(line, index, x ,y)
    {
        this._super("Junction point add");
        
        this.line = line;
        this.index = index;
        this.newPoint = new draw2d.geo.Point(x,y);
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
        this.line.removeJunctionPointAt(this.index);
    },
    
    /**
     * @method
     * 
     * Redo the move command after the user has undo this command
     *
     **/
    redo:function()
    {
        this.line.insertJunctionPointAt(this.index, this.newPoint.x, this.newPoint.y);
    }
});