/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.layout.locator.ManhattanMidpointLocator
 * 
 * A ManhattanMidpointLocator that is used to place figures at the midpoint of a Manhatten routed
 * connection. The midpoint is always in the center of an edge.
 *
 * @author Andreas Herz
 * @extend draw2d.layout.locator.ConnectionLocator
 */
draw2d.layout.locator.ManhattanMidpointLocator= draw2d.layout.locator.ConnectionLocator.extend({
    NAME : "draw2d.layout.locator.ManhattanMidpointLocator",
    
    /**
     * @constructor
     * Constructs a ManhattanMidpointLocator with associated Connection c.
     * 
     * @param {draw2d.Connection} c the connection associated with the locator
     */
    init: function(c)
    {
      this._super(c);
    },
    
    
    /**
     * @method
     * Relocates the given Figure always in the center of an edge.
     *
     * @param {Number} index child index of the target
     * @param {draw2d.Figure} target The figure to relocate
     **/
    relocate:function(index, target)
    {
       var conn = this.getParent();
       var points = conn.getPoints();
       
       var segmentIndex = Math.floor((points.getSize() -2) / 2);
       if (points.getSize() <= segmentIndex+1)
          return; 
    
       var p1 = points.get(segmentIndex);
       var p2 = points.get(segmentIndex + 1);
    
       var x = ((p2.x - p1.x) / 2 + p1.x - target.getWidth()/2)|0;
       var y = ((p2.y - p1.y) / 2 + p1.y - target.getHeight()/2)|0;
    
       target.setPosition(x,y);
    }
});
