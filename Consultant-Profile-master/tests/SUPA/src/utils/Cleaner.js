module.exports = class Cleaner {
    constructor(testEnvironment) {
        this.testEnvironment = testEnvironment;
    }

    async cleanProjectRoles() {
        const databaseClient = await this.testEnvironment.getDatabaseClient();
        console.log('Initiating deletion of Project Roles');
        try {
            console.log('Deleting the project roles from PROJECTROLESERVICE_ROLES_TEXTS_DRAFTS');
            await databaseClient.execute('DELETE FROM PROJECTROLESERVICE_ROLES_TEXTS_DRAFTS');
            console.log('Deleting the project roles from PROJECTROLESERVICE_ROLES_DRAFTS');
            await databaseClient.execute('DELETE FROM PROJECTROLESERVICE_ROLES_DRAFTS');
            console.log('Deleting the project roles from COM_SAP_RESOURCEMANAGEMENT_CONFIG_PROJECTROLES');
            await databaseClient.execute('DELETE FROM COM_SAP_RESOURCEMANAGEMENT_CONFIG_PROJECTROLES WHERE CODE LIKE \'T%\'');
        } catch (e) {
            console.error('Failed while deleting project roles: ', e);
        }
        console.log('Completed deletion of Project Roles');
    }

    async cleanSkillAssignments(skillName) {
        const databaseClient = await this.testEnvironment.getDatabaseClient();
        console.log('Initiating deletion of Skill Assignment');
        try {
            console.log('Selecting the employee ID from COM_SAP_RESOURCEMANAGEMENT_EMPLOYEE_PROFILEDATA');
            const profileDataArray = await databaseClient.execute('SELECT ID FROM COM_SAP_RESOURCEMANAGEMENT_EMPLOYEE_PROFILEDATA WHERE EMAILADDRESS LIKE \'sapc4pauthconsultant1@global.corp.sap\'');
            const EmployeeID = profileDataArray[0].ID;
            console.log(`EmployeeID: ${EmployeeID}`);
            console.log('Selecting the skill ID from COM_SAP_RESOURCEMANAGEMENT_SKILL_SKILLS_TEXTS');
            const selectStatement = `SELECT TOP 1 ID FROM COM_SAP_RESOURCEMANAGEMENT_SKILL_SKILLS_TEXTS WHERE NAME LIKE '${skillName}'`;
            const skill = await databaseClient.execute(selectStatement);
            const skillID = skill[0].ID;
            console.log(`skillID: ${skillID}`);
            console.log('Deleting the skill assignment from COM_SAP_RESOURCEMANAGEMENT_EMPLOYEE_QUALIFICATIONS_SKILLASSIGNMENTS');
            await databaseClient.execute(`DELETE FROM COM_SAP_RESOURCEMANAGEMENT_EMPLOYEE_QUALIFICATIONS_SKILLASSIGNMENTS WHERE SKILL_ID LIKE '${skillID}' AND EMPLOYEE_ID LIKE '${EmployeeID}'`);
            console.log(`Completed deleting the assignment to the skill ${skillID}`);
        } catch (e) {
            console.error('Failed while deleting Skill Assignment: ', e);
        }
        console.log('Completed deletion of Skill Assignment');
    }
};
