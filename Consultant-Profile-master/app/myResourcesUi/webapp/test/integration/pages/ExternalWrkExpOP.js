sap.ui.define(["sap/fe/test/ObjectPage",
    "sap/ui/test/OpaBuilder",
    "sap/ui/test/Opa5",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/actions/Press"],
function (ExternalWrkExpOP, OpaBuilder, Opa5, Properties, Press) {
    "use strict";
    var PREFIX_ID = 'myResourcesUi::ExternalWorkExperienceObjectPage--';
    var sInnerTableId = 'fe::table::externalWorkExperienceSkills::LineItem-innerTable';
    var AdditionalCustomObjectPageDefinition = {
        actions: {
            // Click on an element of type sControlType which has certain properties mProperties
            iClickOnTheElementTypeWithProperty: function (sControlType, mProperties) {
                return OpaBuilder.create(this)
                    .hasType(sControlType)
                    .hasProperties(mProperties)
                    .doPress()
                    .success("Pressed" + sControlType + "with" + mProperties)
                    .execute();
            },
            // Select a value from the value help
            iSelectAValueFromTheValueHelp: function (sValue) {
                var sOkId = 'fe::table::externalWorkExperienceSkills::LineItem::TableValueHelp::externalWorkExperience::externalWorkExperienceSkills::skill_ID-ok';
                this.iClickOnTheElementTypeWithProperty('sap.m.Text', { text: sValue });
                return this.waitFor({
                    id: PREFIX_ID + sOkId,
                    actions: new Press(),
                    error: function () {
                        Opa5.stopQueue();
                    },
                    errorMessage: 'Can\'t see ' + PREFIX_ID + sOkId
                });
            },
            // Click on value help of table element
            iOpenTheValueHelpOnTheTableElement: function (iRow, iCol) {
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
                            error: function () {
                                Opa5.stopQueue();
                            },
                            errorMessage: 'Can\'t see FieldInput descendant of ' + sTargetId
                        });
                    }.bind(this),
                    error: function () {
                        Opa5.stopQueue();
                    },
                    errorMessage: 'Can\'t see ' + PREFIX_ID + sInnerTableId
                });
            }
        },
        assertions: {
            iShouldSeeTheElementTypeWithProperty: function (sControlType, mProperties) {
                return OpaBuilder.create(this)
                    .hasType(sControlType)
                    .hasProperties(mProperties)
                    .success("Seeing " + sControlType + " has " + mProperties)
                    .execute();
            },
            iShouldSeeTheTable: function (aSubSection) {
                return this.waitFor({
                    id: PREFIX_ID + sInnerTableId,
                    timeout: 70,
                    success: function (oTable) {
                        var oSubSection = oTable.getHeaderToolbar().getTitleControl().getText();
                        Opa5.assert.ok(true, 'List of ' + aSubSection + ' seen\n');
                        if (oSubSection === aSubSection) {
                            Opa5.assert.ok(true, aSubSection + " subsection table heading displayed on the object page is same as the actual heading");
                        } else {
                            Opa5.assert.ok(false, aSubSection + " subsection table heading displayed on the object page is not same as the actual heading");
                        }
                    },
                    errorMessage: 'Can\'t see ' + PREFIX_ID + sInnerTableId
                });
            },
            // See an element with id sId
            iShouldSeeTheElementWithId: function (sId) {
                return this.waitFor({
                    id: PREFIX_ID + sId,
                    timeout: 70,
                    success: function (oElement) {
                        Opa5.assert.ok(true, 'Element with ID ' + PREFIX_ID + sId + ' is found');
                    },
                    errorMessage: 'Can\'t see ' + PREFIX_ID + sId
                });
            },
            // Checks if a value help is visible or not
            iShouldSeeAValueHelpWithTitleAndButtons: function (sValueHelpTitle, iButtons) {
                var sDialogId = 'fe::table::externalWorkExperienceSkills::LineItem::TableValueHelp::externalWorkExperience::externalWorkExperienceSkills::skill_ID-dialog';
                return this.waitFor({
                    id: PREFIX_ID + sDialogId,
                    success: function (oValueHelp) {
                        var sValueHelpTitleFound = oValueHelp.getTitle();
                        var iButtonsFound = oValueHelp.getButtons().length;
                        if (sValueHelpTitle === sValueHelpTitleFound && iButtons === iButtonsFound) {
                            Opa5.assert.ok(true, 'Value Help Dialog with correct title and number of buttons is visible');
                        } else {
                            Opa5.assert.ok(false, 'Value Help Dialog\'s title or number of buttons is wrongly displayed');
                        }
                    },
                    errorMessage: 'Can\'t see ' + PREFIX_ID + sDialogId
                });
            },
            // Checks the number of columns and each column name of the value help table
            iShouldSeeCorrectValueHelpTableColumns: function (aColumns) {
                var sDialogTableId = 'fe::table::externalWorkExperienceSkills::LineItem::TableValueHelp::externalWorkExperience::externalWorkExperienceSkills::skill_ID::Dialog::qualifier::::Table-innerTable';
                return this.waitFor({
                    id: PREFIX_ID + sDialogTableId,
                    success: function (oValueHelpTable) {
                        var aColumnsFound = oValueHelpTable.getColumns();
                        var bFound = false;
                        if (aColumns.length === aColumnsFound.length) {
                            for (var i = 0; i < aColumns.length; i++) {
                                bFound = false;
                                for (var j = 0; j < aColumnsFound.length; j++) {
                                    if (aColumns[i] === aColumnsFound[j].getLabel().getText()) {
                                        Opa5.assert.ok(true, 'Column name ' + aColumns[i] + ' found on the value help table');
                                        bFound = true;
                                        break;
                                    }
                                }
                                if (bFound === false) {
                                    Opa5.assert.ok(false, 'Column name ' + aColumns[i] + ' is not found on the value help table');
                                }
                            }
                        } else {
                            Opa5.assert.ok(false, 'Number of the columns displayed is not same as the actual number');
                        }
                    },
                    errorMessage: 'Table not found on the value help'
                });
            },

            // Checks the filters present in the value help
            iShouldSeeValueHelpFilterBarWithCorrectFilters: function (aFilters) {
                var sFilterBarId = 'fe::table::externalWorkExperienceSkills::LineItem::TableValueHelp::externalWorkExperience::externalWorkExperienceSkills::skill_ID::Dialog::qualifier::::FilterBar';
                return this.waitFor({
                    id: PREFIX_ID + sFilterBarId,
                    success: function (oFilterBar) {
                        var aFiltersFound = oFilterBar.getFilterItems();
                        var bFound = false;
                        if (aFilters.length === aFiltersFound.length) {
                            for (var i = 0; i < aFilters.length; i++) {
                                bFound = false;
                                for (var j = 0; j < aFiltersFound.length; j++) {
                                    if (aFilters[i] === aFiltersFound[j].getLabel()) {
                                        Opa5.assert.ok(true, 'Filter label ' + aFilters[i] + ' is found on the value help');
                                        bFound = true;
                                        break;
                                    }
                                }
                                if (bFound === false) {
                                    Opa5.assert.ok(false, 'Filter label ' + aFilters[i] + ' is not found on the value help');
                                }
                            }
                        } else {
                            Opa5.assert.ok(false, 'Number of filters found on the value help filter bar is not same as the actual number');
                        }
                    },
                    errorMessage: 'Can\'t see ' + PREFIX_ID + sFilterBarId
                });
            },
            iShouldSeeCorrectLabelsInGeneralInfoSection: function (aLabels) {
                return this.waitFor({
                    id: "myResourcesUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation",
                    success: function (oForm) {
                        var aLabelsFound = oForm.getFormElements();
                        if (aLabelsFound.length === aLabels.length) {
                            for (var i = 0; i < aLabels.length; i++) {
                                if (aLabelsFound[i].getLabel() === aLabels[i]) {
                                    Opa5.assert.ok(true, "Label found is same as actual label");
                                } else {
                                    Opa5.assert.ok(false, "Label found " + aLabelsFound[i].getLabel() + " is not same as actual label " + aLabels[i]);
                                }
                            }
                        } else {
                            Opa5.assert(false, "Number of labels found is not same as actual number");
                        }
                    },
                    errorMessage: "General Info section form container not found"
                });
            }
        }
    };
    return new ExternalWrkExpOP(
        {
            appId: "myResourcesUi", // MANDATORY: Compare sap.app.id in manifest.json
            componentId: "ExternalWorkExperienceObjectPage", // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
            entitySet: "ExternalWorkExperience" // MANDATORY: Compare entityset in manifest.json
        },
        AdditionalCustomObjectPageDefinition
    );
});
