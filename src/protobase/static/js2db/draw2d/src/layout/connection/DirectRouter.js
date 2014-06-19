/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.layout.connection.DirectRouter
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
draw2d.layout.connection.DirectRouter = draw2d.layout.connection.ConnectionRouter.extend({

    NAME : "draw2d.layout.connection.DirectRouter",

    /**
   * @constructor 
   * Creates a new Router object
   */
    init: function(){
        this._super();
    },
    
    
    /**
     * @method
     * Callback method if the router has been assigned to a connection.
     * 
     * @param {draw2d.Connection} connection The assigned connection
     * @template
     * @since 2.7.2
     */
    onInstall: function(connection){
        connection.installEditPolicy(new draw2d.policy.line.LineSelectionFeedbackPolicy());
       
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
     * @param {draw2d.util.ArrayList} oldVertices old/existing vertices of the Connection
     */
    route:function( connection, oldVertices)
    {
       var start =connection.getStartPoint();
       var end = connection.getEndPoint();
       
       // required for hit tests
       //
       connection.addPoint(start);
       connection.addPoint(end);
       
       // calculate the path
       var path = ["M",start.x," ",start.y];
       path.push("L", end.x, " ", end.y);

       connection.svgPathString = path.join("");

    }
});