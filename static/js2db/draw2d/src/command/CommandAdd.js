/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.command.CommandAdd
 * 
 * Command to add a figure with CommandStack support.
 * 
 * @extends draw2d.command.Command
 */
draw2d.command.CommandAdd = draw2d.command.Command.extend({
    
    /**
     * @constructor
     * Create a add command for the given figure.
     * 
     * @param {draw2d.Canvas} canvas the canvas to use
     * @param {draw2d.Figure} figure the figure to add
     */
    init: function(canvas, figure, x,y)
    {
       this._super("Add Shape");
       this.figure = figure;
       this.canvas = canvas;
       this.x = x;
       this.y = y;
    },
    
    /**
     * @method
     * Execute the command the first time
     * 
     **/
    execute:function()
    {
       this.canvas.addFigure(this.figure, this.x, this.y);
    },
    
    /** 
     * @method
     * Redo the command after the user has undo this command
     *
     **/
    redo:function()
    {
        this.execute();
    },
    
    /**
     * @method
     * Undo the command
     *
     **/
    undo:function()
    {
        this.canvas.removeFigure(this.figure);
    }
    
});