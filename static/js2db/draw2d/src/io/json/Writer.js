/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/

/**
 * @class draw2d.io.json.Writer
 * Serialize the canvas document into a JSON object which can be read from the corresponding
 * {@link draw2d.io.json.Reader}.
 * 
 *      // Create a JSON writer and convert it into a JSON-String representation.
 *      //
 *      var writer = new draw2d.io.json.Writer();
 *      writer.marshal(canvas, function(json){
 *         // convert the json object into string representation
 *         var jsonTxt = JSON.stringify(json,null,2);
 *      
 *         // insert the json string into a DIV for preview or post
 *         // it via ajax to the server....
 *         $("#json").text(jsonTxt);
 *      
 *      });
 *      
 *
 * 
 * @author Andreas Herz
 * @extends draw2d.io.Writer
 */
draw2d.io.json.Writer = draw2d.io.Writer.extend({
    
    init:function(){
        this._super();
    },
    
    /**
     * @method
     * Export the content to the implemented data format. Inherit class implements
     * content specific writer.
     * <br>
     * <br>
     * 
     * Method signature has been changed from version 2.10.1 to version 3.0.0.<br>
     * The parameter <b>resultCallback</b> is required and new. The method calls
     * the callback instead of return the result.
     * 
     * @param {draw2d.Canvas} canvas
     * @param {Function} resultCallback the method to call on success. The first argument is the result object
     */
    marshal: function(canvas, resultCallback){
        // I change the API signature from version 2.10.1 to 3.0.0. Throw an exception
        // if any application not care about this changes.
        if(typeof resultCallback === "undefined"){
            throw "Writer.marshal method signature has been change from version 2.10.1 to version 3.0.0. Please consult the API documentation about this issue.";
        }
        
        var result = [];
        var figures = canvas.getFigures();
        var i =0;
        var f= null;
        
        // conventional iteration over an array
        //
        for(i=0; i< figures.getSize(); i++){
            f = figures.get(i);
            result.push(f.getPersistentAttributes());
        }
        
        // jQuery style to iterate
        //
        var lines = canvas.getLines();
        lines.each(function(i, element){
            result.push(element.getPersistentAttributes());
        });
        
        resultCallback(result);
    }
});