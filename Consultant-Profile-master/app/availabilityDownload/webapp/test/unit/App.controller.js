// global QUnit

sap.ui.define([
    "sap/ui/base/ManagedObject",
    "availabilityDownload/App.controller",
    "sap/ui/core/format/DateFormat",
    "sap/ui/thirdparty/sinon",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"
], function (ManagedObject, AppController, DateFormat, sinon, Fragment, MessageToast) {
    "use strict";
    var FILE_DOWNLOAD_URI = "FILE_DOWNLOAD_URI";
    var MESSAGE_TEXT = "MESSAGE_TEXT";

    QUnit.module("Test App Controller", {
        beforeEach: function () {

            this.oAppController = new AppController();
            this.oViewStub = new ManagedObject({});
            this.oOwnerComponentStub = {
                getManifestObject: function () {
                    return {
                        resolveUri: function (sUri) {
                            return FILE_DOWNLOAD_URI;
                        }
                    };
                },
                getManifestEntry: function (sUri) { return ""; }
            };
            sinon.stub(this.oAppController, "getView").returns(this.oViewStub);
            sinon.stub(this.oAppController, "getOwnerComponent").returns(this.oOwnerComponentStub);
        },
        afterEach: function () {
            this.oViewStub.destroy();
        }
    });

    QUnit.test("Should initialize its model correctly", function (assert) {
        var initializeDateControlStub = sinon.stub(this.oAppController, "initializeDateControl");
        var handleSelectionChangeStub = sinon.stub(this.oAppController, "handleSelectionChange");
        var oExpectedUiModel = {
            busy: false,
            messageVisible: false,
            messageType: undefined,
            messageText: undefined,
            costCenter: "",
            workforceID: "",
            startDate: undefined,
            endDate: undefined
        };

        this.oAppController.onInit();

        assert.ok(this.oAppController.uiModel, "The UI model exists");
        assert.ok(initializeDateControlStub.calledOnce, "initializeDateControl method was called once");
        assert.ok(handleSelectionChangeStub.calledOnce, "handleSelectionChange method was called once");
        assert.propEqual(this.oAppController.uiModel.getProperty("/"), oExpectedUiModel, "The UI model is initialized with correct values");
        assert.equal(this.oAppController.getView().getModel("ui"), this.oAppController.uiModel, "The initialized model is set on the view with the name 'ui'");
        initializeDateControlStub.restore();
        handleSelectionChangeStub.restore();
    });

    QUnit.test("Should initialize date controller and set default values for plannedWorkingHours and plannedNonWorkingHours correctly", function (assert) {
        var setValueStub = { setValue: sinon.stub() };
        var oByIdStub = sinon.stub();
        oByIdStub.withArgs("plannedWorkingHoursInput").returns(setValueStub);
        oByIdStub.withArgs("plannedNonWorkingHoursInput").returns(setValueStub);
        this.oViewStub.byId = function (sID) {
            return oByIdStub(sID);
        };

        this.oAppController.initializeDateControl();

        assert.strictEqual(oByIdStub.firstCall.args[0], "plannedWorkingHoursInput", "Planned working hours id was correclty passed");
        assert.strictEqual(oByIdStub.secondCall.args[0], "plannedNonWorkingHoursInput", "Planned non working hours id was correclty passed");
        assert.strictEqual(setValueStub.setValue.firstCall.args[0], 8, "plannedWorkingHoursInput value is set correctly");
        assert.strictEqual(setValueStub.setValue.secondCall.args[0], 0, "plannedNonWorkingHoursInput value is set correctly");
    });

    QUnit.test("Should handle selection change correctly (cost center is selected)", function (assert) {
        var oByIdStub = sinon.stub();
        var oSetValueStub = {
            setEnabled: sinon.stub(),
            setValue: sinon.stub(),
            setValueState: sinon.stub()
        };
        var oGetSelectedStub = {
            getSelected: function () {
                return true;
            }
        };
        oByIdStub.withArgs("rbCostCenter").returns(oGetSelectedStub);
        oByIdStub.withArgs("rbWorkforceID").returns(oGetSelectedStub);
        oByIdStub.withArgs("costCenterInput").returns(oSetValueStub);
        oByIdStub.withArgs("workforceIDInput").returns(oSetValueStub);
        this.oViewStub.byId = function (sID) {
            return oByIdStub(sID);
        };

        this.oAppController.handleSelectionChange();

        assert.strictEqual(oByIdStub.callCount, 5, "by id method was called correct number of times");
        assert.strictEqual(oByIdStub.getCall(0).args[0], "rbCostCenter", "Cost center radio button id was correclty passed");
        assert.strictEqual(oByIdStub.getCall(1).args[0], "costCenterInput", "Cost center input id was correclty passed");
        assert.strictEqual(oByIdStub.getCall(2).args[0], "workforceIDInput", "Work force id input id was correclty passed");
        assert.strictEqual(oByIdStub.getCall(3).args[0], "workforceIDInput", "Work force id input id was correclty passed");
        assert.strictEqual(oByIdStub.getCall(4).args[0], "workforceIDInput", "Work force id input id was correclty passed");
        assert.strictEqual(oSetValueStub.setEnabled.callCount, 2, "set editable method was called correct number of times");
        assert.strictEqual(oSetValueStub.setEnabled.getCall(0).args[0], true, "On first call, correct arg was passed to set editable method");
        assert.strictEqual(oSetValueStub.setEnabled.getCall(1).args[0], false, "On second call, correct arg was passed to set editable method");
        assert.strictEqual(oSetValueStub.setValue.callCount, 1, "set value method was called correct number of times");
        assert.strictEqual(oSetValueStub.setValue.firstCall.args[0], "", "On first call, correct arg was passed to set value method");
        assert.strictEqual(oSetValueStub.setValueState.firstCall.args[0], sap.ui.core.ValueState.None, "Correct value was passed to setValueState method");
    });

    QUnit.test("Should handle selection change correctly (workforce id is selected)", function (assert) {
        var oByIdStub = sinon.stub();
        var oSetValueStub = {
            setEnabled: sinon.stub(),
            setValue: sinon.stub(),
            setValueState: sinon.stub()
        };
        var oGetSelectedStub1 = {
            getSelected: function () {
                return true;
            }
        };
        var oGetSelectedStub2 = {
            getSelected: function () {
                return false;
            }
        };
        oByIdStub.withArgs("rbCostCenter").returns(oGetSelectedStub2);
        oByIdStub.withArgs("rbWorkforceID").returns(oGetSelectedStub1);
        oByIdStub.withArgs("costCenterInput").returns(oSetValueStub);
        oByIdStub.withArgs("workforceIDInput").returns(oSetValueStub);
        this.oViewStub.byId = function (sID) {
            return oByIdStub(sID);
        };

        this.oAppController.handleSelectionChange();

        assert.strictEqual(oByIdStub.callCount, 6, "by id method was called correct number of times");
        assert.strictEqual(oByIdStub.getCall(1).args[0], "rbWorkforceID", "Work force id radio button id was correclty passed");
        assert.strictEqual(oByIdStub.getCall(2).args[0], "workforceIDInput", "Work force id input id was correclty passed");
        assert.strictEqual(oByIdStub.getCall(3).args[0], "costCenterInput", "Cost center  input id was correclty passed");
        assert.strictEqual(oByIdStub.getCall(4).args[0], "costCenterInput", "Cost center  input id was correclty passed");
        assert.strictEqual(oByIdStub.getCall(5).args[0], "costCenterInput", "Cost center  input id was correclty passed");
        assert.strictEqual(oSetValueStub.setEnabled.callCount, 2, "set editable method was called correct number of times");
        assert.strictEqual(oSetValueStub.setEnabled.getCall(0).args[0], true, "On first call, correct arg was passed to set editable method");
        assert.strictEqual(oSetValueStub.setEnabled.getCall(1).args[0], false, "On second call, correct arg was passed to set editable method");
        assert.strictEqual(oSetValueStub.setValue.callCount, 1, "set value method was called correct number of times");
        assert.strictEqual(oSetValueStub.setValue.firstCall.args[0], "", "On first call, correct arg was passed to set value method");
        assert.strictEqual(oSetValueStub.setValueState.firstCall.args[0], sap.ui.core.ValueState.None, "Correct value was passed to setValueState method");
    });

    QUnit.test("Should handle date change correctly (change is valid)", function (assert) {
        var oEventSourceStub = { setValueState: sinon.stub() };
        var oEventStub = {
            getSource: function () {
                return oEventSourceStub;
            },
            getParameter: function () {
                return true;
            }
        };

        this.oAppController.handleDateChange(oEventStub);

        assert.ok(oEventSourceStub.setValueState.calledOnce, "setValueState method was called once");
        assert.strictEqual(oEventSourceStub.setValueState.firstCall.args[0], sap.ui.core.ValueState.None, "Correct value was passed to setValueState method");
    });

    QUnit.test("Should handle date change correctly (change is not valid)", function (assert) {
        var oEventSourceStub = { setValueState: sinon.stub() };
        var oEventStub = {
            getSource: function () {
                return oEventSourceStub;
            },
            getParameter: function () {
                return false;
            }
        };

        this.oAppController.handleDateChange(oEventStub);

        assert.ok(oEventSourceStub.setValueState.calledOnce, "setValueState method was called once");
        assert.strictEqual(oEventSourceStub.setValueState.firstCall.args[0], sap.ui.core.ValueState.Error, "Correct arg was passed to setValueState method");
    });

    QUnit.test("Should handle dropdown change correctly (change is valid)", function (assert) {
        var oEventSourceStub = {
            setValueState: sinon.stub(),
            getSelectedKey: sinon.stub().returns('ValidInput'),
            getValue: sinon.stub().returns('ValidInput'),
            getSuggestionItems: sinon.stub().returns([{
                getKey : sinon.stub().returns('ValidInput')
            }

            ])
        };
        var oEventStub = {
            getSource: function () {
                return oEventSourceStub;
            }
        };

        this.oAppController.handleChange(oEventStub);

        assert.ok(oEventSourceStub.setValueState.calledOnce, "setValueState method was called once");
        assert.strictEqual(oEventSourceStub.setValueState.firstCall.args[0], sap.ui.core.ValueState.None, "Correct value was passed to setValueState method");
    });

    QUnit.test("Should handle dropdown change correctly (change is not valid)", function (assert) {
        var oEventSourceStub = {
            setValueState: sinon.stub(),
            getSelectedKey: sinon.stub().returns(''),
            getValue: sinon.stub().returns('Invalid'),
            getSuggestionItems: sinon.stub().returns([{
                getKey: sinon.stub().returns('dummy')
            }
            ])
        };
        var oEventStub = {
            getSource: function () {
                return oEventSourceStub;
            }
        };

        this.oAppController.handleChange(oEventStub);

        assert.ok(oEventSourceStub.setValueState.calledOnce, "setValueState method was called once");
        assert.strictEqual(oEventSourceStub.setValueState.firstCall.args[0], sap.ui.core.ValueState.Error, "Correct arg was passed to setValueState method");
    });

    QUnit.test("Should handle download press correctly (cost center and work force person input fields are empty)", function (assert) {
        var initializeDateControlStub = sinon.stub(this.oAppController, "initializeDateControl");
        var handleSelectionChangeStub = sinon.stub(this.oAppController, "handleSelectionChange");
        var oGetValueStub = sinon.stub();
        this.oViewStub.byId = function (ID) {
            return {
                getValue: function () {
                    return "";
                },
                getText: function () {
                    return oGetValueStub(ID);
                }
            };
        };
        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);
        oGetValueStub.withArgs("downloadMessageStrip").returns(MESSAGE_TEXT);
        this.oAppController.onInit();
        var oAnnounceStub = sinon.stub(this.oAppController.oInvisibleMessage, "announce");
        this.oAppController.handleDownloadPress();

        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "busy property is false");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "message type property was set to 'Error'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "message text property was set to 'MESSAGE_TEXT'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "message visible property was set to true");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/costCenter"), "", "cost center property was set to ''");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/workforceID"), "", "workforce ID property was set to ''");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/startDate"), "", "start date property was set to ''");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/endDate"), "", "end date property was set to ''");
        assert.ok(oTranslateTextStub.calledOnce, "Translate method was called once");
        assert.strictEqual(oTranslateTextStub.firstCall.args[0], "errorNoCostCenterWorkForceID", "Correct arg was passed to translate method");
        assert.ok(oAnnounceStub.calledOnce, "announce method was called once");
        assert.strictEqual(oAnnounceStub.firstCall.args[0], MESSAGE_TEXT, "Correct arg was passed to announce method");
        oTranslateTextStub.restore();
        oAnnounceStub.restore();
        initializeDateControlStub.restore();
        handleSelectionChangeStub.restore();
    });

    QUnit.test("Should handle download press correctly (date picker field is empty) and translate error message correctly", function (assert) {
        var initializeDateControlStub = sinon.stub(this.oAppController, "initializeDateControl");
        var handleSelectionChangeStub = sinon.stub(this.oAppController, "handleSelectionChange");
        this.oAppController.oResourceBundle = null;
        var oResourceBundleStub = { getText: sinon.stub() };
        oResourceBundleStub.getText.withArgs("errorNoTimePeriod").returns(MESSAGE_TEXT);
        var oResStub = { getResourceBundle: function () { return oResourceBundleStub; } };
        var oModelStub = sinon.stub(this.oViewStub, "getModel").withArgs("i18n").returns(oResStub);
        var oGetValueStub = sinon.stub();
        this.oViewStub.byId = function (sID) {
            if (sID === "costCenterInput" || sID === "workforceIDInput") {
                return {
                    getValue: function () {
                        return "InputValue";
                    },
                    getValueState: function () {
                        return sap.ui.core.ValueState.None;
                    }
                };
            } else if (sID === "datePick") {
                return {
                    getValue: function () {
                        return "";
                    }
                };
            } else {
                return {
                    getText: function () {
                        return oGetValueStub(sID);
                    }
                };
            }
        };
        this.oAppController.onInit();
        var oAnnounceStub = sinon.stub(this.oAppController.oInvisibleMessage, "announce");
        this.oAppController.handleDownloadPress();
        oGetValueStub.withArgs("downloadMessageStrip").returns(MESSAGE_TEXT);
        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "busy property is false");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "message type property was set to 'Error'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "message text property was set to 'MESSAGE_TEXT'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "message visible property was set to true");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/costCenter"), "", "cost center property was set to ''");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/workforceID"), "", "workforce ID property was set to ''");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/startDate"), "", "start date property was set to ''");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/endDate"), "", "end date property was set to ''");
        assert.ok(oModelStub.calledOnce, "Model method was called once");
        assert.ok(oResourceBundleStub.getText.calledOnce, "get Text method was called once");
        assert.ok(oModelStub.calledOnce, "get Model method was called once");
        assert.ok(oAnnounceStub.calledOnce, "announce method was called once");
        assert.strictEqual(oModelStub.firstCall.args[0], "i18n", "Model method was called with correct argument");
        oAnnounceStub.restore();
        initializeDateControlStub.restore();
        handleSelectionChangeStub.restore();
    });

    QUnit.test("Should handle download press correctly (costcenter field is invalid) and translate error message correctly", function (assert) {
        var initializeDateControlStub = sinon.stub(this.oAppController, "initializeDateControl");
        var handleSelectionChangeStub = sinon.stub(this.oAppController, "handleSelectionChange");
        this.oAppController.oResourceBundle = null;
        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);
        var oGetValueStub = sinon.stub();
        this.oViewStub.byId = function (sID) {
            if (sID === "costCenterInput") {
                return {
                    getValue: function () {
                        return "InputValue";
                    },
                    getValueState: function () {
                        return sap.ui.core.ValueState.Error;
                    }
                };
            } else if (sID === "datePick") {
                return {
                    getValue: function () {
                        return "Oct 1, 2020 - Oct 31, 2020";
                    },
                    isValidValue: function () {
                        return true;
                    }
                };
            } else {
                return {
                    getText: function () {
                        return oGetValueStub(sID);
                    }
                };
            }
        };

        this.oAppController.onInit();
        var oAnnounceStub = sinon.stub(this.oAppController.oInvisibleMessage, "announce");
        this.oAppController.handleDownloadPress();
        oGetValueStub.withArgs("errorInvalidCostCenter").returns(MESSAGE_TEXT);
        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "busy property is false");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "message type property was set to 'Error'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "message text property was set to 'MESSAGE_TEXT'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "message visible property was set to true");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/costCenter"), "", "cost center property was set to ''");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/workforceID"), "", "workforce ID property was set to ''");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/startDate"), "", "start date property was set to ''");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/endDate"), "", "end date property was set to ''");
        assert.ok(oAnnounceStub.calledOnce, "announce method was called once");
        assert.strictEqual(oTranslateTextStub.firstCall.args[0], "errorInvalidCostCenter", "Correct arg was passed to translate method");
        oAnnounceStub.restore();
        initializeDateControlStub.restore();
        handleSelectionChangeStub.restore();
    });

    QUnit.test("Should handle download press correctly (workforce person field is invalid) and translate error message correctly", function (assert) {
        var initializeDateControlStub = sinon.stub(this.oAppController, "initializeDateControl");
        var handleSelectionChangeStub = sinon.stub(this.oAppController, "handleSelectionChange");
        this.oAppController.oResourceBundle = null;
        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);
        var oGetValueStub = sinon.stub();
        this.oViewStub.byId = function (sID) {
            if (sID === "costCenterInput") {
                return {
                    getValue: function () {
                        return "";
                    },
                    getValueState: function () {
                        return sap.ui.core.ValueState.None;
                    }
                };
            } else if (sID === "workforceIDInput") {
                return {
                    getValue: function () {
                        return "InputValue";
                    },
                    getValueState: function () {
                        return sap.ui.core.ValueState.Error;
                    }
                };
            } else if (sID === "datePick") {
                return {
                    getValue: function () {
                        return "Oct 1, 2020 - Oct 31, 2020";
                    },
                    isValidValue: function () {
                        return true;
                    }
                };
            } else {
                return {
                    getText: function () {
                        return oGetValueStub(sID);
                    }
                };
            }
        };

        this.oAppController.onInit();
        var oAnnounceStub = sinon.stub(this.oAppController.oInvisibleMessage, "announce");
        this.oAppController.handleDownloadPress();
        oGetValueStub.withArgs("errorInvalidWorkforcePerson").returns(MESSAGE_TEXT);
        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "busy property is false");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "message type property was set to 'Error'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "message text property was set to 'MESSAGE_TEXT'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "message visible property was set to true");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/costCenter"), "", "cost center property was set to ''");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/workforceID"), "", "workforce ID property was set to ''");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/startDate"), "", "start date property was set to ''");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/endDate"), "", "end date property was set to ''");
        assert.ok(oAnnounceStub.calledOnce, "announce method was called once");
        assert.strictEqual(oTranslateTextStub.firstCall.args[0], "errorInvalidWorkforcePerson", "Correct arg was passed to translate method");
        oAnnounceStub.restore();
        initializeDateControlStub.restore();
        handleSelectionChangeStub.restore();
    });

    QUnit.test("Should handle download press correctly (date picker field is invalid) and translate error message correctly", function (assert) {
        var initializeDateControlStub = sinon.stub(this.oAppController, "initializeDateControl");
        var handleSelectionChangeStub = sinon.stub(this.oAppController, "handleSelectionChange");
        this.oAppController.oResourceBundle = null;
        var oResourceBundleStub = { getText: sinon.stub() };
        oResourceBundleStub.getText.withArgs("errorInvalidTimePeriod").returns(MESSAGE_TEXT);
        var oResStub = { getResourceBundle: function () { return oResourceBundleStub; } };
        var oModelStub = sinon.stub(this.oViewStub, "getModel").withArgs("i18n").returns(oResStub);
        var oGetValueStub = sinon.stub();
        this.oViewStub.byId = function (sID) {
            if (sID === "costCenterInput" || sID === "workforceIDInput") {
                return {
                    getValue: function () {
                        return "InputValue";
                    },
                    getValueState: function () {
                        return sap.ui.core.ValueState.None;
                    }
                };
            } else if (sID === "datePick") {
                return {
                    getValue: function () {
                        return "Oct 1, 2020 - Oct 31, 2020";
                    },
                    isValidValue: function () {
                        return false;
                    }
                };
            } else {
                return {
                    getText: function () {
                        return oGetValueStub(sID);
                    }
                };
            }
        };

        this.oAppController.onInit();
        var oAnnounceStub = sinon.stub(this.oAppController.oInvisibleMessage, "announce");
        this.oAppController.handleDownloadPress();
        oGetValueStub.withArgs("downloadMessageStrip").returns(MESSAGE_TEXT);
        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "busy property is false");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "message type property was set to 'Error'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "message text property was set to 'MESSAGE_TEXT'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "message visible property was set to true");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/costCenter"), "", "cost center property was set to ''");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/workforceID"), "", "workforce ID property was set to ''");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/startDate"), "", "start date property was set to ''");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/endDate"), "", "end date property was set to ''");
        assert.ok(oModelStub.calledOnce, "Model method was called once");
        assert.ok(oResourceBundleStub.getText.calledOnce, "get Text method was called once");
        assert.ok(oModelStub.calledOnce, "get Model method was called once");
        assert.ok(oAnnounceStub.calledOnce, "announce method was called once");
        assert.strictEqual(oResourceBundleStub.getText.firstCall.args[0], "errorInvalidTimePeriod", "Correct arg was passed to translate method");
        assert.strictEqual(oModelStub.firstCall.args[0], "i18n", "Model method was called with correct argument");
        oAnnounceStub.restore();
        initializeDateControlStub.restore();
        handleSelectionChangeStub.restore();
    });

    QUnit.test("Should handle download press correctly when mandatory fields are not empty (download success)", function (assert) {
        var ajaxStub = sinon.stub(jQuery, "ajax", function (req) {
            var d = new jQuery.Deferred();
            d.resolve({});
            return d.promise();
        });
        var startDate = new Date('2020-10-01T00:00:00');
        var endDate = new Date('2020-10-31T23:59:59');
        var createObjectURLStub = sinon.stub(window.URL, "createObjectURL").returns(FILE_DOWNLOAD_URI);
        var initializeDateControlStub = sinon.stub(this.oAppController, "initializeDateControl");
        var handleSelectionChangeStub = sinon.stub(this.oAppController, "handleSelectionChange");
        this.oViewStub.byId = function (sID) {
            switch (sID) {
            case "costCenterInput":
                return {
                    getValue: function () { return "CostCenterInput"; },
                    getValueState: function () {
                        return sap.ui.core.ValueState.None;
                    }
                };
            case "workforceIDInput":
                return {
                    getValue: function () { return "WorkForceIDInput"; },
                    getValueState: function () {
                        return sap.ui.core.ValueState.None;
                    }
                };
            case "plannedWorkingHoursInput":
                return { getValue: function () { return "PlannedWorkingHoursInput"; } };
            case "plannedNonWorkingHoursInput":
                return { getValue: function () { return "PlannedNonWorkingHoursInput"; } };
            case "datePick":
                return { getValue: function () { return "Oct 1, 2020 - Oct 31, 2020"; }, getDateValue: function () { return startDate; }, getSecondDateValue: function () { return endDate; }, isValidValue: function () { return true; } };
            default:
                return { getValue: function () { return ""; } };
            }
        };
        var oFormatStub = {
            format: function (d) {
                if (d.getTime() === startDate.getTime()) {
                    return '2020-10-01';
                } else if (d.getTime() === endDate.getTime()) {
                    return '2020-10-31';
                }
                return '';
            }
        };
        var oDateFormatStub = sinon.stub(DateFormat, "getDateTimeInstance").returns(oFormatStub);

        this.oAppController.onInit();
        this.oAppController.handleDownloadPress();

        assert.strictEqual(this.oAppController.uiModel.getProperty("/costCenter"), "CC_CostCenterInput", "cost center property was set to 'CC_CostCenterInput'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/workforceID"), "WP_WorkForceIDInput", "workforce id property was set to 'WP_WorkForceIDInput'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/costCenter"), "CC_CostCenterInput", "cost center property was set to 'CC_CostCenterInput'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/startDate"), "2020-10-01", "start date property was set to '2020-10-01'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/endDate"), "2020-10-31", "end date property was set to '2020-10-31'");
        assert.ok(jQuery.ajax.calledWithMatch({
            method: "GET",
            url: FILE_DOWNLOAD_URI
        }));
        assert.ok(createObjectURLStub.calledOnce, "Create object url method was called once");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "busy property was set to false");

        initializeDateControlStub.restore();
        handleSelectionChangeStub.restore();
        oDateFormatStub.restore();
        ajaxStub.restore();
        createObjectURLStub.restore();
    });

    QUnit.test("Should handle down press correctly (download failure and error message is received from server)", function (assert) {
        var jqXHRStub = {
            responseText: MESSAGE_TEXT
        };
        var ajaxStub = sinon.stub(jQuery, "ajax", function (req) {
            var d = new jQuery.Deferred();
            d.reject(jqXHRStub, 'failure', 'error');
            return d.promise();
        });
        var startDate = new Date('2020-10-01T00:00:00');
        var endDate = new Date('2020-10-31T23:59:59');
        var initializeDateControlStub = sinon.stub(this.oAppController, "initializeDateControl");
        var handleSelectionChangeStub = sinon.stub(this.oAppController, "handleSelectionChange");
        var oGetValueStub = sinon.stub();
        this.oViewStub.byId = function (sID) {
            switch (sID) {
            case "costCenterInput":
                return {
                    getValue: function () { return "CostCenterInput"; },
                    getValueState: function () {
                        return sap.ui.core.ValueState.None;
                    }
                };
            case "workforceIDInput":
                return {
                    getValue: function () { return "WorkForceIDInput"; },
                    getValueState: function () {
                        return sap.ui.core.ValueState.None;
                    }
                };
            case "plannedWorkingHoursInput":
                return { getValue: function () { return "PlannedWorkingHoursInput"; } };
            case "plannedNonWorkingHoursInput":
                return { getValue: function () { return "PlannedNonWorkingHoursInput"; } };
            case "datePick":
                return { getValue: function () { return "Oct 1, 2020 - Oct 31, 2020"; }, getDateValue: function () { return startDate; }, getSecondDateValue: function () { return endDate; }, isValidValue: function () { return true; } };
            default:
                return {
                    getValue: function () { return ""; },
                    getText: function () {
                        return oGetValueStub(sID);
                    }
                };
            }
        };
        var oFormatStub = {
            format: function (d) {
                if (d.getTime() === startDate.getTime()) {
                    return '2020-10-01';
                } else if (d.getTime() === endDate.getTime()) {
                    return '2020-10-31';
                }
                return '';
            }
        };
        var oDateFormatStub = sinon.stub(DateFormat, "getDateTimeInstance").returns(oFormatStub);

        this.oAppController.onInit();
        this.oAppController.handleDownloadPress();
        oGetValueStub.withArgs("downloadMessageStrip").returns(MESSAGE_TEXT);
        assert.strictEqual(this.oAppController.uiModel.getProperty("/costCenter"), "CC_CostCenterInput", "cost center property was set to 'CC_CostCenterInput'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/workforceID"), "WP_WorkForceIDInput", "workforce id property was set to 'WP_WorkForceIDInput'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/costCenter"), "CC_CostCenterInput", "cost center property was set to 'CC_CostCenterInput'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/startDate"), "2020-10-01", "start date property was set to '2020-10-01'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/endDate"), "2020-10-31", "end date property was set to '2020-10-31'");
        assert.ok(jQuery.ajax.calledWithMatch({
            method: "GET",
            url: FILE_DOWNLOAD_URI
        }));
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), "\"MESSAGE_TEXT\"", "message text property was set to 'MESSAGE_TEXT'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "message visible property was set to true.");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "message type property was set to Error.");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "busy property was set to false");

        initializeDateControlStub.restore();
        handleSelectionChangeStub.restore();
        oDateFormatStub.restore();
        ajaxStub.restore();
    });

    QUnit.test("Should handle down press correctly (download failure and error message is missing)", function (assert) {
        var jqXHRStub = {
        };
        var ajaxStub = sinon.stub(jQuery, "ajax", function (req) {
            var d = new jQuery.Deferred();
            d.reject(jqXHRStub, 'failure', 'error');
            return d.promise();
        });
        var oTranslateTextStub = sinon.stub(this.oAppController, "_translateText").returns(MESSAGE_TEXT);
        var startDate = new Date('2020-10-01T00:00:00');
        var endDate = new Date('2020-10-31T23:59:59');
        var initializeDateControlStub = sinon.stub(this.oAppController, "initializeDateControl");
        var handleSelectionChangeStub = sinon.stub(this.oAppController, "handleSelectionChange");
        var oGetValueStub = sinon.stub();
        this.oViewStub.byId = function (sID) {
            switch (sID) {
            case "costCenterInput":
                return {
                    getValue: function () { return "CostCenterInput"; },
                    getValueState: function () {
                        return sap.ui.core.ValueState.None;
                    }
                };
            case "workforceIDInput":
                return {
                    getValue: function () { return "WorkForceIDInput"; },
                    getValueState: function () {
                        return sap.ui.core.ValueState.None;
                    }
                };
            case "plannedWorkingHoursInput":
                return { getValue: function () { return "PlannedWorkingHoursInput"; } };
            case "plannedNonWorkingHoursInput":
                return { getValue: function () { return "PlannedNonWorkingHoursInput"; } };
            case "datePick":
                return { getValue: function () { return "Oct 1, 2020 - Oct 31, 2020"; }, getDateValue: function () { return startDate; }, getSecondDateValue: function () { return endDate; }, isValidValue: function () { return true; } };
            default:
                return {
                    getValue: function () { return ""; },
                    getText: function () {
                        return oGetValueStub(sID);
                    }
                };
            }
        };
        var oFormatStub = {
            format: function (d) {
                if (d.getTime() === startDate.getTime()) {
                    return '2020-10-01';
                } else if (d.getTime() === endDate.getTime()) {
                    return '2020-10-31';
                }
                return '';
            }
        };
        var oDateFormatStub = sinon.stub(DateFormat, "getDateTimeInstance").returns(oFormatStub);

        this.oAppController.onInit();
        var oAnnounceStub = sinon.stub(this.oAppController.oInvisibleMessage, "announce");
        this.oAppController.handleDownloadPress();
        oGetValueStub.withArgs("downloadMessageStrip").returns(MESSAGE_TEXT);
        assert.strictEqual(this.oAppController.uiModel.getProperty("/costCenter"), "CC_CostCenterInput", "cost center property was set to 'CC_CostCenterInput'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/workforceID"), "WP_WorkForceIDInput", "workforce id property was set to 'WP_WorkForceIDInput'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/costCenter"), "CC_CostCenterInput", "cost center property was set to 'CC_CostCenterInput'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/startDate"), "2020-10-01", "start date property was set to '2020-10-01'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/endDate"), "2020-10-31", "end date property was set to '2020-10-31'");
        assert.ok(jQuery.ajax.calledWithMatch({
            method: "GET",
            url: FILE_DOWNLOAD_URI
        }));
        assert.ok(oTranslateTextStub.calledOnce, "Translated method was called once");
        assert.strictEqual(oTranslateTextStub.firstCall.args[0], "errorDownloadUnknown", "Correct argument was passed to translate method");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageText"), MESSAGE_TEXT, "message text property was set to 'MESSAGE_TEXT'");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageVisible"), true, "message visible property was set to true.");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/messageType"), "Error", "message type property was set to Error.");
        assert.strictEqual(this.oAppController.uiModel.getProperty("/busy"), false, "busy property was set to false");
        assert.ok(oAnnounceStub.calledOnce, "announce method was called once");
        initializeDateControlStub.restore();
        handleSelectionChangeStub.restore();
        oTranslateTextStub.restore();
        oDateFormatStub.restore();
        ajaxStub.restore();
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

    QUnit.test("Should open workforce value help",async function (assert) {
        const oDialogStub = {
            open : sinon.stub()
        };
        var ajaxCallStub = sinon.stub(Fragment, "load", function(req) {
            return Promise.resolve(oDialogStub);
        });
        this.oAppController.getView.restore();
        var oAddDependent = sinon.stub(this.oAppController,"getView").returns({
            addDependent : sinon.stub()
        });

        var oEventSourceStub = {
            getValue : sinon.stub().returns('ValidInput')
        };
        var oEventStub = {
            getSource: function () {
                return oEventSourceStub;
            }
        };
        await this.oAppController.onWorkForceIdInput(oEventStub);
        assert.ok(true);
        assert.ok(Fragment.load.calledOnce, "Work force fragment is loaded once");
        assert.ok(this.oAppController.getView.calledOnce, "Controller of work force opened ");
        assert.ok(oDialogStub.open.calledOnce, "work force dialog opened");
        ajaxCallStub.restore();
        oAddDependent.restore();
    });

    QUnit.test("Should open workforce value help(negative case scenario)",async function (assert) {
        const oDialogStub = {
            open : sinon.stub()
        };
        var ajaxCallStub = sinon.stub(Fragment, "load", function(req) {
            return Promise.reject(oDialogStub);
        });
        var wFMsgToastStub = sinon.stub(MessageToast, "show").returns(true);

        this.oAppController.getView.restore();
        var oAddDependent = sinon.stub(this.oAppController,"getView").returns({
            addDependent : sinon.stub()
        });

        var oEventSourceStub = {
            getValue : sinon.stub().returns('ValidInput')
        };
        var oEventStub = {
            getSource: function () {
                return oEventSourceStub;
            }
        };
        await this.oAppController.onWorkForceIdInput(oEventStub);
        assert.ok(true);
        assert.ok(Fragment.load.calledOnce, "Work force fragment is not loaded once");
        assert.ok(this.oAppController.getView.calledOnce, "Controller of work force opened ");
        assert.ok(wFMsgToastStub.calledTwice, "Work force dialog failed to open");
        ajaxCallStub.restore();
        oAddDependent.restore();
        wFMsgToastStub.restore();
    });
});
