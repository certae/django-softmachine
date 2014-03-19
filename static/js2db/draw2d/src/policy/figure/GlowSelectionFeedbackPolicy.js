/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.figure.GlowSelectionFeedbackPolicy
 * 
 * See the example:
 *
 *     @example preview small frame
 *       circle =new draw2d.shape.basic.Circle();
 *       circle.installEditPolicy(new draw2d.policy.figure.GlowSelectionFeedbackPolicy());
 *       canvas.addFigure(circle,90,50);
 *
 *       canvas.addFigure(new draw2d.shape.basic.Label("Click on the circle to see the selection feedback"),20,10);
 *
 * @author Andreas Herz
 * @extends draw2d.policy.figure.SelectionFeedbackPolicy
 */
draw2d.policy.figure.GlowSelectionFeedbackPolicy = draw2d.policy.figure.SelectionFeedbackPolicy.extend({

    NAME : "draw2d.policy.figure.GlowSelectionFeedbackPolicy",
    
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
        figure.setGlow(true);
        this.moved(canvas, figure);
   },
   
   
   /**
    * @method
    * 
    * @param {draw2d.Figure} figure the unselected figure
    */
   onUnselect: function(canvas, figure ){
		this._super(canvas, figure);
		figure.setGlow(false);
   }
     
}); 