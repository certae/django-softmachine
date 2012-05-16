Ext.require([
    'Ext.button.Button',
    'Ext.grid.property.Grid'
]);

Ext.onReady(function(){
    // simulate updating the grid data via a button click
    Ext.create('Ext.button.Button', {
        renderTo: 'button-container',
        text: 'Update source',
        handler: function(){
            propsGrid.setSource({
                '(name)': 'Property Grid',
                grouping: false,
                autoFitColumns: true,
                productionQuality: true,
                created: new Date(),
                tested: false,
                version: 0.8,
                borderWidth: 2
            });
        }
    });
    
    var propsGrid = Ext.create('Ext.grid.property.Grid', {
        width: 300,
        renderTo: 'grid-container',
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
});


//
var grid = new Ext.grid.property.Grid({

    // Custom editors for certain property names
    customEditors: {
        evtStart: Ext.create('Ext.form.TimeField', {selectOnFocus:true})
    },

    // Displayed name for property names in the source
    propertyNames: {
        evtStart: 'Start Time'
    },

    // Data object containing properties to edit
    source: {
        evtStart: '10:00 AM'
    }
});