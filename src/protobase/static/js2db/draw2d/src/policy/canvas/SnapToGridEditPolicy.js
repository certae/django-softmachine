/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.canvas.SnapToGridEditPolicy
 * 
 * A helper used to perform snapping to a grid, which is specified on the canvas via the various 
 * properties defined in this class. 
 * 
 * 
 * @author Andreas Herz
 * 
 * @extends draw2d.policy.canvas.SnapToEditPolicy
 */
draw2d.policy.canvas.SnapToGridEditPolicy = draw2d.policy.canvas.SnapToEditPolicy.extend({

    NAME : "draw2d.policy.canvas.SnapToGridEditPolicy",
    
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
     * Applies a snapping correction to the given result. 
     * 
     * @param figure
     * @param {draw2d.geo.Point} pos
     * @returns {draw2d.geo.Point} the contraint position of the figure
     * @since 2.3.0
     */
    snap: function(canvas, figure, pos){
        
        var snapPoint = figure.getSnapToGridAnchor();

        pos.x= pos.x+snapPoint.x;
        pos.y= pos.y+snapPoint.y;

       
        pos.x = this.grid*Math.floor(((pos.x + this.grid/2.0) / this.grid));
        pos.y = this.grid*Math.floor(((pos.y + this.grid/2.0) / this.grid));
        
        pos.x= pos.x-snapPoint.x;
        pos.y= pos.y-snapPoint.y;
        
        return pos;
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