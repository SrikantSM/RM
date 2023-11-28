import { suite, timeout, test } from 'mocha-typescript';
import { expect, assert } from 'chai';
import {
    WorkforcePerson,
    Email,
    Phone,
    ProfileDetail,
    JobDetail,
    OrganizationHeader,
    ResourceOrganizations,
    WorkAssignment,
    CostCenter,
    CostCenterAttribute,
    Photo,
} from 'test-commons';
import { MyProjectExperienceServiceRepository } from '../../utils/serviceRepository/MyProjectExperienceService-Repository';
import {
    allEmployeeHeaders,
    allWorkforcePerson,
    allProfiles,
    allEmail,
    allPhotos,
    allPhone,
    allWorkAssignment,
    allJobDetails,
    allOrganizationDetails,
    allOrganizationHeaders,
    workforcePersonWithDescription1,
    profileDetail4,
    email1,
    photo1,
    phone1,
    jobDetail4,
    organizationHeader1,
    resourceOrganization1,
    workforcePersonWithDescription2,
    email3,
    phone3,
    profileDetail3,
    workAssignment4,
    allCostCenters,
    allCostCenterAttributes,
    costCenter1,
    costCenterAttribute1,
    allWorkAssignmentDetail,
    photo3,
    allResourceOrganizations,
    allResourceOrganizationItems,
} from '../../data';
import { createProfileData } from '../../data/service/myProjectExperienceService';
import { TEST_TIMEOUT, TEST_TIMEOUT_TIME_GENERATION } from '../../utils/serviceRepository/Service-Repository';
import { ManagerProfileData, ProfileData, WorkerType } from '../../serviceEntities/myProjectExperienceService/ProfileData';

@suite('MyProjectExperienceService/ProfileData')
export class ProfileDataTest extends MyProjectExperienceServiceRepository {
    public constructor() { super('ProfileData'); }

