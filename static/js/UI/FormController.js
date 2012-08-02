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
    
    // Required if linked,  optional if zoom 
    myMeta : null, 


    _newWindow: function () {

        this.myForm = Ext.widget('protoform', {
            myMeta : this.myMeta  
        });  

        
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

    openLinkedForm: function ( myRecord, isReadOnly )   {
        
        this._newWindow(); 

        // Verifica la edicion  
        if ( myRecord   ) {
            this.myForm.setActiveRecord( myRecord );
        }
        
        if ( isReadOnly ) {
            this.myForm.setFormReadOnly( true );
            this.myWin.tools = [{
                type: 'readOnly',
                tooltip: 'readOnly' 
            }] 
            this.myWin.addTools()

            
        } else {
            this.myForm.setReadOnlyFields( true, this.myMeta.gridConfig.readOnlyFields );            
            
        }
        
        this.myForm.linked = true; 
        this.myWin.show();
        
    }, 
    

    openZoomForm: function ( myZoomModel, myRecordId , me )   {

        if ( ! getFormDefinition( myZoomModel ) ) {
            errorMessage( 'Form', myZoomModel + ': protoDefinition not found')
        }

        function getFormDefinition( myZoomModel ) {
             
            me.protoOption = myZoomModel             
            me.myMeta = _cllPCI[ me.protoOption ] ;
                
            if ( ! loadPci( me.protoOption, false ) ) return false 

            // Filter 
            var myFilter = '{"pk" : ' +  myRecordId + ',}'
    
            var storeDefinition =  {
                protoOption : me.protoOption, 
                autoLoad: true, 
                baseFilter: myFilter, 
                sProtoMeta  : getSafeMeta( myMeta )    
            };
    
            var myStore = getStoreDefinition( storeDefinition )
            myStore.load();
            
            myStore.on({
                'load' :  function(store,records, successful, options) {

                    me._newWindow();    
                    me.myForm.setActiveRecord( records[0] );
                    me.myForm.setReadOnlyFields( true, me.myMeta.gridConfig.readOnlyFields );            
                }, 
                scope: me }
            );


            return true                    
        }


    }      
          
     
      
 }
)
