/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.OutputPort
 * A OutputPort is the start anchor for a {@link draw2d.Connection}.
 * 
 * @author Andreas Herz
 * @extends draw2d.Port
 */ 
draw2d.OutputPort = draw2d.Port.extend({

    NAME : "draw2d.OutputPort",

    /**
     * @constructor
     * Create a new OutputPort element
     * 
     * @param {String} [name] the name for the Port. 
     */
    init : function(name)
    {
        this._super(name);
       
        // responsive for the arrangement of the port 
        // calculates the x/y coordinates in relation to the parent node
        this.locator=new draw2d.layout.locator.OutputPortLocator();
    },

    
    /**
     * @inheritdoc
     * 
     * @param {draw2d.Figure} figure The figure which is currently dragging
     * @return {draw2d.Figure} the figure which should receive the drop event or null if the element didnt want a drop event
     */
    onDragEnter : function(figure)
    {
    	// Ports accepts only InputPorts as DropTarget
    	//
        if (figure instanceof draw2d.InputPort) {
            return this._super(figure);
        }
        
        if (figure instanceof draw2d.HybridPort) {
            return this._super(figure);
        }
        
        return null;
    },
    
    /**
     * @inheritdoc
     * 
     */
    onDragLeave:function( figure)
    {
	  // Ports accepts only InputPorts as DropTarget
	  //
      if(figure instanceof draw2d.InputPort){
        this._super( figure);
      }
      else if(figure instanceof draw2d.HybridPort){
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
       if(request.getPolicy() === draw2d.command.CommandType.CONNECT)
       {
         if(request.source.getParent().getId() === request.target.getParent().getId()){
            return null;
         }
    
         if(request.source instanceof draw2d.InputPort){
            // This is the different to the InputPort implementation of createCommand.
            return new draw2d.command.CommandConnect(request.canvas,request.target,request.source, request.source);
         }
         if(request.source instanceof draw2d.HybridPort){
             // This is the different to the InputPort implementation of createCommand.
             return new draw2d.command.CommandConnect(request.canvas,request.target,request.source, request.source);
         }
    
         return null;
       }
    
       // ...else call the base class
       return this._super(request);
    }
});