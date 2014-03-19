/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.layout.HorizontalLayout
 * The HorizontalLayout class arranges the layout elements in a horizontal sequence, 
 * left to right, with optional gaps between the elements. 
 * 
 * During the execution of the setDimension() method, the minimum width of the container is calculated 
 * by accumulating the minimum sizes of the elements, including stroke, gaps and padding. 
 * 
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
 *     var container1 = new draw2d.shape.layout.HorizontalLayout();
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
 *     var container2 = new draw2d.shape.layout.HorizontalLayout();
 *     
 *     container2.addFigure(label11);
 *     container2.addFigure(label12);
 *     container2.addFigure(label13);
 *     
 *     canvas.addFigure(container2,50,90);
 *     
 *     
 * @author Andreas Herz
 * @extends draw2d.shape.layout.Layout
 * @since 2.5.1
 */
draw2d.shape.layout.HorizontalLayout= draw2d.shape.layout.Layout.extend({

	NAME : "draw2d.shape.layout.HorizontalLayout",

    /**
     * @constructor
     * Constructs a HorizontalLayout.
     * 
     */
    init : function()
    {
        this._super();
        var _this = this;
        this.locator ={ 
                relocate:function(index, target)
                {
                    var stroke = _this.getStroke();
                    var xPos = stroke; // respect the border of the parent
                    
                    for (var i=0;i<index;i++){
                        var child = _this.children.get(i).figure;
                        xPos+=child.getWidth()+_this.gap;
                    }
                    
                    target.setPosition(xPos,stroke);
                 }
        };

        this.setDimension(1,1);
        this.gap = 0;
   },

   /**
    * @method
    * Set the gap width between child components within this layout. 
    * This will only affect the space between components, not the space around all the components in the layout.
    * 
    * @param {Number} gap The space, in pixels, between items.
    * @since 2.5.1
    */
   setGap: function(gap){
       this.gap = gap;
       // this forces a relayout of the element
       this.setDimension(1,1);
   },
   
   
   /**
    * @method
    * 
    * @private
    * @returns
    */
    getMinWidth:function()
    {
        var width=this.stroke*2+ Math.max(0,this.children.getSize()-1)*this.gap;
        this.children.each(function(i,e){
            width += e.figure.getMinWidth();
            
        });
        return width;
    },

    /**
     * @method
     * 
     * @private
     * @returns
     */
    getMinHeight:function()
    {
        var height=10;
        this.children.each(function(i,e){
            height = Math.max(height, e.figure.getMinHeight());
        });
        return height+this.stroke*2;
    },
    
    /**
     * @method
     * Set the new dimension of the Layout. Forces a relayout of children.
     * 
     * @returns
     */
    setDimension:function( w, h)
    {
        this._super(w,h);

        var diff = this.width-this.getMinWidth();
        if(diff>0){
            diff = (diff/this.children.getSize())|0;
            this.children.each(function(i,e){
                e.figure.setDimension(e.figure.getMinWidth()+diff,e.figure.getHeight());
            });
        }
        else{
            this.children.each(function(i,e){
                e.figure.setDimension(1,1);
            });
        }
     }

});



