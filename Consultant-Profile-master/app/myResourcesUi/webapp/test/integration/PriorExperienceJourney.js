sap.ui.define([
    'sap/ui/test/opaQunit'
], function (opaTest) {
    'use strict';
    var Journey = {
        run: function () {
            QUnit.module('Resource Profile Prior Experience');

            //Varient management
            opaTest('On object page, For internal work experience I should able to see Sort and Add/Remove Columns button and Variant management ', function (Given, When, Then) {
                //Actions
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'Internal Work Experience');
                //Assertions
                Then.onTheObjectPage.iShouldSeeTheElementTypeWithProperty('sap.m.Button', { text: 'Settings' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Title', { text: 'Standard' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Button', { icon: 'sap-icon://slim-arrow-down' });
            });

            //Add/Remove columns check
            opaTest('On click of Add/Remove Columns icon For internal work experience, I should see correct number of columns and data.', function (Given, When, Then) {
                //Actions
                When.onTheObjectPage.onTable({ property: "internalWorkExperience" }).iOpenColumnAdaptation();
                //Assertions
                Then.onTheObjectPage.onTable({ property: "internalWorkExperience" }).iCheckAdaptationColumn("Request Name", { selected: true })
                    .and.iCheckAdaptationColumn("Request ID", { selected: true })
                    .and.iCheckAdaptationColumn("Work Item", { selected: false })
                    .and.iCheckAdaptationColumn("Project Role", { selected: true })
                    .and.iCheckAdaptationColumn("Requested Resource Organization", { selected: true })
                    .and.iCheckAdaptationColumn("Customer", { selected: true })
                    .and.iCheckAdaptationColumn("Start Date", { selected: true })
                    .and.iCheckAdaptationColumn("End Date", { selected: true })
                    .and.iCheckAdaptationColumn("Assignment Status", { selected: true })
                    .and.iCheckAdaptationColumn("Assigned", { selected: false })
                    .and.iConfirmColumnAdaptation();
            });

            opaTest('On object page I can navigate to internal work experience subsection and then to sub object page', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'Internal Work Experience');
                // Assertions
                Then.onTheObjectPage.iShouldSeeTheTable("fe::table::internalWorkExperience::LineItem-innerTable", "Assignments (2)");
                Then.onTheObjectPage.onTable({ property: "internalWorkExperience" }).iCheckColumns(8)
                    .and.iCheckColumns(8, {
                        "Request Name": { headerVisible: true },
                        "Request ID": { headerVisible: true },
                        "Project Role": { headerVisible: true },
                        "Requested Resource Organization": { headerVisible: true },
                        "Customer": { headerVisible: true },
                        "Start Date": { headerVisible: true },
                        "End Date": { headerVisible: true },
                        "Assignment Status": {headerVisible: true}
                    })
                    .and.iCheckRows(2);
                // Actions
                When.onTheObjectPage.onTable({ property: "internalWorkExperience" }).iPressRow({ 4: "iTelO" });
                // Assertions
                Then.onInternalWrkExpOP.iSeeSectionWithTitle("General Information")
                    .and.iSeeSectionWithTitle("Required Skills");
                Then.onInternalWrkExpOP.iShouldSeeCorrectLabelsInGeneralInfoSection(["Request ID", "Work Item", "Customer", "Project Role", "Requested Resource Organization", "Start", "End", "Assigned", "Assignment Status"]);
            });

            opaTest('On internal work experience sub object page, I can navigate to skills section', function (Given, When, Then) {
                // Actions
                When.onInternalWrkExpOP.iGoToSection('Skills');
                // Assertions
                Then.onInternalWrkExpOP.iShouldSeeTheTable("fe::table::internalWorkExperienceSkills::LineItem-innerTable","Skills (1)");
                Then.onInternalWrkExpOP.onTable({ property: "internalWorkExperienceSkills" })
                    .iCheckColumns(2, {
                        "Skill": { headerVisible: true },
                        "Proficiency Level": { headerVisible: true }
                    }).and.iCheckRows(1);
            });

            opaTest('On object page I can navigate to previous roles subsection', function (Given, When, Then) {
                // Actions
                When.onInternalWrkExpOP.onHeader().iNavigateByBreadcrumb("Test Usere2e1 (test.usere2e1)");
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'Previous Roles');
                // Assertions
                Then.onTheObjectPage.iShouldSeeTheTable("fe::table::roles::LineItem-innerTable", "Project Roles (2)");
                Then.onTheObjectPage.onTable({ property: "roles" })
                    .iCheckColumns(1, {
                        "Project Role": { headerVisible: true }
                    }).and.iCheckRows(2);
            });

            opaTest('On object page, on click of a role from previous roles subsection, I should see a popover', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onTable({ property: "roles" }).iPressCell({ 0: "Junior Consultant1" }, "Project Role");
                // Assertions
                Then.onTheObjectPage.iShouldSeeTheElementTypeWithProperty('sap.m.Popover', { title: "" });
            });

            opaTest('On object page, For external work experience I should able to see Sort and Add/Remove Columns button and Variant management ', function (Given, When, Then) {
                //Actions
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'External Work Experience');
                //Assertions
                Then.onTheObjectPage.iShouldSeeTheElementTypeWithProperty('sap.m.Button', { text: 'Settings' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Title', { text: 'Standard' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Button', { icon: 'sap-icon://slim-arrow-down' });
            });

            //Add/Remove columns check
            opaTest('On click of Add/Remove Columns icon For external work experience, I should see correct number of columns and data.', function (Given, When, Then) {
                //Actions
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iOpenColumnAdaptation();
                //Assertions
                Then.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iCheckAdaptationColumn("Project Name", { selected: true })
                    .and.iCheckAdaptationColumn("Project Role", { selected: true })
                    .and.iCheckAdaptationColumn("Company", { selected: true })
                    .and.iCheckAdaptationColumn("Customer", { selected: true })
                    .and.iCheckAdaptationColumn("Start Date", { selected: true })
                    .and.iCheckAdaptationColumn("End Date", { selected: true })
                    .and.iCheckAdaptationColumn("Comment", { selected: false })
                    .and.iConfirmColumnAdaptation();
            });

            opaTest('On object page I can navigate to external work experience subsection and then to sub object page', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'External Work Experience');
                // Assertions
                Then.onTheObjectPage.iShouldSeeTheTable("fe::table::externalWorkExperience::LineItem-innerTable", "Assignments (3)");
                Then.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iCheckColumns(6)
                    .and.iCheckColumns(6, {
                        "Project Name": { headerVisible: true },
                        "Project Role": { headerVisible: true },
                        "Company": { headerVisible: true },
                        "Customer": { headerVisible: true },
                        "Start Date": { headerVisible: true },
                        "End Date": { headerVisible: true }
                    })
                    .and.iCheckRows(3);
                // Actions
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iPressRow({ 2: "MAS" });
                // Assertions
                Then.onExternalWrkExpOP.iSeeSectionWithTitle("General Information")
                    .and.iSeeSectionWithTitle("Skills")
                    .and.iSeeSectionWithTitle("Comment")
                    .and.iShouldSeeCorrectLabelsInGeneralInfoSection(["Project Name", "Customer", "Project Role", "Company", "Start Date", "End Date"]);
            });

            opaTest('On external work experience sub object page, I can navigate to skills section', function (Given, When, Then) {
                // Actions
                When.onExternalWrkExpOP.iGoToSection('Skills');
                // Assertions
                Then.onExternalWrkExpOP.iShouldSeeTheTable("Skills (1)");
                Then.onExternalWrkExpOP.onTable({ property: "externalWorkExperienceSkills" }).iCheckRows(1)
                    .and.iCheckColumns(2, {
                        "Skill": { headerVisible: true },
                        "Proficiency Level": { headerVisible: true }
                    });
            });

            opaTest('On external work experience sub object page, I can navigate to comments section', function (Given, When, Then) {
                // Actions
                When.onExternalWrkExpOP.iGoToSection('Comment');
                // Assertions
                Then.onExternalWrkExpOP.iSeeSectionWithTitle('Comment');
                Then.onExternalWrkExpOP.iShouldSeeTheElementTypeWithProperty('sap.m.Label', { text: "Text" });
            });

            opaTest('On external work experience sub object page I can navigate back to object page', function (Given, When, Then) {
                // Actions
                When.onExternalWrkExpOP.onHeader().iNavigateByBreadcrumb("Test Usere2e1 (test.usere2e1)");
                // Assertions
                Then.onTheObjectPage.iSeeThisPage();
            });
        }
    };
    return Journey;
});
