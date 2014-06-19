/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.line.VertexSelectionFeedbackPolicy
 * 
 * Feedback and edit policy for the VertexRouter.
 * 
 * @author  Andreas Herz
 * @extends draw2d.policy.line.LineSelectionFeedbackPolicy
 */
draw2d.policy.line.VertexSelectionFeedbackPolicy = draw2d.policy.line.LineSelectionFeedbackPolicy.extend({

    NAME : "draw2d.policy.line.VertexSelectionFeedbackPolicy",

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
    onSelect: function(canvas, figure, isPrimarySelection){
        
        var startHandle =  new draw2d.shape.basic.LineStartResizeHandle(figure);
        var endHandle = new draw2d.shape.basic.LineEndResizeHandle(figure);
        figure.selectionHandles.add(startHandle);
        figure.selectionHandles.add( endHandle);

        var points = figure.getVertices();
        var count = points.getSize()-1;
        var i=1;
        for( ; i<count; i++){
            figure.selectionHandles.add( new draw2d.shape.basic.VertexResizeHandle(figure, i));         
            figure.selectionHandles.add( new draw2d.shape.basic.GhostVertexResizeHandle(figure, i-1));         
        }
        
        figure.selectionHandles.add( new draw2d.shape.basic.GhostVertexResizeHandle(figure, i-1));         

        figure.selectionHandles.each(function(i,e){
            e.setDraggable(figure.isResizeable());
            e.show(canvas);
        });
        
        this.moved(canvas, figure);
    }   

});