/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.command.CommandConnect
 * 
 * Connects two ports with a connection.
 *
 * @inheritable
 * @author Andreas Herz
 * 
 * @extends draw2d.command.Command
 */
draw2d.command.CommandConnect = draw2d.command.Command.extend({
    NAME : "draw2d.command.CommandConnect", 
    
    /**
     * @constructor
     * Create a new CommandConnect objects which can be execute via the CommandStack.
     *
     * @param {draw2d.Canvas} canvas the canvas to user
     * @param {draw2d.Port} source the source port for the connection to create
     * @param {draw2d.Port} target the target port for the connection to create
     * @param {draw2d.Port} [dropTarget] the port who has initiate the connection creation. mainly the drop target
     */
    init : function(canvas, source, target, dropTarget)
     {
       this._super("Connecting Ports");
       this.canvas = canvas;
       this.source   = source;
       this.target   = target;
       this.connection = null;
       this.dropTarget= dropTarget; // optional
    },
    
    setConnection:function(connection)
    {
       this.connection=connection;
    },
    
    /**
     * @method
     * Execute the command the first time
     * 
     **/
    execute:function()
    {
        var optionalCallback = $.proxy(function(conn){
            this.connection = conn;
            this.connection.setSource(this.source);
            this.connection.setTarget(this.target);
            this.canvas.addFigure(this.connection);
        },this);
        
        // the createConnection must return either a connection or "undefined". If the method return "undefined"
        // the asynch callback must be called. Usefull fi the createConnection shows a selection dialog
        //
        if(this.connection===null){
          var result = draw2d.Connection.createConnection(this.source, this.target, optionalCallback, this.dropTarget);
          // well be handeld by the optional callback
          if(typeof result==="undefined"){
              return;
          }

          this.connection = result;
        }
       
        optionalCallback(this.connection);
    },
    
    /**
     * @method
     * Redo the command after the user has undo this command.
     *
     **/
    redo:function()
    {
       this.canvas.addFigure(this.connection);
       this.connection.reconnect();
    },
    
    /** 
     * @method
     * Undo the command.
     *
     **/
    undo:function()
    {
        this.canvas.removeFigure(this.connection);
    }
});
