/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.basic.PolyLine
 * 
 * A PolyLine is a line with more than 2 points.
 *
 * @inheritable
 * @author Andreas Herz
 * @extends draw2d.shape.basic.Line
 */
draw2d.shape.basic.PolyLine = draw2d.shape.basic.Line.extend({
    
	NAME : "draw2d.shape.basic.PolyLine",
	
    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     */
    init: function( router ) {
        
      // internal status handling for performance reasons
      //
      this.svgPathString = null;
      this.oldPoint=null;
    
      this.router = router || draw2d.shape.basic.PolyLine.DEFAULT_ROUTER;
      this.routingRequired = true;
  
      // all line segments with start/end as simple object member
      this.lineSegments = new draw2d.util.ArrayList();

      this._super();
    },
    
    /**
     * @method
     * Set the start point of the line.
     *
     * @param {Number} x the x coordinate of the start point
     * @param {Number} y the y coordinate of the start point
     **/
    setStartPoint:function( x, y){
        this.repaintBlocked=true;
        this._super(x,y);
        this.calculatePath();
        
        this.repaintBlocked=false;
        this.repaint();
    },

    /**
     * Set the end point of the line.
     *
     * @param {Number} x the x coordinate of the end point
     * @param {Number} y the y coordinate of the end point
     **/
    setEndPoint:function(x, y)
    {
        this.repaintBlocked=true;
        this._super(x,y);
        this.calculatePath();
        
        this.repaintBlocked=false;
        this.repaint();
    },

    setJunctionPoint : function(index, x, y) 
    {
        var junctionPoint = this.basePoints.get(index);

        // invalid point or nothing todo
        //
        if (junctionPoint === null || (junctionPoint.x === x && junctionPoint.y === y)) {
            return;
        }

        junctionPoint.x = parseFloat(x);
        junctionPoint.y = parseFloat(y);
        
        this.svgPathString = null;
        this.repaint();

        this.editPolicy.each($.proxy(function(i, e) {
            if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
                e.moved(this.canvas, this);
            }
        }, this));

        return this;
    },

    insertJunctionPointAt:function(index, x, y) 
    {
        var junctionPoint = new draw2d.geo.Point(x,y);

        this.basePoints.insertElementAt(junctionPoint,index);
        
        this.svgPathString = null;
        this.repaint();

        if(!this.selectionHandles.isEmpty()){
	        this.editPolicy.each($.proxy(function(i, e) {
	            if (e instanceof draw2d.policy.figure.SelectionFeedbackPolicy) {
	                e.onUnselect(this.canvas, this);
	                e.onSelect(this.canvas, this);
	            }
	        }, this));
        }

        return this;
    },


    /**
     * @method
     * Remove a junction point from the polyline and return the removed point.
     * 
     * @param index
     * @returns {draw2d.geo.Point} the removed point
     */
    removeJunctionPointAt:function(index) 
    {

        var removedPoint = this.basePoints.removeElementAt(index);
        
        this.svgPathString = null;
        this.repaint();

        if(!this.selectionHandles.isEmpty()){
	        this.editPolicy.each($.proxy(function(i, e) {
	            if (e instanceof draw2d.policy.figure.SelectionFeedbackPolicy) {
	                e.onUnselect(this.canvas, this);
	                e.onSelect(this.canvas, this);
	            }
	        }, this));
        }

        return removedPoint;
    },

    
    /**
     * @method
     * Set the router for this connection.
     * 
     * @param {draw2d.layout.connection.ConnectionRouter} [router] the new router for this connection or null if the connection should use the default routing
     **/
    setRouter:function(router)
    {
      if(this.router !==null){
          this.router.onUninstall(this);
      }
      
      if(typeof router ==="undefined" || router===null){
          this.router = new draw2d.layout.connection.NullRouter();
      }
      else{
          this.router = router;
      }
      
      this.router.onInstall(this);
      
      this.routingRequired =true;
    
      // repaint the connection with the new router
      this.repaint();
      
      return this;
    },
    
    /**
     * @method
     * Return the current active router of this connection.
     *
     * @type draw2d.layout.connection.ConnectionRouter
     **/
    getRouter:function()
    {
      return this.router;
    },
    
    /**
     * @method
     * Calculate the path of the polyline
     * 
     * @private
     */
    calculatePath: function()
    {
        
        if(this.shape===null){
            return;
        }
    
        this.svgPathString = null;
        
        var oldBasePoints = this.basePoints;
        
        // cleanup the routing cache
        //
        this.oldPoint=null;
        this.lineSegments = new draw2d.util.ArrayList();
        this.basePoints = new draw2d.util.ArrayList();
    
        // Use the internal router
        //
        this.router.route(this, oldBasePoints);
        this.routingRequired=false;
    },
    
    /**
     * @private
     **/
    repaint : function()
    {
      if(this.repaintBlocked===true || this.shape===null){
          return;
      }
      
      if(this.svgPathString===null || this.routingRequired===true){
          this.calculatePath();
      }
      
      this._super({path:this.svgPathString, "stroke-linejoin":"round"});
    },
    
    
    
    /**
     * @method
     * Called by the framework during drag&drop operations.
     * 
     * @param {draw2d.Figure} draggedFigure The figure which is currently dragging
     * 
     * @return {draw2d.Figure} the figure which should receive the drop event or null if the element didnt want a drop event
     * @template
     **/
    onDragEnter : function( draggedFigure ){
    	this.setGlow(true);
    	return this;
    },
 
    /**
     * @method
     * Called if the DragDrop object leaving the current hover figure.
     * 
     * @param {draw2d.Figure} draggedFigure The figure which is currently dragging
     * @template
     **/
    onDragLeave:function( draggedFigure ){
    	this.setGlow(false);
    },


    /**
     * @method
     * Return all line segments of the polyline.
     * 
     * @returns {draw2d.util.ArrayList}
     */
    getSegments: function(){
        return this.lineSegments;
    },
    
    /**
     * @method
     * used for the router to add the calculated points
     * 
     * @private
     *
     **/
    addPoint:function(/*:draw2d.geo.Point*/ p, y)
    {
      if(typeof y!=="undefined"){
          p = new draw2d.geo.Point(p, y);
      }
      this.basePoints.add(p);

      if(this.oldPoint!==null){
        // store the painted line segment for the "mouse selection test"
        // (required for user interaction)
        this.lineSegments.add({start: this.oldPoint, end:p});
      }
      this.svgPathString=null;
      this.oldPoint = p;
    },

    /**
     * @see draw2d.Figure#onOtherFigureHasMoved
     **/
    onOtherFigureIsMoving:function(/*:draw2d.Figure*/ figure)
    {
      this.repaintBlocked=true;
      this._super(figure);
      this.calculatePath();
      
      this.repaintBlocked=false;
      this.repaint();
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
    hitTest:function( px, py)
    {
      for(var i = 0; i< this.lineSegments.getSize();i++){
         var line = this.lineSegments.get(i);
         if(draw2d.shape.basic.Line.hit(this.corona, line.start.x,line.start.y,line.end.x, line.end.y, px,py)){
           return true;
         }
      }
      return false;
    },

    /**
     * @method
     * Returns the Command to perform the specified Request or null.
      *
     * @param {draw2d.command.CommandType} request describes the Command being requested
     * 
     * @return {draw2d.command.Command}
     **/
    createCommand:function(request) 
    {
 
      if(request.getPolicy() === draw2d.command.CommandType.DELETE){
        if(this.isDeleteable()===true){
          return new draw2d.command.CommandDelete(this);
        }
      }
      else if(request.getPolicy() === draw2d.command.CommandType.MOVE_JUNCTION){
          if(this.isResizeable()===true){
              return new draw2d.command.CommandMoveJunction(this);
            }
      }
    
      return this._super(request);
    },
    
    getPersistentAttributes : function()
    {   
        var memento = this._super();
        
        memento.router = this.router.NAME;
       
        memento = this.router.getPersistentAttributes(this, memento);
        
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

        if(typeof memento.router !=="undefined"){
            try{
                this.setRouter(eval("new "+memento.router+"()"));
            }
            catch(exc){
                debug.warn("Unable to install router '"+memento.router+"' forced by "+this.NAME+".setPersistendAttributes. Using default");
            }
        }
        
        this.router.setPersistentAttributes(this, memento);
    }
});

/**
 * The default ConnectionRouter for the running applicaiton. Set this to your wanted implementation
 * {@link draw2d.layout.connection.ConnectionRouter}
 */
draw2d.shape.basic.PolyLine.DEFAULT_ROUTER= new draw2d.layout.connection.ManhattanConnectionRouter();
