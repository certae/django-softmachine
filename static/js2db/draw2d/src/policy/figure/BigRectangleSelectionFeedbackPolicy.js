/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.figure.BigRectangleSelectionFeedbackPolicy 
 * 
 * See the example:
 *
 *     @example preview small frame
 *       circle =new draw2d.shape.basic.Circle();
 *       circle.installEditPolicy(new draw2d.policy.figure.BigRectangleSelectionFeedbackPolicy());
 *       canvas.addFigure(circle,90,50);
 *
 *       canvas.addFigure(new draw2d.shape.basic.Label("Click on the circle to see the selection feedback"),20,10);
 *
 * @author Andreas Herz
 * @extends draw2d.policy.figure.SelectionFeedbackPolicy
 */
draw2d.policy.figure.BigRectangleSelectionFeedbackPolicy = draw2d.policy.figure.RectangleSelectionFeedbackPolicy.extend({

    NAME : "draw2d.policy.figure.BigRectangleSelectionFeedbackPolicy",
    
    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
        this._super();
   },
    

    /**
     * @method
     * Called by the framework of the Policy should show a resize handle for the given shape
     * 
     * @param {boolean} isPrimarySelection
     */
    onSelect: function(canvas, figure, isPrimarySelection){
        
        this._super(canvas, figure, isPrimarySelection);
        
        if(!figure.selectionHandles.isEmpty())
        {
            figure.selectionHandles.each(function(i,e){
               e.setDimension(15,15); 
            });
        }
        this.moved(canvas, figure);
   }
});
