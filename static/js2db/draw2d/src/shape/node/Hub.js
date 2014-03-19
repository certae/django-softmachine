/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.node.Hub
 * 
 * A hub is a shape with a special kind of port handling. The hole figure is a hybrid port. You can drag&drop a Port directly on
 * the figure.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var figure =  new draw2d.shape.node.Hub();
 *     
 *     canvas.addFigure(figure,50,10);
 *     
 * @extends draw2d.shape.basic.Rectangle
 */
draw2d.shape.node.Hub = draw2d.shape.basic.Rectangle.extend({

    NAME : "draw2d.shape.node.Hub",

    DEFAULT_COLOR : new draw2d.util.Color("#4DF0FE"),
    BACKGROUND_COLOR : new draw2d.util.Color("#29AA77"),

	/**
	 * 
	 * @param {Number} width initial width of the bus shape
	 * @param {Number} height height of the bus
	 */
	init : function(width, height, labelString)
    {
 	    this.label = null;
	    
        this._super(width,height);
        
        this.port = this.createPort("hybrid", new draw2d.layout.locator.CenterLocator(this));

        this.CONNECTION_DIR_STRATEGY= [ $.proxy(function(conn, relatedPort){ return this.getParent().getBoundingBox().getDirection(relatedPort.getAbsolutePosition());},this.port),
                                        $.proxy(function(conn, relatedPort){ return this.getAbsoluteY()>relatedPort.getAbsoluteY()?0:2;},this.port),
                                        $.proxy(function(conn, relatedPort){ return this.getAbsoluteX()>relatedPort.getAbsoluteX()?3:1;},this.port)];

        // redirect the glow effect and the hitTest for the port to the parent node
        //
        this.port.setGlow = $.proxy(this.setGlow,this);
        this.port._orig_hitTest = this.port.hitTest;
        this.port.hitTest = $.proxy(this.hitTest,this);
       
        
        // provide a special connection anchor for this port. We use the bounding box of the
        // parent as connection border
        //
        this.port.setConnectionAnchor(new draw2d.layout.anchor.ShortesPathConnectionAnchor(this.port));
        this.port.setVisible(false);
        
        // set some good defaults
        //
        if(typeof height ==="undefined"){
            this.setDimension(150, 50);
        }
        
        this.setConnectionDirStrategy(0);
        
        // set the border of the rectangle a little bit darker than the 
        // inner part
        //
        this.setColor(this.DEFAULT_COLOR.darker());
        this.setBackgroundColor(this.BACKGROUND_COLOR);
        if(typeof labelString !== "undefined"){
            this.setLabel(labelString);
        }
    },
    
      /**
      * @method
      * 
      * @param draggedFigure
      * @return {draw2d.Figure} the figure which should receive the drop event or null if the element didnt want a drop event
      */
     onDragEnter : function( draggedFigure )
     {
         // redirect the dragEnter handling to the hybrid port
         //
  		 return this.getHybridPort(0).onDragEnter(draggedFigure);
     },
     
     /**
      * @method
      * This value is relevant for the interactive resize of the figure.
      *
      * @return {Number} Returns the min. width of this object.
      */
     getMinWidth:function()
     {
         if(this.label!==null){
             return Math.max(this.label.getMinWidth(), this._super());
         }
         return this._super();
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
             if(this.bgColor!==null){
                 attributes.fill="90-"+this.bgColor.hash()+":5-"+this.bgColor.lighter(0.3).hash()+":95";
             }
             else{
                 attributes.fill ="none";
             }
        }
         
        this._super(attributes);
     },
     
     /**
      * @method
      * set the label for the Hub
      * 
      * @param {String} labelString
      * @since 3.0.4
      */
     setLabel: function( labelString){
         // Create any Draw2D figure as decoration for the connection
         //
         if(this.label===null){
             this.label = new draw2d.shape.basic.Label(labelString);
             this.label.setColor("#0d0d0d");
             this.label.setFontColor("#0d0d0d");
             this.label.setStroke(0);
             // add the new decoration to the connection with a position locator.
             //
             this.addFigure(this.label, new draw2d.layout.locator.CenterLocator(this));
         }
         else{
             this.label.setText();
         }
         
     },
     
     /**
      * @method
      * Set the strategy for the connection direction calculation.<br>
      * <br>
      * 
      * <ul>
      * <li>0 - Use the best/shortest direction (UP/RIGHT/DOWN/LEFT) for the connection routing (default)</li>
      * <li>1 - Use UP/DOWN for the connection direction</li>
      * <li>2 - Use LEFT/RIGHT</li>
      * </ul>
      * @param {Number} strategy the connection routing strategy to use
      * @since 2.4.3
      */
     setConnectionDirStrategy: function(strategy){
         switch(strategy){
             case 0:
             case 1:
             case 2:
                 this.port.getConnectionDirection= this.CONNECTION_DIR_STRATEGY[strategy];
                 break;
         }
     },
     
     /**
      * @method 
      * Return an objects with all important attributes for XML or JSON serialization
      * 
      * @returns {Object}
      */
     getPersistentAttributes : function(){
         var memento = this._super();
         
         memento.dirStrategy = this.CONNECTION_DIR_STRATEGY.indexOf(this.port.getConnectionDirection);
         if(this.label !==null){
             memento.label = this.label.getText();
         }
         
         return memento;
     },
     
     /**
      * @method 
      * Read all attributes from the serialized properties and transfer them into the shape.
      * 
      * @param {Object} memento
      * @returns 
      */
     setPersistentAttributes : function(memento) {
         this._super(memento);
         
         if(typeof memento.dirStrategy ==="number") {
             this.setConnectionDirStrategy( memento.dirStrategy);
         }
         
         if(typeof memento.label !== "undefined"){
             this.setLabel(memento.label);
         }
     }
     
});
