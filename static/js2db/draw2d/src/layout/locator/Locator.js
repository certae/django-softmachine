/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.layout.locator.Locator
 * 
 * Controls the location of an IFigure. 
 *
 * @author Andreas Herz
 */
draw2d.layout.locator.Locator= Class.extend({
    NAME : "draw2d.layout.locator.Locator",
   
    /**
     * @constructor
     * Initial Constructor
     * 
     * @param {draw2d.Figure} [parentShape] the parent or owner of the child 
     */
    init:function(parentShape )
    {
        this.parent = parentShape;
    },
    
    /**
     * @method
     * Returns the associated owner of the locator
     *
     * @return {draw2d.Figure}
     **/
    getParent:function(){
       return this.parent;
    },
    
    
    /**
     * @method
     * Set the associated owner of the locator
     *
     * @param {draw2d.Figure} parentShape
     **/
    setParent:function(parentShape){
        this.parent= parentShape;
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
    	
    }
});