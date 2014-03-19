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
draw2d.shape.state.Start = draw2d.shape.basic.Circle.extend({

    NAME : "draw2d.shape.state.Start",

	DEFAULT_COLOR : new draw2d.util.Color("#3369E8"),

	init : function()
    {
        this._super();
        
        this.port = this.createPort("output", new draw2d.layout.locator.BottomLocator(this));
        this.port.setConnectionAnchor(new draw2d.layout.anchor.ShortesPathConnectionAnchor(this.port));
        
        this.setDimension(50, 50);
        this.setBackgroundColor(this.DEFAULT_COLOR);
        this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());

        this.setStroke(0);
        //this.setColor(this.DEFAULT_COLOR.darker());

        var label = new draw2d.shape.basic.Label("START");
        label.setStroke(0);
        label.setFontColor("#ffffff");
        label.setFontFamily('"Open Sans",sans-serif');
        this.addFigure(label, new draw2d.layout.locator.CenterLocator(this));
    }
});
