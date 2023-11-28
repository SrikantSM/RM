sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/ui/test/actions/Press',
    'sap/ui/test/matchers/Properties',
    'sap/ui/test/matchers/Ancestor',
    'sap/ui/test/matchers/Descendant',
    'sap/fe/test/ObjectPage'
], function (Opa5, Press, Properties, Ancestor, Descendant, ObjectPage) {


    const PREFIX_ID = 'staffResourceRequest::ResourceRequestObjectPage--';
    var AdditionalCustomObjectPageDefinition = {
        actions: {

            iClickOnTheElement: function (sId) {
                return this.waitFor({
                    id: PREFIX_ID + sId,
                    actions: new Press(),
                    errorMessage: 'Cannot see ' + PREFIX_ID + sId
                });
            },
            iClickOnTheElementTypeWithProperty: function (sControlType, mProperties) {
                return this.waitFor({
                    controlType: sControlType,
                    matchers: new Properties(mProperties),
                    actions: new Press(),
                    success: function () {
                        Opa5.assert.ok(true, "clicked on the element:" + sControlType + "with properties:" + JSON.stringify(mProperties));
                    },
                    errorMessage: 'Can\'t see properties ' + JSON.stringify(mProperties)
                });
            },
            iClickOnTheElementTypeWithBindingPathAndProperty: function (sControlType, mBindingPath, mProperties) {
                return this.waitFor({
                    controlType: sControlType,
                    bindingPath: mBindingPath,
                    matchers: new Properties(mProperties),
                    actions: new Press(),
                    success: function () {
                        Opa5.assert.ok(
                            true,
                            "Clicked on the element: " +
                sControlType +
                " with properties: " +
                JSON.stringify(mProperties)
                        );
                    },
                    errorMessage: "Can't see properties " + JSON.stringify(mProperties)
                });
            },
            iClickOnTheElementWithoutPrefix: function (sId) {
                return this.waitFor({
                    id: sId,
                    actions: new Press(),
                    errorMessage: 'Cannot see ' +  sId
                });
            },
            iClickOnTheIconWithFormElementLabelText: function (sText) {
                return this.waitFor({
                    controlType: "sap.m.Label",
                    matchers: new Properties({
                        text: sText
                    }),
                    success: function (aText) {
                        return this.waitFor({
                            controlType: "sap.ui.layout.form.FormElement",
                            matchers: new Descendant(aText[0]),
                            success: function (aFormElement) {
                                Opa5.assert.strictEqual(aFormElement.length, 1, "Found FormElement with text" + sText);
                                return this.waitFor({
                                    controlType: "sap.ui.core.Icon",
                                    matchers: new Ancestor(aFormElement[0]),
                                    actions: new Press(),
                                    success: function () {
                                        Opa5.assert.ok(true, "Icon clicked for label:" + sText);
                                    },
                                    errorMessage: "Did not find row inside dialog"
                                });
                            },
                            errorMessage: "Did not find row inside dialog"
                        });
                    },
                    errorMessage: "Did not find" + sText
                });
            },
            iClickOnTheIconWithDialogElementLabelText: function (sText) {
                return this.waitFor({
                    searchOpenDialogs: true,
                    controlType: "sap.m.Label",
                    matchers: new Properties({
                        text: sText
                    }),
                    success: function (aText) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.ui.layout.form.SimpleForm",
                            matchers: new Descendant(aText[0]),
                            success: function (aFormElement) {
                                Opa5.assert.strictEqual(aFormElement.length, 1, "Found FormElement with text" + sText);
                                return this.waitFor({
                                    controlType: "sap.ui.core.Icon",
                                    matchers: new Ancestor(aFormElement[0]),
                                    actions: new Press(),
                                    success: function () {
                                        Opa5.assert.ok(true, "Icon clicked for label:" + sText);
                                    },
                                    errorMessage: "Did not find Icon inside dialog"
                                });
                            },
                            errorMessage: "Did not find form inside dialog"
                        });
                    },
                    errorMessage: "Did not find label" + sText
                });
            },

            iClickOnDiscardInsidePopover: function () {
                return this.waitFor({
                    controlType: "sap.m.Popover",
                    success: function (aPopovers) {
                        return this.waitFor({
                            check: function () {
                                return aPopovers.length > 0;
                            },
                            success: function () {
                                Opa5.assert.ok(true, "popover visible");
                                return this.waitFor({
                                    controlType: 'sap.m.Button',
                                    matchers: new Properties({
                                        text: "Discard"
                                    }),
                                    actions: new Press(),
                                    success: function () {
                                        Opa5.assert.ok(true, "Discard button within Popover clicked");
                                    },
                                    errorMessage: 'Can\'t see discard button'
                                });
                            },
                            errorMessage: "The popover is not present"
                        });
                    }
                });
            },
            iClickOnTheElementWithAncestorBindingPath: function (sControlType, mProperties, sAncestorControlType, mAncestorVindingPath) {
                return this.waitFor({
                    controlType: sControlType,
                    viewId: "manageResourceRequest::ResourceRequestObjectPage",
                    properties: mProperties,
                    searchOpenDialogs: true,
                    ancestor: {
                        controlType: sAncestorControlType,
                        viewId: "manageResourceRequest::ResourceRequestObjectPage",
                        bindingPath: mAncestorVindingPath,
                        searchOpenDialogs: true
                    },
                    actions: new Press()
                });
            }
        },

        assertions: {
            iCheckTheComboBoxForFilter: function () {
                return this.waitFor({
                    controlType: "sap.m.ComboBox",
                    viewId: "staffResourceRequest::ResourceRequestObjectPage",
                    properties: {
                        valueState: "None"
                    },
                    searchOpenDialogs: true
                });
            },
            iPressButton : function (sText) {
                return this.waitFor({
                    controlType: "sap.m.Button",
                    viewName: "sap.fe.templates.ObjectPage.ObjectPage",
                    viewId: "staffResourceRequest::ResourceRequestObjectPage",
                    properties: {
                        text: sText
                    },
                    searchOpenDialogs: true,
                    actions: new Press({
                        idSuffix: "BDI-content"
                    })
                });
            },
            iPressTheDropDown: function () {
                return this.waitFor({
                    controlType: "sap.ui.core.Icon",
                    viewName: "sap.fe.templates.ObjectPage.ObjectPage",
                    viewId: "staffResourceRequest::ResourceRequestObjectPage",
                    properties: {
                        alt: "Select Options"
                    },
                    searchOpenDialogs: true,
                    actions: new Press()
                });
            },
            iSelectTheFieldFromDropDown: function (sText) {
                return this.waitFor({
                    controlType: "sap.m.StandardListItem",
                    viewName: "sap.fe.templates.ObjectPage.ObjectPage",
                    viewId: "staffResourceRequest::ResourceRequestObjectPage",
                    properties: {
                        title: sText
                    },
                    searchOpenDialogs: true,
                    actions: new Press()
                });
            },
            iShouldSeeTheElementWithId: function (sId) {
                return this.waitFor({
                    id: sId,
                    success: function () {
                        Opa5.assert.ok(true, "Saw element with ID: " + sId);
                    },
                    errorMessage: 'Cannot see ' + sId
                });
            },

            iShouldSeeTheElementWithProperties: function (sId, mProperties) {
                return this.waitFor({
                    id: PREFIX_ID + sId,
                    matchers: new Properties(mProperties),
                    success: function () {
                        Opa5.assert.ok(true, 'Element Seen:' + PREFIX_ID + sId);
                    },
                    errorMessage: 'Can\'t see ' + PREFIX_ID + sId
                });
            },

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

            iShouldSeeLabel: function (mText) {
                return this.waitFor({
                    searchOpenDialogs: true,
                    controlType: "sap.m.Label",
                    viewName: "sap.fe.templates.ObjectPage.ObjectPage",
                    properties: {
                        text: mText
                    },
                    success: function () {
                        Opa5.assert.ok(true, mText + ' label seen');
                    },
                    errorMessage: 'Can\'t see label ' + mText
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
            // This assertion looks for hidden buttons
            // Unassign button hidden for "Closed" Requests
            iShouldNotSeeTheElementTypeWithProperty: function (sControlType, mProperties) {
                return this.waitFor({
                    controlType: sControlType,
                    matchers: function (oControl) {
                        // Here the conrol reaches success only if it encounters atleast one expected button
                        // So additionally we look for a button, that's always available
                        // Here, Assignments is an Anchor button on Object Page.
                        if (oControl.getProperty(Object.keys(mProperties)[0]) ===
                    mProperties[Object.keys(mProperties)[0]] || oControl.getProperty(Object.keys(mProperties)[0]) === "Assignments") {return true;} // get a list of Buttons with the required property
                        return false;
                    },
                    success: function (aControl) {
                        if (aControl && aControl.length > 1) {
                            Opa5.assert.notOk('Button supposed to be hidden is visible. ' + sControlType + ' ' + JSON.stringify(mProperties));
                        } else {
                            Opa5.assert.ok(true, 'Button is hidden:' + sControlType + ' ' + JSON.stringify(mProperties));
                        }
                    },

                    errorMessage: 'Can\'t see ' + sControlType + JSON.stringify(mProperties)
                });
            },

            iShouldSeeTheFormElementWithLabelAndValue(
                sControlTypeField1, mPropertiesField1,
                sControlTypeField2, mPropertiesField2
            ) {
                return this.waitFor({
                    controlType: sControlTypeField1,
                    matchers: [ new Properties(mPropertiesField1) , new Ancestor(sap.ui.test.Opa.getContext().root) ],
                    success: function (aField1) {
                        Opa5.assert.strictEqual(aField1.length, 1, 'Element Seen:' + sControlTypeField1 + JSON.stringify(mPropertiesField1));
                        return this.waitFor({
                            controlType: sControlTypeField2,
                            matchers: [new Properties(mPropertiesField2)],
                            success: function (aField2) {
                                Opa5.assert.strictEqual(aField2.length, 1, 'Element Seen:' + sControlTypeField2 + JSON.stringify(mPropertiesField2));
                                return this.waitFor({
                                    controlType: "sap.ui.layout.form.FormElement",
                                    matchers: [new Descendant(aField1[0]), new Descendant(aField2[0]) ],
                                    success: function (aFormElement) {
                                        Opa5.assert.strictEqual(aFormElement.length, 1,
                                            "Found FormElement with field1:" +
                              JSON.stringify(mPropertiesField1) +
                              " and field2:" +
                              JSON.stringify(mPropertiesField2));
                                    },
                                    errorMessage: "Did not find FormElement with field1:" +
                            JSON.stringify(mPropertiesField1) +
                            " and field2:" +
                            JSON.stringify(mPropertiesField2)
                                });
                            },
                            errorMessage: "Did not find:" + JSON.stringify(mPropertiesField2)
                        });
                    },
                    errorMessage: "Did not find:" + JSON.stringify(mPropertiesField1)
                });
            },
            iShouldSeeTheFormElementWithLabelWithAncestorAndValue(
                sControlTypeField1, mPropertiesField1, mAncestor,
                sControlTypeField2, mPropertiesField2
            ) {
                return this.waitFor({
                    controlType: sControlTypeField1,
                    matchers: { properties: mPropertiesField1 , ancestor : mAncestor},
                    success: function (aField1) {
                        Opa5.assert.strictEqual(aField1.length, 1, 'Element Seen:' + sControlTypeField1 + JSON.stringify(mPropertiesField1) + JSON.stringify(mAncestor));
                        return this.waitFor({
                            controlType: sControlTypeField2,
                            matchers: { properties: mPropertiesField2},
                            success: function (aField2) {
                                Opa5.assert.strictEqual(aField2.length, 1, 'Element Seen:' + sControlTypeField2 + JSON.stringify(mPropertiesField2));
                                return this.waitFor({
                                    controlType: "sap.ui.layout.form.FormElement",
                                    matchers: [new Descendant(aField1[0]), new Descendant(aField2[0]) ],
                                    success: function (aFormElement) {
                                        Opa5.assert.strictEqual(aFormElement.length, 1,
                                            "Found FormElement with field1:" +
                              JSON.stringify(mPropertiesField1) +
                              " and field2:" +
                              JSON.stringify(mPropertiesField2));
                                    },
                                    errorMessage: "Did not find FormElement with field1:" +
                            JSON.stringify(mPropertiesField1) +
                            " and field2:" +
                            JSON.stringify(mPropertiesField2)
                                });
                            },
                            errorMessage: "Did not find:" + sControlTypeField2 + JSON.stringify(mPropertiesField2)
                        });
                    },
                    errorMessage: "Did not find:" + JSON.stringify(mPropertiesField1) + JSON.stringify(mAncestor)
                });
            },
            iShouldSeeTheFormElementWithLabelAndValueId:function(
                sControlTypeField1, mPropertiesField1,mLabelFor1,
                sControlTypeField2, mPropertiesField2,mIdField2
            ) {
                return this.waitFor({
                    controlType: sControlTypeField1,
                    matchers: [
                        new Properties(mPropertiesField1) ,
                        new Ancestor(sap.ui.test.Opa.getContext().root) ,
                        function(oField1){
                            if (mLabelFor1) {return (oField1.getAssociation("labelFor") === mLabelFor1.labelFor);}
                            return true;
                        }
                    ],
                    success: function (aField1) {
                        Opa5.assert.strictEqual(aField1.length, 1, 'Element Seen:' + sControlTypeField1 + JSON.stringify(mPropertiesField1));
                        return this.waitFor({
                            controlType: sControlTypeField2,
                            id:mIdField2,
                            matchers:function(oField2){
                                return oField2.$()[0].innerText === mPropertiesField2.text;
                            },
                            success: function (oField2) {
                                Opa5.assert.ok(true, 'Element Seen:' + sControlTypeField2 + JSON.stringify(mPropertiesField2));
                                return this.waitFor({
                                    controlType: "sap.ui.layout.form.FormElement",
                                    matchers: [new Descendant(aField1[0]),new Descendant(oField2)],
                                    success: function (aFormElement) {
                                        Opa5.assert.strictEqual(aFormElement.length, 1,
                                            "Found FormElement with field1:" +
                                    JSON.stringify(mPropertiesField1) +
                                    " and field2:" +
                                    JSON.stringify(mPropertiesField2));
                                    },
                                    errorMessage: "Did not find FormElement with field1:" +
                            JSON.stringify(mPropertiesField1)
                                });
                            },
                            errorMessage: "Did not find:" + JSON.stringify(mPropertiesField2)
                        });
                    },
                    errorMessage: "Did not find:" + JSON.stringify(mPropertiesField1)
                });
            },
            iShouldSeeTheFormElementWithLabelAndValueIdAndBindingPath:function(
                sControlTypeField1, mPropertiesField1,mLabelFor1,
                sControlTypeField2, mPropertiesField2,mBindingPathField2
            ) {
                return this.waitFor({
                    controlType: sControlTypeField1,
                    matchers: [
                        new Properties(mPropertiesField1) ,
                        new Ancestor(sap.ui.test.Opa.getContext().root) ,
                        function(oField1){
                            if (mLabelFor1) {return (oField1.getAssociation("labelFor") === mLabelFor1.labelFor);}
                            return true;
                        }
                    ],
                    success: function (aField1) {
                        Opa5.assert.strictEqual(aField1.length, 1, 'Element Seen:' + sControlTypeField1 + JSON.stringify(mPropertiesField1));
                        return this.waitFor({
                            controlType: sControlTypeField2,
                            bindingPath:mBindingPathField2,
                            matchers:function(oField2){
                                return oField2.$()[0].innerText === mPropertiesField2.text;
                            },
                            success: function (oField2) {
                                Opa5.assert.ok(true, 'Element Seen:' + sControlTypeField2 + JSON.stringify(mPropertiesField2));
                                return this.waitFor({
                                    controlType: "sap.ui.layout.form.FormElement",
                                    matchers: [new Descendant(aField1[0]),new Descendant(oField2[0])],
                                    success: function (aFormElement) {
                                        Opa5.assert.strictEqual(aFormElement.length, 1,
                                            "Found FormElement with field1:" +
                                    JSON.stringify(mPropertiesField1) +
                                    " and field2:" +
                                    JSON.stringify(mPropertiesField2));
                                    },
                                    errorMessage: "Did not find FormElement with field1:" +
                            JSON.stringify(mPropertiesField1)
                                });
                            },
                            errorMessage: "Did not find:" + JSON.stringify(mPropertiesField2)
                        });
                    },
                    errorMessage: "Did not find:" + JSON.stringify(mPropertiesField1)
                });
            },
            iShouldSeeTheDataPointWithLabelAndValue(
                sControlTypeField1, mPropertiesField1,
                sControlTypeField2, mPropertiesField2
            ) {
                return this.waitFor({
                    controlType: sControlTypeField1,
                    properties: mPropertiesField1,
                    matchers: {
                        ancestor: {
                            controlType: "sap.m.VBox",
                            matchers: {
                                descendant: {
                                    controlType: sControlTypeField2,
                                    properties: mPropertiesField2
                                }
                            }
                        }
                    },
                    success: function (aFormElement) {
                        Opa5.assert.strictEqual(aFormElement.length, 1,
                            "Found FormElement with field1:" +
                            JSON.stringify(mPropertiesField1) +
                            " and field2:" +
                            JSON.stringify(mPropertiesField2));
                    },
                    errorMessage: "Did not find FormElement with field1:" +
                        JSON.stringify(mPropertiesField1) +
                        " and field2:" +
                        JSON.stringify(mPropertiesField2)
                });
            },

            iShouldSeeAllTheseElementsInFormFacet: function (uxConsistencyJsonFormFacetObject) {
                if (!uxConsistencyJsonFormFacetObject || !uxConsistencyJsonFormFacetObject.type) {return;} else if (uxConsistencyJsonFormFacetObject.type === "ObjectPageSubSection") {
                    this.iShouldSeeTheElementTypeWithProperty(
                        uxConsistencyJsonFormFacetObject.field.controlType,
                        uxConsistencyJsonFormFacetObject.field.properties);
                    for (var i = 0; i < uxConsistencyJsonFormFacetObject.children.length; i++) {this.iShouldSeeAllTheseElementsInFormFacet(uxConsistencyJsonFormFacetObject.children[i]);}
                } else if (uxConsistencyJsonFormFacetObject.type === "ignore") {
                    for (var j = 0; j < uxConsistencyJsonFormFacetObject.children.length; j++) {this.iShouldSeeAllTheseElementsInFormFacet(uxConsistencyJsonFormFacetObject.children[j]);}
                } else if (uxConsistencyJsonFormFacetObject.type === "FormElement") {
                    this.iShouldSeeTheFormElementWithLabelAndValue(
                        uxConsistencyJsonFormFacetObject.field1.controlType,
                        uxConsistencyJsonFormFacetObject.field1.properties,
                        uxConsistencyJsonFormFacetObject.field2.controlType,
                        uxConsistencyJsonFormFacetObject.field2.properties
                    );
                } else if (uxConsistencyJsonFormFacetObject.type === "FormElementwithTable") {
                    this.iShouldSeeTheElementTypeWithProperty(
                        "sap.ui.mdc.Table",
                        uxConsistencyJsonFormFacetObject.field.properties
                    );
                } else if (uxConsistencyJsonFormFacetObject.type === "FormElementWithId"){
                    this.iShouldSeeTheFormElementWithLabelAndValueId(
                        uxConsistencyJsonFormFacetObject.field1.controlType,
                        uxConsistencyJsonFormFacetObject.field1.properties,
                        uxConsistencyJsonFormFacetObject.field1.labelFor,
                        uxConsistencyJsonFormFacetObject.field2.controlType,
                        uxConsistencyJsonFormFacetObject.field2.jQueryProperties,
                        uxConsistencyJsonFormFacetObject.field2.id
                    );
                } else if (uxConsistencyJsonFormFacetObject.type === "FormElementWithBindingPath"){
                    this.iShouldSeeTheFormElementWithLabelAndValueIdAndBindingPath(
                        uxConsistencyJsonFormFacetObject.field1.controlType,
                        uxConsistencyJsonFormFacetObject.field1.properties,
                        uxConsistencyJsonFormFacetObject.field1.labelFor,
                        uxConsistencyJsonFormFacetObject.field2.controlType,
                        uxConsistencyJsonFormFacetObject.field2.jQueryProperties,
                        uxConsistencyJsonFormFacetObject.field2.bindingPath
                    );
                }
            },
            iShouldSeeTheDatePrefilled: function (
                sControlTypeField1, mPropertiesField1,
                sControlTypeField2, mJQueryPropertiesField2, mIdField2
            ) {
                return this.waitFor({
                    controlType: sControlTypeField1,
                    properties: mPropertiesField1,
                    success: function (aField1) {
                        Opa5.assert.strictEqual(aField1.length, 1, 'Element Seen: ' + sControlTypeField1 + JSON.stringify(mPropertiesField1));
                        return this.waitFor({
                            controlType: sControlTypeField2,
                            id: mIdField2,
                            matchers: function (oField2) {
                                if (sControlTypeField2 == "sap.m.DatePicker") {return oField2.$()[0].firstChild.firstChild.value === mJQueryPropertiesField2.innerText;}
                                return oField2.$()[0].innerText === mJQueryPropertiesField2.innerText;
                            },
                            success: function (oField2) {
                                Opa5.assert.ok(true, 'Element Seen: ' + sControlTypeField2 + JSON.stringify(mJQueryPropertiesField2));
                            },
                            errorMessage: "Did not find: " + JSON.stringify(mJQueryPropertiesField2)
                        });
                    },
                    errorMessage: "Did not find: " + JSON.stringify(mPropertiesField1)
                });
            },

            iShouldSeeTheHoursPrefilled: function (
                sControlTypeField1, mPropertiesField1,
                sControlTypeField2, mJQueryPropertiesField2, mIdField2
            ) {
                return this.waitFor({
                    controlType: sControlTypeField1,
                    properties: mPropertiesField1,
                    success: function (aField1) {
                        Opa5.assert.strictEqual(aField1.length, 1, 'Element Seen: ' + sControlTypeField1 + JSON.stringify(mPropertiesField1));
                        return this.waitFor({
                            controlType: sControlTypeField2,
                            id: mIdField2,
                            matchers: function (oField2) {
                                if (sControlTypeField2 == "sap.m.Input") {return oField2.$()[0].firstChild.firstChild.value === mJQueryPropertiesField2.innerText;}
                                return oField2.$()[0].innerText === mJQueryPropertiesField2.innerText;
                            },
                            success: function (oField2) {
                                Opa5.assert.ok(true, 'Element Seen: ' + sControlTypeField2 + JSON.stringify(mJQueryPropertiesField2));
                            },
                            errorMessage: "Did not find: " + JSON.stringify(mJQueryPropertiesField2)
                        });
                    },
                    errorMessage: "Did not find: " + JSON.stringify(mPropertiesField1)
                });
            },
            iShouldSeeTheVBoxWithLabelAndBindingPathAndValue(
                sControlTypeField1, mPropertiesField1,
                sControlTypeField2, mPropertiesField2, mBindingPath
            ) {
                return this.waitFor({
                    controlType: sControlTypeField1,
                    matchers: [new Properties(mPropertiesField1), new Ancestor(sap.ui.test.Opa.getContext().root)],
                    success: function (aField1) {
                        Opa5.assert.ok(true, 'Element Seen: ' + sControlTypeField1 + JSON.stringify(mPropertiesField1));
                        return this.waitFor({
                            controlType: sControlTypeField2,
                            matchers: [new Properties(mPropertiesField2)],
                            bindingPath: mBindingPath,
                            success: function (aField2) {
                                Opa5.assert.ok(true, 'Element Seen: ' + sControlTypeField2 + JSON.stringify(mPropertiesField2));
                                return this.waitFor({
                                    controlType: "sap.m.VBox",
                                    matchers: [new Descendant(aField1[0]), new Descendant(aField2[0])],
                                    success: function (aVBox) {
                                        Opa5.assert.ok(true ,
                                            "Found VBox with field1:" +
                    JSON.stringify(mPropertiesField1) +
                    " and field2:" +
                    JSON.stringify(mPropertiesField2));
                                    },
                                    errorMessage: "Did not find VBox with field1: " +
                  JSON.stringify(mPropertiesField1) +
                  " and field2:" +
                  JSON.stringify(mPropertiesField2)
                                });
                            },
                            errorMessage: "Did not find: " + JSON.stringify(mPropertiesField2)
                        });
                    },
                    errorMessage: "Did not find: " + JSON.stringify(mPropertiesField1)
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
            iShouldSeeTheTableWithHeader: function (header) {
                return this.waitFor({
                    controlType: "sap.ui.mdc.Table",
                    matchers: function (oTable) {
                        if (oTable.getProperty("header") === header) {return true;} else {return false;}
                    },
                    success: function () {
                        Opa5.assert.ok(true, 'Table Seen with header :' + header);
                    },
                    errorMessage: 'Cannot see table with header' + header
                });
            },
            iShouldSeeTheElementWithKey: function (i18NKey) {
                this.waitFor({
                    controlType: "sap.m.Button",
                    viewId: "staffResourceRequest::ResourceRequestObjectPage",
                    i18NText: {
                        propertyName: "text",
                        key: i18NKey
                    },
                    ancestor: {
                        controlType: "sap.m.ColumnListItem",
                        viewId: "staffResourceRequest::ResourceRequestObjectPage",
                        ancestor: {
                            id: "staffResourceRequest::ResourceRequestObjectPage--fe::table::matchingCandidates::LineItem-innerTable"
                        }
                    }
                });
            }
        }
    };

    return new ObjectPage(
        {
            appId: "staffResourceRequest", // MANDATORY: Compare sap.app.id in manifest.json
            componentId: "ResourceRequestObjectPage", // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
            entitySet: "ResourceRequests" // MANDATORY: Compare entityset in manifest.json
        },
        AdditionalCustomObjectPageDefinition
    );
});
