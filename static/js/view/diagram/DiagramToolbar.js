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
                    text: 'Undo'
                },
                {
                    xtype: 'button',
                    itemId: 'btRedo',
                    disabled: true,
                    text: 'Redo'
                },
                {
                    xtype: 'button',
                    border: 0,
                    disabled: true,
                    itemId: 'splitter1'
                },
                {
                    xtype: 'button',
                    itemId: 'btDelete',
					disabled: true,
                    text: 'Delete'
                },
                {
                    xtype: 'button',
                    border: 0,
                    disabled: true,
                    itemId: 'splitter2'
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
                            text: 'Zoom in'
                        },
                        {
                            xtype: 'button',
                            itemId: 'btZoomNormal',
                            text: '1:1'
                        },
						{
                            xtype: 'button',
                            itemId: 'btZoomOut',
                            text: 'Zoom out'
                        }
                    ]
                },
                {
                	xtype: 'button',
                    border: 0,
                    disabled: true,
                    itemId: 'splitter2'
                },
                {
                	xtype: 'button',
                	iconCls: 'save-diagram',
                    itemId: 'btSaveDiagram',
                    disabled: true,
                    text: 'Save diagram'
                },
                {
                	xtype: 'button',
                	iconCls: 'send-to-DB',
                    itemId: 'btSyncToDB',
                    disabled: true,
                    text: 'Synch to DB'
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