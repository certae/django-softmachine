
    OLD     defineProtoFormItem : function(parent, protoObj) {
        /* ---------------------------------------------------------------------
         * Se asegura de un tipo de section valida, La section es la unica que tiene
         * campos definidos Las cajas solo pueden contener otras sectiones
         * -----------------------------------------------------------------         */

        var prBox; 
        var prLayout = {
            items : []
        };


        // if (!(protoObj.ptType in oc(['fieldset', 'fieldcontainer', 'panel',  'HBox', 'Tab', 'VBox', 'Accordion', 'Grid']))) {
            // protoObj.ptType = 'Section'
            // Si tiene items se asigna un fieldset 
            // if(protoObj.items)  protoObj.ptType = 'HBox'
        // }


        if(parent.ptType == 'HBox') {
            // Las cajas al interior de un box no pueden estar collapsadas
            if(protoObj.collapsed)
                protoObj.collapsed = undefined;
        };

        // Define los campos
        if(protoObj.ptType == 'Section') {

            prLayout.xtype = 'container';
            prLayout.frame = true;
            // prLayout.border = 10;
            prLayout.margins = '10 10 0';
            prLayout.layout = 'anchor';
            prLayout.defaultType = 'textfield';
            prLayout.anchor = '100%';
            prLayout.defaults = {
                flex : 1,
                anchor : '100%', 
                xtype : 'textfield', 
                msgTarget : 'side',
                margins: '10 10 0', 
                allowBlank : false,
                readOnly : false
            };
            prLayout.fieldDefaults = {
                labelAlign: 'left',
                labelWidth: 100
                // labelStyle: 'font-weight:bold;padding:0',
                // hideLabel: true
            };
 
            if(protoObj.title || protoObj.collapsible || protoObj.frame) {
                prLayout.xtype = 'fieldset';
                prLayout.padding = 5;

                if(protoObj.title)
                    prLayout.title = protoObj.title;
                if(protoObj.collapsible)
                    prLayout.collapsible = protoObj.collapsible;
                if(protoObj.collapsed)
                    prLayout.collapsed = protoObj.collapsed;
                if(protoObj.checkField)
                    prLayout.checkboxToggle = true;
            }

            if(parent.ptType == 'Accordion') {
                prLayout.xtype = 'panel';
                prLayout.margins = '2';
                prLayout.frame = true;
                prLayout.bodyBorder = true;
            }

            if(protoObj.autoScroll) {
                prLayout.autoScroll = true;
                prLayout.xtype = 'panel';
            }

            // TRBL, TB RL, T RL B
            // if(protoObj.margins)
                // prLayout.defaults.margins = protoObj.margins;
            // if(protoObj.padding)
                // prLayout.defaults.padding = protoObj.padding;

            prLayout.fieldDefaults = {};
            if(protoObj.labelAlign)
                prLayout.fieldDefaults.labelAlign = protoObj.labelAlign;
            if(protoObj.labelWidth)
                prLayout.fieldDefaults.labelWidth = protoObj.labelWidth;
            if(protoObj.labelStyle)
                prLayout.fieldDefaults.labelStyle = protoObj.labelStyle;

            for(var ix in protoObj.formFields) {
                var prVar = protoObj.formFields[ix];
                prFld = this.defineProtoFormField(prVar)
                if(prFld)
                    prLayout.items.push(prFld);
            }

        } else if(protoObj.ptType == 'VBox') {

            // Se requiere un contenedor para poder incluir secciones en Tabs o Accordions
            prLayout.xtype = 'container';
            prLayout.layout = 'anchor';
            prLayout.anchor = '90%';
            prLayout.defaults = {
                anchor : '100%'
            }

            if(protoObj.height)
                prLayout.height = protoObj.height;
            if(protoObj.frame)
                prLayout.frame = protoObj.frame;

            if(protoObj.title || protoObj.collapsible) {
                prLayout.xtype = 'panel';
                if(protoObj.title)
                    prLayout.title = protoObj.title;
                if(protoObj.collapsible)
                    prLayout.collapsible = protoObj.collapsible;
                if(protoObj.collaped)
                    prLayout.collapsed = protoObj.collapsed;
            }

            for(var ix in protoObj.items) {
                var section = protoObj.items[ix];
                prBox = this.defineProtoFormItem(protoObj, section);
                if(prBox) {
                    prLayout.items.push(prBox);
                }
            }
            if(parent.ptType in                     oc(['Tab', 'Accordion'])) {
                prLayout.xtype = 'panel';
                prLayout.autoScroll = true;
            }

        } else if(protoObj.ptType == 'HBox') {

            prLayout.xtype = 'container';
            prLayout.layout = 'hbox';
            prLayout.defaultType = 'textfield';
            prLayout.anchor = '100%';

            if(protoObj.height)
                prLayout.height = protoObj.height;

            if(protoObj.title || protoObj.collapsible) {
                prLayout.xtype = 'fieldset';
                if(protoObj.title)
                    prLayout.title = protoObj.title;
                if(protoObj.collapsible)
                    prLayout.collapsible = protoObj.collapsible;
                if(protoObj.collaped)
                    prLayout.collapsed = protoObj.collapsed;
            }

            for(var ix in protoObj.items) {
                var section = protoObj.items[ix];
                prBox = this.defineProtoFormItem(protoObj, section);
                if(prBox) {
                    prBox.flex = 1;
                    if(ix < (protoObj.items.length - 1)) {
                        prBox.margins = '0 5 0 0'
                    } else
                        prBox.margins = '0 0 0 0'
                    prLayout.items.push(prBox);

                }
            }

        } else if(protoObj.ptType in oc(['Tab', 'Accordion'])) {

            if(protoObj.height)
                prLayout.height = protoObj.height;

            for(var ix in protoObj.items) {
                var section = protoObj.items[ix];
                prBox = this.defineProtoFormItem(protoObj, section);
                if(prBox) {
                    prBox.title = section.title;
                    if(protoObj.ptType == 'Accordion')
                        prBox.title = '<b>' + section.title + '<b>';
                    prBox.autoScroll = true;
                    prLayout.items.push(prBox);
                }
            }

            if(protoObj.ptType == 'Tab') {
                prLayout.xtype = 'tabpanel';
                prLayout.activeTab = 0;
            }
            if(protoObj.ptType == 'Accordion') {
                prLayout.layout = 'accordion';
                if(!protoObj.height)
                    prLayout.height = 200;

                if(parent.ptType == 'HBox') {
                    // Contenedor q soporte el box
                    var prAux = {
                        xtype : 'panel',
                        margins : '0'
                    }
                    prAux.items = [prLayout];
                    prLayout = prAux;
                }
            }

        }
        return prLayout;

    }, 
    
