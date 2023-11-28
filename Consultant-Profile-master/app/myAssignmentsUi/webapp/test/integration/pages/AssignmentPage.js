sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/ui/test/matchers/Properties',
    'sap/ui/test/OpaBuilder',
    'sap/ui/test/actions/Press'
], function (Opa5, Properties, OpaBuilder, Press) {
    'use strict';

    Opa5.createPageObjects({
        onTheAssignmentPage: {

            actions: {
                // Look at the screen
                iLookAtTheScreen: function (sId) {
                    return this;
                },

                iClickOnTheElementTypeWithProperty: function (sControlType, mProperties){
                    return OpaBuilder.create(this)
                        .hasType(sControlType)
                        .hasProperties(mProperties)
                        .doPress()
                        .success("Pressed" + sControlType + "with" + mProperties)
                        .execute();
                },

                iClickOnTheElementTypeWithId: function (sControlType, sId){
                    return OpaBuilder.create(this)
                        .hasType(sControlType)
                        .hasId(sId)
                        .doPress()
                        .success("Pressed" + sControlType + "with" + 'Picker button')
                        .execute();
                }
            },

            assertions: {

                // See an element of type sControlType which has certain properties mProperties
                iShouldSeeTheElementTypeWithProperty: function (sControlType, mProperties) {
                    return this.waitFor({
                        controlType: sControlType,
                        timeout: 200,
                        matchers: new Properties(mProperties),
                        success: function () {
                            Opa5.assert.ok(true, 'Seen');
                        },
                        errorMessage: 'Can\'t see properties ' + JSON.stringify(mProperties)
                    });
                },

                // See disabled button of type sControlType which has certain properties mProperties
                iShouldSeeTheDisableButton: function (sControlType, mProperties) {
                    return this.waitFor({
                        controlType: sControlType,
                        timeout: 70,
                        enabled: false,
                        matchers: new Properties(mProperties),
                        success: function () {
                            Opa5.assert.ok(true, 'Found the disabled button');
                        },
                        errorMessage: 'Did not find the disabled button ' + JSON.stringify(mProperties)
                    });
                },

                // See button by Id
                iShouldSeeTheButtonWithId: function (sControlType, sId) {
                    return this.waitFor({
                        controlType: sControlType,
                        id : sId,
                        success: function () {
                            Opa5.assert.ok(true, 'Found the button');
                        },
                        //actions : new Press(),
                        errorMessage : "Did not find the date Picker-button"
                    });
                }

            }
        }
    });

});
