sap.ui.define([
    'sap/ui/test/Opa5',
    'manageResourceRequest/test/integration/pages/Common',
    'sap/ui/test/actions/Press',
    'sap/ui/test/matchers/Properties',
    'sap/ui/test/matchers/Ancestor',
    'sap/ui/test/matchers/Descendant'
], function (Opa5, Common, Press, Properties, Ancestor, Descendant) {


    var PREFIX_ID = 'manageResourceRequest::ResourceRequestObjectPage--';

    Opa5.createPageObjects({

        onTheResourceRequestObjectPage: {
            baseClass: Common,
            actions: {

                iClickOnTheElement: function (sId) {
                    return this.waitFor({
                        id: PREFIX_ID + sId,
                        actions: new Press(),
                        success: function () {
                            Opa5.assert.ok(true, "Element is clicked with Id: " + sId);
                        },
                        errorMessage: 'Cannot see ' + sId
                    });
                },

                iClickOnTheElementWithId: function (sId) {
                    return this.waitFor({
                        id: sId,
                        actions: new Press(),
                        success: function () {
                            Opa5.assert.ok(true, "Element is clicked with Id: " + sId);
                        },
                        errorMessage: 'Cannot see ' + sId
                    });
                },

                iOpenTheValueHelpOnTheTableElement: function (sInnerTableId, iRow, iCol) {
                    return this.waitFor({
                        id: PREFIX_ID + sInnerTableId,
                        actions: function (oTable) {
                            var sTargetId = oTable.getItems()[iRow].getCells()[iCol].getId();
                            return this.waitFor({
                                matchers: {
                                    ancestor: { id: sTargetId }
                                },
                                controlType: 'sap.ui.mdc.field.FieldInput',
                                actions: new Press(),
                                errorMessage: 'Can\'t see FieldInput descendant of ' + sTargetId
                            });
                        }.bind(this),
                        errorMessage: 'Can\'t see ' + PREFIX_ID + sInnerTableId
                    });
                },

                iClickOnTheIconWithFormElementLabelProperties: function (mProperties) {
                    return this.waitFor({
                        controlType: "sap.m.Label",
                        matchers: new Properties(mProperties),
                        success: function (aText) {
                            return this.waitFor({
                                controlType: "sap.ui.layout.form.FormElement",
                                matchers: new Descendant(aText[0]),
                                success: function (aFormElement) {
                                    Opa5.assert.strictEqual(aFormElement.length, 1, "Found FormElement with properties: " + JSON.stringify(mProperties));
                                    return this.waitFor({
                                        controlType: "sap.ui.core.Icon",
                                        matchers: new Ancestor(aFormElement[0]),
                                        actions: new Press(),
                                        success: function () {
                                            Opa5.assert.ok(true, "Icon clicked for label: " + JSON.stringify(mProperties));
                                        },
                                        errorMessage: "Did not find row inside dialog"
                                    });
                                },
                                errorMessage: "Did not find row inside dialog"
                            });
                        },
                        errorMessage: "Did not find" + JSON.stringify(mProperties)
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
                iClickOnTheElementTypeWithAncestorProperty: function (sParentControl, mParentProperties, sChildControl) {
                    return this.waitFor({
                        controlType: sParentControl,
                        matchers: new Properties(mParentProperties),
                        success: function (aAncestors) {
                            Opa5.assert.strictEqual(aAncestors.length, 1, 'There is exactly one ancestor: ' + sParentControl + ' with properties:' + JSON.stringify(mParentProperties));
                            let oAncestor = aAncestors[0];
                            return this.waitFor({
                                controlType: sChildControl,
                                matchers: new Ancestor(oAncestor),
                                actions: new Press(),
                                errorMessage: 'Can\'t the filter'
                            });
                        }.bind(this)
                    });
                },

                iClickOnTheElementTypeWithProperty: function (sControlType, mProperties, sAncestorControlType) {
                    var locator = {
                        controlType: sControlType,
                        matchers: { properties: mProperties },
                        actions: new Press(),
                        errorMessage: 'Can\'t see properties ' + JSON.stringify(mProperties)
                    };
                    if (sAncestorControlType) {
                        locator.ancestor = {
                            controlType: sAncestorControlType
                        };
                        locator.errorMessage += ' with ancestor control type ' + sAncestorControlType;
                    }
                    return this.waitFor(locator);
                },

                iClickOnTheStandardListItem: function (sControlType, sAncestorControlType, mAncestorBindingPath) {
                    var locator = {
                        controlType: sControlType,
                        actions: new Press(),
                        errorMessage: 'Can\'t see control type ' + sControlType
                    };
                    if (sAncestorControlType && mAncestorBindingPath) {
                        locator.ancestor = {
                            controlType: sAncestorControlType,
                            bindingPath: mAncestorBindingPath
                        };
                        locator.errorMessage += ' with ancestor control type ' + sAncestorControlType;
                    }
                    return this.waitFor(locator);
                },
                iClickOnTheElementWithBindingPath: function (sControlType, mABindingPath) {
                    return this.waitFor({
                        controlType: sControlType,
                        viewId: "manageResourceRequest::ResourceRequestObjectPage",
                        bindingPath: mABindingPath,
                        searchOpenDialogs: true,
                        actions: new Press()
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

            //assertions: MainAssertions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE)

            assertions: {

                iShouldSeeTheElementWithProperties: function (sId, mProperties) {
                    return this.waitFor({
                        id: sId,
                        matchers: new Properties(mProperties),
                        success: function () {
                            Opa5.assert.ok(true, 'Element Seen: ' + sId + ' with Property ' + JSON.stringify(mProperties));
                        },
                        errorMessage: 'Can\'t see ' + sId
                    });
                },

                iShouldSeeTheElementTypeWithProperty: function (sControlType, mProperties) {
                    return this.waitFor({
                        controlType: sControlType,
                        matchers: new Properties(mProperties),
                        success: function (oControl) {
                            Opa5.assert.ok(true, 'Element Seen: ' + sControlType + JSON.stringify(mProperties));
                            if (sControlType === "sap.uxap.ObjectPageSubSection") {sap.ui.test.Opa.getContext().root = oControl;}
                        },
                        errorMessage: 'Can\'t see ' + sControlType + JSON.stringify(mProperties)
                    });
                },

                iShouldSeeTheElementTypeWithPropertyEnabled: function (sControlType, mProperties, bEnabled) {
                    return this.waitFor({
                        controlType: sControlType,
                        enabled: bEnabled,
                        matchers: new Properties(mProperties),
                        success: function (oControl) {
                            Opa5.assert.ok(true, 'Element Seen: ' + sControlType + JSON.stringify(mProperties));
                            if (sControlType === "sap.uxap.ObjectPageSubSection") { sap.ui.test.Opa.getContext().root = oControl; }
                        },
                        errorMessage: 'Can\'t see ' + sControlType + JSON.stringify(mProperties)
                    });
                },

                iShouldSeeTheElementWithIdEnabled: function (sId, bEnabled) {
                    return this.waitFor({
                        id: sId,
                        enabled: bEnabled,
                        success: function () {
                            Opa5.assert.ok(true, 'Element Seen: ' + sId);
                        },
                        errorMessage: 'Can\'t see ' + sId
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

                iShouldSeeTheElementWithAncestorBindingPathEnabled: function (sControlType, mProperties, sAncestorControlType, mAncestorVindingPath, bEnabled) {
                    return this.waitFor({
                        controlType: sControlType,
                        viewId: "manageResourceRequest::ResourceRequestObjectPage",
                        properties: mProperties,
                        searchOpenDialogs: true,
                        enabled: bEnabled,
                        ancestor: {
                            controlType: sAncestorControlType,
                            viewId: "manageResourceRequest::ResourceRequestObjectPage",
                            bindingPath: mAncestorVindingPath,
                            searchOpenDialogs: true
                        },
                        success: function () {
                            Opa5.assert.ok(true, 'Element Seen: ' + sControlType + ' with Property ' + JSON.stringify(mProperties));
                        },
                        errorMessage: 'Can\'t see ' + sControlType + ' with Property ' + JSON.stringify(mProperties)
                    });
                },

                iShouldSeeWorkPackageDetailsinCreate(WORKPACKAGE_SUBSECTION_ID,workPackageName,workPackageStartDate,workPackageEndDate){
                    return this.iShouldSeeTheFormElementWithLabelAndValue(
                        "sap.m.Label",
                        {
                            text: "Work Package"
                        },
                        "sap.m.Text",
                        {
                            text: workPackageName
                        }
                    )

                        .and.iShouldSeeTheFormElementWithLabelAndValue(
                            "sap.m.Label",
                            {
                                text: "Work Package Start Date"
                            },
                            "sap.m.Text",
                            {
                                text: workPackageStartDate
                            }
                        )

                        .and.iShouldSeeTheFormElementWithLabelAndValue(
                            "sap.m.Label",
                            {
                                text: "Work Package End Date"
                            },
                            "sap.m.Text",
                            {
                                text: workPackageEndDate
                            }
                        );
                },

                iShouldSeeWorkPackageDetailsinUpdate(WORKPACKAGE_SUBSECTION_ID,workPackageName,workPackageStartDate,workPackageEndDate){
                    return this.iShouldSeeTheFormElementWithLabelAndValue(
                        "sap.m.Label",
                        {
                            text: "Work Package"
                        },
                        "sap.m.Text",
                        {
                            text: workPackageName
                        }
                    )

                        .and.iShouldSeeTheFormElementWithLabelAndValue(
                            "sap.m.Label",
                            {
                                text: "Work Package Start Date"
                            },
                            "sap.m.Text",
                            {
                                text: workPackageStartDate
                            }
                        )

                        .and.iShouldSeeTheFormElementWithLabelAndValue(
                            "sap.m.Label",
                            {
                                text: "Work Package End Date"
                            },
                            "sap.m.Text",
                            {
                                text: workPackageEndDate
                            }
                        );
                },

                iShouldSeeProjectDetailsinCreate(PROJECT_SUBSECTION_ID,projectName,customerName,projectStartDate,projectEndDate){
                    return this.iShouldSeeTheFormElementWithLabelAndValue(
                        "sap.m.Label",
                        {
                            text: "Project"
                        },
                        "sap.m.Text",
                        {
                            text: projectName
                        }
                    )

                        .and.iShouldSeeTheFormElementWithLabelAndValue(
                            "sap.m.Label",
                            {
                                text: "Customer"
                            },
                            "sap.m.Text",
                            {
                                text: customerName
                            }
                        )

                        .and.iShouldSeeTheFormElementWithLabelAndValue(
                            "sap.m.Label",
                            {
                                text: "Project Start Date"
                            },
                            "sap.m.Text",
                            {
                                text: projectStartDate
                            }
                        )

                        .and.iShouldSeeTheFormElementWithLabelAndValue(
                            "sap.m.Label",
                            {
                                text: "Project End Date"
                            },
                            "sap.m.Text",
                            {
                                text: projectEndDate
                            }
                        );
                },

                iShouldSeeProjectDetailsinUpdate(PROJECT_SUBSECTION_ID,projectName,customerName,projectStartDate,projectEndDate){
                    return this.iShouldSeeTheFormElementWithLabelAndValue(
                        "sap.m.Label",
                        {
                            text: "Project"
                        },
                        "sap.m.Text",
                        {
                            text: projectName
                        }
                    )

                        .and.iShouldSeeTheFormElementWithLabelAndValue(
                            "sap.m.Label",
                            {
                                text: "Customer"
                            },
                            "sap.m.Text",
                            {
                                text: customerName
                            }
                        )

                        .and.iShouldSeeTheFormElementWithLabelAndValue(
                            "sap.m.Label",
                            {
                                text: "Project Start Date"
                            },
                            "sap.m.Text",
                            {
                                text: projectStartDate
                            }
                        )

                        .and.iShouldSeeTheFormElementWithLabelAndValue(
                            "sap.m.Label",
                            {
                                text: "Project End Date"
                            },
                            "sap.m.Text",
                            {
                                text: projectEndDate
                            }
                        );
                },

                iShouldSeeResourceRequestDetailsinEdit(REQUEST_SUBSECTION_ID,requestedResourceOrg){
                    return this.iShouldSeeTheElementWithProperties(
                        REQUEST_SUBSECTION_ID +
                "SubSectionRequest1::FormElement::DataField::requestedResourceOrg_ID::Field-edit-inner",
                        {
                            value: requestedResourceOrg
                        }
                    );
                },

                iShouldSeeTheFormElementWithLabelAndValue(
                    sControlTypeField1, mPropertiesField1,
                    sControlTypeField2, mPropertiesField2
                ) {
                    return this.waitFor({
                        controlType: sControlTypeField1,
                        matchers: [new Properties(mPropertiesField1), new Ancestor(sap.ui.test.Opa.getContext().root)],
                        success: function (aField1) {
                            Opa5.assert.ok(true, 'Element Seen: ' + sControlTypeField1 + JSON.stringify(mPropertiesField1));
                            return this.waitFor({
                                controlType: sControlTypeField2,
                                matchers: [new Properties(mPropertiesField2)],
                                success: function (aField2) {
                                    Opa5.assert.ok(true, 'Element Seen: ' + sControlTypeField2 + JSON.stringify(mPropertiesField2));
                                    return this.waitFor({
                                        controlType: "sap.ui.layout.form.FormElement",
                                        matchers: [new Descendant(aField1[0]), new Descendant(aField2[0])],
                                        success: function (aFormElement) {
                                            Opa5.assert.strictEqual(aFormElement.length, 1,
                                                "Found FormElement with field1:" +
                                                JSON.stringify(mPropertiesField1) +
                                                " and field2:" +
                                                JSON.stringify(mPropertiesField2));
                                        },
                                        errorMessage: "Did not find FormElement with field1: " +
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

                iShouldSeeTheFormElementWithLabelAndBindingPathAndValue(
                    sControlTypeField1, mPropertiesField1,
                    sControlTypeField2, mPropertiesField2, mBindingPath
                ) {
                    return this.waitFor({
                        controlType: sControlTypeField1,
                        matchers: [ new Properties(mPropertiesField1) , new Ancestor(sap.ui.test.Opa.getContext().root) ],
                        success: function (aField1) {
                            Opa5.assert.ok(true, 'Element Seen: ' + sControlTypeField1 + JSON.stringify(mPropertiesField1));
                            return this.waitFor({
                                controlType: sControlTypeField2,
                                matchers: [new Properties(mPropertiesField2) ],
                                bindingPath: mBindingPath,
                                success: function (aField2) {
                                    Opa5.assert.ok(true, 'Element Seen: ' + sControlTypeField2 + JSON.stringify(mPropertiesField2));
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
                                        errorMessage: "Did not find FormElement with field1: " +
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

                iShouldSeeTheFormElementWithLabelForAndValueId:function(
                    sControlTypeField1, mPropertiesField1,mLabelFor1,
                    sControlTypeField2, mJQueryPropertiesField2,mIdField2
                ) {
                    return this.waitFor({
                        controlType: sControlTypeField1,
                        matchers: [
                            new Properties(mPropertiesField1) ,
                            new Ancestor(sap.ui.test.Opa.getContext().root),
                            function(oField1){
                                return (oField1.getAssociation("labelFor") === mLabelFor1.labelFor);
                            }
                        ],
                        success: function (aField1) {
                            Opa5.assert.strictEqual(aField1.length, 1, 'Element Seen: ' + sControlTypeField1 + JSON.stringify(mPropertiesField1));
                            return this.waitFor({
                                controlType: sControlTypeField2,
                                id:mIdField2,
                                matchers:function(oField2){
                                    if (sControlTypeField2 == "sap.m.DatePicker") {return oField2.$()[0].firstChild.firstChild.value === mJQueryPropertiesField2.innerText;}
                                    return oField2.$()[0].innerText === mJQueryPropertiesField2.innerText;
                                },
                                success: function (oField2) {
                                    Opa5.assert.ok(true, 'Element Seen: ' + sControlTypeField2 + JSON.stringify(mJQueryPropertiesField2));
                                    return this.waitFor({
                                        controlType: "sap.ui.layout.form.FormElement",
                                        matchers: [new Descendant(aField1[0]),new Descendant(oField2)],
                                        success: function (aFormElement) {
                                            Opa5.assert.strictEqual(aFormElement.length, 1,
                                                "Found FormElement with field1: " +
                                                JSON.stringify(mPropertiesField1) +
                                                " and field2: " +
                                                JSON.stringify(mJQueryPropertiesField2));
                                        },
                                        errorMessage: "Did not find FormElement with field1: " +
                                            JSON.stringify(mPropertiesField1)
                                    });
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
                                            Opa5.assert.ok(true,
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
                iShouldSeeTheVBoxWithLabelAndBindingPathAndValueEnabled(
                    sControlTypeField1, mPropertiesField1,
                    sControlTypeField2, mPropertiesField2, mBindingPath, bEnabled
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
                                enabled: bEnabled,
                                success: function (aField2) {
                                    Opa5.assert.ok(true, 'Element Seen: ' + sControlTypeField2 + JSON.stringify(mPropertiesField2));
                                    return this.waitFor({
                                        controlType: "sap.m.VBox",
                                        matchers: [new Descendant(aField1[0]), new Descendant(aField2[0])],
                                        success: function (aVBox) {
                                            Opa5.assert.ok(true,
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
                iShouldSeeTheVBoxWithIdAndLabelAndValue(
                    sControlTypeField1, mPropertiesField1,
                    sControlTypeField2, sId, mPropertiesField2
                ) {
                    return this.waitFor({
                        controlType: sControlTypeField1,
                        matchers: [new Properties(mPropertiesField1), new Ancestor(sap.ui.test.Opa.getContext().root)],
                        success: function (aField1) {
                            Opa5.assert.ok(true, 'Element Seen: ' + sControlTypeField1 + JSON.stringify(mPropertiesField1));
                            return this.waitFor({
                                controlType: sControlTypeField2,
                                matchers: [new Properties(mPropertiesField2)],
                                id: sId,
                                success: function (aField2) {
                                    Opa5.assert.ok(true, 'Element Seen: ' + sControlTypeField2 + JSON.stringify(mPropertiesField2));
                                    return this.waitFor({
                                        controlType: "sap.m.VBox",
                                        matchers: [new Descendant(aField1[0]), new Descendant(aField2[0])],
                                        success: function (aVBox) {
                                            Opa5.assert.ok(true,
                                                "Found aVBox with field1:" +
                                                JSON.stringify(mPropertiesField1) +
                                                " and field2:" +
                                                JSON.stringify(mPropertiesField2));
                                        },
                                        errorMessage: "Did not find aVBox with field1: " +
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
                                "Found FormElement with field1: " +
                                JSON.stringify(mPropertiesField1) +
                                " and field2:" +
                                JSON.stringify(mPropertiesField2));
                        },
                        errorMessage: "Did not find FormElement with field1: " +
                            JSON.stringify(mPropertiesField1) +
                            " and field2:" +
                            JSON.stringify(mPropertiesField2)
                    });
                },

                iShouldSeeAllTheseElementsInFormFacet: function (contractJsonFormFacetObject) {
                    if (!contractJsonFormFacetObject || !contractJsonFormFacetObject.type) {return;} else if (contractJsonFormFacetObject.type === "ObjectPageSubSection") {
                        this.iShouldSeeTheElementTypeWithProperty(
                            contractJsonFormFacetObject.field.controlType,
                            contractJsonFormFacetObject.field.properties);
                        for (var i = 0; i < contractJsonFormFacetObject.children.length; i++) {this.iShouldSeeAllTheseElementsInFormFacet(contractJsonFormFacetObject.children[i]);}
                    } else if (contractJsonFormFacetObject.type === "ignore") {
                        for (var j = 0; j < contractJsonFormFacetObject.children.length; j++) {this.iShouldSeeAllTheseElementsInFormFacet(contractJsonFormFacetObject.children[j]);}
                    } else if (contractJsonFormFacetObject.type === "FormElement") {
                        this.iShouldSeeTheFormElementWithLabelAndValue(
                            contractJsonFormFacetObject.field1.controlType,
                            contractJsonFormFacetObject.field1.properties,
                            contractJsonFormFacetObject.field2.controlType,
                            contractJsonFormFacetObject.field2.properties
                        );
                    } else if (contractJsonFormFacetObject.type === "FormElementWithId"){
                        this.iShouldSeeTheFormElementWithLabelForAndValueId(
                            contractJsonFormFacetObject.field1.controlType,
                            contractJsonFormFacetObject.field1.properties,
                            contractJsonFormFacetObject.field1.labelFor,
                            contractJsonFormFacetObject.field2.controlType,
                            contractJsonFormFacetObject.field2.jQueryProperties,
                            contractJsonFormFacetObject.field2.id
                        );
                    } else if (contractJsonFormFacetObject.type === "FormElementwithTable") {
                        this.iShouldSeeTheElementTypeWithProperty(
                            "sap.ui.mdc.Table",
                            contractJsonFormFacetObject.field.properties
                        );
                    }
                },

                iShouldSeeMessageToastAppearance: function () {
                    return this.waitFor({
                        // Turn off autoWait
                        autoWait: false,
                        check: function () {
                            // Locate the message toast using its class name in a jQuery function
                            return Opa5.getJQuery()(".sapMMessageToast").length > 0;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The message toast was shown");
                        },
                        errorMessage: "The message toast did not show up"
                    });
                }
            }
        }
    });
});
