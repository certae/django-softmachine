/**
 * Original Information 
 * @class Ext.ux.grid.HeaderToolTip
 * @namespace Ext.ux.grid
 *
 *  Text tooltips should be stored in the grid column definition
 *  
 *  Sencha forum url: 
 *  http://www.sencha.com/forum/showthread.php?132637-Ext.ux.grid.HeaderToolTip
 * 
 * Forked for ProtoExt  12/03  Dario 
 */
Ext.define('ProtoUL.ux.GridHeaderToolTip', {
    alias: 'plugin.headertooltip',
    init : function(grid) {
        var headerCt = grid.headerCt;
        
        // Si alguna columna es locked ( rowNuber ) el header viene nulo
        if ( ! headerCt ) return
        
        grid.headerCt.on("afterrender", function(g) {
            grid.tip = Ext.create('Ext.tip.ToolTip', {
                target: headerCt.el,
                delegate: ".x-column-header",
                trackMouse: true,
                renderTo: Ext.getBody(),
                listeners: {
                    beforeshow: function(tip) {
                        var c = headerCt.down('gridcolumn[id=' + tip.triggerElement.id  +']');
                        if (c  && c.tooltip)
                            tip.update(c.tooltip);
                        else
                            return false;
                    }
                }
            });
        });
    }
});



// MEnu con toolTips 

Ext.define('ProtoUL.ux.protoMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.protoMenu',

    afterRender: function() {
        this.superclass.afterRender.apply(this, arguments);

        var menu = this;
        this.tip = new Ext.ToolTip({
            target: this.getEl().getAttribute('id'),
            renderTo: document.body,
            trackMouse: true,
            delegate: '.x-menu-item',
            title: '',
            listeners: {
                beforeshow: function(tip) {
                    var c = menu.activeItem.initialConfig; 
                    if ( c  && c.qtip) {
                        tip.setTitle(c.text);
                        tip.update(c.qtip);
                        // tip.body.dom.innerHTML = mi.qtip;
                        // tip.header.dom.firstChild.innerHTML = mi.qtitle;;
                    } else {
                        tip.update(c.text);
                        // Este return causa q si entra por elto q no tiene ttip 
                        // de ahi en adelante no se muestran hasta volver a entrar al elto  Dgt12/06
                        // return false ;
                    }
                    
                }
                
            }
        });
    }
});

