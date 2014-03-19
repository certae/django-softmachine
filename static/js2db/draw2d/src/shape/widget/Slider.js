/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.widget.Slider
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var slider = new draw2d.shape.widget.Slider(120,20);
 *     canvas.addFigure( slider,100,60);
 * 
 * @extends draw2d.shape.widget.Widget
 */
draw2d.shape.widget.Slider = draw2d.shape.widget.Widget.extend({
    
    NAME : "draw2d.shape.widget.Slider",
    
    DEFAULT_COLOR_THUMB : new draw2d.util.Color("#bddf69"),
//    DEFAULT_COLOR_THUMB : new draw2d.util.Color("#54b0d0"),
    DEFAULT_COLOR_BG : new draw2d.util.Color("#d3d3d3"),
    
    
    init: function( width, height){
        // create some good defaults for width/height
        if(typeof width === "undefined"){
            width=120;
            height=15;
        }
        
        this.currentValue = 0; // [0..100] 
        this.slideBoundingBox = new draw2d.geo.Rectangle(0,0,10,20);

        this._super( width, height);
        
        this.setBackgroundColor(this.DEFAULT_COLOR_BG);
        this.setColor(this.DEFAULT_COLOR_THUMB);
        this.setStroke(1);
        this.setRadius(4);
        this.setResizeable(true);
        
        this.setMinHeight(10);
        this.setMinWidth(80);
    },
    
    /**
     * @method
     * Create the additional elements for the figure
     * 
     */
    createSet: function(){
        var result = this.canvas.paper.set();
        var thumb= this.canvas.paper.rect(5,5,10,20);
        thumb.node.style.cursor=  "col-resize";
        result.push(thumb);

        return result;
    },
    
    setDimension:function(w,h){
        this._super(w,h);
        this.slideBoundingBox.setBoundary(0,0,this.getWidth()-10 , this.getHeight());
        this.slideBoundingBox.setHeight(this.getHeight()+1);
        
        // TODO: and repaint again.....two repaints for one "setDimension"....BAD
        //
        this.repaint();
    },

    /**
     * @method
     * Called if the value of the slider has been changed.
     * 
     * @param {Number} value The new value of the slider in percentage [0..100]
     * @template
     */
    onValueChange:function(value){
    },
    
    /**
     * @method
     * Will be called if the drag and drop action begins. You can return [false] if you
     * want avoid that the figure can be move.
     * 
     * @param {Number} relativeX the x coordinate within the figure
     * @param {Number} relativeY the y-coordinate within the figure.
     * 
     * @return {boolean} true if the figure accepts dragging
     **/
    onDragStart : function(relativeX, relativeY ){
        
        // check if the use has been clicked on the thumb
        //
        if(this.slideBoundingBox.hitTest(relativeX, relativeY)){
            this.origX=this.slideBoundingBox.getX();
            this.origY=this.slideBoundingBox.getY();
            return false;
        }
        
        return this._super(relativeX, relativeY);
    },
    
    /**
     * @method
     * Called by the framework if the figure returns false for the drag operation. In this
     * case we send a "panning" event - mouseDown + mouseMove. This is very usefull for
     * UI-Widget like slider, spinner,...
     * 
     * @param {Number} dx the x difference between the mouse down operation and now
     * @param {Number} dy the y difference between the mouse down operation and now
     * @param {Number} dx2 The x diff since the last call of this dragging operation
     * @param {Number} dy2 The y diff since the last call of this dragging operation
     */
    onPanning: function(dx, dy, dx2, dy2){
        this.slideBoundingBox.setPosition(this.origX+dx, this.origY+dy);
        // calculate the internal value of the slider
        this.setValue(100/(this.slideBoundingBox.bw-this.slideBoundingBox.getWidth())*this.slideBoundingBox.getX());
    },

    /**
     * @method
     * Set the current value of the slider. Valid values are [0..100]
     * 
     * @param {Number} value values between [0..100]
     */
    setValue:function(value){
        this.currentValue = Math.min(Math.max(0,(value|0)),100);
        this.repaint();
        this.onValueChange(this.currentValue);
    },

    
    /**
     * 
     * @param attributes
     */
    repaint: function(attributes){
        
        if (this.repaintBlocked === true || this.shape === null){
            return;
        }

        if (typeof attributes === "undefined") {
            attributes = {};
        }
     
        // adjust the slider to the current value and the new dimension of the widget
        //
        var thumbX = ((this.slideBoundingBox.bw-this.slideBoundingBox.getWidth())/100*this.currentValue)|0;
        this.slideBoundingBox.setX(thumbX);


        // update slider
        //
		if (this.svgNodes !== null) {
			var attr = this.slideBoundingBox.toJSON();
			attr.y = attr.y - 5;
			attr.height = attr.height + 10;
			attr.fill = this.getColor().hash();
			attr.stroke = this.getColor().darker(0.2).hash();
			attr.r = 4;
			this.svgNodes.attr(attr);
		}
 
        
        attributes.fill= "90-"+this.bgColor.hash()+":5-"+this.bgColor.lighter(0.3).hash()+":95";
        attributes.stroke = this.bgColor.darker(0.1).hash();

        this._super(attributes);
    },
    

    applyTransformation:function(){
        this.svgNodes.transform("T" + this.getAbsoluteX() + "," + this.getAbsoluteY());
    }

});