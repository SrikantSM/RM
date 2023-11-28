sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/ui/test/actions/Press',
    'sap/ui/test/actions/EnterText',
    'sap/ui/test/matchers/Properties',
    'sap/ui/test/launchers/iFrameLauncher',
    'sap/ui/test/matchers/Ancestor',
    'sap/ui/test/matchers/Descendant'
], function (Opa5, Press, EnterText, Properties, iFrameLauncher, Ancestor, Descendant) {


    return Opa5.extend('staffResourceRequest.test.integration.pages.Common', {

        iStartMyApp: function (sResourceRequestId) {
            const sPath = sap.ui.require.toUrl('staffResourceRequest/app');
            this.iStartMyAppInAFrame(
                sPath +
          '.html?serverDelay=0&responderOn=true&demoApp=staffResourceRequest&sap-ui-language=en_US&appState=lean#ResourceRequest-Display'
          + (sResourceRequestId ? `&/ResourceRequests(${sResourceRequestId})` : '')
            );
        },
        iStartMyAppOnObjectPage: function () {
            const sPath = sap.ui.require.toUrl('staffResourceRequest/app');
            return this.iStartMyAppInAFrame(
                sPath +
          '.html?serverDelay=0&responderOn=true&demoApp=staffResourceRequest&sap-ui-language=en_US&appState=lean#ResourceRequest-Display&/ResourceRequests(f33a71e7-6363-43a8-8374-8ace063d7813)'
            );
        },
        iNavigateBack: function () {
            return this.waitFor({
                id: 'backBtn',
                controlType: 'sap.ushell.ui.shell.ShellHeadItem',
                actions: new Press()
            });
        },

        iCancelDialog: function () {
            return this.waitFor({
                searchOpenDialogs: true,
                controlType: "sap.m.Button",
                viewName: "sap.fe.templates.ObjectPage.ObjectPage",
                properties: {
                    text: "Cancel"
                },
                actions: new Press(),
                success: function () {
                    Opa5.assert.ok(true, "Cancelled the Dialogue box");
                },
                errorMessage: 'Can\'t find cancel button on Dialog box'
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

        iClickOnTheElementInsideFilterPopover: function (sText) {
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
                                controlType: 'sap.m.ColumnListItem',
                                matchers: function (matchedColumnListItem) {
                                    return matchedColumnListItem.getCells()[0].mProperties.value === sText;
                                },
                                actions: new Press(),
                                success: function () {
                                    Opa5.assert.ok(true, "Item within Popover clicked");
                                },
                                errorMessage: 'Can\'t see properties '
                            });
                        },
                        errorMessage: "The popover is not present"
                    });
                }
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
                            Opa5.assert.strictEqual(aRows.length, 1, "Found row with text:" + sText);
                        },
                        errorMessage: "Did not find row inside dialog"
                    });
                },
                errorMessage: "Did not find" + sText
            });
        },
        iClickThePrimaryDialogButton() {
            return this.waitFor({
                controlType: 'sap.m.Dialog',
                success: function (aDialogs) {
                    var sTargetId = aDialogs[0].getButtons().find(function (oButton) {
                        return oButton.getType() === "Emphasized";
                    }).getId();
                    return this.waitFor({
                        id: sTargetId,
                        actions: new Press(),
                        errorMessage: 'Can\'t see property ' + sTargetId
                    });
                },
                errorMessage: 'Can\'t see the Dialog'
            });
        },
        //Click button with properties

        iClickTheDialogButtonWithButtonNumberAndId(buttonNumber, sId) {
            return this.waitFor({
                controlType: 'sap.m.Dialog',
                //  properties:mProperties,
                id: sId,
                success: function (oDialog) {
                    var sTargetId = oDialog.getButtons()[buttonNumber].getId();
                    return this.waitFor({
                        id: sTargetId,
                        actions: new Press(),
                        errorMessage: 'Can\'t see property ' + sTargetId
                    });
                }
            });
        },

        iClickTheDialogButtonNo(buttonNumber) {
            return this.waitFor({
                controlType: 'sap.m.Dialog',
                success: function (aDialogs) {
                    var sTargetId = aDialogs[0].getButtons()[buttonNumber].getId();
                    return this.waitFor({
                        id: sTargetId,
                        actions: new Press(),
                        errorMessage: 'Can\'t see property ' + sTargetId
                    });
                },
                errorMessage: 'Can\'t see the Dialog'
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

        iClickOnCancelInsideDialog: function (sText) {
            return this.waitFor({
                controlType: "sap.m.Dialog",
                success: function (aDialog) {
                    return this.waitFor({
                        check: function () {
                            return aDialog.length > 0;
                        },
                        success: function () {
                            Opa5.assert.ok(true, sText + " Dialog visible");
                            return this.waitFor({
                                controlType: 'sap.m.Button',
                                matchers: new Properties({
                                    text: "Cancel"
                                }),
                                actions: new Press(),
                                success: function () {
                                    Opa5.assert.ok(true, "Cancel button within Dialog clicked");
                                },
                                errorMessage: 'Can\'t see cancel button'
                            });
                        },
                        errorMessage: "Assign dialog is not present"
                    });
                }
            });
        },


        iShouldSeeTheDialog: function (sText) {
            return this.waitFor({
                controlType: "sap.m.Dialog",
                searchOpenDialogs: true,
                matchers: new sap.ui.test.matchers.PropertyStrictEquals({
                    name: "title",
                    value: sText
                }),
                success: function () {
                    // we set the view busy, so we need to query the parent of the app
                    Opa5.assert.ok(true, sText + " dialog is open");
                },
                errorMessage: "Did not find the dialog control"
            });
        },
        iShouldSeeTheTextInsideDialog: function (sText) {
            return this.waitFor({
                controlType: "sap.m.Text",
                searchOpenDialogs: true,
                matchers: new Properties({
                    text: sText
                }),
                success: function (aText) {
                    Opa5.assert.ok(true, " found text" + sText);
                },
                errorMessage: "Did not find" + sText
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
                                var aCells = aTable[0].getItems()[0].getCells();
                                Opa5.assert.strictEqual(aCells[index].getValue(), expectedRow[key], 'Row matched on search with ' + key + " " + expectedRow[key]);
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
        }
    });
});
