sap.ui.define([
  "sap/ui/base/ManagedObject",
  "skill-download/App.controller",
  "sap/ui/thirdparty/sinon"
], function (ManagedObject, AppController, sinon) {
  "use strict";

  var FILE_DOWNLOAD_URI = "FILE_DOWNLOAD_URI";
  var MESSAGE_TEXT = "MESSAGE_TEXT";
  var ERROR_MESSAGE = "error message";

  QUnit.module("Test App Controller", {
    beforeEach: function () {
      this.oAppController = new AppController();
      this.oViewStub = new ManagedObject({});
      this.oOwnerComponentStub = {
        getManifestObject: function () {
          return {
            resolveUri: function () {
              return FILE_DOWNLOAD_URI;
            }
          };
        },
        getManifestEntry: function () { }
      };
      sinon.stub(this.oAppController, "getView").returns(this.oViewStub);
      sinon.stub(this.oAppController, "getOwnerComponent").returns(this.oOwnerComponentStub);
      this.oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

      this.oAppController.onInit();
      this.oInvisibleMessageAnnounceSpy = sinon.spy(this.oAppController.oInvisibleMessage, "announce");
    },
    afterEach: function () {
      this.oInvisibleMessageAnnounceSpy.restore();
    }
  });

  QUnit.test("Should initialize its model correctly", function (assert) {
    var oExpectedUiModel = {
      busy: false,
      messageText: undefined,
      messageType: undefined,
      messageVisible: false
    };
    assert.ok(this.oAppController.uiModel, "The UI model exists");
    assert.propEqual(this.oAppController.uiModel.getProperty("/"), oExpectedUiModel, "The UI model is initialized with correct values");
    assert.equal(this.oAppController.getView().getModel("ui"), this.oAppController.uiModel, "The initialized model is set on the view with the name 'ui'");
  });

  QUnit.test("Should handle download press correctly", function (assert) {
    this.oViewStub.byId = function (languageInput) {
      return {
        getValue: function () {
          return languageInput;
        }
      };
    };
    var ajaxStub = {
      done: sinon.stub(),
      fail: sinon.stub(),
      always: sinon.stub()
    };
    ajaxStub.done.returns(ajaxStub);
    ajaxStub.fail.returns(ajaxStub);
    ajaxStub.always.returns(ajaxStub);
    var jQueryStub = sinon.stub(jQuery, "ajax").returns(ajaxStub);
    var expectedAjaxArgument = {
      method: "GET",
      headers: {
        "Accept-Language": "en"
      },
      url: this.oAppController._getServiceUri(),
      xhr: function () {
      }
    };
    this.oAppController.handleDownloadPress();

    assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), true, "The busy property is set to true.");
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), false, "The messageVisible property is set to false.");
    assert.ok(jQueryStub.calledOnce, "jQuery stubs called as expected");
    assert.ok(ajaxStub.done.calledOnce, "jQuery stubs called as expected");
    assert.ok(ajaxStub.always.calledOnce, "jQuery stubs called as expected");
    assert.propEqual(jQueryStub.firstCall.args[0], expectedAjaxArgument, "jQuery stubs called as expected");
    jQueryStub.restore();
  });

  QUnit.test("Should handle download press with no language input correctly", function (assert) {
    this.oViewStub.byId = function (languageInput) {
      return {
        getValue: function () {
          return "";
        }
      };
    };
    var ajaxStub = {
      done: sinon.stub(),
      fail: sinon.stub(),
      always: sinon.stub()
    };
    ajaxStub.done.returns(ajaxStub);
    ajaxStub.fail.returns(ajaxStub);
    ajaxStub.always.returns(ajaxStub);
    var jQueryStub = sinon.stub(jQuery, "ajax").returns(this.ajaxStub);

    this.oAppController.handleDownloadPress();

    assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The busy property is set to true.");
    assert.ok(this.oInvisibleMessageAnnounceSpy.calledOnce, "MessageStrip was announced for accessibility");
    jQueryStub.restore();
  });

  QUnit.test("Should display download success message correctly", function (assert) {
    var createObjectURLStub = sinon.stub(window.URL, "createObjectURL").returns(FILE_DOWNLOAD_URI);

    var oGetValueStub = sinon.stub();
    oGetValueStub.withArgs("languageInput").returns("en");
    this.oViewStub.byId = function (ID) {
      return {
        getValue: function () {
          return oGetValueStub(ID);
        }
      };
    };

    var xhr = {
      getResponseHeader: sinon.stub()
    };
    xhr.getResponseHeader.withArgs("Skills-Downloaded-Counter").returns("2");
    xhr.getResponseHeader.withArgs("Skills-Not-Downloaded-Counter").returns("0");

    this.oAppController._onDownloadSuccess(undefined, "success", xhr);

    assert.strictEqual(this.oTranslateTextStub.firstCall.args[0], "downloadSuccessMessage", "Correct download success message displayed.");
    assert.strictEqual(this.oTranslateTextStub.firstCall.args[1][0], "2", "The right amount of downloaded items is displayed.");
    assert.strictEqual(this.oTranslateTextStub.firstCall.args[1][1], "2", "The right amount of total items is displayed.");
    assert.strictEqual(this.oTranslateTextStub.firstCall.args[1][2], undefined, "The right amount of parameters is provided.");
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The messageVisible property is set to true.");
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Success", "The messageType is set to Success.");
    assert.ok(this.oInvisibleMessageAnnounceSpy.calledOnce, "MessageStrip was announced for accessibility");

    createObjectURLStub.restore();
  });

  QUnit.test("Should display download success message partial-singular correctly", function (assert) {
    var createObjectURLStub = sinon.stub(window.URL, "createObjectURL").returns(FILE_DOWNLOAD_URI);

    var oGetValueStub = sinon.stub();
    oGetValueStub.withArgs("languageInput").returns("en");
    this.oViewStub.byId = function (ID) {
      return {
        getValue: function () {
          return oGetValueStub(ID);
        }
      };
    };

    var xhr = {
      getResponseHeader: sinon.stub()
    };
    xhr.getResponseHeader.withArgs("Skills-Downloaded-Counter").returns("1");
    xhr.getResponseHeader.withArgs("Skills-Not-Downloaded-Counter").returns("1");

    this.oAppController._onDownloadSuccess(undefined, "success", xhr);

    assert.strictEqual(this.oTranslateTextStub.firstCall.args[0], "downloadSuccessMessagePartialSingular", "Correct download success message displayed.");
    assert.strictEqual(this.oTranslateTextStub.firstCall.args[1][0], "1", "The right amount of downloaded items is displayed.");
    assert.strictEqual(this.oTranslateTextStub.firstCall.args[1][1], "2", "The right amount of total items is displayed.");
    assert.strictEqual(this.oTranslateTextStub.firstCall.args[1][2], "1", "The right amount of skipped items is displayed.");
    assert.strictEqual(this.oTranslateTextStub.firstCall.args[1][3], undefined, "The right amount of parameters is provided.");
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The messageVisible property is set to true.");
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Warning", "The messageType is set to Warning.");
    assert.ok(this.oInvisibleMessageAnnounceSpy.calledOnce, "MessageStrip was announced for accessibility");

    createObjectURLStub.restore();
  });

  QUnit.test("Should display download success message partial-plural correctly", function (assert) {
    var createObjectURLStub = sinon.stub(window.URL, "createObjectURL").returns(FILE_DOWNLOAD_URI);

    var oGetValueStub = sinon.stub();
    oGetValueStub.withArgs("languageInput").returns("en");
    this.oViewStub.byId = function (ID) {
      return {
        getValue: function () {
          return oGetValueStub(ID);
        }
      };
    };

    var xhr = {
      getResponseHeader: sinon.stub()
    };
    xhr.getResponseHeader.withArgs("Skills-Downloaded-Counter").returns("1");
    xhr.getResponseHeader.withArgs("Skills-Not-Downloaded-Counter").returns("3");

    this.oAppController._onDownloadSuccess(undefined, "success", xhr);

    assert.strictEqual(this.oTranslateTextStub.firstCall.args[0], "downloadSuccessMessagePartialPlural", "Correct download success message displayed.");
    assert.strictEqual(this.oTranslateTextStub.firstCall.args[1][0], "1", "The right amount of downloaded items is displayed.");
    assert.strictEqual(this.oTranslateTextStub.firstCall.args[1][1], "4", "The right amount of total items is displayed.");
    assert.strictEqual(this.oTranslateTextStub.firstCall.args[1][2], "3", "The right amount of skipped items is displayed.");
    assert.strictEqual(this.oTranslateTextStub.firstCall.args[1][3], undefined, "The right amount of parameters is provided.");
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The messageVisible property is set to true.");
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Warning", "The messageType is set to Warning.");
    assert.ok(this.oInvisibleMessageAnnounceSpy.calledOnce, "MessageStrip was announced for accessibility");

    createObjectURLStub.restore();
  });

  QUnit.test("Should display business service exceptions correctly", function (assert) {
    var jqXHRStub = {
      responseText: "{\"message\": \"" + ERROR_MESSAGE + "\"}"
    };

    this.oAppController._onDownloadFailure(jqXHRStub);
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), ERROR_MESSAGE);
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The messageVisible property is set to true.");
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "The messageType is set to Error.");
    assert.ok(this.oInvisibleMessageAnnounceSpy.calledOnce, "MessageStrip was announced for accessibility");
  });

  QUnit.test("Should display unexpected error correctly when error message is missing", function (assert) {
    var jqXHRStub = {
      responseText: "{}"
    };

    this.oAppController._onDownloadFailure(jqXHRStub);
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT);
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The messageVisible property is set to true.");
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "The messageType is set to Error.");
    assert.ok(this.oInvisibleMessageAnnounceSpy.calledOnce, "MessageStrip was announced for accessibility");
  });

  QUnit.test("Should display unexpected error correctly when response is not in JSON format", function (assert) {
    var jqXHRStub = {
      responseText: ERROR_MESSAGE
    };

    this.oAppController._onDownloadFailure(jqXHRStub);
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT);
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The messageVisible property is set to true.");
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "The messageType is set to Error.");
    assert.ok(this.oInvisibleMessageAnnounceSpy.calledOnce, "MessageStrip was announced for accessibility");
  });
});
