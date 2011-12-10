/* 
 *Usage

Add the plugin file to your JavaScript sources: VarHeaders.js
Add the plugin alias "varheaders to the "plugins" config option of your grid.
In your grid's column configuration, add config options "shortText" and/or "longText", for example
 Ext.create('Ext.grid.Panel', {
    plugins: [ 'varheaders' ], // Can be "plugins: 'varheaders'" if this is the only plugin
    columns: [
        {
            text     : 'Part No',
            shortText: 'P/N',          // <--- Config options evaluated
            longText : 'Part Number',  //      by VarHeaders plugin
            dataIndex: 'partNo'
        },
        // more columns
    ],
    // other grid config options
});
 
 */


(function() {

    /**
     * @class Ext.ux.grid.VarHeaders
     *
     * Plugin for GridPanel that enables configuration of three different headers which are shown depending on the available column width:
     * longText, text, shortText.
     *
     * Plugin alias is 'varheaders' (use "plugins: 'varheaders'" in GridPanel config).
     *
     * @author <a href="mailto:stephen.friedrich@fortis-it.de">Stephen Friedrich</a>
     * @author <a href="mailto:fabian.urban@fortis-it.de">Fabian Urban</a>
     *
     * @copyright (c) 2011 Fortis IT Services GmbH
     * @license Ext.ux.grid.VarHeaders is released under the
     * <a target="_blank" href="http://www.apache.org/licenses/LICENSE-2.0">Apache License, Version 2.0</a>.
     *
     */
    Ext.define('Ext.ux.grid.VarHeaders', {
                   alias: 'plugin.varheaders',

                   /**
                    * Called by plug-in system to initialize the plugin for a specific grid panel
                    */
                   init: function(grid) {
                       grid.on('afterrender',
                               function(){
                                    Ext.Array.forEach(grid.query('headercontainer'), this.initColumn, this);
                               },
                               this);
                   },

                   initColumn: function(column) {
                       this.addListeners(column);
                       this.updateColumnTextIfNeeded(column);
                   },

                   /**
                    * Attach listeners to a column for resize (update text), sort change (required width changes due to sort icon, so text
                    * might need to be updated, too) and add (new sub columns that also need to be listened to).
                    */
                   addListeners: function(headerCt) {
                       if (!headerCt.varHeadersListeners) {
                           headerCt.on('add', this.handleColumnAdded, this);
                           headerCt.on('columnresize', this.handleColumnHeaderResize, this);
                           headerCt.on('sortchange', this.handleColumnSortChange, this);

                           // Backup standard text value (headerCt.text changes when another text is set after resizing the column)
                           headerCt.normalText = headerCt.text;

                           // Set a flag, so that listeners aren't added twice (when columns are removed/added)
                           headerCt.varHeadersListeners = true;
                       }

                       return true;
                   },

                   handleColumnAdded: function(headerContainer, component, index) {
                       this.initColumn(component);
                   },

                   handleColumnHeaderResize: function(headerContainer, column, width) {
                       this.updateColumnTextIfNeeded(column);
                   },

                   handleColumnSortChange: function(headerContainer, column, direction) {
                       this.updateColumnTextIfNeeded(column);
                   },

                   /**
                    * Update the column's text to one of shortText, normalText (contains saved original text) and longText depending
                    * on current column width.
                    */
                   updateColumnTextIfNeeded: function(column) {
                       var textElement = column.textEl; // textEL is set via renderSelector in Ext.grid.column.Column)
                       if (!textElement) {
                           return;
                       }

                       var availableWidth = column.getWidth();
                       var columnEl = column.el;
                       var el = textElement;
                       while(true) {
                           availableWidth -= (el.getPadding('lr') + el.getMargin('lr') + el.getBorderWidth('lr'));
                           if(el == columnEl) {
                               break;
                           }
                           el = el.parent();
                       }

                       var newText = this.findMatchingText(availableWidth, textElement,
                                                           [column.longText, column.normalText, column.shortText]);
                       if (newText != column.text) {
                           column.setText(newText);
                       }
                   },

                   /**
                    * Returns the first text from "texts" array that is at most "availableWidth" wide when rendered with same CSS as
                    * "element". If no text matches the last non-null entry of "texts" is returned.
                    * null entries in the "texts" array are skipped.
                    */
                   findMatchingText: function(availableWidth, element, texts) {
                       var newText = null;
                       for(var i = 0, length = texts.length; i < length; ++i) {
                           var text = texts[i];
                           if(!text) {
                               continue;
                           }
                           newText = text;
                           var width = Ext.util.TextMetrics.measure(element, text).width;
                           if(width <= availableWidth) {
                               break;
                           }
                       }
                       return newText;
                   }
               });
})();

