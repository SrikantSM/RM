sap.ui.define(
    [
        "sap/ui/test/Opa5",
        "sap/ui/test/actions/Press",
        'sap/ui/test/actions/EnterText',
        "sap/ui/test/matchers/Properties",
        "sap/ui/test/matchers/Descendant",
        "sap/ui/test/launchers/iFrameLauncher",
        'sap/ui/test/matchers/Ancestor'
    ],
    function (Opa5, Press, EnterText, Properties, Descendant, iFrameLauncher, Ancestor) {


        var PREFIX_ID = 'manageResourceRequest::ResourceRequestObjectPage--';
        return Opa5.extend("manageResourceRequest.test.integration.pages.Common", {

            iStartMyApp: function (sResourceRequestId) {
                const sPath = sap.ui.require.toUrl("manageResourceRequest/app");
                this.iStartMyAppInAFrame(
                    sPath +
            '.html?serverDelay=0&responderOn=true&demoApp=manageResourceRequest&sap-ui-language=en_US&appState=lean#ResourceRequest-Manage'
            + (sResourceRequestId ? `&/ResourceRequests(${sResourceRequestId})` : '')
                );

            },

            iNavigateBack: function () {
                return this.waitFor({
                    id: "backBtn",
                    controlType: "sap.ushell.ui.shell.ShellHeadItem",
                    actions: new Press(),
                    success: function () {
                        Opa5.assert.ok(
                            "Back button is pressed"
                        );
                    },
                    errorMessage: "Back Button is not pressed"
                });
            },

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

            iClickOnTheElementTypeWithProperty: function (sControlType, mProperties) {
                return this.waitFor({
                    controlType: sControlType,
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
                                Opa5.assert.strictEqual(aFormElement.length, 1, "Found FormElement with text: " + sText);
                                return this.waitFor({
                                    controlType: "sap.ui.core.Icon",
                                    matchers: new Ancestor(aFormElement[0]),
                                    actions: new Press(),
                                    success: function () {
                                        Opa5.assert.ok(true, "Icon clicked for label: " + sText);
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

            iClickOnTheElementInsideFilterPopover: function (sText) {
                return this.waitFor({
                    controlType: "sap.m.Popover",
                    success: function (aPopovers) {
                        return this.waitFor({
                            check: function () {
                                return aPopovers.length > 0;
                            },
                            success: function () {
                                Opa5.assert.ok(true, "Popover is visible ");
                                return this.waitFor({
                                    controlType: "sap.m.ColumnListItem",
                                    matchers: function (matchedColumnListItem) {
                                        return (
                                            matchedColumnListItem.getCells()[0].mProperties.value ===
                      sText
                                        );
                                    },
                                    actions: new Press(),
                                    success: function () {
                                        Opa5.assert.ok(true, "Item within Popover clicked");
                                    },
                                    errorMessage: "Can't see properties "
                                });
                            },
                            errorMessage: "The popover is not present"
                        });
                    }
                });
            },

            iClickOnTheElementInsideFilterDialog: function (sText) {
                return this.waitFor({
                    controlType: "sap.m.Text",
                    searchOpenDialogs: true,
                    matchers: new Properties({
                        text: sText
                    }),
                    success: function (aText) {
                        return this.waitFor({
                            controlType: "sap.m.ColumnListItem",
                            searchOpenDialogs: true,
                            matchers: new Descendant(aText[0]),
                            actions: new Press(),
                            success: function (aRows) {
                                Opa5.assert.strictEqual(
                                    aRows.length,
                                    1,
                                    "Found row with text:" + sText
                                );
                            },
                            errorMessage: "Did not find row inside dialog"
                        });
                    },
                    errorMessage: "Did not find" + sText
                });
            },
            checkSideFilterInPopover: function (expectedCount, filterLabels) {
                return this.waitFor({
                    controlType: "sap.ui.mdc.filterbar.vh.FilterBar",
                    searchOpenDialogs: true,
                    success: function (aControls) {
                        let aFilters = aControls[0].getAggregation("filterItems");
                        Opa5.assert.strictEqual(aFilters.length, expectedCount, 'Seen ' + aFilters.length + ' filterItems');
                        aFilters.forEach((element, index) => {
                            Opa5.assert.strictEqual(element.getLabel(), filterLabels[index], 'Seen filterItem : ' + filterLabels[index]);
                        });
                    },
                    errorMessage: "Cannot see FilterBar"
                });
            },

            iClickThePrimaryDialogButton() {
                return this.waitFor({
                    controlType: "sap.m.Dialog",
                    success: function (aDialogs) {
                        var sTargetId = aDialogs[0]
                            .getButtons()
                            .find(function (oButton) {
                                return oButton.getType() === "Emphasized";
                            })
                            .getId();
                        return this.waitFor({
                            id: sTargetId,
                            actions: new Press(),
                            errorMessage: "Can't see property " + sTargetId
                        });
                    },
                    errorMessage: "Can't see the Dialog"
                });
            },

            iClickTheDialogButtonNo(buttonNumber) {
                return this.waitFor({
                    controlType: "sap.m.Dialog",
                    success: function (aDialogs) {
                        var sTargetId = aDialogs[0].getButtons()[buttonNumber].getId();
                        return this.waitFor({
                            id: sTargetId,
                            actions: new Press(),
                            errorMessage: "Can't see property " + sTargetId
                        });
                    },
                    errorMessage: "Can't see the Dialog"
                });
            },
            iEnterTextInInputField(sId, sText) {
                return this.waitFor({
                    id: sId,
                    actions: new EnterText({
                        text: sText
                    }),
                    success: function () {
                        Opa5.assert.ok(true, 'Text Entered');
                    },
                    errorMessage: 'Can\'t enter Text ' + sText
                });
            },

            iEnterTextInInputFieldWithBindingPath(mBindingPath, sText) {
                return this.waitFor({
                    controlType: 'sap.m.Input',
                    bindingPath: mBindingPath,
                    actions: new EnterText({
                        text: sText
                    }),
                    success: function () {
                        Opa5.assert.ok(true, 'Text Entered');
                    },
                    errorMessage: 'Can\'t enter Text ' + sText
                });
            },

            iShouldSeeTheElement: function (sId) {
                return this.waitFor({
                    id: PREFIX_ID + sId,
                    success: function () {
                        Opa5.assert.ok(true, "Element is clicked with Id: " + sId);
                    },
                    errorMessage: 'Cannot see ' + sId
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
            iShouldSeeTheColumns: function (tableHeader, numColumns, colHeaders) {
                return this.waitFor({
                    controlType: "sap.ui.mdc.Table",
                    matchers: function (oTable) {
                        if (oTable.getProperty("header") === tableHeader) {return true;} else {return false;}
                    },
                    success: function (aTable) {
                        let aColumns = aTable[0].getColumns();
                        if (aColumns.length === 0) {
                            Opa5.assert.notOk('No columns seen');
                        } else {
                            Opa5.assert.strictEqual(aColumns.length, numColumns, 'Seen ' + numColumns + ' columns in ' + tableHeader + ' table');
                            aColumns.forEach((aColumn, i) => {
                                Opa5.assert.strictEqual(aColumn.getHeader(), colHeaders[i], 'Column ' + (i + 1) + ' matched with header ' + colHeaders[i]);
                            });

                        }
                    },
                    errorMessage: 'Cannot see table' + tableHeader
                });
            },
            iShouldSeeTheColumnsInDialog: function (numColumns, colHeaders) {
                return this.waitFor({
                    controlType: "sap.m.Column",
                    searchOpenDialogs: true,
                    success: function (aColumns) {
                        if (aColumns.length === 0) {
                            Opa5.assert.notOk('No columns seen');
                        } else {
                            Opa5.assert.strictEqual(aColumns.length, numColumns, 'Seen ' + numColumns + ' columns in dialog');
                            aColumns.forEach((aColumn, index) => {
                                Opa5.assert.strictEqual(aColumn.getHeader().getText(), colHeaders[index], 'Column ' + (index + 1) + ' matched with header ' + colHeaders[index]);
                            });

                        }
                    },
                    errorMessage: 'Cannot see columns'
                });
            },
            iShouldSeeTheRows: function (sTableId, iNumRows, PREFIX_ID) {
                return this.waitFor({
                    controlType: "sap.m.ColumnListItem",
                    matchers: function (oColumnListItem) {
                        return oColumnListItem.getId().startsWith(PREFIX_ID + sTableId);
                    },
                    success: function (oColumnListItemArray) {
                        if (iNumRows === undefined) {
                            Opa5.assert.ok(true, 'Seen');
                        } else if (oColumnListItemArray === undefined) {
                            Opa5.assert.notOk('no rows');
                        } else {
                            Opa5.assert.strictEqual(oColumnListItemArray.length, iNumRows, 'Seen ' + iNumRows + ' rows');
                        }
                    },
                    errorMessage: 'Can\'t see rows inside' + PREFIX_ID + sTableId
                });
            },

            iShouldSeeTableWithNoItems: function (sTableId) {
                return this.waitFor({
                    check: function () {
                        return Opa5.getJQuery()("td[id='" + sTableId + "-innerTable-nodata-text']")[0].innerText === "No data found. Try adjusting the filter settings.";
                    },
                    success: function () {
                        Opa5.assert.ok(true, "Table has no items");
                    },
                    errorMessage: "Can not see the inner text"
                });
            },

            iShouldSearchByIdAndLabelInDialog: function (dialogName, PREFIX_ID, searchId, sTableId, expectedRow, F4type) {
                return this.waitFor({
                    controlType: "sap.m.Table",
                    searchOpenDialogs: true,
                    matchers: function (oTable) {
                        if (oTable.getId() === (PREFIX_ID + sTableId)) {return true;} else {return false;}
                    },
                    success: function (aTable) {
                        if (aTable === undefined) {
                            Opa5.assert.notOk('no table in dialog');
                            return;
                        }
                        Object.keys(expectedRow).forEach((key, index) => {
                            this.waitFor({
                                // 2 waitFors are needed - 1 within iEnterTextInInputField and 1 for Row match
                                actions: this.iEnterTextInInputField(PREFIX_ID + searchId, expectedRow[key]),
                                success: function () {
                                    this.iClickTheDialogButtonNo(1);
                                    if (F4type === "ListReportFilter") {
                                        this.iClickOnTheElementTypeWithAncestorProperty(
                                            'sap.ui.mdc.FilterField', {
                                                label: dialogName
                                            },
                                            'sap.ui.core.Icon'
                                        );
                                    } else if (F4type === "ObjectPageValueHelp") {
                                        this.iClickOnTheIconWithFormElementLabelText(dialogName);
                                    }
                                    this.iEnterTextInInputField(PREFIX_ID + searchId, ""); //call function with empty string to remove existing search keyword
                                }

                            });
                        });

                    },
                    errorMessage: 'Can\'t see rows inside'
                });
            },
            iShouldSeeCorrectValueHelpTableRowCount: function (sTableId, iRows) {
                return this.waitFor({
                    id: sTableId,
                    success: function (oValueHelpTable) {
                        var iRowsFound = oValueHelpTable.getMaxItemsCount();
                        if (iRows === iRowsFound) {
                            Opa5.assert.ok(true, 'correct number of items are displayed on the value help table');
                        } else {
                            Opa5.assert.ok(false, 'The number of items displayed is not same as the actual number of items in the value help table');
                        }
                    },
                    errorMessage: 'Table not found on the value help'
                });
            }
        });
    }
);
