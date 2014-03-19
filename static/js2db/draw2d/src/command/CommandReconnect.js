/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.command.CommandReconnect
 * 
 * Reconnects two ports. This command is used during the DragDrop operation of a draw2d.Connection.
 *
 * @inheritable
 * @author Andreas Herz
 * 
 * @extends draw2d.command.Command
 */
draw2d.command.CommandReconnect = draw2d.command.Command.extend({
    NAME : "draw2d.command.CommandReconnect", 


    /**
     * @constructor
     * Create a new Command objects which can be execute via the CommandStack.
     *
     * @param {draw2d.Connection} con the related Connection which is currently in the drag&drop operation
     */
    init : function(con){
       this._super("Connecting Ports");
       this.con      = con;
       this.oldSourcePort  = con.getSource();
       this.oldTargetPort  = con.getTarget();
       this.oldRouter      = con.getRouter();
   },
    
    /**
     * @method
     * Returns [true] if the command can be execute and the execution of the
     * command modify the model. A CommandMove with [startX,startX] == [endX,endY] should
     * return false. <br>
     * the execution of the Command doesn't modify the model.
     *
     * @return {boolean}
     **/
    canExecute:function()
    {
      // return false if we doesn't modify the model => NOP Command
      return true;
    },
    
    /**
     * @method
     * The new ports to use during the execute of this command.
     * 
     * @param {draw2d.Port} source
     * @param {draw2d.Port} target
     */
    setNewPorts:function(source,  target)
    {
      this.newSourcePort = source;
      this.newTargetPort = target;
    },
    
    /**
     * @method
     * Execute the command the first time
     * 
     **/
    execute:function()
    {
       this.redo();
    },
    
    /**
     * @method
     * Execute the command the first time
     * 
     **/
    cancel:function()
    {
        this.con.setSource(this.oldSourcePort);
        this.con.setTarget(this.oldTargetPort);
       this.con.setRouter(this.oldRouter);
    },
    
    /**
     * @method
     * Undo the command
     *
     **/
    undo:function()
    {
      this.con.setSource(this.oldSourcePort);
      this.con.setTarget(this.oldTargetPort);
      this.con.setRouter(this.oldRouter);
    },
    
    /** 
     * @method
     * Redo the command after the user has undo this command
     *
     **/
    redo:function()
    {
      this.con.setSource(this.newSourcePort);
      this.con.setTarget(this.newTargetPort);
      this.con.setRouter(this.oldRouter);
    }

});
