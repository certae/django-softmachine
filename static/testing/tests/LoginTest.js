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

    it("makes a call to submitLogin", function() {
        var loginWindow = Ext.create('ProtoUL.ux.Login');
        var loginForm = loginWindow.getForm();

        spyOn(loginWindow, 'submitLogin');
        spyOn(loginForm, 'submit');

        loginWindow.submitLogin(null);
        expect(loginWindow.submitLogin).toHaveBeenCalledWith(null);
    });

    it("disables button by default", function() {
        var loginWindow = Ext.create('ProtoUL.ux.Login');
        var loginForm = loginWindow.getForm();
        var button = Ext.create('Ext.Button');

        spyOn(button, 'disable');
        spyOn(loginForm, 'submit');

        loginWindow.submitLogin(button);
        expect(button.disable).toHaveBeenCalled();
    });

    it("checks if form is valid", function() {
        var loginWindow = Ext.create('ProtoUL.ux.Login');
        var loginForm = loginWindow.getForm();
        var button = Ext.create('Ext.Button');

        spyOn(loginForm, 'isValid');
        spyOn(loginForm, 'submit');

        loginWindow.submitLogin(button);
        expect(loginForm.isValid).toHaveBeenCalled();
    });

    it("sends form through a POST request", function() {
        var loginWindow = Ext.create('ProtoUL.ux.Login');
        var loginForm = loginWindow.getForm();

        spyOn(loginForm, 'isValid').andReturn(true);
        spyOn(loginForm, 'submit');

        loginWindow.submitLogin();

        expect(loginForm.submit).toHaveBeenCalled();
    });

    it("enables button when form is invalid", function() {
        var loginWindow = Ext.create('ProtoUL.ux.Login');
        var loginForm = loginWindow.getForm();
        var button = Ext.create('Ext.Button');

        spyOn(loginForm, 'isValid').andReturn(false);
        spyOn(button, 'enable');
        spyOn(loginForm, 'submit');

        loginWindow.submitLogin(button);

        expect(button.enable).toHaveBeenCalled();
    });
});
