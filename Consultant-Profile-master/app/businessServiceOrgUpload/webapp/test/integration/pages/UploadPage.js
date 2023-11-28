sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/ui/test/matchers/Properties',
    'sap/ui/test/actions/Press'
], function (Opa5, Properties, Press) {
    'use strict';

    var PREFIX_ID = "application-businessServiceOrgUi-upload-component---app--";

    Opa5.createPageObjects({
        onTheUploadPage: {

            actions: {
                // Look at the screen
                iLookAtTheScreen: function (sId) {
                    return this;
                },

                // Click on an element of type sControlType which has certain properties mProperties
                iClickOnTheElementTypeWithProperty: function (sControlType, mProperties) {
                    return this.waitFor({
                        controlType: sControlType,
                        matchers: new Properties(mProperties),
                        actions: new Press(),
                        error: function(){
                            Opa5.stopQueue();
                        },
                        errorMessage: 'Can\'t see properties ' + JSON.stringify(mProperties)
                    });
                },

                // Click on an element with id as sId
                iClickOnTheElementWithId: function (sId) {
                    return this.waitFor({
                        viewName: 'App',
                        id: sId,
                        timeout: 70,
                        actions: new Press(),
                        error: function(){
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
                        error: function(){
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
                        error: function(){
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
                                timestamp: "2019-12-09T09:56:52.556+0000",
                                status: sStatus,
                                createdItems: 1,
                                createdHeaders: 1,
                                errors: [],
                                path: "/ServiceOrgUploadService"
                            };
                            JSON.stringify(responseRaw);
                            var mParameters = {
                                fileName: 'ServiceOrgFile',
                                responseRaw: JSON.stringify(responseRaw),
                                status: sStatus
                            };
                            oFileUploader.fireUploadComplete(mParameters);
                        },
                        error: function(){
                            Opa5.stopQueue();
                        },
                        errorMessage: 'Can\'t see ' + sId
                    });
                },

                // Upload a file with invalid cost center data
                iUploadAFileWithInvalidCostCenter: function (sId) {
                    return this.waitFor({
                        viewName: 'App',
                        id: sId,
                        actions: function (oFileUploader) {
                            var responseRaw = {
                                timestamp: "2019-12-09T09:56:52.556+0000",
                                status: 200,
                                path: "/ServiceOrgUploadService",
                                createdHeaders: 0,
                                createdItems: 1,
                                errors: [{
                                    message: "Cost center CC is not associated with the company code CC01. Please check the combination and try again."
                                }]
                            };
                            JSON.stringify(responseRaw);
                            var mParameters = {
                                fileName: 'ServiceOrgFile',
                                responseRaw: JSON.stringify(responseRaw),
                                status: 200
                            };
                            oFileUploader.fireUploadComplete(mParameters);
                        },
                        error: function(){
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
                            var responseRaw = {
                                timestamp:"2020-08-06T10:49:52.364+00:00",
                                status: 400,
                                path: "/ServiceOrgUploadService",
                                message:""
                            };
                            JSON.stringify(responseRaw);
                            var mParameters = {
                                fileName: 'ServiceOrgFile',
                                responseRaw: JSON.stringify(responseRaw),
                                status: 400
                            };
                            oFileUploader.fireUploadComplete(mParameters);
                        },
                        error: function(){
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

                // See an upload success message with text sText
                iShouldSeeFileUploadSuccessMessage: function (sId, sText) {
                    return this.waitFor({
                        viewName: 'App',
                        id: sId,
                        success: function (oMessageStrip) {
                            Opa5.assert.ok(oMessageStrip.getType() === 'Success' && oMessageStrip.getText() === sText, 'Seen');
                        },
                        errorMessage: 'Can\'t see ' + sId
                    });
                },

                // See an upload warning message with text sText
                iShouldSeeFileUploadWarningMessage: function (sId, sText) {
                    return this.waitFor({
                        viewName: 'App',
                        id: sId,
                        success: function (oMessageStrip) {
                            Opa5.assert.ok(oMessageStrip.getType() === 'Warning' && oMessageStrip.getText() === sText, 'Seen');
                        },
                        errorMessage: 'Can\'t see ' + sId
                    });
                },

                // See an upload warning message with text sText
                iShouldSeeFileUploadErrorMessage: function (sId, sText) {
                    return this.waitFor({
                        viewName: 'App',
                        id: sId,
                        success: function (oMessageStrip) {
                            Opa5.assert.ok(oMessageStrip.getType() === 'Error' && oMessageStrip.getText() === sText, 'Seen');
                        },
                        errorMessage: 'Can\'t see ' + sId
                    });
                }
            }
        }
    });

});