////  Forma de USO 


(function() {

    Ext.define('app.widgets.PartGrid', {
                   extend: 'Ext.grid.Panel',
                   requires: ['Ext.window.MessageBox'],

                   constructor: function(config) {
                       config = config || {};

                       var gridData = [
                           ['332-125-875-2', 'FA29643', 'FAN FRAME', 56, 'Small dent on lower left'],
                           ['23554368H2654', '4711', 'CSD OIL COOLER', 2, 'Time Since New: 8!'],
                           ['889:33:1232', '0815', 'TURBINE CLEARANCE VALVE', 13, ''],
                           ['AAH-45628915', 'TM0397', 'FUEL PUMP', 72, ''],
                           ['61-35088-776', '987654', 'BLADE LOCKING', 19, '']
                       ];

                       var store = Ext.create('Ext.data.ArrayStore', {
                                                  fields: [
                                                      'partNo',
                                                      'serialNo',
                                                      'description',
                                                      'storageBox',
                                                      'remark'
                                                  ],
                                                  data: gridData
                                              });

                       this.serialNoColumn = {
                           id          : 'serialNoColumn',
                           text        : 'Serial No',
                           shortText   : 'S/N',
                           longText    : 'Serial Number',
                           sortable    : true,
                           dataIndex   : 'serialNo',
                           menuDisabled: true,
                           width: 100
                       };

                       this.remarkColumn = {
                           id       : 'remarkColumn',
                           text     : 'Remark',
                           flex     : 1,
                           sortable : true,
                           dataIndex: 'remark',
                           menuDisabled: true
                       };

                       var columns = [
                           {
                               id: 'engineInfoColumn',
                               text: 'Engine Part Information',
                               shortText: 'Part Information',
                               menuDisabled: true,
                               columns: [
                                   {
                                       id: 'partNoColumn',
                                       text     : 'Part No',
                                       shortText: 'P/N',
                                       longText : 'Part Number',
                                       sortable : true,
                                       dataIndex: 'partNo',
                                       menuDisabled: true,
                                       width: 100
                                   },
                                   {
                                       id: 'descriptionColumn',
                                       text  : 'Description',
                                       shortText  : 'Desc',
                                       longText: 'Manufacturer Description',
                                       sortable : true,
                                       dataIndex: 'description',
                                       menuDisabled: true,
                                       width: 100
                                   }
                               ]
                           },
                           {
                               id: 'storageBoxColumn',
                               text     : 'Storage Box',
                               shortText: 'Box',
                               flex     : 1,
                               sortable : true,
                               dataIndex: 'storageBox',
                               menuDisabled: true,
                               renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                                   var foo = 42;
                                   return value;
                               }
                           }
                       ];

                       var defaultConfig = {
                           store: store,
                           columnLines: true,
                           columns: columns,
                           height: 220,
                           width: 450,
                           title: 'Part Grid',
                           plugins: 'varheaders',
                           viewConfig: {
                               stripeRows: true
                           },
                           bbar: [
                               {
                                   text: 'Show/Hide Details',
                                   handler: function() {
                                       if (this.query('#serialNoColumn').length) {
                                           // Workaround: Hide columns before removing them.
                                           // See http://www.sencha.com/forum/showthread.php?130611-B3-Grid-headers-broken-after-removing-columns
                                           Ext.getCmp('remarkColumn').hide();
                                           Ext.getCmp('serialNoColumn').hide();
                                           this.removeChildById('serialNoColumn');
                                           this.removeChildById('remarkColumn');
                                       }
                                       else {
                                           this.insertChildAfter(this.headerCt, 'partNoColumn', this.serialNoColumn);
                                           this.insertChildAfter(this.headerCt, 'storageBoxColumn', this.remarkColumn);
                                       }
                                       this.view.refresh();
                                   },
                                   scope: this
                               }
                           ]
                       };

                       Ext.applyIf(config, defaultConfig);
                       //this.callParent(config);
                       app.widgets.PartGrid.superclass.constructor.call(this, config);
                   },

                   removeChildById: function(id) {
                       var child = this.query('#' + id + '')[0];
                       child.ownerCt.remove(child, true);
                   },

                   insertChildAfter: function(container, existingComponentId, newComponent) {
                       var items = container.items;
                       for (var i = 0, length = items.length; i < length; ++i) {
                           var item = items.getAt(i);
                           if (item.id == existingComponentId) {
                               container.insert(i + 1, newComponent);
                               return;
                           }
                           else if (item.items) {
                               this.insertChildAfter(item, existingComponentId, newComponent);
                           }
                       }
                   }

               });

})();
