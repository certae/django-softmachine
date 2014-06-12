/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.command.CommandMoveLine
 * 
 * Command for the movement of figures.
 *
 * @inheritable
 * @author Andreas Herz
 * 
 * @extends draw2d.command.Command
 */
draw2d.command.CommandMoveLine = draw2d.command.Command.extend({
    NAME : "draw2d.command.CommandMoveLine", 
  
    /**
     * @constructor
     * Create a new Command objects which can be execute via the CommandStack.
     *
     * @param {draw2d.Figure} figure the figure to move
     */
    init : function(figure)
    {
        this._super(draw2d.Configuration.i18n.command.moveLine);
        this.line = figure;
        this.dx = 0;
        this.dy = 0;
    },
   
    /**
     * @method
     * set the offset of the line translation
     * 
     * @param {Number} dx
     * @param {Number} dy
     */
    setTranslation: function(dx, dy){
        this.dx = dx;
        this.dy = dy;
    },
    
   /**
    * Returns [true] if the command can be execute and the execution of the
    * command modify the model. A CommandMove with [startX,startX] == [endX,endY] should
    * return false. <br>
    * the execution of the Command doesn't modify the model.
    *
    * @type boolean
    **/
   canExecute:function()
   {
     // return false if we doesn't modify the model => NOP Command
     return this.dx !==0 && this.dy !==0;
   },

   /**
    * Execute the command the first time
    * 
    **/
   execute:function()
   {
      this.redo();
   },

   /**
    * Undo the command
    *
    **/
   undo:function()
   {
       this.line.getVertices().each($.proxy(function(i,e){
           e.translate(-this.dx, -this.dy);
       },this));
       this.line.svgPathString = null;
       // required to update resize handles and the painting of the line
       this.line.setPosition(this.line.getStartPoint());
       
       //this.line.repaint();
   },

   /** 
    * Redo the command after the user has undo this command
    *
    **/
   redo:function()
   {
       this.line.getVertices().each($.proxy(function(i,e){
           e.translate(this.dx, this.dy);
       },this));
       this.line.svgPathString = null;       
       
       // required to update resize handles and the painting of the line
       this.line.setPosition(this.line.getStartPoint());

       //this.line.repaint();
   }
});