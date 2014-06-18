/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.Application', {
    name: 'ProtoUL',
	
    extend: 'Ext.app.Application',
	paths: {
        'ProtoUL': 'static/js'
    },
    
    requires: [
    	'Ext.window.MessageBox', 
    	'Ext.toolbar.Paging', 
    	'Ext.layout.container.Border', 
    	'Ext.util.Cookies', 
    	'Ext.Ajax', 
    	'ProtoUL.view.MenuTree', 
    	'ProtoUL.view.ProtoTabContainer', 
    	'ProtoUL.view.Viewport', 
    	'ProtoUL.view.password.PasswordReset', 
    	'ProtoUL.ux.Printer', 
    	'ProtoUL.ux.GridHeaderToolTip', 
    	'ProtoUL.ux.CheckColumn'
    ],
	models: [
        'EntityAttributesModel'
    ],
    stores: [
        'EntityAttributeStore',
        'DBTypesStore',
        'DiagramModelStore'
    ],
	views: [
        'diagram.DiagramMainView',
        'diagram.DiagramMenu',
        'diagram.DiagramCanvas',
        'diagram.DiagramToolbar',
        'diagram.EntityEditor',
        'diagram.EntityAttributes',
        'diagram.TableContextMenu',
        'diagram.DatabaseMenu',
        'searchmodel.LiveSearchGridPanel',
        'searchmodel.SearchBottomBar',
        'ComboBoxPrompt'
    ],
	controllers: [
		'PasswordManager',
		'DiagramController',
		'DiagramMenuController',
		'DiagramContextMenuController'
	],
	
});