const CREATE_PROJECT_ROLES = 'Create Project Roles';
const VIEW_EDIT_SKILL_ASSIGNMENT = 'View and Edit Skill Assignment';
const VIEW_EDIT_ROLE_ASSIGNMENT = 'View and Edit Role Assignment';
const VIEW_EDIT_EXTERNAL_WORK_EXPERIENCE = 'View and Edit External Work Experience';
const UPLOAD_PROFILE_PHOTO = 'Edit and Upload Profile Photo';
const DOWNLOAD_AVAILABILITY_TEMPLATE = 'Download Availability Template';
const UPLOAD_AVAILABILITY_DATA = 'Upload Availability Data';
const UPLOAD_SERVICE_ORGANIZATIONS = 'Upload Service Organizations';
const MANAGE_REPLICATION_SCHEDULES = 'Manage Replication Schedules';
const VIEW_MY_ASSIGNMENTS = 'View My Assignments';
const VIEW_MY_RESOURCES = 'View My Resources';
const UPLOAD_ATTACHMENT = 'Edit and Upload Resume'
const loginHelper = require('../../../end-to-end/src/tests/pages/LoginHelper');

class TestHelper {
    constructor(supaHelper, scenario) {
        this.supaHelper = supaHelper;
        this.scenario = scenario;
        if (this.scenario === CREATE_PROJECT_ROLES) {
            this.loginUser = browser.testrunner.config.params.CEUser;
            this.loginPass = browser.testrunner.config.params.CEPass;
            this.app = 'Manage Project Roles';
            this.ipaScenario = 'F4706_Create_Project_Role';
        } else if (this.scenario === VIEW_EDIT_SKILL_ASSIGNMENT) {
            this.loginUser = browser.testrunner.config.params.PTMUser;
            this.loginPass = browser.testrunner.config.params.PTMPass;
            this.app = 'My Project Experience';
            this.ipaScenario = 'F4705_View_Edit_Skill_Assignment';
        } else if (this.scenario === VIEW_EDIT_ROLE_ASSIGNMENT) {
            this.loginUser = browser.testrunner.config.params.PTMUser;
            this.loginPass = browser.testrunner.config.params.PTMPass;
            this.app = 'My Project Experience';
            this.ipaScenario = 'F4705_View_Edit_Role_Assignment';
        } else if (this.scenario === VIEW_EDIT_EXTERNAL_WORK_EXPERIENCE) {
            this.loginUser = browser.testrunner.config.params.PTMUser;
            this.loginPass = browser.testrunner.config.params.PTMPass;
            this.app = 'My Project Experience';
            this.ipaScenario = 'F4705_View_Edit_External_Work_Experience';
        } else if (this.scenario === UPLOAD_PROFILE_PHOTO) {
            this.loginUser = browser.testrunner.config.params.PTMUser;
            this.loginPass = browser.testrunner.config.params.PTMPass;
            this.app = 'My Project Experience';
            this.ipaScenario = 'F4705_Upload_Profile_Photo';
        } else if (this.scenario === UPLOAD_ATTACHMENT) {
            this.loginUser = browser.testrunner.config.params.PTMUser;
            this.loginPass = browser.testrunner.config.params.PTMPass;
            this.app = 'My Project Experience';
            this.ipaScenario = 'F4705_Upload_Attachment';
        } else if (this.scenario === DOWNLOAD_AVAILABILITY_TEMPLATE) {
            this.loginUser = browser.testrunner.config.params.CEUser;
            this.loginPass = browser.testrunner.config.params.CEPass;
            this.app = 'Maintain Availability Data';
            this.ipaScenario = 'F5072_Download_Availability_Template';
        } else if (this.scenario === UPLOAD_AVAILABILITY_DATA) {
            this.loginUser = browser.testrunner.config.params.CEUser;
            this.loginPass = browser.testrunner.config.params.CEPass;
            this.app = 'Maintain Availability Data';
            this.ipaScenario = 'F5072_Upload_Availability_Data';
        } else if (this.scenario === UPLOAD_SERVICE_ORGANIZATIONS) {
            this.loginUser = browser.testrunner.config.params.CEUser;
            this.loginPass = browser.testrunner.config.params.CEPass;
            this.app = 'Maintain Service Organizations';
            this.ipaScenario = 'F5071_Upload_Service_Organizations';
        } else if (this.scenario === MANAGE_REPLICATION_SCHEDULES) {
            this.loginUser = browser.testrunner.config.params.CEUser;
            this.loginPass = browser.testrunner.config.params.CEPass;
            this.app = 'Manage Replication Schedules';
            this.ipaScenario = 'F5440_Manage_Replication_Schedules';
        } else if (this.scenario === VIEW_MY_ASSIGNMENTS) {
            this.loginUser = browser.testrunner.config.params.PTMUser;
            this.loginPass = browser.testrunner.config.params.PTMPass;
            this.app = 'My Assignments';
            this.ipaScenario = 'F5991_View_My_Assignments';
        } else if (this.scenario === VIEW_MY_RESOURCES) {
            this.loginUser = browser.testrunner.config.params.RMUser;
            this.loginPass = browser.testrunner.config.params.RMPass;
            this.app = 'My Resources';
            this.ipaScenario = 'F6604_View_My_Resources';
        }

        this.supaFile = `${this.ipaScenario}.properties`;
    }

