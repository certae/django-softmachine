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
      */
     onMouseDown:function(canvas, x,y){
        this.x = x;
        this.y = y;

        var currentSelection = canvas.getSelection().getAll();
        
     	this._super(canvas, x,y);
    	
     	// we click on an element which are not part of the current selection
     	// => reset the "old" current selection
     	if(this.mouseDownElement!==null && this.mouseDownElement.isResizeHandle===false && !currentSelection.contains(this.mouseDownElement)){
     	    currentSelection.each($.proxy(function(i, figure){
    	        this.unselect(canvas,figure);
     	    },this));
     	}
     	
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
     */
    onMouseUp:function(canvas, x,y){
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
