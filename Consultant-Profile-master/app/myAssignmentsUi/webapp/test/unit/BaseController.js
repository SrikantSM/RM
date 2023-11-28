sap.ui.define([
    "myAssignmentsUi/controller/BaseController",
    "myAssignmentsUi/controller/Page.controller",
    'sap/ui/model/json/JSONModel',
    "sap/ui/thirdparty/sinon"
], function (BaseController, Controller, JSONModel, sinon) {
    'use strict';

    QUnit.module("BaseController", {
        beforeEach: function () {
            this.oAppController = new Controller();
            this.oViewStub = {};
            this.oViewStub.getModel = function () { };
            this.oViewStub.setModel = function () { };
            this.oViewStub.getModel.getProperty = function () { };
            this.oViewStub.getModel.setProperty = function () { };
            this.oGetViewStub = sinon.stub(this.oAppController, "getView").returns(this.oViewStub);
        },
        afterEach: function () {
            this.oAppController.getView.restore();
            this.oAppController.destroy();
        }

    });

    QUnit.test("Should call getModel function correctly", function (assert) {
        var getModelStub = sinon.stub(this.oViewStub, "getModel");
        var oViewModel = new JSONModel({
            test: 'Test String'
        });
        this.oAppController.setModel(oViewModel, "TestModel");
        this.oAppController.getModel("TestModel");
        assert.ok(getModelStub.calledOnce, "getModel called ");
    });

    QUnit.test("Should call getModelProperty function correctly", function (assert) {
        this.oAppController.getModelProperty = sinon.stub();
        this.oAppController.getModelProperty.withArgs("TestModel", "/test")
            .returns("Test String");
        assert.strictEqual(this.oAppController.getModelProperty("TestModel", "/test"), 'Test String', "Model property value returned");
    });

    QUnit.test("Should call setModel function correctly", function (assert) {
        var setModelStub = sinon.stub(this.oViewStub, "setModel");
        var oViewModel = new JSONModel({
            test: 'Test String'
        });
        this.oAppController.setModel(oViewModel, "TestModel");
        assert.ok(setModelStub.calledOnce, "setModel called ");
    });

    QUnit.test("Should call setModelProperty function correctly", function (assert) {
        this.oAppController.setModelProperty = sinon.stub();
        this.oAppController.setModelProperty.withArgs("TestModel", "/test", "Sample text").
            returns(true);
        assert.ok(this.oAppController.setModelProperty.withArgs("TestModel", "/test", "Sample text"), true ,"SetModelProperty function called once");
    });

});
