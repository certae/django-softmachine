/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.diagram.Pie
 * 
 * Small data pie chart.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var pie = new draw2d.shape.diagram.Pie(80,80);
 *     pie.setData([30,60,122,4]);
 *     canvas.addFigure( pie,100,60);
 *     
 * @extends draw2d.shape.diagram.Diagram
 */
draw2d.shape.diagram.Pie = draw2d.shape.diagram.Diagram.extend({
    
    COLORS: ['#00A8F0', '#b9dd69', '#f3546a', '#4DA74D', '#9440ED'],
    TWO_PI : Math.PI * 2,
    
    init: function( diameter){
        this._super( diameter, diameter);
        this.setStroke(0);
    },
    
    setData:function( data){
        
        // Normalize the Data.
        // The SUM must be == 1.
        this.sum = 0;
        $.each(data,$.proxy(function(i,val){this.sum +=val;},this));
        var _sum=1/this.sum;
        $.each(data,$.proxy(function(i,val){data[i] = _sum*val;},this));
        
        //  pass the normalize data to the base implementation
        //
        this._super(data);
    },
      
    /**
     * @method
     * Create the additional elements for the figure
     * 
     */
    createSet : function()
    {
        var radius = this.getWidth()/2;
        var length= this.data.length;

        var pie = this.canvas.paper.set();

        var offsetAngle = 0;

        for ( var i = 0; i < length; i++) {
            // angle is percent of TWO_PI
            var angle = this.TWO_PI * this.data[i];
            var color = this.COLORS[i%length];
            var seg = this.drawSegment(radius, angle, offsetAngle, 0.1);
            seg.attr({stroke: this.color.hash(),fill:color});
            pie.push(seg);
            offsetAngle += angle;
        }
        return pie;
    },
     
    setDimension:function(w,h){
        // keep the aspect ration
        //
        if(w>h){
            this._super(w,w);
         }
         else{
            this._super(h,h);
         }
        
        // we must recreate the diagram if we change the size.
        // low performance. Better: transfor/scale the set. Can be done in the next release
        //
        if (this.svgNodes !== null) {
            this.svgNodes.remove();
            this.svgNodes = this.createSet();
        }
                
        this.repaint();
    },

    polarPath:function(radius, theta, rotation){
        var x, y;
        x = radius * Math.cos(theta + rotation)+radius;
        y = radius * Math.sin(theta + rotation)+radius;
        return "L " + x + " " + y + " "; 
    },

    drawSegment:function(radius, value, rotation, resolution){
      var path = "M "+radius+" "+radius;

      for (var i = 0; i < value; i+=resolution){
        path += this.polarPath(radius, i, rotation);
      }
      path += this.polarPath(radius, value, rotation);

      path += "L "+radius+" "+radius;
      return this.getCanvas().paper.path(path);
    },
    
    applyTransformation:function(){
       this.svgNodes.transform("T" + this.getAbsoluteX() + "," + this.getAbsoluteY());
    }
    
});