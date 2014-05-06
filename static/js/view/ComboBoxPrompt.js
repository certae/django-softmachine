/**
 * @author Giovanni Victorette
 */
Ext.define('ProtoUL.view.ComboBoxPrompt', {
    extend: 'Ext.window.Window',
    alias: 'widget.comboboxprompt',

	requires: [
        'Ext.toolbar.Toolbar',
        'Ext.form.field.Display',
        'Ext.form.field.ComboBox',
        'Ext.button.Button',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.HBox',
        'Ext.ProgressBar'
    ],
    
     /**
     * @property
     * Button config that displays a single OK button
     */
    OK : 1,
    /**
     * @property
     * Button config that displays a single Yes button
     */
    YES : 2,
    /**
     * @property
     * Button config that displays a single No button
     */
    NO : 4,
    /**
     * @property
     * Button config that displays a single Cancel button
     */
    CANCEL : 8,
    /**
     * @property
     * Button config that displays OK and Cancel buttons
     */
    OKCANCEL : 9,
    QUESTION : Ext.baseCSSPrefix + 'message-box-question',

    // hide it by offsets. Windows are hidden on render by default.
    hideMode: 'offsets',
    closeAction: 'hide',
    resizable: false,
    title: '&#160;',

    defaultMinWidth: 250,
    defaultMaxWidth: 600,
    defaultMinHeight: 110,
    defaultMaxHeight: 500,
    
    // Forcibly set these to null on the prototype to override anything set higher in
    // the hierarchy
    minWidth: null,
    maxWidth: null,
    minHeight: null,
    maxHeight: null,
    constrain: true,

    cls: [Ext.baseCSSPrefix + 'message-box', Ext.baseCSSPrefix + 'hide-offsets'],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    // We want to shrinkWrap around all docked items
    shrinkWrapDock: true,

    /**
     * @property
     * The minimum width in pixels of the message box if it is a progress-style dialog.  This is useful
     * for setting a different minimum width than text-only dialogs may need.
     */
    minProgressWidth : 250,
    /**
     * @property
     * The minimum width in pixels of the message box if it is a prompt dialog.  This is useful
     * for setting a different minimum width than text-only dialogs may need.
     */
    minPromptWidth: 250,
    //<locale type="object">
    /**
     * @property
     * An object containing the default button text strings that can be overriden for localized language support.
     * Supported properties are: ok, cancel, yes and no.  Generally you should include a locale-specific
     * resource file for handling language support across the framework.
     * Customize the default text like so:
     *
     *     Ext.window.MessageBox.buttonText.yes = "oui"; //french
     */
    buttonText: {
        ok: 'OK',
        yes: 'Yes',
        no: 'No',
        cancel: 'Cancel'
    },
    //</locale>

    buttonIds: [
        'ok', 'yes', 'no', 'cancel'
    ],

    //<locale type="object">
    titleText: {
        confirm: 'Confirm',
        prompt: 'Prompt',
        wait: 'Loading...',
        alert: 'Attention'
    },
    //</locale>

    iconHeight: 35,
    iconWidth: 50,
    
    ariaRole: 'alertdialog',

    makeButton: function(btnIdx) {
        var btnId = this.buttonIds[btnIdx];
        return new Ext.button.Button({
            handler: this.btnCallback,
            itemId: btnId,
            scope: this,
            text: this.buttonText[btnId],
            minWidth: 75
        });
    },

    btnCallback: function(btn) {
        var me = this,
            value,
            field;

        field = me.comboBox;
        value = field.getValue();
        field.reset();
        // if (me.cfg.prompt || me.cfg.multiline) {
            // if (me.cfg.multiline) {
            // } else {
                // field = me.textField;
            // }
        // }

        // Component.onHide blurs the active element if the Component contains the active element
        me.hide();
        me.userCallback(btn.itemId, value, me.cfg);
    },

    hide: function() {
        var me = this,
            cls = me.cfg.cls;

        me.progressBar.reset();
        if (cls) {
            me.removeCls(cls);
        }
        me.callParent(arguments);
    },

    constructor: function(cfg) {
        var me = this;

        me.callParent(arguments);

        // set the default min/max/Width/Height to the initially configured min/max/Width/Height
        // so that it will be used as the default when reconfiguring.
        me.minWidth = me.defaultMinWidth = (me.minWidth || me.defaultMinWidth);
        me.maxWidth = me.defaultMaxWidth = (me.maxWidth || me.defaultMaxWidth);
        me.minHeight = me.defaultMinHeight = (me.minHeight || me.defaultMinHeight);
        me.maxHeight = me.defaultMaxHeight = (me.maxHeight || me.defaultMaxHeight);
    },

    initComponent: function(cfg) {
        var me = this,
            baseId = me.id,
            i, button;

        me.title = '&#160;';

        me.topContainer = new Ext.container.Container({
            layout: 'hbox',
            padding: 5,
            style: {
                overflow: 'hidden'
            },
            items: [
                me.iconComponent = new Ext.Component({
                    width: me.iconWidth,
                    height: me.iconHeight
                }),
                me.promptContainer = new Ext.container.Container({
                    flex: 1,
                    layout: 'anchor',
                    items: [
                    	me.msg = new Ext.form.field.Display({
                            id: baseId + '-displayfield',
                            cls: me.baseCls + '-text'
                        }),
                        me.comboBox = new Ext.form.field.ComboBox({
                            id: baseId + '-combo',
                            anchor: '100%',
                            enableKeyEvents: true,
                            displayField: 'description',
                            valueField: 'id',
                            queryMode: 'local',
				            selectOnFocus: true,
				            triggerAction: 'all',
			                allowBlank: false,
                            listeners: {
                                keydown: me.onPromptKey,
                                scope: me
                            }
                        })
                    ]
                })
            ]
        });
        me.progressBar = new Ext.ProgressBar({
            id: baseId + '-progressbar',
            margin: '0 10 10 10'
        });

        me.items = [me.topContainer, me.progressBar];

        // Create the buttons based upon passed bitwise config
        me.msgButtons = [];
        for (i = 0; i < 4; i++) {
            button = me.makeButton(i);
            me.msgButtons[button.itemId] = button;
            me.msgButtons.push(button);
        }
        me.bottomTb = new Ext.toolbar.Toolbar({
            id: baseId + '-toolbar',
            ui: 'footer',
            dock: 'bottom',
            layout: {
                pack: 'center'
            },
            items: [
                me.msgButtons[0],
                me.msgButtons[1],
                me.msgButtons[2],
                me.msgButtons[3]
            ]
        });
        me.dockedItems = [me.bottomTb];
        me.on('close', me.onClose, me);
        me.callParent();
    },

    onClose: function(){
        var btn = this.header.child('[type=close]');
        // Give a temporary itemId so it can act like the cancel button
        btn.itemId = 'cancel';
        this.btnCallback(btn);
        delete btn.itemId;
    },

    onPromptKey: function(textField, e) {
        var me = this;

        if (e.keyCode === e.RETURN || e.keyCode === 10) {
            if (me.msgButtons.ok.isVisible()) {
                me.msgButtons.ok.handler.call(me, me.msgButtons.ok);
            } else if (me.msgButtons.yes.isVisible()) {
                me.msgButtons.yes.handler.call(me, me.msgButtons.yes);
            }
        }
    },

    reconfigure: function(cfg) {
        var me = this,
            buttons = 0,
            hideToolbar = true,
            oldButtonText = me.buttonText,
            resizer = me.resizer,
            resizeTracker, width, height, i, comboBox, textField,
            msg, progressBar, msgButtons;

        // Restore default buttonText before reconfiguring.
        me.updateButtonText();

        cfg = cfg || {};
        me.cfg = cfg;
        if (cfg.width) {
            width = cfg.width;
        }

        if (cfg.height) {
            height = cfg.height;
        }

        me.minWidth = cfg.minWidth || me.defaultMinWidth;
        me.maxWidth = cfg.maxWidth || me.defaultMaxWidth;
        me.minHeight = cfg.minHeight || me.defaultMinHeight;
        me.maxHeight = cfg.maxHeight || me.defaultMaxHeight;

        if (resizer) {
            resizeTracker = resizer.resizeTracker;
            resizer.minWidth = resizeTracker.minWidth = me.minWidth;
            resizer.maxWidth = resizeTracker.maxWidth = me.maxWidth;
            resizer.minHeight = resizeTracker.minHeight = me.minHeight;
            resizer.maxHeight = resizeTracker.maxHeight = me.maxHeight;
        }

        // Default to allowing the Window to take focus.
        delete me.defaultFocus;
        if (cfg.defaultFocus) {
            me.defaultFocus = cfg.defaultFocus;
        }

        // clear any old animateTarget
        me.animateTarget = cfg.animateTarget || undefined;

        // Defaults to modal
        me.modal = cfg.modal !== false;

        // Show the title/icon
        me.setTitle(cfg.title || '');
        me.setIconCls(cfg.iconCls || '');

        // Extract button configs
        if (Ext.isObject(cfg.buttons)) {
            me.buttonText = cfg.buttons;
            buttons = 0;
        } else {
            me.buttonText = cfg.buttonText || me.buttonText;
            buttons = Ext.isNumber(cfg.buttons) ? cfg.buttons : 0;
        }

        // Apply custom-configured buttonText
        // Infer additional buttons from the specified property names in the buttonText object
        buttons = buttons | me.updateButtonText();

        // Restore buttonText. Next run of reconfigure will restore to prototype's buttonText
        me.buttonText = oldButtonText;

        // During the on render, or size resetting layouts, and in subsequent hiding and showing, we need to
        // suspend layouts, and flush at the end when the Window's children are at their final visibility.
        Ext.suspendLayouts();
        delete me.width;
        delete me.height;
        if (width || height) {
            if (width) {
                me.setWidth(width);
            }

            if (height) {
                me.setHeight(height);
            }
        }
        me.hidden = false;
        if (!me.rendered) {
            me.render(Ext.getBody());
        }

        // Hide or show the close tool
        me.closable = cfg.closable !== false && !cfg.wait;
        me.header.child('[type=close]').setVisible(me.closable);

        // Hide or show the header
        if (!cfg.title && !me.closable && !cfg.iconCls) {
            me.header.hide();
        } else {
            me.header.show();
        }

        // Default to dynamic drag: drag the window, not a ghost
        me.liveDrag = !cfg.proxyDrag;

        // wrap the user callback
        me.userCallback = Ext.Function.bind(cfg.callback ||cfg.fn || Ext.emptyFn, cfg.scope || Ext.global);

        // Hide or show the icon Component
        me.setIcon(cfg.icon, cfg.iconWidth, cfg.iconHeight);

        // Hide or show the message area
        msg = me.msg;
        if (cfg.msg) {
            msg.setValue(cfg.msg);
            msg.show();
        } else {
            msg.hide();
        }

        comboBox = me.comboBox;
    	comboBox.bindStore(cfg.store);
    	comboBox.setValue(cfg.store.getAt('0').get('id'));
        comboBox.show();
        
        me.defaultFocus = comboBox;

        // Hide or show the progress bar
        progressBar = me.progressBar;
        if (cfg.progress || cfg.wait) {
            progressBar.show();
            me.updateProgress(0, cfg.progressText);
            if(cfg.wait === true){
                progressBar.wait(cfg.waitConfig);
            }
        } else {
            progressBar.hide();
        }

        // Hide or show buttons depending on flag value sent.
        msgButtons = me.msgButtons;
        for (i = 0; i < 4; i++) {
            if (buttons & Math.pow(2, i)) {

                // Default to focus on the first visible button if focus not already set
                if (!me.defaultFocus) {
                    me.defaultFocus = msgButtons[i];
                }
                msgButtons[i].show();
                hideToolbar = false;
            } else {
                msgButtons[i].hide();
            }
        }

        // Hide toolbar if no buttons to show
        if (hideToolbar) {
            me.bottomTb.hide();
        } else {
            me.bottomTb.show();
        }
        Ext.resumeLayouts(true);
    },

    /**
     * @private
     * Set button text according to current buttonText property object
     * @return {Number} The buttons bitwise flag based upon the button IDs specified in the buttonText property.
     */
    updateButtonText: function() {
        var me = this,
            buttonText = me.buttonText,
            buttons = 0,
            btnId,
            btn;

        for (btnId in buttonText) {
            if (buttonText.hasOwnProperty(btnId)) {
                btn = me.msgButtons[btnId];
                if (btn) {
                    if (me.cfg && me.cfg.buttonText) {
                        buttons = buttons | Math.pow(2, Ext.Array.indexOf(me.buttonIds, btnId));
                    }
                    if (btn.text != buttonText[btnId]) {
                        btn.setText(buttonText[btnId]);
                    }
                }
            }
        }
        return buttons;
    },

    show: function(cfg) {
        var me = this,
            visibleFocusables;

        // If called during global layout suspension, make the call after layout resumption
        if (Ext.AbstractComponent.layoutSuspendCount) {
            Ext.on({
                resumelayouts: function() {
                    me.show(cfg);
                },
                single: true
            });
            return me;
        }

        me.reconfigure(cfg);
        if (cfg.cls) {
            me.addCls(cfg.cls);
        }

        // Do not steal focus from anything that may be focused if the MessageBox has no visible focusable
        // items. For example, a "wait" message box should not get focus.
        visibleFocusables = me.query('combo:not([hidden]),button:not([hidden])');
        me.preventFocusOnActivate = !visibleFocusables.length;

        // Set the flag, so that the parent show method performs the show procedure that we need.
        // ie: animation from animTarget, onShow processing and focusing.
        me.hidden = true;
        me.callParent();
        return me;
    },

    onShow: function() {
        this.callParent(arguments);
        this.center();
    },

    updateText: function(text) {
        this.msg.setValue(text);
    },

    /**
     * Adds the specified icon to the dialog.  By default, the class 'x-messagebox-icon' is applied for default
     * styling, and the class passed in is expected to supply the background image url. Pass in empty string ('')
     * to clear any existing icon. This method must be called before the MessageBox is shown.
     * The following built-in icon classes are supported, but you can also pass in a custom class name:
     *
     *     Ext.window.MessageBox.INFO
     *     Ext.window.MessageBox.WARNING
     *     Ext.window.MessageBox.QUESTION
     *     Ext.window.MessageBox.ERROR
     *
     * @param {String} icon A CSS classname specifying the icon's background image url, or empty string to clear the icon
     * @param {Number} [width] The width of the icon. If not specified, the default is used
     * @param {Number} [height] The height of the icon. If not specified, the default is used
     * @return {Ext.window.MessageBox} this
     */
    setIcon : function(icon, width, height) {
        var me = this,
            iconCmp = me.iconComponent,
            cls = me.messageIconCls;

        if (cls) {
            iconCmp.removeCls(cls);
        }

        if (icon) {
            iconCmp.show();
            iconCmp.setSize(width || me.iconWidth, height || me.iconHeight);
            iconCmp.addCls(Ext.baseCSSPrefix + 'dlg-icon');
            iconCmp.addCls(me.messageIconCls = icon);
        } else {
            iconCmp.removeCls(Ext.baseCSSPrefix + 'dlg-icon');
            iconCmp.hide();
        }
        return me;
    },

    /**
     * Updates a progress-style message box's text and progress bar. Only relevant on message boxes
     * initiated via {@link Ext.window.MessageBox#progress} or {@link Ext.window.MessageBox#wait},
     * or by calling {@link Ext.window.MessageBox#method-show} with progress: true.
     *
     * @param {Number} [value=0] Any number between 0 and 1 (e.g., .5)
     * @param {String} [progressText=''] The progress text to display inside the progress bar.
     * @param {String} [msg] The message box's body text is replaced with the specified string (defaults to undefined
     * so that any existing body text will not get overwritten by default unless a new value is passed in)
     * @return {Ext.window.MessageBox} this
     */
    updateProgress : function(value, progressText, msg){
        this.progressBar.updateProgress(value, progressText);
        if (msg){
            this.updateText(msg);
        }
        return this;
    },

    onEsc: function() {
        if (this.closable !== false) {
            this.callParent(arguments);
        }
    },

    /**
     * Displays a message box with OK and Cancel buttons prompting the user to enter some text (comparable to JavaScript's prompt).
     * The prompt can be a single-line or multi-line textbox.  If a callback function is passed it will be called after the user
     * clicks either button, and the id of the button that was clicked (could also be the top-right
     * close button, which will always report as "cancel") and the text that was entered will be passed as the two parameters to the callback.
     *
     * @param {String} title The title bar text
     * @param {Object} options
     * @param {Function} [fn] The callback function invoked after the message box is closed.
     * See {@link #method-show} method for details.
     * @param {Object} [scope=window] The scope (`this` reference) in which the callback is executed.
     * property, or the height in pixels to create the textbox/
     * @param {String} [value=''] Default value of the text input element
     * @return {ProtoUL.view.ComboBoxPrompt} this
     */
    prompt : function(cfg, opt, fn, scope, value){
        if (Ext.isString(cfg)) {
            cfg = {
                prompt: true,
                title: cfg,
                minWidth: this.minPromptWidth,
                msg: opt.label,
                buttons: this.OKCANCEL,
                callback: fn,
                scope: scope,
                store: opt.store,
                value: value,
                userData: opt.userData
            };
        }
        return this.show(cfg);
    },

    /**
     * Displays a message box with a progress bar.
     *
     * You are responsible for updating the progress bar as needed via {@link Ext.window.MessageBox#updateProgress}
     * and closing the message box when the process is complete.
     *
     * @param {String} title The title bar text
     * @param {String} msg The message box body text
     * @param {String} [progressText=''] The text to display inside the progress bar
     * @return {Ext.window.MessageBox} this
     */
    progress : function(cfg, msg, progressText){
        if (Ext.isString(cfg)) {
            cfg = {
                title: cfg,
                msg: msg,
                progress: true,
                progressText: progressText
            };
        }
        return this.show(cfg);
    }
}, function() {
    /**
     * @class _SM.ComboBoxPrompt
     * @alternateClassName _SM.ComboPrompt
     * @extends ProtoUL.view.ComboBoxPrompt
     * @singleton
     * Singleton instance of {@link ProtoUL.view.ComboBoxPrompt}.
     */
    _SM.ComboBoxPrompt = _SM.ComboPrompt = new this();
});
