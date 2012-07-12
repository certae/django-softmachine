Ext.define('Ext.ux.protoMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.protoMenu',
    initComponent: function() {
        this.callParent(arguments);

    },

    afterRender: function() {
        this.superclass.afterRender.apply(this, arguments);

        var menu = this;
        this.tip = new Ext.ToolTip({
            target: this.getEl().getAttribute('id'),
            renderTo: document.body,
            delegate: '.x-menu-item',
            title: '',
            listeners: {
                beforeshow: function updateTip(tip) {
                    var mi = menu.activeItem.initialConfig; 
                    if (!mi || !mi.qtip)  return false;
                    
                    //tip.header.dom.firstChild.innerHTML = mi.qtitle;;
                    tip.title = mi.qtitle || ''
                    tip.body.dom.innerHTML = mi.qtip;
                }
            }
        });
    }
});

Ext.create('Ext.ux.protoMenu', {
    width: 100,
    margin: '0 0 10 0',
    floating: false,
    // usually you want this set to True (default)
    renderTo: Ext.getBody(),
    // usually rendered by it's containing component
    items: [{
        text: 'regular item 1', 
        qtitle: 'x--',
        qtip: 'xxxxx'
    },
    {
        text: 'regular item 2',
        qtitle: 'y--',
        qtip: 'yyyyy'
    },
    {
        text: 'regular item 3',
        qtitle: 'z--',
        qtip: 'zzzz'
    }]
});



​