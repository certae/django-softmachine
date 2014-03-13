/*
 * Basada en  Examples.Ux.statusBar
 *
 * Modif :
 *
 *      showBusy  -->  showBusyI  ( internal )
 *      showBusy ( text ,  clearTemp  ) para autolimpiar el status
 *
 */

/*jslint nomen: true, sloppy : true, white : true, sub : true */
/*global Ext */
/*global _SM */

Ext.define('ProtoUL.ux.StatusBar', {
    extend: 'Ext.toolbar.Toolbar',
    alternateClassName: 'Ext.ux.StatusBar',
    alias: 'widget.statusbar',
    requires: ['Ext.toolbar.TextItem'],
    cls: 'x-statusbar',

    busyIconCls: 'x-status-busy',
    busyText: _SM.__language.StatusBar_Message_Loading,
    autoClear: 5000,
    emptyText: '&#160;',
    activeThreadId: 0,

    // defaults to use when the status is cleared:
    defaultText: '',
    // defaultIconCls: 'x-status-valid',

    // values to set initially:
    text: _SM.__language.StatusBar_Message_Ready,
    iconCls: 'ready-icon',

    // Para manejar las cargas de datos del servidor
    busyCount: 0,

    initComponent: function() {

        var right = this.statusAlign === 'right';
        this.callParent(arguments);
        this.currIconCls = this.iconCls || this.defaultIconCls;
        this.statusEl = Ext.create('Ext.toolbar.TextItem', {
            cls: 'x-status-text ' + (this.currIconCls || ''),
            text: this.text || this.defaultText || ''
        });
        if (right) {
            this.cls += ' x-status-right';
            this.add('->');
            this.add(this.statusEl);
        } else {
            this.insert(0, this.statusEl);
            this.insert(1, '->');
        }

        // any standard Toolbar items:
        this.add([{
            itemId: 'errBt',
            xtype: 'splitbutton',
            text: _SM.__language.StatusBar_Text_Clean_Button,
            tooltip: _SM.__language.StatusBar_Tooltip_Clean_Button,
            scope: this,
            iconCls: 'comment_delete',
            handler: this.clearErrCount,

            // TITLE
            menu: new Ext.menu.Menu({
                items: [{
                    text: 'ClearTabs',
                    tooltip: 'clear all tabs',
                    iconCls: 'icon-4',
                    handler: function() {
                        _SM.__TabContainer.closeAllTabs();
                        _SM._cllPCI = {};
                    }
                }]
            })

        }, {
            itemId: 'openTaskForm',
            xtype: 'button',
            text: _SM.__language.StatusBar_Text_Task_Button,
            hidden: true,
            scope: this,
            iconCls: 'taskManager',
            handler: this.openTaskForm

        }, '-', {
            // xtype: 'button',
            // iconCls: 'icon-script_gear',
            // text: _SM.__language.StatusBar_Text_Command_Button,
            // handler: this.command
            // }, {

            xtype: 'splitbutton',
            text: _SM._UserInfo.fullName || _SM._UserInfo.userName,
            iconCls: 'icon-user',
            menu: new Ext.menu.Menu({
                items: [{
                    text: _SM.__language.StatusBar_Text_Close_Session,
                    handler: this.closeSession,
                    iconCls: 'icon-logout'
                }, {
                    text: 'Diagram',
                    handler: this.openDiagramEditor,
                    iconCls: 'icon-model'
                }]
            })
        }]);

        // TODO: Boton q permita clear del sb y guarde en el tooltip la informacion de errores
        this.errBt = this.getComponent('errBt');

    },

    command: function() {
        Ext.MessageBox.prompt('Comando', 'Digite El Comando', function(btn, nemo) {
            if (btn == 'ok') {

            }
        }, this, false, ValorPrompt);
    },

    closeSession: function() {
        Ext.Ajax.request({
            url: _SM._PConfig.urlLogOut,
            success: function(response) {
                location.reload(true);
            },
            failure: function() {
                location.reload(true);
            }
        });
    },

    clearErrCount: function() {
        // this.errBt.hide()

        this.errBt.tooltip = '';
        this.busyCount = 0;
        this.clearStatus({
            useDefaults: true
        });
    },

    setStatus: function(o) {
        var me = this;
        o = o || {};

        var a = me.isLayoutSuspended();

        Ext.suspendLayouts();

        if (Ext.isString(o)) {
            o = {
                text: o
            };
        }
        if (o.text !== undefined) {
            me.setText(o.text);
        }
        if (o.iconCls !== undefined) {
            me.setIcon(o.iconCls);
        }
        if (o.clear) {
            var c = o.clear, wait = me.autoClear, defaults = {
                useDefaults: true,
                anim: true
            };
            if (Ext.isObject(c)) {
                c = Ext.applyIf(c, defaults);
                if (c.wait) {
                    wait = c.wait;
                }
            } else if (Ext.isNumber(c)) {
                wait = c;
                c = defaults;
            } else if (Ext.isBoolean(c)) {
                c = defaults;
            }
            c.threadId = this.activeThreadId;
            Ext.defer(me.clearStatus, wait, me, [c]);
        }
        Ext.resumeLayouts(true);
        return me;
    },

    clearStatus: function(o) {
        o = o || {};
        var me = this, statusEl = me.statusEl;
        if (o.threadId && o.threadId !== me.activeThreadId) {
            return me;
        }
        var text = o.useDefaults ? me.defaultText : me.emptyText, iconCls = o.useDefaults ? (me.defaultIconCls ? me.defaultIconCls : '') : '';
        if (o.anim) {
            statusEl.el.puff({
                remove: false,
                useDisplay: true,
                callback: function() {
                    statusEl.el.show();
                    me.setStatus({
                        text: text,
                        iconCls: iconCls
                    });
                }
            });
        } else {
            me.setStatus({
                text: text,
                iconCls: iconCls
            });
        }
        return me;
    },

    setText: function(text) {
        var me = this;
        me.activeThreadId++;
        me.text = text || '';
        if (me.rendered) {
            me.statusEl.setText(me.text);
        }
        return me;
    },

    getText: function() {
        return this.text;
    },

    setIcon: function(cls) {
        var me = this;
        me.activeThreadId++;
        cls = cls || '';
        if (me.rendered) {
            if (me.currIconCls) {
                me.statusEl.removeCls(me.currIconCls);
                me.currIconCls = null;
            }
            if (cls.length > 0) {
                me.statusEl.addCls(cls);
                me.currIconCls = cls;
            }
        } else {
            me.currIconCls = cls;
        }
        return me;
    },

    showBusyI: function(o) {
        if (Ext.isString(o)) {
            o = {
                text: o
            };
        }
        o = Ext.applyIf(o || {}, {
            text: this.busyText,
            iconCls: this.busyIconCls
        });
        return this.setStatus(o);
    },

    showBusy: function(text, origin, clear) {

        this.showBusyI(text);

        if (clear) {
            Ext.defer(function() {
                this.clearStatus({
                    useDefaults: true
                });
            }, clear, this);
        } else {
            // console.log( 'busy: ' + origin,  text, this.busyCount )
            this.busyCount++;
        }
    },

    showMessage: function(text, origin, clear) {

        var o = {
            text: origin + ' ' + text,
            iconCls: this.iconCls
        };

        if (clear) {
            Ext.defer(function() {
                this.clearStatus({
                    useDefaults: true
                });
            }, clear, this);
        }

        return this.setStatus(o);

    },

    showError: function(text, origin) {

        // console.log( 'error :' + origin  ,  text )
        this.setStatus({
            text: 'Oops! ' + text,
            iconCls: 'x-status-error',
            clear: true
        });

    },

    showWarning: function(text, origin) {

        this.setStatus({
            text: text,
            iconCls: 'x-status-warning',
            clear: true
        });

    },

    clear: function(text, origin) {

        this.busyCount--;
        if (this.busyCount <= 0) {
            this.busyCount = 0;
            this.clearStatus({
                useDefaults: true
            });
        }

    },

    openTaskForm: function() {

        var taskCont = Ext.create('ProtoUL.protoOrg.tasks.TaskController');
        taskCont.openTaskForm();

    },

    openDiagramEditor: function() {
    	scriptLibrary = [];
        createJSFilesLibrary();
        
        loadJsFilesSequentially(scriptLibrary, 0, function(){
	        var win = Ext.create('ProtoUL.view.diagram.DiagramMainView');
	        win.show();
	   });
    }
});

