/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.basic.Label
 * Implements a simple text with word wrapping.<br>
 * <br>
 * This very first implementation is pretty inchoate and must be revise fro performance reason.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var shape =  new draw2d.shape.basic.Text("This is a simple text with some loooooong word in.");
 *          
 *     canvas.addFigure(shape,40,10);
 *     
 * @author Andreas Herz
 * @since 4.2.3
 * @extends draw2d.SetFigure
 */
draw2d.shape.basic.Text= draw2d.shape.basic.Label.extend({

	NAME : "draw2d.shape.basic.Text",

    /**
     * @constructor
     * Creates a new text element.
     * 
     * @param {String} [text] the text to display
     */
    init : function(text)
    {
        this._super(text);
        
        this.cachedWrappedAttr = null;
        
        // set some good defaults
        this.setDimension(100,50);
        this.installEditPolicy(new draw2d.policy.figure.WidthSelectionFeedbackPolicy());
    },
    
    
    
    /**
     * @method
     * Trigger the repaint of the element and transport all style properties to the visual representation.<br>
     * Called by the framework.
     * 
     * @template
     **/
    repaint: function(attributes)
    {
        if(this.repaintBlocked===true || this.shape===null){
            return;
        }

        // style the label
       this.svgNodes.attr($.extend({},this.calculateTextAttr(),this.wrappedTextAttr(this.text, this.getWidth()-2*this.padding)));
        
        // set of the x/y must be done AFTER the font-size and bold has been set.
        // Reason: the getHeight method needs the font-size for calculation because
        //         it redirects the calculation to the SVG element.
        this.svgNodes.attr({x:this.padding,y: this.getHeight()/2});

        draw2d.SetFigure.prototype.repaint.call(this,attributes);
    },
    
    
    /**
     * @method
     * Set the dimension of the text box. The height parameter are ignored and adjusted with the calculated height.
     *
     **/
    setDimension:function( w, h)
    {
        this.clearCache();
        h = this.wrappedTextAttr(this.text, w).height;
        this._super(w,h);
        
        return this;
    },
    
    /**
     * @method
     * clear the internal cache for width/height precalculation
     * @private
     */
    clearCache:function(){
        this._super();
        this.cachedWrappedAttr = null;
    },
 

    
    /**
     * @method
     * A Label is not resizeable. In this case this method returns always <b>false</b>.
     * 
     * @returns Returns always false in the case of a Label.
     * @type boolean
     **/
    isResizeable:function()
    {
      return true;
    },
       
    
    /**
     * @method
     * This value is relevant for the interactive resize of the figure.
     *
     * @return {Number} Returns the min. width of this object.
     */
    getMinWidth:function()
    {
        if (this.shape === null) {
            return 0;
        }
        
        if(this.cachedMinWidth=== null){
            // get the longest word in the text
            //
            var longestWord = this.text.split(" ").reduce(function(arg1,arg2){ return arg1.length > arg2.length ? arg1 : arg2; });
            var svgText = this.canvas.paper
                                     .text(0, 0, longestWord)
                                     .attr($.extend({},this.calculateTextAttr(),{text:longestWord}));
            this.cachedMinWidth= svgText.getBBox(true).width+2*this.padding+2*this.getStroke();
            svgText.remove();
        }
        
        return this.cachedMinWidth;
    },
    

    /**
     * @method
     * calculates the attributes (wrapped text and width, height) with the given parameter
     * 
     * @private
     */
    wrappedTextAttr: function(text, width) {
        if(this.canvas ===null){
            return {text:text, width:width, height:20};
        }
        
        if(this.cachedWrappedAttr===null){
            var abc = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var svgText = this.canvas.paper.text(0, 0, "").attr($.extend({},this.calculateTextAttr(),{text:abc}));
            
            // get a good estimation of a letter width...not correct but this is working for the very first draft implementation
            var letterWidth = svgText.getBBox().width / abc.length;
    
            var words = this.text.split(" ");
            var x = 0, s = [];
            for ( var i = 0; i < words.length; i++) {
                var l = words[i].length;
                if (x + (l * letterWidth) > width) {
                    s.push("\n");
                    x = 0;
                }
                x += l * letterWidth;
                s.push(words[i] + " ");
            }
            var bbox = svgText.getBBox();
            svgText.remove();
            this.cachedWrappedAttr= {text: s.join(""), width:(bbox.width+this.padding*2), height: (bbox.height+this.padding*2)};
        }
        return this.cachedWrappedAttr;
     },

     /**
      * @method 
      * Return an objects with all important attributes for XML or JSON serialization
      * 
      * @returns {Object}
      */
     getPersistentAttributes : function()
     {
         var memento = this._super();
         

         return memento;
     },
     
     /**
      * @method 
      * Read all attributes from the serialized properties and transfer them into the shape.
      * 
      * @param {Object} memento
      * @returns 
      */
     setPersistentAttributes : function(memento)
     {
         this._super(memento);

     }

});