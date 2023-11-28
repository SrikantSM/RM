// global QUnit */

sap.ui.define([
    "sap/ui/base/ManagedObject",
    "sap/ui/core/Fragment",
    "businessServiceOrgUpload/App.controller",
    "sap/ui/thirdparty/sinon"
], function(ManagedObject, Fragment, AppController, sinon) {
    'use strict';

    var CSRF_TOKEN = "CSRF_TOKEN";
    var ERROR_DIALOG = "ERROR_DIALOG";
    var FILE_DOWNLOAD_URI = "FILE_DOWNLOAD_URI";
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
                            return window.location.origin;
                        }
                    };
                },
                getManifestEntry: function () { }
            };
            sinon.stub(this.oAppController, "getView").returns(this.oViewStub);
            sinon.stub(this.oAppController, "getOwnerComponent").returns(this.oOwnerComponentStub);
            oGetValueStub.withArgs("uploadMessageStrip").returns(MESSAGE_TEXT);
            oGetValueStub.withArgs("downloadMessageStrip").returns(MESSAGE_TEXT);
            this.oViewStub.byId = function (ID) {
                return {
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
            this.oAppController.getView.restore();
            this.oAppController.getOwnerComponent.restore();
        }
    });

    QUnit.test("Should initialize its model correctly", function (assert) {
        this.oAppController.onInit();
        var oExpectedUiModel = {
            busy: false,
            serviceUri: window.location.origin,
            userLocale: sap.ui.getCore().getConfiguration().getLanguageTag(),
            csrfToken: undefined,
            maxFileUploadSize: 2,
            messageVisible: false,
            messageType: undefined,
            messageText: undefined,
            messageLinkVisible: false,
            failedUpload: [],
            errorMessages: [],
            errorsForUI: []
        };
        assert.ok(this.oAppController.uiModel, "UI model exists");
        assert.propEqual(this.oAppController.uiModel.getProperty("/"), oExpectedUiModel, "The UI model is initialized with correct values");
        assert.equal(this.oAppController.getView().getModel("ui"), this.oAppController.uiModel, "The initialized model is set on the view with the name 'ui'");
    });

    QUnit.test("Should handle a completely succeeded file upload correctly", function (assert) {
        var oUploadCompleteEventStub = {
            getParameter: sinon.stub()
        };

        oUploadCompleteEventStub.getParameter.withArgs("status").returns(200);
        oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(JSON.stringify({
            createdItems: 1,
            createdHeaders: 1,
            errors: []
        }));

        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);
        this.oAppController.onInit();
        var oAnnounceStub = sinon.stub(this.oAppController.oInvisibleMessage, "announce");
        this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The UI model property 'busy' to be 'false'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The UI model property 'messageText' to be '" + "MESSAGE_TEXT" + "'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Success", "The UI model property 'messageType' to be 'Success'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The UI model property 'messageVisible' to be 'true'");
        assert.ok(oAnnounceStub.calledOnce, "announce method was called once");
        assert.ok(oTranslateTextStub.calledOnce, "Result text to display is translated");
        assert.strictEqual(oTranslateTextStub.firstCall.args[0], "uploadResult", "Correct result text is displayed to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][0], 1, "Correct number of processed items is displayed to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][1], 1, "Correct number of created items is displyed to the user");
        assert.strictEqual(sValue, "", "Correct value is set for fileuploader");
        oAnnounceStub.restore();
        oTranslateTextStub.restore();
    });

    QUnit.test("Should handle file upload warning correctly", function (assert) {
        var oUploadCompleteEventStub = {
            getParameter: sinon.stub()
        };
        var aErrors = [{message: "The following entries in the CSV file have empty mandatory fields: 2: costCenterID; ."}];

        oUploadCompleteEventStub.getParameter.withArgs("status").returns(200);
        oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(JSON.stringify({
            createdHeaders: 0,
            createdItems: 2,
            errors: aErrors
        }));

        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

        this.oAppController.onInit();
        this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The UI model property 'busy' to be 'false'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The UI model property 'messageText' to be '" + "MESSAGE_TEXT" + "'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Warning", "The UI model property 'messageType' to be 'Warning'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageLinkVisible"), true, "The UI model property 'messageLinkVisible' to be 'true'");
        assert.deepEqual(this.oAppController.uiModel.getProperty("/errors"), aErrors, "The UI model property 'errors' to be " + aErrors);
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The UI model property 'messageVisible' to be 'true'");

        assert.ok(oTranslateTextStub.calledOnce, "Result text to display is translated");
        assert.strictEqual(oTranslateTextStub.firstCall.args[0], "uploadResult", "Correct result text is displayed to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][0], 2, "Correct number of processed items is displayed to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][1], 0, "Correct number of created items is displyed to the user");
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

        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The UI model property 'busy' to be 'false'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The UI model property 'messageText' to be '" + "MESSAGE_TEXT" + "'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Success", "The UI model property 'messageType' to be 'Success'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The UI model property 'messageVisible' to be 'true'");
        assert.ok(oAnnounceStub.calledOnce, "announce method was called once");
        assert.ok(oTranslateTextStub.calledOnce, "Result text to display is translated");
        assert.strictEqual(oTranslateTextStub.firstCall.args[0], "uploadResult", "Correct result text is displayed to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][0], 0, "Correct number of processed items is displayed to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][1], 0, "Correct number of created items is displyed to the user");
        assert.strictEqual(sValue, "", "Correct value is set for fileuploader");
        oAnnounceStub.restore();
        oTranslateTextStub.restore();
    });

    QUnit.test("Should handle a succeeded file upload without a response createdItems property correctly", function (assert) {
        var oUploadCompleteEventStub = {
            getParameter: sinon.stub()
        };

        oUploadCompleteEventStub.getParameter.withArgs("status").returns(200);
        oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(JSON.stringify({
            createdHeaders: 0,
            errors: []
        }));

        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

        this.oAppController.onInit();
        this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The UI model property 'busy' to be 'false'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The UI model property 'messageText' to be '" + "MESSAGE_TEXT" + "'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Success", "The UI model property 'messageType' to be 'Success'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The UI model property 'messageVisible' to be 'true'");

        assert.ok(oTranslateTextStub.calledOnce, "Result text to display is translated");
        assert.strictEqual(oTranslateTextStub.firstCall.args[0], "uploadResult", "Correct result text is displayed to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][0], 0, "Correct number of processed items is displayed to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][1], 0, "Correct number of created items is displyed to the user");
        assert.strictEqual(sValue, "", "Correct value is set for fileuploader");
        oTranslateTextStub.restore();
    });

    QUnit.test("Should handle a succeeded file upload without a response createdHeaders property correctly", function (assert) {
        var oUploadCompleteEventStub = {
            getParameter: sinon.stub()
        };

        oUploadCompleteEventStub.getParameter.withArgs("status").returns(200);
        oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(JSON.stringify({
            createdItems: 0,
            errors: []
        }));

        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

        this.oAppController.onInit();
        this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The UI model property 'busy' to be 'false'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The UI model property 'messageText' to be '" + "MESSAGE_TEXT" + "'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Success", "The UI model property 'messageType' to be 'Success'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The UI model property 'messageVisible' to be 'true'");

        assert.ok(oTranslateTextStub.calledOnce, "Result text to display is translated");
        assert.strictEqual(oTranslateTextStub.firstCall.args[0], "uploadResult", "Correct result text is displayed to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][0], 0, "Correct number of processed items is displayed to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][1], 0, "Correct number of created items is displyed to the user");
        assert.strictEqual(sValue, "", "Correct value is set for fileuploader");
        oTranslateTextStub.restore();
    });

    QUnit.test("Should handle a succeeded file upload without a response errors property correctly", function (assert) {
        var oUploadCompleteEventStub = {
            getParameter: sinon.stub()
        };

        oUploadCompleteEventStub.getParameter.withArgs("status").returns(200);
        oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(JSON.stringify({
            createdHeaders: 1,
            createdItems: 1
        }));

        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

        this.oAppController.onInit();
        this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The UI model property 'busy' to be 'false'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The UI model property 'messageText' to be '" + "MESSAGE_TEXT" + "'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Success", "The UI model property 'messageType' to be 'Success'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The UI model property 'messageVisible' to be 'true'");

        assert.ok(oTranslateTextStub.calledOnce, "Result text to display is translated");
        assert.strictEqual(oTranslateTextStub.firstCall.args[0], "uploadResult", "Correct result text is displayed to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][0], 1, "Correct number of processed items is displayed to the user");
        assert.strictEqual(oTranslateTextStub.firstCall.args[1][1], 1, "Correct number of created items is displyed to the user");
        assert.strictEqual(sValue, "", "Correct value is set for fileuploader");
        oTranslateTextStub.restore();
    });

    QUnit.test("Should handle file upload error correctly", function (assert) {
        var oUploadCompleteEventStub = {
            getParameter: sinon.stub()
        };

        oUploadCompleteEventStub.getParameter.withArgs("status").returns(400);
        oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(JSON.stringify({
            message: ""
        }));

        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

        this.oAppController.onInit();
        var oAnnounceStub = sinon.stub(this.oAppController.oInvisibleMessage, "announce");
        this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The UI model property 'busy' to be 'false'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The UI model property 'messageText' to be '" + "MESSAGE_TEXT" + "'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "The UI model property 'messageType' to be 'Error'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The UI model property 'messageVisible' to be 'true'");
        assert.ok(oAnnounceStub.calledOnce, "announce method was called once");
        assert.ok(oTranslateTextStub.calledOnce, "Error text to display is translated");
        assert.strictEqual(oTranslateTextStub.firstCall.args[0], "errorUploadUnknown", "Correct error text is displayed to the user");
        assert.strictEqual(sValue, "", "Correct value is set for fileuploader");
        oAnnounceStub.restore();
        oTranslateTextStub.restore();
    });

    QUnit.test("Should handle a failed file upload without a response message correctly", function (assert) {
        var oUploadCompleteEventStub = {
            getParameter: sinon.stub()
        };

        oUploadCompleteEventStub.getParameter.withArgs("status").returns(400);
        oUploadCompleteEventStub.getParameter.withArgs("responseRaw").returns(null);

        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);

        this.oAppController.onInit();
        var oAnnounceStub = sinon.stub(this.oAppController.oInvisibleMessage, "announce");
        this.oAppController.handleUploadComplete(oUploadCompleteEventStub);

        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The UI model property 'busy' to be 'false'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "The UI model property 'messageText' to be '" + "MESSAGE_TEXT" + "'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "The UI model property 'messageType' to be 'Error'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The UI model property 'messageVisible' to be 'true'");
        assert.ok(oAnnounceStub.calledOnce, "announce method was called once");
        assert.ok(oTranslateTextStub.calledOnce, "Error text to display is translated");
        assert.strictEqual(oTranslateTextStub.firstCall.args[0], "errorUploadUnknown", "Correct error text is displayed to the user");
        assert.strictEqual(sValue, "", "Correct value is set for fileuploader");
        oAnnounceStub.restore();
        oTranslateTextStub.restore();
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
                getText: function(){
                    return oGetValueStub(ID);
                }
            };
        };
        oGetValueStub.withArgs("fileUploader").returns("fileUploader");
        oGetValueStub.withArgs("uploadMessageStrip").returns(MESSAGE_TEXT);
        oGetValueStub.withArgs("downloadMessageStrip").returns(MESSAGE_TEXT);
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
                getText: function(){
                    return oGetValueStub(ID);
                }
            };
        };
        oGetValueStub.withArgs("fileUploader").returns("fileUploader");
        oGetValueStub.withArgs("uploadMessageStrip").returns(MESSAGE_TEXT);
        oGetValueStub.withArgs("downloadMessageStrip").returns(MESSAGE_TEXT);
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
        oGetValueStub.withArgs("downloadMessageStrip").returns(MESSAGE_TEXT);

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
            oAnnounceStub.restore();
            oHandleCsrfTokenStub.restore();
            oById.restore();
            oTranslateTextStub.restore();
            fDone();
        }.bind(this), 1);
    });

    QUnit.test("Should not handle an upload press when the UI is busy", function (assert) {
        this.oAppController.onInit();
        this.oAppController.uiModel.setProperty("/busy", true);
        var oPreviousModelData = Object.assign({}, this.oAppController.uiModel.getData());
        this.oAppController.handleUploadPress();
        assert.deepEqual(this.oAppController.uiModel.getData(), oPreviousModelData, "The UI model data is unchanged");
    });

    QUnit.test("Should handle file change correctly", function (assert) {
        var oEventStub = { getParameter: sinon.stub().returns('/Service_Org.csv') };

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

    QUnit.test("Should handle more link press correctly", function (assert) {
        var fDone = assert.async(1);
        var oErrorDialogStub = {
            open: sinon.stub()
        };
        var oGetErrorDialogStub = sinon.stub(this.oAppController, "getErrorDialog").returns(
            Promise.resolve(oErrorDialogStub)
        );

        this.oAppController.handleMoreLinkPress();

        setTimeout(function () {
            assert.ok(oErrorDialogStub.open.calledOnce, "The error dialog was opened");
            oGetErrorDialogStub.restore();
            fDone();
        });
    });

    QUnit.test("Should handle closing of error dialog correctly", function (assert) {
        var fDone = assert.async(1);
        var oErrorDialogStub = {
            close: sinon.stub()
        };
        var oGetErrorDialogStub = sinon.stub(this.oAppController, "getErrorDialog").returns(
            Promise.resolve(oErrorDialogStub)
        );

        this.oAppController.handleCloseErrorDialog();

        setTimeout(function () {
            assert.ok(oErrorDialogStub.close.calledOnce, "The error dialog was closed");
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
            assert.strictEqual(oLoadStub.firstCall.args[0].name, "businessServiceOrgUpload.ErrorDialog", "The correct fragment was loaded");
            assert.strictEqual(oLoadStub.firstCall.args[0].controller, this.oAppController, "The correct controller was provided while loading the fragment");

            assert.ok(oAddDependentStub.calledOnce, "The dialog was added to the view as a dependent");
            assert.strictEqual(oAddDependentStub.firstCall.args[0], ERROR_DIALOG, "Correct dialog was added as a dependent");
            assert.strictEqual(errorDialog, ERROR_DIALOG, "Correct error dialog was returned");

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

    QUnit.test("Should handle download press correctly", function (assert) {
        var ajaxStub = {
            done: sinon.stub(),
            fail: sinon.stub(),
            always: sinon.stub()
        };
        ajaxStub.done.returns(ajaxStub);
        ajaxStub.fail.returns(ajaxStub);
        ajaxStub.always.returns(ajaxStub);
        var jQueryStub = sinon.stub(jQuery, "ajax").returns(ajaxStub);

        this.oAppController.onInit();
        this.oAppController.handleDownloadPress();

        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), false, "The messageVisible property is set to false");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), true, "The busy property is set to true");
        assert.ok(jQueryStub.calledOnce, "Ajax method was called once");
        assert.ok(ajaxStub.done.calledOnce, "Done method was called once");
        assert.ok(ajaxStub.always.calledOnce, "Always method was called once");
        assert.ok(jQuery.ajax.calledWithMatch({
            method: "GET",
            url: window.location.origin,
            xhrFields: {
                responseType: 'blob'
            }
        }));

        jQueryStub.restore();
    });

    QUnit.test("Should execute success callback of download press correctly", function (assert) {
        var ajaxStub = sinon.stub(jQuery, "ajax", function (req) {
            var d = new jQuery.Deferred();
            d.resolve({});
            return d.promise();
        });
        var createObjectURLStub = sinon.stub(window.URL, "createObjectURL").returns(FILE_DOWNLOAD_URI);

        this.oAppController.onInit();
        this.oAppController.handleDownloadPress();

        assert.ok(createObjectURLStub.calledOnce, "Create object url method was called once");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The busy property is set to false");

        ajaxStub.restore();
        createObjectURLStub.restore();
    });

    QUnit.test("Should execute fail callback of download press correctly", function (assert) {
        var ajaxStub = sinon.stub(jQuery, "ajax", function (req) {
            var d = new jQuery.Deferred();
            d.reject(undefined, 'failure', 'error');
            return d.promise();
        });

        this.oAppController.onInit();
        this.oAppController.handleDownloadPress();

        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "The messageType property is set to 'Error'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), 'error', "The messageText property is set to 'error'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "The messageVisible property is set to true");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "The busy property is set to false");

        ajaxStub.restore();
    });

});
