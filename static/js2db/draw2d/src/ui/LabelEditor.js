/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.ui.LabelEditor
 * Base class for all draw2d.shape.basic.Label editors. The default implementation is to open
 * a simple javascript prompt dialog.<br>
 * Use LabelInplaceEditor or your own implementation if you need more comfort. 
 * 
 *     @example preview small frame
 *     
 *     var label =  new draw2d.shape.basic.Label("Double Click on me");
 *     
 *     label.installEditor(new draw2d.ui.LabelEditor({
 *        // called after the value has been set to the LabelFigure
 *        onCommit: $.proxy(function(value){
 *            alert("new value set to:"+value);
 *        },this),
 *        // called if the user abort the operation
 *        onCancel: function(){
 *        }
 *     }));
 *     
 *     canvas.addFigure(label,50,10);
 * 
 * 
 * @author Andreas Herz
 */

draw2d.ui.LabelEditor = Class.extend({
    
    /**
     * @constructor
     * Create an label editor with a dedicated callback listener
     * 
     * @private
     */
    init: function(listener){
        
        // register some default listener and override this with the handover one 
        this.listener = $.extend({onCommit:function(){}, onCancel:function(){}},listener);
     },
    
    /**
     * @method
     * Trigger the edit of the label text.
     * 
     * @param {draw2d.shape.basic.Label} label the label to edit
     */
    start: function( label){
        var newText = prompt("Label: ", label.getText());
        if(newText){
            label.setText(newText);
            this.listener.onCommit(label.getText());
        }
        else{
            this.listener.onCancel();
        }
    }
    
});