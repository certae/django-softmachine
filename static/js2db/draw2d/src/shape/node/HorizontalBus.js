/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.node.HorizontalBus
 * 
 * A horizontal bus shape with a special kind of port handling. The hole figure is a hybrid port.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var figure =  new draw2d.shape.node.HorizontalBus(300,20,"Horizontal Bus");
 *     
 *     canvas.addFigure(figure,50,10);
 *     
 * @extends draw2d.shape.node.Hub
 */
draw2d.shape.node.HorizontalBus = draw2d.shape.node.Hub.extend({

    NAME : "draw2d.shape.node.HorizontalBus",

	/**
	 * 
	 * @param {Number} width initial width of the bus shape
	 * @param {Number} height height of the bus
	 */
	init : function(width, height, label)
    {
        this._super(width,height,label);
        
        this.setConnectionDirStrategy(1);

        this.installEditPolicy(new draw2d.policy.figure.HBusSelectionFeedbackPolicy());
    }
    
});
