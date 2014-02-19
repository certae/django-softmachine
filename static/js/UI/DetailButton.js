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
    addDetailForm : false,

    myWinGrid : null,

    initComponent : function() {
        var me = this, myMenu;

        me.disabled = true;

        if (me.addDetailForm) {

            myMenu = Ext.create('Ext.menu.Menu', {
                items : [{
                    text : _SM.__language.Text_New_Button + ' [ ' + me.text + ' ]',
                    iconCls : "icon-formAdd",
                    scope : me,
                    handler : addFormClick
                }]
            });

            Ext.apply(this, {
                menu : myMenu
            });
        }

        me.callParent();
        me.on('click', me.loadWinGridMeta, me);

        function addFormClick() {
            var formController = Ext.create('ProtoUL.UI.FormController', {
                linkController : me.linkController,
                detailDefinition : me.detailDefinition
            });
            formController.openProtoForm.call(formController, me.viewCode, -1, true);
        }

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

