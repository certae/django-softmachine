//

Ext.define('ProtoUL.UI.GridController', {
    extend: 'Ext.Base',

    myMeta : null, 
    constructor: function (config) {
        Ext.apply(this, config || {});
    }, 
    
    addGridTools : function()  {
    
        var editTools =    [{
                itemId: 'toolRowAdd',
                tooltip: 'rowAdd',  
                type: 'rowAdd',
                hidden: true,
                width : 20, 
                scope: this,
                handler: this.onClickTableDuplicate
            }, {
                itemId: 'toolRowCopy',
                tooltip: 'rowCopy',  
                type: 'rowCopy',
                hidden: true,
                width : 20, 
                scope: this,
                handler: this.onClickTableDuplicate
            }, {
                itemId: 'toolRowDel',
                type: 'rowDel',
                tooltip: 'rowDel',  
                hidden: true,
                width : 30, 
                scope: this,
                handler: this.onClickTableDelete
            }, {
                itemId: 'toolFormAdd',
                tooltip: 'formAdd',  
                type: 'formAdd',
                width : 20, 
                hidden: true,
                scope: this,
                handler: this.onClickFormAdd
            }, {
                itemId: 'toolFormUpd',
                tooltip: 'formUpd',  
                hidden: true,
                type: 'formUpd',
                width : 20, 
                scope: this,
                handler: this.onClickFormEdit
            }, {
                itemId: 'toolFormView',
                tooltip: 'formView',  
                type: 'formView',
                width : 20, 
                scope: this,
                handler: this.onClickFormView
            }]
        
        
            this.myGrid.addTools( editTools )
            this.setEditMode( false )
        
    }, 
    
    setEditMode: function ( bEdit  ) {
        // tbOnly : is internal event fired from grid 

        this.myGrid.editable = bEdit
        var myExtGrid = this.myGrid._extGrid    

        setToolMode ( myExtGrid, '#toolRowAdd', bEdit )
        setToolMode ( myExtGrid, '#toolRowCopy', bEdit )
        setToolMode ( myExtGrid, '#toolRowDel', bEdit )

        setToolMode ( myExtGrid, '#toolFormAdd', bEdit ) 
        setToolMode ( myExtGrid, '#toolFormUpd', bEdit )
        setToolMode ( myExtGrid, '#toolFormView', !bEdit )

        function setToolMode( myExtGrid, myToolBt, bEdit ) {

            if ( bEdit ) myExtGrid.down( myToolBt ).show();
            else  myExtGrid.down( myToolBt ).hide();
            
        }

    }, 
    
    
//  --------------------------------------------------------------------------

    initFormController: function (){
        this.formController = Ext.create('ProtoUL.UI.FormController', { myMeta: this.myMeta}); 
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

