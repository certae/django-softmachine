/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
draw2d.SnapToHelper = {};

draw2d.SnapToHelper.NORTH =  1;
draw2d.SnapToHelper.SOUTH =  4;
draw2d.SnapToHelper.WEST  =  8;
draw2d.SnapToHelper.EAST  = 16;
draw2d.SnapToHelper.CENTER= 32;

draw2d.SnapToHelper.NORTH_EAST  = draw2d.SnapToHelper.NORTH | draw2d.SnapToHelper.EAST;
draw2d.SnapToHelper.NORTH_WEST  = draw2d.SnapToHelper.NORTH | draw2d.SnapToHelper.WEST;
draw2d.SnapToHelper.SOUTH_EAST  = draw2d.SnapToHelper.SOUTH | draw2d.SnapToHelper.EAST;
draw2d.SnapToHelper.SOUTH_WEST  = draw2d.SnapToHelper.SOUTH | draw2d.SnapToHelper.WEST;
draw2d.SnapToHelper.NORTH_SOUTH = draw2d.SnapToHelper.NORTH | draw2d.SnapToHelper.SOUTH;
draw2d.SnapToHelper.EAST_WEST   = draw2d.SnapToHelper.EAST | draw2d.SnapToHelper.WEST;
draw2d.SnapToHelper.NSEW        = draw2d.SnapToHelper.NORTH_SOUTH | draw2d.SnapToHelper.EAST_WEST;

/**
 * @class draw2d.policy.canvas.SnapToGeometryEditPolicy
 * 
 * Snapping is based on the existing children of a container. When snapping a shape, 
 * the edges of the bounding box will snap to edges of other rectangles generated 
 * from the children of the given canvas. 
 * 
 * 
 * @author Andreas Herz
 * 
 * @extends draw2d.policy.canvas.SnapToEditPolicy
 */
