/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.canvas.FadeoutDecorationPolicy
 * 
 * Install this edit policy in a canvas if you want fadeout all decorations like ports, resize handles 
 * if the user didn't move the mouse. This is good for a clean representation of your diagram.
 *  
 *
 * @author Andreas Herz
 * @extends draw2d.policy.canvas.DecorationPolicy
 */
draw2d.policy.canvas.FadeoutDecorationPolicy = draw2d.policy.canvas.DecorationPolicy.extend({

    NAME : "draw2d.policy.canvas.FadeoutDecorationPolicy",
    
    DEFAULT_FADEOUT_DURATION : 60,
    DEFAULT_ALPHA_DECREMENT: 0.05,
    
    /**
     * @constructor 
     * Creates a new fade out policy. Don't forget to install them into the canvas.
     * 
     */
    init: function(){
        this._super();
        this.alpha = 1.0;
        this.alphaDec = this.DEFAULT_ALPHA_DECREMENT;
        this.hidePortsCounter = this.DEFAULT_FADEOUT_DURATION;
        this.canvas = null;
        this.portDragging = false;
    },
    
    onInstall: function(canvas){
        this.canvas = canvas;
        this.timerId = window.setInterval($.proxy(this.onTimer,this), 50);
        
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
            this.alpha = Math.max(0,this.alpha-this.alphaDec);
            
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
            this.alphaDec = this.DEFAULT_ALPHA_DECREMENT;
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
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     */
    onMouseDown:function(canvas, x,y, shiftKey, ctrlKey){
        this.hidePortsCounter=this.DEFAULT_FADEOUT_DURATION;
        this.portDragging = (canvas.getBestFigure(x, y) instanceof draw2d.Port);
    },
    
    /**
     * @method
     * 
     * @param {draw2d.Canvas} canvas
     * @param {Number} x the x-coordinate of the mouse event
     * @param {Number} y the y-coordinate of the mouse event
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     * @template
     */
    onMouseMove:function(canvas, x, y, shiftKey, ctrlKey){
        this.hidePortsCounter=this.DEFAULT_FADEOUT_DURATION;
        this.portDragging = false;
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
        if(this.portDragging === false){
            this.hidePortsCounter=0;
            this.alphaDec = 0.1;
            this.onTimer();
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
     * @template
     */
    onMouseUp: function(figure, x, y, shiftKey, ctrlKey){
        this.hidePortsCounter=this.DEFAULT_FADEOUT_DURATION;
        this.portDragging = false;
    }
    
});