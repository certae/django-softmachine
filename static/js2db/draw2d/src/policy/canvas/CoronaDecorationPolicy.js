/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.canvas.CoronaDecorationPolicy
 * 
 *
 * @author Andreas Herz
 * @extends draw2d.policy.canvas.DecorationPolicy
 */
draw2d.policy.canvas.CoronaDecorationPolicy = draw2d.policy.canvas.DecorationPolicy.extend({

    NAME : "draw2d.policy.canvas.CoronaDecorationPolicy",
    
    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
        this._super();
        
        this.startDragX = 0;
        this.startDragY = 0;
   },
    
    onInstall: function(canvas){
        var figures = canvas.getFigures();
        figures.each(function(i,figure){
            figure.getPorts().each(function(i,p){
                p.setVisible(false);
            });
        });
    },
    
    onUninstall: function(canvas){
        var figures = canvas.getFigures();
        figures.each(function(i,figure){
            figure.getPorts().each(function(i,p){
                p.setVisible(true);
            });
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
        this.startDragX = x;
        this.startDragY = y;
   },
    
    /**
     * @method
     * 
     * @param {draw2d.Canvas} canvas
     * @param {Number} x the x-coordinate of the mouse event
     * @param {Number} y the y-coordinate of the mouse event
     * @template
     */
    onMouseMove:function(canvas, x, y){
        this.updatePorts(canvas, x, y);
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
        this.updatePorts(canvas, this.startDragX+dx, this.startDragY+dy);
    },
    
    
    updatePorts:function(canvas,x,y){
        // 3.) Check now the common objects
        //
        var figures = canvas.getFigures();
        figures.each(function(i,figure){
            if (figure.isVisible()===true && figure.hitTest(x, y, 50) === true && figure instanceof draw2d.shape.node.Node){
                figure.getPorts().each(function(i,p){
                    p.setVisible(true);
                });
            }
            else{
                figure.getPorts().each(function(i,p){
                    p.setVisible(false);
                });
            }
        });
    }
    
});