draw2d.policy.canvas.SnapToGeometryEditPolicy = draw2d.policy.canvas.SnapToEditPolicy.extend({

    NAME : "draw2d.policy.canvas.SnapToGeometryEditPolicy",
    
    SNAP_THRESHOLD   : 3,
    LINE_COLOR       : "#1387E6",
    FADEOUT_DURATION : 300,
    
    /**
     * @constructor 
     * Creates a new constraint policy for snap to grid
     * 
     * @param {Number} grid the grid width of the canvas
     */
    init: function( ){
        this._super();
        
        this.rows=null;
        this.cols=null;
        this.vline = null;
        this.hline = null;
        this.canvas = null;
    },

    onInstall: function(canvas){
        this.canvas = canvas;
    },
    
    onUninstall: function(canvas){
        this.canvas = null;
    },
    
    /**
     * @method
     * 
     * @param {draw2d.Canvas} canvas
     * @param {Number} x the x-coordinate of the mouse down event
     * @param {Number} y the y-coordinate of the mouse down event
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     * @template
     */
    onMouseUp: function(figure, x, y, shiftKey, ctrlKey){
        this.rows=null;
        this.cols=null;
        this.hideVerticalLine();
        this.hideHorizontalLine();
    },
    
    /**
     * @method
     * Adjust the coordinates to the canvas neighbours
     * 
     * @param figure
     * @param {draw2d.geo.Point} pos
     * @returns {draw2d.geo.Point} the contraint position of th efigure
     */
    snap: function(canvas, figure, pos){
        
        if(figure instanceof draw2d.ResizeHandle)
        {
           var snapPoint = figure.getSnapToGridAnchor();
           pos.x+= snapPoint.x;
           pos.y+= snapPoint.y;
           var result = new draw2d.geo.Point(pos.x,pos.y);

           var snapDirections = figure.getSnapToDirection();
           var direction = this.snapPoint(snapDirections, pos,result);

           // Show a vertical line if the snapper has modified the inputPoint
           //
           if((snapDirections & draw2d.SnapToHelper.EAST_WEST) && !(direction & draw2d.SnapToHelper.EAST_WEST))
              this.showVerticalLine(result.x);
           else
              this.hideVerticalLine();

           // Show a horizontal line if the snapper has modified the inputPoint
           //
           if((snapDirections & draw2d.SnapToHelper.NORTH_SOUTH) && !(direction & draw2d.SnapToHelper.NORTH_SOUTH))
              this.showHorizontalLine(result.y);
           else
              this.hideHorizontalLine();

           result.x-= snapPoint.x;
           result.y-= snapPoint.y;
           return result;
        }

        // The user drag&drop a normal figure
        var inputBounds = new draw2d.geo.Rectangle(pos.x,pos.y, figure.getWidth(), figure.getHeight());
        var result = new draw2d.geo.Rectangle(pos.x,pos.y, figure.getWidth(), figure.getHeight());

        var snapDirections = draw2d.SnapToHelper.NSEW;
        var direction = this.snapRectangle( inputBounds, result);

        // Show a vertical line if the snapper has modified the inputPoint
        //
        if((snapDirections & draw2d.SnapToHelper.WEST) && !(direction & draw2d.SnapToHelper.WEST))
           this.showVerticalLine(result.x);
        else if((snapDirections & draw2d.SnapToHelper.EAST) && !(direction & draw2d.SnapToHelper.EAST))
           this.showVerticalLine(result.getX()+result.getWidth());
        else
           this.hideVerticalLine();


        // Show a horizontal line if the snapper has modified the inputPoint
        //
        if((snapDirections & draw2d.SnapToHelper.NORTH) && !(direction & draw2d.SnapToHelper.NORTH))
           this.showHorizontalLine(result.y);
        else if((snapDirections & draw2d.SnapToHelper.SOUTH) && !(direction & draw2d.SnapToHelper.SOUTH))
           this.showHorizontalLine(result.getY()+result.getHeight());
        else
           this.hideHorizontalLine();

        return result.getTopLeft();
    },
    
    
    snapRectangle:function( /*:draw2d.Dimension*/ inputBounds,  /*:draw2d.Dimension*/ resultBounds)
    {
        var topLeftResult     = inputBounds.getTopLeft();
        var bottomRightResult = inputBounds.getBottomRight();

        var snapDirectionsTopLeft = this.snapPoint(draw2d.SnapToHelper.NORTH_WEST, inputBounds.getTopLeft(), topLeftResult);
        resultBounds.x = topLeftResult.x;
        resultBounds.y = topLeftResult.y;

        var snapDirectionsBottomRight = this.snapPoint(draw2d.SnapToHelper.SOUTH_EAST, inputBounds.getBottomRight(), bottomRightResult);
        // the first test (topLeft) has not modified the point. so we can modify them with the bottomRight adjustment
        //
        if(snapDirectionsTopLeft & draw2d.SnapToHelper.WEST)
          resultBounds.x = bottomRightResult.x-inputBounds.getWidth();

        // the first test (topLeft) has not modified the point. so we can modify them with the bottomRight adjustment
        //
        if(snapDirectionsTopLeft & draw2d.SnapToHelper.NORTH)
           resultBounds.y = bottomRightResult.y-inputBounds.getHeight();


        return snapDirectionsTopLeft |snapDirectionsBottomRight;
    },
    
    snapPoint:function(/*:int*/ snapOrientation, /*:draw2d.Point*/ inputPoint,  /*:draw2d.Point*/ resultPoint)
    {
       if(this.rows===null || this.cols===null)
         this.populateRowsAndCols();

       if ((snapOrientation & draw2d.SnapToHelper.EAST) !== 0) 
       {
          var rightCorrection = this.getCorrectionFor(this.cols, inputPoint.getX() -1, 1);
          if (rightCorrection !== this.SNAP_THRESHOLD) 
          {
             snapOrientation &= ~draw2d.SnapToHelper.EAST;
             resultPoint.x += rightCorrection;
          }
       }

       if ((snapOrientation & draw2d.SnapToHelper.WEST) !== 0) 
       {
          var leftCorrection = this.getCorrectionFor(this.cols, inputPoint.getX(), -1);
          if (leftCorrection !== this.SNAP_THRESHOLD) 
          {
             snapOrientation &= ~draw2d.SnapToHelper.WEST;
             resultPoint.x += leftCorrection;
          }
       }

       if ((snapOrientation & draw2d.SnapToHelper.SOUTH) !== 0) 
       {
          var bottomCorrection = this.getCorrectionFor(this.rows,  inputPoint.getY() - 1, 1);
          if (bottomCorrection !== this.SNAP_THRESHOLD) 
          {
             snapOrientation &= ~draw2d.SnapToHelper.SOUTH;
             resultPoint.y += bottomCorrection;
          }
       }

       if ((snapOrientation & draw2d.SnapToHelper.NORTH) !== 0) 
       {
          var topCorrection = this.getCorrectionFor(this.rows, inputPoint.getY(), -1);
          if (topCorrection !== this.SNAP_THRESHOLD) 
          {
             snapOrientation &= ~draw2d.SnapToHelper.NORTH;
             resultPoint.y += topCorrection;
          }
       }

      return snapOrientation;
    },
    
    populateRowsAndCols:function()
    {
       var selection = this.canvas.getSelection();
       this.rows = [];
       this.cols = [];
       
       var figures = this.canvas.getFigures();
       var index =0;
       for (var i = 0; i < figures.getSize();i++ )
       {
          var figure = figures.get(i);
          if(!selection.contains(figure))
          {
             var bounds = figure.getBoundingBox();
             this.cols[index * 3]     = {type:-1, location: bounds.getX()};
             this.rows[index * 3]     = {type:-1, location: bounds.getY()};
             this.cols[index * 3 + 1] = {type:0 , location: bounds.x + (bounds.getWidth() - 1) / 2};
             this.rows[index * 3 + 1] = {type:0 , location: bounds.y + (bounds.getHeight() - 1) / 2};
             this.cols[index * 3 + 2] = {type:1 , location: bounds.getRight() - 1};
             this.rows[index * 3 + 2] = {type:1 , location: bounds.getBottom() - 1};
             index++;
         }
       }
    },

    getCorrectionFor:function(/*:Array*/ entries, /*:double*/ value, /*:int*/ side) 
    {
       var resultMag = this.SNAP_THRESHOLD;
       var result = this.SNAP_THRESHOLD;

       for (var i = 0; i < entries.length; i++) 
       {
          var entry = entries[i];
          var magnitude;

          if (entry.type === -1 && side !== 0) 
          {
             magnitude = Math.abs(value - entry.location);
             if (magnitude < resultMag)
             {
                   resultMag = magnitude;
                   result = entry.location - value;
             }
          }
          else if (entry.type === 0 && side === 0) 
          {
             magnitude = Math.abs(value - entry.location);
             if (magnitude < resultMag)
             {
                resultMag = magnitude;
                result = entry.location - value;
             }
          }
          else if (entry.type === 1 && side !== 0) 
          {
             magnitude = Math.abs(value - entry.location);
             if (magnitude < resultMag)
             {
                resultMag = magnitude;
                result = entry.location - value;
             }
          }
       }
       return result;
    },
    
    showVerticalLine:function(x){
        if(this.vline!=null){
            return; //silently
        }
        this.vline = this.canvas.paper
                        .path("M " + x + " 0 l 0 " + this.canvas.getHeight())
                        .attr({"stroke":this.LINE_COLOR,"stroke-width":1});
    },
    
    hideVerticalLine:function(){
        if(this.vline==null){
            return;
        }
        var tmp = this.vline;
        tmp.animate({
            opacity: 0.1
        }, this.FADEOUT_DURATION,function(){
            tmp.remove();
        });
        
        this.vline = null;
    },
    
    showHorizontalLine:function(y){
        if(this.hline!=null){
            return;
        }
        
        this.hline = this.canvas.paper
                      .path("M 0 " + y + " l " + this.canvas.getWidth() + " 0")
                      .attr({"stroke":this.LINE_COLOR,"stroke-width":1});
    },

    hideHorizontalLine:function(){
        if(this.hline==null){
            return; //silently
        }
        var tmp = this.hline;
        tmp.animate({
            opacity: 0.1
        }, this.FADEOUT_DURATION,function(){
            tmp.remove();
        });
        this.hline = null;
    }
    
});