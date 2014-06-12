/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.canvas.BoundingboxSelectionPolicy
 * 
 *
 * @author Andreas Herz
 * @extends draw2d.policy.canvas.SelectionPolicy
 */
draw2d.policy.canvas.BoundingboxSelectionPolicy =  draw2d.policy.canvas.SingleSelectionPolicy.extend({

    NAME : "draw2d.policy.canvas.BoundingboxSelectionPolicy",
    
    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
        this._super();
        
        this.boundingBoxFigure1 =null;
        this.boundingBoxFigure2 =null;
        this.x = 0;
        this.y = 0;
     },
   
     select: function(canvas, figure){
         if(canvas.getSelection().getAll().contains(figure)){
             return; // noting to to
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
      * @param {Boolean} shiftKey true if the shift key has been pressed during this event
      * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
      */
     onMouseDown:function(canvas, x, y, shiftKey, ctrlKey){
        this.x = x;
        this.y = y;

        var currentSelection = canvas.getSelection().getAll();
        
        // COPY_PARENT
        // this code part is copied from the parent implementation. The main problem is, that 
        // the sequence of unselect/select of elements is broken if we call the base implementation
        // in this case a wrong of events is fired if we select a figure if alread a figure is selected!
        // WRONG: selectNewFigure -> unselectOldFigure
        // RIGHT: unselectOldFigure -> selectNEwFigure
        // To ensure this I must copy the parent code and postpond the event propagation
        //
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

        // we click on an element which are not part of the current selection
        // => reset the "old" current selection if we didn't press the shift key
        if(shiftKey === false){
            if(this.mouseDownElement!==null && this.mouseDownElement.isResizeHandle===false && !currentSelection.contains(this.mouseDownElement)){
                currentSelection.each($.proxy(function(i, figure){
                    this.unselect(canvas,figure);
                },this));
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
        // END_COPY FROM PARENT
        
        
        // inform all figures that they have a new ox/oy position for the relative
        // drag/drop operation
        currentSelection = canvas.getSelection().getAll();
        currentSelection.each($.proxy(function(i,figure){
             var canDragStart= figure.onDragStart(figure.getAbsoluteX(),figure.getAbsoluteY());
             // its a line
             if (figure instanceof draw2d.shape.basic.Line) {
                 
             }
             else if(canDragStart===false){
                 this.unselect(canvas,figure);
             }
        },this));
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
        
        this._super(canvas, dx,dy,dx2,dy2);
        
        if (this.mouseDraggingElement === null && this.mouseDownElement===null && this.boundingBoxFigure1===null) {
            this.boundingBoxFigure1 = new draw2d.shape.basic.Rectangle(1,1);
            this.boundingBoxFigure1.setPosition(this.x,this.y);
            this.boundingBoxFigure1.setCanvas(canvas);
            this.boundingBoxFigure1.setBackgroundColor("#0f0f0f");
            this.boundingBoxFigure1.setAlpha(0.1);
            
            this.boundingBoxFigure2 = new draw2d.shape.basic.Rectangle(1,1);
            this.boundingBoxFigure2.setPosition(this.x,this.y);
            this.boundingBoxFigure2.setCanvas(canvas);
            this.boundingBoxFigure2.setDashArray("- ");
            this.boundingBoxFigure2.setStroke(1);
            this.boundingBoxFigure2.setColor(new draw2d.util.Color(84,151,220));
            this.boundingBoxFigure2.setBackgroundColor(null);
       }
        
        if (this.boundingBoxFigure1!==null) {
            this.boundingBoxFigure1.setDimension(Math.abs(dx),Math.abs(dy));
            this.boundingBoxFigure1.setPosition(this.x + Math.min(0,dx), this.y + Math.min(0,dy));
            this.boundingBoxFigure2.setDimension(Math.abs(dx),Math.abs(dy));
            this.boundingBoxFigure2.setPosition(this.x + Math.min(0,dx), this.y + Math.min(0,dy));
        }
    },
    
    /**
     * @method
     * 
     * @param {draw2d.Canvas} canvas
     * @param {Number} x the x-coordinate of the mouse down event
     * @param {Number} y the y-coordinate of the mouse down event
      * @param {Boolean} shiftKey true if the shift key has been pressed during this event
      * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     */
    onMouseUp:function(canvas, x,y, shiftKey, ctrlKey){
        // delete the current selection if you have clicked in the empty
        // canvas.
        if(this.mouseDownElement===null){
            canvas.getSelection().getAll().each($.proxy(function(i,figure){
                this.unselect(canvas, figure);
            },this));
        }
        else if(this.mouseDownElement instanceof draw2d.ResizeHandle || (this.mouseDownElement instanceof draw2d.shape.basic.LineResizeHandle)){
            // Do nothing
            // A click on a resize handle didn't change the selection of the canvas
            //
        }
        // delete the current selection if you click on another figure than the current
        // selection and you didn't drag the complete selection.
        else if(this.mouseDownElement!==null && this.mouseMovedDuringMouseDown===false){
            var sel =canvas.getSelection().getAll();
            if(!sel.contains(this.mouseDownElement)){
               canvas.getSelection().getAll().each($.proxy(function(i,figure){
                        this.unselect(canvas, figure);
                },this));
            }   
        }
        this._super(canvas, x,y);
        
        if (this.boundingBoxFigure1!==null) {
            // retrieve all figures which are inside the bounding box and select all of them
            //
            var selectionRect = this.boundingBoxFigure1.getBoundingBox();
            canvas.getFigures().each($.proxy(function(i,figure){
                if(figure.getBoundingBox().isInside(selectionRect)){
                    var canDragStart = figure.onDragStart(figure.getAbsoluteX(),figure.getAbsoluteY());
                    if(canDragStart===true){
                        this.select(canvas,figure,false);
                    }
                }
            },this));
            
            var selection = canvas.getSelection();
            
            // adding connections to the selection of the source and target port part of the current selection
            canvas.getLines().each($.proxy(function(i,line){
                if(line instanceof draw2d.Connection){
                    if(selection.contains(line.getSource().getParent()) && selection.contains(line.getTarget().getParent())){
                        this.select(canvas,line,false);
                    }
                }
            },this));
            
          this.boundingBoxFigure1.setCanvas(null);
          this.boundingBoxFigure1 = null;
          this.boundingBoxFigure2.setCanvas(null);
          this.boundingBoxFigure2 = null;
        }
   }
    
});