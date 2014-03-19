/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.command.CommandCollection
 * 
 * A CommandCollection works a a single command. You can add more than one
 * Command to this CommandCollection and execute/undo them onto the CommandStack as a
 * single Command.
 *
 * @inheritable
 * @author Andreas Herz
 * 
 * @extends draw2d.command.Command
 */
draw2d.command.CommandCollection = draw2d.command.Command.extend({
    NAME : "draw2d.command.CommandCollection", 
    
    /**
     * @constructor
     * Create a new CommandConnect objects which can be execute via the CommandStack.
     *
     */
    init : function()
     {
       this._super("Execute Commands");
       
       this.commands = new draw2d.util.ArrayList();
    },
    
    
    /**
     * @method
     * Add a command to the collection.
     * 
     * @param {draw2d.command.Command} command
     */
    add: function(command){
    	this.commands.add(command);
    },
    
    /**
     * @method
     * Returns [true] if the command can be execute and the execution of the
     * command modifies the model. e.g.: a CommandMove with [startX,startX] == [endX,endY] should
     * return false. The execution of this Command doesn't modify the model.
     *
     * @return boolean
     **/
    canExecute:function()
    {
        // We ask all cmd's if they make any changes.
        // Keep in mind: the command will be execute if at least ONE command return [true]!!!!
        // doesn't matter if the other commands return [false].
        // The method should be renamed into: modifiesTheModel()....design flaw.
        var canExec = false;
        this.commands.each(function(i,cmd){
            canExec = canExec|| cmd.canExecute();
        });
        return canExec;
    },
    
    /**
     * @method
     * Execute the command the first time
     * 
     **/
    execute:function()
    {
    	this.commands.each(function(i,cmd){
    	    cmd.execute();
    	});
    },
    
    /**
     * @method
     * Redo the command after the user has undo this command.
     *
     **/
    redo:function()
    {
        this.commands.each(function(i,cmd){
            cmd.redo();
        });
    },
    
    /** 
     * @method
     * Undo the command.
     *
     **/
    undo:function()
    {
        // execute the undo operation in reverse direction.
        
        this.commands.reverse();
        this.commands.each(function(i,cmd){
            cmd.undo();
        });
        this.commands.reverse();
    }
});
