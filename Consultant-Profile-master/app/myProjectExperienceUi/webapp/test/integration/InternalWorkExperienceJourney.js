sap.ui.define([
    'sap/ui/test/opaQunit'
], function (opaTest) {
    'use strict';
    var Journey = {
        run: function () {
            QUnit.module('Internal Work Experience');

            opaTest('In edit mode, I should see internal work experience assignments table row data as non editable', function(Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'Internal Work Experience');
                // Assertions
                Then.onTheObjectPage.onTable({ property: "internalWorkExperience" })
                    .iCheckColumns(8, {
                        "Request Name": { headerVisible: true },
                        "Request ID": { headerVisible: true },
                        "Project Role": { headerVisible: true },
                        "Requested Resource Organization": { headerVisible: true },
                        "Customer": { headerVisible: true },
                        "Start Date": { headerVisible: true },
                        "End Date": { headerVisible: true },
                        "Assignment Status": { headerVisible: true }
                    })
                    .and.iCheckRows(2);
            });
            opaTest("#999: Tear down", function (Given, When, Then) {
                Given.iTearDownMyApp();
            });
        }
    };
    return Journey;
});
