/*

Control que recoje todos los plugins necesarios para el htmleditor 

*/


Ext.define('ProtoUL.ux.FieldHtmlEditor', {
    extend: 'Ext.form.HtmlEditor',
    alias: 'widget.htmlfield',

    initComponent: function() {
        
        Ext.apply(this, {
            plugins  : getPlugins()
        });
        this.callParent();



        function getPlugins(){
            return [
                new ProtoUL.ux.HtmlEditor.Word(),
                new ProtoUL.ux.HtmlEditor.Table(),
                new ProtoUL.ux.HtmlEditor.HR(),
                new ProtoUL.ux.HtmlEditor.SpecialCharacters(),
                new ProtoUL.ux.HtmlEditor.MidasFormat()
            ];
        };

    }, 
    
    setReadOnly: function (readOnly) {
		var me = this;
        if ( me.initialized && readOnly != undefined ) {
            var tb = me.getToolbar();
            tb.setVisible(! readOnly );
        }
        me.superclass.setReadOnly( readOnly );  
    }

});




/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class ProtoUL.ux.HtmlEditor.HR
 * @extends Ext.util.Observable
 * <p>A plugin that creates a button on the HtmlEditor for inserting a horizontal rule.</p>
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 */
Ext.define('ProtoUL.ux.HtmlEditor.HR', {
    extend: 'Ext.util.Observable',

    // HR language text
    langTitle   : 'Horizontal Rule',
    langToolTip : 'Insert horizontal rule with configurable lenght',
    langHelp    : 'Enter the width of the Rule in percentage<br/> followed by the % sign at the end, or to<br/> set a fixed width ommit the % symbol.',
    langInsert  : 'Insert',
    langCancel  : 'Cancel',
    langWidth   : 'Width',

    // defaults
    defaultHRWidth: '100%',

    // private
    cmd: 'hr',

    // private
    init: function(cmp){
        this.cmp = cmp;
        this.cmp.on('render', this.onRender, this);
    },

    // private
    onRender: function(){
        var btn = this.cmp.getToolbar().add('-',{
            iconCls : 'x-edit-hr',
            handler : showHTWin,
            scope   : this,
            tooltip : {
                title: this.langTitle, 
                text: this.langToolTip
            },
            overflowText: this.langTitle
        });
        
        function showHTWin(){
            if (!this.hrWindow) {
                this.hrWindow = Ext.create('Ext.window.Window',{
                    title       : this.langTitle,
                    width       : 250,
                    closeAction : 'hide',
                    items       : [{
                        xtype       : 'form',
                        itemId      : 'insert-hr',
                        border      : false,
                        plain       : true,
                        bodyStyle   : 'padding: 10px;',
                        labelWidth  : 60,
                        labelAlign  : 'right',
                        items       : [{
                            xtype   : 'label',
                            html    : this.langHelp + '<br/>&nbsp;'
                        }, {
                            xtype       : 'textfield',
                            maskRe      : /[0-9]|%/,
                            regex       : /^[1-9][0-9%]{1,3}/,
                            fieldLabel  : this.langWidth,
                            name        : 'hrwidth',
                            anchor      : '-20px;',
                            value       : this.defaultHRWidth,
                            listeners   : {
                                specialkey: function(f, e){
                                    if ((e.getKey() == e.ENTER || e.getKey() == e.RETURN) && f.isValid()) {
                                        this.doInsertHR();
                                    }
                                },
                                scope: this
                            }
                        }]
                    }],
                    buttons: [{
                        text    : this.langInsert,
                        handler : function(){
                            var frm = this.hrWindow.getComponent('insert-hr').getForm();
                            if (frm.isValid()) {
                                this.doInsertHR();
                            } else {
                                frm.findField('hrwidth').getEl().frame();
                            }
                        },
                        scope   : this
                    }, {
                        text    : this.langCancel,
                        handler : function(){
                            this.hrWindow.hide();
                        },
                        scope   : this
                    }],
                    listeners   : {
                        render  : (Ext.isGecko) ? this.focusHRLong : this.focusHR,
                        show    : this.focusHR,
                        move    : this.focusHR,
                        scope   : this
                    }
                });
            }
            this.hrWindow.show();
        }
    },
    // private
    focusHRLong: function(w){
        this.focus(w, 600);
    },
    // private
    focusHR: function(w){
        this.focus(w, 100);
    },
    /**
     * This method is just for focusing the text field use for entering the width of the HR.
     * It's extra messy because Firefox seems to take a while longer to render the window than other browsers,
     * particularly when Firbug is enabled, which is all the time if your like me.
     * Had to crank up the delay for focusing on render to 600ms for Firefox, and 100ms for all other focusing.
     * Other browsers seem to work fine in all cases with as little as 50ms delay. Compromise bleh!
     * @param {Object} win the window to focus
     * @param {Integer} delay the delay in milliseconds before focusing
     */
    focus: function(win, delay){
        win.getComponent('insert-hr').getForm().findField('hrwidth').focus(true, delay);
    },
    // private
    doInsertHR: function(){
        var frm = this.hrWindow.getComponent('insert-hr').getForm();
        if (frm.isValid()) {
            var hrwidth = frm.findField('hrwidth').getValue();
            if (hrwidth) {
                this.insertHR(hrwidth);
            } else {
                this.insertHR(this.defaultHRWidth);
            }
            frm.reset();
            this.hrWindow.hide();
        }
    },
    /**
     * Insert a horizontal rule into the document.
     * @param w String The width of the horizontal rule as the <tt>width</tt> attribute of the HR tag expects. ie: '100%' or '400' (pixels).
     */
    insertHR: function(w){
        this.cmp.insertAtCursor('<hr width="' + w + '">');
    }
});


