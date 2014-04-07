/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.layout.connection.FanConnectionRouter
 * 
 * Automatic router that spreads its  {@link draw2d.Connection Connections} in a fan-like fashion upon collision. 
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
 *        con.setRouter(new draw2d.layout.connection.FanConnectionRouter());
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
 *     // second Connection
 *     //
 *     c = draw2d.Connection.createConnection();
 *     c.setSource(start.getOutputPort(0));
 *     c.setTarget(end.getInputPort(0));
 *     canvas.addFigure(c);
 *     
 *     // third Connection
 *     //
 *     c = draw2d.Connection.createConnection();
 *     c.setSource(start.getOutputPort(0));
 *     c.setTarget(end.getInputPort(0));
 *     canvas.addFigure(c);
 * @inheritable
 * @author Andreas Herz
 * 
 * @extends draw2d.layout.connection.DirectRouter
 */
draw2d.layout.connection.FanConnectionRouter = draw2d.layout.connection.DirectRouter.extend({
    NAME : "draw2d.layout.connection.FanConnectionRouter",

    /**
     * @constructor Creates a new Router object.
     */
    init : function()
    {
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
     * Layout the hands over connection in a manhattan like layout
     * 
     * @param {draw2d.Connection}  conn
     * @param {draw2d.util.ArrayList} oldVertices old/existing vertices of the Connection
     */
    route : function(conn, oldVertices)
    {
        var lines = conn.getSource().getConnections();
        var connections = new draw2d.util.ArrayList();
        var index = 0;
        for ( var i = 0; i < lines.getSize(); i++) 
        {
            var figure = lines.get(i);
            if (figure.getTarget() === conn.getTarget() || figure.getSource() === conn.getTarget()) 
            {
                connections.add(figure);
                if (conn === figure){
                    index = connections.getSize();
                }
            }
        }
        if (connections.getSize() > 1){
            this.routeCollision(conn, index);
        }
        else{
            this._super(conn);
        }
    },

    routeCollision : function(/* :draw2d.Connection */conn, /* :int */index)
    {
        var start = conn.getStartPoint();
        var end = conn.getEndPoint();

        var separation = 15;

        var midPoint = new draw2d.geo.Point((end.x + start.x) / 2, (end.y + start.y) / 2);
        var position = end.getPosition(start);
        var ray;
        if (position == draw2d.geo.PositionConstants.SOUTH || position == draw2d.geo.PositionConstants.EAST){
            ray = new draw2d.geo.Point(end.x - start.x, end.y - start.y);
        }
        else{
            ray = new draw2d.geo.Point(start.x - end.x, start.y - end.y);
        }

        var length = Math.sqrt(ray.x * ray.x + ray.y * ray.y);

        var xSeparation = separation * ray.x / length;
        var ySeparation = separation * ray.y / length;

        var bendPoint;

        if (index % 2 === 0){
            bendPoint = new draw2d.geo.Point(midPoint.x + (index / 2) * (-1 * ySeparation), midPoint.y + (index / 2) * xSeparation);
        }
        else{
            bendPoint = new draw2d.geo.Point(midPoint.x + (index / 2) * ySeparation, midPoint.y + (index / 2) * (-1 * xSeparation));
        }

        // required for hit tests
        conn.addPoint(start);
        conn.addPoint(bendPoint);
        conn.addPoint(end);

        // calculate the path string for the SVG rendering
        //
        var ps = conn.getVertices();
        var p = ps.get(0);
        var path = ["M",p.x," ",p.y];
        for( var i=1;i<ps.getSize();i++){
              p = ps.get(i);
              path.push("L", p.x, " ", p.y);
        }
        conn.svgPathString = path.join("");
    }
});