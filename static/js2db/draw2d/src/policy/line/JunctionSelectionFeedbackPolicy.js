/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.line.JunctionSelectionFeedbackPolicy
 * 
 * Called by the framework if the user edit the position of a figure with a drag drop operation.
 * Sub class like SelectionEditPolicy or RegionEditPolicy cam adjust th e position of the figure or the selections handles.
 * 
 * @author  Andreas Herz
 * @extends draw2d.policy.EditPolicy
 */
draw2d.policy.line.JunctionSelectionFeedbackPolicy = draw2d.policy.line.LineSelectionFeedbackPolicy.extend({

    NAME : "draw2d.policy.line.JunctionSelectionFeedbackPolicy",

    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
        this._super();
    },
    

    /**
     * @method
     * 
     * @template
     * @param {draw2d.Connection} connection the selected figure
     * @param {boolean} isPrimarySelection
     */
    onSelect: function(canvas, connection, isPrimarySelection){
    	this._super(canvas, connection, isPrimarySelection);
    	
    	var points = connection.getPoints();
    	var i=1;
    	for( ; i<(points.getSize()-1); i++){
    		var handle = new draw2d.shape.basic.JunctionResizeHandle(connection, i);
            connection.selectionHandles.add( handle);         
            handle.setDraggable(connection.isResizeable());
            handle.show(canvas);

    		var handle = new draw2d.shape.basic.GhostJunctionResizeHandle(connection, i-1);
            connection.selectionHandles.add( handle);         
            handle.setDraggable(connection.isResizeable());
            handle.show(canvas);
        }
    	
		var handle = new draw2d.shape.basic.GhostJunctionResizeHandle(connection, i-1);
        connection.selectionHandles.add( handle);         
        handle.setDraggable(connection.isResizeable());
        handle.show(canvas);
        
        this.moved(canvas, connection);
    }   

});