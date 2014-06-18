/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.canvas.ShowGridEditPolicy
 * 
 * Just to paint a grid in the background. 
 * 
 * 
 * @author Andreas Herz
 * 
 * @extends draw2d.policy.canvas.CanvasPolicy
 */
draw2d.policy.canvas.ShowGridEditPolicy = draw2d.policy.canvas.CanvasPolicy.extend({

    NAME : "draw2d.policy.canvas.ShowGridEditPolicy",
    
    GRID_COLOR  : "#e0e0f0",
    GRID_WIDTH  : 10,
    
    /**
     * @constructor 
     * Creates a new constraint policy for snap to grid
     * 
     * @param {Number} grid the grid width of the canvas
     */
    init: function( grid){
        this._super();
        this.canvas = null;
        this.lines = null;
        if(grid){
            this.grid = grid;
        }
        else{
            this.grid = this.GRID_WIDTH;
        }
    },

    onInstall: function(canvas){
        this.canvas = canvas;
        this.showGrid();
    },
    
    onUninstall: function(canvas){
        this.canvas = null;
        this.lines.remove();
    },
    

    /**
     * @method
     * paint the grid into the canvas
     * 
     * @private
     * @since 2.3.0
     */
    showGrid: function(){
        // vertical lines
        var w = this.canvas.initialWidth;
        var h = this.canvas.initialHeight;
        this.lines = this.canvas.paper.set();
        
        for(var x = this.grid; x < w; x += this.grid){
            this.lines.push( this.canvas.paper.path( "M " + x + " 0 l 0 " + h));
        }
        // horizontal lines
        for(var y = this.grid; y < h; y += this.grid){
            this.lines.push( this.canvas.paper.path("M 0 " + y + " l " + w + " 0"));
        }
        this.lines.attr({"stroke":this.GRID_COLOR});
        this.lines.toBack();
    }
});