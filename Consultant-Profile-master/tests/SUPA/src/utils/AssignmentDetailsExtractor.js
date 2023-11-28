module.exports = class AssignmentDetailsExtractor {
    constructor(testEnvironment) {
        this.testEnvironment = testEnvironment;
    }

    async extractAssignmentDetails() {
        const databaseClient = await this.testEnvironment.getDatabaseClient();
        console.log('Initiating extracting assignment start date');
        try {
            console.log('Selecting the employee ID from COM_SAP_RESOURCEMANAGEMENT_EMPLOYEE_PROFILEDATA');
            const profileDataArray = await databaseClient.execute('SELECT ID FROM COM_SAP_RESOURCEMANAGEMENT_EMPLOYEE_PROFILEDATA WHERE EMAILADDRESS LIKE \'sapc4pauthconsultant1@global.corp.sap\'');
            const EmployeeID = profileDataArray[0].ID;
            console.log('Selecting the last assignment start date from COM_SAP_RESOURCEMANAGEMENT_EMPLOYEE_PRIOREXPERIENCE_INTERNALWORKEXPERIENCE');
            const selectStatement = `SELECT TOP 1 ASSIGNMENTSTARTDATE, TORESOURCEREQUEST.NAME FROM COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_RESOURCEASSIGNMENTPERDAYVIEW WHERE EMPLOYEE_ID LIKE '${EmployeeID}' ORDER BY ASSIGNMENTSTARTDATE DESC`;
            const priorExperience = await databaseClient.execute(selectStatement);
            const startDate = priorExperience[0].ASSIGNMENTSTARTDATE;
            const requestName = priorExperience[0].NAME;
            console.log(`Completed extracting assignment start date : ${startDate}`);
            console.log(`Completed extracting assignment request name : ${requestName}`);
            return { startDate, requestName };
        } catch (e) {
            console.error('Failed while extracting assignment start date: ', e);
            return null;
        }
    }
};
