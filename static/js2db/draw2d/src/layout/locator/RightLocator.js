/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.layout.locator.RightLocator
 * 
 * A RightLocator is used to place figures to the right of a parent shape.
 *
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *
 *     // create a basic figure and add a Label/child via API call
 *     //
 *     var end = new draw2d.shape.node.End();
 *     end.addFigure(new draw2d.shape.basic.Label("Right Label"), new draw2d.layout.locator.RightLocator(end));	
 *     canvas.addFigure( end, 50,50);
 *
 *     
 * @author Andreas Herz
 * @extend draw2d.layout.locator.Locator
 */
draw2d.layout.locator.RightLocator = draw2d.layout.locator.Locator.extend({
    NAME : "draw2d.layout.locator.RightLocator",
    
    /**
     * @constructor
     * Constructs a locator with associated parent.
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
       target.setPosition(boundingBox.w+5,(boundingBox.h/2)-(targetBoundingBox.h/2));
    }
});
