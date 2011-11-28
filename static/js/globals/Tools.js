
// Definicion del modelo, 

// TODO:  Traer aqui  manejo de la carga de la PCI 


function DefineProtoModel ( myMeta , modelClassName ){
        
    console.log ( 'Loading ' + modelClassName + '...' );
    
    var myFields = [];
    for (var ix in myMeta.fields ) {
        var vFld  =  myMeta.fields[ix]; 
        var mField = {
            name: vFld.name,
            type: 'string', 
            // type: vFld.type,
            // useNull : vFld.allowNull, 
            // defaultValue: vFld.defaultValue,
            // persist: vFld.editPolicy,
        };
        myFields.push(mField);
    }
    
    
    // myFields = [{"name":"id","type":"int","useNull":true},{"name":"first","type":"string"},{"name":"last","type":"String"},{"name":"email","type":"string"}]
    
    Ext.define(modelClassName, {
        extend: 'Ext.data.Model',
            fields: myFields, 

        });
  
};
