/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.canvas.SingleSelectionPolicy
 * 
 *
 * @author Andreas Herz
 * @extends draw2d.policy.canvas.SelectionPolicy
 */
draw2d.policy.canvas.SingleSelectionPolicy =  draw2d.policy.canvas.SelectionPolicy.extend({

    NAME : "draw2d.policy.canvas.SingleSelectionPolicy",
    
    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
        this._super();
        this.mouseMovedDuringMouseDown = false;
        this.mouseDraggingElement = null;
        this.mouseDownElement = null;
    },
   
    select: function(canvas, figure){
        if(canvas.getSelection().getAll().contains(figure)){
            return; // nothing to to
        }
        
        if(canvas.getSelection().getPrimary()!==null){
            this.unselect(canvas, canvas.getSelection().getPrimary());
        }
      
        if(figure !==null) {
            figure.select(true); // primary selection
        }
        
        canvas.getSelection().setPrimary(figure);

        // inform all selection listeners about the new selection.
        //
        canvas.selectionListeners.each(function(i,w){
            w.onSelectionChanged(figure);
        });
    },
    

    /**
     * @method
     * 
     * @param {draw2d.Canvas} canvas
     * @param {Number} x the x-coordinate of the mouse down event
     * @param {Number} y the y-coordinate of the mouse down event
     */
    onMouseDown:function(canvas, x,y){
        this.mouseMovedDuringMouseDown  = false;
        var canDragStart = true;

        var figure = canvas.getBestFigure(x, y);

        // check if the user click on a child shape. DragDrop and movement must redirect
        // to the parent
        // Exception: Port's
        while((figure!==null && figure.getParent()!==null) && !(figure instanceof draw2d.Port)){
            figure = figure.getParent();
        }

        if (figure !== null && figure.isDraggable()) {
            canDragStart = figure.onDragStart(x - figure.getAbsoluteX(), y - figure.getAbsoluteY());
            // Element send a veto about the drag&drop operation
            if (canDragStart === false) {
                this.mouseDraggingElement = null;
                this.mouseDownElement = figure;
            }
            else {
                this.mouseDraggingElement = figure;
                this.mouseDownElement = figure;
            }
        }

        if (figure !== canvas.getSelection().getPrimary() && figure !== null && figure.isSelectable() === true) {
            this.select(canvas,figure);

            // its a line
            if (figure instanceof draw2d.shape.basic.Line) {
                // you can move a line with Drag&Drop...but not a connection.
                // A Connection is fixed linked with the corresponding ports.
                //
                if (!(figure instanceof draw2d.Connection)) {
                    canvas.draggingLineCommand = figure.createCommand(new draw2d.command.CommandType(draw2d.command.CommandType.MOVE));
                    if (canvas.draggingLineCommand !== null) {
                        canvas.draggingLine = figure;
                    }
                }
            }
            else if (canDragStart === false) {
                figure.unselect();
            }
        }
    },
    
    /**
     * @method
     * 
     * @param {draw2d.Canvas} canvas
     * @param {Number} dx The x diff between start of dragging and this event
     * @param {Number} dy The y diff between start of dragging and this event
     * @param {Number} dx2 The x diff since the last call of this dragging operation
     * @param {Number} dy2 The y diff since the last call of this dragging operation
     * @template
     */
    onMouseDrag:function(canvas, dx, dy, dx2, dy2){
        this.mouseMovedDuringMouseDown = true;
        
        if (this.mouseDraggingElement !== null) {
            // it is only necessary to repaint all connections if we change the layout of any connection
            // This can only happen if we:
            //    - with at least one connection intersection
            //    - we move a "Node. Only a node can have ports and connections
            if(canvas.linesToRepaintAfterDragDrop.isEmpty()===true && (this.mouseDraggingElement instanceof draw2d.shape.node.Node)){
                var nodeConnections = this.mouseDraggingElement.getConnections();
                var newLineIntersections = canvas.lineIntersections.clone();
                canvas.lineIntersections.each($.proxy(function(i, inter){
                    
                    if(nodeConnections.contains(inter.line) || nodeConnections.contains(inter.other)){
                        newLineIntersections.remove(inter);
                        canvas.linesToRepaintAfterDragDrop.add(inter.line);
                        canvas.linesToRepaintAfterDragDrop.add(inter.other);
                    }
                },this));
                canvas.lineIntersections = newLineIntersections;
                canvas.linesToRepaintAfterDragDrop.each(function(i, line){
                    line.svgPathString=null;
                    line.repaint();
                });
            }
            
            // Can be a ResizeHandle or a normal Figure
            //
            var sel =canvas.getSelection().getAll();
            if(!sel.contains(this.mouseDraggingElement)){
                this.mouseDraggingElement.onDrag(dx, dy, dx2, dy2);
            }
            else{
                sel.each(function(i,figure){
                    figure.onDrag(dx, dy, dx2, dy2);
                });
            }
            
            var p = canvas.fromDocumentToCanvasCoordinate(canvas.mouseDownX + (dx/canvas.zoomFactor), canvas.mouseDownY + (dy/canvas.zoomFactor));           
            var target = canvas.getBestFigure(p.x, p.y,this.mouseDraggingElement);
            
            if (target !== canvas.currentDropTarget) {
                if (canvas.currentDropTarget !== null) {
                    canvas.currentDropTarget.onDragLeave(this.mouseDraggingElement);                     
                    canvas.currentDropTarget = null;
                }
                if (target !== null) {
                    canvas.currentDropTarget = target.onDragEnter(this.mouseDraggingElement);
                }
            }
       }
       // Connection didn't support panning at the moment. There is no special reason for that. Just an interaction
       // decision.
       //
       else if(this.mouseDownElement!==null && !(this.mouseDownElement instanceof draw2d.Connection)){
           this.mouseDownElement.onPanning(dx, dy, dx2, dy2);
       } 
    },
    
    /**
     * @method
     * 
     * @param {draw2d.Canvas} canvas
     * @param {Number} x the x-coordinate of the mouse up event
     * @param {Number} y the y-coordinate of the mouse up event
     * @template
     */
    onMouseUp: function(canvas, x, y){
        if (this.mouseDraggingElement !== null) {
            var sel =canvas.getSelection().getAll();
            if(!sel.contains(this.mouseDraggingElement)){
                this.mouseDraggingElement.onDragEnd();
            }
            else{
                canvas.getCommandStack().startTransaction();
                canvas.getSelection().getAll().each(function(i,figure){
                     figure.onDragEnd();
                });
                canvas.getCommandStack().commitTransaction();
            }
            if(canvas.currentDropTarget!==null){
                this.mouseDraggingElement.onDrop(canvas.currentDropTarget);
                canvas.currentDropTarget.onDragLeave(this.mouseDraggingElement);
                canvas.currentDropTarget = null;
            }
            this.mouseDraggingElement = null;
        }
        
        // Reset the current selection if the user click in the blank canvas.
        // Don't reset the selection if the user pan the canvas
        //
        if (this.mouseDownElement === null && this.mouseMovedDuringMouseDown===false) {
            this.select(canvas,null);
        }

        this.mouseDownElement = null;
        this.mouseMovedDuringMouseDown  = false;
    }
});
