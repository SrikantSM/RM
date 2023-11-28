const processResourceRequestListReport = require('./locators/processResourceRequestListReport.js');
const processResourceRequestObjectPage = require('./locators/processResourceRequestObjectPage.js');

// eslint-disable-next-line no-undef
module.exports = createPageObjects({
    ProcessResourceRequest: {
        arrangements: {
            iStartTheApp: function () {
                // app setup
            }
        },
        actions: {
            iShouldVerifyManagerFields: function(sControlType, sText){
                element(by.control({
                    controlType: sControlType,
                    properties: {
                        text: sText
                    },
                    searchOpenDialogs: true
                }));
            },
            iClickonFilterExpandButton: function () {
                processResourceRequestListReport.filterBarExpandButton.click();
            },
            iClickTheTableToolBar: function() {
                processResourceRequestListReport.tableToolBar.click();
            },
            iSearchForProject: function (projectName) {
                processResourceRequestListReport.projectFilterInput.sendKeys(
                    projectName
                );
                processResourceRequestListReport.projectFilterInput.sendKeys(
                    protractor.Key.ENTER
                );
                processResourceRequestListReport.goButton.click();
            },
            iSearchForRequestId:function(requestId){
                processResourceRequestListReport.requestId.sendKeys(
                    requestId
                );
                processResourceRequestListReport.requestId.sendKeys(
                    protractor.Key.ENTER
                );
                processResourceRequestListReport.goButton.click();
            },
            iSearchForRequestName:function(requestName){
                processResourceRequestListReport.requestName.sendKeys(
                    requestName
                );
                processResourceRequestListReport.goButton.click();
            },
            iClickOnExportArrowDownButton:function(){
                processResourceRequestListReport.exportArrowDownButton.click();
            },
            iClickOnGenInfoSection:function(){
                processResourceRequestObjectPage.Display.generalInformationSection.click();
            },
            iClickOnCollapseHeader:function(){
                processResourceRequestObjectPage.Display.collapseHeader.click();
            },
            iEnterMultipleProjectsInSearchField:function(projectNameArray){
                processResourceRequestListReport.projectFilterInputIcon.click();
                projectNameArray.forEach(function(projectName) {
                    processResourceRequestListReport.projectFilterValuHelpGeneralSearch.sendKeys(
                        protractor.Key.chord(protractor.Key.CONTROL, "a")
                    );
                    processResourceRequestListReport.projectFilterValuHelpGeneralSearch.sendKeys(
                        protractor.Key.BACK_SPACE
                    );
                    processResourceRequestListReport.projectFilterValuHelpGeneralSearch.sendKeys(
                        projectName
                    );
                    processResourceRequestListReport.projectFilterValuHelpGeneralSearch.sendKeys(
                        protractor.Key.ENTER
                    );
                    processResourceRequestListReport.plainText(projectName).click();
                });
                processResourceRequestListReport.projectFilterOkButton.click();
            },
            iEnterMultipleProjectRolesInSearchField:function(roleNameArray){
                processResourceRequestListReport.projectRoleFilterInputIcon.click();
                roleNameArray.forEach(function(roleName) {
                    processResourceRequestListReport.projectRoleFilterValuHelpGeneralSearch.sendKeys(
                        protractor.Key.chord(protractor.Key.CONTROL, "a")
                    );
                    processResourceRequestListReport.projectRoleFilterValuHelpGeneralSearch.sendKeys(
                        protractor.Key.BACK_SPACE
                    );
                    processResourceRequestListReport.projectRoleFilterValuHelpGeneralSearch.sendKeys(
                        roleName
                    );
                    processResourceRequestListReport.projectRoleFilterValuHelpGeneralSearch.sendKeys(
                        protractor.Key.ENTER
                    );
                    processResourceRequestListReport.plainText(roleName).click();
                });
                processResourceRequestListReport.projectRoleFilterOkButton.click();
            },

            // Method for searching multiple request names

            iEnterMultipleRequestNamesInSearchField:function(requestNameArray){
                processResourceRequestListReport.requestNameFilterField.click();
                processResourceRequestListReport.requestNameFilterField.sendKeys(
                    protractor.Key.chord(protractor.Key.CONTROL, "a")
                );
                processResourceRequestListReport.requestNameFilterField.sendKeys(
                    protractor.Key.BACK_SPACE
                );
                requestNameArray.forEach(function(requestName) {

                    processResourceRequestListReport.requestNameFilterField.sendKeys(
                        requestName
                    );
                    processResourceRequestListReport.requestNameFilterField.sendKeys(
                        protractor.Key.ENTER
                    );
                });

            },

            iEnterMultipleRequestStatusInSearchField:function(statusArray){
                statusArray.forEach(function(status) {
                    processResourceRequestListReport.statusFilterInput.sendKeys(
                        status
                    );
                    processResourceRequestListReport.statusFilterInput.sendKeys(
                        protractor.Key.chord(protractor.Key.TAB, protractor.Key.SHIFT)
                    );
                    processResourceRequestListReport.priorityFilterInput.sendKeys(
                        protractor.Key.TAB
                    );
                });
            },
            iEnterMultipleStaffingStatusInSearchField:function(statusArray){
                statusArray.forEach(function(status) {
                    processResourceRequestListReport.staffingStatusFilterInput.sendKeys(
                        status
                    );
                    processResourceRequestListReport.statusFilterInput.sendKeys(
                        protractor.Key.TAB
                    );
                    processResourceRequestListReport.priorityFilterInput.sendKeys(
                        protractor.Key.chord(protractor.Key.TAB, protractor.Key.SHIFT)
                    );
                });
            },
            iRemoveProjectFilters: function () {
                processResourceRequestListReport.projectFilterInput.click();
                processResourceRequestListReport.projectFilterDeleteIcons.then(function (icons) {
                    icons.forEach(icon => icon.click());
                });
            },
            iClickTheFirstRow: function () {
                processResourceRequestListReport.visibleRowsInTable.get(0).click();
            },
            iResolveTheResourceRequest: function () {
                processResourceRequestObjectPage.Display.ResolveButton.click();
            },

            iEnterMyResponsibilityForTheResourceRequest: function(resourceManager,processor){
                // click the set my responsibility button on header
                processResourceRequestObjectPage.Display.SetMyResponsibilityButton.click();

                //select processor
                processResourceRequestObjectPage.Display.SetMyResponsibilityDialog.AsProcessorDropDown.click();
                processResourceRequestObjectPage.Display.SetMyResponsibilityDialog.asProcessorMdcFieldWithinDialog(processor).click();

                // Select Resource Manager
                processResourceRequestObjectPage.Display.SetMyResponsibilityDialog.AsResourceManagerDropDown.click();
                processResourceRequestObjectPage.Display.SetMyResponsibilityDialog.asResourceManagerMdcFieldWithinDialog(resourceManager).click();
            },

            iSetMyResponsibilityForTheResourceRequest:function(resourceManager,processor){
                // click the set my responsibility button on header
                processResourceRequestObjectPage.Display.SetMyResponsibilityButton.click();

                //select processor
                processResourceRequestObjectPage.Display.SetMyResponsibilityDialog.AsProcessorDropDown.click();
                processResourceRequestObjectPage.Display.SetMyResponsibilityDialog.asProcessorMdcFieldWithinDialog(processor).click();

                // Select Resource Manager
                processResourceRequestObjectPage.Display.SetMyResponsibilityDialog.AsResourceManagerDropDown.click();
                processResourceRequestObjectPage.Display.SetMyResponsibilityDialog.asResourceManagerMdcFieldWithinDialog(resourceManager).click();

                // click dialog-SetMyResponsibillity button
                processResourceRequestObjectPage.Display.SetMyResponsibilityDialog.SetMyResponsibillityButtonWithinDialog.click();
            },

            iClickTheForwardButton: function () {
                // click the forward button on header
                processResourceRequestObjectPage.Display.ForwardButton.click();
            },

            iForwardToDifferentResourceOrg: function (resourceOrgCode) {
                // select Cost Center
                processResourceRequestObjectPage.Display.ForwardDialog.ProcessingResourceOrgValueHelp.click();
                processResourceRequestObjectPage.Display.ForwardDialog.ProcessingResourceOrgSearchField.sendKeys(resourceOrgCode);
                processResourceRequestObjectPage.Display.ForwardDialog.ProcessingResourceOrgSearchField.sendKeys(protractor.Key.ENTER);
                processResourceRequestObjectPage.Display.ForwardDialog.processingResourceOrgColumnListItem(resourceOrgCode).click();
                // processResourceRequestObjectPage.Display.ForwardDialog.ProcessingResourceOrgValueHelpOkButton.click(); // OK button removed from fe in UI5 1.105.1
            },

            //resource manager and processor fields removed from Forward dialog box
            // iForwardToDifferentResourceManager: function (resourceManagerValue) {
            //   //select resource manager
            //   processResourceRequestObjectPage.Display.ForwardDialog.ResourceManagerValueHelp.click();
            //   processResourceRequestObjectPage.Display.ForwardDialog.ResourceManagerColumnListItem(resourceManagerValue).click();
            //   processResourceRequestObjectPage.Display.ForwardDialog.ResourceManagerValueHelpOkButton.click();
            // },

            // iForwardToDifferentProcessor: function (processorValue) {
            //   //select the processor
            //   processResourceRequestObjectPage.Display.ForwardDialog.ProcessorValueHelp.click();
            //   processResourceRequestObjectPage.Display.ForwardDialog.ProcessorColumnListItem(processorValue).click();
            //   processResourceRequestObjectPage.Display.ForwardDialog.ProcessorValueHelpOkButton.click();
            // },

            iClickOnForwardButtonWithinDialog: function () {
                //click on forward dialog button
                processResourceRequestObjectPage.Display.ForwardDialog.ForwardButtonWithinDialog.click();
            },
            iClickOnMatchingResourcesAnchorButton:async  function(){
                //click on the matching resource anchor bar
                processResourceRequestObjectPage.Display.matchingResourcesSection.click();
            },
            iClickOnNameinMatchingResouces: async function(resourceName){
                await processResourceRequestObjectPage.Display.MatchingResources.resourceNameinTable(resourceName).click();
            },
            iClickOnNameinMatchingResoucesContactCard: async function(resourceName){
                await processResourceRequestObjectPage.Display.MatchingResources.resourceNameinContactCard(resourceName).click();
            },
            iResetProjectFilter: function(){
                processResourceRequestListReport.projectFilterInputIcon.click();
                processResourceRequestListReport.projectFilterValuHelpClearButton.click();
                processResourceRequestListReport.projectFilterOkButton.click();
            },
            iResetProjectRoleFilter: function(){
                processResourceRequestListReport.projectRoleFilterInputIcon.click();
                processResourceRequestListReport.projectRoleFilterValuHelpClearButton.click();
                processResourceRequestListReport.projectRoleFilterOkButton.click();
            },

            iResetRequestNameFilter: function(){
                processResourceRequestListReport.requestNameFilterField.click();
                processResourceRequestListReport.requestNameFilterField.sendKeys(
                    protractor.Key.chord(protractor.Key.CONTROL, "a")
                );
                processResourceRequestListReport.requestNameFilterField.sendKeys(
                    protractor.Key.BACK_SPACE
                );
            },

            iUnselectRequestStatus: function (sStatus){
                processResourceRequestListReport.statusFilterDropDown.click();
                processResourceRequestListReport.statusFilterCheckBox(sStatus,sStatus === "Open" ? 0 : 1).click();
            },
            iUnselectStaffingStatus: function (sStatus,iBindingPropertyIndex){
                processResourceRequestListReport.staffingStatusFilterDropDown.click();
                processResourceRequestListReport.staffingStatusFilterCheckBox(sStatus,iBindingPropertyIndex).click();
            }
        },
        assertions: {
            theListReportTableShouldBePresent: function () {
                expect(
                    processResourceRequestListReport.resourceRequestTable.isPresent()
                ).toBeTruthy();
            },
            theObjectPageShouldBePresent: async function () {
                await expect(
                    processResourceRequestObjectPage.Display.Header.objectPageHeaderTitle.isPresent()
                ).toBeTruthy();
            },
            theTableIsEmpty: async function () {
                await processResourceRequestListReport.visibleRowsInTable.then(function (rows) {
                    expect(rows.length).toBe(0);
                });
            },
            theTableCountIs: async function (count) {
                await processResourceRequestListReport.visibleRowsInTable.then(function (rows) {
                    expect(rows.length).toBe(count);
                });
            },
            theMatchingCandidateTableIsNotEmpty:async function () {
                await processResourceRequestObjectPage.Display.MatchingResources.visibleRowsInTable.then(function (rows) {
                    expect(rows.length).toBeGreaterThan(0);
                });
            },
            iValidateTheMatchingCandidate: async function (rowNumber,matchingResourceDetails) {
                console.log('inside iValidateTheMatchingCandidate');

                //get the Nth row full name column
                expect(processResourceRequestObjectPage.Display.MatchingResources.MatchingResourcesTableColumnFirstRowName.get(rowNumber).getText()).toBe(matchingResourceDetails.name);

                //get the Nth row skill match column
                expect(processResourceRequestObjectPage.Display.MatchingResources.MatchingResourcesTableColumnSkillMatch.get(rowNumber).getText()).toBe(matchingResourceDetails.skillMatch);

                //get the Nth row availablity match column
                expect(processResourceRequestObjectPage.Display.MatchingResources.MatchingResourcesColumnAvailabilityMatch.get(rowNumber).getText()).toBe(matchingResourceDetails.availabilityMatch);

                //get the Nth row total match column
                expect(processResourceRequestObjectPage.Display.MatchingResources.MatchingResourcesColumnTotalMatch.get(rowNumber).getText()).toBe(matchingResourceDetails.totalMatch);
            },
            iShouldSeeTheSetResponsibilityValues:function(resourceManagerValue,processorValue){

                // RM value should be updated
                expect(
                    processResourceRequestObjectPage.Display.GeneralInformation.resourceManagerLink(resourceManagerValue).isPresent()
                ).toBeTruthy();
                // Processor value should be updated
                expect(
                    processResourceRequestObjectPage.Display.GeneralInformation.processorLink(processorValue).isPresent()
                ).toBeTruthy();
            },

            // // RM value should be updated
            // if (resourceManagerValue) {
            //   expect(
            //     processResourceRequestObjectPage.Display.GeneralInformation.resourceManagerLink(resourceManagerValue).isPresent()
            //   ).toBeTruthy();
            // }

            // Processor value should be updated
            // if (processorValue) {
            //   expect(
            //     processResourceRequestObjectPage.Display.GeneralInformation.processorLink(processorValue).isPresent()
            //   ).toBeTruthy();
            // }

            iShouldSeeTheForwardedValues: function (resOrgDesc) {
                //,resourceManagerValue,processorValue){
                // CostCenter should be updated
                if (resOrgDesc) {
                    expect(
                        processResourceRequestObjectPage.Display.GeneralInformation.processingResourceOrgValue(resOrgDesc).isPresent()
                    ).toBeTruthy();
                }

            }
        }
    }
});
