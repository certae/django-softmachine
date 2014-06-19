/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.figure.ResizeSelectionFeedbackPolicy
 * 
 * Selection feedback policy without "marching ant lines" or any other rectangle highlight. Just
 * some resize handles at each corner of the shape.
 * 
 * See the example:
 *
 *     @example preview small frame
 *       circle =new draw2d.shape.basic.Circle();
 *       circle.installEditPolicy(new draw2d.policy.ResizeSelectionFeedbackPolicy());
 *       canvas.addFigure(circle,90,50);
 *
 *       canvas.addFigure(new draw2d.shape.basic.Label("Click on the circle to see the selection feedback"),20,10);
 *
 * @author Andreas Herz
 * @since 4.0.0
 * @extends draw2d.policy.figure.SelectionFeedbackPolicy
 * 
 */
draw2d.policy.figure.ResizeSelectionFeedbackPolicy = draw2d.policy.figure.SelectionFeedbackPolicy.extend({

    NAME : "draw2d.policy.figure.ResizeSelectionFeedbackPolicy",
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
        
        if(figure.selectionHandles.isEmpty())
        {
            // create standard Resize handles for the figure
            //
            var r1= new draw2d.ResizeHandle(figure,1); // 1 = LEFT TOP
            var r2= new draw2d.ResizeHandle(figure,2); // 2 = CENTER_TOP
            var r3= new draw2d.ResizeHandle(figure,3); // 3 = RIGHT_TOP
            var r4= new draw2d.ResizeHandle(figure,4); // 4 = RIGHT_MIDDLE
            var r5= new draw2d.ResizeHandle(figure,5); // 5 = RIGHT_BOTTOM
            var r6= new draw2d.ResizeHandle(figure,6); // 6 = CENTER_BOTTOM
            var r7= new draw2d.ResizeHandle(figure,7); // 7 = LEFT_BOTTOM
            var r8= new draw2d.ResizeHandle(figure,8); // 8 = LEFT_MIDDLE

            // and add them to the figure. We need the reference to the ResizeHandles
            // to remove the resize handles if the figure will be unselect. Just a simple
            // refrence store
            //
            figure.selectionHandles.add(r1);
            figure.selectionHandles.add(r2);
            figure.selectionHandles.add(r3);
            figure.selectionHandles.add(r4);
            figure.selectionHandles.add(r5);
            figure.selectionHandles.add(r6);
            figure.selectionHandles.add(r7);
            figure.selectionHandles.add(r8);
            
            // show the default top/left, top/right, bottom/right and bottom/left
            // resize handles 
            //
            r1.show(canvas);
            r3.show(canvas);
            r5.show(canvas);
            r7.show(canvas);

            // The corner ResizeHandles are only draggable fi the figure is
            // resizeable. But the Resize handles are visible
            //
            
            // change the look&feel of the corner resizehandles if the
            // figure isn't resizeable
            //
            if(figure.isResizeable()===false) {
              r1.setBackgroundColor(null);
              r3.setBackgroundColor(null);
              r5.setBackgroundColor(null);
              r7.setBackgroundColor(null);
              r1.setDraggable(false);
              r3.setDraggable(false);
              r5.setDraggable(false);
              r7.setDraggable(false);
            }

            // show only the additional resizehandles if the figure is resizeable
            //
            if((!figure.getKeepAspectRatio()) && figure.isResizeable()){
              r2.show(canvas);
              r4.show(canvas);
              r6.show(canvas);
              r8.show(canvas);
            }
        }
        this.moved(canvas, figure);
   },
  
    /**
     * @method
     * Callback if the figure has been moved. In this case we must update the position of the
     * resize handles.
     * 
     * @param figure
     * 
     * @template
     */
    moved: function(canvas, figure ){
        if(figure.selectionHandles.isEmpty()){
            return; // silently
        }
        
        var objHeight   = figure.getHeight();
        var objWidth    = figure.getWidth();
        var xPos = figure.getX();
        var yPos = figure.getY();
        
        var r1= figure.selectionHandles.get(0);
        var r3= figure.selectionHandles.get(2);
        var r5= figure.selectionHandles.get(4);
        var r7= figure.selectionHandles.get(6); 
        r1.setPosition(xPos-r1.getWidth(),yPos-r1.getHeight());
        r3.setPosition(xPos+objWidth,yPos-r3.getHeight());
        r5.setPosition(xPos+objWidth,yPos+objHeight);
        r7.setPosition(xPos-r7.getWidth(),yPos+objHeight);
        
        if(!figure.getKeepAspectRatio())
        {
            var r2= figure.selectionHandles.get(1); 
            var r4= figure.selectionHandles.get(3); 
            var r6= figure.selectionHandles.get(5); 
            var r8= figure.selectionHandles.get(7); 
     
            r2.setPosition(xPos+(objWidth/2)-(r2.getWidth()/2),yPos-r2.getHeight());
            r4.setPosition(xPos+objWidth,yPos+(objHeight/2)-(r4.getHeight()/2));
            r6.setPosition(xPos+(objWidth/2)-(r6.getWidth()/2),yPos+objHeight);
            r8.setPosition(xPos-r8.getWidth(),yPos+(objHeight/2)-(r8.getHeight()/2));
        }
    }
    
    
});