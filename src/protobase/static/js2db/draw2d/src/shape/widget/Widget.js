/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.widget.Widget
 * Base class for all diagrams.
 * 
 * @extends draw2d.SetFigure
 */
draw2d.shape.widget.Widget = draw2d.SetFigure.extend({
    
    init: function( width, height){
        this._super( width, height);
    },
    

    /**
     * @method
     * Return the calculate width of the set. This calculates the bounding box of all elements.
     * 
     * @return {Number} the calculated width of the label
     **/
    getWidth : function() {
        return this.width;
    },
    
    /**
     * @method
     * Return the calculated height of the set. This calculates the bounding box of all elements.
     * 
     * @return {Number} the calculated height of the label
     */
    getHeight:function(){
       return this.height;
    }
});