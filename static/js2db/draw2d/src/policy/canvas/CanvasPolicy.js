/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.canvas.CanvasPolicy
 * 
 *
 * @author Andreas Herz
 * @extends draw2d.policy.EditPolicy
 */
draw2d.policy.canvas.CanvasPolicy = draw2d.policy.EditPolicy.extend({

    NAME : "draw2d.policy.canvas.CanvasPolicy",
    
    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
        this._super();
    },
    
    onInstall: function(canvas){
    },
    
    onUninstall: function(canvas){
    },
    
    /**
     * @method
     * Called by the canvas if the user click on a figure.
     * 
     * @param {draw2d.Canvas} canvas
     * @param {Number} mouseX the x coordinate of the mouse during the click event
     * @param {Number} mouseY the y coordinate of the mouse during the click event
     * 
     * @since 3.0.0
     * 
     * @template
     */
    onClick: function(figure, mouseX, mouseY){
    },
    
    /**
     * @method
     * 
     * @param {draw2d.Canvas} canvas
     * @param {Number} x the x-coordinate of the mouse event
     * @param {Number} y the y-coordinate of the mouse event
     * @template
     */
    onMouseMove:function(canvas, x, y){
    },
    
    /**
     * @method
     * Adjust the coordinates to the given constraint.
     * 
     * @param figure
     * @param {draw2d.geo.Point} clientPos
     * @returns {draw2d.geo.Point} the contraint position of th efigure
     */
    snap: function(canvas, figure, clientPos){
        return clientPos;
    },

    /**
     * @method
     * 
     * @param {draw2d.Canvas} canvas
     * @param {Number} x the x-coordinate of the mouse down event
     * @param {Number} y the y-coordinate of the mouse down event
     */
    onMouseDown:function(canvas, x,y){
        
    },
    
    /**
     * @method
     * 
     * @param {draw2d.Canvas} canvas
     * @param {Number} dx The x diff between start of dragging and this event
     * @param {Number} dy The y diff between start of dragging and this event
     * @param {Number} dx2 The x diff since the last call of this dragging operation
     * @param {Number} dy2 The y diff since the last call of this dragging operation
     * @template
     */
    onMouseDrag:function(canvas, dx, dy, dx2, dy2){
        
    },
    
    /**
     * @method
     * 
     * @param {draw2d.Canvas} canvas
     * @param {Number} x the x-coordinate of the mouse down event
     * @param {Number} y the y-coordinate of the mouse down event
     * @template
     */
    onMouseUp: function(figure, x, y){
        
    }
    
});
