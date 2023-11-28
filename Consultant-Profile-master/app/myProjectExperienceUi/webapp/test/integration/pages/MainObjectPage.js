sap.ui.define(["sap/fe/test/ObjectPage", "sap/ui/test/OpaBuilder",
    "sap/ui/test/Opa5", 'sap/ui/test/matchers/Properties',
    'sap/ui/test/actions/Press', 'sap/ui/test/actions/EnterText'],
function (ObjectPage, OpaBuilder, Opa5, Properties, Press, EnterText) {
    "use strict";
    // OPTIONAL
    var PREFIX_ID = 'myProjectExperienceUi::MyProjectExperienceObjectPage--';
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
            // Click an Item(sItem) from the menu
            iClickOnMenuButtonItems: function (sId, sItem) {
                var OBJECTPAGE_PREFIX_ID = 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::ObjectPage-anchBar-myProjectExperienceUi::MyProjectExperienceObjectPage--';
                return this.waitFor({
                    id: OBJECTPAGE_PREFIX_ID + sId,
                    success: function (oButton) {
                        var aItems = oButton.getMenu().getItems();
                        var i = 0;
                        for (; i < aItems.length; i++) {
                            if (sItem === aItems[i].getText()) {
                                aItems[i].firePress();
                                Opa5.assert.ok(true, sItem + ' button pressed successfully');
                                break;
                            }
                        }
                        if (i === aItems.length) {
                            Opa5.assert.ok(false, sItem + " item is not found in the menu button");
                        }
                    },
                    error: function () {
                        Opa5.stopQueue();
                    },
                    errorMessage: "Menu Button with ID " + OBJECTPAGE_PREFIX_ID + sId + " not found"
                });
            },
            // Enter text in the search field
            iEnterTextInTheSearchField: function (sText) {
                return this.waitFor({
                    controlType: 'sap.m.SearchField',
                    properties: { placeholder: 'Search' },
                    actions: new EnterText({ text: sText }),
                    error: function () {
                        Opa5.stopQueue();
                    },
                    errorMessage: 'Error entering the text in search field'
                });
            },
            // Select a value from the value help
            iSelectAValueFromTheValueHelp: function (sValue, sSubSection) {
                var sOkId = '';
                if (sSubSection === 'skills') {
                    sOkId = 'fe::table::skills::LineItem::TableValueHelp::skills::skill_ID-ok';
                } else if (sSubSection === 'roles') {
                    sOkId = 'fe::table::roles::LineItem::TableValueHelp::roles::role_ID-ok';
                }
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
            iShouldSeeDisabledButton: function () {
                return this.waitFor({
                    autoWait: false,
                    matchers: [new Properties({
                        icon: 'sap-icon://sys-cancel',
                        enabled: false })],
                    success: function (oButton) {
                        Opa5.assert.ok(true, "Found disabled button");
                    },
                    errorMessage: "The disabled button cannot be found"
                });
            },
            // See an element with id sID
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
            // Checks if a Table is present on the object page subsection
            iShouldSeeTheTable: function (sId, aSubSection) {
                return this.waitFor({
                    id: PREFIX_ID + sId,
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
                    errorMessage: 'Can\'t see ' + PREFIX_ID + sId
                });
            },

            iShouldSeeTheFieldGroups: function (aFieldGroups, sId) {
                return this.waitFor({
                    id: PREFIX_ID + sId,
                    timeout: 70,
                    success: function (oObjectPage) {
                        var oAgg = oObjectPage.getHeaderContent()[0].getItems();
                        var oLength = oAgg.length;
                        var aLength = aFieldGroups.length;
                        var oFieldGroups = new Array(aLength);
                        if (oLength === aLength) {
                            Opa5.assert.ok(true, "Number of field groups displayed on the objectPage header : " + oLength + ", Number of field groups that should be present: " + aLength);
                            for (var i = 1; i < oLength; i++) {
                                oFieldGroups[i] = oAgg[i].getItems()[0].getItems()[0].getText();
                                if (oFieldGroups[i] === aFieldGroups[i]) {
                                    Opa5.assert.ok(true, "Field Group " + (i + 1) + "name displayed on the object page is same as the actual name");
                                } else {
                                    Opa5.assert.ok(false, "Field Group " + (i + 1) + "name displayed on the object page is not same as the actual name");
                                }
                            }
                        } else {
                            Opa5.assert.ok(false, "Number of field groups displayed on the object page is not same as the actual number");
                        }
                    },
                    errorMessage: "Did not find object page header content"
                });
            },
            // Checks if a value help is visible or not
            iShouldSeeAValueHelpWithTitleAndButtons: function (sSubSection, sValueHelpTitle, iButtons) {
                var sDialogId = '';
                if (sSubSection === 'skills') {
                    sDialogId = 'fe::table::skills::LineItem::TableValueHelp::skills::skill_ID-dialog';
                } else if (sSubSection === 'roles') {
                    sDialogId = 'fe::table::roles::LineItem::TableValueHelp::roles::role_ID-dialog';
                }
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
            iShouldSeeCorrectValueHelpTableColumns: function (sSubSection, aColumns) {
                var sDialogTableId = '';
                if (sSubSection === 'skills') {
                    sDialogTableId = 'fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::Dialog::qualifier::::Table-innerTable';
                } else if (sSubSection === 'roles') {
                    sDialogTableId = 'fe::table::roles::LineItem::TableValueHelp::roles::role_ID::Dialog::qualifier::::Table-innerTable';
                }
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
            iShouldSeeValueHelpFilterBarWithCorrectFilters: function (sSubSection, aFilters) {
                var sFilterBarId = '';
                if (sSubSection === 'skills') {
                    sFilterBarId = 'fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::Dialog::qualifier::::FilterBar';
                } else if (sSubSection === 'roles') {
                    sFilterBarId = 'fe::table::roles::LineItem::TableValueHelp::roles::role_ID::Dialog::qualifier::::FilterBar';
                }
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
            // Checks the sub sections(aSubSections) are  present under the given section
            iShouldSeeSubSectionsUnderGivenSection: function (aSubSections, sId) {
                return this.waitFor({
                    id: PREFIX_ID + sId,
                    timeout: 70,
                    success: function (oSection) {
                        var aSubSectionsFound = oSection.getSubSections();
                        var bFound = false;
                        for (var i = 0; i < aSubSections.length; i++) {
                            for (var j = 0; j < aSubSectionsFound.length; j++) {
                                if (aSubSectionsFound[j].getTitle() === aSubSections[i]) {
                                    bFound = true;
                                    Opa5.assert.ok(true, "SubSection " + aSubSections[i] + " found.");
                                    break;
                                }
                            }
                            if (!bFound) {
                                Opa5.assert.ok(false, "SubSection " + aSubSections[i] + " not found under the given section.");
                            } else {
                                bFound = false;
                            }
                        }
                    },
                    errorMessage: 'Can\'t see ' + PREFIX_ID + sId
                });
            },

            iShouldSeeProfilePhotoSectionOnEditMode: function () {
                return this.waitFor({
                    id: "myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FormContainer::FieldGroup::ProfilePhoto",
                    success: function () {
                        Opa5.assert.ok(true, "Profile photo section is present");
                    },
                    errorMessage: "Profile photo section not found"
                });
            },
            iShouldSeeAttachmentSectionOnEditMode: function () {
                return this.waitFor({
                    id: "myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FacetSection::Attachment",
                    success: function () {
                        Opa5.assert.ok(true, "Attachment section is present");
                    },
                    errorMessage: "Attachment section not found"
                });
            }
        }
    };
    return new ObjectPage(
        {
            appId: "myProjectExperienceUi", // MANDATORY: Compare sap.app.id in manifest.json
            componentId: "MyProjectExperienceObjectPage", // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
            entitySet: "MyProjectExperienceHeader" // MANDATORY: Compare entityset in manifest.json
        },
        AdditionalCustomObjectPageDefinition
    );
});
