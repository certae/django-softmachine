// Html Panel Objects, html editing many fields makes way too heavy

Ext.define('ProtoUL.ux.HtmlSet', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.htmlset',
    border : false, 

    layout: {
		type : 'vbox',
        align: 'stretch' 
    },

    htlmFields : [],  
    htmlPanels : {},

    height : 200,
    flex  : 1,
     
    initComponent: function () {
		var me = this, myItems = [], myConfig = this.myConfig;

		if (this.title) {
			me.setTitle(this.title);
		}
        
        for (var ix in this.htlmFields ) {
			var vFld = this.htlmFields[ix];
            var newPanel = Ext.create('Ext.panel.Panel', {
                __ptConfig : vFld, 
				layout : {
					padding : 5
				},
                autoScroll: true,
                html: '',
                title: vFld.fieldLabel || vFld.name ,
                tools: [{
                    type: 'formUpd',
                    itemId : 'edithtml', 
                    tooltip: _SM.__language.Tooltip_Open_HtmlEditor,
                    scope : this,  
                    handler: function(event, target, owner, tool ){
						var myPanel = owner.ownerCt;
						openHtmlEditorWin(myPanel);
                    }
                }],                 
                collapsible : true, 
                flex : 1, 
                
                setReadOnly: function( bReadOnly ) {
					// FIXME: if not visible does not recognize the child
					var obj = this.getHeader();
					if (obj) {
						obj = obj.child('#edithtml');
					}
					if (obj) {
						obj.setVisible(!bReadOnly);
					}
                }
            }); 

            myItems.push(  newPanel ) ;
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
	});

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
                text:   _SM.__language.Text_Save_Button,
                scope : this,
                handler : onSave
            }, {
                iconCls : 'icon-reset',
                text:   _SM.__language.Text_Return_Button,
                scope : this,
                handler : onReset
            }]
        }] 
	});
    
    function onSave() {
		var sHtml = myHtmlField.getValue();
		myPanel.update(sHtml);
		myPanel.rawHtml = sHtml;
		myWin.close();
    }

    function onReset() {
		myWin.close();
    }
    
    myWin.show();    
}