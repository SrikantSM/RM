const roleCode = require('crypto-random-string');
const LaunchpadPage = require('../pages/LaunchpadPage.js');
const ProjectRoleListPage = require('../pages/ProjectRoleListPage.js');
const RoleDetailPage = require('../pages/ProjectRoleDetailPage.js');
const RoleCreatePage = require('../pages/ProjectRoleCreatePage.js');
const CommonPageElements = require('../pages/CommonPageElements.js');
const { TestHelper } = require('../../utils/TestHelper');
const testEnvironment = require('../../utils');
const { testRunId } = require('../data/testRunID.js');

const ROLELANGUAGEEN = 'en';
const ROLELANGUAGEDE = 'de';
const ROLELANGUAGEAE = 'ae';

const roleCode1 = roleCode({ length: 4 });
const roleCode2 = roleCode({ length: 4 });
const roleCode3 = roleCode({ length: 4 });
const roleCode4 = roleCode({ length: 4 });
const roleCodeSpecialchar = `T%${roleCode({ length: 2 })}`;

const roleName1 = `Senior developer ${testRunId}`;
const roleName2 = `role code validations ${testRunId}`;
const roleName3 = `Senior developer edit ${testRunId}`;
const roleName4 = `role code edit ${testRunId}`;
const roleName5 = `Role name DE ${testRunId}`;
const roleNameDup = `Role name duplicate ${testRunId}`;
const roleDesc1 = `test ${testRunId}`;
const roleDesc2 = `testValidations ${testRunId}`;
const roleDesc3 = `test edit ${testRunId}`;

const createdRoleCodes = [
    { code: roleCode1 },
    { code: roleCode2 },
    { code: roleCode3 },
    { code: roleCode4 },
    { code: roleCodeSpecialchar },
];

let projectRoleRepository = null;

