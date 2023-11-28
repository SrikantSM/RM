const FLP = require('../../../uiveri5-pages/FLP');
const testHelper = require('../utils/TestHelper');
const { describeTestCase, step } = require('../utils/TestExecutor');

const SKILL_DISPLAY_APP_PATH = '/cp.portal/site#Skill-Display';
const SKILL_UPLOAD_APP_PATH = '/cp.portal/site#Skill-Upload';
const SKILL_DOWNLOAD_APP_PATH = '/cp.portal/site#Skill-Download';
const CATALOG_DISPLAY_APP_PATH = '/cp.portal/site#SkillCatalog-Display';
const PROFICIENCY_DISPLAY_APP_PATH = '/cp.portal/site#Proficiency-Display';
const MarkdownTables = require('../utils/MarkdownTables');

describeTestCase(MarkdownTables.CHECK_AUTHORIZATIONS, 'AuthorizationJourney', () => {
  step(
    'Logon',
    '',
    '',
    () => {
      testHelper.loginWithRole('ConfigurationExpert');
    },
  );

  step(
    'Check if a user who has the configuration expert role assigned is able to see the skill tile',
    '',
    '',
    () => {
      it('should see the skill app as Configuration Expert', () => {
        expect(FLP.tiles.skill.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Check if a user who has the configuration expert role assigned is able to see the catalog tile',
    '',
    '',
    () => {
      it('should see the catalog app as Configuration Expert', () => {
        expect(FLP.tiles.catalog.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Check if a user who has the configuration expert role assigned is able to see the proficiency set tile',
    '',
    '',
    () => {
      it('should see the proficiency set app as Configuration Expert', () => {
        expect(FLP.tiles.proficiency.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Check if a user who has the configuration expert role assigned is able to start the skill app',
    '',
    '',
    () => {
      it('should be able to open the skill app as Configuration Expert', async () => {
        await testHelper.navigateToPath(SKILL_DISPLAY_APP_PATH);
        expect(FLP.errorDialog.appCouldNotBeOpenedErrorText.isPresent()).toBeFalsy();
      });
    },
  );

  step(
    'Check if a user who has the configuration expert role assigned is able to start the skill upload app',
    '',
    '',
    () => {
      it('should be able to open the skill upload app as Configuration Expert', async () => {
        await testHelper.navigateToPath(SKILL_UPLOAD_APP_PATH);
        expect(FLP.errorDialog.appCouldNotBeOpenedErrorText.isPresent()).toBeFalsy();
      });
    },
  );

  step(
    'Check if a user who has the configuration expert role assigned is able to start the skill download app',
    '',
    '',
    () => {
      it('should be able to open the skill download app as Configuration Expert', async () => {
        await testHelper.navigateToPath(SKILL_DOWNLOAD_APP_PATH);
        expect(FLP.errorDialog.appCouldNotBeOpenedErrorText.isPresent()).toBeFalsy();
      });
    },
  );

  step(
    'Check if a user who has the configuration expert role assigned is able to start the catalog app',
    '',
    '',
    () => {
      it('should be able to open the catalog app as Configuration Expert', async () => {
        await testHelper.navigateToPath(CATALOG_DISPLAY_APP_PATH);
        expect(FLP.errorDialog.appCouldNotBeOpenedErrorText.isPresent()).toBeFalsy();
      });
    },
  );

  step(
    'Check if a user who has the configuration expert role assigned is able to start the proficiency set app',
    '',
    '',
    () => {
      it('should be able to open the proficiency set app as Configuration Expert', async () => {
        await testHelper.navigateToPath(PROFICIENCY_DISPLAY_APP_PATH);
        expect(FLP.errorDialog.appCouldNotBeOpenedErrorText.isPresent()).toBeFalsy();
      });
    },
  );

  step(
    'Logout',
    '',
    '',
    () => {
      testHelper.logout();
    },
  );

  step(
    'Logon',
    '',
    '',
    () => {
      testHelper.loginWithRole('ProjectManager');
    },
  );

  step(
    'Check if a user who has not the configuration expert role assigned is able to see the skill tile',
    '',
    '',
    () => {
      it('should not see the skill app as Project Manager', () => {
        expect(FLP.tiles.skill.isPresent()).toBeFalsy();
      });
    },
  );

  step(
    'Check if a user who has not the configuration expert role assigned is able to see the catalog tile',
    '',
    '',
    () => {
      it('should not see the catalog app as Project Manager', () => {
        expect(FLP.tiles.catalog.isPresent()).toBeFalsy();
      });
    },
  );

  step(
    'Check if a user who has not the configuration expert role assigned is able to see the proficiency set tile',
    '',
    '',
    () => {
      it('should not see the proficiency set app as Project Manager', () => {
        expect(FLP.tiles.proficiency.isPresent()).toBeFalsy();
      });
    },
  );

  step(
    'Check if a user who has not the configuration expert role assigned is able to start the skill app',
    '',
    '',
    () => {
      it('should not be able to open the skill app as Project Manager', async () => {
        await testHelper.navigateToPath(SKILL_DISPLAY_APP_PATH);
        expect(FLP.errorDialog.appCouldNotBeOpenedErrorText.isPresent()).toBeTruthy();
        FLP.errorDialog.closeButton.click();
      });
    },
  );

  step(
    'Check if a user who has not the configuration expert role assigned is able to start the skill upload app',
    '',
    '',
    () => {
      it('should not be able to open the skill upload app as Project Manager', async () => {
        await testHelper.navigateToPath(SKILL_UPLOAD_APP_PATH);
        expect(FLP.errorDialog.appCouldNotBeOpenedErrorText.isPresent()).toBeTruthy();
        FLP.errorDialog.closeButton.click();
      });
    },
  );

  step(
    'Check if a user who has not the configuration expert role assigned is able to start the skill download app',
    '',
    '',
    () => {
      it('should not be able to open the skill download app as Project Manager', async () => {
        await testHelper.navigateToPath(SKILL_DOWNLOAD_APP_PATH);
        expect(FLP.errorDialog.appCouldNotBeOpenedErrorText.isPresent()).toBeTruthy();
        FLP.errorDialog.closeButton.click();
      });
    },
  );

  step(
    'Check if a user who has not the configuration expert role assigned is able to start the catalog app',
    '',
    '',
    () => {
      it('should not be able to open the catalog app as Project Manager', async () => {
        await testHelper.navigateToPath(CATALOG_DISPLAY_APP_PATH);
        expect(FLP.errorDialog.appCouldNotBeOpenedErrorText.isPresent()).toBeTruthy();
        FLP.errorDialog.closeButton.click();
      });
    },
  );

  step(
    'Check if a user who has not the configuration expert role assigned is able to start the proficiency set app',
    '',
    '',
    () => {
      it('should not be able to open the proficiency set app as Project Manager', async () => {
        await testHelper.navigateToPath(PROFICIENCY_DISPLAY_APP_PATH);
        expect(FLP.errorDialog.appCouldNotBeOpenedErrorText.isPresent()).toBeTruthy();
        FLP.errorDialog.closeButton.click();
      });
    },
  );

  step(
    'Logout',
    '',
    '',
    () => {
      testHelper.logout();
    },
  );
});
