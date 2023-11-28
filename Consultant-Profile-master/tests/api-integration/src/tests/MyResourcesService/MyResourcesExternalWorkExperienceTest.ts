import { suite, timeout, test } from 'mocha-typescript';
import { assert } from 'chai';
import { v4 as uuid } from 'uuid';
import { MyResourcesServiceRepository } from '../../utils/serviceRepository/MyResourcesService-Repository';
import {
    allEmployeeHeaders,
    allEmail,
    allExternalWorkExperience,
    employeeHeaderWithDescription1,
    employeeHeaderWithDescription3,
    externalWorkExperience1,
    externalWorkExperience3,
    allWorkforcePerson,
    allWorkAssignment,
    allWorkAssignmentDetail,
    allJobDetails,
    allOrganizationDetails,
    allOrganizationHeaders,
    allCostCenters,
    externalWorkExperience4,
    employeeHeaderWithDescription4,
    allResourceOrganizationItems,
    allResourceOrganizations,
} from '../../data';
import { createExternalWorkExperience } from '../../data/service/myResourcesService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { ExternalWorkExperience } from '../../serviceEntities/myProjectExperienceService/ExternalWorkExperience';

@suite('MyResourcesService/ExternalWorkExperience')
export class MyResourcesExternalWorkExperienceTest extends MyResourcesServiceRepository {
    public constructor() { super('ExternalWorkExperience'); }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        await this.employeeHeaderRepository.insertMany(allEmployeeHeaders);
        await this.workforcePersonRepository.insertMany(allWorkforcePerson);
        await this.workAssignmentRepository.insertMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.insertMany(allWorkAssignmentDetail);
        await this.emailRepository.insertMany(allEmail);
        await this.externalWorkExperienceRepository.insertMany(allExternalWorkExperience);
        await this.jobDetailRepository.insertMany(allJobDetails);
        await this.organizationDetailRepository.insertMany(allOrganizationDetails);
        await this.organizationHeaderRepository.insertMany(allOrganizationHeaders);
        await this.costCenterRepository.insertMany(allCostCenters);
        await this.resourceOrganizationsRepository.insertMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.insertMany(allResourceOrganizationItems);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.employeeHeaderRepository.deleteMany(allEmployeeHeaders);
        await this.workforcePersonRepository.deleteMany(allWorkforcePerson);
        await this.workAssignmentRepository.deleteMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.deleteMany(allWorkAssignmentDetail);
        await this.emailRepository.deleteMany(allEmail);
        await this.externalWorkExperienceRepository.deleteMany(allExternalWorkExperience);
        await this.jobDetailRepository.deleteMany(allJobDetails);
        await this.organizationDetailRepository.deleteMany(allOrganizationDetails);
        await this.organizationHeaderRepository.deleteMany(allOrganizationHeaders);
        await this.costCenterRepository.deleteMany(allCostCenters);
        await this.resourceOrganizationsRepository.deleteMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.deleteMany(allResourceOrganizationItems);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all external work experiences.'() {
        const response = await this.get();
        this.responses.push(response);
        const externalWorkExperiences = response.data.value as ExternalWorkExperience[];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(externalWorkExperiences, 'Expected a list of all external work experiences.');
        assert.isDefined(externalWorkExperiences.find(
            (externalWorkExperience) => (
                externalWorkExperience.ID === externalWorkExperience4.ID
                && externalWorkExperience.companyName === externalWorkExperience4.companyName
                && externalWorkExperience.projectName === externalWorkExperience4.projectName
                && externalWorkExperience.rolePlayed === externalWorkExperience4.rolePlayed
                && externalWorkExperience.comments === externalWorkExperience4.comments
                && externalWorkExperience.employee_ID === employeeHeaderWithDescription4.ID
            ),
            'Expected an external work experience 4.',
        ));
        assert.isDefined(externalWorkExperiences.find(
            (externalWorkExperience) => (
                externalWorkExperience.ID === externalWorkExperience1.ID
                && externalWorkExperience.companyName === externalWorkExperience1.companyName
                && externalWorkExperience.projectName === externalWorkExperience1.projectName
                && externalWorkExperience.rolePlayed === externalWorkExperience1.rolePlayed
                && externalWorkExperience.comments === externalWorkExperience1.comments
                && externalWorkExperience.employee_ID === employeeHeaderWithDescription1.ID
            ),
            'Expected no external work experience of another employee.',
        ));
        assert.isDefined(externalWorkExperiences.find(
            (externalWorkExperience) => (
                externalWorkExperience.ID === externalWorkExperience3.ID
                && externalWorkExperience.companyName === externalWorkExperience3.companyName
                && externalWorkExperience.projectName === externalWorkExperience3.projectName
                && externalWorkExperience.rolePlayed === externalWorkExperience3.rolePlayed
                && externalWorkExperience.comments === externalWorkExperience3.comments
                && externalWorkExperience.employee_ID === employeeHeaderWithDescription3.ID
            ),
            'Expected no external work experience of another employee.',
        ));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all external work experiences without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all external work experience with skill and consultant details.'() {
        const response = await this.get('?$expand=externalWorkExperienceSkills,employee,profile');
        this.responses.push(response);
        const externalWorkExperiences = response.data.value as ExternalWorkExperience[];
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(externalWorkExperiences, 'Expected a list of all external work experience with skill and consultant details.');
        assert.isDefined(externalWorkExperiences.find(
            (externalWorkExperience) => (
                externalWorkExperience.ID === externalWorkExperience4.ID
                && externalWorkExperience.companyName === externalWorkExperience4.companyName
                && externalWorkExperience.projectName === externalWorkExperience4.projectName
                && externalWorkExperience.rolePlayed === externalWorkExperience4.rolePlayed
                && externalWorkExperience.comments === externalWorkExperience4.comments
                && externalWorkExperience.employee_ID === employeeHeaderWithDescription4.ID
                && externalWorkExperience.employee !== undefined
                && externalWorkExperience.externalWorkExperienceSkills !== undefined
                && externalWorkExperience.profile !== undefined
            ),
            'Expected an external work experience 4 with external work experience with skill and consultant details.',
        ));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all external work experience with skill and consultant details without authorization.'() {
        const response = await this.getWithoutAuthorization('?$expand=externalWorkExperienceSkills,employee,profile');
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one external work experience.'() {
        const response = await this.get(`(ID=${externalWorkExperience4.ID},IsActiveEntity=true)`);
        this.responses.push(response);
        const externalWorkExperience = response.data as ExternalWorkExperience;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(
            externalWorkExperience.ID === externalWorkExperience4.ID
            && externalWorkExperience.companyName === externalWorkExperience4.companyName
            && externalWorkExperience.projectName === externalWorkExperience4.projectName
            && externalWorkExperience.rolePlayed === externalWorkExperience4.rolePlayed
            && externalWorkExperience.comments === externalWorkExperience4.comments
            && externalWorkExperience.employee_ID === employeeHeaderWithDescription4.ID,
            'Expected an external work experience.',
        );
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one external work experience without authorization.'() {
        const response = await this.getWithoutAuthorization(`(ID=${externalWorkExperience4.ID},IsActiveEntity=true)`);
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one external work experience with skill and consultant details.'() {
        const response = await this.get(`(ID=${externalWorkExperience4.ID},IsActiveEntity=true)?$expand=externalWorkExperienceSkills,employee,profile`);
        this.responses.push(response);
        const externalWorkExperience = response.data as ExternalWorkExperience;

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(
            externalWorkExperience.ID === externalWorkExperience4.ID
            && externalWorkExperience.companyName === externalWorkExperience4.companyName
            && externalWorkExperience.projectName === externalWorkExperience4.projectName
            && externalWorkExperience.rolePlayed === externalWorkExperience4.rolePlayed
            && externalWorkExperience.comments === externalWorkExperience4.comments
            && externalWorkExperience.employee_ID === employeeHeaderWithDescription4.ID
            && externalWorkExperience.employee !== undefined
            && externalWorkExperience.externalWorkExperienceSkills !== undefined
            && externalWorkExperience.profile !== undefined,
            'Expected one external work experience with skill and consultant details.',
        );
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one external work experience with skill and consultant details without authorization.'() {
        const response = await this.getWithoutAuthorization(`(ID=${externalWorkExperience4.ID},IsActiveEntity=true)?$expand=externalWorkExperienceSkills,employee,profile`);
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating an external work experience.'() {
        this.responses.push(await this.enableDraftEdit(createExternalWorkExperience.employee_ID));
        const responseExternalWorkExperienceCreate = await this.create(createExternalWorkExperience);
        this.responses.push(responseExternalWorkExperienceCreate);
        const responseDraftActivate = await this.activateDraft(createExternalWorkExperience.employee_ID);
        this.responses.push(responseDraftActivate);

