/**
 * @author Giovanni Victorette
 */

Ext.define('ProtoUL.view.diagram.TableContextMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.tablecontextmenu',

    figure: null,

    itemId: 'tablecontextmenu',
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                text: 'Add hybrid port',
                handler: function() {
                	if (typeof this.ownerCt.figure.parent.parent !== "undefined") {
						var header = this.ownerCt.figure.parent.parent;
						header.createPort("hybrid", new draw2d.layout.locator.TopLocator(header));
					}
                }
            }, {
                text: 'Delete',
                handler: function() {
                    if (typeof this.ownerCt.figure.parent.parent !== "undefined") {
						var header = this.ownerCt.figure.parent.parent;
						header.createPort("hybrid", new draw2d.layout.locator.BottomLocator(header));
					}
                }
            }]
        });
        me.callParent(arguments);
    },

    getFigure: function() {
        return this.figure;
    }
}); 