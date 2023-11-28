sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/ui/test/matchers/Properties',
    'sap/ui/test/actions/Press',
    'sap/ui/test/actions/EnterText'
], function (Opa5, Properties, Press, EnterText) {
    'use strict';

    var PREFIX_ID = "application-availabilityUploadUi-upload-component---app--";

    Opa5.createPageObjects({
        onTheUploadPage: {

            actions: {
                // Look at the screen
                iLookAtTheScreen: function (sId) {
                    return this;
                },

                iTypeTextIntoTheElement: function (sId, sText) {
                    return this.waitFor({
                        viewName: 'App',
                        id: sId,
                        timeout: 70,
                        actions: new EnterText({ text: sText }),
                        error: function () {
                            Opa5.stopQueue();
                        },
                        errorMessage: 'Can\'t see ' + sId
                    });
                },

                // Click on an element with id as sId
                iClickOnTheElementWithId: function (sId) {
                    return this.waitFor({
                        viewName: 'App',
                        id: sId,
                        timeout: 70,
                        actions: new Press(),
                        error: function () {
                            Opa5.stopQueue();
                        },
                        errorMessage: 'Error clicking the given element'
                    });
                },

                // Select a large file
                iSelectALargeFile: function (sId) {
                    return this.waitFor({
                        viewName: 'App',
                        id: sId,
                        actions: function (oFileUploader) {
                            oFileUploader.fireFileSizeExceed({
                                fileName: "tooLarge.csv",
                                fileSize: 10000000000000
                            });
                        },
                        error: function () {
                            Opa5.stopQueue();
                        },
                        errorMessage: 'Can\'t see ' + sId
                    });
                },

                // Select a csv file
                iSelectAFile: function (sId, sFileName) {
                    return this.waitFor({
                        viewName: 'App',
                        id: sId,
                        actions: function (oFileUploader) {
                            var mParameters = {
                                files: {
                                    "0": {
                                        "name": sFileName,
                                        "type": "application/vnd.ms-excel",
                                        "size": 4000,
                                        "lastModifiedDate": "2019-08-14T09:42:09.000Z",
                                        "webkitRelativePath": ""
                                    },
                                    "length": 1
                                },
                                newValue: sFileName
                            };
                            oFileUploader.setValue(sFileName);
                            oFileUploader.fireChange(mParameters);
                        },
                        error: function () {
                            Opa5.stopQueue();
                        },
                        errorMessage: 'Can\'t see ' + PREFIX_ID + sId
                    });
                },

                // Upload a file
                iUploadAFile: function (sId, sStatus) {
                    return this.waitFor({
                        viewName: 'App',
                        id: sId,
                        actions: function (oFileUploader) {
                            var responseRaw = {
                                createdItems: 0,
                                errors: 0
                            };
                            JSON.stringify(responseRaw);
                            var mParameters = {
                                fileName: 'AvailabilityFile',
                                responseRaw: JSON.stringify(responseRaw),
                                status: sStatus
                            };
                            oFileUploader.fireUploadComplete(mParameters);
                        },
                        error: function () {
                            Opa5.stopQueue();
                        },
                        errorMessage: 'Can\'t see ' + sId
                    });
                },

                // Upload a file with missing mandatory fields
                iUploadAFileWithMissingMandatoryFields: function (sId, sMessage) {
                    return this.waitFor({
                        viewName: 'App',
                        id: sId,
                        actions: function (oFileUploader) {
                            var responseRaw = { "createdItems": 17, "errors": 1 };
                            var mParameters = {
                                fileName: 'AvailabilityFile',
                                responseRaw: JSON.stringify(responseRaw),
                                status: 200
                            };
                            oFileUploader.fireUploadComplete(mParameters);
                        },
                        error: function () {
                            Opa5.stopQueue();
                        },
                        errorMessage: 'Can\'t see ' + sId
                    });
                },

                // Upload a file with missing columns
                iUploadAFileWithMissingColumns: function (sId) {
                    return this.waitFor({
                        viewName: 'App',
                        id: sId,
                        actions: function (oFileUploader) {
                            var responseRaw = "The CSV file is missing the following columns: resourceId.";
                            var mParameters = {
                                fileName: 'AvailabilityFile',
                                responseRaw: JSON.stringify(responseRaw),
                                status: 400
                            };
                            oFileUploader.fireUploadComplete(mParameters);
                        },
                        error: function () {
                            Opa5.stopQueue();
                        },
                        errorMessage: 'Can\'t see ' + sId
                    });
                }

            },
            assertions: {
                // See an element of type sControlType which has certain properties mProperties
                iShouldSeeTheElementTypeWithProperty: function (sControlType, mProperties) {
                    return this.waitFor({
                        controlType: sControlType,
                        timeout: 70,
                        matchers: new Properties(mProperties),
                        success: function () {
                            Opa5.assert.ok(true, 'Seen');
                        },
                        errorMessage: 'Can\'t see properties ' + JSON.stringify(mProperties)
                    });
                },

                // See an element with id sID
                iShouldSeeTheElementWithId: function (sId) {
                    return this.waitFor({
                        viewName: 'App',
                        id: sId,
                        success: function () {
                            Opa5.assert.ok(true, 'Seen');
                        },
                        errorMessage: 'Can\'t see ' + sId
                    });
                },

                // See an upload success/warning/error message with text sText
                iShouldSeeFileUploadStatusMessage: function (status, sId, sText) {
                    return this.waitFor({
                        viewName: 'App',
                        id: sId,
                        success: function (oMessageStrip) {
                            Opa5.assert.ok(oMessageStrip.getType() === status && oMessageStrip.getText() === sText, 'Seen');
                        },
                        errorMessage: 'Can\'t see ' + sId
                    });
                }
            }
        }
    });

});
