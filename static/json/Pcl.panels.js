// TODO: Debe leerse de un json. 

Pci.Panels  = {
"tbar" : [{
        "tooltip" : "Update definition",
        "iconCls" : "icon-save", 
        "itemId" : "save"
    },"-",{
        "tooltip" : "Cancel updata",
        "iconCls" : "icon-cancel", 
        "itemId" : "cancel"
    },"-",{
        "tooltip" : "Show Meta (JSON)",
        "iconCls" : "icon-editEl",
        "itemId" : "showMeta"
    },
    {
        "iconCls" : "icon-help",
        "itemId"  : "help",
        "tooltip" : "Show help"
    }],
    
    
    // ----------------------------------------------------------------------------
    
    
"toolsTabs" : [{
        "xtype" : "tabpanel",
        "activeTab" : 0,
        "border" : false,
        "defaults": { "lauyout" : "fit" }, 
        "items" : [{
            "title" : "Tools",
            "itemId" : "toolsTree",
            "tooltip" : "Design your ui by selecting elements from this tab",
            "layout" : "fit",
            "autoScroll": true
        },
        {
            "title" : "Properties",
            "tooltip" : "Object properties",
            "itemId" : "properties",
            "autoScroll": true,
            "border" : false
        }]
    }] 
}