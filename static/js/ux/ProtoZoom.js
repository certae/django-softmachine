/* ---------------------------------------------------
 * Objeto zoom para acceder a la lista fitrada de un FK 
 * 
 * El zoom debe contener unos campos de QBE, y una grilla con los resultados 
 */

Ext.define('Ext.ux.protoZoom', {
    extend : 'Ext.form.field.Trigger',
    alias : 'widget.protoZoom',
    
    // Boton del trigger
    triggerCls : Ext.baseCSSPrefix + 'form-search-trigger',
    
    initComponent : function() {
        
        // referencia a la ventana modal
        var win;
        this.win = win;
        
        this.callParent(arguments);
        this.on('specialkey', function(f, e) {
            if (e.getKey() == e.ENTER) {
                this.onTriggerClick();
            }
        }, this);
    },
    
    onTriggerClick : function() {
        this.showZoomForm(this);
    },
    
    showZoomForm : function(me) {
        

        // Campos de base con titulo
        var sectionBase1 = {
            style : 'Section',
            frame : true,
            title : 'Section base1',
            fields : [
                    'f1', 'f2'
            ]
        }


        var protoFormLayout = {
            // Las diferentes secciones se definen como un arbol ( DOM )
            // title: 'Mi forma',
            modal : true,
            items : [
                    sectionBase1
            ]
        }

        var form = defineProtoForm(protoFormLayout);
        
        // -----------------------------------------------------------------------------
        
        win = Ext.widget('window', {
            title : 'Contact Us',
            closeAction : 'hide',
            width : 800,
            minWidth : 400,
            height : 600,
            minHeight : 400,
            layout : 'fit',
            resizable : true,
            modal : true,
            items : form
        });
        
        win.show();
        
    }

});


// --------------------------------------------------------------------------------------------

Ext.define('Ext.ux.protoZoomCont', {
    extend : 'Ext.container.Container',
    alias : 'widget.protozoomcont',
    
    // padding: '5 5 5 5',
    layout : {
        type : 'vbox',
        align : 'stretch'
    },
    items : [
        {
            itemId : 'form',
            xtype : 'writerform',
        // margins: '0 0 10 0',
        // listeners: {
        // create: function(form, data){
        // data._ptStatus = 'NEW_ROW'
        // record = Ext.create('Writer.Person');
        // record.set(data);
        // record.setId(0);
        // store.insert(0, record);
        // }}
        // }, {
        // itemId: 'grid',
        // xtype: 'writergrid',
        // title: 'User List',
        // flex: 1,
        // store: store,
        // listeners: {
        // selectionchange: function(selModel, selected) {
        // main.child('#form').setActiveRecord(selected[0] || null);
        // }
        // }
        }
    ]
});

