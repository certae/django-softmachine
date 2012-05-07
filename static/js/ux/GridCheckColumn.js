/*

 * @class ProtoUL.ux.GridCheckColumn
 * @extends Ext.grid.column.Column
 * <p>A Header subclass which renders a checkbox in each column cell</p>
 
A diferencia del CheckColmn, esta clase no maneja eventos, pues corresponde a la presentacion en la grilla,  
La edicion se hace mediante un checkbox ya sea en modo celda o fila. 
 
 * <p>Example usage:</p>
 * <pre><code>
// create the grid
    columns: [{
           xtype: 'checkcolumnreadonly',
           text: 'Indoor?',
           dataIndex: 'indoor',
           width: 55
     }...]
*/

Ext.define('ProtoUL.ux.GridCheckColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.checkcolumnreadonly',

    // Note: class names are not placed on the prototype bc renderer scope
    // is not in the header.
    renderer : function(value){

        var cssPrefix = Ext.baseCSSPrefix,
            cls = [cssPrefix + 'grid-checkheader'];

        if (value) {
            cls.push(cssPrefix + 'grid-checkheader-checked');
        }
        return '<div class="' + cls.join(' ') + '">&#160;</div>';
    }
});


