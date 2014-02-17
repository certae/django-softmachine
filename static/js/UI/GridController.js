/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */
/*global ProtoUL */

Ext.define('ProtoUL.UI.GridController', {
    extend: 'Ext.Base',

    // Parametros de entrada
    myMeta: null,
    myGrid: null,
    store: null,

    constructor: function(config) {
        Ext.apply(this, config || {});
    },

    addNavigationPanel: function() {
        /*
         * Configuracion del NavigationPanel, tiene en cuenta el manejo de detalles
         * y agrega el maximo del almacenamiento local.
         *
         */

        var me = this.myGrid, navPanel = ['-'], myNavPanel, comboPageSize;

        comboPageSize = Ext.form.ComboBox({
            name: 'perpage',
            width: 60,
            store: Ext.data.ArrayStore({
                fields: ['id'],
                data: _SM._ComboPageSize
            }),
            mode: 'local',
            value: '50',
            listWidth: 60,
            triggerAction: 'all',
            displayField: 'id',
            valueField: 'id',
            editable: false,
            forceSelection: true
        });

        comboPageSize.on('select', function(combo, record) {
            me.store.pageSize = parseInt(combo.getValue(), 10);
            me.store.load();
            if (me.store.currentPage != 1) {
                me.store.loadPage(1);
            }
        }, me);

        // Extraccion de grilla detalle
        if (me.protoIsDetailGrid) {
            navPanel.push({
                text: _SM.__language.GridNav_In_New_Tab,
                iconCls: 'icon-promote',
                handler: onMenuPromoteDetail
            });
        }

        navPanel.push(comboPageSize, _SM.__language.GridNav_PageSize);

        myNavPanel = {
            xtype: 'pagingtoolbar',
            border: false,
            dock: 'bottom',
            store: me.store,
            displayInfo: true,
            items: navPanel,
            afterPageText: _SM.__language.GridNav_Total + ' {0}',
            beforePageText: _SM.__language.GridNav_Page,

            firstText: _SM.__language.GridNav_First_Page,
            nextText: _SM.__language.GridNav_Next_Page,
            prevText: _SM.__language.GridNav_Previous_Page,
            lastText: _SM.__language.GridNav_Last_Page,
            refreshText: _SM.__language.GridNav_Refresh,

            displayMsg: _SM.__language.GridNav_Current + ' : {0} - {1} ' + _SM.__language.GridNav_Total + ' {2}'
            // emptyMsg: "No register to display"
        };

        me.addDocked(myNavPanel);

        function onMenuPromoteDetail() {

            var detDef = me.detailDefinition;

            _SM.__TabContainer.addTabPanel(me.store.viewCode, me.protoFilter, me.detailTitle);
        }

    },

    addGridTools: function() {

        var editTools = [{
            itemId: 'toolFormAdd',
            tooltip: _SM.__language.GridBtn_Ttip_Add_Form,
            type: 'formAdd',
            width: 20,
            hidden: true,
            scope: this,
            handler: this.onEditAction
        }, {
            itemId: 'toolFormUpd',
            tooltip: _SM.__language.GridBtn_Ttip_Edit_Form,
            hidden: true,
            type: 'formUpd',
            width: 20,
            scope: this,
            handler: this.onEditAction
        }, {
            itemId: 'toolRowDel',
            type: 'rowDel',
            tooltip: _SM.__language.GridBtn_Ttip_Del_Record,
            hidden: true,
            width: 30,
            scope: this,
            handler: this.onEditAction
        }, {
            itemId: 'toolFormView',
            tooltip: _SM.__language.GridBtn_Ttip_Read_Only,
            type: 'formView',
            width: 20,
            scope: this,
            handler: this.onEditAction
            // },{
            // itemId: 'toolRowAdd',
            // tooltip: _SM.__language.GridBtn_Ttip_Add_Row,
            // type: 'rowAdd',
            // hidden: true,
            // width : 20,
            // scope: this,
            // handler: this.onEditAction
        }, {
            itemId: 'toolRowCopy',
            tooltip: _SM.__language.GridBtn_Ttip_Copy_Row,
            type: 'rowCopy',
            hidden: true,
            width: 20,
            scope: this,
            handler: this.onEditAction
        }];

        this.myGrid.addTools(editTools);
        this.setEditMode(false);

    },

    setToolMode: function(myToolBt, bEdit) {
        var myExtGrid = this.myGrid._extGrid;

        if (bEdit) {
            myExtGrid.down(myToolBt).show();
        } else {
            myExtGrid.down(myToolBt).hide();
        }
    },

    setEditMode: function(bEdit) {

        // @formatter:off
        var me = this, bRef,  record, stRec, 
            perms = _SM._UserInfo.perms[this.myMeta.viewCode], 
            myExtGrid = me.myGrid._extGrid;
        // @formatter:on

        if (!(perms['add'] || perms['change'] || perms['delete'] )) {
            return;
        }

        this.myGrid.editable = bEdit;

        bRef = bEdit && me.myGrid.selected;
        if (bRef) {
            record = me.myGrid.selected;
            stRec = record.get('_ptStatus');
            bRef = !(stRec && stRec === _SM._ROW_ST.REFONLY);
        }

        this.setEditToolBar(bEdit, bRef, perms);

    },

    setEditToolBar: function(bEdit, bRef, perms) {

        var me = this;

        me.setToolMode('#toolRowCopy', bEdit && perms['add']);
        me.setToolMode('#toolFormAdd', bEdit && perms['add']);

        me.setToolMode('#toolFormUpd', bRef && perms['change']);
        me.setToolMode('#toolFormView', !(bRef && perms['change'] ));

        me.setToolMode('#toolRowDel', bRef && perms['delete']);

        // Dont Delete
        // setToolMode ( myExtGrid, '#toolRowAdd', bEdit && perms['add'])
        // setToolMode ( myExtGrid, '#toolMetaConfig',  !bEdit );

    },

    //  --------------------------------------------------------------------------

    onEditAction: function(ev, obj, head, btn) {

        function doDelete(btn) {
            if (btn === 'yes') {
                me.myGrid.deleteCurrentRecord();
            }
        }

        if (!this.formController) {
            this.formController = Ext.create('ProtoUL.UI.FormController', {
                myMeta: this.myMeta
            });
        }

        // Lanza el evento de inicio de edicion
        this.myGrid.fireStartEdition(btn.itemId);

        // 'toolFormAdd', 'toolFormUpd', 'toolFormView', 'toolRowAdd', 'toolRowCopy', 'toolRowDel',
        switch( btn.itemId ) {
            case 'toolFormAdd' :

                // TODO: FIX: Add Mask to form load ( is not the right place  )
                // showLoadingMask();
                // var delayedTask = new Ext.util.DelayedTask(function(args){
                //         args.form.openNewForm(args.store);
                // });
                // delayedTask.delay(1, null, null, [{form: this.formController, store: this.myGrid.store}]);

                this.formController.openNewForm(this.myGrid.store);
                break;

            case 'toolFormUpd' :
                if (_SM.validaSelected(this.myGrid.selected)) {
                    this.formController.openLinkedForm(this.myGrid.selected);
                }
                break;

            case 'toolFormView' :
                if (_SM.validaSelected(this.myGrid.selected)) {
                    this.formController.openLinkedForm(this.myGrid.selected, true);
                }
                break;

            // case 'toolRowAdd' :
            // this.myGrid.addNewRecord()
            // break;

            case 'toolRowCopy' :
                this.myGrid.duplicateRecord();
                break;

            case 'toolRowDel' :
                var me = this;
                Ext.MessageBox.confirm(_SM.__language.Title_Msg_Confirm_Delete, _SM.__language.Msg_Confirm_Delete_Operation, doDelete);
                break;
        }

        // Dont delete mask load ( form preview with mask?? )
        //function showLoadingMask()
        // {
        // loadText = 'Loading...';
        // //Use the mask function on the Ext.getBody() element to mask the body element during Ajax calls
        //	Ext.getBody().mask(loadText, 'loading');
        //	Ext.Ajax.on('requestcomplete',Ext.getBody().unmask ,Ext.getBody());
        //	Ext.Ajax.on('requestexception', Ext.getBody().unmask , Ext.getBody());
        // }
    },

    getDetailLink: function(detDefinition) {

        var myGrid = this.myGrid, rowDataIx, detFilter, detTitle = '', masterTitleField;

        // Filter
        if (!myGrid.rowData) {
            detFilter = [{
                "property": detDefinition.detailField,
                "filterStmt": -1
            }];
        } else {
            // En caso de q el master no sea el pk
            rowDataIx = me.idMasterGrid;
            if (detDefinition.masterField !== 'pk') {
                rowDataIx = myGrid.rowData[detDefinition.masterField];
            }
            detFilter = [{
                "property": detDefinition.detailField,
                "filterStmt": rowDataIx
            }];
        }

        // Title
        masterTitleField = detDefinition.masterTitleField || '__str__';
        if (myGrid.rowData)
            detTitle = myGrid.rowData[masterTitleField];

        // Return
        return {
            'detFilter': detFilter,
            'detTitle': detTitle
        };

    },

    setDetailDefaults: function(detDefinition, detFieldDict) {

        var myGrid = this.myGrid, 
            rowData = myGrid.rowData, 
            nField = detDefinition.detailField.replace(/__pk$/, '_id'), 
            myDetField, myTitleField, masterTitleField;

        // Obtiene el campo de filtro ( heredado ); Si no hereda la llave, cancela la edicion
        myDetField = myDetGrid.detFieldDict[nField];
        if (!myDetField || !rowData) {
            // parent key not found' puede ocurrir en detalles de mas de un nivel
            return;
        }

        // Master Id
        myDetField['prpDefault'] = myGrid.currentId;

        // Obtiene el titulo del filtro para heredarlo
        nField = detDefinition.masterTitleField || nField.replace(/_id$/, '');
        myTitleField = detFieldDict[nField];
        if (myTitleField) {
            masterTitleField = detDefinition.masterTitleField || '__str__';
            myTitleField['prpDefault'] = rowData[masterTitleField];
            myTitleField['readOnly'] = true;
        }

    }

});

_SM.validaSelected = function(myReg) {
    if (!myReg) {
        _SM.errorMessage(_SM.__language.Title_Form_Panel, _SM.__language.GridAction_NoRecord);
        return false;
    }
    return true;
};
