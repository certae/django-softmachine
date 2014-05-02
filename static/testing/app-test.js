Ext.Loader.setConfig({enabled: true});
// Ext.Loader.setPath('Name', 'static/path/to/Name');
Ext.Loader.setPath('ProtoUL', 'static/js');

Ext.require('Ext.app.Application');
Ext.require('Ext.form.Panel');

var Application = null;

Ext.onReady(function() {
    Ext.application({
        name: 'ProtoUL',
        appfolder: 'static/js',
        paths: {
        	'ProtoUL.view.diagram': 'static/js/view/diagram/',
        	'ProtoUL': 'static/js/',
        	'ProtoUL.model': 'static/js/model/',
        	'ProtoUL.store': 'static/js/store/'
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
            //include the tests in the test.html head
            jasmine.getEnv().addReporter(new jasmine.HtmlReporter());
            jasmine.getEnv().execute();
        }
    });
});