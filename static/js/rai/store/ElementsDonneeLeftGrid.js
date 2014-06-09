/**
 * @author Giovanni Victorette
 */

Ext.define('RAI.store.ElementsDonneeLeftGrid', {
    extend: 'Ext.data.Store',

    requires: ['RAI.model.ElementDonnee', 'Ext.data.proxy.Memory', 'Ext.data.reader.Json'],

    sorters: ['attributeName', 'entityName'],
    groupField: 'entityName',
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'RAI.model.ElementDonnee',
            storeId: 'ElementsDonneeLGStore',
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});