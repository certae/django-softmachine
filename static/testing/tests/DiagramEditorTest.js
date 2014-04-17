describe("On page load, DiagramEdit Module", function() {

    it("can be loaded", function() {
        expect(ProtoUL.view.diagram.DiagramMainView).toBeDefined();
    });

    it("creates a diagram window", function() {
        var diagramWindow = new Ext.create('ProtoUL.view.diagram.DiagramMainView');
        expect(diagramWindow).toBeTruthy();
    });
});