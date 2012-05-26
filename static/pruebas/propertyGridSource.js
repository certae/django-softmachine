
Ext.define('Ext.grid.property.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.propertygrid',
    alternateClassName: 'Ext.grid.PropertyGrid',

    // Setea directamente las propiedades de la grilla            
    valueField: 'value',
    nameField: 'name',
    enableColumnMove: false,
    columnLines: true,
    stripeRows: true,
    trackMouseOver: false,
    clicksToEdit: 1,
    enableHdMenu: false,

    
    initComponent: function () {
        var me = this;
        me.addCls(Ext.baseCSSPrefix + 'property-grid');

        me.plugins = me.plugins || [];

        me.plugins.push(new Ext.grid.plugin.CellEditing({
            clicksToEdit: me.clicksToEdit,
            startEdit: function (record, column) {
                return this.self.prototype.startEdit.call(this, record, me.headerCt.child('#' + me.valueField));
            }
        }));

        me.selModel = {
            selType: 'cellmodel',
            onCellSelect: function (position) {
                if (position.column != 1) {
                    position.column = 1;
                }
                return this.self.prototype.onCellSelect.call(this, position);
            }
        };
        me.customRenderers = me.customRenderers || {};
        me.customEditors = me.customEditors || {};
        if (!me.store) {
            me.propStore = me.store = new Ext.grid.property.Store(me, me.source);
        }
        if (me.sortableColumns) {
            me.store.sort('name', 'ASC');
        }

        me.columns = new Ext.grid.property.HeaderContainer(me, me.store);
        me.addEvents('beforepropertychange', 'propertychange');
        me.callParent();
        me.getView().walkCells = this.walkCells;

        me.editors = {
            'date': new Ext.grid.CellEditor({
                field: new Ext.form.field.Date({
                    selectOnFocus: true
                })
            }),
            'string': new Ext.grid.CellEditor({
                field: new Ext.form.field.Text({
                    selectOnFocus: true
                })
            }),
            'number': new Ext.grid.CellEditor({
                field: new Ext.form.field.Number({
                    selectOnFocus: true
                })
            }),
            'boolean': new Ext.grid.CellEditor({
                field: new Ext.form.field.ComboBox({
                    editable: false,
                    store: [
                        [true, me.headerCt.trueText],
                        [false, me.headerCt.falseText]
                    ]
                })
            })
        };
        me.store.on('update', me.onUpdate, me);
    },
    
    onUpdate: function (store, record, operation) {
        var me = this,
            v, oldValue;
        if (me.rendered && operation == Ext.data.Model.EDIT) {
            v = record.get(me.valueField);
            oldValue = record.modified.value;
            if (me.fireEvent('beforepropertychange', me.source, record.getId(), v, oldValue) !== false) {
                if (me.source) {
                    me.source[record.getId()] = v;
                }
                record.commit();
                me.fireEvent('propertychange', me.source, record.getId(), v, oldValue);
            } else {
                record.reject();
            }
        }
    },
    walkCells: function (pos, direction, e, preventWrap, verifierFn, scope) {
        if (direction == 'left') {
            direction = 'up';
        } else if (direction == 'right') {
            direction = 'down';
        }
        pos = Ext.view.Table.prototype.walkCells.call(this, pos, direction, e, preventWrap, verifierFn, scope);
        if (!pos.column) {
            pos.column = 1;
        }
        return pos;
    },
    
    getCellEditor: function (record, column) {
        var me = this,
            propName = record.get(me.nameField),
            val = record.get(me.valueField),
            editor = me.customEditors[propName];
        if (editor) {
            if (!(editor instanceof Ext.grid.CellEditor)) {
                if (!(editor instanceof Ext.form.field.Base)) {
                    editor = Ext.ComponentManager.create(editor, 'textfield');
                }
                editor = me.customEditors[propName] = new Ext.grid.CellEditor({
                    field: editor
                });
            }
        } else if (Ext.isDate(val)) {
            editor = me.editors.date;
        } else if (Ext.isNumber(val)) {
            editor = me.editors.number;
        } else if (Ext.isBoolean(val)) {
            editor = me.editors['boolean'];
        } else {
            editor = me.editors.string;
        }
        editor.editorId = propName;
        return editor;
    },
    
    beforeDestroy: function () {
        var me = this;
        me.callParent();
        me.destroyEditors(me.editors);
        me.destroyEditors(me.customEditors);
        delete me.source;
    },
    destroyEditors: function (editors) {
        for (var ed in editors) {
            if (editors.hasOwnProperty(ed)) {
                Ext.destroy(editors[ed]);
            }
        }
    },
    setSource: function (source) {
        this.source = source;
        this.propStore.setSource(source);
    },
    getSource: function () {
        return this.propStore.getSource();
    },
    setProperty: function (prop, value, create) {
        this.propStore.setValue(prop, value, create);
    },
    removeProperty: function (prop) {
        this.propStore.remove(prop);
    }
});