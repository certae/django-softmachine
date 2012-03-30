
// Definicion del modelo, 

// TODO:  Traer aqui  manejo de la carga de la PCI 


// Object converter: Para testear si un elto hace parte de un array se convierte el array en objeto 
function oc(a)
{
  var o = {};
  for(var i=0;i<a.length;i++)
  {
    o[a[i]]='';
  }
  return o;
}


function DefineProtoModel ( myMeta , modelClassName ){
        
//    console.log ( 'Loading ' + modelClassName + '...' );
    
    var myFields = [];
    for (var ix in myMeta.fields ) {
        var vFld  =  myMeta.fields[ix]; 
        var mField = {
            name: vFld.name,
            type: 'string' 
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
            fields: myFields 

        });
  
}


// TODO: Los templates de las finchas deberian ser leidos de un archivo 
function OpenFile( fileName  ) {
    // fh = window.open( fileName , 0);     // Open the file for reading 
    // if(fh!=-1)                          // If the file has been successfully opened 
    // { 
        // length = flength(fh);           // Get the length of the file     
        // str = fread(fh, length);        // Read in the entire file 
        // fclose(fh);                     // Close the file 
    // }
    // return str     
}


function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (Object.prototype.toString.call(value) == '[object Array]') {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}



