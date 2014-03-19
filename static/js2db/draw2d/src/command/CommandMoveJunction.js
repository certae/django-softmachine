/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.command.CommandMoveJunction
 * 
 * Command for the junction point movement of a polyline.
 *
 * @inheritable
 * @author Andreas Herz
 * 
 * @extends draw2d.command.Command
 */
draw2d.command.CommandMoveJunction = draw2d.command.Command.extend({
    NAME : "draw2d.command.CommandMoveJunction", 
  
    /**
     * @constructor
     * Create a new Command objects which can be execute via the CommandStack.
     *
     * @param {draw2d.shape.basic.PolyLine} line the related line
     */
    init : function(line)
    {
        this._super("Junction moved");
        
        this.line = line;
        this.index = -1;
        this.newPoint = null;
    },
    
  
    /**
     * @method
     * Set the index of the junction point of the polyline to modify.
     *
     * @param {Number} index the related index of the junction point
     **/
    setIndex:function( index)
    {
       this.index = index;
       this.origPoint = this.line.getPoints().get(this.index).clone();
    },
    
    updatePosition: function(x,y){
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
      return this.index!==-1 && this.newPoint!==null;
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
        this.line.setJunctionPoint(this.index, this.origPoint.x, this.origPoint.y);
    },
    
    /**
     * @method
     * 
     * Redo the move command after the user has undo this command
     *
     **/
    redo:function()
    {
        this.line.setJunctionPoint(this.index, this.newPoint.x, this.newPoint.y);
    }
});