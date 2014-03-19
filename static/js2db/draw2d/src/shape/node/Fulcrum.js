/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.node.Fulcrum
 * 
 * A horizontal bus shape with a special kind of port handling. The hole figure is a hybrid port.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     canvas.addFigure( new draw2d.shape.node.Fulcrum(),50,10);
 *     canvas.addFigure( new draw2d.shape.node.Fulcrum(),80,100);
 *     canvas.addFigure( new draw2d.shape.node.Fulcrum(),150,50);
 *     
 * @extends draw2d.shape.node.Hub
 */
draw2d.shape.node.Fulcrum = draw2d.shape.node.Hub.extend({

    NAME : "draw2d.shape.node.Fulcrum",
    
	/**
	 * 
	 */
	init : function()
    {
        this._super(40,40);

        
        this.port.setConnectionAnchor(new draw2d.layout.anchor.ConnectionAnchor(this.port));
        this.port.setVisible(true);
        this.port.hitTest = this.port._orig_hitTest;
        
        this.setConnectionDirStrategy(0);
        this.setColor(null);
        this.setRadius(10);
        this.setBackgroundColor(null);
        this.setStroke(0);
        this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());
   },
   
   /**
     * @inheritdoc
     * 
     * @param attributes
     */
    repaint:function(attributes)
    {
        if(this.repaintBlocked===true || this.shape===null){
            return;
        }
    
        if(typeof attributes === "undefined"){
            attributes = {};
        }
        
        // set some good defaults if the parent didn't
        if(typeof attributes.fill ==="undefined"){
            attributes.fill=this.bgColor.hash();
        }
        
       this._super(attributes);
    }
    
});