    login() {
        it(`Should login with user ${this.loginUser}`, () => {
            loginHelper.loginWithCredentials(this.loginUser, this.loginPass);
        });
    }

    logout() {
        it('Should logout', () => {
            loginHelper.logout();
        });
    }

    configureSUPA() {
        it('should configure SUPA', () => {
            const that = this;
            browser.controlFlow().execute(() => {
                const cfgFile = `${browser.testrunner.config.params.cfgpath}/${that.supaFile}`;
                that.supaHelper.addCredentials(cfgFile, 'branch.1.newdb.user.name', browser.testrunner.config.params.hanaUser);
                that.supaHelper.addCredentials(cfgFile, 'branch.1.newdb.user.password', browser.testrunner.config.params.hanaPassword);
                that.supaHelper.addCredentials(cfgFile, 'branch.1.newdb.db.server', browser.testrunner.config.params.hanaHost);
                that.supaHelper.addCredentials(cfgFile, 'branch.1.newdb.db.port', browser.testrunner.config.params.hanaPort);
                that.supaHelper.addCredentials(cfgFile, 'branch.1.newdb.monitored.dbusers', browser.testrunner.config.params.monitoredHanaUser);
                that.supaHelper.addCredentials(cfgFile, 'branch.2.dynatrace.timeseries.apitoken', browser.testrunner.config.params.dynatraceApiToken);
                that.supaHelper.addCredentials(cfgFile, 'branch.2.dynatrace.timeseries.tag', browser.testrunner.config.params.dynatraceTag);
                that.supaHelper.addCredentials(cfgFile, 'ipa.user.name', browser.testrunner.config.params.ipauser.user);
                that.supaHelper.addCredentials(cfgFile, 'ipa.user.password', browser.testrunner.config.params.ipauser.pass);
                that.supaHelper.addCredentials(cfgFile, 'ipa.project.name', browser.testrunner.config.params.ipaProject);
                that.supaHelper.addCredentials(cfgFile, 'ipa.release.name', browser.testrunner.config.params.ipaRelease);
                that.supaHelper.addCredentials(cfgFile, 'ipa.variant.name', browser.testrunner.config.params.ipaVariant);
                that.supaHelper.configureSupa(cfgFile);
            });
        });
    }

    finishAndUpload() {
        const that = this;
        it('should upload to IPA', () => {
            browser.controlFlow().execute(() => {
                that.supaHelper.finishMeasurement();
                that.supaHelper.uploadToIPA(
                    browser.testrunner.config.params.ipaProject,
                    that.ipaScenario,
                    browser.testrunner.config.params.ipaVariant,
                    browser.testrunner.config.params.ipaRelease,
                    browser.testrunner.config.params.ipaComment,
                    browser.testrunner.config.params.ipauser.user,
                    browser.testrunner.config.params.ipauser.pass,
                );
            });
        });
    }

    exitSUPA() {
        const that = this;
        it('should exit SUPA', () => {
            browser.controlFlow().execute(() => {
                that.supaHelper.exitSupa();
            });
        });
    }
}
module.exports = {
    CREATE_PROJECT_ROLES, VIEW_EDIT_SKILL_ASSIGNMENT, VIEW_EDIT_ROLE_ASSIGNMENT, VIEW_EDIT_EXTERNAL_WORK_EXPERIENCE, UPLOAD_PROFILE_PHOTO, UPLOAD_ATTACHMENT, DOWNLOAD_AVAILABILITY_TEMPLATE, UPLOAD_AVAILABILITY_DATA, UPLOAD_SERVICE_ORGANIZATIONS, MANAGE_REPLICATION_SCHEDULES, VIEW_MY_ASSIGNMENTS, VIEW_MY_RESOURCES, TestHelper,
};
