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



