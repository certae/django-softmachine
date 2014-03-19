/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.layout.locator.TopLocator
 * 
 * A TopLocator  is used to place figures at the top/center of a parent shape.
 *
 * @author Andreas Herz
 * @extend draw2d.layout.locator.Locator
 */
draw2d.layout.locator.TopLocator= draw2d.layout.locator.Locator.extend({
    NAME : "draw2d.layout.locator.TopLocator",
    
    /**
     * @constructor
     * Constructs a ManhattanMidpointLocator with associated Connection c.
     * 
     * @param {draw2d.Figure} parent the parent associated with the locator
     */
    init: function(parent)
    {
      this._super(parent);
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
       var parent = this.getParent();
       var boundingBox = parent.getBoundingBox();
    
       var targetBoundingBox = target.getBoundingBox();
       if(target instanceof draw2d.Port){
           target.setPosition(boundingBox.w/2,2);
       }
       else{
           target.setPosition(boundingBox.w/2-(targetBoundingBox.w/2),-(targetBoundingBox.h+2));
       }
    }
});
