/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.node.Start
 * 
 * A generic Node which has an OutputPort. Mainly used for demo and examples.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var figure =  new draw2d.shape.node.Start();
 *     figure.setColor("#3d3d3d");
 *     
 *     canvas.addFigure(figure,50,10);
 *     
 * @extends draw2d.shape.basic.Rectangle
 */
draw2d.shape.state.End = draw2d.shape.basic.Circle.extend({

    NAME : "draw2d.shape.state.End",

	DEFAULT_COLOR : new draw2d.util.Color("#4D90FE"),

	init : function()
    {
        this.innerCircle = new draw2d.shape.basic.Circle(20);

        this._super();
        
        this.port = this.createPort("input", new draw2d.layout.locator.TopLocator(this));
        this.port.setConnectionAnchor(new draw2d.layout.anchor.ShortesPathConnectionAnchor(this.port));
        
        this.setDimension(50, 50);
        this.setBackgroundColor(this.DEFAULT_COLOR);
        this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());
        
        this.innerCircle.setStroke(2);
        this.innerCircle.setBackgroundColor(null);
        this.addFigure(this.innerCircle, new draw2d.layout.locator.CenterLocator(this));

        this.setStroke(0);
        //this.setColor(this.DEFAULT_COLOR.darker());
    },
 
    /**
     * @method
     * 
     * @param w
     * @param h
     */
    setDimension: function(w, h)
    {
        this._super(w,h);
        this.innerCircle.setDimension(this.getWidth()-10,this.getHeight()-10);
    }
});
