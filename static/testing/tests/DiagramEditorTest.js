describe("On page load, DiagramEdit Module", function() {

    it("can be loaded", function() {
        expect(ProtoUL.view.diagram.DiagramMainView).toBeDefined();
    });

    it("creates a diagram window", function() {
        var diagramWindow = new Ext.create('ProtoUL.view.diagram.DiagramMainView');
        expect(diagramWindow).toBeTruthy();
    });
});

describe('ProtoUL.store.Diagrams', function() {
    var store;
    beforeEach(function() {
        jasmine.Ajax.install();
        store = Ext.create('ProtoUL.store.Diagrams');
    });

	afterEach(function() {
      	jasmine.Ajax.uninstall();
    });
    
    it('calls out to the proper listDiagrams url', function() {
        store.load();
        var request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toMatch('protoDiagram/listDiagrams/');
    });
    
    it('New item should be added to store', function() {
    	record = Ext.create('ProtoUL.model.Diagram');
        store.add(record);
        
        expect(store.getCount()).toEqual(1);
    });
    
    it('Item should be removed from store', function() {
    	record = Ext.create('ProtoUL.model.Diagram');
        store.add(record);
        
        expect(store.getCount()).toEqual(1);
        
        store.remove(record);
        
        expect(store.getCount()).toEqual(0);
    });
}); 

describe('ProtoUL.controller.DiagramController', function() {
	var controller;
	beforeEach(function() {
        controller = Ext.create('ProtoUL.controller.DiagramController', {
           application: ProtoUL
        });
        controller.init();
    });
    
    it("test createEntityAttribute", function () {
       spyOn(controller, 'createEntityAttribute');
   
       var port = controller.createEntityAttribute('attribute', 'id', 'pk', 'fk', 'string');
   
       expect(controller.createEntityAttribute).toHaveBeenCalled();
       expect(controller.createEntityAttribute).toHaveBeenCalledWith('attribute', 'id', 'pk', 'fk', 'string');
   });
});
