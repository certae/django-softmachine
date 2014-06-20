/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.shape.basic.Polygon
 * A Polygon figure.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var p1 =  new draw2d.shape.basic.Polygon();
 *     var p2 =  new draw2d.shape.basic.Polygon();
 *     
 *     canvas.addFigure(p1,10,10);
 *     canvas.addFigure(p2,100,10);
 *     
 *     p2.setBackgroundColor("#f0f000");
 *     p2.setAlpha(0.7);
 *     p2.setDimension(100,60);
 *     
 *     canvas.setCurrentSelection(p2);
 *     
 * @author Andreas Herz
 * @extends draw2d.VectorFigure
 */
draw2d.shape.basic.Polygon = draw2d.VectorFigure.extend({
    
    NAME: "draw2d.shape.basic.Polygon",
    
    init:function(w,h)
    {
      this._super();
      this.radius = 0;
      this.vertices   = new draw2d.util.ArrayList();
      
      if(typeof w==="undefined"){
          w = 50;
          h = 50;
      }
      this.addVertex(new draw2d.geo.Point(0,0) );
      this.addVertex(new draw2d.geo.Point(w,0) );
      this.addVertex(new draw2d.geo.Point(w,h) );
      
      this.svgPathString=null;
      
      this.installEditPolicy(new draw2d.policy.figure.VertexSelectionFeedbackPolicy());
    },
    
    /**
     * @method
     * Sets the corner radius or the edges. 
     * 
     * @param {Number} radius
     * @since 4.2.1
     */
     setRadius: function(radius){
        this.radius = radius;
        this.svgPathString =null;
        this.repaint();
        
        return this;
    },
    
    /**
     * @method
     * Get the corner radius of the edges.
     * 
     * @return {Number}
     * @since 4.2.1
     */
    getRadius:function() {
        return this.radius;
    },
    
 
    /**
     * @method
     * Called by the framework. Don't call them manually.
     * 
     * @private
     **/
    createShapeElement:function()
    {
        // return some good default...
        return this.canvas.paper.path("M0 10L100 100");
    },

    /**
     * @method
     * calculate the path of the polygon
     * 
     */
    calculatePath: function(){
        var radius = this.getRadius();
        var path = [];
        if(radius ===0){
            var length = this.vertices.getSize();
            var p = this.vertices.get(0);
            path.push("M",(p.x|0)+0.5," ",(p.y|0)+0.5);
            for(var i=1;i<length;i++){
                  p = this.vertices.get(i);
                  path.push("L", (p.x|0)+0.5, " ", (p.y|0)+0.5);
            }
            path.push("Z");
        }
        else{
            length = this.vertices.getSize();
            var start = this.vertices.first();
            var end   = this.vertices.last();
            var begin   = this.insetPoint(start,end, radius);
            path.push("M", (begin.x|0)+0.5, ",", (begin.y|0)+0.5);
            for( var i=0 ;i<length;i++){
                  start = this.vertices.get(i);
                  end   = this.vertices.get((i+1)%length);
                  modStart = this.insetPoint(start,end, radius);
                  modEnd   = this.insetPoint(end,start,radius);
                  path.push("Q",start.x,",",start.y," ", (modStart.x|0)+0.5, ", ", (modStart.y|0)+0.5);
                  path.push("L", (modEnd.x|0)+0.5, ",", (modEnd.y|0)+0.5);
            }
        }
        this.svgPathString = path.join("");
        return this;
    },
    
    insetPoint: function(start, end, distanceFromStart){
        if(start.equals(end)){
            return start;
        }
        var vx = start.x-end.x;
        var vy = start.y-end.y;
        var length = Math.sqrt(vx*vx + vy*vy);
        var localDistance = Math.min(length/2,distanceFromStart);
        return {x: end.x + vx/length * (length - localDistance),
               y: end.y + vy/length * (length - localDistance)};

    },
    
    /**
     * @method
     * Trigger the repaint of the element.
     * 
     */
    repaint:function(attributes)
    {
        if(this.shape===null){
            return;
        }

        if(this.svgPathString===null){
            this.calculatePath();
        }
        
        if(typeof attributes === "undefined"){
            attributes = {};
        }
        
        if(typeof attributes.path ==="undefined"){
            attributes.path = this.svgPathString;
        }
        
        this._super(attributes);
    },


    /**
     * @method
     * Translate the figure with the given x/y offset. This method modifies all
     * vertices and the bounding box.
     *
     * @param {Number} dx The new x translate offset
     * @param {Number} dy The new y translate offset
     **/
    translate:function(dx , dy )
    {
        this.vertices.each(function(i,e){
            e.translate(dx,dy);
        });
        this.svgPathString = null;
        this.repaint();
        
        this.updateBoundingBox();
        
        // Update the resize handles if the user change the position of the
        // element via an API call.
        //
        this.editPolicy.each($.proxy(function(i, e) {
            if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
                e.moved(this.canvas, this);
            }
        }, this));

        this.fireMoveEvent();

        return this;
    },
  
    /**
     * @method
     * Change the position of the polygon. This method call updates all vertices.
     * 
     * @param x
     * @param y
     */
    setPosition : function(x, y) {
        var dx = x-this.minX;
        var dy = y-this.minY;
        this.translate(dx,dy);
        
        return this;
    },
    
    /**
     * @method
     * Change the dimension of the polygon. Note - This is not done by view transformation. It
     * is done by modify all vertices.
     * 
     * @param w
     * @param h
     */
    setDimension:function(w, h){
        var oldWidth = this.width;
        var oldHeight= this.height;
        
        this._super(w,h);
        
        var fracWidth  = (1/oldWidth)*this.width;
        var fracHeight = (1/oldHeight)*this.height;
        
        this.vertices.each($.proxy(function(i,e){
            // calculate difference between point and figure origin
            var diffX = (e.getX()-this.x)*fracWidth;
            var diffY = (e.getY()-this.y)*fracHeight;
            e.setPosition(this.x+diffX,this.y+diffY);
        },this));

        this.svgPathString = null;
        this.repaint();
        
        return this;
    },
    
    /**
     * @method
     * Return all vertices of the polygon.
     * 
     * @returns {draw2d.util.ArrayList}
     */
    getVertices: function(){
        return this.vertices;
    },
    
    /**
     * @method
     * Update the vertex at the given index. The method call didn't have any effect 
     * if the vertex didn't exists.
     * 
     * @param index
     * @param x
     * @param y
     */
    setVertex : function(index, x, y) 
    {
        var vertex = this.vertices.get(index);

        // invalid point or nothing todo
        //
        if (vertex === null || (vertex.x === x && vertex.y === y)) {
            return;
        }

        vertex.x = parseFloat(x);
        vertex.y = parseFloat(y);
        
        this.svgPathString = null;
        this.repaint();

        this.updateBoundingBox();
        
        this.editPolicy.each($.proxy(function(i, e) {
            if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
                e.moved(this.canvas, this);
            }
        }, this));

        return this;
    },
    
    /**
     * @method
     * Append a new vertex to the polygon.
     * 
     * @param x
     * @param y
     */
    addVertex : function( x, y) 
    {
        var vertex = null;
        if(x instanceof draw2d.geo.Point){
            vertex =x.clone();
        }
        else{
            vertex =new draw2d.geo.Point(x,y);
        }
        this.vertices.add(vertex);
        
      
        this.svgPathString = null;
        this.repaint();

        this.updateBoundingBox();
        
        this.editPolicy.each($.proxy(function(i, e) {
            if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
                e.moved(this.canvas, this);
            }
        }, this));

        return this;
    },

    /**
     * Insert a new vertex at the given index. All vertices will be shifted to 
     * free the requested index.
     * 
     * @param index
     * @param x
     * @param y
     */
    insertVertexAt:function(index, x, y) 
    {
        var vertex = new draw2d.geo.Point(x,y);

        this.vertices.insertElementAt(vertex,index);
        
        this.svgPathString = null;
        this.repaint();

        this.updateBoundingBox();
        
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
     * Remove a vertex from the polygon and return the removed point.
     * 
     * @param index
     * @returns {draw2d.geo.Point} the removed point
     */
    removeVertexAt:function(index) 
    {
        // a polygon need at least 3 vertices
        //
        if(this.vertices.getSize()<=3){
            return null;
        }
        
        var vertex = this.vertices.removeElementAt(index);
        
        this.svgPathString = null;
        this.repaint();

        this.updateBoundingBox();
        
        if(!this.selectionHandles.isEmpty()){
	        this.editPolicy.each($.proxy(function(i, e) {
	            if (e instanceof draw2d.policy.figure.SelectionFeedbackPolicy) {
	                e.onUnselect(this.canvas, this);
	                e.onSelect(this.canvas, this);
	            }
	        }, this));
        }

        return vertex;
    },
    

    
    updateBoundingBox: function(){
        this.minX = this.x= Math.min.apply(Math,$.map(this.vertices.asArray(),function(n,i){return n.x;}));
        this.minY = this.y= Math.min.apply(Math,$.map(this.vertices.asArray(),function(n,i){return n.y;}));
        this.maxX = Math.max.apply(Math,$.map(this.vertices.asArray(),function(n,i){return n.x;}));
        this.maxY = Math.max.apply(Math,$.map(this.vertices.asArray(),function(n,i){return n.y;}));
        this.width = this.maxX - this.minX;
        this.height= this.maxY - this.minY;
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
 
      if(request.getPolicy() === draw2d.command.CommandType.MOVE_VERTEX){
          if(this.isResizeable()===true){
              return new draw2d.command.CommandMoveVertex(this);
            }
      }
    
      return this._super(request);
    },
   
    
    getPersistentAttributes : function()
    {   
        var memento = this._super();
        
        memento.radius = this.radius;
        memento.vertices = [];
        
        this.vertices.each(function(i,e){
            memento.vertices.push({x:e.x, y:e.y});
        });
 
        return memento;
    },
    
    setPersistentAttributes : function( memento)
    {
        this._super(memento);
        
        if(typeof memento.radius !=="undefined")
           this.setRadius(memento.radius);
        
        // restore the points from the JSON data and add them to the polyline
        //
        if(typeof memento.vertices !=="undefined"){
            this.vertices = new draw2d.util.ArrayList();
            $.each(memento.vertices, $.proxy(function(i,e){
                this.addVertex(e.x,e.y);
            },this));
        }
    }
});