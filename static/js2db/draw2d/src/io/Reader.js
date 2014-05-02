/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.io.Reader
 * Template class for general import of a document into the canvas.
 * 
 * @author andreas Herz
 */

draw2d.io.Reader = Class.extend({
    
    /**
     * @constructor
     * @private
     */
    init: function(){
        
    },
    
    /**
     * @method
     * 
     * Restore the canvas from a given String.
     * 
     * @param {draw2d.Canvas} canvas the canvas to restore
     * @param {Object} document the document to read
     * @template
     */
    unmarshal: function(canvas, document){
        // do nothing. Inherit classes must implement this method
    }
    
});