/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class ProtoUL.ux.HtmlEditor.SpecialCharacters
 * @extends Ext.util.Observable
 * <p>A plugin that creates a button on the HtmlEditor for inserting special characters.</p>
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 */
Ext.define('ProtoUL.ux.HtmlEditor.SpecialCharacters', {
    extend: 'Ext.util.Observable',

    // SpecialCharacters language text
    langTitle   : 'Insert Special Character',
    langToolTip : 'Insert special languaje character ',
    langInsert  : 'Insert',
    langCancel  : 'Cancel',

    /**
     * @cfg {Array} specialChars
     * An array of additional characters to display for user selection.  Uses numeric portion of the ASCII HTML Character Code only. For example, to use the Copyright symbol, which is &#169; we would just specify <tt>169</tt> (ie: <tt>specialChars:[169]</tt>).
     */
    specialChars: [153],

    /**
     * @cfg {Array} charRange
     * Two numbers specifying a range of ASCII HTML Characters to display for user selection. Defaults to <tt>[160, 256]</tt>.
     */
    charRange   : [160, 256],

    // private
    chars: [],

    // private
    init: function(cmp){
        this.cmp = cmp;
        this.cmp.on('render', this.onRender, this);
    },

    // private
    onRender: function(){
        var btn = this.cmp.getToolbar().add({
            iconCls: 'x-edit-char',
            handler: showEspeciaCharTable,
            scope: this,
            tooltip: {
                title: this.langTitle, 
                text: this.langToolTip
            },
            overflowText: this.langTitle
        });
        function showEspeciaCharTable(){
            if (!this.chars.length) {
                if (this.specialChars.length) {
                    Ext.each(this.specialChars, function(c, i){
                        this.chars[i] = ['&#' + c + ';'];
                    }, this);
                }
                for (var i = this.charRange[0]; i < this.charRange[1]; i++) {
                    this.chars.push(['&#' + i + ';']);
                }
            }
            var charStore = Ext.create('Ext.data.ArrayStore',{
                fields  : ['char'],
                data    : this.chars
            });
            this.charWindow = Ext.create('Ext.window.Window',{
                title       : this.langTitle,
                width       : 436,
                height      : 245,
                layout      : 'fit',
                plain       : true,
                items       : [{
                    xtype       : 'dataview',
                    store       : charStore,
                    itemId      : 'charView',
                    autoHeight  : true,
                    multiSelect : true,
                    tpl         : new Ext.XTemplate('<tpl for="."><div class="char-item">{char}</div></tpl><div class="x-clear"></div>'),
                    overItemCls : 'char-over',
                    itemSelector: 'div.char-item',
                    trackOver   : true,
                    listeners: {
                        itemdblclick: function(view, record, item, index, e, ePpts){
                            this.insertChar(record.get('char'));
                            this.charWindow.close();
                        },
                        scope: this
                    }
                }],
                buttons: [{
                    text: this.langInsert,
                    handler: function(){
                        var dv = this.charWindow.down('#charView');
                        Ext.each(dv.getSelectedNodes(), function(node){
                            var c = dv.getRecord(node).get('char');
                              this.insertChar(c);
                        }, this);
                        this.charWindow.close();
                    },
                    scope: this
                }, {
                    text: this.langCancel,
                    handler: function(){
                        this.charWindow.close();
                    },
                    scope: this
                }]
            });
            this.charWindow.show();
        }
    },
    /**
     * Insert a single special character into the document.
     * @param c String The special character to insert (not just the numeric code, but the entire ASCII HTML entity).
     */
    insertChar: function(c){
        if (c) {
            this.cmp.insertAtCursor(c);
        }
    }
});

