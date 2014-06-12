/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.InputPort
 * A InputPort is the start anchor for a {@link draw2d.Connection}.
 * 
 * @author Andreas Herz
 * @extend draw2d.Port
 */ 
draw2d.InputPort = draw2d.Port.extend({

    NAME : "draw2d.InputPort",

    /**
     * @constructor
     * Create a new InputPort element
     * 
     * @param {String} [name] the name for the Port.
     */
    init : function( name)
    {
        this._super( name);
        
        // responsive for the arrangement of the port 
        // calculates the x/y coordinates in relation to the parent node
        this.locator=new draw2d.layout.locator.InputPortLocator();
    },

    
    /**
     * @inheritdoc
     **/
    onDragEnter : function(figure)
    {
        // User drag&drop a normal port
        if (figure instanceof draw2d.OutputPort) {
            return this._super(figure);
        }
        // User drag&drop a normal port
        if (figure instanceof draw2d.HybridPort) {
            return this._super(figure);
        }
        
        return null;
    },
    
    /**
     * @inheritdoc
     * 
     * @param {draw2d.Figure} figure
     */
    onDragLeave:function( figure)
    {
      if(figure instanceof draw2d.OutputPort){
        this._super( figure);
      }
      
      else if(figure instanceof draw2d.HybridPort){
          this._super( figure);
      }
    },
    
    
    /**
     * @method
     * Returns the Command to perform the specified Request or null.<br>
     * Inherited figures can override this method to return the own implementation
     * of the request.<br>
     *
     * @param {draw2d.command.CommandType} request describes the Command being requested
     * @return {draw2d.command.Command} null or a valid command
     **/
    createCommand:function( request)
    {
       // Connect request between two ports
       //
       if(request.getPolicy() ===draw2d.command.CommandType.CONNECT)
       {
         // loopback not supported at the moment
         if(request.source.getParent().getId() === request.target.getParent().getId()){
            return null;
         }
    
         // InputPort can only connect to an OutputPort. InputPort->InputPort make no sense
         if(request.source instanceof draw2d.OutputPort){
            // This is the different to the OutputPort implementation of createCommand
            return new draw2d.command.CommandConnect(request.canvas,request.source,request.target, request.source);
         }
         
         if(request.source instanceof draw2d.HybridPort){
             // This is the different to the OutputPort implementation of createCommand
             return new draw2d.command.CommandConnect(request.canvas,request.source,request.target, request.source);
         }
      
         return null;
       }
    
       // ...else call the base class
       return this._super(request);
    }
});