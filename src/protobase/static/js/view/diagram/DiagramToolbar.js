var countFigure = 0;

Ext.define('ProtoUL.view.diagram.DiagramToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.diagramtoolbar',

    requires: [
        'Ext.button.Button',
        'Ext.container.ButtonGroup'
    ],

    itemId: 'diagramtoolbar',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'button',
                    itemId: 'btUndo',
                    border: 1,
                    disabled: true,
                    text: _SM.__language.Text_Undo_Button
                },
                {
                    xtype: 'button',
                    itemId: 'btRedo',
                    disabled: true,
                    text: _SM.__language.Text_Redo_Button
                },
                {
                    xtype: 'tbspacer',
					width: 10
                },
                {
                    xtype: 'button',
                    itemId: 'btDelete',
					disabled: true,
                    text: _SM.__language.Text_Delete_Button
                },
                {
                    xtype: 'tbspacer'
                },
                {
                    xtype: 'buttongroup',
                    itemId: 'zoomGroup',
                    header: false,
                    columns: 3,
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'btZoomIn',
                            text: _SM.__language.Text_ZoomIn_Button
                        },
                        {
                            xtype: 'button',
                            itemId: 'btZoomNormal',
                            text: '1:1'
                        },
						{
                            xtype: 'button',
                            itemId: 'btZoomOut',
                            text: _SM.__language.Text_ZoomOut_Button
                        }
                    ]
                },
                {
                	xtype: 'tbspacer'
                },
                {
                	xtype: 'button',
                	iconCls: 'save-diagram',
                    itemId: 'btSaveDiagram',
                    text: _SM.__language.Text_Save_Diagram_Button
                },
                {
                	xtype: 'button',
                	iconCls: 'send-to-DB',
                    itemId: 'btSyncToDB',
                    disabled: true,
                    text: _SM.__language.Text_Commit_Changes_Button
                },
                {
                	xtype: 'button',
                	iconCls: 'icon-print',
                	itemId: 'btExportDiagram',
                	text: _SM.__language.Text_Export_Image
                }
            ]
        });

        me.callParent(arguments);
    },
    
    /**
	 * @method
	 * Called if the selection in the cnavas has been changed. You must register this
	 * class on the canvas to receive this event.
	 * 
	 * @param {draw2d.Figure} figure
	 */
	onSelectionChanged : function(figure){
		var btnDelete = this.getComponent('btDelete');
		if (figure !== null && countFigure === 0) {
			countFigure += 1;
			btnDelete.setDisabled(false);
		} else if (figure !== null && countFigure > 0) {
			btnDelete.setDisabled(false);
		} else if (figure === null && countFigure > 0) {
			countFigure -= 1;
		} else if (figure === null && countFigure === 0) {
			btnDelete.setDisabled(true);
		}
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
		var btnUndo = this.getComponent('btUndo');
		var btnRedo = this.getComponent('btRedo');
		var btnSaveAll = this.getComponent('btSaveDiagram');
		if (event.getStack().canUndo()){
			btnUndo.setDisabled(false);
			btnSaveAll.setDisabled(false);
			btnRedo.setDisabled(true);
		}
		if (event.getStack().canRedo()){
			btnRedo.setDisabled(false);
		}
	}

});