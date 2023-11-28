import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { promises as fs } from 'fs';
import { MyResourcesServiceRepository } from '../../utils/serviceRepository/MyResourcesService-Repository';
import { createAttachment } from '../../data/service/myProjectExperienceService/Attachment';
import { Attachment } from '../../serviceEntities/myProjectExperienceService/Attachment';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import {
    allAttachments,
    Attachment1,
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

@suite('MyResourcesService/Attachment')
export class MyResourcesAttachmentTest extends MyResourcesServiceRepository {
    public constructor() {
        super('Attachment');
    }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        await this.attachmentRepository.insertMany(allAttachments);
        await this.employeeHeaderRepository.insertMany(allEmployeeHeaders);
        await this.workforcePersonRepository.insertMany(allWorkforcePerson);
        await this.workAssignmentRepository.insertMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.insertMany(allWorkAssignmentDetail);
        await this.emailRepository.insertMany(allEmail);
        await this.profileDetailRepository.insertMany(allProfiles);
        await this.jobDetailRepository.insertMany(allJobDetails);
        await this.organizationDetailRepository.insertMany(allOrganizationDetails);
        await this.organizationHeaderRepository.insertMany(allOrganizationHeaders);
        await this.costCenterRepository.insertMany(allCostCenters);
        await this.resourceOrganizationsRepository.insertMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.insertMany(allResourceOrganizationItems);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.attachmentRepository.deleteMany(allAttachments);
        await this.employeeHeaderRepository.deleteMany(allEmployeeHeaders);
        await this.workforcePersonRepository.deleteMany(allWorkforcePerson);
        await this.workAssignmentRepository.deleteMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.deleteMany(allWorkAssignmentDetail);
        await this.emailRepository.deleteMany(allEmail);
        await this.profileDetailRepository.deleteMany(allProfiles);
        await this.jobDetailRepository.deleteMany(allJobDetails);
        await this.organizationDetailRepository.deleteMany(allOrganizationDetails);
        await this.organizationHeaderRepository.deleteMany(allOrganizationHeaders);
        await this.costCenterRepository.deleteMany(allCostCenters);
        await this.resourceOrganizationsRepository.deleteMany(allResourceOrganizations);
        await this.resourceOrganizationItemsRepository.deleteMany(allResourceOrganizationItems);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get one attachment.'() {
        const response = await this.get(`(ID=${Attachment1.ID},IsActiveEntity=true)`);
        this.responses.push(response);
        const attachment = response.data;
        delete attachment['@context'];
        delete attachment['@metadataEtag'];
        const expectedAttachment = this.prepareExpected(Attachment1);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(attachment, 'Expected one attachment.');
        expect(attachment).to.eql(expectedAttachment);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all attachments without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'get the attachment of a consultant for path /content'() {
        const response = await this.get(`(ID=${Attachment1.ID},IsActiveEntity=true)/content`);
        this.responses.push(response);
        assert.equal(response.status, 204);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating/Changing the attachment of a consultant.'() {
        this.responses.push(await this.enableDraftEdit(Attachment1.employee_ID));
        const response = await this.update(`(ID=${Attachment1.ID},IsActiveEntity=false)`, createAttachment);
        // this.responses.push(await this.activateDraft(Attachment1.employee_ID));
        this.responses.push(response);
        assert.equal(response.status, 403, 'Updating attachment should not be possible and expected status code should be 403(Forbidden).');
        const responseDraftDelete = await this.deleteDraft(Attachment1.employee_ID);
        this.responses.push(responseDraftDelete);
        assert.equal(responseDraftDelete.status, 204, 'Expected status code should be 200 (Ok).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'update the attachment of a consultant for path /content'() {
        const resume = await fs.readFile('./src/data/test.docx');
        const headers = {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        };
        this.responses.push(await this.enableDraftEdit(Attachment1.employee_ID));
        const response = await this.upsert(`(ID=${Attachment1.ID},IsActiveEntity=false)/content`, resume, { headers });
        // this.responses.push(await this.activateDraft(Attachment1.employee_ID));
        this.responses.push(response);
        assert.equal(response.status, 403, 'Upserting attachment should not be possible and expected status code should be 403(Forbidden).');
        const responseDraftDelete = await this.deleteDraft(Attachment1.employee_ID);
        this.responses.push(responseDraftDelete);
        assert.equal(responseDraftDelete.status, 204, 'Expected status code should be 200 (Ok).');
    }

    private prepareExpected(attachment: Attachment) {
        if (attachment !== undefined) {
            const expectedattachment: Attachment = {
                ID: attachment.ID,
                employee_ID: attachment.employee_ID,
                IsActiveEntity: true,
                createdAt: null!,
                createdBy: null!,
                modifiedAt: null!,
                modifiedBy: null!,
                fileName: null!,
                'content@mediaContentType': null!,
                HasActiveEntity: false,
                HasDraftEntity: false,
            };
            return expectedattachment;
        }
        return null;
    }
}
