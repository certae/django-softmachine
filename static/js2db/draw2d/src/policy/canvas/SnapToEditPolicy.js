/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.canvas.SnapToEditPolicy
 * 
 * A helper used by Tools for snapping certain mouse interactions. 
 * 
 * 
 * @author Andreas Herz
 * 
 * @extends draw2d.policy.canvas.CanvasPolicy
 */
draw2d.policy.canvas.SnapToEditPolicy = draw2d.policy.canvas.CanvasPolicy.extend({

    NAME : "draw2d.policy.canvas.SnapToEditPolicy",
    
    /**
     * @constructor 
     * Creates a new constraint policy for snap to grid
     * 
     * @param {Number} grid the grid width of the canvas
     */
    init: function( grid){
        this._super();
        this.grid = grid;
    },


    /**
     * @method
     * Adjust the coordinates to the given grid size.
     * 
     * @param figure
     * @param {draw2d.geo.Point} clientPos
     * @returns {draw2d.geo.Point} the contraint position of th efigure
     */
    snap: function(canvas, figure, clientPos){
        return clientPos;
    }
});