// Panel de objetos html, la edicion de muchos campos html hace la forma demasiado pesada 
// por lo tanto se crea un panel q presenta el html y tiene un tool de edicion q abre un unico 
// editor html  Dgt  12/10 
// utilizado por el Dict MSSSQ   

    // Plan de trabajo:   Ok  
    // Eliminar el tipo html,  y Agregar un htmlFieldSet,  sera un hbox con todos los campos definidos,
    // se carga directamente el html en cada panel  y tendra un tool de edicion q invocara una ventana
    // de edicion html, asi solo existe un unico editor al tiempo. 


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
                autoScroll: true,
                html: '',
                title: vFld.fieldLabel || vFld.name ,
                tools: [{
                    type: 'formUpd',
                    itemId : 'edithtml', 
                    tooltip: __language.Tooltip_Open_HtmlEditor,
                    scope : this,  
                    handler: function(event, target, owner, tool ){
                        var myPanel = owner.ownerCt
                        openHtmlEditorWin( myPanel )
                    }
                }],                 
                collapsible : true, 
                flex : 1, 
                
                setReadOnly: function( bReadOnly ) {
                    // FIx: si no esta visible no reconoce el child @#$@#% 
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


function openHtmlEditorWin( myPanel   )  {

    var myHtmlField = Ext.create( 'ProtoUL.ux.FieldHtmlEditor', { 
            value : myPanel.rawHtml, 
            border: false
        } )

    var myWin = Ext.create('Ext.window.Window', {
        title: myPanel.title,
        height: 300,
        width: 720,
        modal : true, 
        layout: 'fit',

        minHeight: 200,
        minWidth: 300,
        resizable: true,
        
        items: myHtmlField ,
        dockedItems : [{
            xtype : 'toolbar',
            dock : 'bottom',
            ui : 'footer',
            items : ['->', {
                iconCls : 'icon-save',
                itemId : 'save',
                text:   __language.Title_Save_Button,
                scope : this,
                handler : onSave
            }, {
                iconCls : 'icon-reset',
                text:   __language.Text_Return_Button,
                scope : this,
                handler : onReset
            }]
        }] 
    })
    
    function onSave() {

        var sHtml = myHtmlField.getValue()
        myPanel.update(sHtml  )
        myPanel.rawHtml = sHtml 

        myWin.close()
    }

    function onReset() {
        myWin.close()
    }
    
    myWin.show();    
    
};
