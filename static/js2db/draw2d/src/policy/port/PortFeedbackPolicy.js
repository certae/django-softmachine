/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.port.PortFeedbackPolicy
 * 
 * A draw2d.policy.SelectionFeedbackPolicy that is sensitive to the canvas selection. Subclasses will typically 
 * decorate the {@link draw2d.Figure figure} with things like selection handles and/or focus feedback.
 * <br>
 * If you want to change the handle visibility for a figure, then you should use SelectionFeedbackPolicy to do that.
 * 
 * @author Andreas Herz
 * @extends draw2d.policy.figure.DragDropEditPolicy
 */
draw2d.policy.port.PortFeedbackPolicy = draw2d.policy.figure.DragDropEditPolicy.extend({

	
    NAME : "draw2d.policy.port.PortFeedbackPolicy",
    
    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
        this._super();
    },

    /**
     * @method
     * Called if the dragged port hove another port
     * 
     * @param {draw2d.Canvas} canvas
     * @param {draw2d.Port}   draggedFigure
     * @param {draw2d.Figure} hoverFigure
     */
    onHoverEnter: function(canvas, draggedFigure, hoverFigure){
    },
    
    onHoverLeave: function(canvas, draggedFigure, hoverFigure){
    }

        
});
