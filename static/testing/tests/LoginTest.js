describe("On page load, Login module", function() {

    it("can be loaded", function() {
        expect(ProtoUL.ux.Login).toBeDefined();
    });

    it("defines submitButton", function() {
        var submitButton = new Ext.Button();
        expect(submitButton).toBeTruthy();
    });

    it("creates a login window", function() {
        var loginWindow = new ProtoUL.ux.Login();
        expect(loginWindow).toBeTruthy();
    });
});


describe("On submit, Login module", function() {

    it("makes a call to submitButton", function() {
        var loginWindow = new ProtoUL.ux.Login();
        spyOn(loginWindow, 'submitButton');
//         spyOn(btn, 'disable');
        loginWindow.submitLogin();
        expect(loginWindow.submitButton).toHaveBeenCalled();
    });
});
