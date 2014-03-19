/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.layout.connection.JunctionRouter
 * Router for direct connections between two ports. Beeline
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     // Override the default connection type. This is used during drag&drop operations of ports.
 *     //
 *     draw2d.Connection.createConnection=function(sourcePort, targetPort){
 *        // return my special kind of connection
 *        var con = new draw2d.Connection();
 *        con.setRouter(new draw2d.layout.connection.DirectRouter());
 *        return con;
 *     };
 *     
 *     // create and add two nodes which contains Ports (In and OUT)
 *     //
 *     var start = new draw2d.shape.node.Start();
 *     var end   = new draw2d.shape.node.End();
        
 *     // ...add it to the canvas 
 *     canvas.addFigure( start, 50,50);
 *     canvas.addFigure( end, 230,80);
 *          
 *     // first Connection
 *     //
 *     var c = draw2d.Connection.createConnection();
 *     c.setSource(start.getOutputPort(0));
 *     c.setTarget(end.getInputPort(0));
 *     canvas.addFigure(c);
 * 
 * 
 * @inheritable
 * @author Andreas Herz
 * 
 * @extends  draw2d.layout.connection.ConnectionRouter
 */
draw2d.layout.connection.JunctionRouter = draw2d.layout.connection.ConnectionRouter.extend({

    NAME : "draw2d.layout.connection.JunctionRouter",

    /**
	 * @constructor 
	 * Creates a new Router object
	 */
    init: function(){
        this._super();
    },
    
    
    /**
     * @method
     * Invalidates the given Connection
     */
    invalidate:function()
    {
    },
    
    /**
     * @method
     * Routes the Connection in air line (beeline).
     * 
     * @param {draw2d.Connection} connection The Connection to route
     * @param {draw2d.util.ArrayList} oldJunctionPoints old/existing junction points of the Connection
     */
    route:function( connection, oldJunctionPoints)
    {
       var start =connection.getStartPoint();
       var end = connection.getEndPoint();
       
       // required for hit tests
       //
       var count = oldJunctionPoints.getSize()-1;
       connection.addPoint(start);
       for(var i=1; i<count;i++){
           connection.addPoint(oldJunctionPoints.get(i));
       }
       connection.addPoint(end);
       
		// calculate the manhatten bend points between start/end.
		//
//		this._route(conn, toPt, toDir, fromPt, fromDir);

       var ps = connection.getPoints();
       
       length = ps.getSize();
       var p = ps.get(0);
       var path = ["M",p.x," ",p.y];
       for(var i=1;i<length;i++){
             p = ps.get(i);
             path.push("L", p.x, " ", p.y);
       }
       connection.svgPathString = path.join("");
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
        memento.junction = [];
        
        line.getPoints().each(function(i,e){
            memento.junction.push({x:e.x, y:e.y});
        });
        
        return memento;
    },
    
    /**
     * @method 
     * set the attributes for the polyline with routing information
     * 
     * @since 2.10.0
     * @param {Object} memento
     */
    setPersistentAttributes : function(line, memento)
    {
        // restore the points from the JSON data and add them to the polyline
        //
        if(typeof memento.junction !=="undefined"){
            
            line.oldPoint=null;
            line.lineSegments = new draw2d.util.ArrayList();
            line.basePoints   = new draw2d.util.ArrayList();

            $.each(memento.junction, $.proxy(function(i,e){
                line.addPoint(e.x, e.y);
            },this));
        }
    }
    
});
