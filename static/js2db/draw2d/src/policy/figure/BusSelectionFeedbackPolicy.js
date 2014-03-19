/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.figure.BusSelectionFeedbackPolicy 
 * 
 *
 * @author Andreas Herz
 * @extends draw2d.policy.figure.SelectionFeedbackPolicy
 */
draw2d.policy.figure.BusSelectionFeedbackPolicy = draw2d.policy.figure.SelectionFeedbackPolicy.extend({

    NAME : "draw2d.policy.figure.BusSelectionFeedbackPolicy",
    
    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
        this._super();
    },
    

    /**
     * @method
     * Called by the framework of the Policy should show a resize handle for the given shape
     * 
     * @param {boolean} isPrimarySelection
     */
    onSelect: function(canvas, figure, isPrimarySelection){
        if (figure.selectionHandles.isEmpty()) {
            var r2 = new draw2d.ResizeHandle(figure, 2); // 2 = CENTER_TOP
            var r4 = new draw2d.ResizeHandle(figure, 4); // 4 = RIGHT_MIDDLE
            var r6 = new draw2d.ResizeHandle(figure, 6); // 6 = CENTER_BOTTOM
            var r8 = new draw2d.ResizeHandle(figure, 8); // 8 = LEFT_MIDDLE

            figure.selectionHandles.add(r2);
            figure.selectionHandles.add(r4);
            figure.selectionHandles.add(r6);
            figure.selectionHandles.add(r8);

            r2.setDraggable(figure.isResizeable());
            r4.setDraggable(figure.isResizeable());
            r6.setDraggable(figure.isResizeable());
            r8.setDraggable(figure.isResizeable());
            
            r2.show(canvas);
            r4.show(canvas);
            r6.show(canvas);
            r8.show(canvas);
        }
        this.moved(canvas, figure);
   },
    
    
    /**
     * @method
     * Callback if the figure has been moved
     * 
     * @param figure
     * 
     * @template
     */
    moved: function(canvas, figure){
        if(figure.selectionHandles.isEmpty()){
            return; // silently
        }
        var r2= figure.selectionHandles.get(0); 
        var r4= figure.selectionHandles.get(1); 
        var r6= figure.selectionHandles.get(2); 
        var r8= figure.selectionHandles.get(3); 

        var objHeight   = figure.getHeight();
        var objWidth    = figure.getWidth();
        
        var xPos = figure.getX();
        var yPos = figure.getY();
        r2.setPosition(xPos+(objWidth/2)-(r2.getWidth()/2),yPos-r2.getHeight());
        r4.setPosition(xPos+objWidth,yPos+(objHeight/2)-(r4.getHeight()/2));
        r6.setPosition(xPos+(objWidth/2)-(r6.getWidth()/2),yPos+objHeight);
        r8.setPosition(xPos-r8.getWidth(),yPos+(objHeight/2)-(r8.getHeight()/2));
     }
    
    
});
