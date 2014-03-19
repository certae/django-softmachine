/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.icon.Icon
 * @inheritable
 * @author Andreas Herz
 * @extends draw2d.VectorFigure
 */
draw2d.shape.icon.Icon = draw2d.SetFigure.extend({
    NAME : "draw2d.shape.icon.Icon",

    /**
     * 
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     * @param {Number} [width] the width of the Oval
     * @param {Number} [height] the height of the Oval
     */
    init: function(width, height) {
      this._super(width, height);
      this.setBackgroundColor("#333333");
    },

    /**
     * @method
     * propagate all attributes like color, stroke,... to the shape element
     **/
    repaint : function(attributes)
    {
        if(this.repaintBlocked===true || this.shape===null){
            return;
        }

        if (typeof attributes === "undefined") {
            attributes = {};
        }
        
        // redirect the bgColor to the inner set and not to the outer container
        //
        attributes.fill="none";
        if(this.svgNodes!==null) {
            this.svgNodes.attr({fill: this.bgColor.hash(), stroke:"none"});
        }
        
        this._super(attributes);
    },

    applyTransformation:function(){
        if (this.isResizeable()===true) {
            this.svgNodes.transform("S"+this.scaleX+","+this.scaleY+","+this.getAbsoluteX()+","+this.getAbsoluteY()+ "t"+ (this.getAbsoluteX()-this.offsetX) + "," + (this.getAbsoluteY()-this.offsetY));
        }
        else {
            this.svgNodes.transform("T" + (this.getAbsoluteX()-this.offsetX) + "," + (this.getAbsoluteY()-this.offsetY));
        }
    },
    
    /**
     * @private
     */
    createShapeElement : function()
    {
    	var shape = this._super();
    	
        var bb = this.svgNodes.getBBox();

        this.offsetX = bb.x;
        this.offsetY = bb.y;
       
        return shape;
    },
 
    /**
     * @method
     * It is not possible to set different values width and height for a circle. The 
     * greater value of w and h will be used only.
     * 
     * @param {Number} w The new width of the circle.
     * @param {Number} h The new height of the circle.
     **/
    setDimension:function( w,  h)
    {
      if(w>h){
         this._super(w,w);
      }
      else{
         this._super(h,h);
      }
    }
    
});

