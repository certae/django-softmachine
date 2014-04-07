/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.layout.connection.ConnectionRouter
 * Routes a {@link draw2d.Connection}, possibly using a constraint.
 *
 * @author Andreas Herz
 */
draw2d.layout.connection.ConnectionRouter = Class.extend({
    NAME : "draw2d.layout.connection.ConnectionRouter",

    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
    },
    
    
    /**
     * @method
     * Routes the Connection.
     * 
     * @param {draw2d.Connection} connection The Connection to route
     * @param {draw2d.util.ArrayList} oldVertices old/existing vertices of the Connection
     * @template
     */
    route:function( connection, oldVertices)
    {
        throw "subclasses must implement the method [ConnectionRouter.route]";
    },
    
    _paint: function(conn){
        // calculate the path string for the SVG rendering
        // Important: to avoid subpixel error rendering we add 0.5 to each coordinate
        //            With this offset the canvas can paint the line on a "full pixel" instead
        //            of subpixel rendering.
        var ps = conn.getVertices();
        var p = ps.get(0);
        var distance = conn.getRadius();
        var path = ["M",(p.x|0)+0.5," ",(p.y|0)+0.5];
        var i=1;
        if(distance>0){
            var lastP = p;
            var length = (ps.getSize()-1);
            for(  ;i<length;i++){
                  p = ps.get(i);
                  inset = this.insetPoint(p,lastP, distance);
                  path.push("L", (inset.x|0)+0.5, ",", (inset.y|0)+0.5);
    
                  p2 = ps.get(i+1);
                  inset = this.insetPoint(p,p2,distance);
                  
                  path.push("Q",p.x,",",p.y," ", (inset.x|0)+0.5, ", ", (inset.y|0)+0.5);
                  lastP = p;
            }
            p = ps.get(i);
            path.push("L", (p.x|0)+0.5, ",", (p.y|0)+0.5);
       }
        else{
            var length = ps.getSize();
            for( ;i<length;i++){
                p = ps.get(i);
                path.push("L", (p.x|0)+0.5, ",", (p.y|0)+0.5);
          }
        }
         conn.svgPathString = path.join("");
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
     * Callback method if the router has been assigned to a connection.
     * 
     * @param {draw2d.Connection} connection The assigned connection
     * @template
     * @since 2.7.2
     */
    onInstall: function(connection)
    {
        
    },
    
    /**
     * @method
     * Callback method if the router has been removed from the connection.
     * 
     * @param {draw2d.Connection} connection The related connection
     * @template
     * @since 2.7.2
     */
    onUninstall: function(connection)
    {
        
    },
    
    
    /**
     * @method 
     * Tweak or enrich the polyline persistence data with routing information
     * 
     * @since 2.10.0
     * @param {draw2d.shape.basic.PolyLine} line
     * @param {Object} memento The memento data of the polyline
     * @returns {Object}
     */
    getPersistentAttributes : function(line, memento)
    {   
        return memento;
    },
    
    /**
     * @method 
     * set the attributes for the polyline with routing information
     * 
     * @since 2.10.0
     * @param {Object} memento the JSON data to read
     */
    setPersistentAttributes : function(line, memento)
    {
    }
    
});