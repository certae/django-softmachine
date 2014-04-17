/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.figure.RegionConstraintPolicy
 * 
 * An EditPolicy for use with Figures. The constraint for RegionContraintPolicy is a Rectangle. It is
 * not possible to move the related figure outside this contrained area.
 * 
 * 
 * @author Andreas Herz
 * 
 * @extends draw2d.policy.figure.DragDropEditPolicy
 */
draw2d.policy.figure.RegionEditPolicy = draw2d.policy.figure.DragDropEditPolicy.extend({

    NAME : "draw2d.policy.figure.RegionEditPolicy",
    
    /**
     * @constructor 
     * Creates a new constraint object
     * 
     * @param {Number|draw2d.geo.Rectangle} x x coordinate or a rectangle as constraint for the assigned figure.
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     */
    init: function( x,y,w,h){
        this._super();
        if(x instanceof draw2d.geo.Rectangle){
            this.constRect = x;
        }
        else if(typeof h === "number"){
            this.constRect = new draw2d.geo.Rectangle(x,y,w,h);
        }
        else{
            throw "Invalid parameter. RegionConstraintPolicy need a rectangle as parameter in the constructor";
        }
    },


    /**
     * @method
     * Adjust the coordinates to the rectangle/region of this contraint.
     * 
     * @param figure
     * @param {Number|draw2d.geo.Point} x
     * @param {number} [y]
     * @returns {draw2d.geo.Point} the contraint position of th efigure
     */
    adjustPosition : function(figure, x, y)
    {
        var r = null;
        if (x instanceof draw2d.geo.Point) {
            r = new draw2d.geo.Rectangle(x.x, x.y, figure.getWidth(), figure.getHeight());
        }
        else {
            r = new draw2d.geo.Rectangle(x, y, figure.getWidth(), figure.getHeight());
        }
        r = this.constRect.moveInside(r);
        return r.getTopLeft();
    }
});