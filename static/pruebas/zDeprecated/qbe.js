    
// ProtoUL.view.ProtoMasterDetail 
_ComboFilterOp = []

// _ComboFilterOp = [
            // ['iexact', _SM.__language.Text_ComboFilterOp_Equal],
            // ['icontains', _SM.__language.Text_ComboFilterOp_Containing],
            // ['iendswith', _SM.__language.Text_ComboFilterOp_Finishing],
            // ['istartswith', _SM.__language.Text_ComboFilterOp_Starting],
            // ['--', ''],
            // ['gt', _SM.__language.Text_ComboFilterOp_PlusThan],
            // ['gte', _SM.__language.Text_ComboFilterOp_PlusEqualThan],
            // ['lt', _SM.__language.Text_ComboFilterOp_LessThan],
            // ['lte', _SM.__language.Text_ComboFilterOp_LessEqualThan],
            // ['range', '(..)'],
            // ['in', '(_,_)'],
            // ['--', ''],
            // ['day', 'jour'],
            // ['month', 'mois'],
            // ['week_day', 'jour de la semaine'],
            // ['year', 'année
            // ['--', ''],
            // ['isnull', _SM.__language.Text_ComboFilterOp_Null_Value], 
            // ['iregex', 'regex'],
    
    // =========================================================================================================
    
    
    // qbeFilter: function() {
        // Abre una forma de QBE con cada campo, sus opciones de busqueda y el criterio 
        
        // Combo Columnas  
        // var colStore = new Ext.data.ArrayStore({
            // fields: ['colPhysique', 'colName'],
            // data: configureComboColumns()  
        // });
        // var comboCols = new Ext.form.ComboBox({
            // store: colStore,
            // width: 135,
            // mode: 'local',
            // triggerAction: 'all',
            // displayField: 'colName',
            // valueField: 'colPhysique',
            // forceSelection: true,
            // emptyText: _SM.__language.Text_Toolbar_In,
            // selectOnFocus: true,
            // typeAhead: true
        // });
        // // combo - operation 
        // var opStore = new Ext.data.ArrayStore({ 
            // fields: ['code', 'operation'], 
            // data: _ComboFilterOp 
        // }); 
        // var comboOp = new Ext.form.ComboBox({
            // emptyText: _SM.__language.Text_Toolbar_Search_Combo,
            // store: opStore,
            // width: 150,
            // mode: 'local',
            // triggerAction: 'all',  
            // displayField: 'operation',
            // valueField: 'code',
            // forceSelection: true,
            // editable: false
        // });

        // function configureComboColumns ( tb ){
            // // Columnas para el Query del tipo :  newColData = [['idx', 'Id Reg'],['code', 'Code Reg']];
            // var colData = [];
            // var myFieldDict = _SM.getFieldDict(me.myMeta)
            // // REcorre los q llegan y genera el obj  header, name         
            // for ( var ix in me.myMeta.gridConfig.searchFields ) {
                // var name = me.myMeta.gridConfig.searchFields[ix]
                // var c = myFieldDict[name]
                // if ( ! c ) { 
                    // var c = { name : name, header : name }
                // }
                // colData.push( [c.name, c.header] ) 
            // } 
            // // Para tomar todos los campos 
            // colData.unshift( ['', ''] ) 
            // return colData ; 
        // }; 
        
        // function onClickQbe( btn ) { 
            // var sFilter = [];
            // var sTitle =  ''; 
            // var sCols = comboCols.getValue() || '' 
            // var sOps  = comboOp.getValue() || 'icontains'; 
            // if ( sOps == '--' ) { sOps = 'icontains' };    
            // if (searchCr.getValue() == '' ) {
                // sFilter = '';
            // } else if ((sCols  == '') && (searchCr.getValue() != '' )) {
                // sFilter = searchCr.getValue();
                // sTitle = ' " ' + searchCr.getValue() + ' "';
            // } else {
                // sFilter = '{"' + sCols + '__' + sOps + '" : "' + searchCr.getValue() + '",}';
                // sTitle = comboOp.getDisplayValue() || 'qui contient';  
                // sTitle =  ' " ' + comboCols.getDisplayValue() + " " +  sTitle + " " + searchCr.getValue() + ' "';
            // }
            // me.fireEvent('loadData', me, sFilter, sTitle );
        // };
        
    // }
    
