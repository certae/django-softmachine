Ext.require([
    'Ext.button.Button',
    'Ext.grid.property.Grid'
]);

Ext.onReady(function(){
    // simulate updating the grid data via a button click
    Ext.create('Ext.button.Button', {
        renderTo: 'button-container',
        text: 'Update source',
        handler: function(){
            propsGrid.setSource({
                '(name)': 'Property Grid',
                grouping: false,
                autoFitColumns: true,
                productionQuality: true,
                created: new Date(),
                tested: false,
                version: 0.8,
                borderWidth: 2
            });
        }
    });
    
    var propsGrid = Ext.create('Ext.grid.property.Grid', {
        width: 300,
        renderTo: 'grid-container',
        propertyNames: {
            tested: 'QA',
            borderWidth: 'Border Width'
        },
        source: {
            "(name)": "Properties Grid",
            "grouping": false,
            "autoFitColumns": true,
            "productionQuality": false,
            "created": Ext.Date.parse('10/15/2006', 'm/d/Y'),
            "tested": false,
            "version": 0.01,
            "borderWidth": 1
        }
    });
});


//
var grid = new Ext.grid.property.Grid({

    // Custom editors for certain property names
    customEditors: {
        evtStart: Ext.create('Ext.form.TimeField', {selectOnFocus:true})
    },

    // Displayed name for property names in the source
    propertyNames: {
        evtStart: 'Start Time'
    },

    // Data object containing properties to edit
    source: {
        evtStart: '10:00 AM'
    }
});


//  Agregar un Combo 

Ext.onReady(function(){
    var comboCategory = new Ext.form.ComboBox({
        fieldLabel    : 'Category',
        name        : 'category',
        allowBlank     : false,
        store        : ['Business', 'Personal'],
        typeAhead    : true,
        mode        : 'local',
        triggerAction    : 'all',
        emptyText    :'-- Select category --',
        selectOnFocus    :true
   });

   var active = new Ext.form.Checkbox({
     name        : 'active',
     fieldLabel : 'Active',
     checked    : true,
     inputValue : '1'
   });

   var propsGrid = new Ext.grid.PropertyGrid({
        el:'props-grid',
        nameText: 'Properties Grid',
        width:300,
        autoHeight:true,
        viewConfig : {
            forceFit:    true,
            scrollOffset:    2 // the grid will never have scrollbars
        },
        customEditors: {
            'Category': new Ext.grid.GridEditor(comboCategory),
            'Active'  : new Ext.grid.GridEditor(active)
        }
    });

    propsGrid.render();
    
    propsGrid.setSource({
        "(name)": "Properties Grid11",
        "grouping": false,
        "autoFitColumns": true,
        "productionQuality": false,
        "created": new Date(Date.parse('10/15/2006')),
        "tested": false,
        "version": 0.01,
        "borderWidth": 1,
        "Category": 'Personal',
    "Active" : true
    });
});



// --------------------


Ext.require([
            'Ext.button.Button',
            'Ext.grid.property.Grid'
        ]);

        Ext.onReady(function(){
            // simulate updating the grid data via a button click
            
            var Unit = Ext.create('Ext.data.Store', {
    fields: ['abbr', 'name'],
    data : [
        {"abbr":"AUstralian", "name":"AUD"},
        {"abbr":"Canadian", "name":"CND"},
        {"abbr":"Europe", "name":"EUR"},
        {"abbr":"british", "name":"GBP"},
        {"abbr":"indian", "name":"INR"},
        {"abbr":"united", "name":"USD"}
        //...
    ]
});


            var Scale = Ext.create('Ext.data.Store', {
                fields: ['abbr', 'name'],
                data : [
                    {"abbr":"AUstralian", "name":"actual"},
                    {"abbr":"Canadian", "name":"crore"},
                    {"abbr":"Europe", "name":"hundred"},
                    {"abbr":"british", "name":"lakh"},
                    {"abbr":"indian", "name":"million"},
                    {"abbr":"united", "name":"thousand"}
                    //...
                ]
            });
            
            var propsGrid = Ext.create('Ext.grid.property.Grid', {
                width: 300,
                renderTo: 'grid-example',
                customEditors: {
                    Unit: Ext.create('Ext.form.ComboBox', {                       
                        store: Unit,
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'abbr'
                        
                    }),
                    Scale: Ext.create('Ext.form.ComboBox', {                                         
                        store: Scale,
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'abbr'
                        
                    })
                },

                            
                source: {
                    "Name": "Properties Grid",
                    "(ID)": 'id',
                    "Type": true,
                    "SubGroup": false,
                    "PeriodType": Ext.Date.parse('10/15/2006', 'm/d/Y'),
                    "Balance": false,
                    "abstract": 0.01,
                    "Nullable": 1,
                    "Unit": 'USD',
                    "Scale":'actual'

                }
            });
        });
        


/// --------------------

