//

Ext.define('ProtoUL.UI.GridControler', {
    extend: 'Ext.Base',

    myMeta : null, 

    // Entry point if zoom 
    protoOption : null, 

    // if ReadOnly 
    isReadOnly : false, 
    
    
    isZoomForm : false, 

    
    constructor: function (config) {

        Ext.apply(this, config || {});

    }, 
    
    addGridTools : function()  {
    
        var editTools =    [{
                itemId: 'toolCancelEdit',
                tooltip: 'cancelEdit',  
                type: 'close',
                hidden: true,
                scope: this,
                handler: this.onClickTableCancelEdit 
             },{
                itemId: 'toolSave',
                tooltip: 'save',  
                type: 'save',
                hidden: true,
                scope: this,
                handler: this.onClickTableSave
            }, {
                itemId: 'toolFormView',
                tooltip: 'formView',  
                type: 'formView',
                width : 20, 
                hidden: true,
                scope: this,
                handler: this.onClickFormView
            }, {
                itemId: 'toolFormAdd',
                tooltip: 'formAdd',  
                type: 'formAdd',
                width : 20, 
                hidden: true,
                scope: this,
                handler: this.onClickFormAdd
            }, {
                itemId: 'toolRowCopy',
                tooltip: 'rowCopy',  
                type: 'rowCopy',
                hidden: true,
                width : 20, 
                scope: this,
                handler: this.onClickTableDuplicate
            }, {
                itemId: 'toolFormUpd',
                tooltip: 'formUpd',  
                hidden: true,
                type: 'formUpd',
                width : 20, 
                scope: this,
                handler: this.onClickFormEdit
            }, {
                itemId: 'toolRowDel',
                type: 'rowDel',
                tooltip: 'rowDel',  
                hidden: true,
                width : 20, 
                scope: this,
                handler: this.onClickTableDelete

             // },{
                // type: 'gear',
                // scope: this,
                // handler: showMetaConfig,
                // tooltip: 'Meta Config ... '
             // },{
                // type: 'gear',
                // scope: this,
                // handler: showColsConfig,
                // tooltip: 'ColsConfig ... '
            }]
        
        
            this.myGrid.addTools( editTools )
            this.toggleMode()
        
        
    }, 
    
    toggleMode: function (  ) {
        // tbOnly : is internal event fired from grid 

        this.myGrid.editable = true
        
        this._extGrid = this.myGrid._extGrid    

        if ( true  ) {
            this._extGrid.down('#toolSave').show();
            this._extGrid.down('#toolCancelEdit').show();

            this._extGrid.down('#toolCancelEdit').show();
            this._extGrid.down('#toolFormAdd').show();
            this._extGrid.down('#toolFormUpd').show();
            this._extGrid.down('#toolFormView').show();
            this._extGrid.down('#toolRowCopy').show();
            this._extGrid.down('#toolRowDel').show();
            this._extGrid.down('#toolSave').show();


        } else {
            this._extGrid.down('#toolSave').hide();
            this._extGrid.down('#toolCancelEdit').hide();
        }

        
        // if ( forceEdit ) this.editable = forceEdit;  
//         
        // if ( (!tbOnly ) && ( this.__MasterDetail ))  {
            // this.__MasterDetail.protoMasterGrid.setEditMode( this.editable )
        // } 
//         
        // if ( this.configTbar ) {
// 
            // this.configTbar.getComponent('edit').setVisible ( ! this.editable );
            // this.configTbar.getComponent('save').setVisible( this.editable  );
// 
// //            this.configTbar.getComponent('cancel').setVisible( this.editable ); 
            // this.configTbar.getComponent('save').setDisabled( this.autoSync || (!this.editable ));
// 
            // this.configTbar.getComponent('add').setDisabled ( ! this.editable );
            // this.configTbar.getComponent('copy').setDisabled ( ! this.editable );
            // this.configTbar.getComponent('delete').setDisabled ( ! this.editable );
            // this.configTbar.getComponent('cancel').setDisabled ( ! this.editable );
//             
            // this.configTbar.getComponent('autoSync').setDisabled( ! this.editable );
        // }; 
//         
    }, 
    
    
    onClickTableAutoSync: function ( pressed ){

        this.autoSync = pressed ;             
        // btn.ownerCt.getComponent('save').setDisabled(  this.autoSync  );
        
        if ( pressed ) this.myGrid.saveChanges()
        this.myGrid.store.autoSync = pressed;
        
    }, 


//  --------------------------------------------------------------------------

    initFormController: function (){
        this.formController = Ext.create('ProtoUL.UI.FormControler', { myMeta: this.myMeta}); 
    }, 

    onClickFormAdd: function (){
        this.onClickTableAdd()
        this.onClickFormEdit()
    }, 
    
    onClickFormEdit: function (){
        if (!this.formController ) this.initFormController()
        if ( this.validaSelected( this.myGrid.selected )) {
             this.formController.openLinkedForm ( this.myGrid.selected    )
        } 
            
    },  

    onClickFormView: function (){
        if (!this.formController ) this.initFormController()
        if ( this.validaSelected( this.myGrid.selected )) {
             this.formController.openLinkedForm ( this.myGrid.selected , true   )
        } 
    },  

    validaSelected: function ( myReg )  {
        
        if ( myReg ) {
            return true 
        } else {
            errorMessage( 'Form', 'No record selected')
            return false 
        }
        
    },

//  --------------------------------------------------------------------------

    // function toggleEditMode( forceEdit ){
        // this.toggleEditMode( forceEdit )
    // }

    
    onClickTableAdd: function (){
        this.myGrid.addNewRecord()
    },  
    
    onClickTableDelete: function() {
        this.myGrid.deleteCurrentRecord()
    },  

    onClickTableDuplicate: function () {
        this.myGrid.duplicateRecord()
    }, 

    onClickTableSave: function (){
        this.myGrid.saveChanges()
    }, 

    onClickTableCancelEdit:  function (){
        this.myGrid.cancelChanges()
    } 
     
    
})

