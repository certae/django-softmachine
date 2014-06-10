/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.layout.locator.XYAbsPortLocator
 * 
 * Create a locator for fixed x/y coordinate position.
 *
 * @author Andreas Herz
 * @extend draw2d.layout.locator.PortLocator
 * @since 4.0.0
 */
draw2d.layout.locator.XYAbsPortLocator = draw2d.layout.locator.PortLocator.extend({
    NAME : "draw2d.layout.locator.XYAbsPortLocator",
     
    /**
     * @constructor
     * 
     * {@link grapiti.shape.node.Node}
     * 
     * @param {Number} x the x coordinate of the port relative to the left of the parent
     * @param {Number} y the y coordinate of the port relative to the top of the parent
     */
    init:function(x ,y ){
      this._super();
      
      this.x = x;
      this.y = y;
    },    
   
   /**
    * @method
    * Controls the location of an I{@link draw2d.Figure} 
    *
    * @param {Number} index child index of the figure
    * @param {draw2d.Figure} figure the figure to control
    * 
    * @template
    **/
    relocate:function(index, figure){
        this.applyConsiderRotation( figure, this.x, this.y);
    }
    
});