var grid = new Ext.grid.PropertyGrid({
    id: 'propGrid',
    title: false,
    propertyNames: {
        appId: 'Application Id',
        env: 'Environment'
    },
    source: {},
    customEditors: {
        'env': new Ext.grid.GridEditor(new Ext.form.ComboBox({
            store: new Ext.data.JsonStore({
                id: 'combo',
                root: 'data',
                fields: [{
                    name: 'env',
                    mapping: 'env'
                }],
                proxy: new Ext.data.ScriptTagProxy({
                    url: 'getComboData.jsp'
                })
            }),
            triggerAction: 'all',
            editable: false,
            allowBlank: false
        }), {}),
        'appId': new Ext.grid.GridEditor(new Ext.form.TextField({
            disabled: true
        }), {})
    }
});

var propertyStore = new Ext.data.JsonStore({
    autoLoad: true,
    url: 'getPropData.jsp',
    root: 'data ',
    fields: ['appId ', 'env '],
    listeners: {
        load: {
            fn: function (store, records, options) {
                var propGrid = Ext.getCmp('propGrid ');
                if (propGrid) {
                    propGrid.setSource(store.getAt(0).data);
                }
            }
        }
    }
});


///  ----  EDitor dinamico 

   var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', { 
        clicksToEdit: 1 
    }); 

    var itemField={ 
        xtype: 'combobox', 
        typeAhead: true, 
        triggerAction: 'all', 
        selectOnTab: true, 
        store: [ 
            ['dur','Duration/ms'] 
        ], 
        lazyRender: true, 
        listClass: 'x-combo-list-small' 
    }; 

    var gridCfg={ 
        xtype:'grid', 
        id: 'cfgGrid', 
        store: store, 
        selModel: { 
            selType: 'cellmodel' 
        }, 
        columns: [{ 
            header: 'Item', 
            dataIndex: 'thitem', 
            field: itemField, 
            custFields: { 
                0:{xtype:'textfield'} 
            } 
        },{ 
            text: 'Current Value', 
            dataIndex: 'thcurr' 
        },{ 
            header: 'Lower Limit', 
            dataIndex: 'thlow', 
            field: { 
                xtype: 'numberfield', 
                allowBlank: false, 
                minValue: 0, 
                maxValue: 100000 
            }, 
            custFields: { 
                1:{xtype:'textfield'} 
            } 
        },{ 
            header: 'Upper Limit', 
            dataIndex: 'thhigh', 
            field: { 
                xtype: 'numberfield', 
                allowBlank: false, 
                minValue: 0, 
                maxValue: 100000 
            }, 
            custFields: { 
                1:{xtype:'textfield'} 
            } 
        }], 
        listeners:{ 
            afterrender:function(g,options) { 
                g.store.load(); 
                //save default column editors 
                g.origFields=Ext.create('Ext.util.MixedCollection'); 
                for (var c in g.columns) g.origFields.add(g.columns[c].id,g.columns[c].field); 
            }, 
            
            beforeitemmouseup:function(view, rec, item, rowIndex, e, options){ 
              var g=this, 
                  selModel=g.view.getSelectionModel(), 
                  pos = selModel.getCurrentPosition();//{row:0,column:0} 
              if (pos===null) return true;//it happens 
               
              var c = g.headerCt.getHeaderAtIndex(pos.column), 
                  currField=c.field,//the field currently applied to column 
                  origField=g.origFields.getByKey(c.id);//the default field configured on column 
              if (!currField) return true; 
               
              //overriden field for apropriate row in column               
              var custField=(c.custFields && c.custFields[pos.row]) ? c.custFields[pos.row] : false; 
               
              if (custField) { 
                  if (!Ext.isDefined(custField.id) || (currField.id!=custField.id) )
                   {//if custFields/{xtype:textfield} - we don't have an ID yet 
                      g.editingPlugin.editors.removeAtKey(c.id); 
                      g.editingPlugin.setColumnField(c,custField); 
                  } 
              } else {//reset to default field (if not yet the one) 
                  if (currField.id!=origField.id && origField) { 
                      g.editingPlugin.editors.removeAtKey(c.id); 
                      g.editingPlugin.setColumnField(c,origField); 
                  } 
              } 
          }  
        } 
    };  
    

//--  Remplzar el editor en  RowMode 