var dbModel = {
    shape: {}
};


function loadJsFilesSequentially(scriptsCollection, startIndex, librariesLoadedCallback) {
    if (scriptsCollection[startIndex]) {
    	if (filesadded.indexOf("[" + scriptsCollection[startIndex] + "]") === -1){
	        var fileref = document.createElement('script');
	        fileref.setAttribute("type", "text/javascript");
	        fileref.setAttribute("src", scriptsCollection[startIndex]);
	        fileref.onload = function() {
	            startIndex = startIndex + 1;
	            loadJsFilesSequentially(scriptsCollection, startIndex, librariesLoadedCallback);
	        };
	
	        document.getElementsByTagName("head")[0].appendChild(fileref);
	        filesadded += "[" + scriptsCollection[startIndex] + "]";
    	} else {
    		startIndex = startIndex + 1;
	        loadJsFilesSequentially(scriptsCollection, startIndex, librariesLoadedCallback);
    	}
    } else {
        librariesLoadedCallback();
    }
}

// An array of scripts you want to load in order
var scriptLibrary = [];
//list of files already added
var filesadded = "";

function displayJSON(canvas) {
    var writer = new draw2d.io.json.Writer();
    writer.marshal(canvas, function(json) {
        $("#json").text(JSON.stringify(json, null, 2));
    });
}

