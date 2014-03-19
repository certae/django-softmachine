/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.basic.Line
 * The base class for all visible elements inside a canvas.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     // Create the line and modify the start/end after inserting them into 
 *     // the canvas
 *     var line1 =  new draw2d.shape.basic.Line();
 *     line1.setStartPoint(30,30);
 *     line1.setEndPoint(100,80);
 *       
 *     canvas.addFigure(line1);
 *     
 *     // Create the line with a given start/end coordinate in the constructor
 *     //
 *     var line2 = new draw2d.shape.basic.Line(20,80,200,150);
 *     line2.setStroke(3);
 *     line2.setColor("#1d1dff");
 *     canvas.addFigure(line2);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends draw2d.Figure
 */
draw2d.shape.basic.Line = draw2d.Figure.extend({
    NAME : "draw2d.shape.basic.Line",

    DEFAULT_COLOR : new draw2d.util.Color(0,0,0),
    
    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     * 
     * @param {Number} startX the x-coordinate of the start
     * @param {Number} startY the y-coordinate of the start
     * @param {Number} endX   the x-coordinate of the end
     * @param {Number} endY   the y-coordinate of the end
     * 
     */
    init: function(startX, startY, endX, endY ) {
        
        // for performance reasons if we made some bulk changes to the object
        // For this case we can block the repaint and enable it after the bulk
        // Update of the properties
        this.repaintBlocked = false;
        
        // click area for the line hit test
        this.corona = 10;
        this.isGlowing = false;
        this.lineColor = this.DEFAULT_COLOR;
        this.stroke=1;

        this.dasharray = null;
        
        if(typeof endY ==="number"){
            this.start = new draw2d.geo.Point(startX,startY);
            this.end   = new draw2d.geo.Point(endX,endY);
        }
        else{
            this.start = new draw2d.geo.Point(30,30);
            this.end   = new draw2d.geo.Point(100,100);
        }

        this.basePoints = new draw2d.util.ArrayList();
        this.basePoints.add(this.start);
        this.basePoints.add(this.end);
        
        this._super();
        
        // create the selections handles/decorations
        this.installEditPolicy(new draw2d.policy.line.LineSelectionFeedbackPolicy());

        this.setSelectable(true);
        this.setDeleteable(true);
   },
   

   /**
    * @method
    * Don't call them manually. This will be done by the framework.<br>
    * Will be called if the object are moved via drag and drop.
    * Sub classes can override this method to implement additional stuff. Don't forget to call
    * the super implementation via <code>this._super(dx, dy, dx2, dy2);</code>
    * @private
    * @param {Number} dx the x difference between the start of the drag drop operation and now
    * @param {Number} dy the y difference between the start of the drag drop operation and now
    * @param {Number} dx2 The x diff since the last call of this dragging operation
    * @param {Number} dy2 The y diff since the last call of this dragging operation
    **/
   onDrag : function( dx, dy, dx2, dy2)
   {
       if(this.command ===null){
           return;
       }
       
       this.command.setTranslation(dx,dy);
       
       this.getPoints().each(function(i,e){
           e.translate(dx2, dy2);
       });

       this._super(dx, dy, dx2, dy2);
       
       this.svgPathString = null;
       this.repaint();
   },

   onDragEnd : function()
   {
       this.setAlpha(this.originalAlpha);
       // Element ist zwar schon an seine Position, das Command muss aber trotzdem
       // in dem CommandStack gelegt werden damit das Undo funktioniert.
       //
       this.isInDragDrop = false;

       if(this.command===null){
           return;
       }

	   // we must undo the interim drag/drop translation of the line. The real translation will be done
	   // by the execute of the command. Yes - you are right. This is a HACK or design flaw :-/
	   this.getPoints().each($.proxy(function(i,e){
           e.translate(-this.command.dx, -this.command.dy);
       },this));


       this.canvas.getCommandStack().execute(this.command);
	   this.command = null;
	   this.isMoving = false;
	   
	   // notify all installed policies
	   //
	   this.editPolicy.each($.proxy(function(i,e){
    	   if(e instanceof draw2d.policy.figure.DragDropEditPolicy){
    		   e.onDragEnd(this.canvas, this);
    	   }
	   },this));
	   
	   // inform all other listener
	   this.fireMoveEvent();
   },

   /**
    * @method
    * Set the line style for this object.
    * 
    * @param dash can be one of this ["", "-", ".", "-.", "-..", ". ", "- ", "--", "- .", "--.", "--.."]
    */
   setDashArray: function(dash){
       this.dasharray = dash;
       
       return this;
   },
   
   
   /**
    * @method
    * Set the width for the click hit test of this line.
    *
    * @param {Number} width the width of the line hit test.
    **/
   setCoronaWidth:function( width)
   {
      this.corona = width;
      
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
     return this.canvas.paper.path("M"+this.start.x+" "+this.start.y+"L"+this.end.x+" "+this.end.y);
   },

   /**
    * @method
    * Trigger the repaint of the element.
    * 
    */
   repaint:function(attributes)
   {
       if(this.repaintBlocked===true || this.shape===null){
           return;
       }

       // don't override existing values
       //
       if(typeof attributes === "undefined"){
           attributes = {"stroke":"#"+this.lineColor.hex(),
                         "stroke-width":this.stroke,
                         "path":["M",this.start.x,this.start.y,"L",this.end.x,this.end.y].join(" ")};
       }
       else{
    	   if(typeof attributes.path ==="undefined"){
    		   attributes.path =["M",this.start.x,this.start.y,"L",this.end.x,this.end.y].join(" ");
    	   }
    	   attributes.stroke = this.lineColor.hash();
    	   attributes["stroke-width"]=this.stroke;
       }
       
       if(this.dasharray!==null){
           attributes["stroke-dasharray"]=this.dasharray;
       }
       
       this._super(attributes);
   },
   
   /**
    * @method
    * Highlight the element or remove the highlighting
    * 
    * @param {Boolean} flag indicates glow/noGlow
    * @template
    */
   setGlow: function(flag){
	   if(this.isGlowing===flag){
		   return;
	   }
	   
	   if(flag===true){
		   // store old values for restore
		   this._lineColor = this.lineColor;
		   this._stroke = this.stroke;
		   
	       this.setColor( draw2d.util.Color("#3f72bf"));
	       this.setStroke((this.stroke*4)|0);
	   }
	   else{
	       this.setColor(this._lineColor);
	       this.setStroke(this._stroke);
	   }
	   
	   this.isGlowing = flag;
	   
	   return this;
   },


   /**
    * You can't drag&drop the resize handles if the line not resizeable.
    * @type boolean
    **/
   isResizeable:function()
   {
     return true;
   },


   /**
    * Set the line width. This enforce a repaint of the line.
    * This method fires a <i>document dirty</i> event.
    *
    * @param {Number} w The new line width of the figure.
    **/
   setStroke:function(w)
   {
     this.stroke=parseFloat(w);
     
     this.repaint();
     
     return this;
   },


   /**
    * @method
    * Set the color of the line.
    * This method fires a <i>document dirty</i> event.
    * 
    * @param {draw2d.util.Color|String} color The new color of the line.
    **/
   setColor:function( color)
   {
     this.lineColor = new draw2d.util.Color(color);
     this.repaint();
     
     return this;
   },

   /**
    * @method
    * Return the current paint color.
    * 
    * @return {draw2d.util.Color} The paint color of the line.
    **/
   getColor:function()
   {
     return this.lineColor;
   },

   /**
    * @method
    * Set the start point of the line.
    * This method fires a <i>document dirty</i> event.
    *
    * @param {Number} x the x coordinate of the start point
    * @param {Number} y the y coordinate of the start point
    **/
   setStartPoint:function( x, y)
   {
     if(this.start.x===x && this.start.y===y){
        return;
     }

     this.start.setPosition(x, y);
     this.repaint();

     this.editPolicy.each($.proxy(function(i,e){
         if(e instanceof draw2d.policy.figure.DragDropEditPolicy){
             e.moved(this.canvas, this);
         }
     },this));
     
     return this;
  },

   /**
    * Set the end point of the line.
    * This method fires a <i>document dirty</i> event.
    *
    * @param {Number} x the x coordinate of the end point
    * @param {Number} y the y coordinate of the end point
    **/
   setEndPoint:function(x, y)
   {
     if(this.end.x===x && this.end.y===y){
        return;
     }

     this.end.setPosition(x, y);
     this.repaint();

     this.editPolicy.each($.proxy(function(i,e){
         if(e instanceof draw2d.policy.figure.DragDropEditPolicy){
             e.moved(this.canvas, this);
         }
     },this));
     
     return this;
 },

   /**
    * @method
    * Return the x coordinate of the start.
    * @deprecated
    * @return {Number}
    **/
   getStartX:function()
   {
     return this.start.x;
   },

   /**
    * @method
    * Return the y coordinate of the start.
    * 
    * @deprecated
    * @return {Number}
    **/
   getStartY:function()
   {
     return this.start.y;
   },

   /**
    * @method
    * Return the start point.
    * 
    * @return {draw2d.geo.Point}
    **/
   getStartPoint:function()
   {
     return this.start.clone();
   },


   /**
    * @method
    * Return the x coordinate of the end point
    * 
    * @deprecated
    * @return {Number}
    **/
   getEndX:function()
   {
     return this.end.x;
   },

   /**
    * @method
    * Return the y coordinate of the end point.
    * 
    * @deprecated
    * @return {Number}
    **/
   getEndY:function()
   {
     return this.end.y;
   },

   /**
    * @method
    * Return the end point.
    * 
    * @return {draw2d.geo.Point}
    **/
   getEndPoint:function()
   {
     return this.end.clone();
   },


   /**
    * @method
    * Returns the fulcrums of the connection
    *
    * @return {draw2d.util.ArrayList} an draw2d.util.ArrayList of type draw2d.Point
    **/
   getPoints:function()
   {
       return this.basePoints;
   },
   
   getSegments: function()
   {
       var result = new draw2d.util.ArrayList();
       result.add({start: this.getStartPoint(), end: this.getEndPoint()});
       
       return result;
   },
   
   /**
    * @method
    * Returns the length of the line.
    * 
    * @return {Number}
    **/
   getLength:function()
   {
     // call native path method if possible
     if(this.shape!==null){
       return this.shape.getTotalLength();
     }
       
     return Math.sqrt((this.start.x-this.end.x)*(this.start.x-this.end.x)+(this.start.y-this.end.y)*(this.start.y-this.end.y));
   },

   /**
    * @method
    * Returns the angle of the line in degree.
    *
    * <pre>
    *                                 270°
    *                               |
    *                               |
    *                               |
    *                               |
    * 180° -------------------------+------------------------> +X
    *                               |                        0°
    *                               |
    *                               |
    *                               |
    *                               V +Y
    *                              90°
    * </pre>
    * @return {Number}
    **/
   getAngle:function()
   {
     var length = this.getLength();
     var angle = -(180/Math.PI) *Math.asin((this.start.y-this.end.y)/length);

     if(angle<0)
     {
        if(this.end.x<this.start.x){
          angle = Math.abs(angle) + 180;
        }
        else{
          angle = 360- Math.abs(angle);
        }
     }
     else
     {
        if(this.end.x<this.start.x){
          angle = 180-angle;
        }
     }
     return angle;
   },

   /**
    * @method
    * Returns the Command to perform the specified Request or null if the shape want cancel the 
    * operation or it can't operate the command.
    *
    * @param {draw2d.command.CommandType} request describes the Command being requested
    * @return {draw2d.command.Command} null or a Command
    **/
   createCommand:function( request)
   {
     if(request.getPolicy() === draw2d.command.CommandType.MOVE)
     {
         if(this.isDraggable()){
             return new draw2d.command.CommandMoveLine(this);
          }
     }
     if(request.getPolicy() === draw2d.command.CommandType.DELETE)
     {
        if(this.isDeleteable()===false){
           return null;
        }
        return new draw2d.command.CommandDelete(this);
     }
     
     return null;
   },

   /**
    * @method
    * Checks if the hands over coordinate close to the line. The 'corona' is considered
    * for this test. This means the point isn't direct on the line. Is it only close to the
    * line!
    *
    * @param {Number} px the x coordinate of the test point
    * @param {Number} py the y coordinate of the test point
    * @return {boolean}
    **/
   hitTest: function( px, py)
   {
     return draw2d.shape.basic.Line.hit(this.corona, this.start.x,this.start.y, this.end.x, this.end.y, px,py);
   },
   
   /**
    * @method
    * Return all intersection points between the given Line.
    * 
    * @param other
    * @returns {draw2d.util.ArrayList}
    */
   intersection: function (other){
       var result = new draw2d.util.ArrayList();
       
       // empty result. the lines are equal...infinit array
       if(other === this){
           return result;
       }
       
       var segments1= this.getSegments();
       var segments2= other.getSegments();
       
       segments1.each(function(i, s1){
           segments2.each(function(j, s2){
               var p= draw2d.shape.basic.Line.intersection(s1.start, s1.end, s2.start, s2.end);
               if(p!==null){
                   result.add(p);
               }
           });
       });
       return result;
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
       delete memento.x;
       delete memento.y;
       delete memento.width;
       delete memento.height;

       memento.stroke = this.stroke;
       memento.color  = this.getColor().hash();
       if(this.editPolicy.getSize()>0){
           memento.policy = this.editPolicy.getFirstElement().NAME;
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
   setPersistentAttributes : function(memento)
   {
       this._super(memento);

       if(typeof memento.stroke !=="undefined"){
           this.setStroke(parseFloat(memento.stroke));
       }
       if(typeof memento.color !=="undefined"){
           this.setColor(memento.color);
       }
       if(typeof memento.policy !=="undefined"){
           try{
               this.installEditPolicy(eval("new "+memento.policy +"()" ));
           }
           catch(exc){
               debug.warn("Unable to install edit policy '"+memento.policy+"' forced by "+this.NAME+".setPersistendAttributes. Using default.");
           }
       }
   }
});


/**
 * see: http://en.wikipedia.org/wiki/Line-line_intersection
 * 
 * @param {draw2d.geo.Point} a1
 * @param {draw2d.geo.Point} a2
 * @param {draw2d.geo.Point} b1
 * @param {draw2d.geo.Point} b2
 * @returns
 */
draw2d.shape.basic.Line.intersection = function(a1, a2, b1, b2) {
    var result=null;
    
    var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

    if ( u_b != 0 ) {
        var ua = ua_t / u_b;
        var ub = ub_t / u_b;

        if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
//        if ( 0 < ua && ua < 1 && 0 < ub && ub < 1 ) {
            result = new draw2d.geo.Point((a1.x + ua * (a2.x - a1.x))|0, (a1.y + ua * (a2.y - a1.y))|0);
            
            // determine if the lines are crossing or just touching
            //
            result.justTouching=( 0 == ua || ua == 1 || 0 == ub || ub == 1 );
        }
    }
    /*
    else {
        if ( ua_t == 0 || ub_t == 0 ) {
            result = null;// Coincident
        } else {
            result = null; // Parallel
        }
    }
    */
    return result;
};

/**
 * Static util function to determine is a point(px,py) on the line(x1,y1,x2,y2)
 * A simple hit test.
 * 
 * @return {boolean}
 * @static
 * @private
 * @param {Number} coronaWidth the accepted corona for the hit test
 * @param {Number} X1 x coordinate of the start point of the line
 * @param {Number} Y1 y coordinate of the start point of the line
 * @param {Number} X2 x coordinate of the end point of the line
 * @param {Number} Y2 y coordinate of the end point of the line
 * @param {Number} px x coordinate of the point to test
 * @param {Number} py y coordinate of the point to test
 **/
draw2d.shape.basic.Line.hit= function( coronaWidth, X1, Y1,  X2,  Y2, px, py)
{
  // Adjust vectors relative to X1,Y1
  // X2,Y2 becomes relative vector from X1,Y1 to end of segment
  X2 -= X1;
  Y2 -= Y1;
  // px,py becomes relative vector from X1,Y1 to test point
  px -= X1;
  py -= Y1;
  var dotprod = px * X2 + py * Y2;
  var projlenSq;
  if (dotprod <= 0.0) {
      // px,py is on the side of X1,Y1 away from X2,Y2
      // distance to segment is length of px,py vector
      // "length of its (clipped) projection" is now 0.0
      projlenSq = 0.0;
  } else {
      // switch to backwards vectors relative to X2,Y2
      // X2,Y2 are already the negative of X1,Y1=>X2,Y2
      // to get px,py to be the negative of px,py=>X2,Y2
      // the dot product of two negated vectors is the same
      // as the dot product of the two normal vectors
      px = X2 - px;
      py = Y2 - py;
      dotprod = px * X2 + py * Y2;
      if (dotprod <= 0.0) {
          // px,py is on the side of X2,Y2 away from X1,Y1
          // distance to segment is length of (backwards) px,py vector
          // "length of its (clipped) projection" is now 0.0
          projlenSq = 0.0;
      } else {
          // px,py is between X1,Y1 and X2,Y2
          // dotprod is the length of the px,py vector
          // projected on the X2,Y2=>X1,Y1 vector times the
          // length of the X2,Y2=>X1,Y1 vector
          projlenSq = dotprod * dotprod / (X2 * X2 + Y2 * Y2);
      }
  }
    // Distance to line is now the length of the relative point
    // vector minus the length of its projection onto the line
    // (which is zero if the projection falls outside the range
    //  of the line segment).
    var lenSq = px * px + py * py - projlenSq;
    if (lenSq < 0) {
        lenSq = 0;
    }
    return Math.sqrt(lenSq)<coronaWidth;
};