Ext.onReady(winMain);
function winMain()
{
   var modelName = 'Type';
   var fields = ['code', 'desc'];
   var rows = [['NUMBER', 'Number'], ['DATE', 'Date'], ['TEXT', 'Text']];
   
   Ext.regModel(modelName, {fields:fields, idProperty:'code'});

   var myReader = new Ext.data.ArrayReader({model:modelName});
   var cboxStore = new Ext.data.Store({storeId:'typeStore',
                                       model:modelName,
                                       autoLoad:true,
                                       data:rows,
                                       proxy:{type:'memory', reader:myReader}});


   var gModelName = 'Value';
   var gFields = ['my_type', 'my_value'];
   var gRows = [['NUMBER', 500],
                ['DATE', "08/18/2011"],
                ['TEXT', 'hello world']];
   Ext.regModel(gModelName, {fields:gFields, idProperty:'code'});
   var gMyReader = new Ext.data.ArrayReader({model:gModelName});
   var gridStore = new Ext.data.Store({model:gModelName,
                                       autoLoad:true,
                                       data:gRows,
                                       proxy:{type:'memory', reader:gMyReader}});


   var rowEditing = Ext.create(
      'Ext.ux.grid.plugin.RowEditing',
      {pluginId:'rowEditing',
       errorSummary:false,
       clicksToMoveEditor:1,
       autoCancel:false,
       listeners:
       {beforeedit: function(context) {
           setupMyValueEditor(context.record.get('my_type'), false);
        }
       }
      });


   var cols = 
      [
         {header:"Type", dataIndex:"my_type", flex:1,
          renderer:renderMyType,
          editor:{xtype:'combobox',
                  displayField:'desc',
                  valueField:'code',
                  queryMode:'local',
                  typeAhead:true,
                  triggerAction: 'all',
                  selectOnFocus:true,
                  forceSelection:true,
                  store:cboxStore,
                  listeners:{change:function(cbox, newValue, oldValue) {
                                setupMyValueEditor(newValue, true); }
                            }
                 }
         },
         {header:"Value", dataIndex:"my_value", flex:1,
          editor:{xtype:'displayfield'},
          editors:{NUMBER:{xtype:'numberfield'},
                   DATE:{xtype:'datefield', allowBlank:false},
                   TEXT:{xtype:'textfield', allowBlank:false, maxLength:20}
                  },
         }
      ];

   var vp = new Ext.Viewport(
      {
         items:
         {xtype:'grid',
          id:'grid',
          width:400,
          height:200,
          columns:cols,
          store:gridStore,
          plugins:[rowEditing],
         }
      });
}

function setupMyValueEditor(key, clearField)
{              
   var g = Ext.getCmp('grid'); 
   var myValueColumnIndex = 1;
   var c = g.headerCt.getHeaderAtIndex(myValueColumnIndex);
   g.editingPlugin.editor.removeField(myValueColumnIndex);
   c.field.destroy();
   delete c.field;
   c.editor = c.editors[key];
   g.editingPlugin.editor.setField(c);
   if (clearField)
   {
      var f = g.editingPlugin.editor.getEditor(myValueColumnIndex);
      f.setValue('');
   }
   return true;
}

function renderMyType(value, cell, rec)
{
   var store = Ext.data.StoreManager.lookup('typeStore');
   var rec = store.getById(value);
   return rec ? rec.get('desc') : '';
}


// because 4.0.2a has bug (calls removeKey instead of removeAtKey)
Ext.override(Ext.grid.RowEditor,
{
    removeField: function(field) {
        var me = this;

        // Incase we pass a column instead, which is fine
        field = me.getEditor(field);
        me.mun(field, 'validitychange', me.onValidityChange, me);

        // Remove field/column from our mapping, which will fire the event to
        // remove the field from our container
        me.columns.removeAtKey(field.id);
    }
});


//------------------------------------------------------------------



// CSS para WorWrap
// 
// 
// .x-property-grid .x-grid-row .x-grid-property-name .x-grid-cell-inner {
    // white-space: normal;
// }
// 
// .x-property-grid .x-grid-row .x-grid-property-name .x-grid-cell-inner,
// .x-property-grid .x-grid-row-over .x-grid-property-name .x-grid-cell-inner {
    // background-image: none;
// }
// 
// .x-property-grid .x-grid-row .x-grid-property-name,
// .x-property-grid .x-grid-row-over .x-grid-property-name
// {
    // background-position: -16px 1px;
    // background-image: url("http://dev.sencha.com/deploy/ext-4.1.0-gpl/resources/themes/images/default/grid/property-cell-bg.gif");
    // background-repeat: repeat-y;
// }
// 

//  ---------------------------------------------


 // Agregar un textArea 
// http://jsfiddle.net/o_nix/pLYt3/2/

Ext.require(['*']);

Ext.onReady(function(){
    var propsGrid = Ext.create('Ext.grid.property.Grid', {
        hideHeaders: true,
        width: 300,
        tbar: [
            '->',
            {text: 'Edit', width: 75}
        ],
        sortableColumns: false,
        source: {
            "Title": "A Reason for Spelling (Level B): Teacher's Guidebook",
            "grouping": false,
            "autoFitColumns": true,
            "productionQuality": false,
            "created": Ext.Date.parse('10/15/2006', 'm/d/Y'),
            "tested": false,
            "version": 0.01,
            "borderWidth": 1
        },
        customEditors: {
            Title: Ext.create('Ext.form.field.TextArea', {
                selectOnFocus: true,
                height: 50
            })
        }
    });
    
    var thePanel = Ext.create('Ext.panel.Panel', {
        title: 'Record Details',
        width: 800,
        items: [propsGrid],
        layout: {
            type: 'hbox'
        },
        renderTo: Ext.getBody()
    });
});​

