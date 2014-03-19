/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.figure.HBusSelectionFeedbackPolicy
 * 
 *
 * @author Andreas Herz
 * @extends draw2d.policy.figure.BusSelectionFeedbackPolicy
 */
draw2d.policy.figure.HBusSelectionFeedbackPolicy = draw2d.policy.figure.BusSelectionFeedbackPolicy.extend({

    NAME : "draw2d.policy.figure.HBusSelectionFeedbackPolicy",
    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
        this._super();
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
        var r4= figure.selectionHandles.get(1); 
        var r8= figure.selectionHandles.get(3); 

        r4.setDimension(r4.getWidth(), figure.getHeight());
        r8.setDimension(r4.getWidth(), figure.getHeight());
        
        this._super(canvas,figure);
     }
    
    
});
