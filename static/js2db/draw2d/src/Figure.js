/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.Figure
 * A lightweight graphical object. Figures are rendered to a {@link draw2d.Canvas} object.
 * 
 * @inheritable
 * @author Andreas Herz
 */
draw2d.Figure = Class.extend({
    
	NAME : "draw2d.Figure",
    
	MIN_TIMER_INTERVAL: 50, // minimum timer interval in milliseconds
	
    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     * 
     * @param {Number} [width] initial width of the shape
     * @param {Number} [height] initial height of the shape
     */
    init: function( width, height ) {
        this.id = draw2d.util.UUID.create();
        
        // required in the SelectionEditPolicy to indicate the type of figure
        // which the user clicks
        this.isResizeHandle=false;
        
        // for undo/redo operation. It holds the command during a drag/drop operation
        // and execute it on the CommandStack if the user drop the figure.
        this.command = null;
        
        this.canvas = null;
        this.shape  = null;
        
        // possible decorations ( e.g. a Label) of the Connection
        // children are fixed bounded the figure. Most of the events of the child will bee
        // routed to the parent
        this.children = new draw2d.util.ArrayList();
            
        // behavior flags
        //
        this.selectable = true;
        this.deleteable = true;
        this.resizeable = true;
        this.draggable = true;
        this.visible = true;
        
        this.canSnapToHelper = true;
        this.snapToGridAnchor = new draw2d.geo.Point(0,0);    // hot spot for snap to grid  
        this.editPolicy = new draw2d.util.ArrayList();
        
        // timer for animation or automatic update
        //
        this.timerId = -1;
        this.timerInterval = 0;
        
        // possible parent of the figure. 
        // @see: this.children
        this.parent = null;
        
        // generic handle for the JSON read/write of user defined data
        this.userData = null;
       
        // appearance, position and dim properties
        //
        this.x = 0;
        this.y = 0;
        this.minHeight = 5;
        this.minWidth = 5;
        this.rotationAngle = 0;
        // add the name of the class to the css attribute
        this.cssClass = this.NAME.replace(new RegExp("[.]","g"), "_");
       
        if(typeof height !== "undefined"){
            this.width  = width;
            this.height = height;
        }
        else{
           this.width  = this.getMinWidth();
           this.height = this.getMinHeight();
        }
        this.alpha = 1.0;
        
        // internal status flags for the Drag&Drop operation handling and other stuff
        // 
        this.isInDragDrop =false;
        this.originalAlpha = this.alpha;
        this.ox = 0;
        this.oy = 0;
        this.repaintBlocked=false;
        this.selectionHandles = new draw2d.util.ArrayList();
        
        // listener for movement/resize. required for Ports or property panes in the UI
        //
        this.moveListener = new draw2d.util.ArrayList();
        this.resizeListener = new draw2d.util.ArrayList();

        
        this.installEditPolicy(new draw2d.policy.figure.RectangleSelectionFeedbackPolicy());
    },
    
    /**
     * @method
     * Add the figure to the current selection and propagate this to all edit policies.
     * 
     * @param {boolean} [isPrimarySelection] true if the element should be the primary selection
     * @final
     * @private
     */
    select: function(asPrimarySelection){
        if(typeof asPrimarySelection==="undefined"){
            asPrimarySelection=true;
        }
     
        // apply all EditPolicy for select Operations
        //
        this.editPolicy.each($.proxy(function(i,e){
              if(e instanceof draw2d.policy.figure.SelectionFeedbackPolicy){
                  e.onSelect(this.canvas, this,asPrimarySelection);
              }
        },this));

        return this;
    },
    
    /**
     * @method
     * Unselect the figure and propagete this event to all edit policies.
     * 
     * @final
     * @private
     **/
    unselect:function()
    {
        // apply all EditPolicy for select Operations
        //
        this.editPolicy.each($.proxy(function(i,e){
              if(e instanceof draw2d.policy.figure.SelectionFeedbackPolicy){
                  e.onUnselect(this.canvas, this);
              }
        },this));

        return this;
    },
    
    /**
     * @method
     * Allows a user to attach (or remove) data to an element, without needing to create a custom figure or shape.
     * The data must be a valid JSON object.
     * 
     * @since 2.7.2
     * @param {Object} object
     */
    setUserData: function(object){
      this.userData = object;  
    },

    /**
     * @method
     * Returns any user data set previously on the given figure by setUserData.
     * 
     * @since 2.7.2
     * @returns {Object}
     */
    getUserData: function(){
        return this.userData;
    },
    
    /**
     * @method
     * Return the UUID of this element. 
     * 
     * @return {String}
     */
    getId: function()
    {
       return this.id; 
    },
    
    /**
     * @method
     * Set the id of this element. 
     * 
     * @param {String} id the new id for this figure
     */
    setId: function(id)
    {
        this.id = id; 

        return this;
    },
    

    /**
     * @method
     * Return the css styling class name of the element.
     * 
     * @return {String}
     */
    getCssClass: function()
    {
       return this.cssClass; 
    },
    
    /**
     * @method
     * Set the css class if the node.
     * 
     * @param {String} cssClass the new css class name of the node
     * @since 2.9.0
     */
    setCssClass: function(cssClass)
    {
        this.cssClass = cssClass===null?null:$.trim(cssClass);
        
        if(this.shape===null){
            return this;
        }
        
        if(this.cssClass===null){
            this.shape.node.removeAttribute("class");
        }
        else{
            this.shape.node.setAttribute("class", this.cssClass);
        }
                
        return this;
    },
    
    /**
     * @method
     * The method will return true if the class is assigned to the element, even if other classes also are.
     * 
     * @param {String} className the class name to check
     * @since 2.9.0
     */
    hasCssClass: function(className) {
        if(this.cssClass===null){
            return false;
        }
        
        return new RegExp(' ' + $.trim(className) + ' ').test(' ' + this.cssClass + ' ');
    },

    /**
     * @method
     * 
     * It's important to note that this method does not replace a class. It simply adds the class, 
     * appending it to any which may already be assigned to the elements.
     * 
     * @param {String} className
     * @since 2.9.0
     */
    addCssClass: function( className) {
        className = $.trim(className);
        if (!this.hasCssClass( className)) {
            if(this.cssClass===null){
                this.setCssClass(className);
            }
            else{
                this.setCssClass(this.cssClass + ' ' + className);
            }
        }
        
        return this;
    },

    /**
     * @method
     * 
     * Remove the given css class name from the figure
     * 
     * @param {String} className the css class name to add
     */
    removeCssClass:function(className) {
        className = $.trim(className);
        var newClass = ' ' + this.cssClass.replace( /[\t\r\n]/g, ' ') + ' ';
        if (this.hasCssClass(className)) {
            while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
                newClass = newClass.replace(' ' + className + ' ', ' ');
            }
            this.setCssClass( newClass.replace(/^\s+|\s+$/g, ''));
        }
        
        return this;
    },
    
    /**
     * @method
     * 
     * Add or remove the given css class name from the figure
     * 
     * @param {String} className the class name to toggle
     */
    toggleCssClass:function( className) {
        className = $.trim(className);
        var newClass = ' ' + this.cssClass.replace( /[\t\r\n]/g, ' ' ) + ' ';
        if (this.hasCssClass( className)) {
            while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
                newClass = newClass.replace( ' ' + className + ' ' , ' ' );
            }
            this.setCssClass( newClass.replace(/^\s+|\s+$/g, ''));
        } else {
            this.setCssClass(this.cssClass + ' ' + className);
        }
        
        return this;
    },

    /**
     * @method
     * Set the canvas element of this figures.
     * 
     * @param {draw2d.Canvas} canvas the new parent of the figure or null
     */
    setCanvas: function( canvas )
    {
      // remove the shape if we reset the canvas and the element
      // was already drawn
      if(canvas===null && this.shape!==null)
      {
         this.unselect();
         this.shape.remove();
         this.shape=null;
      }
    
      this.canvas = canvas;
      
      if(this.canvas!==null){
          this.getShapeElement();
      }

      if(canvas === null){
    	  this.stopTimer();
      }
      else{
    	  if(this.timerInterval>= this.MIN_TIMER_INTERVAL){
              this.startTimer(this.timerInterval);
    	  }
      }
      
      this.children.each(function(i,e){
          e.figure.setCanvas(canvas);
      });
      
      return this;
      
     },
     
     /**
      * @method
      * Return the current assigned canvas container.
      * 
      * @return {draw2d.Canvas}
      */
     getCanvas:function()
     {
         return this.canvas;
     },
     
    
     /**
      * @method
      * Start a timer which calles the onTimer method in the given interval.
      * 
      * @param {Number} milliSeconds
      */
     startTimer: function(milliSeconds)
     {
    	 this.stopTimer();
    	 this.timerInterval = Math.max(this.MIN_TIMER_INTERVAL, milliSeconds);
    	 
    	 if(this.canvas!==null){
    		 this.timerId = window.setInterval($.proxy(this.onTimer,this), this.timerInterval);
    	 }

    	 return this;
     },

     /**
      * @method
      * Stop the internal timer.
      * 
      */
     stopTimer: function()
     {
    	if(this.timerId>=0){
  		  window.clearInterval(this.timerId);
		  this.timerId=-1;
    	} 
    	
    	return this;
     },

     /**
      * @method
      * Callback method for the internal timer handling<br>
      * Inherit classes must override this method if they want use the timer feature.
      * 
      * @template
      */
     onTimer: function()
     {
    	
     },
     
     /**
      * @method
      * Moves the element so it is the closest to the viewer’s eyes, on top of other elements. Additional
      * the internal model changed as well.
      * 
      * @since 3.0.0
      */
     toFront: function(){
         this.getShapeElement().toFront();
         if(this.canvas!==null){
             var figures = this.canvas.getFigures();
             var lines = this.canvas.getLines();
             if(figures.remove(this)!==null){
                 figures.add(this);
             }else if(lines.remove(this)!==null){
                 lines.add(this);
             }
         }
         
         // bring all children figures in front of the parent
         //
         this.children.each(function(i,child){
             child.figure.toFront();
         });

         return this;
     },
     
     
     /**
      * Install a new edit policy to the figure. Each editpolicy is able to focus on a single editing 
      * task or group of related tasks. This also allows editing behavior to be selectively reused across 
      * different figure implementations. Also, behavior can change dynamically, such as when the layouts 
      * or routing methods change.
      * Example for limited DragDrop behavior can be a draw2d.layout.constraint.RegionConstriantPolicy.
      * 
      * @aside example buildin_selection_feedback
      * @param {draw2d.policy.EditPolicy} policy
      */
     installEditPolicy: function(policy)
     {
         // it is only possible to install one SelectionFeedbackPolicy at once
         //
         if(policy instanceof draw2d.policy.figure.SelectionFeedbackPolicy){
             this.editPolicy.grep($.proxy(function(p){
                 var stay = !(p instanceof draw2d.policy.figure.SelectionFeedbackPolicy); 
                 if(!stay){
                     p.onUninstall(this);
                 }
                 return stay;
             },this));
         }
         policy.onInstall(this);
         this.editPolicy.add(policy);
         
         return this;
     },
     
     /**
      * @method
      * Add a child figure to the figure. The hands over figure doesn't support drag&drop 
      * operations. It's only a decorator for the connection.<br>
      * Mainly for labels or other fancy decorations :-)
      *
      * @param {draw2d.Figure} figure the figure to add as decoration to the connection.
      * @param {draw2d.layout.locator.Locator} locator the locator for the child. 
     **/
     addFigure : function(child, locator)
     {
         // the child is now a slave of the parent
         //
         child.setDraggable(false);
         child.setSelectable(false);
         child.setParent(this);
         
         this.children.add({figure:child, locator:locator});
         
         if(this.canvas!==null){
             child.setCanvas(this.canvas);
         }
         
         this.repaint();

         return this;
     },

     /**
      * @method
      * Return all children/decorations of this shape
      */
     getChildren : function(){
         var shapes = new draw2d.util.ArrayList();
         this.children.each(function(i,e){
             shapes.add(e.figure);
         });
         
         return shapes;
     },
     
     
     /**
      * @method
      * Remove all children/decorations of this shape
      * 
      */
     resetChildren : function(){
         this.children.each(function(i,e){
             e.figure.setCanvas(null);
         });
         this.children= new draw2d.util.ArrayList();
         this.repaint();
         
         return this;
     },
     

     /**
     * @method
     * return the current SVG shape element or create it on demand.
     * 
     * @final
     */
    getShapeElement:function()
    {
       if(this.shape!==null){
         return this.shape;
       }

      this.shape=this.createShapeElement();
      
      // add CSS class to enable styling of the element with CSS rules/files
      //
      if(this.cssClass!==null){
          this.shape.node.setAttribute("class",this.cssClass);
      }
      
      return this.shape;
    },


    /**
     * @method
     * Inherited classes must override this method to implement it's own draw functionality.
     * 
     * @template
     * @abstract
     */
    createShapeElement : function()
    {
        throw "Inherited class ["+this.NAME+"] must override the abstract method createShapeElement";
    },


    /**
     * @method
     * propagate all attributes like color, stroke,... to the shape element
     * 
     **/
     repaint : function(attributes)
     {
// PERFORMANCE         
//         if (this.repaintBlocked===true || this.shape === null){
//             return;
//         }

         if(this.visible===true){
        	 this.shape.show();
         }
         else{
        	 this.shape.hide();
        	 return;
         }
         
         
         // enrich with common properties
         attributes.opacity = this.alpha;

         this.shape.attr(attributes);

         this.applyTransformation();

         /* moved to setDimension.
          * Locator is only called if the dimension of the figure has been changed
          * Performance
          */
        // Relocate all children of the figure.
        // This means that the Locater can calculate the new Position of the child.
        //
        this.children.each(function(i,e){
            e.locator.relocate(i, e.figure);
        });
        
     },
     
     /**
      * @private
      */
     applyTransformation:function(){
     },
     
     /**
      * @method
      * Highlight the element or remove the highlighting
      * 
      * @param {Boolean} flag indicates glow/noGlow
      * @template
      */
     setGlow: function(flag){
    	 // do nothing in the base class. 
    	 // Subclasses must implement this method.

         return this;
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
    onDragStart : function(relativeX, relativeY )
    {
      this.isInDragDrop =false;

      this.command = this.createCommand(new draw2d.command.CommandType(draw2d.command.CommandType.MOVE));

      if(this.command!==null){
         this.ox = this.x;
         this.oy = this.y;
         this.isInDragDrop =true;
         
         // notify all installed policies
         //
         this.editPolicy.each($.proxy(function(i,e){
             if(e instanceof draw2d.policy.figure.DragDropEditPolicy){
                 e.onDragStart(this.canvas, this);
             }
         },this));

         return true;
      }
      
      return false;
    },

    /**
     * @method
     * Don't call them manually. This will be done by the framework.<br>
     * Will be called if the object are moved via drag and drop.
     * Sub classes can override this method to implement additional stuff. Don't forget to call
     * the super implementation via <code>this._super(dx, dy, dx2, dy2);</code>
     * 
     * @private
     * @param {Number} dx the x difference between the start of the drag drop operation and now
     * @param {Number} dy the y difference between the start of the drag drop operation and now
     * @param {Number} dx2 The x diff since the last call of this dragging operation
     * @param {Number} dy2 The y diff since the last call of this dragging operation
     **/
    onDrag : function( dx,  dy, dx2, dy2)
    {
      // apply all EditPolicy for DragDrop Operations
      //
      this.editPolicy.each($.proxy(function(i,e){
            if(e instanceof draw2d.policy.figure.DragDropEditPolicy){
                var newPos = e.adjustPosition(this,this.ox+dx,this.oy+dy);
                dx = newPos.x-this.ox;
                dy = newPos.y-this.oy;
            }
      },this));
        
      this.x = this.ox+dx;
      this.y = this.oy+dy;

      // Adjust the new location if the object can snap to a helper
      // like grid, geometry, ruler,...
      //
      if(this.getCanSnapToHelper())
      {
        var p = new draw2d.geo.Point(this.x,this.y);
        p = this.getCanvas().snapToHelper(this, p);
        this.x = p.x;
        this.y = p.y;
      }

      this.setPosition(this.x, this.y);
      
      // notify all installed policies
      //
      this.editPolicy.each($.proxy(function(i,e){
          if(e instanceof draw2d.policy.figure.DragDropEditPolicy){
              e.onDrag(this.canvas, this);
          }
      },this));
    },

    /**
     * @method
     * Called by the framework if the figure returns false for the drag operation. In this
     * case we send a "panning" event - mouseDown + mouseMove. This is very useful for
     * UI-Widget like slider, spinner,...
     * 
     * @param {Number} dx the x difference between the mouse down operation and now
     * @param {Number} dy the y difference between the mouse down operation and now
     * @param {Number} dx2 The x diff since the last call of this dragging operation
     * @param {Number} dy2 The y diff since the last call of this dragging operation
     * @template
     */
    onPanning: function(dx, dy, dx2, dy2){
        
    },
    
    
    /**
     * @method
     * Will be called after a drag and drop action.<br>
     * Sub classes can override this method to implement additional stuff. Don't forget to call
     * the super implementation via <code>this._super();</code>
     * 
     * @template
     **/
    onDragEnd : function()
    {
      this.setAlpha(this.originalAlpha);
  
      // Element ist zwar schon an seine Position, das Command muss aber trotzdem
      // in dem CommandStack gelegt werden damit das Undo funktioniert.
      //
      this.command.setPosition(this.x, this.y);
      this.isInDragDrop = false;

      this.canvas.getCommandStack().execute(this.command);
      this.command = null;
     
      // notify all installed policies
      //
      this.editPolicy.each($.proxy(function(i,e){
          if(e instanceof draw2d.policy.figure.DragDropEditPolicy){
              e.onDragEnd(this.canvas, this);
          }
      },this));

      this.fireMoveEvent();
    },

    /**
     * @method
     * Called by the framework during drag&drop operations.
     * 
     * @param {draw2d.Figure} draggedFigure The figure which is currently dragging
     * 
     * @return {draw2d.Figure} the figure which should receive the drop event or null if the element didn't want a drop event
     * @template
     **/
    onDragEnter : function( draggedFigure )
    {
    	return null;
    },
 
    /**
     * @method
     * Called if the DragDrop object leaving the current hover figure.
     * 
     * @param {draw2d.Figure} figure The figure which is currently dragging
     * @template
     **/
    onDragLeave:function( draggedFigure )
    {
    },

    
    /**
     * @method
     * Called if the user drop this element onto the dropTarget
     * 
     * @param {draw2d.Figure} dropTarget The drop target.
     * @private
     **/
    onDrop:function(dropTarget)
    {
    },
   

    /**
     * @method
     * Callback method for the mouse enter event. Usefull for mouse hover-effects.
     * Override this method for your own effects. Don't call them manually.
     *
     * @template
     **/
    onMouseEnter:function()
    {
    },
    
    
    /**
     * @method
     * Callback method for the mouse leave event. Usefull for mouse hover-effects.
     * 
     * @template
     **/
    onMouseLeave:function()
    {
    },

    /**
     * @method
     * Called when a user dbl clicks on the element
     * 
     * @template
     * @aside example interaction_dblclick
     */
    onDoubleClick: function(){
    },
    
    
    /**
     * @method
     * Called when a user clicks on the element.
     * 
     * @template
     * @aside example interaction_click
     */
    onClick: function(){
    },
   
    /**
     * @method
     * called by the framework if the figure should show the contextmenu.<br>
     * The strategy to show the context menu depends on the plattform. Either loooong press or
     * right click with the mouse.
     * 
     * @param {Number} x the x-coordinate to show the menu
     * @param {Number} y the y-coordinate to show the menu
     * @since 1.1.0
     * @template
     */
    onContextMenu:function(x,y){

    },

    /**
     * @method
     * Set the alpha blending of this figure. 
     *
     * @param {Number} percent Value between [0..1].
     * @template
     **/
    setAlpha:function( percent)
    {
      percent = Math.min(1,Math.max(0,parseFloat(percent)));
      if(percent===this.alpha){
         return;
      }

      this.alpha =percent;
      this.repaint();

      return this;
    },

        
    /**
     * @method 
     * Return the alpha blending of the figure
     * 
     * @return {Number} the current alpha blending
     */
    getAlpha : function()
    {
        return this.alpha;
    },
    
    
    /**
     * @method
     * set the rotation angle in degree [0..356]<br>
     * <br>
     * <b>NOTE: this method is pre alpha and not for production.</b>
     * <br>
     * @param {Number} angle the rotation angle in degree
     */
    setRotationAngle: function(angle){
        this.rotationAngle = angle;
        

        // Update the resize handles if the user change the position of the element via an API call.
        //
        this.editPolicy.each($.proxy(function(i,e){
            if(e instanceof draw2d.policy.figure.DragDropEditPolicy){
                e.moved(this.canvas, this);
            }
        },this));

        this.repaint();

        return this;
    },
    
    getRotationAngle : function(){
        return this.rotationAngle;
    },
    
    /**
     * @method
     * Show/hide the element. The element didn't receive any mouse events (click, dblclick) if you hide the
     * figure.
     * 
     * @param {Boolean} flag
     * @since 1.1.0
     */
    setVisible: function(flag){
    	this.visible = !!flag;
    	
    	this.repaint();

    	return this;
    },
    
    /**
     * @method
     * Return true if the figure visible.
     * 
     * @return {Boolean}
     * @since 1.1.0
     */
    isVisible: function(){
        return this.visible && this.shape!==null;
    },
    
    /**
     * @method
     * Return the current z-index of the element. Currently this is an expensive method. The index will be calculated
     * all the time. Caching is not implemented at the moment.
     * 
     * @return {Number}
     */
    getZOrder: function(){
        if(this.shape===null){
            return -1;
        }
        
        var i = 0;
        var child = this.shape.node;
        while( (child = child.previousSibling) !== null ) {
          i++;
        }
        return i;
    },
    
    /**
     * @method
     * Set the flag if this object can snap to grid or geometry.
     * A window of dialog should set this flag to false.
     * 
     * @param {Boolean} flag The snap to grid/geometry enable flag.
     *
     **/
    setCanSnapToHelper:function(flag)
    {
      this.canSnapToHelper = !!flag;

      return this;
    },

    /**
     * @method
     * Returns true if the figure can snap to any helper like a grid, guide, geometrie
     * or something else.
     *
     * @return {boolean}
     **/
    getCanSnapToHelper:function()
    {
      return this.canSnapToHelper;
    },

    /**
     *
     * @return {draw2d.geo.Point}
     **/
    getSnapToGridAnchor:function()
    {
      return this.snapToGridAnchor;
    },

    /**
     * @method
     * Set the hot spot for all snapTo### operations.
     * 
     * @param {draw2d.geo.Point} point
     **/
    setSnapToGridAnchor:function(point)
    {
      this.snapToGridAnchor = point;
    },

    /**
     * @method
     * The current width of the figure.
     * 
     * @type {Number}
     **/
    getWidth:function()
    {
      return this.width;
    },

    /**
     * @method 
     * The current height of the figure.
     * 
     * @type {Number}
     **/
    getHeight:function()
    {
      return this.height;
    },


    /**
     * @method
     * This value is relevant for the interactive resize of the figure.
     *
     * @return {Number} Returns the min. width of this object.
     */
    getMinWidth:function()
    {
      return this.minWidth;
    },

    /**
     * @method
     * Set the minimum width of this figure
     * 
     * @param {Number} w
     */
    setMinWidth: function(w){
      this.minWidth = parseFloat(w);

      return this;
    },
    
    /**
     * @method
     * This value is relevant for the interactive resize of the figure.
     *
     * @return {Number} Returns the min. height of this object.
     */
    getMinHeight:function()
    {
      return this.minHeight;

      return this;
    },

    /**
     * @method
     * Set the minimum heigth of the figure.
     * 
     * @param {Number} h
     */
    setMinHeight:function(h){
        this.minHeight =parseFloat(h);

        return this;
    },
    
    /**
     * @method
     * The x-offset related to the parent figure or canvas.
     * 
     * @return {Number} the x-offset to the parent figure
     **/
    getX :function()
    {
        return this.x;
    },

    /**
     * @method
     * The y-offset related to the parent figure or canvas.
     * 
     * @return {Number} The y-offset to the parent figure.
     **/
    getY :function()
    {
        return this.y;
    },

    
    /**
     * @method
     * The x-offset related to the canvas.
     * 
     * @return {Number} the x-offset to the parent figure
     **/
    getAbsoluteX :function()
    {
        if(this.parent===null){
            // provide some good defaults if the figure not placed
            return this.x||0;
        }
        return this.x + this.parent.getAbsoluteX();  
    },


    /**
     * @method
     * The y-offset related to the canvas.
     * 
     * @return {Number} The y-offset to the parent figure.
     **/
    getAbsoluteY :function()
    {
        if(this.parent ===null){
            // provide some good defaults of the figure not placed
            return this.y||0;
        }
        return this.y + this.parent.getAbsoluteY();  
    },


    /**
     * @method
     * Returns the absolute y-position of the port.
     *
     * @type {draw2d.geo.Point}
     **/
    getAbsolutePosition:function()
    {
      return new draw2d.geo.Point(this.getAbsoluteX(), this.getAbsoluteY());
    },
    
    /**
     * @method
     * Returns the absolute y-position of the port.
     *
     * @return {draw2d.geo.Rectangle}
     **/
    getAbsoluteBounds:function()
    {
      return new draw2d.geo.Rectangle(this.getAbsoluteX(), this.getAbsoluteY(),this.getWidth(),this.getHeight());
    },
    

    /**
     * @method
     * Set the position of the object.
     *
     * @param {Number/draw2d.geo.Point} x The new x coordinate of the figure
     * @param {Number} [y] The new y coordinate of the figure 
     **/
    setPosition : function(x, y) {
        if (x instanceof draw2d.geo.Point) {
            this.x = x.x;
            this.y = x.y;
        }
        else {
            this.x = x;
            this.y = y;
        }
        
       this.repaint();
        
        // Update the resize handles if the user change the position of the
        // element via an API call.
        //
        this.editPolicy.each($.proxy(function(i, e) {
            if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
                e.moved(this.canvas, this);
            }
        }, this));

        this.fireMoveEvent();

        return this;
    },
    
    /**
     * @method
     * Get the current position of the figure 
     * 
     * @return {draw2d.geo.Point}
     * @since 2.0.0
     */
    getPosition: function(){
        return new draw2d.geo.Point(this.x, this.y);
    },
    
    /**
     * @method
     * Translate the figure with the given x/y offset.
     *
     * @param {Number} dx The new x translate offset
     * @param {Number} dy The new y translate offset
     **/
    translate:function(dx , dy )
    {
    	this.setPosition(this.x+dx,this.y+dy);
    	
    	return this;
    },
    
    
    /**
     * @method
     * Set the new width and height of the figure. 
     *
     * @param {Number} w The new width of the figure
     * @param {Number} h The new height of the figure
     **/
    setDimension:function(w, h)
    {
        w = Math.max(this.getMinWidth(),w);
        h = Math.max(this.getMinHeight(),h);

        if(this.width === w && this.height ===h){
            return;
        }

    	// apply all EditPolicy for DragDrop Operations
        //
        this.editPolicy.each($.proxy(function(i,e){
              if(e instanceof draw2d.policy.figure.DragDropEditPolicy){
                  var newDim = e.adjustDimension(this,w,h);
                  w = newDim.w;
                  h = newDim.h;
              }
        },this));

		this.width = Math.max(this.getMinWidth(),w);
		this.height= Math.max(this.getMinHeight(),h);
		  
		this.repaint();

        this.fireResizeEvent();
        // just to be backward compatible....cost a lot of performance...still
		this.fireMoveEvent();
		
		// Update the resize handles if the user change the position of the element via an API call.
		//
		this.editPolicy.each($.proxy(function(i,e){
		   if(e instanceof draw2d.policy.figure.DragDropEditPolicy){
		       e.moved(this.canvas, this);
		   }
		},this));

		return this;
    },


    /**
     * @method
     * Return the bounding box of the figure in absolute position to the canvas.
     * 
     * @return {draw2d.geo.Rectangle}
     **/
    getBoundingBox:function()
    {
      return new draw2d.geo.Rectangle(this.getAbsoluteX(),this.getAbsoluteY(),this.getWidth(),this.getHeight());
    },

    /**
     * @method
     * Detect whenever the hands over coordinate is inside the figure.
     * The default implementation is a simple bounding box test. 
     * 
     * @param {Number} iX
     * @param {Number} iY
     * @param {Number} [corona]
     * 
     * @returns {Boolean}
     */
    hitTest : function ( iX , iY, corona)
    {
        if(typeof corona === "number"){
            return this.getBoundingBox().scale(corona,corona).hitTest(iX,iY);
        }
        return this.getBoundingBox().hitTest(iX,iY);
    },


    /**
     * @method
     * Switch on/off the drag drop behaviour of this object
     *
     * @param {Boolean} flag The new drag drop indicator
     **/
    setDraggable:function(flag)
    {
      this.draggable= !!flag;

      return this;
    },

    /**
     * @method
     * Get the Drag drop enable flag
     *
     * @return {boolean} The new drag drop indicator
     **/
    isDraggable:function()
    {
      return this.draggable;
    },


    /**
     * @method
     * Returns the true if the figure can be resized.
     *
     * @return {boolean}
     **/
    isResizeable:function()
    {
      return this.resizeable;
    },

    /**
     * @method
     * You can change the resizeable behaviour of this object. Hands over [false] and
     * the figure has no resizehandles if you select them with the mouse.<br>
     *
     * @param {boolean} flag The resizeable flag.
     **/
    setResizeable:function(flag)
    {
      this.resizeable=!!flag;

      return this;
    },

    /**
     * @method
     * Indicates whenever the element is selectable by user interaction or API.
     * 
     * @return {boolean}
     **/
    isSelectable:function()
    {
      return this.selectable;
    },


    /**
     * @method
     * You can change the selectable behavior of this object. Hands over [false] and
     * the figure has no selection handles if you try to select them with the mouse.<br>
     *
     * @param {boolean} flag The selectable flag.
     **/
    setSelectable:function(flag)
    {
      this.selectable=!!flag;

      return this;
    },

    /**
     * @method
     * Return true if the object doesn't care about the aspect ratio.
     * You can change the height and width independent.
     * 
     * @return {boolean}
     */
    isStrechable:function()
    {
      return true;
    },

    /**
     * @method
     * Return false if you avoid that the user can delete your figure.
     * Sub class can override this method.
     * 
     * @return {boolean}
     **/
    isDeleteable:function()
    {
      return this.deleteable;
    },

    /**
     * @method
     * Return false if you avoid that the user can delete your figure.
     * 
     * @param {boolean} flag Enable or disable flag for the delete operation
     **/
    setDeleteable:function(flag)
    {
      this.deleteable = !!flag;

      return this;
    },

    /**
     * @method
     * Set the parent of this figure.
     * Don't call them manually.

     * @param {draw2d.Figure} parent The new parent of this figure
     * @private
     **/
    setParent:function( parent)
    {
      this.parent = parent;

      return this;
    },

    /**
     * @method
     * Get the parent of this figure.
     *
     * @return {draw2d.Figure}
     **/
    getParent:function()
    {
      return this.parent;
    },

    /**
     * @method
     * Register the hands over object as a moveListener of this figure.<br>
     * All position changes will be broadcast to all move listener. This is
     * useful for Connectors and Layouter for router handling.
     *
     * @param {Object} listener the listener to call
     * @since 2.5.1
     **/
     attachResizeListener:function(listener) {
        if (listener === null) {
            return;
        }

        this.resizeListener.add(listener);

        return this;
     },
 

    /**
     * @method
     * Remove the hands over figure from notification queue.
     *
     * @param {draw2d.Figure} figure The figure to remove the monitor
     * @since 2.5.1
     **/
    detachResizeListener:function(figure) 
    {
      if(figure===null){
        return;
      }

      this.resizeListener.remove(figure);

      return this;
    },
    
    /**
     * @method
     * Called from the figure itself when any position changes happens. All listener
     * will be informed.
     * 
     * @private
     * @since 2.5.1
     **/
    fireResizeEvent: function()
    {
         this.resizeListener.each($.proxy(function(i, item){
            item.onOtherFigureIsResizing(this);
        },this));

        return this;
    },
    
    /**
     * @method
     * Fired if a figure is moving.
     *
     * @param {draw2d.Figure} figure The figure which has changed its position
     * @template
     * @since 2.5.1
     */
    onOtherFigureIsResizing:function(figure){
    },
    
    /**
     * @method
     * Register the hands over object as a moveListener of this figure.<br>
     * All position changes will be broadcast to all move listener. This is
     * useful for Connectors and Layouter for router handling.
     *
     * @param {Object} listener the listener to call
     *
     **/
     attachMoveListener:function(listener) {
		if (listener === null) {
			return;
		}

		if(!this.moveListener.contains(listener)){
	        this.moveListener.add(listener);
		}

		return this;
 	 },
 

    /**
     * @method
     * Remove the hands over figure from notification queue.
     *
     * @param {draw2d.Figure} figure The figure to remove the monitor
     *
     **/
    detachMoveListener:function(figure) 
    {
      if(figure===null){
        return;
      }

      this.moveListener.remove(figure);

      return this;
    },

    /**
     * @method
     * Called from the figure itself when any position changes happens. All listener
     * will be informed.
     * 
     * @private
     **/
    fireMoveEvent: function()
    {
        // first call. Reured for connections to update the routing,...
        //
        this.moveListener.each($.proxy(function(i, item){
            item.onOtherFigureIsMoving(this);
        },this));
        
        return this;
   },
    
    /**
     * @method
     * Fired if a figure is moving.
     *
     * @param {draw2d.Figure} figure The figure which has changed its position
     * @template
     */
    onOtherFigureIsMoving:function(figure){
    },
    
    /**
     * @method
     * Returns the Command to perform the specified Request or null.
      *
     * @param {draw2d.command.CommandType} request describes the Command being requested
     * @return {draw2d.command.Command} null or a Command
     **/
    createCommand:function( request)
    {
      if(request===null){
          return null;
      }
      
      if(request.getPolicy() === draw2d.command.CommandType.MOVE)
      {
        if(!this.isDraggable()){
          return null;
        }
        return new draw2d.command.CommandMove(this);
      }

      if(request.getPolicy() === draw2d.command.CommandType.DELETE)
      {
        if(!this.isDeleteable()){
           return null;
        }
        return new draw2d.command.CommandDelete(this);
      }
      
      if(request.getPolicy() === draw2d.command.CommandType.RESIZE)
      {
        if(!this.isResizeable()){
           return null;
        }
        return new draw2d.command.CommandResize(this);
      }
      
      return null;
    },
    
    
    /**
     * @method 
     * Return an objects with all important attributes for XML or JSON serialization
     * 
     *
     */
    getPersistentAttributes : function()
    {
        var memento= {
            type  : this.NAME,
            id    : this.id,
            x     : this.x,
            y     : this.y,
            width : this.width,
            height: this.height,
            userData: this.userData
        };

        
        if(this.cssClass!==null){
            memento.cssClass= this.cssClass;
        }
        
        return memento;
    },
    
    /**
     * @method 
     * Read all attributes from the serialized properties and transfer them into the shape.
     * 
     * @param {Object} memento
     * @return
     */
    setPersistentAttributes : function(memento)
    {
        this.id    = memento.id;
        this.x     = parseFloat(memento.x);
        this.y     = parseFloat(memento.y);
        
        // width and height are optional parameter for the JSON stuff.
        // We use the defaults if the attributes not present
        if(typeof memento.width !== "undefined"){
            this.width = parseFloat(memento.width);
        }
        
        if(typeof memento.height !== "undefined"){
            this.height= parseFloat(memento.height);
        }
        
        if(typeof memento.userData !== "undefined"){
            this.userData= memento.userData;
        }

        if(typeof memento.cssClass !== "undefined"){
            this.setCssClass(memento.cssClass);
        }
        
        return this;
    }  

});


