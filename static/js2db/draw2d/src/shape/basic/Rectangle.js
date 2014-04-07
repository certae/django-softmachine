/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.basic.Rectangle
 * A Rectangle Figure.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var rect1 =  new draw2d.shape.basic.Rectangle();
 *     var rect2 =  new draw2d.shape.basic.Rectangle();
 *     
 *     canvas.addFigure(rect1,10,10);
 *     canvas.addFigure(rect2,100,10);
 *     
 *     rect2.setBackgroundColor("#f0f000");
 *     rect2.setAlpha(0.7);
 *     rect2.setDimension(100,60);
 *     rect2.setRadius(10);
 *     
 *     canvas.setCurrentSelection(rect2);
 *     
 * @author Andreas Herz
 * @extends draw2d.VectorFigure
 */
draw2d.shape.basic.Rectangle = draw2d.VectorFigure.extend({
    NAME : "draw2d.shape.basic.Rectangle",

    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     * 
     */
    init: function( width, height) {
       // corner radius
       this.radius = 2;
       this.dasharray = null;
       
      this._super();

      this.setBackgroundColor( new draw2d.util.Color(100,100,100));
      this.setColor("#1B1B1B");

      // set some good defaults
      //
      if(typeof width === "undefined"){
        this.setDimension(50, 90);
      }
      else{
        this.setDimension(width, height);
      }
    },

    /**
     * @inheritdoc
     **/
    repaint : function(attributes)
    {
        if(this.repaintBlocked===true || this.shape===null){
            return;
        }
        
        if (typeof attributes === "undefined") {
            attributes = {};
        }

        if(this.dasharray!==null){
            attributes["stroke-dasharray"]=this.dasharray;
        }
        attributes.width = this.getWidth();
        attributes.height = this.getHeight();
        attributes.r = this.radius;
        this._super(attributes);
    },
    
    /**
     * @private
     */
    applyTransformation:function(){
        this.shape.transform(
                "R"+
                this.rotationAngle);
        
        if(this.getRotationAngle()=== 90|| this.getRotationAngle()===270){
            var ratio = this.getHeight()/this.getWidth();
            var rs = "...S"+ratio+","+1/ratio+","+(this.getAbsoluteX() +this.getWidth()/2)+","+(this.getAbsoluteY() +this.getHeight()/2);
            this.shape.transform(rs);
        }
    },

    /**
     * @method
     * 
     * @inheritdoc
     */
    createShapeElement : function(){
       return this.canvas.paper.rect(this.getAbsoluteX(),this.getAbsoluteY(),this.getWidth(), this.getHeight());
    },

    /**
     * @method
     * Sets the corner radius for rectangles with round corners. 
     * 
     * @param {Number} radius
     */
     setRadius: function(radius){
        this.radius = radius;
        this.repaint();
        
        return this;
    },
    
    /**
     * @method
     * Indicates the corner radius for rectangles with round corners. The default is 2. 
     * 
     * @return {Number}
     */
    getRadius:function() {
        return this.radius;
    },
    
    /**
     * @method
     * set the line style for dot/dash styling. Possible values are
     * 
     * ["", "-", ".", "-.", "-..", ". ", "- ", "--", "- .", "--.", "--.."]
     * experimental only.
     * @param dash
     */
    setDashArray: function(dash){
        this.dasharray = dash;
        this.repaint();
    },
    
    /**
     * @method 
     * Return an objects with all important attributes for XML or JSON serialization
     * 
     * @returns {Object}
     */
    getPersistentAttributes : function(){
        var memento = this._super();
        
        memento.radius = this.radius;
        
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
        
        if(typeof memento.radius ==="number")
        {
            this.radius = memento.radius;
        }
    }
    
});