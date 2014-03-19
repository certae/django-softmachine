/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.figure.DragDropEditPolicy
 * 
 * Called by the framework if the user edit the position of a figure with a drag drop operation.
 * Sub class like SelectionEditPolicy or RegionEditPolicy cam adjust th e position of the figure or the selections handles.
 * 
 * @author  Andreas Herz
 * @extends draw2d.policy.EditPolicy
 */
draw2d.policy.figure.DragDropEditPolicy = draw2d.policy.EditPolicy.extend({

    NAME : "draw2d.policy.figure.DragDropEditPolicy",

    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
        this._super();
    },
    
   
    /**
     * @method
     * Called by the framework if the related shape has init a drag&drop
     * operation
     * 
     * @param {draw2d.Canvas} canvas The host canvas
     * @param {draw2d.Figure} figure The related figure
     * @template
     */
    onDragStart: function(canvas, figure){
    	figure.shape.attr({cursor:"move"});
    	figure.isMoving = false;
    	figure.originalAlpha = figure.getAlpha();
    },
    
    /**
     * @method
     * Called by the framework during drag a figure.
     * 
     * @param {draw2d.Canvas} canvas The host canvas
     * @param {draw2d.Figure} figure The related figure
     * @template
     */
    onDrag: function(canvas, figure){
        
        // enable the alpha blending of the first real move of the object
        //
        if(figure.isMoving===false)
        {
            figure.isMoving = true;
            figure.setAlpha(figure.originalAlpha*0.4);
        }    	
    },
    
    /**
     * @method
     * Called by the framework if the drag drop operation ends.
     * 
     * @param {draw2d.Canvas} canvas The host canvas
     * @param {draw2d.Figure} figure The related figure
     * @template
     */
    onDragEnd: function(canvas, figure){
        figure.shape.attr({cursor:"default"});
        figure.isMoving = false;
    },
    
    /**
     * @method
     * Adjust the coordinates to the rectangle/region of this constraint.
     * 
     * @param figure
     * @param {Number|draw2d.geo.Point} x
     * @param {number} [y]
     * @returns {draw2d.geo.Point} the constraint position of the figure
     * 
     * @template
     */
    adjustPosition: function(figure, x,y){
        // do nothing per default implementation
        if(x instanceof draw2d.geo.Point){
            return x;
        }
        
        return new draw2d.geo.Point(x,y);
    },

    /**
     * @method
     * ensure that the dimension didn't goes outside the given restrictions
     * 
     * @param figure
     * @param {Number} w
     * @param {number} h
     * @returns {draw2d.geo.Rectangle} the constraint position of the figure
     */
    adjustDimension : function(figure, w, h){
        return new draw2d.geo.Rectangle(0,0,w,h);
    },
    
    /**
     * @method
     * Callback if the figure has been moved
     * 
     * @param {draw2d.Canvas} canvas The host canvas
     * @param {draw2d.Figure} figure The related figure
     * 
     * @template
     */
    moved: function(canvas,figure) {

    }
});