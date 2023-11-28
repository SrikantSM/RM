sap.ui.define([
  "sap/ui/base/ManagedObject",
  "sap/ui/core/Fragment",
  "sap/ui/core/InvisibleMessage",
  "skill-upload/App.controller",
  "sap/ui/thirdparty/sinon"
], function (ManagedObject, Fragment, InvisibleMessage, AppController, sinon) {
  "use strict";

  var CSRF_TOKEN = "CSRF_TOKEN";
  var ERROR_DIALOG = "ERROR_DIALOG";
  var FILE_UPLOAD_URI = "FILE_UPLOAD_URI";
  var MESSAGE_TEXT = "MESSAGE_TEXT";

  QUnit.module("Controller", {
    beforeEach: function () {
      this.oAppController = new AppController();
      this.oViewStub = new ManagedObject({});
      this.oViewStub.addDependent = function () { };
      this.oOwnerComponentStub = {
        getManifestObject: function () {
          return {
            resolveUri: function () {
              return FILE_UPLOAD_URI;
            }
          };
        },
        getManifestEntry: function () { }
      };

      var that = this;
      var bindingStub = {
        attachChange: function (fnChangeListener) {
          that.attachedChangeListener = fnChangeListener;
        }
      };
      this.attachChangeSpy = sinon.spy(bindingStub, "attachChange");
      this.bindingStub = bindingStub;

      this.modelStub = {
        refresh: function () { },
        bindProperty: function () {
          return bindingStub;
        },
        getHttpHeaders: function () { return {}; }
      };
      this.oViewStub.oModels.skill = this.modelStub;
      this.oViewStub.byId = sinon.spy(function () {
        return {
          getObjectBinding: function () {
            return {
              getBoundContext: function () { },
              refresh: function () { },
              attachEventOnce: function () { }
            };
          }
        };
      });
      sinon.stub(this.oAppController, "getView").returns(this.oViewStub);
      sinon.stub(this.oAppController, "getOwnerComponent").returns(this.oOwnerComponentStub);

      this.oInvisibleMessageAnnounceSpy = sinon.spy(InvisibleMessage.getInstance(), "announce"); // stub at the singleton
    },
    afterEach: function () {
      this.oInvisibleMessageAnnounceSpy.restore();
      this.oAppController.onExit();
    }
  });

  QUnit.test("Should initialize its model correctly", function (assert) {
    this.oAppController.onInit();

    var oExpectedUiModel = {
      busy: false,
      serviceUri: FILE_UPLOAD_URI,
      uploadLanguage: "",
      userLocale: sap.ui.getCore().getConfiguration().getLanguageTag(),
      csrfToken: undefined,
      maxFileUploadSize: 10,
      messageVisible: false,
      messageType: undefined,
      messageText: undefined,
      messageCode: ""
    };

    assert.ok(this.oAppController.uiModel, "The UI model exists");
    assert.propEqual(this.oAppController.uiModel.getProperty("/"), oExpectedUiModel, "The UI model is initialized with correct values");
    assert.equal(this.oAppController.getView().getModel("ui"), this.oAppController.uiModel, "The initialized model is set on the view with the name 'ui'");
  });

  QUnit.test("Should handle a completely succeeded file upload correctly", function (assert) {
    var oUploadCompleteEventStub = {
      getParameter: sinon.stub()
    };

    oUploadCompleteEventStub.getParameter.withArgs("status").returns(200);
    oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(JSON.stringify({
      createdItems: [1, 2, 3, 4, 5],
      updatedItems: [],
      errors: []
    }));

    var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

    this.oAppController.onInit();
    this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

    assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The the UI model property 'busy' to be 'false'");

    oTranslateTextStub.restore();
  });

  QUnit.test("Should handle a partly succeeded file upload correctly", function (assert) {
    var oUploadCompleteEventStub = {
      getParameter: sinon.stub()
    };

    oUploadCompleteEventStub.getParameter.withArgs("status").returns(200);
    oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(JSON.stringify({
      createdItems: [1, 2, 3],
      updatedItems: [1],
      errors: [1]
    }));

    this.oAppController.onInit();
    this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

    assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The the UI model property 'busy' to be 'false'");

  });

  QUnit.test("Should handle a succeeded file upload without a response message correctly", function (assert) {
    var oUploadCompleteEventStub = {
      getParameter: sinon.stub()
    };

    oUploadCompleteEventStub.getParameter.withArgs("status").returns(200);
    oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(null);

    this.oAppController.onInit();
    this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

    assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The the UI model property 'busy' to be 'false'");
  });

  QUnit.test("Should handle a succeeded file upload without a response createdItems property correctly", function (assert) {
    var oUploadCompleteEventStub = {
      getParameter: sinon.stub()
    };

    oUploadCompleteEventStub.getParameter.withArgs("status").returns(200);
    oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(JSON.stringify({
      updatedItems: [1],
      errors: [1]
    }));

    this.oAppController.onInit();
    this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

    assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The the UI model property 'busy' to be 'false'");
  });

  QUnit.test("Should handle a succeeded file upload without a response updatedItems property correctly", function (assert) {
    var oUploadCompleteEventStub = {
      getParameter: sinon.stub()
    };

    oUploadCompleteEventStub.getParameter.withArgs("status").returns(200);
    oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(JSON.stringify({
      createdItems: [1],
      errors: [1]
    }));

    this.oAppController.onInit();
    this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

    assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The the UI model property 'busy' to be 'false'");
  });

  QUnit.test("Should handle a succeeded file upload without a response errors property correctly", function (assert) {
    var oUploadCompleteEventStub = {
      getParameter: sinon.stub()
    };

    oUploadCompleteEventStub.getParameter.withArgs("status").returns(200);
    oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(JSON.stringify({
      createdItems: [1, 2, 3, 4, 5],
      updatedItems: []
    }));

    this.oAppController.onInit();
    this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

    assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The the UI model property 'busy' to be 'false'");
  });

  QUnit.test("Should handle a failed file upload correctly", function (assert) {
    var oUploadCompleteEventStub = {
      getParameter: sinon.stub()
    };

    oUploadCompleteEventStub.getParameter.withArgs("status").returns(400);
    oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(JSON.stringify({
      message: "message"
    }));

    this.oAppController.onInit();
    this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

    assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The the UI model property 'busy' to be 'false'");
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), "message", "The the UI model property 'messageText' to be 'message'");
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "The the UI model property 'messageType' to be 'Error'");
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The The the UI model property 'messageVisible' to be 'true'");
  });

  QUnit.test("Should handle a failed file upload without a response message correctly", function (assert) {
    var oUploadCompleteEventStub = {
      getParameter: sinon.stub()
    };

    oUploadCompleteEventStub.getParameter.withArgs("status").returns(400);
    oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(null);

    sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

    this.oAppController.onInit();
    this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

    assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The the UI model property 'busy' to be 'false'");

  });

  QUnit.test("Should handle upload press correctly", function (assert) {
    var fDone = assert.async(1);

    var oFileUploadStub = {
      upload: sinon.stub()
    };

    var oHandleCsrfTokenStub = sinon.stub(this.oAppController, "_handleCsrfToken").returns(Promise.resolve());
    var oById = sinon.stub(this.oAppController, "byId").returns(oFileUploadStub);
    var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

    var oGetValueStub = sinon.stub();
    this.oViewStub.byId = function (ID) {
      return {
        getValue: function () {
          return oGetValueStub(ID);
        },
        getObjectBinding: function () {
          return {
            getBoundContext: function () { },
            refresh: function () { },
            attachEventOnce: function () { }
          };
        }

      };
    };
    oGetValueStub.withArgs("fileUploader").returns("fileUploader");
    oGetValueStub.withArgs("languageInput").returns("en");

    this.oAppController.onInit();
    this.oAppController.handleUploadPress();

    setTimeout(function () {
      assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), true, "The busy property is set to true.");
      assert.ok(oFileUploadStub.upload.calledOnce, "The file was uploaded");

      oHandleCsrfTokenStub.restore();
      oById.restore();
      oTranslateTextStub.restore();
      fDone();
    }.bind(this));
  });

  QUnit.test("Should handle upload press with no file input correctly", function (assert) {
    var fDone = assert.async(1);

    var oFileUploadStub = {
      upload: sinon.stub()
    };

    var oHandleCsrfTokenStub = sinon.stub(this.oAppController, "_handleCsrfToken").returns(Promise.resolve());
    var oById = sinon.stub(this.oAppController, "byId").returns(oFileUploadStub);
    var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

    var oGetValueStub = sinon.stub();
    this.oViewStub.byId = function (ID) {
      return {
        getValue: function () {
          return oGetValueStub(ID);
        },
        getObjectBinding: function () {
          return {
            getBoundContext: function () { },
            refresh: function () { },
            attachEventOnce: function () { }
          };
        }
      };
    };
    oGetValueStub.withArgs("fileUploader").returns("");
    oGetValueStub.withArgs("languageInput").returns("en");

    this.oAppController.onInit();
    this.oAppController.handleUploadPress();

    setTimeout(function () {
      assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "The messageType property is set to Error.");
      assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The messageText property is set to " + MESSAGE_TEXT + ".");
      assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The messageVisible property is set to true.");

      assert.ok(oTranslateTextStub.calledOnce, "Result text to display is translated");
      assert.strictEqual(oTranslateTextStub.firstCall.args[0], "errorNoFile", "The right result text is displayed to the user");

      assert.ok(oFileUploadStub.upload.notCalled, "The file was not uploaded");

      oHandleCsrfTokenStub.restore();
      oById.restore();
      oTranslateTextStub.restore();
      fDone();
    }.bind(this));
  });

  QUnit.test("Should handle upload press with no language input correctly", function (assert) {
    var fDone = assert.async(1);

    var oFileUploadStub = {
      upload: sinon.stub()
    };

    var oHandleCsrfTokenStub = sinon.stub(this.oAppController, "_handleCsrfToken").returns(Promise.resolve());
    var oById = sinon.stub(this.oAppController, "byId").returns(oFileUploadStub);
    var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

    var oGetValueStub = sinon.stub();
    this.oViewStub.byId = function (ID) {
      return {
        getValue: function () {
          return oGetValueStub(ID);
        },
        getObjectBinding: function () {
          return {
            getBoundContext: function () { },
            refresh: function () { },
            attachEventOnce: function () { }
          };
        }
      };
    };
    oGetValueStub.withArgs("fileUploader").returns("fileUploader");
    oGetValueStub.withArgs("languageInput").returns("");

    this.oAppController.onInit();
    this.oAppController.handleUploadPress();

    setTimeout(function () {
      assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "The messageType property is set to Error.");
      assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The messageText property is set to " + MESSAGE_TEXT + ".");
      assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The messageVisible property is set to true.");

      assert.ok(oTranslateTextStub.calledOnce, "Result text to display is translated");
      assert.strictEqual(oTranslateTextStub.firstCall.args[0], "errorNoLanguage", "The right result text is displayed to the user");

      assert.ok(oFileUploadStub.upload.notCalled, "The file was not uploaded");

      oHandleCsrfTokenStub.restore();
      oById.restore();
      oTranslateTextStub.restore();
      fDone();
    }.bind(this));
  });

  QUnit.test("Should handle overly large files correctly", function (assert) {
    var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

    this.oAppController.onInit();
    this.oAppController.handleFileSizeExceed();

    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The property messageVisible is true.");
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "The property messageType is Error.");
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The property messageText is correct.");

    oTranslateTextStub.restore();
  });

  QUnit.test("Should get the correct file language", function (assert) {
    var sExpectedFileLanguage = "en";
    var sPath = "/skills_en.csv";
    var oEventStub = { getParameter: sinon.stub().returns(sPath) };

    this.oAppController.onInit();
    this.oAppController.handleFileChange(oEventStub);

    assert.strictEqual(this.oAppController.uiModel.getProperty("/uploadLanguage"), sExpectedFileLanguage, "The returned language is correct.");
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), false, "The property messageVisible is false.");
  });

  QUnit.test("Should not overwrite the file language when there is no language in the file name", function (assert) {
    var sExpectedFileLanguage = "en";
    var sPath = "/skills.csv";
    var oEventStub = { getParameter: sinon.stub().returns(sPath) };

    this.oAppController.onInit();
    this.oAppController.uiModel.setProperty("/uploadLanguage", sExpectedFileLanguage);
    this.oAppController.handleFileChange(oEventStub);

    assert.strictEqual(this.oAppController.uiModel.getProperty("/uploadLanguage"), sExpectedFileLanguage, "The returned language is correct.");
    assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), false, "The property messageVisible is false.");
  });

  QUnit.test("Should close error dialog correctly.", function (assert) {
    var fDone = assert.async(1);

    var oErrorDialogStub = {
      close: sinon.stub()
    };
    var oGetErrorDialogStub = sinon.stub(this.oAppController, "getErrorDialog").returns(
      Promise.resolve(oErrorDialogStub)
    );

    this.oAppController.handleCloseErrorDialog();

    setTimeout(function () {
      assert.ok(oErrorDialogStub.close.calledOnce, "The dialog was closed");
      oGetErrorDialogStub.restore();
      fDone();
    });
  });

  QUnit.test("Should create a correct error dialog", function (assert) {
    var fDone = assert.async(1);

    var oLoadStub = sinon.stub(Fragment, "load").returns(Promise.resolve(ERROR_DIALOG));
    var oAddDependentStub = sinon.stub(this.oViewStub, "addDependent");

    this.oAppController.oDialogPromise = null;

    this.oAppController.getErrorDialog().then(function (errorDialog) {
      assert.ok(oLoadStub.calledOnce, "The fragment was loaded");
      assert.strictEqual(oLoadStub.firstCall.args[0].name, "skill-upload.ErrorDialog", "The correct fragment was loaded");
      assert.strictEqual(oLoadStub.firstCall.args[0].controller, this.oAppController, "The correct controller was provided while loading the fragment");

      assert.ok(oAddDependentStub.calledOnce, "The dialog was added to the view as a dependent");
      assert.strictEqual(oAddDependentStub.firstCall.args[0], ERROR_DIALOG, "The dialog added as a dependent is the correct one");
      assert.strictEqual(errorDialog, ERROR_DIALOG, "The returned error dialog is the correct one");

      oLoadStub.restore();
      oAddDependentStub.restore();

      fDone();
    }.bind(this));
  });

  QUnit.test("Should only create one error dialog when called concurrently", function (assert) {
    var oLoadStub = sinon.stub(Fragment, "load").returns(new Promise(function () { }));

    this.oAppController.oDialogPromise = null;

    var oPromise1 = this.oAppController.getErrorDialog();
    var oPromise2 = this.oAppController.getErrorDialog();

    assert.strictEqual(oPromise1, oPromise2, "Two concurrent executions return the same error dialog");

    oLoadStub.restore();
  });

  QUnit.test("Should reuse an existing error dialog", function (assert) {
    var fDone = assert.async(1);

    var oLoadStub = sinon.stub(Fragment, "load").returns(function () { Promise.reject({ message: "This should not be called" }); });
    var oAddDependentStub = sinon.stub(this.oViewStub, "addDependent");

    this.oAppController.oDialogPromise = Promise.resolve(ERROR_DIALOG);

    this.oAppController.getErrorDialog().then(function (oErrorDialog) {
      assert.ok(oLoadStub.notCalled, "The fragment was not loaded");
      assert.ok(oAddDependentStub.notCalled, "No dialog was added to the view as a dependent");
      assert.strictEqual(oErrorDialog, ERROR_DIALOG, "The existing dialog was reused");

      oLoadStub.restore();
      oAddDependentStub.restore();

      fDone();
    });
  });

  QUnit.test("Should get the correct service URI", function (assert) {
    var sServiceUri = this.oAppController._getServiceUri();

    assert.strictEqual(sServiceUri, FILE_UPLOAD_URI, "The returned service URI is correct");
  });

  QUnit.test("Should get the correct translated texts", function (assert) {
    var oResourceBundleStub = { getText: sinon.stub() };
    oResourceBundleStub.getText.withArgs("TEXT_ID").returns(MESSAGE_TEXT);

    this.oAppController.oResourceBundle = oResourceBundleStub;

    this.oAppController.onInit();
    var sReturnedText = this.oAppController._translateText("TEXT_ID");

    assert.strictEqual(sReturnedText, MESSAGE_TEXT, "The returned translated text is correct.");
  });

  QUnit.test("Should execute AJAX method correctly when handling the CSRF token.", function (assert) {
    var jqXHRStub = {
      getResponseHeader: sinon.stub()
    };
    jqXHRStub.getResponseHeader.withArgs("x-csrf-token").returns(CSRF_TOKEN);
    var jQueryStub = sinon.stub(jQuery, "ajax");

    this.oAppController.onInit();
    this.oAppController._handleCsrfToken();

    assert.ok(jQuery.ajax.calledWithMatch({
      method: "HEAD",
      headers: {
        "x-csrf-token": "fetch"
      }
    }));

    jQueryStub.restore();
  });

  QUnit.test("Should fetch csrf token correctly in case of http success status.", function (assert) {
    var jqXHRStub = {
      getResponseHeader: sinon.stub()
    };
    jqXHRStub.getResponseHeader.withArgs("x-csrf-token").returns(CSRF_TOKEN);
    var jQueryStub = sinon.stub(jQuery, "ajax");

    this.oAppController.onInit();
    this.oAppController._handleCsrfToken();
    jQuery.ajax.firstCall.args[0].success(null, null, jqXHRStub);

    assert.strictEqual(this.oAppController.uiModel.getProperty("/csrfToken"), CSRF_TOKEN);

    jQueryStub.restore();
  });

  QUnit.test("Should fetch csrf token correctly in case of http error status.", function (assert) {
    var jqXHRStub = {
      getResponseHeader: sinon.stub()
    };
    jqXHRStub.getResponseHeader.withArgs("x-csrf-token").returns(CSRF_TOKEN);
    var jQueryStub = sinon.stub(jQuery, "ajax");

    this.oAppController.onInit();
    this.oAppController._handleCsrfToken();
    jQuery.ajax.firstCall.args[0].error(jqXHRStub, null, null);

    assert.strictEqual(this.oAppController.uiModel.getProperty("/csrfToken"), CSRF_TOKEN);

    jQueryStub.restore();
  });

  QUnit.test("Should not fetch an own csrf token if it is present in the ODataModel.", function (assert) {
    var fDone = assert.async(1);
    var jQueryStub = sinon.stub(jQuery, "ajax");
    var _updateCsrfTokenFromODataModelStub = sinon.stub(this.oAppController, "_updateCsrfTokenFromODataModel").returns(true);

    this.oAppController.onInit();
    this.oAppController._handleCsrfToken().then(function () {
      assert.ok(jQueryStub.notCalled, "Expected no ajax call to be executed");
      _updateCsrfTokenFromODataModelStub.restore();
      jQueryStub.restore();
      fDone();
    });
  });

  QUnit.test("Should reuse the csrf token from the ODataModel.", function (assert) {
    this.modelStub.getHttpHeaders = function () {
      return { "X-CSRF-Token": CSRF_TOKEN };
    };
    this.oAppController.onInit();
    var updateSuccessful = this.oAppController._updateCsrfTokenFromODataModel();

    assert.ok(updateSuccessful, "Update from ODataModel was successful");
    assert.strictEqual(this.oAppController.uiModel.getProperty("/csrfToken"), CSRF_TOKEN, "crsf token equals the ODataModel csrf token");
  });

  QUnit.test("Should test the periodic refresh of the Upload Job binding.", function (assert) {
    var attachEventOnceSpy = sinon.spy();
    this.oViewStub.byId = sinon.spy(function () {
      return {
        getObjectBinding: function () {
          return {
            getBoundContext: function () { },
            refresh: function () { },
            attachEventOnce: attachEventOnceSpy
          };
        }
      };
    });
    var refreshUploadJobModelStub = sinon.stub(this.oAppController, "refreshUploadJobModel");
    var oClock = sinon.useFakeTimers();

    //setup interval update
    this.oAppController.onInit();

    oClock.tick(5000);
    assert.ok(attachEventOnceSpy.calledOnce, "Should register for dataReceivedEvent after 5 seconds");
    assert.ok(refreshUploadJobModelStub.calledOnce, "Refresh of the upload job model is triggered after 5 seconds");

    //simulate "dataReceived" Event
    attachEventOnceSpy.firstCall.args[1]();

    oClock.tick(5000);
    assert.ok(attachEventOnceSpy.calledTwice, "Should register for dataReceivedEvent after 10 seconds");
    assert.ok(refreshUploadJobModelStub.calledTwice, "Refresh of the upload job model is triggered after 10 seconds");

    refreshUploadJobModelStub.restore();
    oClock.restore();
  });

  QUnit.test("initializeAccessibilityMessages: sets up oInvisibleMessage and model change listener onInit", function (assert) {
    this.oAppController.onInit();
    assert.strictEqual(this.oAppController.oInvisibleMessage, InvisibleMessage.getInstance(), "The controller is initialized with the instance of InvisibleMessage");
    assert.ok(this.attachChangeSpy.calledOnce, "The change listener on the model is attached once");
  });

  QUnit.test("initializeAccessibilityMessages: attachChange handler doesn't call announceNewMessageStrips with initial state", function (assert) {
    this.oAppController.onInit();
    var announceStub = sinon.stub(this.oAppController, "announceNewMessageStrips");

    var fakeEvent = {
      getSource: function () {
        return {
          getValue: function () {
            return "a";
          }
        };
      }
    };
    this.attachedChangeListener(fakeEvent);

    assert.notOk(announceStub.calledOnce, "announceNewMessageStrips not called");
  });

  QUnit.test("initializeAccessibilityMessages: attachChange handler calls announceNewMessageStrips on state change", function (assert) {
    this.oAppController.onInit();
    var announceStub = sinon.stub(this.oAppController, "announceNewMessageStrips");

    var fakeEvent1 = {
      getSource: function () {
        return {
          getValue: function () {
            return "a";
          }
        };
      }
    };
    var fakeEvent2 = {
      getSource: function () {
        return {
          getValue: function () {
            return "b";
          }
        };
      }
    };
    this.attachedChangeListener(fakeEvent1);
    this.attachedChangeListener(fakeEvent2);

    assert.ok(announceStub.calledOnce, "announceNewMessageStrips called once");
  });

  QUnit.test("initializeAccessibilityMessages: attachChange handler doesn't call announceNewMessageStrips without state change", function (assert) {
    this.oAppController.onInit();
    var announceStub = sinon.stub(this.oAppController, "announceNewMessageStrips");

    var fakeEvent = {
      getSource: function () {
        return {
          getValue: function () {
            return "a";
          }
        };
      }
    };
    this.attachedChangeListener(fakeEvent);
    this.attachedChangeListener(fakeEvent);

    assert.notOk(announceStub.calledOnce, "announceNewMessageStrips not called");
  });

  QUnit.test("announceNewMessageStrips calls _announceMessageStrips in the next event loop (after UI is redrawn)", function (assert) {
    var done = assert.async();
    var stub = sinon.stub(this.oAppController, "_announceMessageStrips");

    this.oAppController.announceNewMessageStrips();

    assert.notOk(stub.calledOnce, "_announceMessageStrips was not called immediately");
    setTimeout(function () {
      assert.ok(stub.calledOnce, "_announceMessageStrips was called eventually");
      done();
    });
  });

  QUnit.test("_announceMessageStrips calls oInvisibleMessage.announce for each visible MessageStrip", function (assert) {
    this.oAppController.onInit();

    var fakeStripVisible = false;
    var fakeStripTextNumber = 0;
    function makeFakeStrip() {
      fakeStripVisible = !fakeStripVisible;
      fakeStripTextNumber++;
      return {
        getVisible: function () { return fakeStripVisible; },
        getText: function () { return fakeStripTextNumber; }
      };
    }
    this.oViewStub.byId = function () {
      return makeFakeStrip();
    };
    var byIdSpy = sinon.spy(this.oViewStub, "byId");
    var translateStub = sinon.stub(this.oAppController, "_translateText").returnsArg(0);

    this.oAppController._announceMessageStrips();

    assert.strictEqual(byIdSpy.callCount, 6, "View.byId() called for all 6 messageStrips");
    assert.strictEqual(this.oInvisibleMessageAnnounceSpy.callCount, 4, "InvisibleMessage.announce() called for all 3 visible message strips (the first of which has details");
    assert.deepEqual(translateStub.firstCall.args[1], [1], "First translation called with correct text");
    assert.equal(translateStub.secondCall.args[1], undefined, "Second translation called with outout parameters, as it announces learn more");
    assert.deepEqual(translateStub.thirdCall.args[1], [3], "Third translation called with correct text");
    assert.deepEqual(translateStub.lastCall.args[1], [5], "Third translation called with correct text");
  });
});
