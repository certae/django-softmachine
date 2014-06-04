/**
 * @author Giovanni Victorette
 */
Ext.define('RAI.model.Raccordement', {
    extend: 'Ext.data.Model',
    fields: ['id', 'sourceId', 'sourceName', 'targetId', 'targetName', 'modelId', 'modelName']
});