import {
    TestEnvironment, IEnvironment, SkillAssignment, RoleAssignment, EmployeeHeader, WorkAssignment, WorkforcePerson, ResourceHeader, ProfileDetail, Phone, Email, ExternalWorkExperience, ExternalWorkExperienceSkill, OrganizationDetail, JobDetail, ResourceCapacity, OrganizationHeader, CostCenter, AvailabilityReplicationSummary, WorkAssignmentDetail, ProfilePhoto, Attachment,
} from 'test-commons';

export async function getInsertStaticDataConsultantProfileEntitiesPromises(testEnvironmentInstance: TestEnvironment<IEnvironment>, data: any): Promise<any> {
    console.log('getInsertStaticDataConsultantProfileEntitiesPromises is called.');
    let promiseArray = [];

    if(data.projectRoles !== undefined && data.oneMDSDeltaTokenInfos !== undefined) {
        promiseArray.push((await testEnvironmentInstance.getProjectRoleRepository()).insertMany(data.projectRoles));
        promiseArray.push((await testEnvironmentInstance.getOneMDSDeltaTokenInfoRepository()).insertMany(data.oneMDSDeltaTokenInfos));
    }
    else {
        console.error('getInsertStaticDataConsultantProfileEntitiesPromises data is invalid: ', data);
        process.exit(1);
    }
    return Promise.all(promiseArray);
}

export async function getInsertDynamicDataConsultantProfileEntitiesPromises(testEnvironmentInstance: TestEnvironment<IEnvironment>, data: Map<string, any[]>): Promise<any> {
    console.log('getInsertDynamicDataConsultantProfileEntitiesPromises is called.');
    const employeeHeadersData: EmployeeHeader[] = data.get('employeeHeaders')!;
    const roleAssignmentsData: RoleAssignment[] = data.get('roleAssignments')!;
    const skillAssignmentsData: SkillAssignment[] = data.get('skillAssignments')!;
    const workAssignmentsData: WorkAssignment[] = data.get('workAssignments')!;
    const workAssignmentDetailsData: WorkAssignmentDetail[] = data.get('workAssignmentDetails')!;
    const workforcePersonsData: WorkforcePerson[] = data.get('workforcePersons')!;
    const resourceHeadersData: ResourceHeader[] = data.get('resourceHeaders')!;
    const profileDetailsData: ProfileDetail[] = data.get('profileDetails')!;
    const phonesData: Phone[] = data.get('phones')!;
    const emailsData: Email[] = data.get('emails')!;
    const externalWorkExperiencesData: ExternalWorkExperience[] = data.get('externalWorkExperiences')!;
    const externalWorkExperienceSkillsData: ExternalWorkExperienceSkill[] = data.get('externalWorkExperienceSkills')!;
    const jobDetailsData: JobDetail[] = data.get('jobDetails')!;
    const resourceCapacitiesData: ResourceCapacity[] = data.get('resourceCapacities')!;
    const organizationHeadersData: OrganizationHeader[] = data.get('organizationHeaders')!;
    const organizationDetailsData: OrganizationDetail[] = data.get('organizationDetails')!;
    const costCentersData: CostCenter[] = data.get('costCenters')!;
    const availabilityReplicationSummariesData: AvailabilityReplicationSummary[] = data.get('availabilityReplicationSummaries')!;
    const profilePhotosData: ProfilePhoto[] = data.get('profilePhotos')!;
    const attachmentData: Attachment[] = data.get('attachments')!;
    let promiseArray = [];

    if (employeeHeadersData !== undefined && roleAssignmentsData !== undefined && skillAssignmentsData !== undefined && workAssignmentsData !== undefined && workAssignmentDetailsData !== undefined && workforcePersonsData !== undefined && resourceHeadersData !== undefined && profileDetailsData !== undefined && phonesData !== undefined && emailsData !== undefined && externalWorkExperiencesData !== undefined && externalWorkExperienceSkillsData !== undefined && organizationDetailsData !== undefined && jobDetailsData !== undefined && resourceCapacitiesData !== undefined && profilePhotosData !== undefined && attachmentData !== undefined) {
        promiseArray.push((await testEnvironmentInstance.getEmployeeHeaderRepository()).insertMany(employeeHeadersData));
        promiseArray.push((await testEnvironmentInstance.getRoleAssignmentRepository()).insertMany(roleAssignmentsData));
        promiseArray.push((await testEnvironmentInstance.getSkillAssignmentRepository()).insertMany(skillAssignmentsData));
        promiseArray.push((await testEnvironmentInstance.getWorkAssignmentRepository()).insertMany(workAssignmentsData));
        promiseArray.push((await testEnvironmentInstance.getWorkAssignmentDetailRepository()).insertMany(workAssignmentDetailsData));
        promiseArray.push((await testEnvironmentInstance.getWorkforcePersonRepository()).insertMany(workforcePersonsData));
        promiseArray.push((await testEnvironmentInstance.getResourceHeaderRepository()).insertMany(resourceHeadersData));
        promiseArray.push((await testEnvironmentInstance.getProfileDetailRepository()).insertMany(profileDetailsData));
        promiseArray.push((await testEnvironmentInstance.getPhoneRepository()).insertMany(phonesData));
        promiseArray.push((await testEnvironmentInstance.getEmailRepository()).insertMany(emailsData));
        promiseArray.push((await testEnvironmentInstance.getExternalWorkExperienceRepository()).insertMany(externalWorkExperiencesData));
        promiseArray.push((await testEnvironmentInstance.getExternalWorkExperienceSkillRepository()).insertMany(externalWorkExperienceSkillsData));
        promiseArray.push((await testEnvironmentInstance.getJobDetailRepository()).insertMany(jobDetailsData));
        promiseArray.push((await testEnvironmentInstance.getResourceCapacityRepository()).insertMany(resourceCapacitiesData));
        promiseArray.push((await testEnvironmentInstance.getOrganizationHeaderRepository()).insertMany(organizationHeadersData));
        promiseArray.push((await testEnvironmentInstance.getOrganizationDetailRepository()).insertMany(organizationDetailsData));
        promiseArray.push((await testEnvironmentInstance.getCostCenterRepository()).insertMany(costCentersData));
        promiseArray.push((await testEnvironmentInstance.getAvailabilityReplicationSummaryRepository()).insertMany(availabilityReplicationSummariesData));
        promiseArray.push((await testEnvironmentInstance.getProfilePhotoRepository()).insertMany(profilePhotosData));
        promiseArray.push((await testEnvironmentInstance.getAttachmentRepository()).insertMany(attachmentData));
    }
    else {
        console.error('getInsertDynamicDataConsultantProfileEntitiesPromises data is invalid: ', data);
        process.exit(1);
    }
    return Promise.all(promiseArray);
}
