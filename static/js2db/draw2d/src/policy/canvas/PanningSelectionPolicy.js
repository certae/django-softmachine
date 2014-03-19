/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.canvas.PanningSelectionPolicy
 * 
 *
 * @author Andreas Herz
 * @extends draw2d.policy.canvas.SingleSelectionPolicy
 */
draw2d.policy.canvas.PanningSelectionPolicy =  draw2d.policy.canvas.SingleSelectionPolicy.extend({

    NAME : "draw2d.policy.canvas.PanningSelectionPolicy",
    
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
     * @param {draw2d.Canvas} canvas
     * @param {Number} dx The x diff between start of dragging and this event
     * @param {Number} dy The y diff between start of dragging and this event
     * @param {Number} dx2 The x diff since the last call of this dragging operation
     * @param {Number} dy2 The y diff since the last call of this dragging operation
     * @template
     */
    onMouseDrag:function(canvas, dx, dy, dx2, dy2){
        
        this._super(canvas, dx,dy,dx2,dy2);
        
        if (this.mouseDraggingElement === null && this.mouseDownElement===null) {
           var area = canvas.getScrollArea();
           area.scrollTop(area.scrollTop()+dy2);
           area.scrollLeft(area.scrollLeft()+dx2);
       }
    }
});
