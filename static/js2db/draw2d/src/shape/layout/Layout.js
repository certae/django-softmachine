/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.layout.Layout
 * 
 * A base class for positioning child figures and determining the ideal size for 
 * a figure with children. 
 * 
 *     
 * @author Andreas Herz
 * @extends draw2d.shape.basic.Rectangle
 */
draw2d.shape.layout.Layout= draw2d.shape.basic.Rectangle.extend({

	NAME : "draw2d.shape.layout.Layout",

    /**
     * @constructor
     * 
     * 
     */
    init : function()
    {
        this._super();
         
        this.setBackgroundColor(null);
        this.setRadius(0);
        this.setStroke(0);
        this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());
    },
    
    
    addFigure : function(child, locator)
    {
       this._super(child, this.locator);
       child.attachResizeListener(this);
    },
    
    
    onOtherFigureIsResizing:function(figure)
    {
        // propagate the event to the parent or other listener if existing
        //
        if(this.getParent() instanceof draw2d.shape.layout.Layout){
            this.fireResizeEvent();
        }
        // or we are the parent and must consume it self
        else {
            this.setDimension(1,1);
        }
    },
    

    onDoubleClick:function(angle)
    {
    	// ignore them for the layout elements
        // Layout's can't rotate
    }
    
});



