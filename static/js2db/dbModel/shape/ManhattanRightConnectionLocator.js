/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2014 Giovanni Victorette
 ****************************************/
/**
 * @class dbModel.shape.ManhattanRightConnectionLocator
 *
 * A ManhattanRightConnectionLocator that is used to place figures at the right position of a Manhattan routed
 * connection.
 *
 * @author Giovanni Victorette
 * @extend draw2d.layout.locator.ConnectionLocator
 */
dbModel.shape.ManhattanRightConnectionLocator = draw2d.layout.locator.ConnectionLocator.extend({
    NAME: "dbModel.shape.ManhattanRightConnectionLocator",

    /**
     * @constructor
     * Constructs a ManhattanRightConnectionLocator with associated Connection c.
     *
     * @param {draw2d.Connection} c the connection associated with the locator
     */
    init: function(c) {
        this._super(c);
    },

    /**
     * @method
     * Relocates the given Figure always in the center of an edge.
     *
     * @param {Number} index child index of the target
     * @param {draw2d.Figure} target The figure to relocate
     **/
    relocate: function(index, target) {
        var conn = this.getParent();
		var locator = conn.getTarget().getLocator();
		var points = conn.getVertices();

		var coordR = points.get(points.getSize()-1);
		
		if (locator.__proto__.NAME === "dbModel.locator.PortRightLocator") {
			target.setPosition(coordR.x + 8, coordR.y - 20);
		} else if (locator.__proto__.NAME === "draw2d.layout.locator.BottomLocator"){
			target.setPosition(coordR.x + 8, coordR.y + 3);
		} else {
			target.setPosition(coordR.x - 35, coordR.y - 20);
		}
    }
}); 