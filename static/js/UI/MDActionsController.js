Ext.define('ProtoUL.UI.MDActionsController', {
    extend: 'Ext.Base',
    myMeta: null,
    constructor: function(config) {
        Ext.apply(this, config || {});
        this.getProtoActionsBar();
    },

    getProtoActionsBar: function() {

        var perms = _SM._UserInfo.perms[this.myMeta.viewCode];
        if (!(perms['add'] || perms['change'] || perms['delete'])) {
            return;
        }
        // if ( ! _SM._UserInfo.isStaff ) return

        // @formatter:off
        var me = this, 
            myProtoActions = [],
            __MasterDetail = this.__MasterDetail;
        // @formatter:on

        for (var ix in this.myMeta.actions  ) {
            var pProtoAction = this.myMeta.actions[ix];
            pProtoAction.menuText = pProtoAction.menuText || pProtoAction.name;
            myProtoActions.push(new Ext.Action({
                text: pProtoAction.menuText,
                actionName: pProtoAction.name,
                iconCls: pProtoAction.viewIcon,
                tooltip: pProtoAction.description,
                actionDef: pProtoAction,
                scope: me,
                handler: onClickDoAction
            }));
        };

        if (myProtoActions.length > 0) {

            __MasterDetail.tbProtoActions = Ext.create('Ext.toolbar.Toolbar', {
                dock: 'top',
                hidden: true,
                enableOverflow: true,
                items: [{
                    xtype: 'tbtext',
                    text: '<b>Actions :</b>'
                }]
            });

            __MasterDetail.tbProtoActions.add(myProtoActions);
            __MasterDetail.myProtoActions = myProtoActions;
            __MasterDetail.protoMasterGrid.addDocked(__MasterDetail.tbProtoActions);

        };

        function onClickDoAction(btn) {
            var pGrid = __MasterDetail.protoMasterGrid;
            var selectedKeys = pGrid.getSelectedIds();
            var pAction = btn.actionDef;

            // "selectionMode",
            if ((pAction.selectionMode == "single"  ) && (selectedKeys.length != 1 )) {
                _SM.__StBar.showMessage('TITLE_ACTION_SELECTION_SINLGLE', btn.actionName, 3000);
                return;
            } else if ((pAction.selectionMode == "multiple"  ) && (selectedKeys.length < 1 )) {
                _SM.__StBar.showMessage('TITLE_ACTION_SELECTION_MULTI', btn.actionName, 3000);
                return;
            }

            // actionParams
            pAction.actionParams = _SM.verifyList(pAction.actionParams);
            if (pAction.actionParams.length == 0) {
                this.doAction(me, pGrid.viewCode, btn.actionDef, selectedKeys, []);
            } else {
                var myOptions = {
                    scope: me,
                    acceptFn: function(parameters) {
                        this.doAction(me, pGrid.viewCode, btn.actionDef, selectedKeys, parameters);
                    }

                };

                var myWin = Ext.create('ProtoUL.ux.parameterWin', {
                    parameters: pAction.actionParams,
                    title: btn.actionName + ' - ' + pGrid.rowData['__str__'],
                    options: myOptions
                });

                myWin.show();
            };
        };

    },

    doAction: function(me, viewCode, actionDef, selectedKeys, parameters) {

        var options = {
            scope: me,
            success: function(result, request) {
                var myResult = Ext.decode(result.responseText);
                _SM.__StBar.showMessage(actionDef.menuText + ' ' + myResult.message, 'MDActionsController', 3000);

                if (myResult.success && actionDef.refreshOnComplete) {
                    this.__MasterDetail.mdGridReload();
                }

                if (myResult.fileName) {
                    _SM.getFile(myResult.fileName, true);
                }

            },
            failure: function(result, request) {
                _SM.__StBar.showError(actionDef.menuText + ' ' + result.statusText, 'MDActionsController');

            }

        };

        _SM.__StBar.showMessage('executing  ' + actionDef.menuText + '...', 'MDActionsController');
        _SM.doProtoActions(viewCode, actionDef.menuText, selectedKeys, parameters, options);

    }

});
