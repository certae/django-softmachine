/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.basic.Diamond
 * A Diamond Figure.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var d1 =  new draw2d.shape.basic.Diamond();
 *     var d2 =  new draw2d.shape.basic.Diamond();
 *     
 *     canvas.addFigure(d1,10,10);
 *     canvas.addFigure(d2,100,10);
 *     
 *     d2.setBackgroundColor("#f0f000");
 *     d2.setAlpha(0.7);
 *     d2.setDimension(100,60);
 *     
 *     canvas.setCurrentSelection(d2);
 *     
 * @author Andreas Herz
 * @extends draw2d.VectorFigure
 */
draw2d.shape.basic.Diamond = draw2d.VectorFigure.extend({
    NAME : "draw2d.shape.basic.Diamond",

    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     * 
     */
    init: function( width, height) {
      this._super();
    
      this.setBackgroundColor("#00a3f6");
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
            return this;
        } 
        
        if (typeof attributes === "undefined") {
            attributes = {};
        }
        
        var box = this.getBoundingBox();
        var path = ["M",box.x+(box.w/2)," ",box.y];         // Go to the top center..
        path.push("L", box.x+box.w, " ", box.y+box.h/2);    // ...draw line to the right middle
        path.push("L", box.x+box.w/2, " ", box.y+ box.h);   // ...bottom center...
        path.push("L", box.x, " ", box.y+box.h/2);          // ...left middle...
        path.push("L", box.x+box.w/2, " ", box.y);          // and close the path
        attributes.path = path.join("");

        this._super(attributes);
        
        return this;
    },


    /**
     * @method
     * Called by the framework. Don't call them manually.
     * 
     * @private
     **/
    createShapeElement:function()
    {
      // create dummy line
      return this.canvas.paper.path("M0 0L1 1");
    }
    
});