/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class ProtoUL.ux.HtmlEditor.Table
 * @extends Ext.util.Observable
 * <p>A plugin that creates a button on the HtmlEditor for making simple tables.</p>
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 */
Ext.define('ProtoUL.ux.HtmlEditor.Table', {
    extend: 'Ext.util.Observable',

    // Table language text
    langTitle       : 'Insert Table',
    langToolTip     : 'Insert table de NxN with configurable border',
    langInsert      : 'Insert',
    langCancel      : 'Cancel',
    langRows        : 'Rows',
    langColumns     : 'Columns',
    langBorder      : 'Border',
    langCellLabel   : 'Label Cells',

    // private
    cmd             : 'table',
    /**
     * @cfg {Boolean} showCellLocationText
     * Set true to display row and column informational text inside of newly created table cells.
     */
    showCellLocationText: true,
    /**
     * @cfg {String} cellLocationText
     * The string to display inside of newly created table cells.
     */
    cellLocationText: '{0}&nbsp;-&nbsp;{1}',
    /**
     * @cfg {Array} tableBorderOptions
     * A nested array of value/display options to present to the user for table border style. Defaults to a simple list of 5 varrying border types.
     *  
     */
    tableBorderOptions: [['1px dotted #000', 'Dotted'],['1px solid #000', 'Sold Thin'], ['2px solid #000', 'Solid Thick']],
//    ['none', 'None'], ['1px dashed #000', 'Dashed'],

    // private
    init: function(cmp){
        this.cmp = cmp;
        this.cmp.on('render', this.onRender, this);
    },

    // private
    onRender: function(){
        var btn = this.cmp.getToolbar().add('-', {
            iconCls: 'x-edit-table',
            handler: showTableIns,
            scope   : this,
            tooltip : {
                title: this.langTitle,
                text: this.langToolTip
            },
            overflowText: this.langTitle
        });
        
        function showTableIns(){
            if (!this.tableWindow){
                this.tableWindow = Ext.create('Ext.window.Window',{
                    title       : this.langTitle,
                    closeAction : 'hide',
                    width       : 300,
                    items       : [{
                        itemId      : 'insert-table',
                        xtype       : 'form',
                        border      : false,
                        plain       : true,
                        bodyStyle   : 'padding: 10px;',
                        labelWidth  : 65,
                        labelAlign  : 'right',
                        items       : [{
                            xtype           : 'numberfield',
                            allowBlank      : false,
                            allowDecimals   : false,
                            fieldLabel      : this.langRows,
                            name            : 'row',
                            width           : 150,
                            minValue        : 1,
                            value           : 1
                        }, {
                            xtype           : 'numberfield',
                            allowBlank      : false,
                            allowDecimals   : false,
                            fieldLabel      : this.langColumns,
                            name            : 'col',
                            width           : 150,
                            minValue        : 1,
                            value           : 1
                        }, {
                            xtype           : 'combo',
                            fieldLabel      : this.langBorder,
                            name            : 'border',
                            forceSelection  : true,
                            mode            : 'local',
                            store           : Ext.create('Ext.data.ArrayStore',{
                                autoDestroy : true,
                                fields      : ['spec', 'val'],
                                data        : this.tableBorderOptions
                            }),
                            triggerAction   : 'all',
                            value           : '1px dotted #000',
                            displayField    : 'val',
                            valueField      : 'spec',
                            anchor          : '-15',
                            editable        : false

                        }]
                    }],
                    buttons: [{
                        text    : this.langInsert,
                        handler : function(){
                            var frm = this.tableWindow.getComponent('insert-table').getForm();
                            if (frm.isValid()) {
                                var border = frm.findField('border').getValue();
                                var rowcol = [frm.findField('row').getValue(), frm.findField('col').getValue()];
                                if (rowcol.length == 2 && rowcol[0] > 0 && rowcol[1] > 0) {
                                    var colwidth = Math.floor(100/rowcol[1]);
                                    var html = "<table style='border-collapse: collapse'>";
                                    var cellText = '&nbsp;';
                                    for (var row = 0; row < rowcol[0]; row++) {
                                        html += "<tr>";
                                        for (var col = 0; col < rowcol[1]; col++) {
											html += "<td width='" + colwidth + "%' style='border: " + border + ";'>";
                                            html += cellText; 
                                            html += "</td>";
                                        }
                                        html += "</tr>";
                                    }
                                    html += "</table>";
                                    this.cmp.insertAtCursor(html);
                                }
                                this.tableWindow.hide();
                            }else{
                                if (!frm.findField('row').isValid()){
                                    frm.findField('row').getEl().frame();
                                }else if (!frm.findField('col').isValid()){
                                    frm.findField('col').getEl().frame();
                                }
                            }
                        },
                        scope: this
                    }, {
                        text    : this.langCancel,
                        handler : function(){
                            this.tableWindow.hide();
                        },
                        scope   : this
                    }]
                });
            }
            this.tableWindow.show();
        };
    }
});


