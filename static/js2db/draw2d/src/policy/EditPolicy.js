/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.EditPolicy
 * 
 * A pluggable contribution implementing a portion of an behavior. 
 *
 *
 * EditPolicies should determine an Canvas or figure editing capabilities. It is possible to implement 
 * an figure such that it handles all editing responsibility. However, it is much more flexible 
 * and object-oriented to use EditPolicies. Using policies, you can pick and choose the editing 
 * behavior for an figure/canvas without being bound to its class hierarchy. Code management is easier. 
 * 
 * 
 * This interface is not intended to be implemented by clients. Clients should inherit from {@link draw2d.policy.figure.SelectionFeedbackPolicy}
 * or {@link draw2d.policy.canvas.SelectionPolicy}. 
 * 
 * @author Andreas Herz
 */
draw2d.policy.EditPolicy = Class.extend({

    NAME : "draw2d.policy.EditPolicy",
    
    /**
     * @constructor 
     * 
     */
    init: function(){
    },

    /**
     * @method
     * Called by the host if the policy has been installed.
     * 
     * @param {draw2d.Canvas/draw2d.Figure} host
     */
    onInstall: function( host){
    },
    
    /**
     * @method
     * Called by the host if the policy has been uninstalled.
     * 
     * @param {draw2d.Canvas/draw2d.Figure} host
     */
    onUninstall: function( host){
    }
});
