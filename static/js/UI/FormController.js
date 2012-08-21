/**
 * @class ProtoUL.ux.FormController
 * @author  Dario Gomez 

 * Helper class for intancing ProtoForm 

 */

Ext.define('ProtoUL.UI.FormControler', {
    extend: 'Ext.Base',

    // requires: [ 'ProtoUL.view.ProtoForm' ],
    // Required if linked,  retrived if zoom 
    myMeta : null, 

    // Entry point if zoom 
    protoOption : null, 

    // if ReadOnly 
    isReadOnly : false, 

    // Si la forma fue cargada correctamente  
    formLoaded : false, 
    
    // Win dimension 
    myWidth : 620, 
    myHeight : 460, 

    // initComponent: function() {
        // this.callParent(arguments);
    // }, 

    constructor: function (config) {
        Ext.apply(this, config || {});
    },
    
    _newWindow: function () {

        this.myForm = Ext.widget('protoform', {
            myMeta : this.myMeta  
        });  

        updateWinPosition( this.myWidth, this.myHeight )

        
        this.myWin  = Ext.widget('window', {
            // constrain: true, 
            title : this.myMeta.description,
            closeAction: 'hide',
            width: this.myWidth,
            height: this.myHeight,
            x : _winX, 
            y : _winY, 
            minHeight: 400,
            minWidth: 400,
            layout: 'fit',
            resizable: true,
            modal: true,
            items: this.myForm 
        });


        this.myForm.on({
            'close' :  function() {
                this.myWin.close()
            }, 
            'hide' :  function() {
                this.myWin.hide()
            }, 
            scope: this }
        );


    },

    openLinkedForm: function ( myRecord, isReadOnly )   {

        this.isReadOnly  = isReadOnly
        this._newWindow(); 

        // Verifica la edicion  
        if ( ! myRecord   ) {
            errorMessage( 'Form Error', 'no se definio registrode entrada')
            return 
        }

        this.myForm.setActiveRecord( myRecord );
        this.myForm.store = myRecord.store 
        
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

        this.protoOption = myZoomModel

        if ( ! myRecordId ) {
            errorMessage( 'LinkedForm Error : ' +  myZoomModel, 'not fkId field definition found' )
            return 
        }

        this._getFormDefinition( myRecordId) 

        
    }, 

    
    _getFormDefinition: function (  myRecordId ) {
        
        // Opciones del llamado AJAX 
        var options = {
            scope: this, 
            success: function ( obj, result, request ) {
                this.myMeta = _cllPCI[ this.protoOption ] ;
                this.formLoaded = true;
                this._loadFormData( myRecordId )
            },
            failure: function ( obj, result, request) { 
                errorMessage( 'ProtoDefinition Error :', myZoomModel + ': protoDefinition not found')
            }
        }

        if (  loadPci( this.protoOption , true, options ) ) {
                this.myMeta = _cllPCI[ this.protoOption ] ;
                this.formLoaded = true; 
                this._loadFormData( myRecordId )
        }

    }, 

        
    _loadFormData: function ( myRecordId ) {

        if ( ! this.formLoaded ) {
            console.log( 'FormController:  Form is not ready')
        }  

        if ( myRecordId ) {

            // Filter 
            var myFilter = '{"pk" : ' +  myRecordId + ',}'
    
            var storeDefinition =  {
                protoOption : this.protoOption, 
                autoLoad: true, 
                baseFilter: myFilter, 
                sProtoMeta  : getSafeMeta( this.myMeta )    
            };
    
            var myStore = getStoreDefinition( storeDefinition )
            myStore.load();
            
            myStore.on({
                'load' :  function(store,records, successful, options) {
    
                    // Fix:  Esta entrando dos veces  porq????
                    if ( this.myWin ) return 
    
                    // The form is now linked to  store  
                    this.openLinkedForm( records[0], true  )
                }, 
                scope: this }
            )

        } else  {
             // SetDefaults 
        } 
         
    }

      
})
