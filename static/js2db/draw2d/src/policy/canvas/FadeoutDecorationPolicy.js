/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.canvas.FadeoutDecorationPolicy
 * 
 *
 * @author Andreas Herz
 * @extends draw2d.policy.canvas.DecorationPolicy
 */
draw2d.policy.canvas.FadeoutDecorationPolicy = draw2d.policy.canvas.DecorationPolicy.extend({

    NAME : "draw2d.policy.canvas.FadeoutDecorationPolicy",
    
    DEFAULT_FADEOUT_DURATION : 30,
    TARGET_COLOR: new draw2d.util.Color("#707070"),
    
    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
        this._super();
        this.alpha = 1.0;
        this.hidePortsCounter = this.DEFAULT_FADEOUT_DURATION;
        this.canvas = null;
    },
    
    onInstall: function(canvas){
        this.canvas = canvas;
        this.timerId = window.setInterval($.proxy(this.onTimer,this), 100);
        
        // initial hide all decorations after install of this policy
        //
        this.hidePortsCounter=1;
        this.alpha = 0.1;
    },
    
    onUninstall: function(canvas){
        window.clearInterval(this.timerId);
        this.canvas.getAllPorts().each($.proxy(function(i,port){
            port.setAlpha(1.0);
        },this));
        
    },
    
    onTimer: function(){
        this.hidePortsCounter--;
        
        if(this.hidePortsCounter<=0 && this.alpha >0){
            this.alpha = Math.max(0,this.alpha-0.05);
            
            this.canvas.getAllPorts().each($.proxy(function(i,port){
                port.setAlpha(this.alpha);
            },this));
            
            this.canvas.getSelection().getAll().each($.proxy(function(i,figure){
                figure.selectionHandles.each($.proxy(function(i,handle){
                    handle.setAlpha(this.alpha);
                },this));
            },this));
        }
        else if(this.hidePortsCounter>0 && this.alpha!==1.0){
            this.alpha =1;// Math.min(1,this.alpha+0.1);
            this.duringHide = false;
            this.canvas.getAllPorts().each($.proxy(function(i,port){
                port.setAlpha(this.alpha);
            },this));
            this.canvas.getSelection().getAll().each($.proxy(function(i,figure){
                figure.selectionHandles.each($.proxy(function(i,handle){
                    handle.setAlpha(this.alpha);
                },this));
            },this));
        }
    },
    
    
    /**
     * @method
     * 
     * @param {draw2d.Canvas} canvas
     * @param {Number} x the x-coordinate of the mouse down event
     * @param {Number} y the y-coordinate of the mouse down event
     */
    onMouseDown:function(canvas, x,y){
        this.hidePortsCounter=this.DEFAULT_FADEOUT_DURATION;
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
        this.hidePortsCounter=this.DEFAULT_FADEOUT_DURATION;
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
        this.hidePortsCounter=this.DEFAULT_FADEOUT_DURATION;
    },
    
    /**
     * @method
     * 
     * @param {draw2d.Canvas} canvas
     * @param {Number} x the x-coordinate of the mouse down event
     * @param {Number} y the y-coordinate of the mouse down event
     * @template
     */
    onMouseUp: function(figure, x, y){
        this.hidePortsCounter=this.DEFAULT_FADEOUT_DURATION;
    }
    
});
