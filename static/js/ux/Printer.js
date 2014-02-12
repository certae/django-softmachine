/**
 * @class ProtoUL.ux.Printer
 * @author  Dario Gomez ,  basado en el Ext.ux.Printer / Ed Spencer (edward@domine.co.uk)

 * Helper class to easily print the contents of a grid. Will open a new window with a table where the first row
 * contains the headings from your column model, and with a row for each item in your grid's store. When formatted
 * with appropriate CSS it should look very similar to a default grid. If renderers are specified in your column
 * model, they will be used in creating the table. Override headerTpl and bodyTpl to change how the markup is generated
 */
Ext.define("ProtoUL.ux.Printer", {
    
    requires: 'Ext.XTemplate',

    statics: {
        /**
         * Prints the passed grid. Reflects on the grid's column model to build a table, and fills it using the store
         * @param {Ext.grid.Panel} grid The grid to print
         */
        gridPrint: function(grid) {
            //We generate an XTemplate here by using 2 intermediary XTemplates - one to create the header,
            //the other to create the body (see the escaped {} below)

            // Filtrar las columas de index y check en caso de q las halla
            var columns = this.getGridColumns( grid ) ;
    
            //build a useable array of store data for the XTemplate
            var data = this.getGridData( grid,  columns) ;
            
            //use the headerTpl and bodyTpl markups to create the main XTemplate below
            var headings = Ext.create('Ext.XTemplate', this.headerTpl).apply(columns);

            var body     = Ext.create('Ext.XTemplate', this.bodyTpl).apply(columns);
            body = Ext.create('Ext.XTemplate', '<tpl for=".">' + body + '</tpl>').apply(data); 
            
            var html1 = this.htmlTpl.toString();
            html1 = html1.replace( /@gridTitle@/g, grid.title );
            html1 = html1.replace( /@siteTitle@/g, _SM._siteTitle );
            html1 = html1.replace( '@headings@', headings );
            html1 = html1.replace( '@body@', body );

            //open up a new printing window, write to it, print it and close
            var win = window.open('', 'printgrid');
            win.document.write(html1);

            if (this.printAutomatically){
				win.document.close();
				win.focus();
                win.print();
                // win.close();
            }
        },

		// This function is used in the app 
        sheetPrint: function(grid, sheetHtml ) {
            //We generate an XTemplate here by using 2 intermediary XTemplates - one to create the header,
            //the other to create the body (see the escaped {} below)

            //use the headerTpl and bodyTpl markups to create the main XTemplate below
			var body = '<hr>' + sheetHtml;
            
            var html1 = this.htmlTpl.toString();
            html1 = html1.replace( /@gridTitle@/g, grid.title );
            html1 = html1.replace( /@siteTitle@/g, _SM._siteTitle );
            html1 = html1.replace( '@headings@', '' );
            html1 = html1.replace( '@body@', body );

            //open up a new printing window, write to it, print it and close
            var win = window.open('', 'printgrid');
            win.document.write(html1);

            if (this.printAutomatically){
                win.print();
            }
        },

        reportPrint: function( win, sheetHtml ) {

            //open up a new printing window, write to it, print it and close
            win.document.write( sheetHtml );
			win.document.close();
			win.focus();
            win.print();

        },



        getGridData: function(grid, columns ) {


            var data = [];
            grid.store.data.each(function(item) {
                var convertedData = [];

                //apply renderers from column model
                for (var key in item.data) {
                    var value = item.data[key];

                    Ext.each(columns, function(column) {
                        if (column.dataIndex == key) {
                            convertedData[key] = column.renderer ? column.renderer(value) : value;
                        }
                    }, this);
                }

                data.push(convertedData);
            });
            
            return data; 
        },  

        getGridColumns: function(grid  ) {

            var columns = [];
    
            // DGT** Creacion de columnas  
            for (var ix in grid.columns ) {
                var col  =  grid.columns[ix];
                if ( col.dataIndex  ) {
                    columns.push(col);          
                   }
			}
            
			return columns;
        },  

        /**
         * @property printAutomatically
         * @type Boolean
         * True to open the print dialog automatically and close the window after printing. False to simply open the print version
         * of the grid (defaults to true)
         */
        printAutomatically: true,
        
        /**
         * @property headerTpl
         * @type {Object/Array} values
         * The markup used to create the headings row. By default this just uses <th> elements, override to provide your own
         */
		headerTpl : ['<tr>', '<tpl for=".">', '<th>{text}</th>', '</tpl>', '</tr>', '</thead>'],

        /**
         * @property bodyTpl
         * @type {Object/Array} values
         * The XTemplate used to create each row. This is used inside the 'print' function to build another XTemplate, to which the data
         * are then applied (see the escaped dataIndex attribute here - this ends up as "{dataIndex}")
         */
		bodyTpl : ['<tr>', '<tpl for=".">', '<td>\{{dataIndex}\}</td>', '</tpl>', '</tr>'],
        
        /**
         * @property htmlTpl  template
         * @type {Object/Array} vars  
         *      @gridTitle@
         *      @siteTitle@
         *      @headings@
         *      @body@
         */
		htmlTpl : '<!DOCTYPE html>' + '<html>' + '<head>' + '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />' + '<link href="/static/css/print.css" rel="stylesheet" type="text/css" media="screen,print" />' + '<title>@gridTitle@</title>' + '</head>' + '<body>' + '<h1>@siteTitle@</h1>' + '<h2>@gridTitle@</h2>' + '<table>' + '<thead>@headings@</thead>' + '<tbody>@body@</tbody>' + '</table>' + '</body>' + '</html>'

    }
});