describe('test-journey-role', () => {
    const testHelper = new TestHelper();

    async function beforeAllDataCleanUp() {
        await projectRoleRepository.deleteMany(createdRoleCodes);
    }

    beforeAll(async () => {
        console.log('Initializing Data Setup in beforeAll() hook');
        console.log('Initializing the repositories.');
        try {
            projectRoleRepository = await testEnvironment.getProjectRoleRepository();
            console.log('All repositories are initialized.');

            console.log('Initializing precautionary Data Cleanup');
            await beforeAllDataCleanUp();
            console.log('Precautionary Data Cleanup is complete');
            console.log('Initial data setup completed in beforeAll() hook.');
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
    });

    /**
     * Tear-down test data
     */
    afterAll(async () => {
        try {
            console.log('Cleanup task in afterAll() hook started.');
            await projectRoleRepository.deleteManyByData(createdRoleCodes);
            console.log('Cleanup task in afterAll() hook completed.');
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
    });

    testHelper.loginWithRole('ConfigurationExpert');

    testHelper.failEarlyIt('Should navigate to landing page and click Manage Project roles tile', async () => {
        LaunchpadPage.actions.openProjectRolesApp();
        browser.wait(() => ProjectRoleListPage.elements.listReportTable.isPresent(), 600000);
    });

    testHelper.failEarlyIt('should open Role create dialog', () => {
        ProjectRoleListPage.actions.clickOnCreateButton();
        expect(RoleCreatePage.createDialog.dialogControl.isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Create project role with length more than 4 character', async () => {
        RoleCreatePage.createDialog.codeInput.clear().sendKeys('T00SS');
        RoleCreatePage.createDialog.nameInput.sendKeys(roleName1);
        expect(RoleCreatePage.createDialog.codeInput.asControl().getProperty('valueState')).toBe('Error');
        // TODO raise bug
        // expect(RoleCreatePage.createDialog.codeInput.asControl().getProperty('valueStateText')).toBe('Enter a text with a maximum of 4 characters and spaces.');
        RoleCreatePage.createDialog.cancelButton.click();
    });

    testHelper.failEarlyIt('Create project role and click on discard ', async () => {
        await ProjectRoleListPage.actions.clickOnCreateButton();
        RoleCreatePage.createDialog.codeInput.sendKeys(roleCode1);
        RoleCreatePage.createDialog.descriptionInput.sendKeys(roleDesc1);
        RoleCreatePage.createDialog.nameInput.sendKeys(roleName1);
        RoleCreatePage.createDialog.cancelButton.click();
        expect(await ProjectRoleListPage.actions.isRecordPresent(roleCode1)).toBe(false);
    });

    testHelper.failEarlyIt('Create project role, save and check the details in object and list report pages', async () => {
        await ProjectRoleListPage.actions.clickOnCreateButton();
        await RoleCreatePage.createDialog.codeInput.sendKeys(roleCode1);
        await RoleCreatePage.createDialog.nameInput.sendKeys(roleName1);
        await RoleCreatePage.createDialog.descriptionInput.sendKeys(roleDesc1);
        await RoleCreatePage.createDialog.createButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButtonRole.click();
        // Check role details in object page header
        expect(await RoleDetailPage.roleHeaderData.elements.headerTitle(roleName1).isPresent()).toBe(true);
        expect(await RoleDetailPage.roleHeaderData.elements.usageLabel.isPresent()).toBe(true);
        expect(await RoleDetailPage.actions.getRoleLifecycleStatus('Unrestricted').isPresent()).toBe(true);
        // Check role details in object page Facets
        expect(await RoleDetailPage.roleData.elements.codeLabel.isPresent()).toBe(true);
        expect(await RoleDetailPage.actions.getCodeinRead(roleCode1).isPresent()).toBe(true);
        const RoleTitleText = await RoleDetailPage.role.tableTitle.getText();
        expect(RoleTitleText.substring(0, 10)).toBe('Role Names');
        expect(RoleTitleText.substring(11)).toBe('(1)');
        expect(await RoleDetailPage.roleData.elements.nameLabel.isPresent()).toBe(true);
        expect(await RoleDetailPage.role.name(roleName1).isPresent()).toBe(true);
        expect(await RoleDetailPage.role.locale('en').isPresent()).toBe(true);
        expect(await RoleDetailPage.roleData.elements.descriptionLabel.isPresent()).toBe(true);
        expect(await RoleDetailPage.role.description(roleDesc1).isPresent()).toBe(true);
        // Default language deletion validation
        CommonPageElements.objectPage.elements.editButton.click();
        await RoleDetailPage.roleHeader.roleNamesButton.click();
        await RoleDetailPage.actions.deleteEntry(roleName1);
        await CommonPageElements.objectPage.elements.footer.saveButtonRole.click();
        await CommonPageElements.objectPage.elements.backButton.click();
        expect(await CommonPageElements.objectPage.elements.errorDialogMessageText('Enter a name in the default language (en).').isPresent()).toBe(true);
        await CommonPageElements.objectPage.elements.errorDialogCloseButton.click();
        await RoleDetailPage.role.objPageCancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
        // Check role details in list report page
        await CommonPageElements.objectPage.elements.backButton.click();
        expect(await ProjectRoleListPage.actions.getRoleLifecycleStatus(roleCode1, 'Unrestricted')).toBe(true);
        expect(await ProjectRoleListPage.actions.getRoleName(roleName1, roleCode1)).toBe(true);
        expect(await ProjectRoleListPage.actions.getRoleDesc(roleDesc1, roleCode1)).toBe(true);
    });

    testHelper.failEarlyIt('Navigate to Project role and restrict the role', async () => {
        // Check role lifecycle code on list report before performing the action
        expect(await ProjectRoleListPage.actions.getRoleLifecycleStatus(roleCode1, 'Restricted')).toBe(false);
        await ProjectRoleListPage.actions.navigateToRole(roleCode1);
        browser.wait(() => RoleDetailPage.roleHeader.title.isPresent(), 600000);
        CommonPageElements.objectPage.elements.restrictButton.click();
        CommonPageElements.objectPage.elements.messageDialog.okButton.click();
        expect(CommonPageElements.objectPage.elements.restrictButton.isPresent()).toBeFalsy();
        // Check role lifecycle code in detail page
        expect(await RoleDetailPage.actions.getRoleLifecycleStatus('Restricted').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.backButton.click();
        // Check role lifecycle code on list report after action is performed
        expect(await ProjectRoleListPage.actions.getRoleLifecycleStatus(roleCode1, 'Restricted')).toBe(true);
    });

    testHelper.failEarlyIt('Remove restriction for the role', async () => {
        // Check role lifecycle code on list report before performing the action
        expect(await ProjectRoleListPage.actions.getRoleLifecycleStatus(roleCode1, 'Unrestricted')).toBe(false);
        await ProjectRoleListPage.actions.navigateToRole(roleCode1);
        browser.wait(() => RoleDetailPage.roleHeader.title.isPresent(), 600000);
        CommonPageElements.objectPage.elements.removeRestrictionButton.click();
        CommonPageElements.objectPage.elements.messageDialog.okButton.click();
        expect(CommonPageElements.objectPage.elements.restrictButton.isPresent()).toBeTruthy();
        // Check role lifecycle code in detail page
        expect(await RoleDetailPage.actions.getRoleLifecycleStatus('Unrestricted').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.backButton.click();
        // Check role lifecycle code on list report after action is performed
        expect(await ProjectRoleListPage.actions.getRoleLifecycleStatus(roleCode1, 'Unrestricted')).toBe(true);
    });

    testHelper.failEarlyIt('Validation: role code should be unique', async () => {
        await ProjectRoleListPage.actions.clickOnCreateButton();
        await RoleCreatePage.createDialog.descriptionInput.sendKeys(roleDesc2);
        await RoleCreatePage.createDialog.nameInput.sendKeys(roleName2);
        await RoleCreatePage.createDialog.codeInput.sendKeys(roleCode1);
        await RoleCreatePage.createDialog.createButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButtonRole.click();
        expect(await RoleDetailPage.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('1');
        expect(await RoleDetailPage.actions.getMessageErrorLink('Enter a unique code.').isPresent()).toBeTruthy();
        CommonPageElements.objectPage.elements.footer.messageButton.click();
        CommonPageElements.objectPage.elements.backButton.click();
        CommonPageElements.objectPage.elements.messageDialog.keepDraftLabel.click();
        CommonPageElements.objectPage.elements.messageDialog.okButton.click();
        // Issue: https://support.wdf.sap.corp/sap/support/message/2280035484
        // expect(await ProjectRoleListPage.actions.getRecordState(roleDesc2)).toEqual('Draft');
    });

    testHelper.failEarlyIt('Validation: Default language code EN is mandatory', async () => {
        await ProjectRoleListPage.actions.navigateToRoleWithDescription(roleDesc2);
        browser.wait(() => RoleDetailPage.roleHeader.title.isPresent(), 600000);
        await RoleDetailPage.actions.editRowValue(roleName2, '', ROLELANGUAGEDE, '');
        await RoleDetailPage.actions.editCodeValue(roleCode2);
        await CommonPageElements.objectPage.elements.footer.saveButtonRole.click();
        expect(await RoleDetailPage.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('1');
        expect(await RoleDetailPage.actions.getMessageErrorLink('Enter a name in the default language (en).').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.messageButton.click();
        await RoleDetailPage.actions.editRowValue(roleName2, '', ROLELANGUAGEEN, '');
    });

    testHelper.failEarlyIt('Validations: Role code should not have any special char and language should not have non existing code', async () => {
        await RoleDetailPage.role.create.click();
        await RoleDetailPage.actions.editRowValue('', roleName5, ROLELANGUAGEAE, '');
        await RoleDetailPage.actions.editCodeValue(roleCodeSpecialchar);
        await CommonPageElements.objectPage.elements.footer.saveButtonRole.click();
        expect(await RoleDetailPage.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('2');
        expect(await RoleDetailPage.actions.getMessageErrorList('Language code "ae" does not exist.').isPresent()).toBeTruthy();
        expect(await RoleDetailPage.actions.getMessageErrorList('Enter a valid code.').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.messageButton.click();
    });

    testHelper.failEarlyIt('Should add additional role name in a different language', async () => {
        await RoleDetailPage.roleHeader.roleNamesButton.click();
        await RoleDetailPage.actions.editRowValue(roleName5, '', ROLELANGUAGEDE, '');
        await RoleDetailPage.actions.editCodeValue(roleCode2);
        await CommonPageElements.objectPage.elements.footer.saveButtonRole.click();
        expect(await RoleDetailPage.role.name(roleName5).isPresent()).toBeTruthy();
        expect(await RoleDetailPage.role.locale(ROLELANGUAGEDE).isPresent()).toBeTruthy();
        expect(await RoleDetailPage.role.description('').isPresent()).toBeTruthy();
        const RoleTitleText = await RoleDetailPage.role.tableTitle.getText();
        expect(RoleTitleText.substring(0, 10)).toBe('Role Names');
        const regexp = new RegExp('([2-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(11))).toBeTruthy();
    });

    testHelper.failEarlyIt('Validation: Assign duplicate language code', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        await RoleDetailPage.roleHeader.roleNamesButton.click();
        await RoleDetailPage.actions.editRowValue(roleName5, roleNameDup, ROLELANGUAGEEN, '');
        await RoleDetailPage.roleHeader.generalInfoButton.click();
        await RoleDetailPage.actions.editCodeValue(roleCode2);
        await CommonPageElements.objectPage.elements.footer.saveButtonRole.click();
        expect(await RoleDetailPage.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('2');
        expect(await RoleDetailPage.actions.getMessageErrorList('This role must have exactly one name in the language "en".').isPresent()).toBeTruthy();
        CommonPageElements.objectPage.elements.footer.messageButton.click();
    });

    testHelper.failEarlyIt('Validation: role name should not be a string just of empty spaces', async () => {
        await RoleDetailPage.actions.editNameValue(roleName2, ' ');

        await RoleDetailPage.roleHeader.generalInfoButton.click();
        await RoleDetailPage.actions.editCodeValue(roleCode2);
        await CommonPageElements.objectPage.elements.footer.saveButtonRole.click();
        expect(await RoleDetailPage.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('3');
        expect(await RoleDetailPage.actions.getMessageErrorList('Enter a valid name.').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.messageButton.click();
        await CommonPageElements.objectPage.elements.backButton.click();
        CommonPageElements.objectPage.elements.messageDialog.keepDraftLabel.click();
        CommonPageElements.objectPage.elements.messageDialog.okButton.click();
        // Issue: https://support.wdf.sap.corp/sap/support/message/2280035484
        // expect(await ProjectRoleListPage.actions.getRecordStateWithCode(roleCode2)).toEqual('Draft');
    });

    testHelper.failEarlyIt('Search the list page with the name', async () => {
        await ProjectRoleListPage.actions.clickOnExpandButton();
        await ProjectRoleListPage.filterElemenents.searchInput.sendKeys(roleName1);
        await ProjectRoleListPage.filterElemenents.searchPress.click();
        const filteredRecords = await ProjectRoleListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBeGreaterThan(0);
        expect(ProjectRoleListPage.actions.getRoleName(roleName1, roleCode1)).toBe(true);
        await ProjectRoleListPage.filterElemenents.searchInput.clear();
        await ProjectRoleListPage.filterElemenents.goButton.click();
    });

    testHelper.failEarlyIt('Filter the list page with code', async () => {
        await ProjectRoleListPage.actions.clickOnExpandButton();
        await ProjectRoleListPage.filterElemenents.roleCode.sendKeys(roleCode1);
        await ProjectRoleListPage.filterElemenents.goButton.click();
        const filteredRecords = await ProjectRoleListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBeGreaterThan(0);
        expect(ProjectRoleListPage.actions.getRoleName(roleName1, roleCode1)).toBe(true);
        await ProjectRoleListPage.filterElemenents.roleCode.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await ProjectRoleListPage.filterElemenents.roleCode.sendKeys(protractor.Key.BACK_SPACE);
        await ProjectRoleListPage.filterElemenents.goButton.click();
    });

    testHelper.failEarlyIt('Filter the list page with code by selecting code from value help', async () => {
        await ProjectRoleListPage.filterElemenents.roleCodeValueHelp.click();
        await ProjectRoleListPage.filterElemenents.codeVHSearchInput.sendKeys(roleCode1);
        await ProjectRoleListPage.filterElemenents.codeVHSearchPress.click();
        await ProjectRoleListPage.actions.selectCodeFromValueHelp(roleCode1);
        await ProjectRoleListPage.filterElemenents.valueHelpOkbutton.click();
        await ProjectRoleListPage.filterElemenents.goButton.click();
        const filteredRecords = await ProjectRoleListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBeGreaterThan(0);
        expect(ProjectRoleListPage.actions.getRoleName(roleName1, roleCode1)).toBe(true);
        await ProjectRoleListPage.filterElemenents.roleCode.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await ProjectRoleListPage.filterElemenents.roleCode.sendKeys(protractor.Key.BACK_SPACE);
        await ProjectRoleListPage.filterElemenents.goButton.click();
    });

    testHelper.failEarlyIt('Filter the list page with edit status', async () => {
        const numberOfRecords = await ProjectRoleListPage.listReport.elements.tableRows.count();
        await ProjectRoleListPage.actions.setEditStatusFilter('Own Draft');
        await ProjectRoleListPage.filterElemenents.goButton.click();
        const filteredRecords = await ProjectRoleListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBeGreaterThan(0);
        expect(filteredRecords).toBeLessThan(numberOfRecords);
        await ProjectRoleListPage.actions.navigateToRole(roleCode2);
        expect(await RoleDetailPage.actions.getCode(roleCode2).isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.backButton.click();
        await ProjectRoleListPage.actions.setEditStatusFilter('All');
        await ProjectRoleListPage.filterElemenents.goButton.click();
    });

    testHelper.failEarlyIt('Edit project role details and click on discard ', async () => {
        await ProjectRoleListPage.actions.navigateToRole(roleCode1);
        browser.wait(() => RoleDetailPage.roleHeader.title.isPresent(), 600000);
        CommonPageElements.objectPage.elements.editButton.click();
        await RoleDetailPage.actions.editCodeValue(roleCode4);
        await RoleDetailPage.actions.editRowValue(roleName1, roleName3, '', roleDesc3);
        await RoleDetailPage.role.objPageCancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
        expect(await RoleDetailPage.role.name(roleName1).isPresent()).toBeTruthy();
        expect(await RoleDetailPage.actions.getCodeinRead(roleCode1).isPresent()).toBeTruthy();
        expect(await RoleDetailPage.role.description(roleDesc1).isPresent()).toBeTruthy();
        CommonPageElements.objectPage.elements.backButton.click();
    });

    testHelper.failEarlyIt('Edit project role details and click on save ', async () => {
        await ProjectRoleListPage.actions.navigateToRole(roleCode1);
        browser.wait(() => RoleDetailPage.roleHeader.title.isPresent(), 600000);
        CommonPageElements.objectPage.elements.editButton.click();
        await RoleDetailPage.actions.editRowValue(roleName1, roleName3, '', roleDesc3);
        await RoleDetailPage.actions.editCodeValue(roleCode4);
        await CommonPageElements.objectPage.elements.footer.saveButtonRole.click();
        expect(await RoleDetailPage.role.name(roleName3).isPresent()).toBeTruthy();
        expect(await RoleDetailPage.actions.getCodeinRead(roleCode4).isPresent()).toBeTruthy();
        expect(await RoleDetailPage.role.description(roleDesc3).isPresent()).toBeTruthy();
        CommonPageElements.objectPage.elements.backButton.click();
        expect(await ProjectRoleListPage.actions.isDraftRecord(roleDesc3)).toBe(false);
    });

    testHelper.failEarlyIt('Validation: Should delete entry', async () => {
        await ProjectRoleListPage.actions.navigateToRole(roleCode2);
        await RoleDetailPage.actions.deleteEntry(' ');
        await CommonPageElements.objectPage.elements.footer.saveButtonRole.click();
        expect(RoleDetailPage.role.name(' ').isPresent()).toBe(false);
    });

    testHelper.failEarlyIt('Edit project role and click on save ', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        await RoleDetailPage.actions.editRowValue('', roleName4, '', roleDesc3);
        await RoleDetailPage.actions.editCodeValue(roleCode3);
        await CommonPageElements.objectPage.elements.footer.saveButtonRole.click();
        expect(await RoleDetailPage.role.name(roleName4).isPresent()).toBeTruthy();
        expect(await RoleDetailPage.actions.getCodeinRead(roleCode3).isPresent()).toBeTruthy();
        expect(await RoleDetailPage.role.description(roleDesc3).isPresent()).toBeTruthy();
        CommonPageElements.objectPage.elements.backButton.click();
        expect(await ProjectRoleListPage.actions.isDraftRecord(roleDesc2)).toBe(false);
    });

    testHelper.logout();
});
