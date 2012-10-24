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

    // Campos html q contendra el set  
    htlmFields : [],  
    height : 200,
    flex  : 1,
     
    initComponent: function () {

        var me = this, 
            myHtmlPanels = {},
            myItems = [], 
            myConfig = this.myConfig; 
        
        if ( this.title ) me.setTitle( this.title  )   
        
        for (var ix in this.htlmFields ) {
            var vFld = this.htlmFields[ix] 

            var newPanel = Ext.create('Ext.panel.Panel', {
                title: vFld.fieldLabel || vFld.name ,
                layout: {  
                    padding: 5 
                },  
                html: 'Hello <b>World!</b>',
                tools: [{
                    type: 'maximize',
                    handler: function(event, target, owner, tool ){
                        // show help here
                    }
                }],                 
                collapsible : true, 
                flex : 1  
            }); 

            // Items de presentacion 
            myItems.push(  newPanel ) ;
            
            // Objeto indexado de trabajo 
            myHtmlPanels[ vFld.name ] = newPanel;
        }

        Ext.apply(this, {
            items: myItems
        });

        this.callParent(arguments);
    }    
    
});


