/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.canvas.SelectionPolicy
 * 
 *
 * @author Andreas Herz
 * @extends draw2d.policy.canvas.CanvasPolicy
 */
draw2d.policy.canvas.SelectionPolicy = draw2d.policy.canvas.CanvasPolicy.extend({

    NAME : "draw2d.policy.canvas.SelectionPolicy",
    
    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
        this._super();
    },
 

    unselect: function(canvas, figure){
        figure.unselect();
        canvas.getSelection().remove(figure);

        canvas.selectionListeners.each(function(i,w){
            w.onSelectionChanged(null);
        });    
   }

});
