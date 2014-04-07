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
    
    /**
     * @method
     * Add a child figure to the shape and use the locator from the inherit class
     * 
     * @param {draw2d.Figure} child
     */
    addFigure : function(child)
    {
       this._super(child, this.locator);
       child.attachResizeListener(this);
       this.fireResizeEvent();
    },

    /**
     * @method
     * Remove the giben figure from the shape and recalculate the layout.
     * 
     * @param {drawd.Figure} child
     * @since 4.0.0
     */
    removeFigure : function(child)
    {
       this._super(child);
       child.detachResizeListener(this);
       this.setDimension(1,1);
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
    

    onDoubleClick:function()
    {
        // ignore them for the layout elements
        // Layout's can't rotate
    }
    
});