/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.layout.connection.SplineConnectionRouter 
 * 
 * A MannhattanConnectionRouter with an spline interpolation between the bend points.
 * 
 * @inheritable
 * @author Andreas Herz
 * @extends draw2d.layout.connection.ManhattanConnectionRouter
 */
draw2d.layout.connection.SplineConnectionRouter = draw2d.layout.connection.ManhattanConnectionRouter.extend({

	NAME : "draw2d.layout.connection.SplineConnectionRouter",

    /**
     * @constructor Creates a new Router object
     */
    init : function()
    {
        this._super();

//        this.spline = new draw2d.util.spline.CatmullRomSpline();
        this.spline = new draw2d.util.spline.CubicSpline();
//        this.spline = new draw2d.util.spline.BezierSpline();
        
        this.MINDIST = 50,
        this.cheapRouter = null;
    },

	/**
	 * @method
	 * Layout the hands over connection with the cubic spline calculation and manhattan routing
	 * 
	 * @param {draw2d.Connection} conn
     * @param {draw2d.util.ArrayList} oldJunctionPoints old/existing junction points of the Connection
	 */
    route : function(conn, oldJunctionPoints)
    {
    	var i=0;
		var fromPt  = conn.getStartPoint();
		var fromDir = conn.getSource().getConnectionDirection(conn, conn.getTarget());

		var toPt  = conn.getEndPoint();
		var toDir = conn.getTarget().getConnectionDirection(conn, conn.getSource());

		// calculate the manhatten bend points between start/end.
		//
		this._route(conn, toPt, toDir, fromPt, fromDir);

        var ps = conn.getPoints();

        conn.oldPoint=null;
        conn.lineSegments = new draw2d.util.ArrayList();
        conn.basePoints   = new draw2d.util.ArrayList();
 
        var splinePoints = this.spline.generate(ps,8);
        splinePoints.each(function(i,e){
            conn.addPoint(e);
        });
        
        // calculate the path string for the SVG rendering
        //
        var ps = conn.getPoints();
        length = ps.getSize();
        var p = ps.get(0);
        var path = ["M",p.x," ",p.y];
        for( i=1;i<length;i++){
              p = ps.get(i);
              path.push("L", p.x, " ", p.y);
        }
        conn.svgPathString = path.join("");
    }
});