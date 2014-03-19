/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.diagram.Sparkline
 * 
 * Small data line diagram.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var testData = [];
 *     for(var i=0;i<100;i++) {
 *       testData.push(Math.floor(Math.random() * 100));
 *     }
 *     
 *     var sparkline = new draw2d.shape.diagram.Sparkline();
 *     sparkline.setData(testData);
 *   
 *     canvas.addFigure( sparkline,100,60);
 *     
 * @extends draw2d.shape.diagram.Diagram
 */
draw2d.shape.diagram.Sparkline = draw2d.shape.diagram.Diagram.extend({
    
    init: function( width, height){
        this.min = 0;
        this.max = 10;

        // set some feasible default values
        //
        if(typeof width === "undefined"){
            width=180;
            height=50;
        }
        
        this._super( width, height);
    },
    
    
    setData:function( data){
        // get the min/max from an array and not only from two elements..
        this.min = Math.min.apply(Math, data);
        this.max = Math.max.apply(Math, data);

        if(this.max==this.min){
            this.max = this.min+1;
        }
        
        this._super(data);
    },
    
    /**
     * @method
     * Create the additional elements for the figure
     * 
     */
    createSet: function(){
        return this.canvas.paper.path("M0 0 l0 0");
    },
     
    /**
     * 
     * @param attributes
     */
    repaint: function(attributes){
        if(this.repaintBlocked===true || this.shape===null){
            return;
        }
        
        if (typeof attributes === "undefined") {
            attributes = {};
        }

        attributes.fill= "90-#000:5-#4d4d4d:95";
        
        var padding = this.padding;
        var width = this.getWidth()- 2*+this.padding;
        var height= this.getHeight()- 2*+this.padding;
        var length= this.data.length;
        var min = this.min;
        var max = this.max;
        var toCoords = function(value, idx) {
            var step =1;
            // avoid divisionByZero
            if(length>1){
                step = (width/ (length-1));
            }

            return {
                y:  -((value-min)/(max-min) * height) + height+padding,
                x: padding+idx*step
            };
        };

        if(this.svgNodes!==null && (typeof this.cache.pathString ==="undefined")){
            var prev_pt=null;
            $.each(this.data, $.proxy(function(idx, item) {
                var pt = toCoords(item, idx);
                if(prev_pt===null) {
                    this.cache.pathString = [ "M", pt.x, pt.y].join(" ");
                }
                else{
                    this.cache.pathString = [ this.cache.pathString,"L", pt.x, pt.y].join(" ");
                }
                prev_pt = pt;
            },this));

            this.svgNodes.attr({path:this.cache.pathString, stroke: "#f0f0f0"});
            
        }
        this._super(attributes);
    }
});