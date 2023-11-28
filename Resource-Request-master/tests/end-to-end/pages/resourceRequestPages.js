const resourceRequestListReport = require('./locators/resourceRequestListReport.js');
const resourceRequestObjectPage = require('./locators/resourceRequestObjectPage.js');
// var moment = require('moment');
// eslint-disable-next-line no-undef
module.exports = createPageObjects({
    ResourceRequest: {
        arrangements: {
            iStartTheApp: function() {
                // app setup
            }
        },
        actions: {
            iClickTheCreateButton: function() {
                resourceRequestListReport.createButton.click();
            },
            iClickTheTableToolBar: function() {
                resourceRequestListReport.tableToolBar.click();
            },
            iClickonFilterExpandButton: function () {
                resourceRequestListReport.filterBarExpandButton.click();
            },
            iSearchForRequestId:function(requestId){
                resourceRequestListReport.requestId.sendKeys(
                    requestId
                );
                resourceRequestListReport.requestId.sendKeys(
                    protractor.Key.ENTER
                );
                resourceRequestListReport.goButton.click();
            },
            iSearchForRequestName:function(requestName){
                resourceRequestListReport.requestName.sendKeys(
                    requestName
                );
                resourceRequestListReport.goButton.click();
            },
            iSearchForProject:function(projectName){
                resourceRequestListReport.projectFilterInput.sendKeys(
                    projectName
                );
                resourceRequestListReport.checkboxInFirstRowProject.click();
                resourceRequestListReport.goButton.click();
            },
            iClickOnCheckboxOfFirstLineItem:function(){
                resourceRequestListReport.checkboxInFirstRow.click();
            },
            iSearchForProjectRole:function(projectRoleName){
                resourceRequestListReport.projectRoleFilterInput.sendKeys(
                    projectRoleName
                );
                resourceRequestListReport.projectRoleFilterInput.sendKeys(
                    protractor.Key.ENTER
                );
                resourceRequestListReport.goButton.click();
            },
            iEnterMultipleProjectRolesInSearchField:function(roleNameArray){
                resourceRequestListReport.projectRoleFilterInputIcon.click();
                roleNameArray.forEach(function(roleName) {
                    resourceRequestListReport.projectRoleFilterValuHelpGeneralSearch.sendKeys(
                        protractor.Key.chord(protractor.Key.CONTROL, "a")
                    );
                    resourceRequestListReport.projectRoleFilterValuHelpGeneralSearch.sendKeys(
                        protractor.Key.BACK_SPACE
                    );
                    resourceRequestListReport.projectRoleFilterValuHelpGeneralSearch.sendKeys(
                        roleName
                    );
                    resourceRequestListReport.projectRoleFilterValuHelpGeneralSearch.sendKeys(
                        protractor.Key.ENTER
                    );
                    resourceRequestListReport.plainText(roleName).click();
                });
                resourceRequestListReport.projectRoleFilterOkButton.click();
            },
            // Method for searching multiple request names

            iEnterMultipleRequestNamesInSearchField:function(requestNameArray){
                resourceRequestListReport.requestNameFilterField.click();
                resourceRequestListReport.requestNameFilterField.sendKeys(
                    protractor.Key.chord(protractor.Key.CONTROL, "a")
                );
                resourceRequestListReport.requestNameFilterField.sendKeys(
                    protractor.Key.BACK_SPACE
                );
                requestNameArray.forEach(function(requestName) {

                    resourceRequestListReport.requestNameFilterField.sendKeys(
                        requestName
                    );
                    resourceRequestListReport.requestNameFilterField.sendKeys(
                        protractor.Key.ENTER
                    );
                });

            },
            iEnterMultipleStaffStatus:function(staffStatusArray){
                staffStatusArray.forEach(function(status) {
                    resourceRequestListReport.staffStatusFilterInput.sendKeys(
                        status
                    );
                    resourceRequestListReport.staffStatusFilterInput.sendKeys(
                        protractor.Key.TAB
                    );
                    resourceRequestListReport.priorityCodeFilterInput.sendKeys(
                        protractor.Key.chord(protractor.Key.TAB, protractor.Key.ALT)
                    );
                });
            },
            iSearchForEditingStatusUnchanged:function(){
                resourceRequestListReport.editingStatusSelectButton.click();
                resourceRequestListReport.editingStatusUnchanged.click();
                resourceRequestListReport.goButton.click();
            },
            iSearchForEditingStatusAll:function(){
                resourceRequestListReport.editingStatusSelectButton.click();
                resourceRequestListReport.editingStatusAll.click();
                resourceRequestListReport.goButton.click();
            },
            iSearchForUnpublishedResourceRequests: function() {
                //resourceRequestListReport.releaseStatusFilterInput.clear();
                resourceRequestListReport.releaseStatusFilterInput.sendKeys(
                    'Not Published'
                );
                resourceRequestListReport.releaseStatusFilterInput.sendKeys(
                    protractor.Key.ENTER
                );
                resourceRequestListReport.goButton.click();
            },
            iRemoveProjectFilters:function(){
                resourceRequestListReport.projectFilterInput.click();
                resourceRequestListReport.projectFilterDeleteIcons.then(function(icons) {
                    icons.forEach(icon => icon.click() );
                });
            },
            iRemoveRequestNameFilters:function(){
                resourceRequestListReport.requestName.click();
                resourceRequestListReport.requestNameDeleteIcons.then(function(icons) {
                    icons.forEach(icon => icon.click() );
                });
            },
            iRemoveReleaseStatusFilter:function(){
                resourceRequestListReport.releaseStatusFilterInput.click();
                resourceRequestListReport.releaseStatusIcons.then(function(icons) {
                    icons.forEach(icon => icon.click() );
                });
            },
            iSearchForPublishedResourceRequests:function(){
                resourceRequestListReport.releaseStatusFilterInput.sendKeys(
                    'Published'
                );
                resourceRequestListReport.releaseStatusFilterInput.sendKeys(
                    protractor.Key.ENTER
                );
                resourceRequestListReport.goButton.click();
            },
            iClickTheFirstRow:function(){
                resourceRequestListReport.visibleRowsInTable.get(0).click();
            },
            iClickRow1:function(){
                element(by.control({
                    controlType: "sap.ui.core.Icon",
                    viewName: "sap.fe.templates.ListReport.ListReport",
                    viewId: "manageResourceRequest::ResourceRequestListReport",
                    properties: {
                        src: {
                            regex: {
                                source: "slim\\-arrow\\-right"
                            }
                        }
                    }
                })).click();
            },
            iEnterTheProjectInformationValues: function(projectInformationValues) {
                resourceRequestObjectPage.Edit.ProjectInformation.demandIcon.click();
                resourceRequestObjectPage.Edit.ProjectInformation.demandFilterExpand.click();
                //resourceRequestObjectPage.Edit.allIconsWithinTokens.each((icon,index) => {console.log("allIconsWithinTokens: icon:"+icon+" and index:"+index); icon.click()});
                resourceRequestObjectPage.Edit.ProjectInformation.billingRoleMultiInput.clear();
                resourceRequestObjectPage.Edit.ProjectInformation.billingRoleMultiInput.sendKeys(
                    protractor.Key.BACK_SPACE
                );
                resourceRequestObjectPage.Edit.ProjectInformation.billingRoleMultiInput.sendKeys(
                    protractor.Key.BACK_SPACE
                );
                resourceRequestObjectPage.Edit.ProjectInformation.billingRoleMultiInput.sendKeys(
                    projectInformationValues.billingRole
                );
                resourceRequestObjectPage.Edit.ProjectInformation.workpackageMultiInput.clear();
                resourceRequestObjectPage.Edit.ProjectInformation.workpackageMultiInput.sendKeys(
                    projectInformationValues.workPackage
                );
                resourceRequestObjectPage.Edit.ProjectInformation.projectMultiInput.clear();
                resourceRequestObjectPage.Edit.ProjectInformation.projectMultiInput.sendKeys(
                    projectInformationValues.project
                );
                resourceRequestObjectPage.Edit.valueHelpGoButton.click();
                resourceRequestObjectPage.Edit.valueHelpSelectRowWithText(projectInformationValues.billingRole).click();
                resourceRequestObjectPage.Edit.ProjectInformation.demandDialogOkButton.click();
            },

            iEnterTheResourceRequestDetails: function(resourceRequestDetails) {
                //projectRole
                if (
                    resourceRequestDetails.projectRoleCode &&
          resourceRequestDetails.projectRole
                ) {
                    resourceRequestObjectPage.Edit.AnchorBar.ResourceRequestDetailsAnchorButton.click();
                    resourceRequestObjectPage.Edit.ResourceRequestDetails.projectRoleIcon.click();
                    resourceRequestObjectPage.Edit.ResourceRequestDetails.projectRoleExpandFilter.click();
                    resourceRequestObjectPage.Edit.ResourceRequestDetails.projectRoleCodeMultiInput.clear();
                    resourceRequestObjectPage.Edit.ResourceRequestDetails.projectRoleCodeMultiInput.sendKeys(
                        protractor.Key.BACK_SPACE
                    );
                    resourceRequestObjectPage.Edit.ResourceRequestDetails.projectRoleCodeMultiInput.sendKeys(
                        protractor.Key.BACK_SPACE
                    );
                    resourceRequestObjectPage.Edit.ResourceRequestDetails.projectRoleCodeMultiInput.sendKeys(
                        resourceRequestDetails.projectRoleCode
                    );
                    resourceRequestObjectPage.Edit.ResourceRequestDetails.projectRoleMultiInput.clear();
                    resourceRequestObjectPage.Edit.ResourceRequestDetails.projectRoleMultiInput.sendKeys(
                        resourceRequestDetails.projectRole
                    );
                    resourceRequestObjectPage.Edit.ResourceRequestDetails.projectRoleDialogExtraElementToChangeFocus.click();
                    resourceRequestObjectPage.Edit.valueHelpGoButton.click();
                    resourceRequestObjectPage.Edit.valueHelpSelectRowWithText(resourceRequestDetails.projectRoleCode).click();
                    // resourceRequestObjectPage.Edit.ResourceRequestDetails.projectRoleDialogOkButton.click();
                }

                if (resourceRequestDetails.requestName) {
                    resourceRequestObjectPage.Edit.ResourceRequestDetails.requestName.sendKeys(
                        protractor.Key.chord(protractor.Key.CONTROL, "a")
                    );
                    resourceRequestObjectPage.Edit.ResourceRequestDetails.requestName.sendKeys(
                        protractor.Key.BACK_SPACE
                    );
                    resourceRequestObjectPage.Edit.ResourceRequestDetails.requestName.sendKeys(
                        resourceRequestDetails.requestName
                    );
                }

                if (resourceRequestDetails.comment) {
                    resourceRequestObjectPage.Edit.ResourceRequestDetails.commentTextArea.clear();
                    resourceRequestObjectPage.Edit.ResourceRequestDetails.commentTextArea.sendKeys(
                        resourceRequestDetails.comment
                    );
                }
            },
            iAddAMandatorySkill: async function(skillName, proficiencyLevel) {
                resourceRequestObjectPage.Edit.AnchorBar.SkillRequirementsAnchorButton.click();
                resourceRequestObjectPage.Edit.SkillSection.skillCreateButton.click();
                resourceRequestObjectPage.Edit.SkillSection.skillIcon.click();
                resourceRequestObjectPage.Edit.SkillSection.skillFilterExpand.click();
                resourceRequestObjectPage.Edit.SkillSection.skillNameMultiInput.clear();
                resourceRequestObjectPage.Edit.SkillSection.skillNameMultiInput.sendKeys(
                    skillName
                );
                resourceRequestObjectPage.Edit.SkillSection.skillDialogExtraElementToChangeFocus.click();
                resourceRequestObjectPage.Edit.valueHelpGoButton.click();
                resourceRequestObjectPage.Edit.valueHelpSelectRowWithText(skillName).click();
                // await resourceRequestObjectPage.Edit.SkillSection.skillDialogOkButton.click();
                resourceRequestObjectPage.Edit.SkillSection.skillproficiencyLevelInputs.sendKeys(
                    protractor.Key.F4
                );
                if (proficiencyLevel){
                    resourceRequestObjectPage.Edit.SkillSection.skillproficiencyLevelDropDown(proficiencyLevel).click();
                } else {
                    resourceRequestObjectPage.Edit.SkillSection.skillproficiencyLevelInputs.sendKeys(
                        protractor.Key.ARROW_DOWN
                    );
                }

                resourceRequestObjectPage.Edit.SkillSection.skillproficiencyLevelInputs.sendKeys(
                    protractor.Key.TAB
                );
                resourceRequestObjectPage.Edit.SkillSection.skillImportanceNewInputs.click();
                resourceRequestObjectPage.Edit.SkillSection.skillImportanceSelectInput.click();
            },
            iClickTheSaveButton: function() {
                resourceRequestObjectPage.Edit.AnchorBar.ResourceRequestDetailsAnchorButton.click(); //to de-focus after entering in Input box
                resourceRequestObjectPage.Edit.saveButton.click();
            },
            iClickTheEditButton: function() {
                resourceRequestObjectPage.Edit.editButton.click();
            },
            iUpdateTheResourceRequestDetails: function(resourceRequestDetails){

                //requestPriority
                if (resourceRequestDetails.requestPriority) {
                    //resourceRequestObjectPage.Edit.ResourceRequestDetails.requestPriorityInputInner.clear();
                    resourceRequestObjectPage.Edit.ResourceRequestDetails.requestPriorityInput.sendKeys(
                        resourceRequestDetails.requestPriority
                    );
                    resourceRequestObjectPage.Edit.ResourceRequestDetails.requestPriorityInput.sendKeys(
                        protractor.Key.ENTER
                    );
                }


            },
            iWithdrawTheResourceRequest:function(){
                resourceRequestObjectPage.Display.WithdrawButton.click();
            },
            iPublishTheResourceRequest:function(){
                resourceRequestObjectPage.Display.PublishButton.click();
            },
            iDeleteTheResourceRequest:function(){
                resourceRequestObjectPage.Display.DeleteButton.click();
                resourceRequestObjectPage.Display.DeleteConfirmationButton.click();
            },
            iSelectAllResourceRequestsAndDelete:function(){
                resourceRequestListReport.selectAllCheckBox.click();
                resourceRequestListReport.deleteButton.click();
                resourceRequestListReport.deleteDialogOkButton.click();
            },
            iResetProjectFilter: function(){
                resourceRequestListReport.projectFilterInputIcon.click();
                resourceRequestListReport.projectFilterValuHelpClearButton.click();
                resourceRequestListReport.projectFilterOkButton.click();
            },
            iResetProjectRoleFilter: function(){
                resourceRequestListReport.projectRoleFilterInputIcon.click();
                resourceRequestListReport.projectRoleFilterValuHelpClearButton.click();
                resourceRequestListReport.projectRoleFilterOkButton.click();
            },
            iResetRequestNameFilter: function(){
                resourceRequestListReport.requestNameFilterField.click();
                resourceRequestListReport.requestNameFilterField.sendKeys(
                    protractor.Key.chord(protractor.Key.CONTROL, "a")
                );
                resourceRequestListReport.requestNameFilterField.sendKeys(
                    protractor.Key.BACK_SPACE
                );
            }
        },
        assertions: {
            theEditButtonShouldBePresent: function () {
                expect(element(by.control({
                    id: "manageResourceRequest::ResourceRequestObjectPage--fe::StandardAction::Edit"
                })).asControl().getProperty("visible")).toBeTruthy();
            },
            theListReportTableShouldBePresent: function() {
                expect(
                    resourceRequestListReport.resourceRequestTable.isPresent()
                ).toBeTruthy();
            },
            theObjectPageShouldBePresent: function() {
                expect(
                    resourceRequestObjectPage.Edit.Header.objectPageHeader.isPresent()
                ).toBeTruthy();
            },
            workPackageDetailsAreVisible: function(projectInformationValues) {
                expect(
                    resourceRequestObjectPage.Edit.ProjectInformation.workpackageInputField.asControl().getProperty(
                        'text'
                    )
                ).toBe(projectInformationValues.workPackage);
            },
            projectDetailsAreVisible: function(projectInformationValues) {
                expect(
                    resourceRequestObjectPage.Edit.ProjectInformation.projectInputField.asControl().getProperty(
                        'text'
                    )
                ).toBe(projectInformationValues.project);
            },
            theCreatedResourceRequestIsVisible: function(resourceRequestDetails) {
                expect(
                    resourceRequestObjectPage.Display.Header.objectPageHeaderTitle.asControl().getProperty(
                        'text'
                    )
                ).toBe(resourceRequestDetails.requestName);
            },
            theCreatedResourceRequestIsNotPublished: function() {},
            theResourceRequestValuesAreCorrect: function() {},
            theTableIsEmpty: function(){
                resourceRequestListReport.visibleRowsInTable.then(function(rows) {
                    expect(rows.length).toBe(0);
                });
            },
            theTableCountIs:function(count){
                resourceRequestListReport.visibleRowsInTable.then(function(rows) {
                    expect(rows.length).toBe(count);
                });
            },
            theTableRowsExists: function (count) {
                count = count || 1;
                resourceRequestListReport.visibleRowsInTable.then(function (rows) {
                    expect(rows.length).toBeGreaterThan(count);
                });
            },
            iValidateTheAssignedResources:function(assignedResourceFullName){
                resourceRequestObjectPage.Edit.AnchorBar.AssignmentsAnchorButton.click();
                expect(resourceRequestObjectPage.Display.assignedResourceRowWithName(assignedResourceFullName).isPresent()).toBeTruthy();
            }
        }
    }
});
