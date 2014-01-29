/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */
/*global ProtoUL */
/*global getSimpleProperties */

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

        var me = this.myGrid, navPanel = ['-'];
        var comboPageSize = new Ext.form.ComboBox({
            name: 'perpage',
            width: 60,
            store: new Ext.data.ArrayStore({
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

        var myNavPanel = {
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


    setToolMode: function ( myToolBt, bEdit) {
        var myExtGrid = this.myGrid._extGrid;

        if (bEdit) {
            myExtGrid.down(myToolBt).show();
        } else {
            myExtGrid.down(myToolBt).hide();
        }
    }, 

    setEditMode: function(bEdit) {

        // @formatter:off
        var me = this, 
            perms = _SM._UserInfo.perms[this.myMeta.viewCode], 
            myExtGrid = me.myGrid._extGrid;
        // @formatter:on

        if (!(perms['add'] || perms['change'] || perms['delete'] )) {
            return;
        }
        // if ( ! _SM._UserInfo.isStaff  ) return

        this.myGrid.editable = bEdit;

        var bRef = bEdit && me.myGrid.selected; 

        if ( bRef ) { 
            var record = me.myGrid.selected, 
                stRec = record.get('_ptStatus'); 

            bRef = ! (stRec && stRec === _SM._ROW_ST.REFONLY) ; 
        }

        this.setEditToolBar( bEdit, bRef, perms );


    },

    setEditToolBar: function( bEdit, bRef, perms ) {

        var me = this; 

        // setToolMode ( myExtGrid, '#toolRowAdd', bEdit && perms['add'])
        me.setToolMode('#toolRowCopy', bEdit && perms['add'] );
        me.setToolMode('#toolFormAdd', bEdit && perms['add'] );

        me.setToolMode('#toolFormUpd', bRef && perms['change'] );
        me.setToolMode('#toolFormView', ! ( bRef && perms['change'] ));

        me.setToolMode('#toolRowDel', bRef && perms['delete'] );
        // setToolMode ( myExtGrid, '#toolMetaConfig',  !bEdit );

    }, 


    //  --------------------------------------------------------------------------

    onEditAction: function(ev, obj, head, btn) {

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
                function doDelete(btn) {
                    if (btn === 'yes') {
                        me.myGrid.deleteCurrentRecord();
                    }
                }


                Ext.MessageBox.confirm(_SM.__language.Title_Msg_Confirm_Delete, _SM.__language.Msg_Confirm_Delete_Operation, doDelete);
                break;
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