    @timeout(TEST_TIMEOUT_TIME_GENERATION)
    static async before() {
        await this.prepare();
        await this.employeeHeaderRepository.insertMany(allEmployeeHeaders);
        await this.workforcePersonRepository.insertMany(allWorkforcePerson);
        await this.profileDetailRepository.insertMany(allProfiles);
        await this.emailRepository.insertMany(allEmail);
        await this.photoRepository.insertMany(allPhotos);
        await this.phoneRepository.insertMany(allPhone);
        await this.workAssignmentRepository.insertMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.insertMany(allWorkAssignmentDetail);
        await this.jobDetailRepository.insertMany(allJobDetails);
        await this.organizationDetailRepository.insertMany(allOrganizationDetails);
        await this.organizationHeaderRepository.insertMany(allOrganizationHeaders);
        await this.costCenterRepository.insertMany(allCostCenters);
        await this.costCenterAttributeRepository.insertMany(allCostCenterAttributes);
        await this.resourceOrganizationsRepository.insertMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.insertMany(allResourceOrganizationItems);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.employeeHeaderRepository.deleteMany(allEmployeeHeaders);
        await this.workforcePersonRepository.deleteMany(allWorkforcePerson);
        await this.profileDetailRepository.deleteMany(allProfiles);
        await this.emailRepository.deleteMany(allEmail);
        await this.photoRepository.deleteMany(allPhotos);
        await this.phoneRepository.deleteMany(allPhone);
        await this.workAssignmentRepository.deleteMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.deleteMany(allWorkAssignmentDetail);
        await this.jobDetailRepository.deleteMany(allJobDetails);
        await this.organizationDetailRepository.deleteMany(allOrganizationDetails);
        await this.organizationHeaderRepository.deleteMany(allOrganizationHeaders);
        await this.costCenterRepository.deleteMany(allCostCenters);
        await this.costCenterAttributeRepository.deleteMany(allCostCenterAttributes);
        await this.resourceOrganizationsRepository.deleteMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.deleteMany(allResourceOrganizationItems);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all consultant\'s profile.'() {
        const response = await this.get();
        this.responses.push(response);
        const profiles = response.data.value as ProfileData[];
        const expectedProfile = this.prepareExpected({
            workforcePerson: workforcePersonWithDescription1, email: email1, photo: photo1, phone: phone1, profileDetail: profileDetail4, jobDetail: jobDetail4, managerWorkAssignment: workAssignment4, organizationHeader: organizationHeader1, resourceOrganization: resourceOrganization1, costCenter: costCenter1, costCenterAttribute: costCenterAttribute1,
        });

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(profiles, 'Expected a list of consultant\'s profile.');
        expect(profiles).to.eql([expectedProfile]);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all consultant\'s profile as a user not in the DB'() {
        const response = await this.getWithNoConsultantInDB();
        this.responses.push(response);
        const profiles = response.data.value as ProfileData[];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isEmpty(profiles, 'Expected an empty list of consultant\'s profile.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all consultant\'s profile without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all consultant\'s profile with manager details.'() {
        const response = await this.get('?$expand=toManager');
        this.responses.push(response);
        const profiles = response.data.value as ProfileData[];
        const expectedProfile = this.prepareExpected({
            workforcePerson: workforcePersonWithDescription1, email: email1, photo: photo1, phone: phone1, profileDetail: profileDetail4, jobDetail: jobDetail4, managerWorkAssignment: workAssignment4, organizationHeader: organizationHeader1, resourceOrganization: resourceOrganization1, costCenter: costCenter1, costCenterAttribute: costCenterAttribute1,
        }, {
            email: email3, photo: photo3, phone: phone3, profileDetail: profileDetail3, workAssignment: workAssignment4,
        });

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(profiles, 'Expected a list of consultant\'s profile.');
        expect(profiles).to.eql([expectedProfile]);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all consultant\'s profile with manager details without authorization.'() {
        const response = await this.getWithoutAuthorization('?$expand=toManager');
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one consultant\'s profile.'() {
        const response = await this.get(`(${workforcePersonWithDescription1.ID})`);
        this.responses.push(response);
        const profile = response.data;
        const expectedProfile = this.prepareExpected({
            workforcePerson: workforcePersonWithDescription1, email: email1, photo: photo1, phone: phone1, profileDetail: profileDetail4, jobDetail: jobDetail4, managerWorkAssignment: workAssignment4, organizationHeader: organizationHeader1, resourceOrganization: resourceOrganization1, costCenter: costCenter1, costCenterAttribute: costCenterAttribute1,
        });
        delete profile['@context'];
        delete profile['@metadataEtag'];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(profile, 'Expected a list of consultant\'s profile.');
        expect(profile).to.eql(expectedProfile);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get another consultant\'s profile.'() {
        const response = await this.get(`(${workforcePersonWithDescription2.ID})`);
        this.responses.push(response);
        const profile = response.data as ProfileData;

        assert.equal(response.status, 404, 'Expected status code to be 404 (Not Found).');
        assert.isUndefined(profile.ID, 'Expected no results for another consultant\'s profile.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one consultant\'s profile without authorization.'() {
        const response = await this.getWithoutAuthorization(`(${workforcePersonWithDescription1.ID})`);
        this.responses.push(response);

        assert.equal(response.status, 403, 'Expected status code to be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one consultant\'s profile with manager details.'() {
        const response = await this.get(`(${workforcePersonWithDescription1.ID})?$expand=toManager`);
        this.responses.push(response);
        const profile = response.data;
        const expectedProfile = this.prepareExpected({
            workforcePerson: workforcePersonWithDescription1, email: email1, photo: photo1, phone: phone1, profileDetail: profileDetail4, jobDetail: jobDetail4, managerWorkAssignment: workAssignment4, organizationHeader: organizationHeader1, resourceOrganization: resourceOrganization1, costCenter: costCenter1, costCenterAttribute: costCenterAttribute1,
        }, {
            email: email3, phone: phone3, photo: photo3, profileDetail: profileDetail3, workAssignment: workAssignment4,
        });
        delete profile['@context'];
        delete profile['@metadataEtag'];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(profile, 'Expected a list of consultant\'s profile.');
        expect(profile).to.eql(expectedProfile);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one consultant\'s profile with manager details without authorization.'() {
        const response = await this.getWithoutAuthorization(`(${workforcePersonWithDescription1.ID})?$expand=toManager`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code to be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one consultant\'s profile with worker type.'() {
        const response = await this.get(`(${workforcePersonWithDescription1.ID})?$expand=workerType`);
        this.responses.push(response);
        const profile = response.data;
        const expectedProfile = this.prepareExpected({
            workforcePerson: workforcePersonWithDescription1, email: email1, photo: photo1, phone: phone1, profileDetail: profileDetail4, jobDetail: jobDetail4, managerWorkAssignment: workAssignment4, organizationHeader: organizationHeader1, resourceOrganization: resourceOrganization1, costCenter: costCenter1, costCenterAttribute: costCenterAttribute1,
        },
        undefined,
        { name: 'Employee', descr: null, isContingentWorker: false });
        delete profile['@context'];
        delete profile['@metadataEtag'];

        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(profile, 'Expected a list of consultant\'s profile.');
        expect(profile).to.eql(expectedProfile);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one consultant\'s profile with worker type without authorization.'() {
        const response = await this.getWithoutAuthorization(`(${workforcePersonWithDescription1.ID})?$expand=workerType`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code to be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Creating a consultant\'s profile is not allowed.'() {
        const response = await this.create(createProfileData);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Creating a consultant\'s profile should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating the consultant\'s profile is not allowed.'() {
        const response = await this.update(`(${createProfileData.ID})`, createProfileData);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating consultant\'s profile should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Deleting the consultant\'s profile is not allowed.'() {
        const response = await this.delete(`(${workforcePersonWithDescription1.ID})`);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Deleting a consultant\'s profile should not be possible and expected status code should be 403(Forbidden).');
    }

    private prepareExpected(profile: { workforcePerson: WorkforcePerson, email: Email, photo: Photo, phone: Phone, profileDetail: ProfileDetail, jobDetail: JobDetail, managerWorkAssignment: WorkAssignment, organizationHeader: OrganizationHeader, resourceOrganization: ResourceOrganizations, costCenter: CostCenter, costCenterAttribute: CostCenterAttribute },
        manager?: { workAssignment: WorkAssignment, email: Email, photo: Photo, phone: Phone, profileDetail: ProfileDetail },
        workerType?: { name: string, descr: null, isContingentWorker: boolean }) {
        const preparedProfile = this.prepareProfile(profile);
        if (manager !== undefined) { preparedProfile.toManager = this.prepareManagerProfile(manager); }
        if (workerType !== undefined) { preparedProfile.workerType = this.prepareWorkerType(workerType); }
        return preparedProfile;
    }

    private prepareProfile(profile: { workforcePerson: WorkforcePerson, email: Email, photo: Photo, phone: Phone, profileDetail: ProfileDetail, jobDetail: JobDetail, managerWorkAssignment: WorkAssignment, organizationHeader: OrganizationHeader, resourceOrganization: ResourceOrganizations, costCenter: CostCenter, costCenterAttribute: CostCenterAttribute }) {
        const preparedProfile: ProfileData = {
            ID: profile.workforcePerson.ID,
            dataSubjectRole: 'Project Team Member',
            workerExternalID: profile.workforcePerson.externalID,
            emailAddress: profile.email.address,
            profilePhotoURL: profile.photo.imageURL,
            firstName: profile.profileDetail.firstName,
            lastName: profile.profileDetail.lastName,
            initials: profile.profileDetail.initials,
            mobilePhoneNumber: `+${profile.phone.number}`,
            name: `${profile.profileDetail.fullName} (${profile.workforcePerson.externalID})`,
            fullName: profile.profileDetail.fullName,
            role: profile.jobDetail.jobTitle,
            managerExternalID: profile.managerWorkAssignment.externalID,
            officeLocation: 'Germany',
            costCenter: profile.costCenter.costCenterID,
            costCenterDescription: profile.costCenterAttribute.description,
            resourceOrg: `${profile.resourceOrganization.name} (${profile.resourceOrganization.displayId})`,
            resourceOrgId: profile.resourceOrganization.displayId,
            isContingentWorker: false,
        };
        return preparedProfile;
    }

    private prepareManagerProfile(managerProfile: { workAssignment: WorkAssignment, email: Email, phone: Phone, profileDetail: ProfileDetail }) {
        const preparedManagerProfile: ManagerProfileData = {
            externalID: managerProfile.workAssignment.externalID,
            managerId: managerProfile.profileDetail.parent,
            mangerEmailAddress: managerProfile.email.address,
            managerMobilePhoneNumber: `+${managerProfile.phone.number}`,
            managerName: `${managerProfile.profileDetail.firstName} ${managerProfile.profileDetail.lastName} (${managerProfile.workAssignment.externalID})`,
            validFrom: managerProfile.workAssignment.startDate,
            validTo: managerProfile.workAssignment.endDate,
        };
        return preparedManagerProfile;
    }

    private prepareWorkerType(workerType: { name: string, descr: null, isContingentWorker: boolean }) {
        const preparedWorkerType: WorkerType = {
            name: workerType.name,
            descr: null,
            isContingentWorker: workerType.isContingentWorker,
        };
        return preparedWorkerType;
    }
}
