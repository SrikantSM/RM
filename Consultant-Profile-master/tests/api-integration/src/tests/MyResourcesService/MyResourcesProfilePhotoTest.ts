import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { promises as fs } from 'fs';
import {
    allProfilePhotos,
    ProfilePhoto1,
    ProfilePhoto3,
    allEmail,
    allEmployeeHeaders,
    allWorkforcePerson,
    allWorkAssignment,
    allWorkAssignmentDetail,
    allCostCenters,
    allProfiles,
    allJobDetails,
    allOrganizationDetails,
    allOrganizationHeaders,
    allResourceOrganizationItems,
    allResourceOrganizations,
} from '../../data';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { ProfilePhoto } from '../../serviceEntities/myProjectExperienceService/ProfilePhoto';
import { MyResourcesServiceRepository } from '../../utils/serviceRepository/MyResourcesService-Repository';
import { createDeleteProfilePhoto } from '../../data/service/myProjectExperienceService';

@suite('MyResourcesService/ProfilePhoto')
export class MyResourcesProfilePhotoTest extends MyResourcesServiceRepository {
    public constructor() {
        super('ProfilePhoto');
    }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        const profileImage = await fs.readFile('./src/data/ProfilePhoto.png');
        const profileImageBuf = Buffer.from(profileImage).toString('hex');
        ProfilePhoto1.profileImage = profileImageBuf;
        ProfilePhoto3.profileImage = profileImageBuf;
        await this.profilePhotoRepository.insertMany(allProfilePhotos);
        await this.employeeHeaderRepository.insertMany(allEmployeeHeaders);
        await this.workforcePersonRepository.insertMany(allWorkforcePerson);
        await this.profileDetailRepository.insertMany(allProfiles);
        await this.workAssignmentRepository.insertMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.insertMany(allWorkAssignmentDetail);
        await this.emailRepository.insertMany(allEmail);
        await this.jobDetailRepository.insertMany(allJobDetails);
        await this.organizationDetailRepository.insertMany(allOrganizationDetails);
        await this.organizationHeaderRepository.insertMany(allOrganizationHeaders);
        await this.costCenterRepository.insertMany(allCostCenters);
        await this.resourceOrganizationsRepository.insertMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.insertMany(allResourceOrganizationItems);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.profilePhotoRepository.deleteMany(allProfilePhotos);
        await this.employeeHeaderRepository.deleteMany(allEmployeeHeaders);
        await this.workforcePersonRepository.deleteMany(allWorkforcePerson);
        await this.profileDetailRepository.deleteMany(allProfiles);
        await this.workAssignmentRepository.deleteMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.deleteMany(allWorkAssignmentDetail);
        await this.emailRepository.deleteMany(allEmail);
        await this.jobDetailRepository.deleteMany(allJobDetails);
        await this.organizationDetailRepository.deleteMany(allOrganizationDetails);
        await this.organizationHeaderRepository.deleteMany(allOrganizationHeaders);
        await this.costCenterRepository.deleteMany(allCostCenters);
        await this.resourceOrganizationsRepository.deleteMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.deleteMany(allResourceOrganizationItems);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all profile photos.'() {
        const response = await this.get();
        this.responses.push(response);
        const profilePhotos = response.data.value as ProfilePhoto;
        const expectedProfilePhotos = this.prepareExpectedProfilePhotos([ProfilePhoto1, ProfilePhoto3]);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(profilePhotos, 'Expected a list of profile photos.');
        expect(profilePhotos).to.deep.include.any.members(expectedProfilePhotos);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one profile photo.'() {
        const response = await this.get(`(ID=${ProfilePhoto3.ID},IsActiveEntity=true)`);
        this.responses.push(response);
        const profilePhotos = response.data;
        delete profilePhotos['@context'];
        delete profilePhotos['@metadataEtag'];
        const expectedProfilePhotos = this.prepareExpectedProfilePhoto(ProfilePhoto3);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(profilePhotos, 'Expected one profile photo.');
        expect(profilePhotos).to.eql(expectedProfilePhotos);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all profile photos without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'get the profile photo of a consultant for path /profileImage'() {
        const response = await this.get(`(ID=${ProfilePhoto3.ID},IsActiveEntity=true)/profileImage`);
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code to be 200.');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating/Changing the profile photo of a consultant.'() {
        const response = await this.update(`(ID=${ProfilePhoto1.ID},IsActiveEntity=false)`, createDeleteProfilePhoto);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating profile photo should not be possible and expected status code should be 403(Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'update the profile photo of a consultant for path /profileImage'() {
        const image = await fs.readFile('./src/data/ProfilePhoto.png');
        const headers = {
            'Content-Type': 'image/png',
        };
        const response = await this.upsert(`(ID=${ProfilePhoto1.ID},IsActiveEntity=false)/profileImage`, image, { headers });
        this.responses.push(response);
        assert.equal(response.status, 403, 'Upserting profile photo should not be possible and expected status code should be 403(Forbidden).');
    }

    private prepareExpectedProfilePhotos(profilePhotos: ProfilePhoto[]) {
        const expectedprofilePhotos: ProfilePhoto[] = [];
        profilePhotos.forEach((profilePhoto) => {
            const expectedprofilePhoto: ProfilePhoto = this.prepareExpectedProfilePhoto(profilePhoto);
            expectedprofilePhotos.push(expectedprofilePhoto);
        });
        return expectedprofilePhotos;
    }

    private prepareExpectedProfilePhoto(profilePhoto: ProfilePhoto) {
        const expectedprofilePhoto: ProfilePhoto = {
            ID: profilePhoto.ID,
            employee_ID: profilePhoto.employee_ID,
            IsActiveEntity: true,
            createdAt: null!,
            createdBy: null!,
            modifiedAt: null!,
            modifiedBy: null!,
            fileName: null!,
            HasActiveEntity: false,
            HasDraftEntity: false,
            'profileImage@mediaContentType': 'image/jpeg',
            'profileThumbnail@mediaContentType': null!,
        };
        return expectedprofilePhoto;
    }
}
