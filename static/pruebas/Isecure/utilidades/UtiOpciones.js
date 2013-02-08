Ext.define("Isecure.utilidades.UtiOpciones", {
    singleton: true,
    alternateClassName: 'utiopciones',

    //Funciones:

    opcion: function (nemonico) {
        //para cargar el tipo de opcion asiciada a un nomenico 
        Ext.Ajax.request({
            url: 'Opcion',
            method: 'POST',
            params: {
                nemonico: nemonico,

            },
            success: function (response) {
                //try{
                console.log(response);
                var resp = Ext.JSON.decode(response.responseText);

                if (resp.found) {
                    if (resp.clase == 'codigo') {
                        eval(resp.codigo);
                        contId++;

                    } else {
                        if (resp.clase == 'SM.PCL') {
                            QBE(nemonico, false, false, resp);
                        } else {
                            if (resp.clase == 'Pcl-Group') {
                                QBE(nemonico, false, SM.TabGroupingGrid, resp);
                            } else {

                                if (resp.clase == 'PclEdit') {
                                    // QBE(nemonico,false,SM.TabGroupingGrid,resp);
                                } else {
                                    var clase = eval(resp.clase);
                                    var objeto = new clase({
                                        id: nemonico,
                                        parametrosOpciones: resp
                                    });
                                    objeto.SMRender();
                                }
                            }
                        }
                    }
                }
                /*}catch (e) {
                        Ext.Msg.alert('la opcion no se pudo cargar');
                    }*/
            },
            failure: function (response) {
                Ext.Msg.alert('Información', 'el comando no se pudo ejecutar');
            }

        });
    }


});