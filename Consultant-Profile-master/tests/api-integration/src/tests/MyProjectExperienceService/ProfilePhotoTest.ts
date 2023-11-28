import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { promises as fs } from 'fs';
import { MyProjectExperienceServiceRepository } from '../../utils/serviceRepository/MyProjectExperienceService-Repository';
import {
    allProfilePhotos,
    ProfilePhoto1,
    allEmail,
    allEmployeeHeaders,
    allWorkforcePerson,
    allWorkAssignment,
    allWorkAssignmentDetail,
} from '../../data';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { createDeleteProfilePhoto } from '../../data/service/myProjectExperienceService/ProfilePhotos';
import { ProfilePhoto } from '../../serviceEntities/myProjectExperienceService/ProfilePhoto';

@suite('MyProjectExperienceService/ProfilePhoto')
export class ProfilePhotoTest extends MyProjectExperienceServiceRepository {
    public constructor() {
        super('ProfilePhoto');
    }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        await this.profilePhotoRepository.insertMany(allProfilePhotos);
        await this.employeeHeaderRepository.insertMany(allEmployeeHeaders);
        await this.workforcePersonRepository.insertMany(allWorkforcePerson);
        await this.workAssignmentRepository.insertMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.insertMany(allWorkAssignmentDetail);
        await this.emailRepository.insertMany(allEmail);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.profilePhotoRepository.deleteMany(allProfilePhotos);
        await this.employeeHeaderRepository.deleteMany(allEmployeeHeaders);
        await this.workforcePersonRepository.deleteMany(allWorkforcePerson);
        await this.workAssignmentRepository.deleteMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.deleteMany(allWorkAssignmentDetail);
        await this.emailRepository.deleteMany(allEmail);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all profile photos.'() {
        const response = await this.get();
        this.responses.push(response);
        const profilePhotos = response.data.value[0] as ProfilePhoto;
        const expectedProfilePhotos = this.prepareExpected(ProfilePhoto1);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(profilePhotos, 'Expected a list of profile photos.');
        expect(profilePhotos).to.eql(expectedProfilePhotos);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one profile photo.'() {
        const response = await this.get(`(ID=${ProfilePhoto1.ID},IsActiveEntity=true)`);
        this.responses.push(response);
        const profilePhotos = response.data;
        delete profilePhotos['@context'];
        delete profilePhotos['@metadataEtag'];
        const expectedProfilePhotos = this.prepareExpected(ProfilePhoto1);
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
    async 'Updating/Changing the profile photo of a consultant.'() {
        this.responses.push(await this.enableDraftEdit(ProfilePhoto1.employee_ID));
        const response = await this.update(`(ID=${ProfilePhoto1.ID},IsActiveEntity=false)`, createDeleteProfilePhoto);
        this.responses.push(await this.activateDraft(ProfilePhoto1.employee_ID));
        this.responses.push(response);
        assert.equal(response.status, 200, 'Updating/Changing profile photo of a consultant.');
        this.responses.push(await this.deleteDraft(ProfilePhoto1.employee_ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating/Changing the profile photo of a consultant without authorization.'() {
        const response = await this.updateWithoutAuthorization(`(ID=${ProfilePhoto1.ID},IsActiveEntity=false)`, createDeleteProfilePhoto);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'update the profile photo of a consultant for path /profileImage'() {
        const image = await fs.readFile('./src/data/ProfilePhoto.png');
        const headers = {
            'Content-Type': 'image/png',
        };
        this.responses.push(await this.enableDraftEdit(ProfilePhoto1.employee_ID));
        const response = await this.upsert(`(ID=${ProfilePhoto1.ID},IsActiveEntity=false)/profileImage`, image, { headers });
        this.responses.push(await this.activateDraft(ProfilePhoto1.employee_ID));
        this.responses.push(response);
        assert.equal(response.status, 204, 'Updating/Changing profile photo of a consultant.');
        this.responses.push(await this.deleteDraft(ProfilePhoto1.employee_ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'update the profile photo of a consultant for path /profileImage without authorization.'() {
        const image = await fs.readFile('./src/data/ProfilePhoto.png');
        const headers = {
            'Content-Type': 'image/png',
        };
        const response = await this.upsertWithoutAuthorization(`(ID=${ProfilePhoto1.ID},IsActiveEntity=false)/profileImage`, image, { headers });
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'get the profile photo of a consultant for path /profileImage'() {
        const response = await this.get(`(ID=${ProfilePhoto1.ID},IsActiveEntity=true)/profileImage`);
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected one profile photo.');
    }

    private prepareExpected(profilePhoto: ProfilePhoto) {
        if (profilePhoto !== undefined) {
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
                'profileImage@mediaContentType': null!,
                'profileThumbnail@mediaContentType': null!,
            };
            return expectedprofilePhoto;
        }
        return null;
    }
}
