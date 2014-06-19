/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2014 Giovanni Victorette
 ****************************************/
/**
 * @class dbModel.shape.ManhattanLeftConnectionLocator
 *
 * A ManhattanRightConnectionLocator that is used to place figures at the left position of a Manhattan routed
 * connection.
 *
 * @author Giovanni Victorette
 * @extend draw2d.layout.locator.ConnectionLocator
 */
dbModel.shape.ManhattanLeftConnectionLocator = draw2d.layout.locator.ConnectionLocator.extend({
    NAME: "dbModel.shape.ManhattanLeftConnectionLocator",

    /**
     * @constructor
     * Constructs a ManhattanLeftConnectionLocator with associated Connection c.
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
		var locator = conn.getSource().getLocator();
        var points = conn.getVertices();

		var coordR = points.get(0);
		if (locator.__proto__.NAME === "dbModel.locator.PortLeftLocator") {
			target.setPosition(coordR.x - 35, coordR.y);
		} else if (locator.__proto__.NAME === "draw2d.layout.locator.TopLocator"){
			target.setPosition(coordR.x + 10, coordR.y - 25);
		} else if (locator.__proto__.NAME === "draw2d.layout.locator.BottomLocator"){
			target.setPosition(coordR.x - 25, coordR.y);
		}  else {
			target.setPosition(coordR.x + 10, coordR.y);
		}
    }
}); 