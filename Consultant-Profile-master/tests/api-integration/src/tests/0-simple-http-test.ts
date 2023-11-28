import { suite, test, timeout } from 'mocha-typescript';
import { assert } from 'chai';
import { allEmailAddresses } from '../data/db/employee/Emails';
import { allSkillNames, allCatalogDesc, allProficiencySet } from '../data/db/skill';
import {
    allOrganizationDetails,
    allOrganizationHeaders,
    costCenter1,
    costCenter2,
} from '../data/db/organization';
import { projectRoleDescription } from '../data/db/config';
import { projectRoleTextDescription } from '../data/service/projectRoleService';
import {
    customerData,
    projectData,
    allResourceRequestDesc,
    workpackageData,
} from '../data/db/resourceRequest';
import { ServiceEndPointsRepository, TEST_TIMEOUT } from '../utils/serviceRepository/Service-Repository';
import { allResourceOrganizationItems, allResourceOrganizations } from '../data/db/resourceOrganization';

@suite
export class SimpleHttpTest extends ServiceEndPointsRepository {
    private static async beforeAllDataCleanUp() {
        try {
            // Group 1 Deletion Data Preparation Start
            const toBeDeletedEmailData = <Object[] & { length: 0 }>[];
            const emailParentAsId = <Object[] & { length: 0 }>[];            // WorkforcePerson, EmployeeHeader
            const emailParentAsEmployeeeId = <Object[] & { length: 0 }>[];  // RoleAssignment, SkillAssignment, ExternalWorkExperience, ExternalWorkExperienceSkills,
            const emailParentAsParent = <Object[] & { length: 0 }>[];        // ProfileDetails, PhoneDetail
            const emailDataList = await SimpleHttpTest.emailRepository.selectByData(['ID, parent'], allEmailAddresses as any);
            emailDataList.forEach((emailData) => {
                const emailId = emailData.ID;
                const emailParent = emailData.parent;

                toBeDeletedEmailData.push({ ID: emailId });
                emailParentAsId.push({ ID: emailParent });
                emailParentAsParent.push({ parent: emailParent });
                emailParentAsEmployeeeId.push({ employee_ID: emailParent });
            });

            const toBeDeletedWorkforcePersonData = emailParentAsId;
            const toBeDeletedEmployeeHeaderData = emailParentAsId;
            const toBeDeletedProfileData = emailParentAsParent;
            const toBeDeletedPhoneData = emailParentAsParent;
            const toBeDeletedPhotoData = emailParentAsParent;
            const toBeDeletedRoleAssignmentData = emailParentAsEmployeeeId;
            const toBeDeletedSkillAssignmentData = emailParentAsEmployeeeId;
            const toBeDeletedExternalWorkExperienceSkillsData = emailParentAsEmployeeeId;
            const toBeDeletedExternalWorkExperienceData = emailParentAsEmployeeeId;
            // Group 1 Deletion Data Praparation is finished

            // Group 2 Deletion Data Preparation Start
            const toBeDeletedWorkAssignmentData = <Object[] & { length: 0 }>[];
            const workAssignmentIdAsId = <Object[] & { length: 0 }>[];                   // ResourceHeader
            const workAssignmentIdAsResourceId = <Object[] & { length: 0 }>[];          // ResourceCapacity, Assignment
            const workAssignmentIdAsResourceId2 = <Object[] & { length: 0 }>[];          // BookedCapacityAggregate
            const workAssignmentIdAsParent = <Object[] & { length: 0 }>[];               // JobDetails, workAssignmentDetails
            const workAssignmentIdAsWorkAssignmentUUID = <Object[] & { length: 0 }>[];   // WorkPlaceAddress
            const workAssignmentDataList = await SimpleHttpTest.workAssignmentRepository.selectByData(['ID'], emailParentAsParent as any);
            workAssignmentDataList.forEach((workAssignmentData) => {
                const workAssignmentId = workAssignmentData.ID;

                toBeDeletedWorkAssignmentData.push({ ID: workAssignmentId });
                workAssignmentIdAsId.push({ ID: workAssignmentId });
                workAssignmentIdAsParent.push({ parent: workAssignmentId });
                workAssignmentIdAsResourceId.push({ resource_ID: workAssignmentId });
                workAssignmentIdAsWorkAssignmentUUID.push({ workAssignmentUUID: workAssignmentId });
                workAssignmentIdAsResourceId2.push({ resourceID: workAssignmentId });
            });

            const toBeDeletedResourceHeaderData = workAssignmentIdAsId;
            const toBeDeletedJobDetailsData = workAssignmentIdAsParent;
            const toBeDeletedWorkAssignmentDetailsData = workAssignmentIdAsParent;
            const toBeDeletedResourceCapacityData = workAssignmentIdAsResourceId;
            const toBeDeletedAssignmentData = workAssignmentIdAsResourceId;
            const toBeDeletedBookedCapacityAggregateData = workAssignmentIdAsResourceId2;
            // Group 2 Deletion Data Praparation is finished

            // Group 3 Deletion Data Preparation Start
            const toBeDeletedSkillData = <Object[] & { length: 0 }>[];
            const toBeDeletedProficiencySetData = <Object[] & { length: 0 }>[];

            const proficiencyLevelDataList = await SimpleHttpTest.proficiencySetRepository.selectByData(['ID'], (allProficiencySet as any));
            proficiencyLevelDataList.forEach((proficiencySetData) => {
                const proficiencySetID = proficiencySetData.ID;
                toBeDeletedProficiencySetData.push({ ID: proficiencySetID });
            });
            const skillDataList = await SimpleHttpTest.skillRepository.selectByData(['ID'], (allSkillNames as any));
            skillDataList.forEach((skillData) => {
                const skillID = skillData.ID;
                toBeDeletedSkillData.push({ ID: skillID });
            });

            // Group 3 Deletion Data Praparation is finished

            // Group 4 Deletion Data Preparation Start
            const toBeDeletedProjectRoleData = [projectRoleDescription];
            const toBeDeletedProjectRoleTextData = [projectRoleTextDescription];
            // Group 4 Deletion Data Praparation is finished

            // Group 5 Deletion Data Preparation Start
            const toBeDeletedCostCenter = [
                { costCenterID: costCenter1.costCenterID },
                { costCenterID: costCenter2.costCenterID },
            ];

            // Data Cleaning Start
            // Group 1
            await SimpleHttpTest.emailRepository.deleteMany(toBeDeletedEmailData as any);
            await SimpleHttpTest.workforcePersonRepository.deleteMany(toBeDeletedWorkforcePersonData as any);
            await SimpleHttpTest.employeeHeaderRepository.deleteMany(toBeDeletedEmployeeHeaderData as any);
            await SimpleHttpTest.profileDetailRepository.deleteManyByData(toBeDeletedProfileData as any);
            await SimpleHttpTest.phoneRepository.deleteManyByData(toBeDeletedPhoneData as any);
            await SimpleHttpTest.photoRepository.deleteManyByData(toBeDeletedPhotoData as any);
            await SimpleHttpTest.roleAssignmentRepository.deleteManyByData(toBeDeletedRoleAssignmentData as any);
            await SimpleHttpTest.skillAssignmentRepository.deleteManyByData(toBeDeletedSkillAssignmentData as any);
            await SimpleHttpTest.externalWorkExperienceSkillsRepository.deleteManyByData(toBeDeletedExternalWorkExperienceSkillsData as any);
            await SimpleHttpTest.externalWorkExperienceRepository.deleteManyByData(toBeDeletedExternalWorkExperienceData as any);

            // Group 2
            await SimpleHttpTest.workAssignmentRepository.deleteMany(toBeDeletedWorkAssignmentData as any);
            await SimpleHttpTest.resourceHeaderRepository.deleteMany(toBeDeletedResourceHeaderData as any);
            await SimpleHttpTest.jobDetailRepository.deleteManyByData(toBeDeletedJobDetailsData as any);
            await SimpleHttpTest.workAssignmentDetailRepository.deleteManyByData(toBeDeletedWorkAssignmentDetailsData as any);
            await SimpleHttpTest.resourceCapacityRepository.deleteManyByData(toBeDeletedResourceCapacityData as any);
            await SimpleHttpTest.assignmentsRepository.deleteManyByData(toBeDeletedAssignmentData as any);
            await SimpleHttpTest.bookedCapacityAggregateRepository.deleteManyByData(toBeDeletedBookedCapacityAggregateData as any);

            // Group 3
            await SimpleHttpTest.catalogRepository.deleteManyByData(allCatalogDesc as any);
            await SimpleHttpTest.proficiencySetRepository.deleteMany(toBeDeletedProficiencySetData as any);
            await SimpleHttpTest.skillRepository.deleteMany(toBeDeletedSkillData as any);

            // Group 4
            await SimpleHttpTest.projectRoleRepository.deleteManyByData(toBeDeletedProjectRoleData as any);
            await SimpleHttpTest.projectRoleTextRepository.deleteManyByData(toBeDeletedProjectRoleTextData as any);

            // Group 5
            await SimpleHttpTest.organizationHeaderRepository.deleteMany(allOrganizationHeaders);
            await SimpleHttpTest.organizationDetailRepository.deleteMany(allOrganizationDetails);
            await SimpleHttpTest.costCenterRepository.deleteManyByData(toBeDeletedCostCenter as any);
            await SimpleHttpTest.resourceOrganizationsRepository.deleteMany(allResourceOrganizations);
            await SimpleHttpTest.resourceOrganizationItemsRepository.deleteMany(allResourceOrganizationItems);

            // Group 6
            await SimpleHttpTest.customerRepository.deleteMany(customerData);
            await SimpleHttpTest.projectRepository.deleteMany(projectData);
            await SimpleHttpTest.workPackageRepository.deleteMany(workpackageData);
            await SimpleHttpTest.resourceRequestRepository.deleteManyByData(allResourceRequestDesc as any);
            // Data Cleaning finished
        } catch (err) {
            console.log(err);
        }
    }

