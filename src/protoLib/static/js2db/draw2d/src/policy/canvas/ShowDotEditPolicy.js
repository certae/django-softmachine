/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.canvas.ShowDotEditPolicy
 * 
 * Paint a dotted pattern in the background of the canvas.
 * 
 * 
 * @author Andreas Herz
 * 
 * @extends draw2d.policy.canvas.CanvasPolicy
 * @since 4.0.1
 */
draw2d.policy.canvas.ShowDotEditPolicy = draw2d.policy.canvas.CanvasPolicy.extend({

    NAME : "draw2d.policy.canvas.ShowDotEditPolicy",
    
    DOT_COLOR  : "#999999",
    DOT_RADIUS  : 1,
    DOT_DISTANCE : 20,
    
    /**
     * @constructor 
     * Creates a new constraint policy for snap to grid
     * 
     * @param {Number} [dotDistance] the distance or grid width between the dots.
     * @param {Number} [dotRadius] the radius of the dots.
     * @param {draw2d.util.Color|String} [dotColor] the color for the dots.
     */
    init: function( dotDistance, dotRadius, dotColor){
        this._super();
        this.canvas = null;

        this.dotDistance = dotDistance ? dotDistance : this.DOT_DISTANCE;
        this.dotRadius = dotRadius ? dotRadius : this.DOT_RADIUS;
        this.dotColor = new draw2d.util.Color(dotColor ? dotColor : this.DOT_COLOR);
               
        // generate the background pattern with an data URL GIF image. This is much faster than draw
        // the pattern via the canvas and the raphael.circle method
        //
        var mypixels = Array(this.dotDistance*this.dotDistance);
        // set the pixel at the coordinate [0,0] as opaque.       
        mypixels[0] = 1;
        this.imageDataURL = this.createMonochromGif(this.dotDistance, this.dotDistance, mypixels, this.dotColor);
    },

    onInstall: function(canvas){
        this.canvas = canvas;
        this.oldBg =  this.canvas.html.css("background-image");
        $(canvas.paper.canvas).css({"background-image": "url('"+this.imageDataURL+"')"});
    },
    
    onUninstall: function(canvas){
        this.canvas = null;
        $(canvas.paper.canvas).css({"background-image": this.oldBg});
    }
    

});