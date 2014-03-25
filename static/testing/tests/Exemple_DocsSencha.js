describe("Users", function() {
    var store = null, ctlr = null;

    beforeEach(function(){
        if (!ctlr) {
            ctlr = Application.getController('Users');
        }

        if (!store) {
            store = ctlr.getStore('Users');
        }

        expect(store).toBeTruthy();

        waitsFor(
            function(){ return !store.isLoading(); },
            "load never completed",
            4000
        );
    });

    it("should have users",function(){
        expect(store.getCount()).toBeGreaterThan(1);
    });

    it("should open the editor window", function(){
        var grid = Ext.ComponentQuery.query('userlist')[0];

        ctlr.editUser(grid,store.getAt(0));

        var edit = Ext.ComponentQuery.query('useredit')[0];

        expect(edit).toBeTruthy();
        if(edit)edit.destroy();
    });

});
