/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.node.Node
 * 
 * A Node is the base class for all figures which can have {@link draw2d.Port}s. A {@link draw2d.Port} is the
 * anchor for a {@link draw2d.Connection} line.<br><br>A {@link draw2d.Port} is a green dot which can 
 * be dragged and dropped over another port.<br>
 * @inheritable
 * @author Andreas Herz
 * @extends draw2d.Figure 
 */
draw2d.shape.node.Node = draw2d.Figure.extend({
 
	NAME : "draw2d.shape.node.Node",

   /**
     * @constructor
     * Creates a new Node element which are not assigned to any canvas.
     * 
     * @param {Number} [width] initial width of the shape
     * @param {Number} [height] initial height of the shape
    */
    init: function( width, height ) {
    
      this.inputPorts = new draw2d.util.ArrayList();
      this.outputPorts= new draw2d.util.ArrayList();
      this.hybridPorts= new draw2d.util.ArrayList();
      
      // Flags just for performance reasons
      //
      this.portRelayoutRequired = true;
      
      // just for performance reasons
      //
      this.cachedPorts = null;
      
      this._super( width, height);
    },
    

    onDoubleClick:function(){
        var w = this.getWidth();
        var h = this.getHeight();
        // rotate in 90° increment steps..
        this.setRotationAngle((this.getRotationAngle()+90)%360);
        // ..and toggle the orientation of the shape (portrait / landscape)
        this.setDimension(h,w);
        
        this.portRelayoutRequired=true;
    },
    
    /**
     * @method
     * Moves the element so it is the closest to the viewer’s eyes, on top of other elements. Additional
     * the internal model changed as well.
     * 
     * @since 3.0.0
     */
    toFront: function(){
        this._super();
        
        this.getPorts().each(function(i,port){
            port.getConnections().each(function(i,connection){
                connection.toFront();
            });
            port.toFront();
        });
        
        return this;
    },
    
    /**
     * @method
     * Return all ports of the node.
     *
     * @return  {draw2d.util.ArrayList}
     **/
    getPorts: function()
    {
      // TODO: expensive! Find another solution.
      if(this.cachedPorts===null ){
          this.cachedPorts = new draw2d.util.ArrayList();
          this.cachedPorts.addAll(this.inputPorts);
          this.cachedPorts.addAll(this.outputPorts);
          this.cachedPorts.addAll(this.hybridPorts);
          
          this.children.each($.proxy(function(i,e){
              this.cachedPorts.addAll( e.figure.getPorts());
          },this));
      }
              
      return this.cachedPorts;
    },
    
    
    /**
     * @method
     * Return all input ports of the node.
     *
     * @return {draw2d.util.ArrayList}
     **/
    getInputPorts: function()
    {
      return this.inputPorts
               .clone()
               .addAll(this.hybridPorts);
    },
    
    /**
     * @method
     * Return all output ports of the node.
     *
     * @return {draw2d.util.ArrayList}
     **/
    getOutputPorts: function()
    {
      return this.outputPorts
          .clone()
          .addAll(this.hybridPorts);
    },
    
    /**
     * @method
     * Return the port with the corresponding name.
     *
     * 
     * @param {String} portName The name of the port to return.
     * @return {draw2d.Port} Returns the port with the hands over name or null.
     **/
    getPort: function( portName)
    {
    	var port = null;
    	
        this.getPorts().each(function(i,e){
            
            if (e.getName() === portName) {
                port = e;
         		return false;
            }
        });
        
        return port;
    },
    
    /**
     * @method
     * Return the input port with the corresponding name.
     *
     * 
     * @param {String/Number} portNameOrIndex The name or numeric index of the port to return.
     * @return {draw2d.InputPort} Returns the port with the hands over name or null.
     **/
    getInputPort: function( portNameOrIndex)
    {
        if(typeof portNameOrIndex === "number"){
            return this.inputPorts.get(portNameOrIndex);
        }
        
        for ( var i = 0; i < this.inputPorts.getSize(); i++) {
            var port = this.inputPorts.get(i);
            if (port.getName() === portNameOrIndex) {
                return port;
            }
        }
      
        return null;
    },
    
    /**
     * @method
     * Return the output port with the corresponding name.
     *
     * @param {String/Number} portNameOrIndex The name or the numeric index of the port to return.
     * @return {draw2d.OutputPort} Returns the port with the hands over name or null.
     **/
    getOutputPort: function( portNameOrIndex)
    {
        if(typeof portNameOrIndex === "number"){
            return this.outputPorts.get(portNameOrIndex);
        }
        
         for ( var i = 0; i < this.outputPorts.getSize(); i++) {
            var port = this.outputPorts.get(i);
            if (port.getName() === portNameOrIndex) {
                return port;
            }
        }

        return null;
    },
    
    /**
     * @method
     * Return the input port with the corresponding name.
     *
     * 
     * @param {String/Number} portNameOrIndex The name or numeric index of the port to return.
     * @return {draw2d.InputPort} Returns the port with the hands over name or null.
     **/
    getHybridPort: function( portNameOrIndex)
    {
        if(typeof portNameOrIndex === "number"){
            return this.hybridPorts.get(portNameOrIndex);
        }
        
        for ( var i = 0; i < this.hybridPorts.getSize(); i++) {
            var port = this.hybridPorts.get(i);
            if (port.getName() === portNameOrIndex) {
                return port;
            }
        }
      
        return null;
    },
    
    /**
     * @method
     * Add a port to this node at the given position.<br>
     *
     * @param {draw2d.Port} port The new port to add.
     * @param {draw2d.layout.locator.Locator} locator The layouter for the port.
     **/
    addPort: function(port, locator)
    {
        if(!(port instanceof draw2d.Port)){
            throw "Argument is not typeof 'draw2d.Port'. \nFunction: draw2d.shape.node.Node#addPort";
        }

        this.cachedPorts = null;
        this.portRelayoutRequired=true;
        
        
        if (port instanceof draw2d.InputPort) {
            this.inputPorts.add(port);
        }
        else if(port instanceof draw2d.OutputPort){
            this.outputPorts.add(port);
        }
        else if(port instanceof draw2d.HybridPort){
            this.hybridPorts.add(port);
        }

        if((typeof locator !== "undefined") && (locator instanceof draw2d.layout.locator.Locator)){
            port.setLocator(locator);
        }
        
        port.setParent(this);
        port.setCanvas(this.canvas);

        // You can't delete a port with the [DEL] key if a port is a child of a node
        port.setDeleteable(false);

        if (this.canvas !== null) {
            port.getShapeElement();
            this.canvas.registerPort(port);
        }
    },
    
    /**
     * @method
     * Removes a port and all related connections from this node.<br>
     *
     * @param {draw2d.Port} port The port to remove.
     **/
    removePort : function(port)
    {
        this.portRelayoutRequired=true;

        this.inputPorts.remove(port);
        this.outputPorts.remove(port);
        this.hybridPorts.remove(port);

        if (port.getCanvas() !== null) {
            port.getCanvas().unregisterPort(port);
            // remove the related connections of the port too.
            var connections = port.getConnections();
            for ( var i = 0; i < connections.getSize(); ++i) {
                port.getCanvas().removeFigure(connections.get(i));
            }
        }

        port.setCanvas(null);
    },
    
    /**
     * @method
     * Create a standard Port for this element. Inherited class can override this
     * method to create its own type of ports.
     * 
     * @param {String} type the type of the requested port. possible ["input", "output"]
     * @param {draw2d.layout.locator.Locator} [locator] the layouter to use for this port
     * @template
     */
    createPort: function(type, locator){
        var newPort = null;
        var count =0;
        
    	switch(type){
    	case "input":
    		newPort= new draw2d.InputPort();
    		count = this.inputPorts.getSize();
    		break;
    	case "output":
    		newPort= new draw2d.OutputPort();
            count = this.outputPorts.getSize();
    		break;
        case "hybrid":
            newPort= new draw2d.HybridPort();
            count = this.hybridPorts.getSize();
            break;
    	default:
            throw "Unknown type ["+type+"] of port requested";
    	}
    	
   	    newPort.setName(type+count);
    	
    	this.addPort(newPort, locator);
    	// relayout the ports
    	this.setDimension(this.width,this.height);
    	
        this.layoutPorts();

    	return newPort;
    },
    
    /**
     * @method
     * Return all connections related to this node.
     * 
     * @returns {draw2d.util.ArrayList}
     */
    getConnections: function(){
        var connections = new draw2d.util.ArrayList();
        var ports = this.getPorts();
        for(var i=0; i<ports.getSize(); i++)
        {
          var port = ports.get(i);
          // Do NOT add twice the same connection if it is linking ports from the same node
          for (var c = 0, c_size = port.getConnections().getSize() ; c< c_size ; c++)
          {
              if(!connections.contains(port.getConnections().get(c)))
              {
                connections.add(port.getConnections().get(c));
              }
          }
        }
        return connections;
    },

    /**
     * @private
     **/
    setCanvas : function(canvas)
    {

        var oldCanvas = this.canvas;
        this._super(canvas);
       
        var ports = this.getPorts();
        if (oldCanvas !== null) {
            ports.each(function(i,port){
                oldCanvas.unregisterPort(port);
            });
        }

        if (canvas !== null) {
            ports.each(function(i,port){
                port.setCanvas(canvas);
                canvas.registerPort(port);
            });
            // relayout the ports
            this.setDimension(this.width,this.height);
        }
        else {
            ports.each(function(i,port){
                port.setCanvas(null);
            });
        }
    },
    
    setRotationAngle: function(angle){
        this.portRelayoutRequired=true;
        this._super(angle);
        
        this.layoutPorts();
    },
    
    setDimension: function(w,h){
        this.portRelayoutRequired=true;
        this._super(w,h);
    },
    
    /**
     * @method
     * Called if the value of any port has been changed
     * 
     * @param {draw2d.Port} relatedPort
     * @template
     */
    onPortValueChanged: function(relatedPort){
    
    },
    
    /**
     * @method
     * propagate all attributes like color, stroke,... to the shape element
     * 
     **/
     repaint : function(attributes){
         if (this.repaintBlocked===true || this.shape === null){
             return;
         }
         this._super(attributes);
         this.layoutPorts();
     },
     
    /**
     * @method
     * 
     * @private
     */
     layoutPorts: function(){

         if(this.portRelayoutRequired===false){
             return;//silently
         }
         this.portRelayoutRequired=false;
         
         // layout the ports
         //
         this.outputPorts.each(function(i, port){
             port.locator.relocate(i,port);
         });
         
         this.inputPorts.each(function(i, port){
             port.locator.relocate(i,port);
         });
         
         this.hybridPorts.each(function(i, port){
             port.locator.relocate(i,port);
         });
     }
    
});



