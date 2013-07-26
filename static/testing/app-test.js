Ext.Loader.setConfig({enabled: true});
// Ext.Loader.setPath('Name', 'static/path/to/Name');
Ext.Loader.setPath('ProtoUL', 'static/js');

Ext.require('Ext.app.Application');
Ext.require('Ext.form.Panel');

var Application = null;

Ext.onReady(function() {
    Application = Ext.create('Ext.app.Application', {
        name: 'ProtoUL',
        appfolder: 'static/js',

        launch: function() {
            //include the tests in the test.html head
            jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
            jasmine.getEnv().execute();
        }
    });
});