        assert.equal(responseExternalWorkExperienceCreate.status, 201, 'Creating an external work experience should be allowed, expected status code should be 201 (Created).');
        assert.equal(responseDraftActivate.status, 200, 'Creating an external work experience should be allowed, expected status code should be 200 (OK).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating an external work experience without authorization.'() {
        this.responses.push(await this.enableDraftEdit(createExternalWorkExperience.employee_ID));
        const response = await this.createWithoutAuthorization(createExternalWorkExperience);
        this.responses.push(response);
        this.responses.push(await this.deleteDraft(createExternalWorkExperience.employee_ID));
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating comments in an external work experience.'() {
        this.responses.push(await this.enableDraftEdit(externalWorkExperience4.employee_ID));
        const response = await this.update(`(ID=${externalWorkExperience4.ID},IsActiveEntity=false)`, { comments: 'New Comments' });
        this.responses.push(response);
        const responseDraftActivate = await this.activateDraft(externalWorkExperience4.employee_ID);
        this.responses.push(responseDraftActivate);
        const responseData = response.data as ExternalWorkExperience;

        assert.equal(responseDraftActivate.status, 200, 'Changing a comment in an external work experience is allowed.');
        assert.equal(response.status, 200, 'Changing a comment in external work experience should be possible and expected status code should be 200(OK).');
        assert.equal(responseData.comments, 'New Comments', 'Comment updated');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting an external work experience.'() {
        this.responses.push(await this.enableDraftEdit(createExternalWorkExperience.employee_ID));
        const responseDeleteExternalWorkExperience = await this.delete(`(ID=${createExternalWorkExperience.ID},IsActiveEntity=false)`);
        this.responses.push(responseDeleteExternalWorkExperience);
        const responseDraftActivate = await this.activateDraft(createExternalWorkExperience.employee_ID);
        this.responses.push(responseDraftActivate);
        const responseTrue = await this.get(`(ID=${createExternalWorkExperience.ID},IsActiveEntity=true)`);
        this.responses.push(responseTrue);
        const responseFalse = await this.get(`(ID=${createExternalWorkExperience.ID},IsActiveEntity=false)`);
        this.responses.push(responseFalse);

        assert.equal(responseDeleteExternalWorkExperience.status, 204, 'Expected the external work experience to be deleted, expected status code should be 204 (No Content).');
        assert.equal(responseDraftActivate.status, 200, 'Expected the draft to be activated, expected status code should be 200(Ok).');
        assert.equal(responseTrue.status, 404, 'Unexpected the external work experience which has been deleted, expected status code should be 404 (Not Found).');
        assert.equal(responseFalse.status, 404, 'Unexpected the external work experience which has been deleted, expected status code should be 404 (Not Found).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting an external work experience without authorization.'() {
        this.responses.push(await this.enableDraftEdit(createExternalWorkExperience.employee_ID));
        const response = await this.deleteWithoutAuthorization(`(ID=${createExternalWorkExperience.ID},IsActiveEntity=false)`);
        this.responses.push(response);
        this.responses.push(await this.deleteDraft(createExternalWorkExperience.employee_ID));
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating an external work experience when project name has forbidden characters should not be allowed.'() {
        this.responses.push(await this.enableDraftEdit(createExternalWorkExperience.employee_ID));
        const createExternalWorkExperienceWithInvalidProjectName = createExternalWorkExperience;
        createExternalWorkExperienceWithInvalidProjectName.projectName = '<script>';
        this.responses.push(await this.create(createExternalWorkExperienceWithInvalidProjectName));
        const responseDraftActivate = await this.activateDraft(createExternalWorkExperience.employee_ID);
        this.responses.push(responseDraftActivate);

        assert.equal(responseDraftActivate.status, 400, 'Creating an external work experience when project name has forbidden characters is not allowed and expected status is 400(Bad Request)');
        this.responses.push(await this.deleteDraft(createExternalWorkExperience.employee_ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating an external work experience when company name has forbidden characters should not be allowed.'() {
        this.responses.push(await this.enableDraftEdit(createExternalWorkExperience.employee_ID));
        const createExternalWorkExperienceWithInvalidProjectName = createExternalWorkExperience;
        createExternalWorkExperienceWithInvalidProjectName.companyName = '<script>';
        this.responses.push(await this.create(createExternalWorkExperienceWithInvalidProjectName));
        const responseDraftActivate = await this.activateDraft(createExternalWorkExperience.employee_ID);
        this.responses.push(responseDraftActivate);

        assert.equal(responseDraftActivate.status, 400, 'Creating an external work experience when company name has forbidden characters is not allowed and expected status is 400(Bad Request)');
        this.responses.push(await this.deleteDraft(createExternalWorkExperience.employee_ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating an external work experience when role played has forbidden characters should not be allowed.'() {
        this.responses.push(await this.enableDraftEdit(createExternalWorkExperience.employee_ID));
        const createExternalWorkExperienceWithInvalidProjectName = createExternalWorkExperience;
        createExternalWorkExperienceWithInvalidProjectName.rolePlayed = '<script>';
        this.responses.push(await this.create(createExternalWorkExperienceWithInvalidProjectName));
        const responseDraftActivate = await this.activateDraft(createExternalWorkExperience.employee_ID);
        this.responses.push(responseDraftActivate);

        assert.equal(responseDraftActivate.status, 400, 'Creating an external work experience when role played has forbidden characters is not allowed and expected status is 400(Bad Request)');
        this.responses.push(await this.deleteDraft(createExternalWorkExperience.employee_ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating an external work experience when comments has forbidden characters should not be allowed.'() {
        this.responses.push(await this.enableDraftEdit(createExternalWorkExperience.employee_ID));
        const createExternalWorkExperienceWithInvalidProjectName = createExternalWorkExperience;
        createExternalWorkExperienceWithInvalidProjectName.comments = '<script>';
        this.responses.push(await this.create(createExternalWorkExperienceWithInvalidProjectName));
        const responseDraftActivate = await this.activateDraft(createExternalWorkExperience.employee_ID);
        this.responses.push(responseDraftActivate);

        assert.equal(responseDraftActivate.status, 400, 'Creating an external work experience when comments has forbidden characters is not allowed and expected status is 400(Bad Request)');
        this.responses.push(await this.deleteDraft(createExternalWorkExperience.employee_ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating an external work experience assignment when role played is empty should not be allowed.'() {
        const createExternalWorkExperienceWithEmptyRolePlayed: ExternalWorkExperience = {
            ID: uuid(),
            projectName: 'Project1',
            companyName: 'Company1',
            rolePlayed: '',
            customer: 'Customer1',
            startDate: '2019-01-01',
            endDate: '2019-09-30',
            comments: 'Comments1',
            employee_ID: employeeHeaderWithDescription4.ID,
        };
        this.responses.push(await this.enableDraftEdit(createExternalWorkExperienceWithEmptyRolePlayed.employee_ID));
        this.responses.push(await this.create(createExternalWorkExperienceWithEmptyRolePlayed));
        const responseDraftActivate = await this.activateDraft(createExternalWorkExperienceWithEmptyRolePlayed.employee_ID);
        this.responses.push(responseDraftActivate);
        assert.equal(responseDraftActivate.status, 400, 'Creating an external work experience when role played is empty is not allowed and expected status is 400(Bad Request)');
        assert.equal(responseDraftActivate.data.error.message, 'Enter a role.', 'Expected error message is "Role is a mandatory field.Enter a role in the project Project1."');
        this.responses.push(await this.deleteDraft(createExternalWorkExperienceWithEmptyRolePlayed.employee_ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating an external work experience assignment when company name is empty should not be allowed.'() {
        const createExternalWorkExperienceWithEmptyCompanyName: ExternalWorkExperience = {
            ID: uuid(),
            projectName: 'Project2',
            companyName: '',
            rolePlayed: 'Role2',
            customer: 'Customer2',
            startDate: '2018-01-01',
            endDate: '2018-09-30',
            comments: 'Comments2',
            employee_ID: employeeHeaderWithDescription4.ID,
        };
        this.responses.push(await this.enableDraftEdit(createExternalWorkExperienceWithEmptyCompanyName.employee_ID));
        this.responses.push(await this.create(createExternalWorkExperienceWithEmptyCompanyName));
        const responseDraftActivate = await this.activateDraft(createExternalWorkExperienceWithEmptyCompanyName.employee_ID);
        this.responses.push(responseDraftActivate);
        assert.equal(responseDraftActivate.status, 400, 'Creating an external work experience when company name is empty is not allowed and expected status is 400(Bad Request)');
        assert.equal(responseDraftActivate.data.error.message, 'Enter a company name.', 'Expected error message is "Company is a mandatory field.Enter a company name in the project Project2."');
        this.responses.push(await this.deleteDraft(createExternalWorkExperienceWithEmptyCompanyName.employee_ID));
    }
}
