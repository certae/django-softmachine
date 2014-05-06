// declare the namespace for this app
var dbModel = {
	shape: {},
	locator: {}
};

dbModel.Application = Class.extend(
{
    NAME : "dbModel.Application", 

    /**
     * @constructor
     * 
     * @param {String} canvasId the id of the DOM element to use as paint container
     */
    init : function()
    {
	    this.view    = new dbModel.View("canvas");
        this.toolbar = new dbModel.Toolbar("toolbar", this, this.view );
	    
	       // layout FIRST the body
	       this.appLayout = $('#container').layout({
	   	     west: {
	              resizable:true,
	              closable:true,
	              resizeWhileDragging:true,
	              paneSelector: "#navigation"
	            },
	            center: {
	              resizable:true,
	              closable:true,
	              resizeWhileDragging:true,
	              paneSelector: "#content"
	            }
	       });
	      
	       //
	       this.contentLayout = $('#content').layout({
	   	     north: {
	              resizable:false,
	              closable:false,
                  spacing_open:0,
                  spacing_closed:0,
                  size:50,
	              paneSelector: "#toolbar"
	            },
	            center: {
	              resizable:false,
	              closable:false,
                  spacing_open:0,
                  spacing_closed:0,
	              paneSelector: "#canvas"
	            }
	       });
	       
	},
	getView: function(){
        return this.view;
    }

});
