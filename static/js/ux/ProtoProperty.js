/*
 *  @Author : Dario Gomez T.  /  Certae Universite Laval Quebec  
 *   
 *  Enhanced PopertyGrid,  
 *      comboProperties  
 *      editable   ( True/ False )
 *      QTips
 *      Types  
 * 
 *  TODO:  OnKey Delete  borrar el valor de la propiedad  
  */

Ext.define('ProtoUL.ux.ProtoProperty' ,{
    extend: 'Ext.grid.property.Grid',
    alias : 'widget.protoProperty',

    source : {}, 
    readOnlyProps : [],   
    editable : true,   
    sourceInfo : {}, 

    initComponent: function() {
		var me = this;
        Ext.apply(this, {
            stripeRows: true ,
            clicksToEdit : 2, 
            source : this.source, 
            listeners: {
                'beforeedit': function(  editor,  e,  eOpts ){
                    if ( (! me.editable ) || e.record.data.name in _SM.objConv( me.readOnlyProps ))  {
                        return false; 
                    } 
                },
                'itemmouseenter': function(view, record, item) {
					var prpName = record.get('name');
					var msg = me.sourceInfo[prpName];
					if (prpName && prpName in _SM.objConv(me.readOnlyProps)) {
						prpName += ' [RO]';
					}
                    if ( msg ) {
						Ext.fly(item).set({
							'data-qtip' : msg,
							'data-qtitle' : prpName
						});
                    } 
				},
				scope : me
            }
        });        
        
        this.callParent(arguments);
    }, 
    
    setCombos: function( __ptCombos ) {
		if (!__ptCombos) {
			return;
		}

        // Recorre los objetos y busca la definicion de combos 
        for (var prp in __ptCombos ) {
            // Si ya existe continua ( los objetos no deben tener el mismo nombre )
			if (this.customEditors[prp]) {
				continue;
			}
            
			var l1 = __ptCombos[prp];
			;
            if ( _SM.typeOf( l1 ) == 'array' ) {

                this.customEditors[ prp ] =  new Ext.grid.CellEditor({
                    field: new Ext.form.field.ComboBox({
                    editable: false,
                    store: l1  
                    })
				});
            } 
        }
        
    }, 

    setTypes: function( __ptTypes ) {
		if (!__ptTypes) {
			return;
		}

        // La idea es generar un customEditor para los campos definidos, 
        // copiando el editor que define por defecto el objeto 
        // Debe definirse despues de los combos pues la definicion de combo resetea customEditor
   
        // Recorre los objetos y busca la definicion de typo 
        for (var prp in __ptTypes ) {

            // Si ya existe continua              
			if (this.customEditors[prp]) {
				continue;
			}
            // Los tipos definidos son :  'date','string', 'number', 'boolean'
			var myType = __ptTypes[prp];
			var myEditor = this.editors[myType];
			if (myEditor) {
				this.customEditors[prp] = myEditor;
        }
    } 
	}
});
