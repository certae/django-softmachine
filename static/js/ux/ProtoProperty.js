/*
 *  @Author : Dario Gomez T.  /  Certae Universite Laval Quebec  
 *   
 *  Enhanced PopertyGrid,  
 *      comboProperties  
 *      editMode   ( True/ False )
 *      QTips 
  */

Ext.define('ProtoUL.ux.ProtoProperty' ,{
    extend: 'Ext.grid.property.Grid',
    alias : 'widget.protoProperty',

    //@source
    source : {}, 
    
    //@ 
    readOnlyProps : [],   

    //@  True / False 
    editMode : true,   


    //@ definition {  prpName : '' , ...  } ;
    //@ TODO:  definition {  prpName : { qTitle : '', qTip : '', 'type' : 'overwirte default type!! ' }, ...  }   
    sourceInfo : {}, 

    initComponent: function() {
        
        var me = this
        
        Ext.apply(this, {
            stripeRows: true ,
            clicksToEdit : 2, 
            source : this.source, 
            listeners: {
                'beforeedit': function(  editor,  e,  eOpts ){
                    if ( (! me.editMode ) || e.record.data.name in oc( me.readOnlyProps ))  {
                        return false; 
                    } 
                },
                'itemmouseenter': function(view, record, item) {
                    var prpName = record.get( 'name' )
                    var msg =  me.sourceInfo[ prpName ]
                    if ( prpName && prpName  in oc( me.readOnlyProps ) ) prpName += ' [RO]' 
                    if ( msg ) {
                        Ext.fly(item).set({'data-qtip': msg, 'data-qtitle': prpName }); 
                    } 
              }, scope : me 
            }
        });        
        
        this.callParent(arguments);
        
        
    }, 
    
    setCombos: function( __ptCombos ) {
        if ( ! __ptCombos ) return 
        
        var customEditors = {}
        
        // Recorre los objetos y busca la definicion de combos 
        for (var prp in __ptCombos ) {
            var l1 = __ptCombos[prp]
            if ( typeOf( l1 ) == 'array' ) {

                customEditors[ prp ] =  new Ext.grid.CellEditor({
                    field: new Ext.form.field.ComboBox({
                    editable: false,
                    store: l1  
                    })
                })
            } 
            
        }
        
        this.customEditors = customEditors;
    } 
    
})
