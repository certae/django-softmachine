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

    viewCode : null,
    linkController : null,
    detailDefinition : null,

    myWinGrid : null,

    initComponent : function() {
        var me = this;

        me.disabled = true;
        me.callParent();

        
            
      // menu: new Ext.menu.Menu({
        // items: [
            // // these will render as dropdown menu items when the arrow is clicked:
            // {text: 'Item 1', handler: function(){ alert("Item 1 clicked"); }},
            // {text: 'Item 2', handler: function(){ alert("Item 2 clicked"); }}
        // ]
    // }); 
    

        me.on('click', me.loadWinGridMeta, me);

    },

    loadWinGridMeta : function(me) {
        // TODO: Refactor, move loadMeta to grid or form
        // carga la meta y lo envia a la carga de la forma
        me.loadMeta(me.loadWinGrid);
    },

    setButtonsReadOnly : function(readOnly) {
        this.setDisabled(readOnly);
    },

    loadWinGrid : function(me) {

        me.myWinGrid = Ext.create('ProtoUL.UI.WinGridController', {
            viewCode : me.viewCode,
            linkController : me.linkController,
            detailDefinition : me.detailDefinition
        });

        me.myWinGrid.createGridWindow(me.myWinGrid);
    },


    loadMeta : function(fnBase, opts) {
        // Async Call for getting meta
        var me = this, options = {
            scope : me,
            success : function(obj, result, request) {
                fnBase.call(me, me, opts);
            },
            failure : function(obj, result, request) {
                return;
            }
        };

        if (_SM.loadPci(me.viewCode, true, options)) {
            fnBase.call(me, me, opts);
        }
    }
});

