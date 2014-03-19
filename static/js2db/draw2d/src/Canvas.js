/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.Canvas
 * Interactive paint area of the draw2d library.
 * <br>
 * <strong>Usage</strong>
 *      <script type="text/javascript">
 *      
 *      $(window).load(function () {
 *          
 *          var canvas = new draw2d.Canvas("gfx_holder");
 *      
 *          var figure1 = new draw2d.shape.basic.Oval();
 *          var figure2 = new draw2d.shape.basic.Rectangle();
 *          canvas.addFigure(figure1,100,100);
 *          canvas.addFigure(figure2,120,150);
 *      });
 *      </script>
 *      
 * @inheritable
 * @author Andreas Herz
 */
draw2d.Canvas = Class.extend(
{
    NAME : "draw2d.Canvas",

    /**
     * @constructor
     * Create a new canvas with the given HTML DOM references.
     * 
     * @param {String} canvasId the id of the DOM element to use a parent container
     */
    init : function(canvasId)
    {
        // Hook the canvas calculation for IE8
        //
        if (navigator.appName == 'Microsoft Internet Explorer')
        {
          var ua = navigator.userAgent;
          var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
          if (re.exec(ua) != null){
            rv = parseInt( RegExp.$1 );
            if(rv===8){
                this.fromDocumentToCanvasCoordinate = this._fromDocumentToCanvasCoordinate_IE8_HACK;
            }
          }
        }

        this.setScrollArea(document.body);
        this.canvasId = canvasId;
        this.html = $("#"+canvasId);
        this.html.css({"cursor":"default"});
        this.initialWidth = this.getWidth();
        this.initialHeight = this.getHeight();
        
        // avoid the "highlighting" in iPad, iPhone if the user tab/touch on the canvas.
        // .... I don't like this.
        this.html.css({"-webkit-tap-highlight-color": "rgba(0,0,0,0)"});
        
        // Drag&Drop Handling from foreign DIV into the Canvas
        // Only available in combination with jQuery-UI
        //
        // Create the droppable area for the css class "draw2d_droppable"
        // This can be done by a palette of toolbar or something else.
        // For more information see : http://jqueryui.com/demos/droppable/
        //
        if(typeof this.html.droppable !=="undefined"){
            this.html.droppable({
                accept: '.draw2d_droppable',
                over: $.proxy(function(event, ui) {
                    this.onDragEnter(ui.draggable);
                },this),
                out: $.proxy(function(event, ui) {
                    this.onDragLeave(ui.draggable);
                },this),
                drop:$.proxy(function(event, ui){
                    event = this._getEvent(event);
                    var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
                    this.onDrop(ui.draggable, pos.getX(), pos.getY());
                },this)
            });
        
            // Create the jQuery-Draggable for the palette -> canvas drag&drop interaction
            //
            $(".draw2d_droppable").draggable({
                appendTo:"body",
                stack:"body",
                zIndex: 27000,
                helper:"clone",
                drag: $.proxy(function(event, ui){
                    event = this._getEvent(event);
                    var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
                    this.onDrag(ui.draggable, pos.getX(), pos.getY());
                },this),
                stop: function(e, ui){
                    this.isInExternalDragOperation=false;
                },
                start: function(e, ui){
                    this.isInExternalDragOperation=true;
                    $(ui.helper).addClass("shadow");
                }
           });
        }

        // painting stuff
        //
        this.paper = Raphael(canvasId, this.getWidth(), this.getHeight());
        this.paper.canvas.style.position="absolute";
        
        // Status handling
        //
        this.zoomFactor = 1.0; // range [0.001..10]
        this.selection  = new draw2d.Selection();
        this.currentDropTarget = null;
        this.isInExternalDragOperation=false;
        this.currentHoverFigure = null;
        
        this.editPolicy = new draw2d.util.ArrayList();

        // internal document with all figures, ports, ....
        //
        this.figures     = new draw2d.util.ArrayList();
        this.lines       = new draw2d.util.ArrayList(); // crap - why are connections not just figures. Design by accident
        this.commonPorts = new draw2d.util.ArrayList();
        this.dropTargets = new draw2d.util.ArrayList();
        
        // all visible resize handles which can be drag&drop around. Selection handles like AntRectangleSelectionFeedback
        // are not part of this collection
        this.resizeHandles = new draw2d.util.ArrayList();
        
        // listener for selection handling
        // called if any selection events happens in the canvas
        //
        this.selectionListeners = new draw2d.util.ArrayList();

        // The CommandStack for undo/redo operations
        // 
        this.commandStack = new draw2d.command.CommandStack();
       
        // INTERSECTION/CROSSING handling for connections and lines
        //
        this.linesToRepaintAfterDragDrop =  new draw2d.util.ArrayList();
        this.lineIntersections = new draw2d.util.ArrayList();
       
        this.installEditPolicy( new draw2d.policy.canvas.BoundingboxSelectionPolicy());
//        this.installEditPolicy( new draw2d.policy.canvas.FadeoutDecorationPolicy());

        // Calculate all intersection between the different lines
        //
        this.commandStack.addEventListener($.proxy(function(event){
            if(event.isPostChangeEvent()===true){
                this.calculateConnectionIntersection();
                this.linesToRepaintAfterDragDrop.each(function(i,line){
                    line.svgPathString=null;
                    line.repaint();
                });
                this.linesToRepaintAfterDragDrop =  new draw2d.util.ArrayList();
            }
        },this));
        
        // DragDrop status handling
        //
        this.mouseDown  = false;
        this.mouseDownX = 0;
        this.mouseDownY = 0;
        this.mouseDragDiffX =0;
        this.mouseDragDiffY =0;

        this.html.bind("mouseup touchend", $.proxy(function(event)
        {
            if (this.mouseDown === false){
                return;
            }

            event = this._getEvent(event);

            this.calculateConnectionIntersection();

            this.mouseDown = false;
            var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
            this.editPolicy.each($.proxy(function(i,policy){
                policy.onMouseUp(this, pos.x, pos.y);
            },this));
            
            this.mouseDragDiffX = 0;
            this.mouseDragDiffY = 0;
        }, this));

        this.html.bind("mousemove touchmove", $.proxy(function(event)
        {
            event = this._getEvent(event);
            if (this.mouseDown === false){
               var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
               // mouseEnter/mouseLeave events for Figures. Don't use the Raphael or DOM native functions.
               // Raphael didn't work for Rectangle with transparent fill (events only fired for the border line)
               // DOM didn't work well for lines. No eclipse area - you must hit the line exact to retrieve the event.
               // In this case I implement my own stuff...again and again.
               //
               // don't break the main event loop if one element fires an error during enter/leave event.
               try{
	               var hover = this.getBestFigure(pos.x,pos.y);
	               if(hover !== this.currentHoverFigure && this.currentHoverFigure!==null){
	            	   this.currentHoverFigure.onMouseLeave();
	               }
	               if(hover !== this.currentHoverFigure && hover!==null){
	            	   hover.onMouseEnter();
	               }
	               this.currentHoverFigure = hover;
               }
               catch(exc){
            	   // just write it to the console
            	   console.log(exc);
               }

               this.editPolicy.each($.proxy(function(i,policy){
                   policy.onMouseMove(this,pos.x, pos.y);
               },this));
            }
            else{
               var diffXAbs = (event.clientX - this.mouseDownX)*this.zoomFactor;
               var diffYAbs = (event.clientY - this.mouseDownY)*this.zoomFactor;
               this.editPolicy.each($.proxy(function(i,policy){
                   policy.onMouseDrag(this,diffXAbs, diffYAbs, diffXAbs-this.mouseDragDiffX, diffYAbs-this.mouseDragDiffY);
               },this));
               this.mouseDragDiffX = diffXAbs;
               this.mouseDragDiffY = diffYAbs;
           }
        }, this));
        
        this.html.bind("mousedown touchstart", $.proxy(function(event)
        {
            var pos = null;
            switch (event.which) {
            case 1: //touch pressed
            case 0: //Left mouse button pressed
                event.preventDefault();
                event = this._getEvent(event);
                this.mouseDownX = event.clientX;
                this.mouseDownY = event.clientY;
                this.mouseDragDiffX = 0;
                this.mouseDragDiffY = 0;
                pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
                this.mouseDown = true;
                this.editPolicy.each($.proxy(function(i,policy){
                    policy.onMouseDown(this,pos.x,pos.y);
                },this));
                break;
            case 3: //Right mouse button pressed             
                event.preventDefault();
                event = this._getEvent(event);
                pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
                this.onRightMouseDown(pos.x, pos.y);
                break;
            case 2:
                //Middle mouse button pressed
                break;
             default:
                //You have a strange mouse
            }
        }, this));
        
        
        // Catch the dblclick and route them to the Canvas hook.
        //
        $(document).bind("dblclick",$.proxy(function(event)
        {
            event = this._getEvent(event);

            this.mouseDownX = event.clientX;
            this.mouseDownY = event.clientY;
            var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
            this.onDoubleClick(pos.x, pos.y);
        },this));

        
        // Catch the keyDown and CTRL-key and route them to the Canvas hook.
        //
        $(document).bind("click",$.proxy(function(event)
        {
            event = this._getEvent(event);

            // fire only the click event if we didn't move the mouse (drag&drop)
            //
            if(this.mouseDownX === event.clientX ||  this.mouseDownY === event.clientY){
                var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
                this.onClick(pos.x, pos.y);
            }
        },this));

        // Catch the keyDown and CTRL-key and route them to the Canvas hook.
        //
        $(document).bind("keydown",$.proxy(function(event)
        {
          // don't initiate the delete command if the event comes from an INPUT field. In this case the user want delete
          // a character in the input field and not the related shape
          if(!$(event.target).is("input")){
             var ctrl = event.ctrlKey;
             this.onKeyDown(event.keyCode, ctrl);
           }
        },this));

    },

    /**
     * @method
     * Calculate all connection intersection of the canvas.
     * Required for "bridging" or "crossing decoration"
     * 
     * @private
     */
    calculateConnectionIntersection: function(){

        this.lineIntersections = new draw2d.util.ArrayList();
        var lines = this.getLines().clone();
        while(lines.getSize()>0){
            var l1 = lines.removeElementAt(0);
            lines.each($.proxy(function(ii,l2){
                var partInter =l1.intersection(l2);
                if(partInter.getSize()>0){
                   this.lineIntersections.add({line:l1, other:l2, intersection:partInter});
                   this.lineIntersections.add({line:l2, other:l1, intersection:partInter});
                }
            },this));
        }
    },

    /**
     * @method
     * reset the canvas and delete all model elements.<br>
     * You can now reload another model to the canvas with a {@link draw2d.io.Reader}
     * 
     * @since 1.1.0
     */
    clear : function(){
        
        this.lines.clone().each($.proxy(function(i,e){
            this.removeFigure(e);
        },this));
        
         this.figures.clone().each($.proxy(function(i,e){
            this.removeFigure(e);
        },this));
        
        this.zoomFactor =1.0;
        this.selection.clear();
        this.currentDropTarget = null;
        this.isInExternalDragOperation=false;

        // internal document with all figures, ports, ....
        //
        this.figures = new draw2d.util.ArrayList();
        this.lines = new draw2d.util.ArrayList();
        this.commonPorts = new draw2d.util.ArrayList();
        this.dropTargets = new draw2d.util.ArrayList();
       
        this.commandStack.markSaveLocation();
        
        // INTERSECTION/CROSSING handling for connections and lines
        //
        this.linesToRepaintAfterDragDrop =  new draw2d.util.ArrayList();
        this.lineIntersections = new draw2d.util.ArrayList();
        
        // Inform all listener that the selection has been cleanup. Normally this will be done
        // by the edit policies of the canvas..but exceptional this is done in the clear method as well -
        // Design flaw.
        this.selectionListeners.each(function(i,w){
            w.onSelectionChanged(null);
        });
    },
    
    /**
     * @method
     * 
     * Install a new selection and edit policy into the canvas
     * 
     * @since 2.2.0
     * @param {draw2d.policy.EditPolicy} policy
     */
    installEditPolicy: function(policy){
        // a canvas can handle only one selection policy
        //
        if(policy instanceof draw2d.policy.canvas.SelectionPolicy){
            // reset old selection before install new selection strategy
            this.getSelection().getAll().each(function(i,figure){
                figure.unselect();
            });
            // remove existing selection policy
            this.editPolicy.grep($.proxy(function(p){
                var stay = !(p instanceof draw2d.policy.canvas.SelectionPolicy); 
                if(stay===false){
                    p.onUninstall(this);
                }
                return stay;
            },this));
        }
        // only one SnapToXYZ edit policy at once
        else if (policy instanceof draw2d.policy.canvas.SnapToEditPolicy){
            // remove existing snapTo policy
            this.editPolicy.grep($.proxy(function(p){
                var stay = !(p instanceof draw2d.policy.canvas.SnapToEditPolicy); 
                if(stay===false){
                    p.onUninstall(this);
                }
                return stay;
            },this));
        }
        
        policy.onInstall(this);
        this.editPolicy.add(policy);    
    },
    
    /**
     * @method
     * 
     * UnInstall the selection and edit policy from the canvas.
     * 
     * @since 2.2.0
     * @param {draw2d.policy.EditPolicy} policy
     */
    uninstallEditPolicy: function(policy){
        if(!(policy instanceof draw2d.policy.EditPolicy)){
            return; // silently
        }
        
        this.editPolicy.grep($.proxy(function(p){
            if(p === policy){
                p.onUninstall(this);
                return false;
            }
            return true;
        },this));
    },
    
    /**
     * @method
     * Set the new zoom factor for the canvas. The value must be between [0.01..10]
     * 
     * @param {Number} zoomFactor new zoom factor.
     * @param {boolean} [animated] set it to true for smooth zoom in/out
     */
    setZoom : function(zoomFactor, animated)
    {
        var _zoom = $.proxy(function(z){
            this.zoomFactor = Math.min(Math.max(0.01,z),10);
            
            var viewBoxWidth  = (this.initialWidth*this.zoomFactor)|0;
            var viewBoxHeight = (this.initialHeight*this.zoomFactor)|0;
            
            this.paper.setViewBox(0, 0, viewBoxWidth, viewBoxHeight);
            
            // BUG: raphael didn't handle setViewBox AND setSize correct
//            var paintArea =this.html.children(":first");
//            this.paper.setSize(this.html.width(), this.html.height());
            
            // didn't work too....   :-(
//            paintArea.width(this.initialWidth * this.zoomFactor);
//            paintArea.height(this.initialHeight * this.zoomFactor);
        },this);
        
       if(animated){
           var myTweenable = new Tweenable();
           myTweenable.tween({
             from:     { 'x': this.zoomFactor  },
             to:       { 'x': zoomFactor },
             duration: 300,
             easing : "easeOutSine",
             step: function (params) {
               _zoom(params.x);
             }
           });
       }
       else{
           _zoom(zoomFactor);
       }
    },

    /**
     * @method
     * Return the current zoom factor of the canvas.
     * 
     * @returns {Number}
     */
    getZoom: function(){
        return this.zoomFactor;
    },
    
    /**
     * @method
     * Transforms a document coordinate to canvas coordinate.
     * 
     * @param {Number} x the x coordinate relative to the window 
     * @param {Number} y the y coordinate relative to the window
     * 
     * @returns {draw2d.geo.Point} The coordinate in relation to the canvas [0,0] position
     */
    fromDocumentToCanvasCoordinate : function(x, y) {
        return new draw2d.geo.Point(
                (x - this.getAbsoluteX() + this.getScrollLeft())*this.zoomFactor,
                (y - this.getAbsoluteY() + this.getScrollTop())*this.zoomFactor);
    },
  
    _fromDocumentToCanvasCoordinate_IE8_HACK : function(x, y) {
   //     alert("dd");
            return new draw2d.geo.Point(
                    (x - this.getAbsoluteX())*this.zoomFactor,
                    (y - this.getAbsoluteY())*this.zoomFactor);
    },

    /**
     * @method
     * Transforms a canvas coordinate to document coordinate.
     * 
     * @param {Number} x the x coordinate in the canvas 
     * @param {Number} y the y coordinate in the canvas
     * 
     * @returns {draw2d.geo.Point} the coordinate in relation to the document [0,0] position
     */
    fromCanvasToDocumentCoordinate : function(x,y) {
        return new draw2d.geo.Point(
                (x + this.getAbsoluteX() - this.getScrollLeft())*this.zoomFactor,
                (y + this.getAbsoluteY() - this.getScrollTop())*this.zoomFactor);
    },
    
    /**
     * @method
     * The DOM host of the canvas
     * 
     * @returns {HTMLElement}
     */
    getHtmlContainer: function(){
       return this.html; 
    },
    
    
    /**
     * @method
     * Return a common event object independed if we run on an iPad or desktop.
     * 
     * @param event
     * @return
     * @private
     */
    _getEvent:function(event){
      // check for iPad, Android touch events
      //
      if(typeof event.originalEvent !== "undefined"){  
          if(event.originalEvent.touches && event.originalEvent.touches.length) {
               return event.originalEvent.touches[0];
          } else if(event.originalEvent.changedTouches && event.originalEvent.changedTouches.length) {
               return event.originalEvent.changedTouches[0];
          }
      }
      return event;
    },

    /**
     * @method
     * 
     * Set the area which are scrolling the canvas. This can be a jquery selector or 
     * a jQuery node.
     * 
     * @param {String/HTMLElement} elementSelector
     **/
    setScrollArea:function(elementSelector)
    {
       this.scrollArea= $(elementSelector);
    },

    /**
     * @method
     * 
     * return the scrolling area of the canvas. This is jQuery object
     * 
     * @return {HTMLElement} 
     **/
    getScrollArea:function()
    {
       return this.scrollArea;
    },

    /**
     * @method
     * The left scroll position.
     * 
     * @return {Number} the left scroll offset of the canvas
     **/
    getScrollLeft:function()
    {
      return this.scrollArea.scrollLeft();
    },

    /**
     * @method
     * The top scroll position
     * 
     * @return {Number} the top scroll offset of the cnavas.
     **/
    getScrollTop:function()
    {
      return this.scrollArea.scrollTop();
    },

    /**
     * @method
     * The absolute document x offset.
     *
     * @return {Number}
     **/
    getAbsoluteX:function()
    {
        return this.html.offset().left;
    },

    /**
     * @method
     * The absolute document y offset.
     * 
     * @return {Number} 
     **/
    getAbsoluteY:function()
    {
      return this.html.offset().top;
    },


    /**
     * @method
     * Return the width of the canvas
     * 
     * @return {Number}
     **/
    getWidth : function(){
        return this.html.width();
    },


    /**
     * @method
     * Return the height of the canvas.
     * 
     * @return {Number}
     **/
    getHeight:function() {
      return this.html.height();
    },
 

    /**
     * @method
     * Add a figure at the given x/y coordinate.
     *
     * @param {draw2d.Figure} figure The figure to add.
     * @param {Number} [x] The x position.
     * @param {Number} [y] The y position.
     **/
    addFigure:function( figure , x,  y)
    {
        if(figure.getCanvas()===this){
            return;
        }
        
      figure.setCanvas(this);

      // important inital 
      figure.getShapeElement();


      if(figure instanceof draw2d.shape.basic.Line){
        this.lines.add(figure);
        this.linesToRepaintAfterDragDrop = this.lines;
      }
      else{
        this.figures.add(figure);

        if(typeof y !== "undefined"){
            figure.setPosition(x,y);
        }
      }
      
      // init a repaint of the figure. This enforce that all properties
      // ( color, dim, stroke,...) will be set.
      figure.repaint();
      figure.fireMoveEvent();
    },

    /**
     * @method
     * Remove a figure from the Canvas.
     *
     * @param {draw2d.Figure} figure The figure to remove
     **/
    removeFigure:function(figure){
        // remove the figure froma selection handler as well and cleanup the 
        // selection feedback 
        this.editPolicy.each($.proxy(function(i,policy){
            if(typeof policy.unselect==="function"){
                policy.unselect(this,figure);
            }
        },this));
        

        if(figure instanceof draw2d.shape.basic.Line){
           this.lines.remove(figure);
         }
        else {
           this.figures.remove(figure);
        }
        figure.setCanvas(null);

        if(figure instanceof draw2d.Connection){
           figure.disconnect();
        }

    },
    
    /**
     * @method
     * Returns all lines/connections in this workflow/canvas.<br>
     *
     * @protected
     * @return {draw2d.util.ArrayList}
     **/
    getLines:function()
    {
      return this.lines;
    },

    /**
     * @method
     * Returns the internal figures container.<br>
     *
     * @protected
     * @return {draw2d.util.ArrayList}
     **/
    getFigures:function()
    {
      return this.figures;
    },

    /**
     * @method
     * Returns the line with the given id.
     *
     * @param {String} id The id of the line.
     * 
     * @type draw2d.shape.basic.Line
     **/
    getLine:function( id)
    {
      var count = this.lines.getSize();
      for(var i=0; i<count;i++)
      {
         var line = this.lines.get(i);
         if(line.getId()===id){
            return line;
         }
      }
      return null;
    },

    /**
     * @method
     * Returns the figure with the given id. 
     *
     * @param {String} id The id of the figure.
     * @return {draw2d.Figure}
     **/
    getFigure:function(/*:String*/ id)
    {
      var figure = null;
      this.figures.each(function(i,e){
          if(e.id===id){
              figure=e;
              return false;
           }
      });
      return figure;
    },

    /**
     * @method
     * Return all intersections draw2d.geo.Point between the given line and all other
     * lines in the canvas.
     * 
     * @param {draw2d.shape.basic.Line} line the line for the intersection test
     * @return {draw2d.util.ArrayList} 
     */
    getIntersection:function(line){
       var result = new draw2d.util.ArrayList();
       
       this.lineIntersections.each($.proxy(function(i, entry){
           if(entry.line ===line){
               entry.intersection.each(function(i,p){
                   result.add({x:p.x, y:p.y, justTouching:p.justTouching, other:entry.other});
               });
           }
       },this));
       
       return result;
    },
    



    /** 
     * @method
     *  Adjust the coordinate with the installed SnapToHelper.
     *
     * @param  {draw2d.Figure} figure The related figure
     * @param  {draw2d.geo.Point} pos The position to adjust
     * 
     * @return {draw2d.geo.Point} the adjusted position
     * @private
     **/
    snapToHelper:function(figure,  pos)
    {
        this.editPolicy.each($.proxy(function(i,policy){
            pos = policy.snap(this, figure, pos);
        },this));

        return pos;
    },


    /**
     * @method
     * Register a port to the canvas. This is required for other ports to find a valid drop target.
     * 
     * @param {draw2d.Port} port The new port which has been added to the Canvas.
     **/
    registerPort:function(port )
    {
      // All elements have the same drop targets.
      //
      port.targets= this.dropTargets;
      
      this.commonPorts.add(port);
      this.dropTargets.add(port);
    },

    /**
     * @method
     * Remove a port from the internal cnavas registration. Now other ports can't find the
     * port anymore as drop target. The port itself is still visible.
     * 
     * @param {draw2d.Port} p The port to unregister as potential drop target
     * @private
     **/
    unregisterPort:function(port )
    {
      port.targets=null;

      this.commonPorts.remove(port);
      this.dropTargets.remove(port);
    },

    /**
     * @method
     * Return all ports in the canvas
     * 
     */
    getAllPorts: function(){
        return this.commonPorts;
    },
    
    /**
     * @method
     * Returns the command stack for the Canvas. Required for undo/redo support.
     *
     * @return {draw2d.command.CommandStack}
     **/
    getCommandStack:function()
    {
      return this.commandStack;
    },

    /**
     * @method
     * Returns the current selected figure in the Canvas.
     *
     * @return {draw2d.Figure}
     * @deprecated
     **/
    getCurrentSelection:function()
    {
      return this.selection.getPrimary();
    },
    
    /**
     * @method
     * Returns the current selection.
     *
     * @return {draw2d.Selection}
     **/
    getSelection:function()
    {
      return this.selection;
    },

    /**
     * @method
     * Set the current selected figure in the workflow Canvas.
     *
     * @param {draw2d.Figure} figure The new selection.
     * @deprecated
     **/
    setCurrentSelection:function( figure )
    {
        this.selection.each($.proxy(function(i,e){
            this.editPolicy.each($.proxy(function(i,policy){
                if(typeof policy.select==="function"){
                    policy.unselect(this,e);
                }
            },this));
        },this));
 
        this.editPolicy.each($.proxy(function(i,policy){
            if(typeof policy.select==="function"){
                policy.select(this,figure);
            }
        },this));
        
    },

    /**
     * @method
     * Register a listener to the Canvas. The listener must provide a function "onSelectionChanged".
     * 
     * @param {Object/Function} w an object which implements the 'onSelectionChanged' method or a callback function
     **/
    addSelectionListener:function(w)
    {
      if(w!==null)
      {
        if(typeof w ==="function"){
          this.selectionListeners.add({onSelectionChanged: w});
        } 
        else if(typeof w.onSelectionChanged==="function"){
          this.selectionListeners.add(w);
        }
        else{
          throw "Object doesn't implement required callback method [onSelectionChanged]";
        }
      }
    },

    /**
     * @method
     * unregister the listener from the canvas.
     * 
     * @param {Object/Function} w The object which will be removed from the selection eventing
     **/
    removeSelectionListener:function(/*:Object*/ w )
    {
      this.selectionListeners = this.selectionListeners.grep(function(listener){
          return listener !== w && listener.onSelectionChanged!==w;
      });
    },


    /**
     * @method
     * Returns the best figure at the location [x,y]. It is a simple hit test. Keep in mind that only visible objects 
     * are returned.
     *
     * @param {Number} x The x position.
     * @param {Number} y The y position.
     * @param {draw2d.Figure} [figureToIgnore] The figure which should be ignored.
     **/
    getBestFigure : function(x, y, figureToIgnore)
    {
        var result = null;
        var testFigure = null;
        var i=0;
        var children = null;
        
        // ResizeHandles first
        for ( i = 0, len = this.resizeHandles.getSize(); i < len; i++)
        {
            testFigure = this.resizeHandles.get(i);
            if (testFigure.isVisible()===true && testFigure.hitTest(x, y) === true && testFigure !== figureToIgnore) 
            { 
                return testFigure; 
            }
        }

        // Checking ports
        for ( i = 0, len = this.commonPorts.getSize(); i < len; i++) 
        {
            testFigure = this.commonPorts.get(i);
            if(testFigure !== figureToIgnore)
            {
                if (testFigure.isVisible()===true && testFigure.hitTest(x, y) === true) 
                { 
                    return testFigure; 
                }
            }
        }

        // 2.) A line is the next option in the priority queue for a "Best" figure
        //
        result = this.getBestLine(x,y,figureToIgnore);
        if(result !==null){
            return result;
        }
        
        // 3.) Check now the common objects
        //     run from back to front to aware the z-oder of the figures
        for ( i = (this.figures.getSize()-1); i >=0; i--)
        {
            var figure = this.figures.get(i);
            // check first a children of the figure
            //
            var checkRecursive = function(children){
                children.each(function(i,e){
                    checkRecursive(e.getChildren());
                    if(result===null&&e.isVisible()===true && e.hitTest(x,y)===true){
                        result = e;
                    }
                    return result===null; // break the each-loop if we found an element
                });
            };
            checkRecursive( figure.getChildren());
            
            // ...and the figure itself
            //
            if (result ===null && figure.isVisible()===true && figure.hitTest(x, y) === true && figure !== figureToIgnore)
            {
                if (result === null){
                    result = figure;
                }
                else if(result.getZOrder()< figure.getZOrder())  {
                    result = figure;
                }
            }

            if(result !==null){
                return result;
            }
        }
        
        // 4.) Check the children of the lines as well
        //     Not selectable/draggable. But should receive onClick/onDoubleClick events 
        //      as well.
        var count = this.lines.getSize();
        for(i=0;i< count;i++)
        {
          var line = this.lines.get(i);
          children= line.getChildren();
          children.each(function(i,e){
              if(e.isVisible()===true && e.hitTest(x,y)===true){
                  result = e;
                  return false;
              }
              return true;
          });
        }
        
       return result;
    },


    /**
     * @method
     * Return the line which match the hands over coordinate
     *
     * @param {Number} x the x-coordinate for the hit test
     * @param {Number} y the x-coordinate for the hit test
     * @param {draw2d.shape.basic.Line} [lineToIgnore] a possible line which should be ignored for the hit test
     *
     * @private
     * @return {draw2d.shape.basic.Line}
     **/
    getBestLine:function( x,  y,  lineToIgnore)
    {
      var result = null;
      var count = this.lines.getSize();

      for(var i=0;i< count;i++)
      {
        var line = this.lines.get(i);
        if(line.isVisible()===true && line.hitTest(x,y)===true && line!==lineToIgnore)
        {
            if(result===null){
               result = line;
               break;
            }
        }
      }
      return result;
    }, 


    /**
     * @private
     **/
    hideSnapToHelperLines:function()
    {
      this.hideSnapToHelperLineHorizontal();
      this.hideSnapToHelperLineVertical();
    },

    /**
     * @private
     **/
    hideSnapToHelperLineHorizontal:function()
    {
    },

    /**
     * @private
     **/
    hideSnapToHelperLineVertical:function()
    {

    },


    /**
     * @method
     * Called by the framework during drag&drop operations.<br>
     * Droppable can be setup with:
     * <pre>
     *     $(".draw2d_droppable").draggable({
     *          appendTo:"#container",
     *          stack:"#container",
     *          zIndex: 27000,
     *          helper:"clone",
     *          start: function(e, ui){$(ui.helper).addClass("shadow");}
     *     });
     * </pre>
     * Graphiti use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     * 
     * @param {HTMLElement} draggedDomNode The DOM element which is currently dragging
     * 
    * @template
     **/
    onDragEnter : function( draggedDomNode )
    {
    },
 
    
    /**
     * @method
     * Called if the DragDrop object is moving around.<br>
     * <br>
     * Graphiti use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     * 
     * @param {HTMLElement} draggedDomNode The dragged DOM element.
     * @param {Number} x the x coordinate of the drag
     * @param {Number} y the y coordinate of the drag
     * 
     * @template
     **/
    onDrag:function(draggedDomNode, x, y )
    {
    },

        
    /**
     * @method
     * Called if the DragDrop object leaving the current hover figure.<br>
     * <br>
     * Graphiti use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     * 
     * @param {HTMLElement} draggedDomNode The figure which is currently dragging
     * 
     * @template
     **/
    onDragLeave:function( draggedDomNode )
    {
    },

    
    /**
     * @method
     * Called if the user drop the droppedDomNode onto the canvas.<br>
     * <br>
     * Graphiti use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     * 
     * @param {HTMLElement} droppedDomNode The dropped DOM element.
     * @param {Number} x the x coordinate of the drop
     * @param {Number} y the y coordinate of the drop
     * 
     * @template
     **/
    onDrop:function(droppedDomNode, x, y)
    {
    },
    
    /**
     * @method
     * Callback if the user press a key
     * 
     * @param {Number} keyCode the pressed key
     * @param {Boolean} ctrl true if the CTRL key is pressed as well
     * @private
     **/
    onKeyDown:function(keyCode, ctrl)
    {
      // Figure loescht sich selbst, da dies den KeyDown Event empfangen
      // kann. Bei einer Linie geht dies leider nicht, und muss hier abgehandelt werden.
      //
      if(keyCode==46 && this.selection.getPrimary()!==null){
         this.commandStack.execute(this.selection.getPrimary().createCommand(new draw2d.command.CommandType(draw2d.command.CommandType.DELETE)));
      }
      else if(keyCode==90 && ctrl){
         this.commandStack.undo();
      }
      else if(keyCode==89 && ctrl){
         this.commandStack.redo();
      }
      else if(keyCode ===107){
          this.setZoom(this.zoomFactor*0.95);
      }
      else if(keyCode ===109){
          this.setZoom(this.zoomFactor*1.05);
      }
    },

    /**
     * @private
     **/
    onDoubleClick : function(/* :int */x, /* :int */y)
    {
        // check if a line has been hit
        //
        var figure = this.getBestFigure(x, y);

        if(figure!==null){
            figure.onDoubleClick();
        }
    },

    /**
     * @private
     **/
    onClick : function(/* :int */x, /* :int */y)
    {
        // check if a line has been hit
        //
        var figure = this.getBestFigure(x, y);

        if(figure!==null){
            figure.onClick();
            
            // forward the event to all install policies ass well
            // (since 3.0.0)
            this.editPolicy.each($.proxy(function(i,policy){
                if(typeof policy.onClick==="function"){
                    policy.onClick(figure, x,y);
                }
            },this));
        }

    },

    /**
     * @method
     * The user has triggered a right click. Redirect them to a responsible figure
     * 
     * @param {Number} x The x-coordinate of the click
     * @param {Number} y The y-coordinate of the click
     * 
     * @private
     * @since 1.1.0
     **/
    onRightMouseDown : function(x, y)
    {
       var figure = this.getBestFigure(x, y);
        if(figure!==null){
            figure.onContextMenu(x,y);
        }
    }
});