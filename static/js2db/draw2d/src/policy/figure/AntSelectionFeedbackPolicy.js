/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.figure.AntSelectionFeedbackPolicy 
 * 
 * Provide support for selecting and positioning a non-resizable figure. 
 * Selection is indicated via rectangular handle that outlines the figure with a 1-pixel black 
 * dotted line. 
 * 
 * See the example:
 *
 *     @example preview small frame
 *       circle =new draw2d.shape.basic.Circle();
 *       circle.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());
 *       canvas.addFigure(circle,90,50);
 *
 *       canvas.addFigure(new draw2d.shape.basic.Label("Click on the circle to see the selection feedback"),20,10);
 *       
 * @author Andreas Herz
 * @extends draw2d.policy.figure.SelectionFeedbackPolicy
 */
draw2d.policy.figure.AntSelectionFeedbackPolicy = draw2d.policy.figure.SelectionFeedbackPolicy.extend({

    NAME : "draw2d.policy.figure.AntSelectionFeedbackPolicy",
    
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
     * @param {draw2d.Figure} figure the figure to decorate with a selection feedback
     * @param {boolean} isPrimarySelection
     */
    onSelect: function(canvas, figure, isPrimarySelection){
        if (figure.selectionHandles.isEmpty()) {
            var box = new draw2d.shape.basic.Rectangle();
            box.setBackgroundColor(null);
            box.setDashArray("- ");
            box.setColor("#00bdee");
//            box.setRadius(figure.getRadius());
            box.hide= function(){
                // IMPORTANT
                // don't add/remove this rectangle to the canvas resizeHandles. This rect isn't responsible for any hitTest or
                // dragDrop operation
                //canvas.resizeHandles.remove(box);
                box.setCanvas(null);
            };
            box.show= function(canvas){
                box.setCanvas(canvas);
                // IMPORTANT
                // don't add/remove this rectangle to the canvas resizeHandles. This rect isn't responsible for any hitTest or
                // dragDrop operation
                //canvas.resizeHandles.remove(box);
                //canvas.resizeHandles.add(box);
                box.shape.toFront();
            };
            box.show(canvas);
            figure.selectionHandles.add(box);
        }
        this.moved(canvas, figure);
   },
    
    
    /**
     * @method
     * Callback if the figure has been moved
     * 
     * @param figure
     * 
     * @template
     */
    moved: function(canvas, figure){
        if(figure.selectionHandles.isEmpty()){
            return; // silently
        }
        var box= figure.selectionHandles.get(0); 
        box.setPosition(figure.getPosition().translate(-2,-2));
        box.setDimension(figure.getWidth()+4, figure.getHeight()+4);
        box.setRotationAngle(figure.getRotationAngle());
     }
}); 