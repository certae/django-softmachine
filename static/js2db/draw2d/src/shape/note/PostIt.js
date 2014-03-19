/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.note.PostIt
 * 
 * Simple Post-it like figure with text. Can be used for annotations or documentation.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var shape =  new draw2d.shape.note.PostIt("This is a simple sticky note");
 *     shape.setColor("#000000");
 *     shape.setPadding(20);
 *          
 *     canvas.addFigure(shape,40,10);
 *     
 * @author Andreas Herz
 * @extends draw2d.shape.basic.Label
 */
draw2d.shape.note.PostIt= draw2d.shape.basic.Label.extend({

	NAME : "draw2d.shape.note.PostIt",

    /**
     * @constructor
     * Creates a new PostIt element.
     * 
     * @param {String} [text] the text to display
     */
    init : function(text)
    {
        this._super(text);
         
        this.setStroke(1);
        this.setBackgroundColor("#5b5b5b");
        this.setColor("#FFFFFF");
        this.setFontColor("#ffffff");
        this.setFontSize(14);
        this.setPadding(5);
        this.setRadius(5);
       
    }
});



