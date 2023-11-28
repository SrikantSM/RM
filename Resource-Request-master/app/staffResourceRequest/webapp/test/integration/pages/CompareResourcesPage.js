sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/ui/test/actions/Press',
    'sap/ui/test/matchers/Properties'
], function (Opa5, Press, Properties) {


    Opa5.createPageObjects({
        onTheCompareResourcesPage: {
            actions: {
                iClickOnTheElementWithProperties: function (controlType, mProperties) {
                    return this.waitFor({
                        controlType: controlType,
                        viewId: "application-ResourceRequest-Display-component---CompareResources",
                        matchers: new Properties(mProperties),
                        actions: new Press()
                    });

                },
                iClickOnTheElementWithoutPrefix: function (sId) {
                    return this.waitFor({
                        id: sId,
                        actions: new Press(),
                        errorMessage: 'Cannot see ' +  sId
                    });
                },
                iClickOnNextPageInCarousel: function () {
                    return this.waitFor({
                        id: "application-ResourceRequest-Display-component---CompareResources--carousel-expanded",

                        success: function (oControl) {
                            oControl.next();

                        },
                        errorMessage: "Did not find the button control"

                    });
                },
                iClickOnPreviousPageInCarousel: function () {
                    return this.waitFor({
                        id: "application-ResourceRequest-Display-component---CompareResources--carousel-expanded",

                        success: function (oControl) {
                            oControl.previous();

                        },
                        errorMessage: "Did not find the button control"

                    });
                },

                iExpandSkillComparisonPanel: function (bValue) {
                    return this.waitFor({
                        id: "application-ResourceRequest-Display-component---CompareResources--skillComparePanel",

                        success: function (oControl) {
                            oControl.setExpanded(bValue);

                        },
                        errorMessage: "Did not find the button control"

                    });
                },

                iExpandAvailabilityComparisonPanel: function (bValue) {
                    return this.waitFor({
                        id: "application-ResourceRequest-Display-component---CompareResources--availabilityComparePanel",

                        success: function (oControl) {
                            oControl.setExpanded(bValue);

                        },
                        errorMessage: "Did not find the button control"

                    });
                }
            },

            assertions: {
                iShouldSeeTheElementWithoutPrefix: function (sId, mProperties) {
                    return this.waitFor({
                        id: sId,
                        matchers: new Properties(mProperties),
                        success: function () {
                            Opa5.assert.ok(true, 'Element Seen:' + sId);
                        },
                        errorMessage: 'Can\'t see ' + sId
                    });
                },
                iShouldSeeTheElementTypeWithProperty: function (sControlType, mProperties) {
                    return this.waitFor({
                        controlType: sControlType,
                        matchers: new Properties(mProperties),
                        success: function (oControl) {
                            Opa5.assert.ok(true, 'Element Seen:' + sControlType + JSON.stringify(mProperties));
                            if (sControlType === "sap.uxap.ObjectPageSubSection") {sap.ui.test.Opa.getContext().root = oControl;}
                        },
                        errorMessage: 'Can\'t see ' + sControlType + JSON.stringify(mProperties)
                    });
                },
                iShouldSeeTheElementTypeWithPropertyAndBindingPath: function (sControlType, mProperties, mBindingPath) {
                    return this.waitFor({
                        controlType: sControlType,
                        matchers: new Properties(mProperties),
                        bindingPath: mBindingPath,
                        success: function (oControl) {
                            Opa5.assert.ok(true, 'Element Seen: ' + sControlType + JSON.stringify(mProperties));
                            if (sControlType === "sap.uxap.ObjectPageSubSection") {sap.ui.test.Opa.getContext().root = oControl;}
                        },
                        errorMessage: 'Can\'t see ' + sControlType + JSON.stringify(mProperties)
                    });
                },
                iShouldSeeTheElementWithAncestorBindingPath: function (sControlType, mProperties, sAncestorControlType, mAncestorVindingPath) {
                    return this.waitFor({
                        controlType: sControlType,
                        properties: mProperties,
                        ancestor: {
                            controlType: sAncestorControlType,
                            bindingPath: mAncestorVindingPath
                        }
                    });
                },
                iShouldSeeTheElementWithoutPrefixInFlexibleColumnLayout: function (sId, mProperties) {
                    return this.waitFor({
                        id: sId,
                        viewId: "application-ResourceRequest-Display-component---appRootView",
                        matchers: new Properties(mProperties),
                        success: function () {
                            Opa5.assert.ok(true, 'Element Seen:' + sId);
                        },
                        errorMessage: 'Can\'t see ' + sId
                    });
                }
            }
        }
    });
});
