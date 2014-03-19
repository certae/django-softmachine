/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.layout.locator.PolylineMidpointLocator
 * 
 * A PolylineMidpointLocator is used to place figures at the midpoint of a routed
 * connection. <br>
 * If the connection did have an odd count of points the figure is located in the center junction point of the poly line.<br>
 * On an even count of junction point, the figure will be center on the middle segment of the ploy line. 
 *
 * @author Andreas Herz
 * @extend draw2d.layout.locator.ManhattanMidpointLocator
 */
draw2d.layout.locator.PolylineMidpointLocator= draw2d.layout.locator.ManhattanMidpointLocator.extend({
    NAME : "draw2d.layout.locator.PolylineMidpointLocator",
    
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
     * Relocates the given Figure.
     *
     * @param {Number} index child index of the target
     * @param {draw2d.Figure} target The figure to relocate
     **/
    relocate:function(index, target)
    {
       var conn = this.getParent();
       var points = conn.getPoints();
       
       // it has an event count of points -> use the manhattan algorithm...this is working 
       // well in this case
       if(points.getSize()%2===0){
           this._super(index, target);
       }
       // odd count of points. take the center point as fulcrum
       else{

           var index = Math.floor(points.getSize() / 2);
        
           var p1 = points.get(index);
        
           
           target.setPosition(p1.x- (target.getWidth()/2),p1.y-(target.getHeight()/2));
       }      
    }
});
