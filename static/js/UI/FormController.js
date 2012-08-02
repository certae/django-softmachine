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

    initComponent: function() {
        var me = this
        this.callParent(arguments);
    }, 


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
        
        this.myWin.show();
        
    }, 
    

    openZoomForm: function ( myZoomModel, myRecordId  )   {

        var me  = this 

        if ( ! getFormDefinition( myZoomModel ) ) {
            errorMessage( 'Form', myZoomModel + ': protoDefinition not found')
        }

        function getFormDefinition( myZoomModel ) {
             
            me.protoOption = myZoomModel
            
            // Opciones del llamado AJAX 
            var options = {
                scope: me, 
                success: function ( obj, result, request ) {
                    loadZoomData()
                },
                failure: function ( obj, result, request) { 
                    return false;  
                }
            }

            if (  loadPci( me.protoOption , true, options ) ) {
                    loadZoomData()
            }
            
            return true                    
        }; 
        
        function loadZoomData() {
            me.myMeta = _cllPCI[ me.protoOption ] ;

            // Filter 
            var myFilter = '{"pk" : ' +  myRecordId + ',}'
    
            var storeDefinition =  {
                protoOption : me.protoOption, 
                autoLoad: true, 
                baseFilter: myFilter, 
                sProtoMeta  : getSafeMeta( me.myMeta )    
            };
    
            var myStore = getStoreDefinition( storeDefinition )
            myStore.load();
            
            myStore.on({
                'load' :  function(store,records, successful, options) {

                    // Fix:  Esta entrando dos veces  porq????
                    if ( me.myWin ) return 

                    // The form is now linked to  store  
                    me.openLinkedForm( records[0], true  )
                }, 
                scope: me }
            );
        }; 
        
    }      
      
 }
)
