/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.diagram.Diagram
 * Base class for all digrams.
 * 
 * @extends draw2d.SetFigure
 */
draw2d.shape.diagram.Diagram = draw2d.SetFigure.extend({
    
    init: function( width, height){
        
        this.data = [];
        this.padding = 5;
        this.cache = {}; 
        
        this._super( width, height);
        
        this.setBackgroundColor("#8dabf2");
        this.setStroke(1);
        this.setColor("#f0f0f0");
        this.setRadius(2);
        this.setResizeable(true);
    },
    
    /**
     * @method
     * Set the data for the chart/diagram element
     * 
     * @param {Array} data
     */
    setData:function( data){
        this.data = data;
        this.cache={};
        

       if (this.svgNodes !== null) {
            this.svgNodes.remove();
            this.svgNodes = this.createSet();
        }
        
       this.repaint();
    },

    setDimension:function(w,h){
        this.cache={};
        this._super(w,h);
    },

    
    /**
     * @method
     * Return the calculate width of the set. This calculates the bounding box of all elements.
     * 
     * @return {Number} the calculated width of the label
     **/
    getWidth:function() {
        return this.width;
    },
    
    /**
     * @method
     * Return the calculated height of the set. This calculates the bounding box of all elements.
     * 
     * @return {Number} the calculated height of the label
     */
    getHeight:function(){
       return this.height;
    },
    
    /**
     * 
     * @param attributes
     */
    repaint:function(attributes){
        if(this.repaintBlocked===true || this.shape==null){
            return;
        }
        
        if (typeof attributes === "undefined") {
            attributes = {};
        }

        if(typeof attributes.fill ==="undefined"){
            attributes.fill= "none";
        }
         
        this._super(attributes);
    },
    
    applyTransformation:function(){
        if (this.isResizeable()===true) {
            this.svgNodes.transform("S"+this.scaleX+","+this.scaleY+","+this.getAbsoluteX()+","+this.getAbsoluteY()+ "t"+ this.getAbsoluteX() + "," + this.getAbsoluteY());
        }
        else {
            this.svgNodes.transform("T" + this.getAbsoluteX() + "," + this.getAbsoluteY());
        }
    }
    

});