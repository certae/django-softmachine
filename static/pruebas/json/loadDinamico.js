/*  ----------------------------------------------------------------------
    I would create a database with model/source/grid column definitions, 
    and build the ext grids dynamically by mapping the data with json. 
    
    This is pretty trivial once you make a beforeRender listener that has a ajax request within it, 
    then in the success routine of the ajax you create or populate the model/source/grid definitions and ... done.
    
    You can see this technique (non grid) for example ...
*/ 

var areaEast = Ext.create('Ext.Panel', {
    region: 'east',
    collapsible: true,
    split: true,
    width: 200,
    title: 'east',
    items: [ ],
    layout:'accordion',
    autoScroll: true,
    listeners : {
        beforeRender : function() {

            Ext.Ajax.request({
                url: './js/tabs.pl',
                disableCaching: false,
                success: function(response){
                    var text = Ext.decode(response.responseText);

                    Ext.each( text.rows, function(row, index) {
                        areaEast.add( row );
                    });
                },
            });

        },
    },
});
// ... and some json like what follows will produce a couple of ext items[] on the fly ...
// 
// Content-Type: application/json
// 
// {"rows":[{"html":"str_0.720264353647025","iconCls":"ico_home","title":"tab_1","xtype":"panel"},
 // {"html":"str_0.967244391419577","iconCls":"ico_gear","title":"tab_2","xtype":"panel"},
 // {"html":"str_0.713014552355148","iconCls":"ico_home","title":"tab_3","xtype":"panel"},
 // {"html":"str_0.0254531761575763","iconCls":"ico_gear","title":"tab_4","xtype":"panel"}]}