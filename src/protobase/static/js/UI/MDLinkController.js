/**
 * @class ProtoUL.ux.MDLinkController
 * @author  Dario Gomez

 * Helper class for control link behavior

 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */
/*global ProtoUL */
/*global getSimpleProperties */

Ext.define('ProtoUL.UI.MDLinkController', {
    extend: 'Ext.Base',

    masterRowData: null,
    masterId: -1,

    constructor: function(config) {
        Ext.apply(this, config || {});
    },

    setMasterData: function(masterRowData) {

        var me = this;
        me.masterRowData = masterRowData;

        if (!masterRowData) {
            me.masterId = -1;
        } else {
            me.masterId = masterRowData['id'];
        }

    },

    getDetailLink: function(detDefinition) {
        // after setMasterData

        var me = this, 
            detFilter, detTitle = '', masterTitleField = '', masterKey ;

        detDefinition.masterField = detDefinition.masterField || 'pk'; 
        if ( detDefinition.masterField === 'pk') {
            if ( ! me.masterId ) {
                me.masterId = -1;
            }
            masterKey = me.masterId; 
        } else {
            masterKey = me.masterRowData[ detDefinition.masterField ];
        }
        
        // Filter
        detFilter = [{
            "property": detDefinition.detailField,
            "filterStmt": masterKey
        }];

        // Title
        if (me.masterRowData) {
            masterTitleField = detDefinition.masterTitleField || '__str__';
            detTitle = me.masterRowData[masterTitleField];
        }

        // Return
        return {
            'detFilter': detFilter,
            'detTitle': detTitle
        };

    },

    setDetailDefaults: function(detDefinition, detFieldDict) {
        // after setMasterData

        var me = this, 
            nField, myDetField, myTitleField, masterTitleField;

        // nfield : campo en el detalle q apunta al maestro ( semanticKey )
        nField = detDefinition.detailField.replace(/__pk$/, '_id');
        myDetField = detFieldDict[nField];

        // parent key not found' puede ocurrir en detalles de mas de un nivel
        if (!myDetField) {
            return;
        }

        // Master Id
        myDetField['prpDefault'] = me.masterId;

        // Obtiene el titulo del filtro para heredarlo
        nField = detDefinition.masterTitleField || nField.replace(/_id$/, '');
        myTitleField = detFieldDict[nField];
        if (myTitleField) {
            masterTitleField = detDefinition.masterTitleField || '__str__';
            myTitleField['readOnly'] = true;

            if (me.masterRowData) {
                myTitleField['prpDefault'] = me.masterRowData[masterTitleField];
            } else {
                myTitleField['prpDefault'] = '?';
            }
        }
    }

});
