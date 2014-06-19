/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2014 Giovanni Victorette
 ****************************************/
/**
 * @class dbModel.locator.PortRightLocator
 *
 * @author Giovanni Victorette
 * @extend draw2d.layout.locator.PortLocator
 */
dbModel.locator.PortRightLocator = draw2d.layout.locator.PortLocator.extend({
    NAME: "dbModel.locator.PortRightLocator",

    /**
     * @constructor
     * Constructs a locator with associated parent.
     *
     * @param {draw2d.Figure} parent the parent associated with the locator
     */
    init: function(parent) {
        this._super(parent);
    },

    /**
     * @method
     * Relocates the given Figure.
     *
     * @param {Number} index child index of the target
     * @param {draw2d.Figure} target The figure to relocate
     **/
    relocate: function(index, figure) {
    	var node = figure.getParent();
        var dividerFactor = 1;
        var thisNAME = this.NAME;
        var portIndex =1;
        node.getPorts().each(function(i,p){
            portIndex = (p===figure)?dividerFactor:portIndex;
            dividerFactor += p.getLocator().NAME === thisNAME?1:0;
        });
        this.applyConsiderRotation( figure, node.getWidth(), (node.getHeight()/dividerFactor)*portIndex);
    }
});
