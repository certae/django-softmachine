/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.canvas.ShowChessboardEditPolicy
 * 
 * Just to paint a grid in the background. 
 * 
 * 
 * @author Andreas Herz
 * 
 * @extends draw2d.policy.canvas.CanvasPolicy
 */
draw2d.policy.canvas.ShowChessboardEditPolicy = draw2d.policy.canvas.CanvasPolicy.extend({

    NAME : "draw2d.policy.canvas.ShowChessboardEditPolicy",
    
    GRID_COLOR  : "#e0e0e0",
    GRID_WIDTH  :20,
    
    /**
     * @constructor 
     * Creates a new constraint policy for snap to grid
     * 
     * @param {Number} grid the grid width of the canvas
     */
    init: function( grid){
        this._super();
        this.canvas = null;
        this.cells  = null;
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
        this.cells.remove();
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
        this.cells = this.canvas.paper.set();
        
        var even = false;
        var xEven = even;
        for(var x = 0; x < w; x += this.grid) {
           for(var y = 0; y < h; y+= this.grid) {
               if(even) {
                   var crect = this.canvas.paper.rect(x, y, this.grid, this.grid);
                   crect.attr({fill: this.GRID_COLOR, "stroke-width":0});
                   this.cells.push(crect);
               }
               even = !even;
           }
           xEven = !xEven;
           even = xEven;
       }
        
       this.cells.toBack();
    }
  
});