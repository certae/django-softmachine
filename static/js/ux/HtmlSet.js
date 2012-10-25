// Panel de objetos html, la edicion de muchos campos html hace la forma demasiado pesada 
// por lo tanto se crea un panel q presenta el html y tiene un tool de edicion q abre un unico 
// editor html  Dgt  12/10 
// utilizado por el Dict MSSSQ   


Ext.define('ProtoUL.ux.HtmlSet', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.htmlset',
    border : false, 

    layout: {
        type: 'vbox',       // Arrange child items vertically
        align: 'stretch' 
    },

    // Definicion de campos html q contendra el set  
    htlmFields : [],  
    
    // 
    htmlPanels : {},

    height : 200,
    flex  : 1,
     
    initComponent: function () {

        var me = this, 
            myItems = [], 
            myConfig = this.myConfig; 
        
        if ( this.title ) me.setTitle( this.title  )   
        
        for (var ix in this.htlmFields ) {
            var vFld = this.htlmFields[ix] 

            var newPanel = Ext.create('Ext.panel.Panel', {
                __ptConfig : vFld, 
                layout: { padding: 5  },  

                html: '',
                title: vFld.fieldLabel || vFld.name ,
                tools: [{
                    type: 'maximize',
                    itemId : 'edithtml', 
                    tooltip: 'Open html editor',
                    scope : this,  
                    handler: function(event, target, owner, tool ){
                        openHtmlEditorWin( 'xx', 'xx')
                    }
                }],                 
                collapsible : true, 
                flex : 1, 
                
                setReadOnly: function( bReadOnly ) {
                    var obj = this.getHeader()
                    if ( obj ) obj = obj.child('#edithtml')
                    if ( obj ) obj.setVisible( ! bReadOnly ); 
                }
                
            }); 

            // Items de presentacion 
            myItems.push(  newPanel ) ;
            
            // Coleccion de panels html expuestas para su actualizacion y manipulacion  
            this.htmlPanels[ vFld.name ] = newPanel;
            
        }

        Ext.apply(this, {
            items: myItems
        });

        this.callParent(arguments);
    }    
    
});


function openHtmlEditorWin( htmlText, htmlTiltle )  {

    var myWin = Ext.create('Ext.window.Window', {
        title: htmlTiltle,
        height: 300,
        width: 600,
        modal : true, 
        layout: 'fit',

        minHeight: 200,
        minWidth: 300,
        resizable: true,
        
        items: {  // Let's put an empty grid in just to illustrate fit layout
            xtype: 'htmlfield',
            border: false
        },
        dockedItems : [{
            xtype : 'toolbar',
            dock : 'bottom',
            ui : 'footer',
            items : ['->', {
                iconCls : 'icon-save',
                itemId : 'save',
                text : 'Save',
                // disabled : true,
                scope : this,
                handler : this.onSave
            }, {
                iconCls : 'icon-reset',
                text : 'Reset',
                scope : this,
                handler : this.onReset
            }]
        }] 
    })
    
    myWin.show();    
    
};
