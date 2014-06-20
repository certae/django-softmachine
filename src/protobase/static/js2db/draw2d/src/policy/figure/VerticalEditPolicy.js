/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.figure.VerticalEditPolicy
 * 
 * An EditPolicy for use with Figures. The constraint for RegionContraintPolicy is a Rectangle. It is
 * not possible to move the related figure outside this contrained area.
 * 
 * 
 * @author Andreas Herz
 * 
 * @extends draw2d.policy.figure.DragDropEditPolicy
 */
draw2d.policy.figure.VerticalEditPolicy = draw2d.policy.figure.DragDropEditPolicy.extend({

    NAME : "draw2d.policy.figure.VerticalEditPolicy",

    /**
     * @constructor 
     * Creates a new constraint object
     */
    init: function()
    {
        this._super();
    },


    /**
     * @method
     * It is only possible to drag&drop the element in a vertical line
     * 
     * @param figure
     * @param {Number|draw2d.geo.Point} x
     * @param {number} [y]
     * @returns {draw2d.geo.Point} the constraint position of the figure
     */
    adjustPosition : function(figure, x, y)
    {
        return new draw2d.geo.Point(figure.getX(),y);
    }
    
});