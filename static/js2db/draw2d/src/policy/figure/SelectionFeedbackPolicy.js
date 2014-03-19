/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.figure.SelectionFeedbackPolicy
 * 
 * A draw2d.policy.SelectionFeedbackPolicy that is sensitive to the canvas selection. Subclasses will typically 
 * decorate the {@link draw2d.Figure figure} with things like selection handles and/or focus feedback.
 * <br>
 * If you want to change the handle visibility for a figure, then you should use SelectionFeedbackPolicy to do that.
 * 
 * @author Andreas Herz
 * @extends draw2d.policy.figure.DragDropEditPolicy
 */
draw2d.policy.figure.SelectionFeedbackPolicy = draw2d.policy.figure.DragDropEditPolicy.extend({

    NAME : "draw2d.policy.figure.SelectionFeedbackPolicy",
    
    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
        this._super();
    },
    

    /**
     * @method
     * 
     * @template
     * @param figure
     * @param isPrimarySelection
     */
    onSelect: function(canvas, figure, isPrimarySelection){
    },
    
    
    /**
     * @method
     * 
     * @param {draw2d.Figure} figure the unselected figure
     */
    onUnselect: function(canvas, figure ){
      
        figure.selectionHandles.each(function(i,e){
            e.hide();
        });
        figure.selectionHandles = new draw2d.util.ArrayList();
        
        
    }
        
});
