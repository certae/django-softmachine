/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/

/**
 * @class draw2d.shape.basic.Circle
 * A circle figure with basic background and stroke API. <br>
 * A circle can not be streched. <strong>The aspect ration is always 1:1</strong>.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var shape =  new draw2d.shape.basic.Circle();
 *     shape.setStroke(3);
 *     shape.setColor("#3d3d3d");
 *     shape.setBackgroundColor("#3dff3d");
 *     
 *     canvas.addFigure(shape,40,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends draw2d.shape.basic.Oval
 */
draw2d.shape.basic.Circle = draw2d.shape.basic.Oval.extend({
    
    NAME : "draw2d.shape.basic.Circle", 
    
    /**
     * @constructor
     * Create a new circle figure.
     * 
     * @param {Number} [radius] the initial radius for the circle
     */
    init:function( radius)
    {
      this._super();
      this.setKeepAspectRatio(true);
      
      if(typeof radius === "number"){
        this.setDimension(radius,radius);
      }
      else {
         this.setDimension(40,40);
      }
    },
    
    /**
     * @method
     * Set the diameter of the circle. The center of the circle will be retained.
     * 
     * @param {Number} d The new diameter of the circle.
     * @since 4.0.0
     **/
    setDiameter:function(d)
    {
        var center = this.getCenter();
        this.setDimension(d,d);
        this.setCenter(center); 
        
        return this;
    },

    /**
     * @method
     * Get the diameter of the circle.
     * 
     * @since 4.0.0
     **/
    getDiameter:function()
    {
        return this.getWidth();
    },

    
    /**
     * @method
     * Set the radius of the circle. The center of the circle will be retained.
     * 
     * @param {Number} d The new radius of the circle.
     * @since 4.0.0
     **/
    setRadius:function(r)
    {
        this.setDiameter(r*2);
        
        return this;
    },

    
    /**
     * @method
     * Get the center of the circle
     * 
     */
    getCenter: function(){
        var d2= this.getDiameter()/2;
        return this.getPosition().translate(d2,d2);
    },

    /**
     * @method
     * Set the center of the circle.
     * 
     * @param {Number|draw2d.geo.Point} x the new x coordinate of the center or a draw2d.geo.Point object with the center
     * @param {Number} y the y coordinate of the new center of the first argument isn't a draw2d.geo.Point object
     */
    setCenter: function(x, y){
        var pos = new draw2d.geo.Point(x,y);
        var d2  = this.getDiameter()/2;
        pos.translate(-d2,-d2);
        this.setPosition(pos);
        
        return this;
    }
});