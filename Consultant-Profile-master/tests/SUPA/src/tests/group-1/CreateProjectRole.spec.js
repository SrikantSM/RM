const { SupaHelper } = require('../../utils/SupaHelper');
const { CREATE_PROJECT_ROLES, TestHelper } = require('../../utils/TestHelper');

const NUMBER_OF_WARMUPS = parseInt(browser.testrunner.config.params.warmupcycles, 10);
const NUMBER_OF_MEASUREMENTS = parseInt(browser.testrunner.config.params.measurementcycles, 10);
const LaunchpadPage = require('../../../../end-to-end/src/tests/pages/LaunchpadPage');
const CommonPageElements = require('../../../../end-to-end/src/tests/pages/CommonPageElements');
const ProjectRoleListPage = require('../../../../end-to-end/src/tests/pages/ProjectRoleListPage');
const RoleCreatePage = require('../../../../end-to-end/src/tests/pages/ProjectRoleCreatePage');
const RoleDetailPage = require('../../../../end-to-end/src/tests/pages/ProjectRoleDetailPage');
const { cleaner } = require('../../utils');

const { Key } = protractor;

describe('CreateProjectRole', () => {
    const supaHelper = new SupaHelper();

    // Scenario: F4706_Create_Project_Role

    const testHelper = new TestHelper(supaHelper, CREATE_PROJECT_ROLES);
    testHelper.login();
    testHelper.configureSUPA();

    // Run SUPA Warmup test
    for (let i = 0; i < NUMBER_OF_WARMUPS; i++) {
        console.log(`Running warmup cycle no: ${i + 1}`);
        executeCreateProjectRoleTest(undefined, i);
    }

    // Take Measurements
    for (let i = 0; i < NUMBER_OF_MEASUREMENTS; i++) {
        console.log(`Running measurement cycle no: ${i + 1}`);
        executeCreateProjectRoleTest(supaHelper, i + NUMBER_OF_WARMUPS);
    }

    cleanProjectRoles();
    testHelper.logout();
    testHelper.finishAndUpload();
});

function executeCreateProjectRoleTest(supaHelper, iteration) {
    it('Manage Project Roles tile should appear', () => {
        expect(LaunchpadPage.elements.ProjectRoleTile.isPresent()).toBe(true);
    });

    // Start of Measurement

    it('User clicks on the Manage Project Roles App', async () => {
        const item = LaunchpadPage.elements.ProjectRoleTile;
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('010_User clicks on Manage Project Roles app');
            });
        }
        await item.click();
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.sleep(2000);
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User creates role', async () => {
        const roleName = `W${iteration}`;
        await ProjectRoleListPage.actions.clickOnCreateButton();
        expect(await RoleCreatePage.createDialog.dialogControl.isPresent()).toBeTruthy();
        await RoleCreatePage.createDialog.codeInput.clear().sendKeys(roleName.padStart(4, 'T'));
        await RoleCreatePage.createDialog.nameInput.sendKeys(`Project Role ${roleName}`);
        await RoleCreatePage.createDialog.descriptionInput.sendKeys(`The description of Project Role ${roleName}`);
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('031_User creates role');
            });
        }
        browser.actions().sendKeys(protractor.Key.TAB).perform();
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.sleep(2000);
                supaHelper.stopSupaMeasurement();
            });
        }
        expect(await RoleDetailPage.roleHeaderData.elements.headerTitle(`Project Role ${roleName}`).isPresent()).toBe(true);
    });

    it('User clicks on create button over Language versions table', async () => {
        await RoleDetailPage.roleHeader.roleNamesButton.click();
        expect(RoleDetailPage.role.create.isPresent());
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('035_User clicks on the create button over the Language Versions table');
            });
        }
        for (let i = 0; i < 2; i++) {
            browser.actions().sendKeys(Key.chord(Key.TAB)).perform();
        }
        browser.actions().sendKeys(Key.chord(Key.ENTER)).perform();
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.sleep(2000);
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User enters name', async () => {
        // Measurement
        await RoleDetailPage.actions.editNameValue('', 'Inhalts Autor');
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('036_User enters Name - Inhalts Autor');
            });
        }
        browser.actions().sendKeys(Key.chord(Key.TAB)).perform();
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.sleep(2000);
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User enters language', async () => {
        // Measurement
        await RoleDetailPage.actions.editNewLanguage('', 'de');
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('037_User enters Language - de');
            });
        }
        browser.actions().sendKeys(Key.chord(Key.TAB)).perform();
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.sleep(2000);
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User enters Description', async () => {
        // Measurement
        await RoleDetailPage.actions.editNewDescription('', 'This is a description');
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('038_ User enters Description - This is a description');
            });
        }
        browser.actions().sendKeys(Key.chord(Key.TAB)).perform();
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.sleep(2000);
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User saves role', async () => {
        const roleName = `W${iteration}`;
        expect(await RoleDetailPage.roleHeaderData.elements.headerTitle(`Project Role ${roleName}`).isPresent()).toBe(true);
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('060_User clicks on Save');
            });
        }
        browser.actions().sendKeys(Key.chord(Key.CONTROL, 's')).perform();
        browser.actions().sendKeys(Key.chord(Key.ENTER)).perform();
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.sleep(2000);
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it('User clicks on a project role', async () => {
        await CommonPageElements.objectPage.elements.backButton.click();
        expect(await ProjectRoleListPage.elements.listReportTable.isPresent()).toBeTruthy();
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.startSupaMeasurement('070_User clicks on a project role');
            });
        }
        await ProjectRoleListPage.actions.navigateToRole('RRT0');
        if (supaHelper) {
            browser.controlFlow().execute(() => {
                supaHelper.sleep(2000);
                supaHelper.stopSupaMeasurement();
                supaHelper.sleep(2000);
            });
        }
        expect(await RoleDetailPage.roleHeader.title.isPresent()).toBe(true);
        expect(await RoleDetailPage.roleHeaderData.elements.headerTitle('ProjectRole T0').isPresent()).toBe(true);
    });

    // Cleanup

    it('should go to launchpad home', async () => {
        await CommonPageElements.objectPage.elements.backButton.click();
        await CommonPageElements.objectPage.elements.backButton.click();
    });
}

function cleanProjectRoles() {
    it('Clean up the project roles from the DB', async () => {
        await cleaner.cleanProjectRoles();
    });
}
