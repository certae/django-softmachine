Ext.Loader.setConfig({enabled: true});

Ext.Loader.setPath('ProtoUL', 'static/js');

Ext.require('Ext.app.Application');
Ext.require('Ext.form.Panel');

var Application = null;

Ext.onReady(function() {
    Ext.application({
        name: 'ProtoUL',
        appfolder: 'static/js',
        paths: {
        	'ProtoUL': 'static/js/'
        },
        
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
	        'searchmodel.SearchBottomBar'
	    ],
		controllers: [
			'PasswordManager',
			'DiagramController',
			'DiagramMenuController'
		],
        launch: function() {
            jasmine.getEnv().addReporter(new jasmine.HtmlReporter());
            jasmine.getEnv().execute();
        }
    });
});