/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class ProtoUL.ux.HtmlEditor.Word
 * @extends Ext.util.Observable
 * <p>A plugin that creates a button on the HtmlEditor for pasting text from Word without all the jibberish html.</p>
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 */
Ext.define('ProtoUL.ux.HtmlEditor.Word', {
    extend: 'Ext.util.Observable',

    // Word language text
    langTitle: 'Word Paste',
    langToolTip: 'Cleanse text pasted from Word or other Rich Text applications',
    wordPasteEnabled: true,

    // private
    curLength: 0,
    lastLength: 0,
    lastValue: '',

    // private
    init: function(cmp){

        this.cmp = cmp;
        this.cmp.on('render', this.onRender, this);
		this.cmp.on('initialize', this.onInit, this, {
			delay : 100,
			single : true
		});

    },
    // private
    onInit: function(){

        Ext.EventManager.on(this.cmp.getDoc(), {
            'keyup': this.checkIfPaste,
            scope: this
        });
        this.lastValue = this.cmp.getValue();
        this.curLength = this.lastValue.length;
        this.lastLength = this.lastValue.length;

    },
    // private
    checkIfPaste: function(e){

        var diffAt = 0;
        this.curLength = this.cmp.getValue().length;

        if (e.V == e.getKey() && e.ctrlKey && this.wordPasteEnabled){

            this.cmp.suspendEvents();

            diffAt = this.findValueDiffAt(this.cmp.getValue());
            var parts = [
                this.cmp.getValue().substr(0, diffAt),
                this.fixWordPaste(this.cmp.getValue().substr(diffAt, (this.curLength - this.lastLength))),
                this.cmp.getValue().substr((this.curLength - this.lastLength)+diffAt, this.curLength)
            ];
            this.cmp.setValue(parts.join(''));

            this.cmp.resumeEvents();
        }

        this.lastLength = this.cmp.getValue().length;
        this.lastValue = this.cmp.getValue();

    },
    // private
    findValueDiffAt: function(val){

        for ( var i=0;i<this.curLength;i++){
            if (this.lastValue[i] != val[i]){
                return i;
            }
        }

    },
    /**
     * Cleans up the jubberish html from Word pasted text.
     * @param wordPaste String The text that needs to be cleansed of Word jibberish html.
     * @return {String} The passed in text with all Word jibberish html removed.
     */
    fixWordPaste: function(wordPaste) {

		var removals = [/&nbsp;/ig, /[\r\n]/g, /<(xml|style)[^>]*>.*?<\/\1>/ig, /<\/?(meta|object|span)[^>]*>/ig, /<\/?[A-Z0-9]*:[A-Z]*[^>]*>/ig, /(lang|class|type|href|name|title|id|clear)=\"[^\"]*\"/ig, /style=(\'\'|\"\")/ig, /<![\[-].*?-*>/g, /MsoNormal/g, /<\\?\?xml[^>]*>/g, /<\/?o:p[^>]*>/g, /<\/?v:[^>]*>/g, /<\/?o:[^>]*>/g, /<\/?st1:[^>]*>/g, /&nbsp;/g, /<\/?SPAN[^>]*>/g, /<\/?FONT[^>]*>/g, /<\/?STRONG[^>]*>/g, /<\/?H1[^>]*>/g, /<\/?H2[^>]*>/g, /<\/?H3[^>]*>/g, /<\/?H4[^>]*>/g, /<\/?H5[^>]*>/g, /<\/?H6[^>]*>/g, /<\/?P[^>]*><\/P>/g, /<!--(.*)-->/g, /<!--(.*)>/g, /<!(.*)-->/g, /<\\?\?xml[^>]*>/g, /<\/?o:p[^>]*>/g, /<\/?v:[^>]*>/g, /<\/?o:[^>]*>/g, /<\/?st1:[^>]*>/g, /style=\"[^\"]*\"/g, /style=\'[^\"]*\'/g, /lang=\"[^\"]*\"/g, /lang=\'[^\"]*\'/g, /class=\"[^\"]*\"/g, /class=\'[^\"]*\'/g, /type=\"[^\"]*\"/g, /type=\'[^\"]*\'/g, /href=\'#[^\"]*\'/g, /href=\"#[^\"]*\"/g, /name=\"[^\"]*\"/g, /name=\'[^\"]*\'/g, / clear=\"all\"/g, /id=\"[^\"]*\"/g, /title=\"[^\"]*\"/g, /<span[^>]*>/g, /<\/?span[^>]*>/g, /<title>(.*)<\/title>/g, /class=/g, /<meta[^>]*>/g, /<link[^>]*>/g, /<style>(.*)<\/style>/g, /<w:[^>]*>(.*)<\/w:[^>]*>/g];

        Ext.each(removals, function(s){
            wordPaste = wordPaste.replace(s, "");
        });

        // keep the divs in paragraphs
        wordPaste = wordPaste.replace(/<div[^>]*>/g, "<p>");
        wordPaste = wordPaste.replace(/<\/?div[^>]*>/g, "</p>");
        return wordPaste;

    },

    // private
    onRender: function() {

        this.cmp.getToolbar().add( '-', {
            iconCls: 'x-edit-wordpaste',
            pressed: true,
            handler: function(t){
                t.toggle(!t.pressed);
                this.wordPasteEnabled = !this.wordPasteEnabled;
            },
            scope: this,
            tooltip: {
                text: this.langToolTip, 
                title: this.langTitle 
            },
            overflowText: this.langTitle
        });

    }
});


/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class ProtoUL.ux.HtmlEditor.MidasCommand
 * @extends Ext.util.Observable
 * <p>A base plugin for extending to create standard Midas command buttons.</p>
 * http://msdn.microsoft.com/en-us/library/ms533049%28v=VS.85%29.aspx
 * http://www.mozilla.org/editor/midas-spec.html
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 */

Ext.define('ProtoUL.ux.HtmlEditor.MidasCommand', {
    extend: 'Ext.util.Observable',
    // private
    init: function(cmp){
        this.cmp = cmp;
        this.btns = [];
        this.cmp.on('render', this.onRender, this);
        this.cmp.on('initialize', this.onInit, this, {
            delay: 100,
            single: true
        });
    },
    // private
    onInit: function(){
        Ext.EventManager.on(this.cmp.getDoc(), {
            'mousedown': this.onEditorEvent,
            'dblclick': this.onEditorEvent,
            'click': this.onEditorEvent,
            'keyup': this.onEditorEvent,
            buffer: 100,
            scope: this
        });
    },
    // private
    onRender: function(){
        var midasCmdButton, tb = this.cmp.getToolbar(), btn, iconCls;
        Ext.each(this.midasBtns, function(b){
            if (Ext.isObject(b)) {
                iconCls = (b.iconCls) ? b.iconCls : 'x-edit-' + b.cmd;
				if (b.value) {
					iconCls = iconCls + '-' + b.value.replace(/[<>\/]/g, '');
				}
                midasCmdButton = {
                    iconCls: iconCls,
                    handler: function(){
                        this.cmp.relayCmd(b.cmd, b.value);
                    },
                    scope: this,
					tooltip : b.tooltip || {
                        title: b.title
                    },
                    overflowText: b.overflowText || b.title
                };
            } else {
                midasCmdButton = Ext.create('Ext.toolbar.Separator');
            }
            btn = tb.add(midasCmdButton);
            if (b.enableOnSelection) {
                btn.disable();
            }
            this.btns.push(btn);
        }, this);
    },
    // private
    onEditorEvent: function(){
        var doc = this.cmp.getDoc();
        Ext.each(this.btns, function(b, i){
            if (this.midasBtns[i].enableOnSelection || this.midasBtns[i].disableOnSelection) {
                if (doc.getSelection) {
                    if ((this.midasBtns[i].enableOnSelection && doc.getSelection() !== '') || (this.midasBtns[i].disableOnSelection && doc.getSelection() === '')) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                } else if (doc.selection) {
                    if ((this.midasBtns[i].enableOnSelection && doc.selection.createRange().text !== '') || (this.midasBtns[i].disableOnSelection && doc.selection.createRange().text === '')) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                }
            }
            if (this.midasBtns[i].monitorCmdState) {
                b.toggle(doc.queryCommandState(this.midasBtns[i].cmd));
            }
        }, this);
    }
});



/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class ProtoUL.ux.HtmlEditor.IndentOutdent
 * @extends ProtoUL.ux.HtmlEditor.MidasCommand
 * <p>A plugin that creates two buttons on the HtmlEditor for indenting and outdenting of selected text.</p>
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 */
Ext.define('ProtoUL.ux.HtmlEditor.MidasFormat', {
    extend: 'ProtoUL.ux.HtmlEditor.MidasCommand',

    // private
    midasBtns: ['|', {
        enableOnSelection: true,
        cmd: 'removeFormat',
        tooltip: {
            text: 'Remove Formatting'
        },
        overflowText: 'Remove Formatting'
    }]
});