/**
 * @class ProtoUL.ux.FormController
 * @author  Dario Gomez 

 * Helper class for intancing ProtoForm 
 */


/* 
 * Parameters 
    
    @myMeta 
     
 */

Ext.define('ProtoUL.UI.FormControler', {
    extend: 'Ext.Component',
    // requires: [ 'ProtoUL.view.ProtoForm' ],

    initComponent: function( ) { 

        this.myForm = Ext.widget('protoform', {
            myMeta : this.myMeta  
        });  

        this.callParent();
     }, 
  
    _newWindow: function () {
        
        this.myWin  = Ext.widget('window', {
            constrain: true, 
            title : this.myMeta.description,
            closeAction: 'hide',
            width: 600,
            height: 400,
            minHeight: 400,
            minWidth: 400,
            layout: 'fit',
            resizable: true,
            modal: true,
            items: this.myForm
        });

    },

    newEditionForm: function ( myRecord, isReadOnly )   {
        
        this._newWindow(); 

        // Verifica la edicion  
        if ( myRecord   ) {
            this.myForm.setActiveRecord( myRecord );
        }
        
        if ( isReadOnly ) {
            this.myForm.setFormReadOnly( true );
        } else {
            this.myForm.setReadOnlyFields( true, this.myMeta.gridConfig.readOnlyFields );
        }
        
        this.myWin.show();
        
    }      
     
      
 }
)
