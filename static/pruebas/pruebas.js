

a = {
  fieldLabel: 'test label', 
  allowBlank: false,
 
 
  listeners: {
    render: function(c) {
        Ext.create('Ext.tip.ToolTip', {
        target: c.getEl(),
        html: 'this is a test message'
      });
    }
  }
  
  
  
  
}

