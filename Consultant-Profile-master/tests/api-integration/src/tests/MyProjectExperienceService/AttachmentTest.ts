import { suite, timeout, test } from 'mocha-typescript';
import { assert, expect } from 'chai';
import { promises as fs } from 'fs';
import { MyProjectExperienceServiceRepository } from '../../utils/serviceRepository/MyProjectExperienceService-Repository';
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
} from '../../data';

@suite('MyProjectExperienceService/Attachment')
export class AttachmentTest extends MyProjectExperienceServiceRepository {
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
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.attachmentRepository.deleteMany(allAttachments);
        await this.employeeHeaderRepository.deleteMany(allEmployeeHeaders);
        await this.workforcePersonRepository.deleteMany(allWorkforcePerson);
        await this.workAssignmentRepository.deleteMany(allWorkAssignment);
        await this.workAssignmentDetailRepository.deleteMany(allWorkAssignmentDetail);
        await this.emailRepository.deleteMany(allEmail);
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
    async 'Get a list of all attachments.'() {
        const response = await this.get();
        this.responses.push(response);
        const attachments = response.data.value[0] as Attachment;
        const expectedAttachments = this.prepareExpected(Attachment1);
        assert.equal(response.status, 200, 'Expected status code should be 200 (Ok).');
        assert.isDefined(attachments, 'Expected a list of attachments.');
        expect(attachments).to.eql(expectedAttachments);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Get a list of all attachments without authorization.'() {
        const response = await this.getWithoutAuthorization();
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating/Changing the attachment of a consultant.'() {
        this.responses.push(await this.enableDraftEdit(Attachment1.employee_ID));
        const response = await this.update(`(ID=${Attachment1.ID},IsActiveEntity=false)`, createAttachment);
        this.responses.push(await this.activateDraft(Attachment1.employee_ID));
        this.responses.push(response);
        assert.equal(response.status, 200, 'Updating/Changing attachment of a consultant.');
        this.responses.push(await this.deleteDraft(Attachment1.employee_ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Updating/Changing the attachment of a consultant without authorization.'() {
        const response = await this.updateWithoutAuthorization(`(ID=${Attachment1.ID},IsActiveEntity=false)`, createAttachment);
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'update the attachment of a consultant for path /content'() {
        const resume = await fs.readFile('./src/data/test.docx');
        const headers = {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        };
        this.responses.push(await this.enableDraftEdit(Attachment1.employee_ID));
        const response = await this.upsert(`(ID=${Attachment1.ID},IsActiveEntity=false)/content`, resume, { headers });
        this.responses.push(await this.activateDraft(Attachment1.employee_ID));
        this.responses.push(response);
        assert.equal(response.status, 204, 'Updating/Changing attachment of a consultant.');
        this.responses.push(await this.deleteDraft(Attachment1.employee_ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'update the attachment of a consultant for path /content without authorization.'() {
        const resume = await fs.readFile('./src/data/test.docx');
        const headers = {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        };
        const response = await this.upsertWithoutAuthorization(`(ID=${Attachment1.ID},IsActiveEntity=false)/content`, resume, { headers });
        this.responses.push(response);
        assert.equal(response.status, 403, 'Expected status code should be 403 (Forbidden).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'get the attachment of a consultant for path /content'() {
        const response = await this.get(`(ID=${Attachment1.ID},IsActiveEntity=true)/content`);
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected one attachment.');
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
                HasActiveEntity: false,
                HasDraftEntity: false,
                'content@mediaContentType': null!,
            };
            return expectedattachment;
        }
        return null;
    }
}
