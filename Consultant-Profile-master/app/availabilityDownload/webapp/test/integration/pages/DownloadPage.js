sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/ui/test/matchers/Properties',
    'sap/ui/test/actions/Press',
    'sap/ui/test/actions/EnterText'
], function (Opa5, Properties, Press, EnterText) {
    'use strict';

    Opa5.createPageObjects({
        onTheDownloadPage: {

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

                iSuggestTextIntoTheElement: function (sId, sText) {
                    return this.waitFor({
                        viewName: 'App',
                        id: sId,
                        timeout: 70,
                        actions: new EnterText({
                            text: sText,
                            keepFocus: true
                        }),
                        success: function () {
                            this.waitFor({
                                controlType: "sap.m.StandardListItem",
                                matchers: [
                                    new Properties({
                                        title: sText
                                    })
                                ],
                                actions: new Press()
                            });
                        },
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

                // Should see the default values
                iShouldSeeTheDefaultValues: function (sId, sValue) {
                    return this.waitFor({
                        viewName: 'App',
                        id: sId,
                        success: function (oControl) {
                            Opa5.assert.equal(oControl.getValue(), sValue, "Default values are set correctly");
                        },
                        errorMessage: 'Can\'t see ' + sId
                    });
                }
            }
        }
    });

});
