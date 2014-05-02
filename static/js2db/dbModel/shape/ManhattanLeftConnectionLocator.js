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
        var points = conn.getVertices();

		var coordR = points.get(0);
        var x = coordR.x + 10;
        var y = coordR.y;

        target.setPosition(x, y);
    }
}); 