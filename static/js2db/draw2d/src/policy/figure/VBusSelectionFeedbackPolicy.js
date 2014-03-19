/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.figure.VBusSelectionFeedbackPolicy
 *  
 * Selection feedback policy for vertical bus figures. 
 *
 * @author Andreas Herz
 * @extends draw2d.policy.figure.BusSelectionFeedbackPolicy
 */
draw2d.policy.figure.VBusSelectionFeedbackPolicy = draw2d.policy.figure.BusSelectionFeedbackPolicy.extend({

    NAME : "draw2d.policy.figure.VBusSelectionFeedbackPolicy",
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
     **/
    moved: function(canvas,figure){
        if(figure.selectionHandles.isEmpty()){
            return; // silently
        }
        var r2= figure.selectionHandles.get(0); 
        var r6= figure.selectionHandles.get(2); 
        var objWidth    = figure.getWidth();
        // adjust the resize handles on the left/right to the new dimension of the shape
        //
        r2.setDimension(objWidth, r2.getHeight());
        r6.setDimension(objWidth, r6.getHeight());
        
        this._super(canvas,figure);
     }
    
    
});
