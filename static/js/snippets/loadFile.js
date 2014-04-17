
Ext.onReady(function () {
    var grid = Ext.widget({
        xtype: 'grid',
        width: 400,
        height: 200,
        store: {
            fields: ['name', 'size']
        },
        tbar: [{
            text: 'Add files',
            handler: function () {


                var win = Ext.widget({
                    xtype: 'window',
                    title: 'Files upload form',
                    width: 350,
                    autoShow: true,
                    items: {
                        xtype: 'form',
                        border: false,
                        bodyStyle: {
                            padding: '10px'
                        },
                        items: {
                            xtype: 'multifilefield',
                            labelWidth: 80,
                            fieldLabel: 'Choose file(s)',
                            anchor: '100%',
                            allowBlank: false,
                            margin: 0
                        }
                    },
                    buttons: [{
                        text: 'Upload',
                        handler: function () {
                            var form = win.down('form').getForm();
 
                            if (!form.isValid()) return;
 
                            form.submit({
                                url: '/upload/files',
                                waitMsg: 'Uploading your file(s)...',
                                success: function (f, a) {
                                    var data = a.result.data;
                                    if (data.length) {
                                        grid.store.loadData(data, true);
                                    }
                                    win.close();
                                },
                                failure: function (f, a) {
                                    Ext.Msg.alert('Failure', a.result.msg || 'server error', function () {
                                        win.close();
                                    });
                                }
                            });
                        }
                    }, {
                        text: 'Cancel',
                        handler: function () {
                            win.close();
                        }
                    }]
                });


            }
        }],
        columns: [
            { text: 'name', dataIndex: 'name', width: 200 },
            { text: 'size', dataIndex: 'size', width: 100, renderer: Ext.util.Format.fileSize }
        ],
        renderTo: 'output'
    });
});