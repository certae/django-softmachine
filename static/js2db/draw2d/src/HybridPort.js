/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.HybridPort
 * A HybridPort can work as Input and as Output port in the same way for a {@link draw2d.Connection}.
 * 
 * @author Andreas Herz
 * @extends draw2d.Port
 */ 
draw2d.HybridPort = draw2d.Port.extend({

    NAME : "draw2d.HybridPort",

    /**
     * @constructor
     * Create a new HybridPort element
     * 
     * @param {String} [name] the name for the Port.
     */
    init : function(name)
    {
        this._super(name);

        // responsive for the arrangement of the port 
        // calculates the x/y coordinates in relation to the parent node
        this.locator=new draw2d.layout.locator.InputPortLocator();
    },

    
    /**
     * @inheritdoc
     * 
     * @param {draw2d.Figure} figure The figure which is currently dragging
     * @return {draw2d.Figure} the figure which should receive the drop event or null if the element didnt want a drop event
     */
    onDragEnter : function (figure)
    {
    	// Accept any kind of port
        if (figure instanceof draw2d.Port) {
            return this._super(figure);
        }
        
        return null;
    },
    
    /**
     * @inheritdoc
     * 
     */
    onDragLeave : function (figure)
    {
	  // Ports accepts only Ports as DropTarget
	  //
	  if(!(figure instanceof draw2d.Port)){
		 return;
	  }

	  // accept any kind of port
      if(figure instanceof draw2d.Port){
        this._super( figure);
      }
      
    },

    /**
     * @inheritdoc
     *
     * @param {draw2d.command.CommandType} request describes the Command being requested
     * @return {draw2d.command.Command} null or a valid command
     **/
    createCommand:function(request)
    {
       // Connect request between two ports
       //
       if(request.getPolicy() === draw2d.command.CommandType.CONNECT) {
           
         if(request.source.getParent().getId() === request.target.getParent().getId()){
            return null;
         }    

         if (request.source instanceof draw2d.InputPort) {
            // This is the difference to the InputPort implementation of createCommand.
            return new draw2d.command.CommandConnect(request.canvas, request.target, request.source, request.source);
         }
         else if (request.source instanceof draw2d.OutputPort) {
            // This is the different to the OutputPort implementation of createCommand
            return new draw2d.command.CommandConnect(request.canvas, request.source, request.target, request.source);
         }
         else if (request.source instanceof draw2d.HybridPort) {
            // This is the different to the OutputPort implementation of createCommand
            return new draw2d.command.CommandConnect(request.canvas, request.target,request.source, request.source);
         }
         
         return null;
       }
    
       // ...else call the base class
       return this._super(request);
    }
});