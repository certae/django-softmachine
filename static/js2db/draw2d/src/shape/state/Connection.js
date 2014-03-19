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
draw2d.shape.state.Connection = draw2d.Connection.extend({

    NAME : "draw2d.shape.state.Connection",

	DEFAULT_COLOR : new draw2d.util.Color("#4D90FE"),

	init : function()
    {
        this._super();
        this.setRouter(draw2d.shape.state.Connection.DEFAULT_ROUTER);

        this.setStroke(2);
        this.setTargetDecorator(new draw2d.decoration.connection.ArrowDecorator(17,8));


        this.label = new draw2d.shape.basic.Label("label");
        this.label.setStroke(1);
        this.label.setPadding(2);
        this.label.setBackgroundColor("#f0f0f0");
        this.addFigure(this.label, new draw2d.layout.locator.PolylineMidpointLocator(this));
      
    },
    /**
     * @method
     * Set the text to show if the state shape
     * 
     * @param {String} text
     */
    setLabel: function (text)
    {
        this.label.setText(text);
        
        // hide the label if no text available
        this.label.setVisible(!(text===null || text ===""));
        
        return this;
    },
    
    
    /**
     * @method
     * Return the label of the shape
     * 
     */
    getLabel: function ()
    {
        return this.label.getText();
    },
    

    /**
     * @method 
     * Return an objects with all important attributes for XML or JSON serialization
     * 
     * @returns {Object}
     */
    getPersistentAttributes : function()
    {
        var memento = this._super();

        memento.label = this.getLabel();
        
        return memento;
    },
    
    /**
     * @method 
     * Read all attributes from the serialized properties and transfer them into the shape.
     * 
     * @param {Object} memento
     * @returns 
     */
    setPersistentAttributes : function(memento)
    {
        this._super(memento);

        if(typeof memento.label !=="undefined"){
            this.setLabel(memento.label);
        }

    }

});

draw2d.shape.state.Connection.DEFAULT_ROUTER = new draw2d.layout.connection.FanConnectionRouter();

