/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.command.CommandStackEventListener
 * 
 * Event class which will be fired for every CommandStack operation. Required for CommandStackListener.
 * 
 * @author Andreas Herz
 */
draw2d.command.CommandStackEventListener = Class.extend({
    NAME : "draw2d.command.CommandStackEventListener", 

    /**
     * @constructor
     * Creates a new Listener Object
     * 
     */
    init : function()
    {
    },
    
    /**
     * @method
     * Sent when an event occurs on the command stack. draw2d.command.CommandStackEvent.getDetail() 
     * can be used to identify the type of event which has occurred.
     * 
     * @template
     * 
     * @param {draw2d.command.CommandStackEvent} event
     **/
    stackChanged:function(event)
    {
    }

});