function createJSFilesLibrary() {
    scriptLibrary.push("static/js2db/lib/jquery-1.10.2.min.js");
    scriptLibrary.push("static/js2db/lib/jquery.autoresize.js");
    scriptLibrary.push("static/js2db/lib/jquery-touch_punch.js");
    scriptLibrary.push("static/js2db/lib/jquery.contextmenu.js");

    scriptLibrary.push("static/js2db/lib/shifty.js");

    scriptLibrary.push("static/js2db/lib/raphael.js");
    scriptLibrary.push("static/js2db/lib/rgbcolor.js");
    scriptLibrary.push("static/js2db/lib/canvg.js");

    scriptLibrary.push("static/js2db/lib/Class.js");

    scriptLibrary.push("static/js2db/lib/json2.js");

    scriptLibrary.push("static/js2db/lib/pathfinding-browser.min.js");

    scriptLibrary.push("static/js2db/draw2d/src/draw2d.js");
    scriptLibrary.push("static/js2db/draw2d/src/util/Debug.js");
    scriptLibrary.push("static/js2db/draw2d/src/util/Color.js");
    scriptLibrary.push("static/js2db/draw2d/src/util/ArrayList.js");
    scriptLibrary.push("static/js2db/draw2d/src/util/SVGUtil.js");
    scriptLibrary.push("static/js2db/draw2d/src/util/UUID.js");
    scriptLibrary.push("static/js2db/draw2d/src/util/spline/Spline.js");
    scriptLibrary.push("static/js2db/draw2d/src/util/spline/CubicSpline.js");
    scriptLibrary.push("static/js2db/draw2d/src/util/spline/CatmullRomSpline.js");
    scriptLibrary.push("static/js2db/draw2d/src/util/spline/BezierSpline.js");
    scriptLibrary.push("static/js2db/draw2d/src/geo/PositionConstants.js");
    scriptLibrary.push("static/js2db/draw2d/src/geo/Point.js");
    scriptLibrary.push("static/js2db/draw2d/src/geo/Rectangle.js");
    scriptLibrary.push("static/js2db/draw2d/src/geo/Ray.js");
    scriptLibrary.push("static/js2db/draw2d/src/command/CommandType.js");
    scriptLibrary.push("static/js2db/draw2d/src/command/Command.js");
    scriptLibrary.push("static/js2db/draw2d/src/command/CommandCollection.js");
    scriptLibrary.push("static/js2db/draw2d/src/command/CommandStack.js");
    scriptLibrary.push("static/js2db/draw2d/src/command/CommandStackEvent.js");
    scriptLibrary.push("static/js2db/draw2d/src/command/CommandStackEventListener.js");
    scriptLibrary.push("static/js2db/draw2d/src/command/CommandMove.js");
    scriptLibrary.push("static/js2db/draw2d/src/command/CommandMoveLine.js");
    scriptLibrary.push("static/js2db/draw2d/src/command/CommandMoveJunction.js");
    scriptLibrary.push("static/js2db/draw2d/src/command/CommandResize.js");
    scriptLibrary.push("static/js2db/draw2d/src/command/CommandConnect.js");
    scriptLibrary.push("static/js2db/draw2d/src/command/CommandReconnect.js");
    scriptLibrary.push("static/js2db/draw2d/src/command/CommandDelete.js");
    scriptLibrary.push("static/js2db/draw2d/src/command/CommandAdd.js");
    scriptLibrary.push("static/js2db/draw2d/src/command/CommandAddJunctionPoint.js");
    scriptLibrary.push("static/js2db/draw2d/src/command/CommandRemoveJunctionPoint.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/connection/ConnectionRouter.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/connection/DirectRouter.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/connection/JunctionRouter.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/connection/ManhattanConnectionRouter.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/connection/ManhattanBridgedConnectionRouter.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/connection/CircuitConnectionRouter.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/connection/SplineConnectionRouter.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/connection/FanConnectionRouter.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/connection/MazeConnectionRouter.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/connection/MuteableManhattanConnectionRouter.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/connection/SketchConnectionRouter.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/mesh/MeshLayouter.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/mesh/ExplodeLayouter.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/mesh/ProposedMeshChange.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/locator/Locator.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/locator/PortLocator.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/locator/InputPortLocator.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/locator/OutputPortLocator.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/locator/ConnectionLocator.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/locator/ManhattanMidpointLocator.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/locator/PolylineMidpointLocator.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/locator/TopLocator.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/locator/BottomLocator.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/locator/LeftLocator.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/locator/RightLocator.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/locator/CenterLocator.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/EditPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/canvas/CanvasPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/canvas/SelectionPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/canvas/SingleSelectionPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/canvas/PanningSelectionPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/canvas/BoundingboxSelectionPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/canvas/ReadOnlySelectionPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/canvas/DecorationPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/canvas/FadeoutDecorationPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/canvas/CoronaDecorationPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/canvas/SnapToEditPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/canvas/SnapToGridEditPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/canvas/ShowGridEditPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/canvas/SnapToGeometryEditPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/figure/DragDropEditPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/figure/RegionEditPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/figure/HorizontalEditPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/figure/VerticalEditPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/figure/SelectionFeedbackPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/figure/RectangleSelectionFeedbackPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/figure/BigRectangleSelectionFeedbackPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/figure/RoundRectangleSelectionFeedbackPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/figure/BusSelectionFeedbackPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/figure/VBusSelectionFeedbackPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/figure/HBusSelectionFeedbackPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/figure/AntSelectionFeedbackPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/figure/GlowSelectionFeedbackPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/figure/SlimSelectionFeedbackPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/line/LineSelectionFeedbackPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/line/JunctionSelectionFeedbackPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/port/PortFeedbackPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/port/ElasticStrapFeedbackPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/policy/port/IntrusivePortsFeedbackPolicy.js");
    scriptLibrary.push("static/js2db/draw2d/src/Canvas.js");
    scriptLibrary.push("static/js2db/draw2d/src/Selection.js");
    scriptLibrary.push("static/js2db/draw2d/src/Figure.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/node/Node.js");
    scriptLibrary.push("static/js2db/draw2d/src/VectorFigure.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/basic/Rectangle.js");
    scriptLibrary.push("static/js2db/draw2d/src/SetFigure.js");
    scriptLibrary.push("static/js2db/draw2d/src/SVGFigure.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/node/Hub.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/node/HorizontalBus.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/node/VerticalBus.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/node/Fulcrum.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/basic/Oval.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/basic/Circle.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/basic/Label.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/basic/Line.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/basic/PolyLine.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/basic/Diamond.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/basic/Image.js");
    scriptLibrary.push("static/js2db/draw2d/src/Connection.js");
    scriptLibrary.push("static/js2db/draw2d/src/ResizeHandle.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/basic/LineResizeHandle.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/basic/LineStartResizeHandle.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/basic/LineEndResizeHandle.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/basic/JunctionResizeHandle.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/basic/GhostJunctionResizeHandle.js");
    scriptLibrary.push("static/js2db/draw2d/src/Port.js");
    scriptLibrary.push("static/js2db/draw2d/src/InputPort.js");
    scriptLibrary.push("static/js2db/draw2d/src/OutputPort.js");
    scriptLibrary.push("static/js2db/draw2d/src/HybridPort.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/anchor/ConnectionAnchor.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/anchor/ChopboxConnectionAnchor.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/anchor/ShortesPathConnectionAnchor.js");
    scriptLibrary.push("static/js2db/draw2d/src/layout/anchor/CenterEdgeConnectionAnchor.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/arrow/CalligrapherArrowLeft.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/arrow/CalligrapherArrowDownLeft.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/node/Start.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/node/End.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/node/Between.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/note/PostIt.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/widget/Widget.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/widget/Slider.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/diagram/Diagram.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/diagram/Pie.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/diagram/Sparkline.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/analog/OpAmp.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/analog/ResistorBridge.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/analog/ResistorVertical.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/analog/VoltageSupplyHorizontal.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/analog/VoltageSupplyVertical.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/layout/Layout.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/layout/HorizontalLayout.js");
    scriptLibrary.push("static/js2db/draw2d/src/shape/layout/VerticalLayout.js");
    scriptLibrary.push("static/js2db/draw2d/src/ui/LabelEditor.js");
    scriptLibrary.push("static/js2db/draw2d/src/ui/LabelInplaceEditor.js");
    scriptLibrary.push("static/js2db/draw2d/src/decoration/connection/Decorator.js");
    scriptLibrary.push("static/js2db/draw2d/src/decoration/connection/ArrowDecorator.js");
    scriptLibrary.push("static/js2db/draw2d/src/decoration/connection/DiamondDecorator.js");
    scriptLibrary.push("static/js2db/draw2d/src/decoration/connection/CircleDecorator.js");
    scriptLibrary.push("static/js2db/draw2d/src/decoration/connection/BarDecorator.js");
    scriptLibrary.push("static/js2db/draw2d/src/io/Reader.js");
    scriptLibrary.push("static/js2db/draw2d/src/io/Writer.js");
    scriptLibrary.push("static/js2db/draw2d/src/io/svg/Writer.js");
    scriptLibrary.push("static/js2db/draw2d/src/io/png/Writer.js");
    scriptLibrary.push("static/js2db/draw2d/src/io/json/Writer.js");
    scriptLibrary.push("static/js2db/draw2d/src/io/json/Reader.js");

    scriptLibrary.push("static/js2db/lib/jquery.browser.js");
    scriptLibrary.push("static/js2db/lib/jquery-ui-1.8.23.custom.min.js");
    scriptLibrary.push("static/js2db/lib/jquery.layout.js");

    scriptLibrary.push("static/js2db/gui/View.js");
    scriptLibrary.push("static/js2db/gui/Toolbar.js");
    scriptLibrary.push("static/js2db/gui/document.js");
    scriptLibrary.push("static/js2db/gui/shape/DBTable.js");
    

}
