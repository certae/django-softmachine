/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.basic.Image
 * Simple Image shape.
 * 
 * @inheritable
 * @author Andreas Herz
 * @extends draw2d.shape.node.Node
 */
draw2d.shape.basic.Image = draw2d.shape.node.Node.extend({
    NAME : "draw2d.shape.basic.Image",

    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     * 
     * @param {Number} path relative or absolute path of the image
     * @param {Number} width initial width of the shape
     * @param {Number} height initial height of the shape
     */
    init : function(path,  width, height)
    {
        this.path = path;
        this._super(width, height);
    },
      

    /**
     * @method
     * Set the image path attribute of the Image shape and repaint them.
     * The path can be relative or absolute
     * 
     * @param path
     * @since 2.8.0
     */
    setPath: function(path){
        this.path = path;
        this.repaint();
        
        return this;
    },
    
    /**
     * @method
     * Return the image path attribute of the shape.
     * 
     * @returns {String}
     * @since 2.8.0
     */
    getPath: function(){
        return this.path;
    },
    
   /**
    * @method
    * propagate all attributes like color, stroke,... to the shape element
    **/
    repaint : function(attributes)
    {
        if (this.repaintBlocked===true || this.shape === null){
            return this;
        }

        if(typeof attributes === "undefined" ){
            attributes = {};
        }

        attributes.x = this.getAbsoluteX();
        attributes.y = this.getAbsoluteY();
        attributes.width = this.getWidth();
        attributes.height = this.getHeight();
        attributes.src = this.path;
        
        this._super(attributes);
        
        return this;
    },

    /**
     * @method
     * 
     * @inheritdoc
     */
    createShapeElement : function()
    {
       return this.canvas.paper.image(this.path,this.getX(),this.getY(),this.getWidth(), this.getHeight());
    },
    

    /**
     * @method 
     * Return an objects with all important attributes for XML or JSON serialization
     * 
     * @returns {Object}
     */
    getPersistentAttributes : function()
    {
        var memento = this._super();
        
        memento.path = this.path;
        
        return memento;
    },
    
    /**
     * @method 
     * Read all attributes from the serialized properties and transfer them into the shape.
     * 
     * @param {Object} memento
     * @returns 
     */
    setPersistentAttributes : function(memento)
    {
        this._super(memento);
        if(typeof memento.path !=="undefined"){
            this.setPath(memento.path);
        }
    }

});

