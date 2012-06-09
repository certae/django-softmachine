/*
 *  @Author : Dario Gomez T.  /  Certae Universite Laval Quebec  
 *   
 *  Manejo de combos definidos en las propiedades  
 * 
  */

Ext.define('ProtoUL.ux.ProtoProperty' ,{
    extend: 'Ext.grid.property.Grid',
    alias : 'widget.protoProperty',

    initComponent: function() {
        
        Ext.apply(this, {
            stripeRows: true ,
            clicksToEdit : 2, 
            source : {}
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
