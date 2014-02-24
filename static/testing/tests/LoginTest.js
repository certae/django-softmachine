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

    it("disables button by default", function() {
        var loginWindow = Ext.create('ProtoUL.ux.Login'),
            loginForm = loginWindow.getForm(),
            button = Ext.create('Ext.Button');

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

describe("On request, Lost password", function() {
	it("can be loaded", function() {
        expect(ProtoUL.view.password.ForgotPasswordForm).toBeDefined();
    });
    
    it("creates a reset password window", function() {
        var resetWindow = new ProtoUL.view.password.ForgotPasswordForm();
        expect(resetWindow).toBeTruthy();
    });
    
});

describe("On submit, Lost password form", function() {
    var resetWindow = null;
    var pwdManager = null;
    var lostPWDForm = null;
    var submitButton = null;
        
    beforeEach (function () {
        resetWindow = Ext.create('ProtoUL.view.password.ForgotPasswordForm');
        pwdManager = Ext.create('ProtoUL.controller.PasswordManager');
        lostPWDForm = resetWindow.down('form').getForm();
        submitButton = resetWindow.dockedItems.items[0].items.items[1];
    });
    
    it("checks if form is valid", function() {
		
        spyOn(lostPWDForm, 'isValid');

        pwdManager.forgotpassword(submitButton);

        expect(lostPWDForm.isValid).toHaveBeenCalled();
    });
    
    it("sends form through a POST request", function() {

        spyOn(lostPWDForm, 'isValid').andReturn(true);
        spyOn(lostPWDForm, 'submit');

        pwdManager.forgotpassword(submitButton);

        expect(lostPWDForm.submit).toHaveBeenCalled();
    });
});