/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.port.ElasticStrapFeedbackPolicy
 * 
 * A draw2d.policy.SelectionFeedbackPolicy that is sensitive to the canvas selection. Subclasses will typically 
 * decorate the {@link draw2d.Figure figure} with things like selection handles and/or focus feedback.
 * <br>
 * If you want to change the handle visibility for a figure, then you should use SelectionFeedbackPolicy to do that.
 * 
 * @author Andreas Herz
 * @extends draw2d.policy.figure.DragDropEditPolicy
 */
draw2d.policy.port.ElasticStrapFeedbackPolicy = draw2d.policy.port.PortFeedbackPolicy.extend({

    NAME : "draw2d.policy.port.ElasticStrapFeedbackPolicy",
    
    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
        this._super();
        this.connectionLine = null;
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
        this.connectionLine = new draw2d.shape.basic.Line();
        this.connectionLine.setCanvas(canvas);
        this.connectionLine.getShapeElement();
        
        this.onDrag(canvas, figure);
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
        var x1 = figure.ox+figure.getParent().getAbsoluteX();
        var y1 = figure.oy+figure.getParent().getAbsoluteY();
        
        this.connectionLine.setStartPoint(x1,y1);
        this.connectionLine.setEndPoint(figure.getAbsoluteX(),figure.getAbsoluteY());
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
        this.connectionLine.setCanvas(null);
        this.connectionLine = null;
    },
    
    onHoverEnter: function(canvas, draggedFigure, hoverFiger){
    	this.connectionLine.setGlow(true);
    	hoverFiger.setGlow(true);
    },
    
    onHoverLeave: function(canvas, draggedFigure, hoverFiger){
    	hoverFiger.setGlow(false);
    	this.connectionLine.setGlow(false);
    }

        
});
