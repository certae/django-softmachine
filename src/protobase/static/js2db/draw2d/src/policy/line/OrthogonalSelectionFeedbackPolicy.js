/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.line.OrthogonalSelectionFeedbackPolicy
 * 
 * Feedback and edit policy for the InteractiveMannhattanRouter.
 * 
 * @author  Andreas Herz
 * @extends draw2d.policy.line.LineSelectionFeedbackPolicy
 */
draw2d.policy.line.OrthogonalSelectionFeedbackPolicy = draw2d.policy.line.LineSelectionFeedbackPolicy.extend({

    NAME : "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",

    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
        this._super();
        
        // The ResizeHandle for the Policy. This is inline to avoid that a user want to use them without
        // the right installed policy.
        //
        this.ResizeHandle = draw2d.ResizeHandle.extend({
            NAME : "#ResizeHandle",

             init: function( figure, index) {
                this._super(figure);
                this.index = index;
            },
           
            
            /**
             * @method
             * Will be called after a drag and drop action.<br>
             *
             * @private
             **/
            onDragStart : function()
            {
                this._super();
                this.command = this.getCanvas().getCurrentSelection().createCommand(new draw2d.command.CommandType(draw2d.command.CommandType.MOVE_VERTICES));
                
                // Vertex is a reference and not a copy of the point
                this.vertex = this.owner.getVertices().get(this.index).clone();
            },
            
            /**
             * @method
             * Called from the framework during a drag&drop operation of the ResizeHandles
             * 
             * @param {Number} dx the x difference between the start of the drag drop operation and now
             * @param {Number} dy the y difference between the start of the drag drop operation and now
             * @param {Number} dx2 The x diff since the last call of this dragging operation
             * @param {Number} dy2 The y diff since the last call of this dragging operation
             * @return {boolean}
             **/
            onDrag : function(dx, dy, dx2, dy2) 
            {
                if (this.command == null) {
                    return false;
                }
                
                var fromDir = this.owner.getSource().getConnectionDirection(this.owner, this.owner.getTarget());
                var toDir   = this.owner.getTarget().getConnectionDirection(this.owner, this.owner.getSource());
                
                this.vertex.translate(dx2, dy2);
                
                var vertices = this.owner.getVertices();
                var   count  = vertices.getSize();
                //shortcut for math operations
                var max = Math.max;
                var min = Math.min;
                
                
                // Keep in mind: "p1" is always the dragged handle in the coding below
                //               marked with an '*' in the diagram 
                //
                
                // FIRST handle of the connection
                //
                if(this.index === 1){
                    var p0 = vertices.get(this.index-1); // first vertex of the connection
                    var p1 = vertices.get(this.index  ); // dragged vertex
                    var p2 = vertices.get(this.index+1); // additional neighbor

                    // vertex alignment to handle:
                    //
                    //      p0 +-----* p1       p1 *------+ p0          
                    //               |             |          
                    //               |             |         
                    //               + p2       p2 +
                    if((p1.x == p2.x) && (p0.y == p1.y)){
                       switch(fromDir){
                       case draw2d.geo.Rectangle.DIRECTION_RIGHT:
                          // p0 is on the left of p1
                          //
                          this.owner.setVertex(1,max(p0.x+10,this.vertex.x), p1.y); // p1
                          this.owner.setVertex(2,max(p0.x+10,this.vertex.x), p2.y); // p2
                          break;
                          // p0 is on the right of p2
                          //
                       case draw2d.geo.Rectangle.DIRECTION_LEFT:
                          this.owner.setVertex(1,min(p0.x-10,this.vertex.x), p1.y); // p1
                          this.owner.setVertex(2,min(p0.x-10,this.vertex.x), p2.y); // p2
                          break;
                       }
                    }
                    
                    // vertices alignment to handle:
                    //
                    //      p0 +              p1 *--------+ p2
                    //         |                 |
                    //         |                 |
                    //      p1 *-----+ p2     p0 +
                    else{
                       switch(fromDir){
                       case draw2d.geo.Rectangle.DIRECTION_UP:
                          // p0 is below of p1
                          //
                          this.owner.setVertex(1,p1.x,min(p0.y-10,this.vertex.y)); // p1
                          this.owner.setVertex(2,p2.x,min(p0.y-10,this.vertex.y)); // p2
                          break;
                          // p0 is above of p2
                          //
                       case draw2d.geo.Rectangle.DIRECTION_DOWN:
                          this.owner.setVertex(1,p1.x,max(p0.y+10,this.vertex.y)); // p1
                          this.owner.setVertex(2,p2.x,max(p0.y+10,this.vertex.y)); // p2
                          break;
                       }
                    }
                 }
                
                // LAST handle: Only the left hand side sibling can be changed
                //
                else if(this.index === (count-2)){
                   var p2 = vertices.get(this.index-1);  // neighbor of the dragged vertex
                   var p1 = vertices.get(this.index  );  // dragged vertex 
                   var p0 = vertices.get(this.index+1);  // last vertex of the connection 

                   // vertices with this alignment.
                   //
                   //      p2 +-----* p1                 + p0
                   //               |                    |
                   //               |                    |
                   //               + p0     p2 +--------* p1
                   if((p0.x === p1.x) && (p2.y === p1.y)){
                      switch(toDir){
                      // p0 is below of p1
                      case draw2d.geo.Rectangle.DIRECTION_UP:
                         this.owner.setVertex(count - 2,p1.x, min(p0.y-10,this.vertex.y)); // p1
                         this.owner.setVertex(count - 3,p2.x, min(p0.y-10,this.vertex.y)); // p2
                         break;
                      // p0 is above p2
                      case draw2d.geo.Rectangle.DIRECTION_DOWN:
                          this.owner.setVertex(count - 2,p1.x, max(p0.y+10,this.vertex.y)); // p1
                          this.owner.setVertex(count - 3,p2.x, max(p0.y+10,this.vertex.y)); // p2
                         break;
                      }
                   }
                   
                   // vertices with this alignment. 
                   //
                   //      p2 +              p0 +--------* p1
                   //         |                          |
                   //         |                          |
                   //      p1 *-----+ p0              p2 +
                   else{
                      switch(toDir){
                      case draw2d.geo.Rectangle.DIRECTION_RIGHT:
                         // p0 is on the left of p1
                         //
                          this.owner.setVertex(count -2,max(p0.x+10,this.vertex.x),p1.y); // p1
                          this.owner.setVertex(count -3,max(p0.x+10,this.vertex.x),p2.y); // p2
                         break;
                         // p0 is on the right of p2
                         //
                      case draw2d.geo.Rectangle.DIRECTION_LEFT:
                          this.owner.setVertex(count -2,min(p0.x-10,this.vertex.x),p1.y); // p1
                          this.owner.setVertex(count -3,min(p0.x-10,this.vertex.x),p2.y); // p2
                         break;
                      }
                   }
                }
                // The resize handle is in the middle of the connection.
                // -> In this case the connection MUST HAVE at least 5 vertices
                //
                else{
                   var p_m1= vertices.get(this.index-2);
                   var p0  = vertices.get(this.index-1);
                   var p1  = vertices.get(this.index);
                   var p2  = vertices.get(this.index+1);
                   var p3  = vertices.get(this.index+2);
                   
                   // vertices alignment to handle
                   //
                   //               .              .
                   //               .              .
                   //   p1 *------->+  p0      p0  +<---------* p1
                   //      |        .              .          |
                   //      |        .              .          |
                   //   p2 |                                  | p2
                   //   ...+...                         ......+.....
                   //
                   if((p1.x=== p2.x) && (p1.y === p0.y)){
                      // Exception handling if the dragged handle (p1) is near by the start of the connection
                      // p_m1 is the start of the connection 
                      // p0 must be the immediate neighbor of p_m1 
                      //
                      if(this.index-2 === 0) {
                         switch(fromDir){
                         case draw2d.geo.Rectangle.DIRECTION_RIGHT:
                             this.owner.setVertex(this.index-1,p0.x,max(this.vertex.y,p_m1.y-10));          // p0
                             this.owner.setVertex(this.index  ,this.vertex.x,max(this.vertex.y,p_m1.y-10)); // p1
                             this.owner.setVertex(this.index+1,this.vertex.x,p2.y);                         // p2
                            break;
                         case draw2d.geo.Rectangle.DIRECTION_LEFT:
                             this.owner.setVertex(this.index-1,p0.x,min(this.vertex.y,p_m1.y+10));          // p0
                             this.owner.setVertex(this.index  ,this.vertex.x,this.vertex.y); // p1
                             this.owner.setVertex(this.index+1,this.vertex.x,p2.y);                         // p2
                            break;
                         case draw2d.geo.Rectangle.DIRECTION_UP:
                             this.owner.setVertex(this.index-1,p0.x,min(this.vertex.y,p_m1.y-10));          // p0
                             this.owner.setVertex(this.index  ,this.vertex.x,min(this.vertex.y,p_m1.y-10)); // p1
                             this.owner.setVertex(this.index+1,this.vertex.x,p2.y);                         // p2
                            break;
                         case draw2d.geo.Rectangle.DIRECTION_DOWN:
                             this.owner.setVertex(this.index-1,p0.x,max(this.vertex.y,p_m1.y+10));          // p0
                             this.owner.setVertex(this.index  ,this.vertex.x,max(this.vertex.y,p_m1.y+10)); // p1
                             this.owner.setVertex(this.index+1,this.vertex.x, p2.y);                        // p2
                            break;
                         }
                      }
                      // Exception handling if the dragged handle (p1L) near by the end of the connection
                      // p3 is the end of the connection
                      //
                      else if((this.index-count+3) === 0) {
                         switch(toDir){
                         case draw2d.geo.Rectangle.DIRECTION_RIGHT:
                             this.owner.setVertex(this.index-1,p0.x,this.vertex.y);                       // p0
                             this.owner.setVertex(this.index  ,max(this.vertex.x,p3.x+10),this.vertex.y); // p1
                             this.owner.setVertex(this.index+1,max(this.vertex.x,p3.x+10),p2.y);          // p2
                            break;
                         case draw2d.geo.Rectangle.DIRECTION_LEFT:
                             this.owner.setVertex(this.index-1,p0.x,this.vertex.y);                       // p0
                             this.owner.setVertex(this.index  ,min(this.vertex.x,p3.x-10),this.vertex.y); // p1
                             this.owner.setVertex(this.index+1,min(this.vertex.x,p3.x-10),p2.y);          // p2
                            break;
                         }
                      }
                      else{
                          this.owner.setVertex(this.index-1,p0.x,this.vertex.y);                          // p0
                          this.owner.setVertex(this.index  ,this.vertex);                                 // p1
                          this.owner.setVertex(this.index+1,this.vertex.x,p2.y);                          // p2
                      }
                   }
                   // vertices alignment to handle
                   //
                   //  ...+...                            ...+...
                   //  p0 |                        .         | p0
                   //     |          .             .         |         
                   //     |          .             .         |        
                   //  p1 *----------+ p2      p2  +---------* p1 
                   //                .             .                    
                   //                .             .                    
                   else if((p0.x === p1.x) && (p1.y===p2.y)){
                      // p_m1 is the start of the analyzed segment
                       // p0 must be the immediate neighbor of p_m1 
                      //
                      if(this.index-2 === 0) {
                         switch(fromDir){
                         case draw2d.geo.Rectangle.DIRECTION_RIGHT:
                             this.owner.setVertex(this.index-1,max(this.vertex.x,p_m1.x+10),p0.y);          // p0
                             this.owner.setVertex(this.index  ,max(this.vertex.x,p_m1.x+10),this.vertex.y); // p1
                             this.owner.setVertex(this.index+1,p2.x,this.vertex.y);                         // p2
                            break;
                         case draw2d.geo.Rectangle.DIRECTION_LEFT:
                             this.owner.setVertex(this.index-1,min(this.vertex.x,p_m1.x-10),p0.y);          // p0
                             this.owner.setVertex(this.index  ,min(this.vertex.x,p_m1.x-10),this.vertex.y); // p1
                             this.owner.setVertex(this.index+1,p2.x,this.vertex.y);                         // p2
                            break;
                         }
                      }
                      // p3 ist der Endpunkt
                      //
                      else if((this.index-count+3) === 0) {
                         switch(toDir){
                         case draw2d.geo.Rectangle.DIRECTION_RIGHT:
                             this.owner.setVertex(this.index-1,p0.x,min(this.vertex.y,p3.y+10));            // p0
                             this.owner.setVertex(this.index  ,this.vertex.x,min(this.vertex.y,p3.y+10));   // p1
                             this.owner.setVertex(this.index+1,this.vertex.x,p2.y);                         // p2
                            break;
                         case draw2d.geo.Rectangle.DIRECTION_LEFT:
                             this.owner.setVertex(this.index-1,p0.x,max(this.vertex.y,p3.y-10));            // p0
                             this.owner.setVertex(this.index  ,this.vertex.x,max(this.vertex.y,p3.y-10));   // p1
                             this.owner.setVertex(this.index+1,this.vertex.x,p2.y);                         // p2
                            break;
                         }
                      }
                      else{
                          this.owner.setVertex(this.index-1,this.vertex.x,p0.y);                            // p0
                          this.owner.setVertex(this.index  ,this.vertex);                                   // p1
                          this.owner.setVertex(this.index+1,p2.x,this.vertex.y);                            // p2
                      }
                   }
                }

                this.relocate();

                // update the command for the undo/redo stuff
                //
                if(this.command!==null){
                    this.command.updateVertices(this.owner.getVertices().clone());                   
                }
                
                // note that the user has changed the routing manually.
                // This skips the automatic routing.
                this.owner._routingMetaData.routedByUserInteraction = true;             
                return true;
            },
            
            /**
             * @method Called after a drag and drop action.<br>
             *         Sub classes can override this method to implement additional stuff. Don't forget to call the super implementation via <code>this._super();</code>
             * @return {boolean}
             */
            onDragEnd : function()
            {
                var stack = this.getCanvas().getCommandStack();
                
                stack.execute(this.command);
                this.command = null;
                
                return true;
            },
            
            
            /**
             * @method
             * Controls the location of the resize handle 
             *
             * @template
             **/
            relocate:function(){

                var resizeWidthHalf = this.getWidth()/2;
                var resizeHeightHalf= this.getHeight()/2;

                var anchor = this.owner.getVertices().get(this.index);
                    
                this.setPosition(anchor.x-resizeWidthHalf,anchor.y-resizeHeightHalf);
            }
            
        });
    },
    

    /**
     * @method
     * 
     * @template
     * @param {draw2d.Connection} connection the selected figure
     * @param {boolean} isPrimarySelection
     */
    onSelect: function(canvas, connection, isPrimarySelection){
      this._super(canvas, connection, isPrimarySelection);
      
      var points = connection.getVertices();
      var i=1;
      for( ; i<(points.getSize()-1); i++){
        var handle = new this.ResizeHandle(connection, i);
            connection.selectionHandles.add( handle);         
            handle.setDraggable(connection.isResizeable());
            handle.show(canvas);
/*
        var handle = new draw2d.shape.basic.GhostVertexResizeHandle(connection, i-1);
            connection.selectionHandles.add( handle);         
            handle.setDraggable(connection.isResizeable());
            handle.show(canvas);
            */
        }
      /*
    var handle = new draw2d.shape.basic.GhostVertexResizeHandle(connection, i-1);
        connection.selectionHandles.add( handle);         
        handle.setDraggable(connection.isResizeable());
        handle.show(canvas);
        */
      
        this.moved(canvas, connection);
    },
    
    

    /**
     * @method
     * 
     */
    isSegmentDeleteable:function(conn, segmentIndex){

       var segmentCount = conn.getSegments().getSize();
       
       // Das erste und das letzte Segment kann nicht geloescht werden
       //
       if( (segmentIndex<=0) || (segmentIndex>= segmentCount-2))
          return false;

       // A Connection needs at least 3 segments
       //
       if((segmentCount<=4))
          return false;

       var fromPt  = conn.getStartPoint();
       var fromDir = conn.getSource().getConnectionDirection(conn, conn.getTarget());

       var toPt    = conn.getEndPoint();
       var toDir   = conn.getTarget().getConnectionDirection(conn, conn.getSource());

       // 
       // Falls die Leitungsfuehrung sich     ___
       // wie nebenan aufgezeigt aufbaut,    |   |        From
       // mussen mindestens 5 Segmente er-   | 1 |-----+
       // halten beleiben, damit ueberhaupt  |___|     |
       // eine Leitungsfuehrung m??glich ist.           |
       // Der Ausgang von Objekt 1 ist      +----------+
       // so zu dem Eingang von 2 versetzt, |
       // das man nicht mehr mit 3 Segment  |    ___
       // auskommt.                         |   |   |
       //                                   +---| 2 |      To
       //                                       |___|
       //
       if( (fromDir === 0) && ( toDir === 180) && (fromPt.x >= toPt.x) && (segmentCount < 6) )
          return false;


       // 
       // Falls die Leitungsfuehrung sich     ___
       // wie nebenan aufgezeigt aufbaut,    |   |        To
       // mussen mindestens 5 Segmente er-   | 2 |-----+
       // halten beleiben, damit ueberhaupt  |___|     |
       // eine Leitungsfuehrung m??glich ist.           |
       // Der Ausgang von Objekt 1 ist      +----------+
       // so zu dem Eingang von 2 versetzt, |
       // das man nicht mehr mit 3 Segment  |    ___
       // auskommt.                         |   |   |
       //                                   +---| 1 |     From
       //                                       |___|
       //
       if( (fromDir == 180) & ( toDir == 0) && (fromPt.x <= toPt.x) && (NumPoints() < 6) )
          return false;

       return true;
    },
    
    removeSegment: function(conn, segmentIndex){

       if(!this.isSegmentDeleteable(conn, segmentIndex))
          return;
       
       var vertexCount  = conn.getVertices().getSize();
             
       var fromPt  = conn.getStartPoint();
       var fromDir = conn.getSource().getConnectionDirection(conn, conn.getTarget());

       var toPt    = conn.getEndPoint();
       var toDir   = conn.getTarget().getConnectionDirection(conn, conn.getSource());

       var p0 = conn.getVertex(segmentIndex -1);
       var p1 = conn.getVertex(segmentIndex   );
       var p2 = conn.getVertex(segmentIndex +1);
       var p3 = conn.getVertex(segmentIndex +2);
       
       //                                             p0 .
       // Es wird ein Horizontales Segment               .
       // geloescht. Es muessen somit die Punkte         .
       // p0 und p3 neu gesetzt werden.               p1 +------*-----+ p2
       // Ihre neue X-Koordinate ist somit in der               ^     .
       // Mitte des geloeschten Segmentes                      newX   .
       //                                                             . p3
       //  
       if(p1.y == p2.y){
          var newX = (p1.x + p2.x) / 2;
          // Die neue X-Koordinate muss auf jeden Falls zwischen p-1 und p4 liegen
          //
          if(fromDir == 0 && segmentIndex == 2)
             newX = Math.max(newX ,fromPt.x);
          else if(fromDir == 180 && segmentIndex == 2)
             newX = Math.min(newX ,fromPt.x);
          
          if(toDir == 0 && segmentIndex == vertexCount-4)
             newX = max(newX ,toPt.x);
          else if(toDir == 180 && segmentIndex == vertexCount-4)
             newX = Math.min(newX ,toPt.x);

          conn.setVertex(segmentIndex -1, new draw2d.geo.Point(newX,p0.y));
          conn.setVertex(segmentIndex +2, new draw2d.geo.Point(newX,p3.y));
          
          conn.removeSegment(segmentIndex);
       }
       
       //                                                         p2       p3
       // Es wird ein vertikales Segment                        +..........+
       // geloescht. Es muessen somit die Punkte                |
       // p0 und p3 neu gesetzt werden.                         |             
       // Ihre neue Y-Koordinate ist somit in der               |     
       // Mitte des geloeschten Segmentes              p0       | p1     
       //                                              +........+     
       //   
       else if(p1.x == p2.x){
          // Das erste senkrechte Segment wird geloescht
          // p0 ist der Startpunkt und darf somit nicht verschoben werden
          //
          if(fromDir == 0 && segmentIndex == 1)
             SetPoint(segmentIndex +2, CPoint(p3.x,p1.y));
          else if(fromDir == 180 && segmentIndex == 1)
             SetPoint(segmentIndex +2, CPoint(p3.x,p1.y));
          // Das letzte Segment welche senkrecht ist, wird geloescht
          // p3 ist der Endpunkt und darf somit nicht verschoben werden
          //
          else if(toDir == 0 && segmentIndex == vertexCount-3)
             SetPoint(segmentIndex -1, CPoint(p0.x,p2.y));
          else if(toDir == 180 && segmentIndex == vertexCount-3)
             SetPoint(segmentIndex -1, CPoint(p0.x,p2.y));
          // Es ist ein Segment in der Mitte
          // p0 und p3 duerfen somit verschoben werden
          //
          else{ 
             SetPoint(segmentIndex -1, CPoint(p0.x,(p1.y+p2.y)/2));
             SetPoint(segmentIndex +2, CPoint(p3.x,(p1.y+p2.y)/2));
          }
          RemoveSegment(segmentIndex);
          return;
       }
    },
    

    splitSegment: function(conn, segmentIndex){
       var p1 = conn.getVertex(segmentIndex   );
       var p2 = conn.getVertex(segmentIndex +1);
       var length= 40;

       // Das einzufuegende Segment ist horizontal
       //       p2 +
       //          .
       // np1 +----+ np2
       //     .
       //     .
       //     + p1
       //
       if(p1.x == p2.x){
          var np1 = new util.geo.Point(p1.x-(length/2), (p1.y + p2.y ) /2);
          var np2 = new util.geo.Point(p2.x+(length/2), (p1.y + p2.y ) /2);

          conn.setVertex(segmentIndex  , new util.geo.Point(np1.x,p1.y));
          conn.setVertex(segmentIndex+1, new util.geo.Point(np2.x,p2.y));
          conn.insertVertexAt(segmentIndex+1, np1);
          conn.insertVertexAt(segmentIndex+2, np2);
       }
       // Das eizufuegende Segment ist senkrecht
       //     p1        np1
       //   +.........+
       //             |
       //             |
       //             | np2       p2
       //             +.........+
       //
       else if(p1.y == p2.y){
          var np1 = new draw2d.util.Point(0,0);
          var np2 = new draw2d.util.Point(0,0);

          // p1 ist der Startpunkt und darf somit nicht verschoben werden
          //
          if(m_lastHitSegment==0){
             np1.x = (p1.x + p2.x ) /2;
             np1.y = p1.y;
             np2.x = (p1.x + p2.x ) /2;
             np2.y = p2.y+length;
             conn.setVertex(segmentIndex+1, new draw2d.util.Point(p2.x,np2.y));
          }
          // p2 ist der Schlusspunkt und darf somit nicht veaendert werden
          //
          else if(m_lastHitSegment == NumPoints()-2){
             np1.x = (p1.x + p2.x ) /2;
             np1.y = p1.y-length;
             np2.x = (p1.x + p2.x ) /2;
             np2.y = p2.y;
             conn.setVertex(segmentIndex  , new draw2d.util.Point(p1.x,np1.y));
          }
          else {
             np1.x = (p1.x + p2.x ) /2;
             np1.y = p1.y - (length/2);
             np2.x = (p1.x + p2.x ) /2;
             np2.y = p2.y + (length/2);
             conn.setVertex(segmentIndex  , new draw2d.util.Point(p1.x,np1.y));
             conn.setVertex(segmentIndex+1, new draw2d.util.Point(p2.x,np2.y));
          }
          conn.insertVertexAt(segmentIndex+1, np1);
          conn.insertVertexAt(segmentIndex+2, np2);
       }

       // Die Leitungsfuehrung wurde mit Hand veraendert
       // -> Es darf spaeter kein vollstaendiges Autorouting mehr
       // gemacht werden.
       //
    //   m_routingHasChanged = true;
    }
    


});