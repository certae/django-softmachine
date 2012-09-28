/**
 * @author  Dario Gomez 

 * Helper class for intancing Task 

 */

Ext.define('ProtoUL.protoOrg.tasks.TaskController', {
    extend: 'Ext.Base',


    // Entry point if zoom 
    protoOption : 'protoOrganizer.Task', 

    // if ReadOnly 
    isReadOnly : false, 

    // Si la forma fue cargada correctamente  
    formLoaded : false, 
    
    // Win dimension 
    myWidth : 920, 
    myHeight : 460, 


    constructor: function (config) {
        Ext.apply(this, config || {});
    },


    openTaskForm: function ( )   {

        this._newTaskForm( this );
        this._newWindow( this ); 
        
        // this.myForm.setActiveRecord( myRecord );
        // this.myForm.store = myRecord.store 
        // this.myForm.setReadOnlyFields( true, this.myMeta.gridConfig.readOnlyFields );            
        
        this.myWin.show();
        
    }, 
    
    _newWindow: function ( me ) {

        updateWinPosition( me.myWidth, me.myHeight )
        
        me.myWin  = Ext.widget('window', {
            // constrain: true, 
            // title : me.myMeta.description,
            closeAction: 'hide',
            width: me.myWidth,
            height: me.myHeight,
            x : _winX, 
            y : _winY, 
            minHeight: 400,
            minWidth: 400,
            layout: 'fit',
            resizable: true,
            modal: true,
            items: me.myForm 
        });

        // Los eventos controlan la ventana
        me.myForm.on({
            'close' :  function() { me.myWin.close() }, 
            'hide' :  function() { me.myWin.hide() }, 
            scope: me }
        );


    },


    _newTaskForm: function () {

        this.myForm = Ext.create('Ext.form.Panel', {
            // myMeta : this.myMeta, 
            myFormController : this, 

            layout: 'border',
        
            items: [
                {
                    // xtype: 'tasksToolbar',
                    region: 'north'
                },
                {
                    // xtype: 'listTree',
                    region: 'west',
                    width: 300,
                    collapsible: true,
                    split: true
                },
                {
                    region: 'center',
                    // xtype: 'taskGrid',
                    title: 'All Lists'
                }
            ]

        });  

        return this.myForm

    },

    

    _getTaskDefinition: function (  myRecordId  ) {
        
        // Opciones del llamado AJAX 
        var options = {
            scope: this, 
            success: function ( obj, result, request ) {
                this._openAndLoad( this.protoOption, myRecordId )
            },
            failure: function ( obj, result, request) { 
                errorMessage( 'ProtoDefinition Error :', myZoomModel + ': protoDefinition not found')
            }
        }
        if (  loadPci( this.protoOption , true, options ) ) {
                this._openAndLoad( this.protoOption, myRecordId )
        }

    }, 



    _openAndLoad: function ( protoOption, myRecordId ) { 

        this.myMeta = _cllPCI[ protoOption ] ;
        this.formLoaded = true;
        this._loadTaskData( myRecordId ) 

    }, 
    
        
    _loadTaskData: function ( myRecordId ) {

        if ( ! this.formLoaded ) {
            console.log( 'FormController:  Form is not ready')
        }  

        // Filter 
        var myFilter = '{"pk" : ' +  myRecordId + ',}'
        var storeDefinition =  {
            protoOption : this.protoOption, 
            autoLoad: true, 
            baseFilter: myFilter, 
            sProtoMeta  : getSafeMeta( this.myMeta )    
        };

        var myStore = getStoreDefinition( storeDefinition )
        var myRecord = getNewRecord( this.myMeta, myStore );
        this.openTask( myRecord )

         
    }
      
})
