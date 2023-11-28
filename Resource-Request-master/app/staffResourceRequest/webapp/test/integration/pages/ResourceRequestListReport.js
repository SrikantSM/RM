sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/ui/test/actions/Press',
    'sap/ui/test/matchers/Properties',
    'sap/ui/test/matchers/Ancestor',
    'sap/fe/test/ListReport'
], function (Opa5, Press, Properties, Ancestor, ListReport) {


    const PREFIX_ID = 'staffResourceRequest::ResourceRequestListReport--';
    var AdditionalCustomListReportDefinition = {
        actions: {

            iClickOnTheElementTypeWithAncestorProperty: function (sParentControl, mParentProperties, sChildControl) {
                return this.waitFor({
                    controlType: sParentControl,
                    matchers: new Properties(mParentProperties),
                    success: function (aAncestors) {
                        Opa5.assert.strictEqual(aAncestors.length, 1, 'There is exactly one ancestor:' + sParentControl + ' with properties:' + JSON.stringify(mParentProperties));
                        var oAncestor = aAncestors[0];
                        return this.waitFor({
                            controlType: sChildControl,
                            matchers: new Ancestor(oAncestor),
                            actions: new Press(),
                            errorMessage: 'Can\'t the filter'
                        });
                    }.bind(this)
                });
            },

            iClickOnTheGoButton: function () {
                return this.waitFor({
                    id: PREFIX_ID + "fe::FilterBar::ResourceRequests-btnSearch",
                    actions: new Press(),
                    success: function () {
                        Opa5.assert.ok(true, 'Go button clicked.');
                    },
                    errorMessage: 'Cannot see Go button'
                });
            },

            iSelectTheNthItem: function (iIndex) {
                return this.waitFor({
                    id: PREFIX_ID + 'fe::table::ResourceRequests::LineItem-innerTable',

                    actions: function (oTable) {

                        var sTargetId = oTable.getItems()[iIndex].getId();

                        return this.waitFor({
                            id: sTargetId,
                            actions: new Press(),
                            errorMessage: 'Can\'t see property' + sTargetId
                        });
                    }.bind(this),
                    errorMessage: 'Can\'t see table' + PREFIX_ID
                });
            },
            assertions: {
                iShouldSeeTheElement: function (sId) {
                    const LISTREPORT_PREFIX_ID = 'staffResourceRequest::resourceRequestListReport--';

                    return this.waitFor({
                        //id: LISTREPORT_PREFIX_ID + sId,
                        controlType:"sap.ui.mdc.Table",
                        timeout: 70,
                        matchers:function(oTable){
                            if (oTable.getProperty("header") == "Resource Requests") {return true;} else {return false;}
                        },
                        success: function () {
                            Opa5.assert.ok(true, 'Seen');
                        },
                        errorMessage: 'Can\'t see ' + LISTREPORT_PREFIX_ID + sId
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

                iShouldSeeTheRows: function (sTableId, iNumRows) {
                    return this.waitFor({
                        controlType: "sap.m.ColumnListItem",
                        matchers: function (oColumnListItem) {
                            return oColumnListItem.getId().startsWith(PREFIX_ID + sTableId);
                        },
                        success: function (oColumnListItemArray) {
                            if (iNumRows === undefined) {
                                Opa5.assert.ok(true, 'Seen');
                            } else if (oColumnListItemArray === undefined) {
                                Opa5.assert.notOk('no columns');
                            } else {
                                Opa5.assert.strictEqual(oColumnListItemArray.length, iNumRows, 'Seen ' + iNumRows + ' rows');
                            }
                        },
                        errorMessage: 'Can\'t see columns inside' + PREFIX_ID + sTableId
                    });
                }


            }
        },
        assertions:{
            iShouldSeeTheElementWithId: function (sId) {
                return this.waitFor({
                    id: sId,
                    success: function () {
                        Opa5.assert.ok(true, "Saw element with ID: " + sId);
                    },
                    errorMessage: 'Cannot see ' + sId
                });
            }
        }
    };

    return new ListReport(
        {
            appId: "staffResourceRequest", // MANDATORY: Compare sap.app.id in manifest.json
            componentId: "ResourceRequestListReport", // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
            entitySet: "ResourceRequests" // MANDATORY: Compare entityset in manifest.json
        },
        AdditionalCustomListReportDefinition
    );

});
