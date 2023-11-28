sap.ui.define(["sap/fe/test/ObjectPage", "sap/ui/test/OpaBuilder", "sap/ui/test/Opa5", 'sap/ui/test/actions/EnterText', 'sap/ui/test/actions/Press', 'sap/ui/test/matchers/Properties'],
    function (ObjectPage, OpaBuilder, Opa5, EnterText, Press, Properties) {
        "use strict";

        var OBJECTPAGE_PREFIX_ID = 'projectRoleUi::ProjectRoleObjectPage--';

        // OPTIONAL
        var AdditionalCustomObjectPageDefinition = {
            actions: {
                iClickOnTheElementTypeWithProperty: function (sControlType, mProperties){
                    return OpaBuilder.create(this)
                        .hasType(sControlType)
                        .hasProperties(mProperties)
                        .doPress()
                        .success("Pressed" + sControlType + "with" + mProperties)
                        .execute();
                },

                /**
                 * Type text into a table cell identified by row and column
                 * @param {*} iRow Row number
                 * @param {*} iCol Column number
                 * @param {*} sText Text to be entered
                 * @returns {*} Opa5.waitFor()
                 */
                iEnterTextOnTheTableElement: function (iRow, iCol, sText) {
                    var id = OBJECTPAGE_PREFIX_ID + "fe::table::texts::LineItem-innerTable";
                    return this.waitFor({
                        id: id,
                        actions: function (oTable) {
                            var sTargetId = oTable.getItems()[iRow].getCells()[iCol].getId();
                            return this.waitFor({
                                controlType: 'sap.m.Input',
                                matchers: {
                                    ancestor: {
                                        id: sTargetId
                                    }
                                },
                                actions: new EnterText({ text: sText }),
                                errorMessage: 'Can\'t see property ' + sTargetId
                            });
                        }.bind(this),
                        errorMessage: 'Can\'t see ' + id
                    });
                },

                /**
                 * Click to open the value help of a table cell identified by row and column, e.g. the value help of the language cell of a label
                 * @param {*} sInnerTableId Inner table id of the table
                 * @param {*} iRow Row number
                 * @param {*} iCol Column number
                 * @returns {*} Opa5.waitFor()
                 */
                iOpenTheValueHelpOnTheTableElement: function (sInnerTableId, iRow, iCol) {
                    return this.waitFor({
                        id: OBJECTPAGE_PREFIX_ID + sInnerTableId,
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
                        errorMessage: 'Can\'t see ' + OBJECTPAGE_PREFIX_ID + sInnerTableId
                    });
                }
            },
            assertions: {
                iShouldSeeTheElementTypeWithProperty: function (sControlType, mProperties, bVisible) {
                    if (bVisible === true){
                        return OpaBuilder.create(this)
                            .hasType(sControlType)
                            .hasProperties(mProperties)
                            .success("Seeing " + sControlType + " has " + mProperties)
                            .execute();
                    } else {
                        return OpaBuilder.create(this)
                            .hasType(sControlType)
                            .has(OpaBuilder.Matchers.not(
                                OpaBuilder.Matchers.properties(mProperties)
                            ))
                            .success("Cannot see " + sControlType + " with " + mProperties)
                            .execute();
                    }
                },

                /**
                 * Checks whether a text contains the current time
                 * @param {*} sFieldGroup field group of the text
                 * @param {*} sField field of the text
                 * @param {*} iSecondsDelta for delta info
                 * @returns {*} returns current time
                 */
                iShouldSeeTheCurrentTimeInTheText: function (sFieldGroup, sField, iSecondsDelta) {
                    return this.waitFor({
                        controlType: 'sap.m.Text',
                        id: "projectRoleUi::ProjectRoleObjectPage--fe::HeaderFacet::Form::" + sFieldGroup + "::DataField::" + sField + "::Field-content",
                        success: function (oTexts) {
                            var oFieldTime = new Date(oTexts.getText()).getTime();
                            var oNowTime = new Date().getTime();
                            var bIsNow = Math.abs(oNowTime - oFieldTime) < iSecondsDelta * 1000;
                            Opa5.assert.ok(bIsNow, 'Time content is from now');
                        },
                        errorMessage: 'Can\'t see text with field ' + sField
                    });
                },

                /**
                 * Checks whether a field contains a given text
                 * @param {*} bIsCreateMode which depicts if function is called during create or edit mode
                 * @returns {*} return time of createdAt and modifiedAt values
                 */
                iShouldSeeTimeInCreatedAndModifiedAtTexts: function () {
                    return this.waitFor({
                        controlType: 'sap.m.Text',
                        id: "projectRoleUi::ProjectRoleObjectPage--fe::HeaderFacet::Form::FieldGroup::AdministrativeData1::DataField::createdAt::Field-content",
                        success: function (oTexts) {
                            var createdAtValue = oTexts.getText();
                            return this.waitFor({
                                controlType: 'sap.m.Text',
                                id: "projectRoleUi::ProjectRoleObjectPage--fe::HeaderFacet::Form::FieldGroup::AdministrativeData2::DataField::modifiedAt::Field-content",
                                success: function (oTexts) {
                                    var modifiedAtValue = oTexts.getText();
                                    Opa5.assert.strictEqual(createdAtValue, modifiedAtValue, 'During creation of role CreatedAt and modifiedAt field values are same');
                                },
                                errorMessage: 'Can\'t see field with id DataField::modifiedAt::Field-content'
                            });
                        },
                        errorMessage: 'Can\'t see field with id DataField::createdAt::Field-content'
                    });
                },

                /**
                 * Checks whether a text contains a given text
                 * @param {*} sPropertyPath propertyPath of the text to contain the text
                 * @param {*} sExpectedValue value that is expected
                 * @returns {*} Opa5.waitFor()
                 */
                iShouldSeeTheValueInTheField: function (sPropertyPath, sExpectedValue) {
                    return this.waitFor({
                        controlType: 'sap.m.Text',
                        bindingPath: {
                            propertyPath: sPropertyPath
                        },
                        success: function (oTexts) {
                            Opa5.assert.strictEqual(oTexts[0].getText(), sExpectedValue, 'Control has the expected text');
                        },
                        errorMessage: 'Can\'t see text with property path ' + sPropertyPath
                    });
                },

                iShouldSeeMessagePopoverWithProperty: function (sControlType, mProperties) {
                    return this.waitFor({
                        autoWait: false,
                        timeout: 70,
                        controlType: sControlType,
                        matchers: new Properties(mProperties),
                        success: function () {
                            Opa5.assert.ok(true, 'Seen');
                        },
                        errorMessage: 'Can\'t see properties ' + JSON.stringify(mProperties)
                    });
                },

                // Checks the number of columns and each column name of the value help table
                iShouldSeeCorrectValueHelpTableColumns: function (sPage, sTable, aColumns) {
                    var id = "projectRoleUi::" + sPage + "--fe::" + sTable;
                    // FilterBar::Roles::FilterFieldValueHelp::code::Table
                    return this.waitFor({
                        id: id,
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
                }
            }
        };

        return new ObjectPage(
            {
                appId: "projectRoleUi", // MANDATORY: Compare sap.app.id in manifest.json
                componentId: "ProjectRoleObjectPage", // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
                entitySet: "Roles" // MANDATORY: Compare entityset in manifest.json
            },
            AdditionalCustomObjectPageDefinition
        );
    });
