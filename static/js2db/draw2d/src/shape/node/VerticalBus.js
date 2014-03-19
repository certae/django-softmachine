/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.node.VerticalBus
 * 
 * A horizontal bus shape with a special kind of port handling. The hole figure is a hybrid port.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var figure =  new draw2d.shape.node.VerticalBus(40,300,"Vertical Bus");
 *     
 *     canvas.addFigure(figure,50,10);
 *     
 * @extends draw2d.shape.node.Hub
 */
draw2d.shape.node.VerticalBus = draw2d.shape.node.Hub.extend({

    NAME : "draw2d.shape.node.VerticalBus",

	/**
	 * 
	 * @param {Number} width initial width of the bus shape
	 * @param {Number} height height of the bus
	 */
	init : function(width, height, labelString)
    {
        this._super(width,height,labelString);
        

        this.setConnectionDirStrategy(2);
        this.installEditPolicy(new draw2d.policy.figure.VBusSelectionFeedbackPolicy());
    },
    
    
    /**
     * @method
     * set the label for the Hub
     * 
     * @param {String} labelString
     * @since 3.0.4
     */
    setLabel: function( labelString){
        var mustAdjustTheAngel = this.label === null;
        
        this._super(labelString);
        
        if(mustAdjustTheAngel===true && this.label !==null){
            this.label.setRotationAngle(90);
        }
    },
    
    
    /**
     * @method
     * This value is relevant for the interactive resize of the figure.
     *
     * @return {Number} Returns the min. height of this object.
     */
    getMinHeight:function()
    {
        if (this.shape === null && this.label === null) {
            return 0;
        }
        
        if(this.label!==null){
            return this.label.getMinWidth();
        }
        
        return this._super();
    },
    
    /**
     * @method
     * This value is relevant for the interactive resize of the figure.
     *
     * @return {Number} Returns the min. height of this object.
     */
    getMinWidth:function()
    {
        if (this.shape === null && this.label === null) {
            return 0;
        }
        
        if(this.label!==null){
            return this.label.getMinHeight();
        }
        
        return this._super();
    }

    
});
