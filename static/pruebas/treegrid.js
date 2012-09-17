Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.tree.*'
]);

Ext.onReady(function() {



    var i = 0; 

    var tree = Ext.create('Ext.tree.Panel', {
        title: 'Core Team Projects',
        width: 600,
        height: 600,
        renderTo: Ext.getBody(),
        collapsible: true,
        useArrows: true,
        rootVisible: true,
        store: store,
        rowLines : true, 
        columnLines : true, 

        // ------------------
        
        
        tbar: [
          { xtype: 'button', text: 'Button Tp' }
        ], 

        bbar: [
          { xtype: 'button', 
              text: 'NewNode',

            handler:function(){
                var node = store.getNodeById('node-2');
                var n = node.appendChild({
                    task:'New Node ', //  + i++,
                    leaf: true,
                    checked: true
                    })  
                   }
              }
        ], 

        buttons: [
          { text: 'Button Bu' }
        ],         
        
        //         
        multiSelect: false,

        // singleExpand: true,

        //the 'columns' property is now 'headers'
        columns: [{
            xtype: 'treecolumn', //this is so we know which column will show the tree
            text: 'text',
            flex: 2,
            sortable: true,
            dataIndex: 'text'
        // },{
            // text: 'ptTitle',
            // sortable: true,
            // dataIndex: 'ptTitle'
        },{
            text: 'ptType',
            sortable: true,
            dataIndex: 'ptType'
        },{
            text: 'ptValue',
            flex: 2,
            dataIndex: 'ptValue',
            sortable: true
        }]
    });
    

    // var newNode = new Ext.tree.TreeNode({id: "foo", text: "foo", leaf: true});
    // myTree.selModel.selNode.parentNode.appendChild(newNode);

    // var delNode = myTree.selModel.selNode;
    // myTree.selModel.selNode.parentNode.removeChild(delNode);    
    
    
});
