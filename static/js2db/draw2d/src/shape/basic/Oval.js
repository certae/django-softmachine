/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.basic.Oval
 * Oval figure.
 * 
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var oval =  new draw2d.shape.basic.Oval();
 *     oval.setDimension(150,100);
 *     canvas.addFigure(oval,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends draw2d.VectorFigure
 */
draw2d.shape.basic.Oval = draw2d.VectorFigure.extend({
    NAME : "draw2d.shape.basic.Oval",

    /**
     * 
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     * @param {Number} [width] the width of the Oval
     * @param {Number} [height] the height of the Oval
     */
    init: function(width,height ) {
        this._super( );
        this.setBackgroundColor("#C02B1D");
        this.setColor("#1B1B1B");
        
        if((typeof height === "number") &&(typeof width === "number")){
            this.setDimension(width,height);
        }
        else{
            this.setDimension(50,50);
        }
    },
      

   /** 
    * @template
    **/
   createShapeElement : function()
   {
     var halfW = this.getWidth()/2;
     var halfH = this.getHeight()/2;
     
     return this.canvas.paper.ellipse(this.getAbsoluteX()+halfW, this.getAbsoluteY()+halfH, halfW, halfH);
   },

   /**
    * @inheritdoc
    * 
    * @template
    **/
   repaint: function(attributes)
   {
       if(this.repaintBlocked===true || this.shape===null){
           return;
       }

       if(typeof attributes === "undefined"){
           attributes = {};
       }
       
       
       // don't override cx/cy if inherited class has set the center already.
       if(typeof attributes.rx === "undefined"){
           attributes.rx = this.width/2;
           attributes.ry = this.height/2;
       }
 
       // don't override cx/cy if inherited class has set the center already.
       if(typeof attributes.cx === "undefined"){
           attributes.cx = this.getAbsoluteX()+attributes.rx;
           attributes.cy = this.getAbsoluteY()+attributes.ry;
       }
       
       this._super(attributes);
   },
   
   /*****
   *
   *   intersectEllipseLine
   *   
   *   NOTE: Rotation will need to be added to this function
   *
   *****/
   intersectionWithLine : function(a1, a2) {
	   var rx = this.getWidth()/2;
	   var ry = this.getHeight()/2;
       
	   var result= new draw2d.util.ArrayList();
       
       var origin = new draw2d.geo.Point(a1.x, a1.y);
       var dir    = a2.subtract(a1);
       var center = new draw2d.geo.Point(this.getAbsoluteX()+rx, this.getAbsoluteY()+ry);
       var diff   = origin.subtract(center);
       var mDir   = new draw2d.geo.Point( dir.x/(rx*rx),  dir.y/(ry*ry)  );
       var mDiff  = new draw2d.geo.Point( diff.x/(rx*rx), diff.y/(ry*ry) );

       var a = dir.dot(mDir);
       var b = dir.dot(mDiff);
       var c = diff.dot(mDiff) - 1.0;
       var d = b*b - a*c;

       if ( d < 0 ) {
           // "Outside"
       } else if ( d > 0 ) {
           var root = Math.sqrt(d);
           var t_a  = (-b - root) / a;
           var t_b  = (-b + root) / a;

           if ( (t_a < 0 || 1 < t_a) && (t_b < 0 || 1 < t_b) ) {
               if ( (t_a < 0 && t_b < 0) || (t_a > 1 && t_b > 1) ){
                   //"Outside";
               }
               else{            	   
                   ;//"Inside";
               }
           } else {
               if ( 0 <= t_a && t_a <= 1 )
                   result.add( a1.lerp(a2, t_a) );
               if ( 0 <= t_b && t_b <= 1 )
                   result.add( a1.lerp(a2, t_b) );
           }
       } else {
           var t = -b/a;
           if ( 0 <= t && t <= 1 ) {
               result.add( a1.lerp(a2, t) );
           } else {
               //"Outside";
           }
       }
       
       return result;
   }	 
    
});

