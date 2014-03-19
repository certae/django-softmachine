/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.layout.VerticalLayout
 * The VerticalLayout class arranges the layout elements in a vertical sequence, 
 * left to right, with optional gaps between the elements. 
 * 
 * During the execution of the setDimension() method, the minimum height of the container is calculated 
 * by accumulating the minimum sizes of the elements, including stroke, gaps and padding. 
 *     
 * See the example below with and without gap and border settings
 * 
 *     
 *     @example preview small frame
 *     
 *     // first container without any gap and a border of the parent
 *     // container
 *     var label1 =  new draw2d.shape.basic.Label("Label 1");
 *     var label2 =  new draw2d.shape.basic.Label("Label 2");
 *     var label3 =  new draw2d.shape.basic.Label("Label 3");
 *     
 *     var container1 = new draw2d.shape.layout.VerticalLayout();
 *     
 *     container1.addFigure(label1);
 *     container1.addFigure(label2);
 *     container1.addFigure(label3);
 *     container1.setGap(10);
 *     container1.setStroke(2);
 *     canvas.addFigure(container1,50,10);
 *     
 *     // second container without any gab or border
 *     //
 *     var label11 =  new draw2d.shape.basic.Label("Label 1");
 *     var label12 =  new draw2d.shape.basic.Label("Label 2");
 *     var label13 =  new draw2d.shape.basic.Label("Label 3");
 *     
 *     var container2 = new draw2d.shape.layout.VerticalLayout();
 *     
 *     container2.addFigure(label11);
 *     container2.addFigure(label12);
 *     container2.addFigure(label13);
 *     
 *     canvas.addFigure(container2,150,10);
 *     
 * @author Andreas Herz
 * @extends draw2d.shape.layout.Layout
 */
draw2d.shape.layout.VerticalLayout= draw2d.shape.layout.Layout.extend({

	NAME : "draw2d.shape.layout.VerticalLayout",

    /**
     * @constructor
     * Constructs a VerticalLayout 
     * 
     */
    init : function()
    {
        this._super();
        
        // some layout parameter
        //
        this.gap = 0;

        // "this" shortcut to avoid $.proxy
        var _this = this;
        
        this.locator = {
            relocate:function(index, target)
            {
                var stroke = _this.getStroke()/2;
                var yPos =stroke; // respect the border of the shape
                
                for (var i=0;i<index;i++){
                    var child = _this.children.get(i).figure;
                    yPos=yPos+child.getHeight()+_this.gap;
                }
                
                target.setPosition(stroke,yPos);
             }
        };
        
        this.setDimension(10,10);
    },
    

    /**
     * @method
     * Set the gap width between child components within this layout. 
     * This will only affect the space between components, not the space around all the components in the layout.
     * 
     * @param {Number} gap The space, in pixels, between items.
     */
    setGap: function(gap){
        this.gap = gap;
        // this forces a relayout of the element
        this.setDimension(1,1);
    },
    
    getMinWidth:function()
    {
        var width=10;
        this.children.each(function(i,e){
            width = Math.max(width, e.figure.getMinWidth());
        });
        return width+this.stroke;
    },
    
    getMinHeight:function()
    {
        var height=+this.stroke+ Math.max(0,this.children.getSize()-1)*this.gap;
        this.children.each(function(i,e){
            height += e.figure.getMinHeight();
        });
        return height;
    },
    
    /**
     * @method
     *
     **/
    setDimension:function( w, h)
    {
        this._super(w,h);

        var width=this.width-this.stroke;
        this.children.each(function(i,e){
            e.figure.setDimension(width,e.figure.getHeight());
        });
    }
   

});



