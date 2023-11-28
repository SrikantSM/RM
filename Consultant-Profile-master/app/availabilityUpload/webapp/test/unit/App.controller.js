// global QUnit

sap.ui.define([
    "sap/ui/base/ManagedObject",
    "availabilityUpload/App.controller",
    "sap/ui/thirdparty/sinon",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"
], function (ManagedObject, AppController, sinon, Fragment, MessageToast) {
    "use strict";

    var CSRF_TOKEN = "CSRF_TOKEN";
    var FILE_UPLOAD_URI = "FILE_UPLOAD_URI";
    var MESSAGE_TEXT = "MESSAGE_TEXT";
    var oGetValueStub = sinon.stub();
    var sValue;

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
            sinon.stub(this.oAppController, "getView").returns(this.oViewStub);
            sinon.stub(this.oAppController, "getOwnerComponent").returns(this.oOwnerComponentStub);

            oGetValueStub.withArgs("costCenterInput").returns("CC01");
            oGetValueStub.withArgs("uploadMessageStrip").returns(MESSAGE_TEXT);
            this.oViewStub.byId = function (ID) {
                return {
                    getValue: function () {
                        return oGetValueStub(ID);
                    },
                    setValue: function (val) {
                        sValue = val;
                    },
                    getText: function(){
                        return oGetValueStub(ID);
                    }
                };
            };
        },
        afterEach: function () {
            this.oAppController.destroy();
            this.oViewStub.destroy();
        }
    });

    QUnit.test("Should initialize its model correctly", function (assert) {
        this.oAppController.onInit();

        var oExpectedUiModel = {
            busy: false,
            serviceUri: FILE_UPLOAD_URI,
            userLocale: sap.ui.getCore().getConfiguration().getLanguageTag(),
            csrfToken: undefined,
            maxFileUploadSize: 2,
            messageVisible: false,
            messageType: undefined,
            messageText: undefined
        };

        assert.ok(this.oAppController.uiModel, "The UI model exists");
        assert.propEqual(this.oAppController.uiModel.getProperty("/"), oExpectedUiModel, "The UI model is initialized with correct values");
        assert.equal(this.oAppController.getView().getModel("ui"), this.oAppController.uiModel, "The initialized model is set on the view with the name 'ui'");
    });

    QUnit.test("Should not handle an upload press when the UI is busy", function (assert) {
        this.oAppController.onInit();
        this.oAppController.uiModel.setProperty("/busy", true);
        var oPreviousModelData = Object.assign({}, this.oAppController.uiModel.getData());
        this.oAppController.handleUploadPress();
        assert.deepEqual(this.oAppController.uiModel.getData(), oPreviousModelData, "The UI model data is unchanged");
    });

    QUnit.test("Should handle file change correctly", function (assert) {
        var oEventStub = { getParameter: sinon.stub().returns('/availability.csv') };

        this.oAppController.onInit();
        this.oAppController.handleFileChange(oEventStub);

        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), false, "The messageVisible property is set to false");
    });

    QUnit.test("Should handle exceeded file size correctly and translate error text correctly", function (assert) {
        this.oAppController.onInit();
        this.oAppController.oResourceBundle = null;

        var oResourceBundleStub = { getText: sinon.stub() };
        oResourceBundleStub.getText.withArgs("maxFileUploadSizeExceeded", this.oAppController.uiModel.getProperty("/maxFileUploadSize")).returns(MESSAGE_TEXT);
        var oResStub = { getResourceBundle: function () { return oResourceBundleStub; } };
        var oModelStub = sinon.stub(this.oViewStub, "getModel").withArgs("i18n").returns(oResStub);

        this.oAppController.handleFileSizeExceed();

        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The messageVisible property is set to true.");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "The messageType property is set to Error.");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The messageText property is set to 'MESSAGE_TEXT'.");
        assert.ok(oModelStub.calledOnce, "Model method was called once");
        assert.ok(oResourceBundleStub.getText.calledOnce, "get Text method was called once");
        assert.strictEqual(oModelStub.firstCall.args[0], "i18n", "Model method was called with correct argument");
    });

    QUnit.test("Should open cost center value help ", async function (assert) {
        const oDialogStub = {
            open : sinon.stub()
        };
        var ajaxCallStub = sinon.stub(Fragment, "load", function (req) {
            return Promise.resolve(oDialogStub);
        });
        this.oAppController.getView.restore();
        var oAddDependent = sinon.stub(this.oAppController,"getView").returns({
            addDependent : sinon.stub()
        });

        var oEventSourceStub = {
            getValue: sinon.stub().returns('ValidInput')
        };
        var oEventStub = {
            getSource: function () {
                return oEventSourceStub;
            }
        };
        await this.oAppController.onCostCenterInput(oEventStub);
        assert.ok(true);
        assert.ok(Fragment.load.calledOnce, "Cost center fragment is loaded once");
        assert.ok(this.oAppController.getView.calledOnce, "Controller of cost center opened ");
        assert.ok(oDialogStub.open.calledOnce, "Dialog was opened");
        ajaxCallStub.restore();
        oAddDependent.restore();
    });

    QUnit.test("Should open cost center value help(negative case scenario) ", async function (assert) {
        const oDialogStub = {
            open : sinon.stub()
        };
        var ajaxCallStub = sinon.stub(Fragment, "load", function (req) {
            return Promise.reject(oDialogStub);
        });
        var msgToastStub = sinon.stub(MessageToast, "show").returns(true);

        this.oAppController.getView.restore();
        var oAddDependent = sinon.stub(this.oAppController,"getView").returns({
            addDependent : sinon.stub()
        });

        var oEventSourceStub = {
            getValue: sinon.stub().returns('ValidInput')
        };
        var oEventStub = {
            getSource: function () {
                return oEventSourceStub;
            }
        };
        await this.oAppController.onCostCenterInput(oEventStub);
        assert.ok(true);
        assert.ok(Fragment.load.calledOnce, "Cost center fragment is not loaded once");
        assert.ok(this.oAppController.getView.calledOnce, "Controller of cost center opened ");
        assert.ok(msgToastStub.calledTwice, "Cost center dialog failed to open");
        ajaxCallStub.restore();
        oAddDependent.restore();
        msgToastStub.restore();
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
                getText: function(){
                    return oGetValueStub(ID);
                }
            };
        };
        oGetValueStub.withArgs("fileUploader").returns("");
        oGetValueStub.withArgs("uploadMessageStrip").returns(MESSAGE_TEXT);
        this.oAppController.onInit();
        var oAnnounceStub = sinon.stub(this.oAppController.oInvisibleMessage, "announce");
        this.oAppController.handleUploadPress();

        setTimeout(function () {
            assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The busy property is set to false.");
            assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "The messageType property is set to 'Error'.");
            assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The messageText property is set to 'MESSAGE_TEXT'.");
            assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The messageVisible property is set to true.");
            assert.strictEqual(this.oAppController.uiModel.getProperty("/messageLinkVisible"), false, "The messageLinkVisible property is set to false.");
            assert.ok(oTranslateTextStub.calledOnce, "Error text to display is translated");
            assert.strictEqual(oTranslateTextStub.firstCall.args[0], "errorNoFile", "Correct text is displayed to the user");
            assert.ok(oHandleCsrfTokenStub.notCalled, "handle csrf token function was not called");
            assert.ok(oFileUploadStub.upload.notCalled, "file upload function was not called");
            assert.ok(oAnnounceStub.calledOnce, "announce method was called once");

            oHandleCsrfTokenStub.restore();
            oById.restore();
            oTranslateTextStub.restore();
            oAnnounceStub.restore();
            fDone();
        }.bind(this), 1);
    });

    QUnit.test("Should handle upload press with invalid costcenter input", function (assert) {
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
                getText: function () {
                    return oGetValueStub(ID);
                },
                getValueState: function () {
                    return sap.ui.core.ValueState.Error;
                }

            };
        };
        oGetValueStub.withArgs("fileUploader").returns("fileUploader");
        oGetValueStub.withArgs("costCenterInput").returns("CCDE");
        oGetValueStub.withArgs("uploadMessageStrip").returns(MESSAGE_TEXT);

        this.oAppController.onInit();
        var oAnnounceStub = sinon.stub(this.oAppController.oInvisibleMessage, "announce");
        this.oAppController.handleUploadPress();

        setTimeout(function () {
            assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The busy property is set to false.");
            assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "The messageType property is set to 'Error'.");
            assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The messageText property is set to 'MESSAGE_TEXT'.");
            assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The messageVisible property is set to true.");
            assert.strictEqual(this.oAppController.uiModel.getProperty("/messageLinkVisible"), false, "The messageLinkVisible property is set to false.");
            assert.ok(oTranslateTextStub.calledOnce, "Error text to display is translated");
            assert.strictEqual(oTranslateTextStub.firstCall.args[0], "errorInvalidCostCenter", "Correct text is displayed to the user");
            assert.ok(oHandleCsrfTokenStub.notCalled, "handle csrf token function was not called");
            assert.ok(oFileUploadStub.upload.notCalled, "file upload function was not called");
            assert.ok(oAnnounceStub.calledOnce, "announce method was called once");

            oHandleCsrfTokenStub.restore();
            oById.restore();
            oTranslateTextStub.restore();
            oAnnounceStub.restore();
            fDone();
        }.bind(this), 1);
    });

    QUnit.test("Should handle upload press with null costcenter input", function (assert) {
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
                getText: function(){
                    return oGetValueStub(ID);
                }
            };
        };
        oGetValueStub.withArgs("fileUploader").returns("fileUploader");
        oGetValueStub.withArgs("costCenterInput").returns("");
        oGetValueStub.withArgs("uploadMessageStrip").returns(MESSAGE_TEXT);

        this.oAppController.onInit();
        var oAnnounceStub = sinon.stub(this.oAppController.oInvisibleMessage, "announce");
        this.oAppController.handleUploadPress();

        setTimeout(function () {
            assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The busy property is set to false.");
            assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "The messageType property is set to 'Error'.");
            assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The messageText property is set to 'MESSAGE_TEXT'.");
            assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The messageVisible property is set to true.");
            assert.strictEqual(this.oAppController.uiModel.getProperty("/messageLinkVisible"), false, "The messageLinkVisible property is set to false.");
            assert.ok(oTranslateTextStub.calledOnce, "Error text to display is translated");
            assert.strictEqual(oTranslateTextStub.firstCall.args[0], "errorNoCostCenter", "Correct text is displayed to the user");
            assert.ok(oHandleCsrfTokenStub.notCalled, "handle csrf token function was not called");
            assert.ok(oFileUploadStub.upload.notCalled, "file upload function was not called");
            assert.ok(oAnnounceStub.calledOnce, "announce method was called once");

            oHandleCsrfTokenStub.restore();
            oById.restore();
            oTranslateTextStub.restore();
            oAnnounceStub.restore();
            fDone();
        }.bind(this), 1);
    });

    QUnit.test("Should handle upload press correctly (fetch csrf token correctly in case of http success status)", function (assert) {
        var fDone = assert.async(1);
        var oFileUploadStub = {
            upload: sinon.stub()
        };
        var jqXHRStub = {
            getResponseHeader: sinon.stub()
        };
        jqXHRStub.getResponseHeader.withArgs("x-csrf-token").returns(CSRF_TOKEN);
        var jQueryStub = sinon.stub(jQuery, "ajax");
        var oById = sinon.stub(this.oAppController, "byId").returns(oFileUploadStub);
        var oGetValueStub = sinon.stub();
        this.oViewStub.byId = function (ID) {
            return {
                getValue: function () {
                    return oGetValueStub(ID);
                },
                getValueState: function () {
                    return sap.ui.core.ValueState.None;
                }
            };
        };
        oGetValueStub.withArgs("fileUploader").returns("fileUploader");
        oGetValueStub.withArgs("costCenterInput").returns("costCenter");
        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

        this.oAppController.onInit();
        this.oAppController.handleUploadPress();
        jQuery.ajax.firstCall.args[0].success(null, null, jqXHRStub);

        setTimeout(function () {
            assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), true, "The busy property is set to true.");
            assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), false, "The messageVisible property is set to false.");
            assert.strictEqual(this.oAppController.uiModel.getProperty("/messageLinkVisible"), false, "The messageLinkVisible property is set to false.");
            assert.ok(oFileUploadStub.upload.calledOnce, "file upload function was called");
            assert.ok(oTranslateTextStub.calledOnce, "Result text to display is translated");
            assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The the UI model property 'messageText' to be '" + "MESSAGE_TEXT" + "'");
            assert.strictEqual(oTranslateTextStub.firstCall.args[0], "uploading", "Translate text method called with proper parameter:Uploading");
            assert.ok(jQuery.ajax.calledWithMatch({
                method: "HEAD",
                url: window.location.origin,
                headers: {
                    "x-csrf-token": "fetch"
                }
            }));
            assert.strictEqual(this.oAppController.uiModel.getProperty("/csrfToken"), CSRF_TOKEN);
            oById.restore();
            jQueryStub.restore();
            fDone();
        }.bind(this), 1);
    });

    QUnit.test("Fetch csrf token correctly in case of http error status", function (assert) {
        var fDone = assert.async(1);
        var oFileUploadStub = {
            upload: sinon.stub()
        };
        var jqXHRStub = {
            getResponseHeader: sinon.stub()
        };
        jqXHRStub.getResponseHeader.withArgs("x-csrf-token").returns(CSRF_TOKEN);
        var jQueryStub = sinon.stub(jQuery, "ajax");
        var oById = sinon.stub(this.oAppController, "byId").returns(oFileUploadStub);
        var oGetValueStub = sinon.stub();
        this.oViewStub.byId = function (ID) {
            return {
                getValue: function () {
                    return oGetValueStub(ID);
                },
                getValueState: function () {
                    return sap.ui.core.ValueState.None;
                }
            };
        };
        oGetValueStub.withArgs("fileUploader").returns("fileUploader");
        oGetValueStub.withArgs("costCenterInput").returns("costCenter");
        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

        this.oAppController.onInit();
        this.oAppController.handleUploadPress();
        jQuery.ajax.firstCall.args[0].error(jqXHRStub, null, null);

        setTimeout(function () {
            assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), true, "The busy property is set to true.");
            assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), false, "The messageVisible property is set to false.");
            assert.strictEqual(this.oAppController.uiModel.getProperty("/messageLinkVisible"), false, "The messageLinkVisible property is set to false.");
            assert.ok(oFileUploadStub.upload.calledOnce, "file upload function was called");
            assert.ok(oTranslateTextStub.calledOnce, "Result text to display is translated");
            assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The the UI model property 'messageText' to be '" + "MESSAGE_TEXT" + "'");
            assert.strictEqual(oTranslateTextStub.firstCall.args[0], "uploading", "Translate text method called with proper parameter:Uploading");
            assert.ok(jQuery.ajax.calledWithMatch({
                method: "HEAD",
                url: window.location.origin,
                headers: {
                    "x-csrf-token": "fetch"
                }
            }));
            assert.strictEqual(this.oAppController.uiModel.getProperty("/csrfToken"), CSRF_TOKEN);
            oById.restore();
            jQueryStub.restore();
            fDone();
        }.bind(this), 1);
    });

    QUnit.test("Should handle a completely succeeded file upload correctly", function (assert) {
        var oUploadCompleteEventStub = {
            getParameter: sinon.stub()
        };
        this.oAppController.onInit();
        oUploadCompleteEventStub.getParameter.withArgs("status").returns(200);
        oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(JSON.stringify({
            createdItems: 3,
            errors: 0
        }));

        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);
        var oAnnounceStub = sinon.stub(this.oAppController.oInvisibleMessage, "announce");
        this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The the UI model property 'busy' to be 'false'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The the UI model property 'messageText' to be '" + "MESSAGE_TEXT" + "'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Success", "The the UI model property 'messageType' to be 'Success'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The The the UI model property 'messageVisible' to be 'true'");

        assert.ok(oTranslateTextStub.calledOnce, "Result text to display is translated");
        assert.strictEqual(oTranslateTextStub.firstCall.args[0], "uploadResult", "The right result text is displayed to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][0], 3, "The right amount of processed items is reported to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][1], 3, "The right amount of successfully created items is reported to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][2], 0, "The right amount of errors is reported to the user");
        assert.strictEqual(sValue, "", "Correct value is set for fileuploader");
        assert.ok(oAnnounceStub.calledOnce, "announce method was called once");
        oTranslateTextStub.restore();
        oAnnounceStub.restore();
    });

    QUnit.test("Should handle a partly succeeded file upload correctly", function (assert) {
        var oUploadCompleteEventStub = {
            getParameter: sinon.stub()
        };

        oUploadCompleteEventStub.getParameter.withArgs("status").returns(200);
        oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(JSON.stringify({
            createdItems: 1,
            errors: 2
        }));

        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

        this.oAppController.onInit();
        var oAnnounceStub = sinon.stub(this.oAppController.oInvisibleMessage, "announce");
        this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The the UI model property 'busy' to be 'false'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The the UI model property 'messageText' to be '" + MESSAGE_TEXT + "'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Warning", "The the UI model property 'messageType' to be 'Warning'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The The the UI model property 'messageVisible' to be 'true'");

        assert.ok(oTranslateTextStub.calledOnce, "Result text to display is translated");
        assert.strictEqual(oTranslateTextStub.firstCall.args[0], "uploadResult", "The right result text is displayed to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[0], "uploadResult", "The right result text is displayed to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][0], 3, "The right amount of processed items is reported to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][1], 1, "The right amount of successfully created items is reported to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][2], 2, "The right amount of errors is reported to the user");
        assert.strictEqual(sValue, "", "Correct value is set for fileuploader");
        assert.ok(oAnnounceStub.calledOnce, "announce method was called once");
        oTranslateTextStub.restore();
        oAnnounceStub.restore();
    });

    QUnit.test("Should handle a partly succeeded file with invalid resourceId", function (assert) {
        var oUploadCompleteEventStub = {
            getParameter: sinon.stub()
        };

        oUploadCompleteEventStub.getParameter.withArgs("status").returns(200);
        oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(JSON.stringify({
            createdItems: 1,
            errors: 2,
            resourceIDErrors: 1
        }));

        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

        this.oAppController.onInit();
        this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The the UI model property 'busy' to be 'false'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The the UI model property 'messageText' to be '" + MESSAGE_TEXT + "'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Warning", "The the UI model property 'messageType' to be 'Warning'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The The the UI model property 'messageVisible' to be 'true'");

        assert.ok(oTranslateTextStub.calledOnce, "Result text to display is translated");
        assert.strictEqual(oTranslateTextStub.firstCall.args[0], "uploadResultResourceID", "The right result text is displayed to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][0], 3, "The right amount of processed items is reported to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][1], 1, "The right amount of successfully created items is reported to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][2], 1, "The right amount of errors is reported to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][3], 1, "The right amount of resourceId errors is reported to the user");
        assert.strictEqual(sValue, "", "Correct value is set for fileuploader");
        oTranslateTextStub.restore();
    });

    QUnit.test("Should handle a succeeded file upload without a response message correctly", function (assert) {
        var oUploadCompleteEventStub = {
            getParameter: sinon.stub()
        };

        oUploadCompleteEventStub.getParameter.withArgs("status").returns(200);
        oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(null);

        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

        this.oAppController.onInit();
        var oAnnounceStub = sinon.stub(this.oAppController.oInvisibleMessage, "announce");
        this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The the UI model property 'busy' to be 'false'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The the UI model property 'messageText' to be '" + MESSAGE_TEXT + "'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Success", "The the UI model property 'messageType' to be 'Success'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The The the UI model property 'messageVisible' to be 'true'");

        assert.ok(oTranslateTextStub.calledOnce, "Result text to display is translated");
        assert.strictEqual(oTranslateTextStub.firstCall.args[0], "uploadResult", "The right result text is displayed to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][0], 0, "The right amount of processed items is reported to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][1], 0, "The right amount of successfully created items is reported to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][2], 0, "The right amount of errors is reported to the user");
        assert.strictEqual(sValue, "", "Correct value is set for fileuploader");
        assert.ok(oAnnounceStub.calledOnce, "announce method was called once");
        oTranslateTextStub.restore();
        oAnnounceStub.restore();
    });

    QUnit.test("Should handle a succeeded file upload without a response createdItems property correctly", function (assert) {
        var oUploadCompleteEventStub = {
            getParameter: sinon.stub()
        };

        oUploadCompleteEventStub.getParameter.withArgs("status").returns(200);
        oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(JSON.stringify({
            errors: 2
        }));

        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

        this.oAppController.onInit();
        var oAnnounceStub = sinon.stub(this.oAppController.oInvisibleMessage, "announce");
        this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The the UI model property 'busy' to be 'false'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The the UI model property 'messageText' to be '" + MESSAGE_TEXT + "'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Warning", "The the UI model property 'messageType' to be 'Warning'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The The the UI model property 'messageVisible' to be 'true'");

        assert.ok(oTranslateTextStub.calledOnce, "Result text to display is translated");
        assert.strictEqual(oTranslateTextStub.firstCall.args[0], "uploadResult", "The right result text is displayed to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][0], 2, "The right amount of processed items is reported to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][1], 0, "The right amount of successfully created items is reported to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][2], 2, "The right amount of errors is reported to the user");
        assert.strictEqual(sValue, "", "Correct value is set for fileuploader");
        assert.ok(oAnnounceStub.calledOnce, "announce method was called once");
        oTranslateTextStub.restore();
        oAnnounceStub.restore();
    });

    QUnit.test("Should handle a succeeded file upload without a response errors property correctly", function (assert) {
        var oUploadCompleteEventStub = {
            getParameter: sinon.stub()
        };

        oUploadCompleteEventStub.getParameter.withArgs("status").returns(200);
        oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(JSON.stringify({
            createdItems: 1
        }));

        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

        this.oAppController.onInit();
        var oAnnounceStub = sinon.stub(this.oAppController.oInvisibleMessage, "announce");
        this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The the UI model property 'busy' to be 'false'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The the UI model property 'messageText' to be '" + MESSAGE_TEXT + "'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Success", "The the UI model property 'messageType' to be 'Success'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The The the UI model property 'messageVisible' to be 'true'");

        assert.ok(oTranslateTextStub.calledOnce, "Result text to display is translated");
        assert.strictEqual(oTranslateTextStub.firstCall.args[0], "uploadResult", "The right result text is displayed to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][0], 1, "The right amount of processed items is reported to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][1], 1, "The right amount of successfully created items is reported to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][2], 0, "The right amount of errors is reported to the user");
        assert.strictEqual(sValue, "", "Correct value is set for fileuploader");
        assert.ok(oAnnounceStub.calledOnce, "announce method was called once");
        oTranslateTextStub.restore();
        oAnnounceStub.restore();
    });

    QUnit.test("Should handle file upload error correctly (when message is empty)", function (assert) {
        var oUploadCompleteEventStub = {
            getParameter: sinon.stub()
        };

        oUploadCompleteEventStub.getParameter.withArgs("status").returns(400);
        oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(JSON.stringify(""));

        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

        this.oAppController.onInit();
        var oAnnounceStub = sinon.stub(this.oAppController.oInvisibleMessage, "announce");
        this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The UI model property 'busy' to be 'false'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The UI model property 'messageText' to be '" + "MESSAGE_TEXT" + "'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "The UI model property 'messageType' to be 'Error'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The UI model property 'messageVisible' to be 'true'");
        assert.ok(oTranslateTextStub.calledOnce, "Translate method was called");
        assert.strictEqual(sValue, "", "Correct value is set for fileuploader");
        assert.ok(oAnnounceStub.calledOnce, "announce method was called once");
        oTranslateTextStub.restore();
        oAnnounceStub.restore();
    });

    QUnit.test("Should handle file upload error correctly (when message is not empty)", function (assert) {
        var oUploadCompleteEventStub = {
            getParameter: sinon.stub()
        };

        oUploadCompleteEventStub.getParameter.withArgs("status").returns(400);
        oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(JSON.stringify("CSV_COLUMN_MISSING"));

        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

        this.oAppController.onInit();
        var oAnnounceStub = sinon.stub(this.oAppController.oInvisibleMessage, "announce");
        this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The UI model property 'busy' to be 'false'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), "CSV_COLUMN_MISSING", "The UI model property 'messageText' to be '" + "CSV_COLUMN_MISSING" + "'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "The UI model property 'messageType' to be 'Error'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The UI model property 'messageVisible' to be 'true'");
        assert.ok(oTranslateTextStub.notCalled, "Translate method was not called");
        assert.strictEqual(sValue, "", "Correct value is set for fileuploader");
        assert.ok(oAnnounceStub.calledOnce, "announce method was called once");
        oTranslateTextStub.restore();
        oAnnounceStub.restore();
    });

});
