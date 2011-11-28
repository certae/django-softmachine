

Ext.define('ProtoUL.view.Properties', {

    extend: 'Ext.grid.property.Grid',
    alias: 'widget.properties',

    propertyNames: {
        tested: 'QA',
        borderWidth: 'Border Width'
    },
    source: {
        "(name)": "Properties Grid",
        "grouping": false,
        "autoFitColumns": true,
        "productionQuality": false,
        "created": Ext.Date.parse('10/15/2006', 'm/d/Y'),
        "tested": false,
        "version": 0.01,
        "borderWidth": 1
    }
});


    // createPropertyPanel: function(){
        // this.propertyPanel = Ext.create('widget.propertypanel', {
            // region: 'east',
            // width: 300,
            // title: 'Properties',
            // collapsed: true,
            // xtype : 'properties',
        // });
        // return this.propertyPanel;
    // },

