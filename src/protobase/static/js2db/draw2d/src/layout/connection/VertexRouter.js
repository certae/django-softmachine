/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.layout.connection.VertexRouter
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
draw2d.layout.connection.VertexRouter = draw2d.layout.connection.ConnectionRouter.extend({

    NAME : "draw2d.layout.connection.VertexRouter",

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
        connection.installEditPolicy(new draw2d.policy.line.VertexSelectionFeedbackPolicy());
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
        
       // required for hit tests
       //
       var count = oldVertices.getSize();
       for(var i=0; i<count;i++){
           connection.addPoint(oldVertices.get(i));
       }

       var ps = connection.getVertices();
       
       // respect the calculated anchor position if the start/end port has set any Anchor impl.
       var startAnchor = connection.getStartPoint(ps.get(1));
       var endAnchor   = connection.getEndPoint(ps.get(ps.getSize()-2));
       ps.first().setPosition(startAnchor);
       ps.last().setPosition(endAnchor);
       
       this._paint(connection);
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
        memento.vertex = [];
        
        line.getVertices().each(function(i,e){
            memento.vertex.push({x:e.x, y:e.y});
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
        if(typeof memento.vertex !=="undefined"){
            
            line.oldPoint=null;
            line.lineSegments = new draw2d.util.ArrayList();
            line.vertices     = new draw2d.util.ArrayList();

            $.each(memento.vertex, $.proxy(function(i,e){
                line.addPoint(e.x, e.y);
            },this));
        }
    }
    
});