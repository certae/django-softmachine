/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.layout.locator.PortLocator
 * 
 * Repositions a Figure attached to a Connection when the 
 * Connection is moved. Provides for alignment at the start 
 * (source), middle, or end (target) of the Connection.
 *
 * @author Andreas Herz
 * @extend draw2d.layout.locator.Locator
 */
draw2d.layout.locator.PortLocator = draw2d.layout.locator.Locator.extend({
    NAME : "draw2d.layout.locator.PortLocator",
    
    /**
     * @constructor
     * Default constructor for a Locator which can layout a port in context of a 
     * {@link grapiti.shape.node.Node}
     * 
     */
    init:function( ){
      this._super();
    },
    
    applyConsiderRotation: function(port, x, y){
    	var parent = port.getParent();
    
    	var halfW = parent.getWidth()/2;
    	var halfH = parent.getHeight()/2;
    	var rotAngle = parent.getRotationAngle();
    	var m = Raphael.matrix();
    	m.rotate(rotAngle, halfW, halfH);
        if(rotAngle=== 90|| rotAngle===270){
            var ratio = parent.getHeight()/parent.getWidth();
            m.scale(ratio, 1/ratio, halfW, halfH);
        }

        port.setPosition( m.x(x,y), m.y(x,y));
    }
});