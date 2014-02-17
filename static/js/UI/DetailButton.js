/**
 * @class ProtoUL.ux.DetailButton
 * @author  Dario Gomez

 * Helper class for intancing ProtoForm

 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */
/*global ProtoUL */
/*global getSimpleProperties */

Ext.define('ProtoUL.UI.DetailButton', {
    extend : 'Ext.button.Split',
    alias : 'widget.detailButton',

    initComponent : function() {
        var me = this;

        me.disabled = true;
        me.callParent();

        me.on('click', function(me, e, opts) {
               var a = 1; 
        }, me);

    },

    setMasterRecord : function( masterMeta, masterRecord, masterReadOnly) {

        var me = this;
        me.masterMeta = masterMeta;
        me.masterRecord = masterRecord;
        me.masterReadOnly = masterReadOnly;
        me.enable();

    }
});