    @timeout(TEST_TIMEOUT * 2)
    static async before() {
        console.log('Preparing the DB Repositories');
        try {
            await this.prepareDbRepository();
        } catch (err) {
            console.log(err);
        }
        console.log('Preparing the DB Repositories');
        console.log('Initializing precautionary Data Cleanup');
        try {
            await SimpleHttpTest.beforeAllDataCleanUp();
        } catch (err) {
            console.log(err);
        }
        try {
            await this.prepareApplicationServiceClient();
            await this.prepareHealthCheckServiceClient();
            await this.prepareJobSchedulerServiceClient();
        } catch (err) {
            console.log(err);
        }
        console.log('Precautionary Data Cleanup is complete');
    }

    @test(timeout(TEST_TIMEOUT))
    async ok() {
        const responseMyProjectExperienceService = await ServiceEndPointsRepository.consultantIntegrationSrvServiceClient.request({ url: '/' });
        this.responses.push(responseMyProjectExperienceService);
        const responseConfigService = await ServiceEndPointsRepository.consultantSrvBasicServiceClient.request({ url: '/' });
        this.responses.push(responseConfigService);

        assert.equal(responseMyProjectExperienceService.status, 200, 'Expected status code to be 200 (OK).');
        assert.equal(responseConfigService.status, 200, 'Expected status code to be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async notFound() {
        const responseMyProjectExperienceService = await ServiceEndPointsRepository.consultantIntegrationSrvServiceClient.request({ url: '/not-existing' });
        this.responses.push(responseMyProjectExperienceService);
        const responseConfigService = await ServiceEndPointsRepository.consultantSrvBasicServiceClient.request({ url: '/not-existing' });
        this.responses.push(responseConfigService);

        assert.isAtLeast(responseMyProjectExperienceService.status, 400, 'Expected status code to be at least 400.');
        assert.isBelow(responseConfigService.status, 500, 'Expected status code to be below 500.');
        assert.isAtLeast(responseMyProjectExperienceService.status, 400, 'Expected status code to be at least 400.');
        assert.isBelow(responseConfigService.status, 500, 'Expected status code to be below 500.');
    }
}
