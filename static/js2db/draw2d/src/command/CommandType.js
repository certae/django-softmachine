/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/

/**
 * @class draw2d.command.CommandType
 * 
 * EditPolicies should determine an Figures editing capabilities. 
 * It is possible to implement an Figure such that it handles all editing 
 * responsibility.<br> 
 * However, it is much more flexible and object-oriented to use 
 * EditPolicies. Using policies, you can pick and choose the editing behavior for 
 * an Figure without being bound to its class hierarchy. Code reuse is increased, 
 * and code management is easier. 
 * 
 * @author Andreas Herz
 */
draw2d.command.CommandType = Class.extend({
	
    NAME : "draw2d.command.CommandType",

    /**
     * @constructor
     * Create a new edit policy object
     * 
     * @param {String} policy 
     */
    init: function( policy) {
       this.policy = policy;
    },

    /**
     * @method
     * Return the String representation of the policy
     * 
     * @return {String}
     **/
    getPolicy:function()
    {
       return this.policy;
    }
});
 
draw2d.command.CommandType.DELETE               = "DELETE";
draw2d.command.CommandType.MOVE                 = "MOVE";
draw2d.command.CommandType.CONNECT              = "CONNECT";
draw2d.command.CommandType.MOVE_BASEPOINT       = "MOVE_BASEPOINT";
draw2d.command.CommandType.MOVE_JUNCTION        = "MOVE_JUNCTION";
draw2d.command.CommandType.MOVE_GHOST_JUNCTION  = "MOVE_GHOST_JUNCTION";
draw2d.command.CommandType.RESIZE               = "RESIZE";
draw2d.command.CommandType.RESET                 = "RESET";


