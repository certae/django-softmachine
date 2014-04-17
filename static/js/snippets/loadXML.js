// http://ext4all.com/post/extjs-4-treepanel-from-uploaded-xml-file-without-xml-attributes.html

/ ------------ Backend  [HttpPost]  
/


public ActionResult Xml2(string childrenElementName, string textElementName)
{
    if (Request.Files.Count == 1)
    {
        var file = Request.Files["file"];
        if (file != null)
        {
            var size = file.ContentLength;
 
            if (size > 0)
            {
                try
                {
                    var doc = XDocument.Load(file.InputStream);
                    var root = new Node();
 
                    FillNode2(root, doc.Root, childrenElementName, textElementName);
 
                    if (root.children == null || root.children.Count == 0)
                    {
                        return Json(new
                        {
                            success = false,
                            msg = string.Format("Elements named {0} were not found", childrenElementName)
                        }, "text/html");
                    }
 
                    return Json(new
                    {
                        success = true,
                        data = root
                    }, "text/html");
                }
                catch (Exception exc)
                {
                    return Json(new
                    {
                        success = false,
                        msg = string.Format("Error while parse xml: {0}", exc.Message)
                    }, "text/html");
                }
            }
        }
    }
 
    return Json(new
    {
        success = false,
        msg = "Select file to upload"
    }, "text/html");
}
 
private void FillNode2(Node parent, XElement element, string childrenElementName, string textElementName)
{
    var text = element.Element(textElementName);
    if (text == null)
        throw new InvalidOperationException(string.Format("Element \"{0}\" was not found",
                                                            textElementName));
 
    parent.text = text.Value;
 
    var children = element.Element(childrenElementName);
    if (children == null)
    {
        parent.leaf = true;
        return;
    }
 
    parent.children = new List<node>();
 
    foreach (var i in children.Elements())
    {
        var n = new Node();
 
        parent.children.Add(n);
 
        FillNode2(n, i, childrenElementName, textElementName);
    }
}

/ ------------ Frontend   [HttpPost]  
/

Ext.onReady(function () {
    var win = Ext.widget('window', {
        title: 'Upload Xml',
        modal: true,
        closeAction: 'hide',
        width: 450,
        items: [{
            xtype: 'form',
            bodyPadding: 10,
            fieldDefaults: {
                labelWidth: 150,
                anchor: '100%',
                allowBlank: false
            },
            border: false,
            items: [{
                xtype: 'textfield',
                name: 'ChildrenElementName',
                fieldLabel: 'Children element name',
                value: 'children'
            }, {
                xtype: 'textfield',
                name: 'TextElementName',
                fieldLabel: 'Text element name',
                value: 'title'
            }, {
                xtype: 'filefield',
                name: 'file',
                fieldLabel: 'File',
                buttonText: 'Select xml file...',
            }]
        }],
        buttons: [{
            text: 'Upload',
            handler: function () {
                var form = win.down('form').getForm();
                if (form.isValid()) {
                    form.submit({
                        url: '/upload/xml2',
                        waitMsg: 'Uploading your xml file...',
                        success: function (f, a) {
                            var result = a.result,
                                data = result.data,
                                store = tree.getStore();
 
                            win.close();
 
                            // store.setRootNode(data);
                            // tree.expandAll();
                        },
                        failure: function (f, a) {
                            Ext.Msg.alert('Failure', a.result.msg);
                        }
                    });
                }
            }
        }]
    }),

    tree = Ext.create('Ext.tree.Panel', {
        title: 'Tree From Custom Xml',
        width: 200,
        height: 300,
        store: {
            root: {
                text: 'Root',
                expanded: true
            }
        },
        tbar: [{
            text: 'Upload Xml',
            handler: function () {
                win.show();
            }
        }],
        renderTo: 'output'
    });

});


