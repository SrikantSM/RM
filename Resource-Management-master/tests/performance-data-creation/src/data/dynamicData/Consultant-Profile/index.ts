import { RoleAssignment, EmployeeHeader, SkillAssignment, WorkAssignment, WorkforcePerson, ResourceHeader, ProfileDetail, Phone, Email, ExternalWorkExperience, ExternalWorkExperienceSkill, OrganizationDetail, JobDetail, ResourceCapacity, OrganizationHeader, CostCenter, AvailabilityReplicationSummary, WorkAssignmentDetail, ProfilePhoto } from 'test-commons';
import { getEmployeeHeadersBatchDynamicData } from './employeeHeaders';
import { getRoleAssignmentsBatchDynamicData } from './roleAssignments';
import { getSkillAssignmentsBatchDynamicData } from './skillAssignments';
import { getWorkAssignmentsBatchDynamicData } from './workAssignments';
import { getWorkAssignmentDetailsBatchDynamicData } from './workAssignmentDetails';
import { getWorkforcePersonsBatchDynamicData } from './workforcePersons';
import { getResourceHeadersBatchDynamicData } from './resourceHeaders';
import { getProfileDetailsBatchDynamicData } from './profileDetails';
import { getPhonesBatchDynamicData } from './phones';
import { getEmailsBatchDynamicData } from './emails';
import { getExternalWorkExperiencesBatchDynamicData } from './externalWorkExperiences';
import { getExternalWorkExperienceSkillsBatchDynamicData } from './externalWorkExperienceSkills';
import { getOrganizationHeadersBatchDynamicData } from './organizationHeaders';
import { getOrganizationDetailsBatchDynamicData } from './organizationDetails';
import { getCostCenterBatchDynamicData } from './costCenters';
import { getJobDetailsBatchDynamicData } from './jobDetails';
import { getResourceCapacitiesBatchDynamicData } from './resourceCapacities';
import { getAvailabilityReplicationSummaryBatchDynamicData} from './availabilityReplicationSummary';
import { getProfilePhotosBatchDynamicData } from './profilePhotos';
import { getAttachmentsBatchDynamicData } from './attachment';

//* ***********Function to collect all the ConsultantProfile entities data for each Batch in a Map( key: entityName, value: array of corresponding entities)
export async function getConsultantProfileBatchDynamicData(batchNum: number) {
    console.log('getConsultantProfileBatchDynamicData is called for batchNum: ', batchNum);
    const consultantProfileBatchDynamicData = new Map<string, any[]>();
    const employeeHeaders: EmployeeHeader[] = getEmployeeHeadersBatchDynamicData(batchNum);
    consultantProfileBatchDynamicData.set('employeeHeaders', employeeHeaders);
    const roleAssignments: RoleAssignment[] = getRoleAssignmentsBatchDynamicData(batchNum);
    consultantProfileBatchDynamicData.set('roleAssignments', roleAssignments);
    const skillAssignments: SkillAssignment[] = getSkillAssignmentsBatchDynamicData(batchNum);
    consultantProfileBatchDynamicData.set('skillAssignments', skillAssignments);
    const workAssignments: WorkAssignment[] = getWorkAssignmentsBatchDynamicData(batchNum);
    consultantProfileBatchDynamicData.set('workAssignments', workAssignments);
    const workAssignmentDetails: WorkAssignmentDetail[] = getWorkAssignmentDetailsBatchDynamicData(batchNum);
    consultantProfileBatchDynamicData.set('workAssignmentDetails', workAssignmentDetails);
    const workforcePersons: WorkforcePerson[] = getWorkforcePersonsBatchDynamicData(batchNum);
    consultantProfileBatchDynamicData.set('workforcePersons', workforcePersons);
    const resourceHeaders: ResourceHeader[] = getResourceHeadersBatchDynamicData(batchNum);
    consultantProfileBatchDynamicData.set('resourceHeaders', resourceHeaders);
    const profileDetails: ProfileDetail[] = getProfileDetailsBatchDynamicData(batchNum);
    consultantProfileBatchDynamicData.set('profileDetails', profileDetails);
    const phones: Phone[] = getPhonesBatchDynamicData(batchNum);
    consultantProfileBatchDynamicData.set('phones', phones);
    const emails: Email[] = getEmailsBatchDynamicData(batchNum);
    consultantProfileBatchDynamicData.set('emails', emails);
    const externalWorkExperiences: ExternalWorkExperience[] = getExternalWorkExperiencesBatchDynamicData(batchNum);
    consultantProfileBatchDynamicData.set('externalWorkExperiences', externalWorkExperiences);
    const externalWorkExperienceSkills: ExternalWorkExperienceSkill[] = getExternalWorkExperienceSkillsBatchDynamicData(batchNum);
    consultantProfileBatchDynamicData.set('externalWorkExperienceSkills', externalWorkExperienceSkills);
    const organizationHeaders: OrganizationHeader[] = getOrganizationHeadersBatchDynamicData(batchNum);
    consultantProfileBatchDynamicData.set('organizationHeaders', organizationHeaders);
    const organizationDetails: OrganizationDetail[] = getOrganizationDetailsBatchDynamicData(batchNum);
    consultantProfileBatchDynamicData.set('organizationDetails', organizationDetails);
    const costCenters: CostCenter[] = getCostCenterBatchDynamicData(batchNum);
    consultantProfileBatchDynamicData.set('costCenters', costCenters);
    const jobDetails: JobDetail[] = getJobDetailsBatchDynamicData(batchNum);
    consultantProfileBatchDynamicData.set('jobDetails', jobDetails);
    const resourceCapacities: ResourceCapacity[] = getResourceCapacitiesBatchDynamicData(batchNum);
    consultantProfileBatchDynamicData.set('resourceCapacities', resourceCapacities);
    const availabilityReplicationSummaries: AvailabilityReplicationSummary[] = getAvailabilityReplicationSummaryBatchDynamicData(batchNum);
    consultantProfileBatchDynamicData.set('availabilityReplicationSummaries', availabilityReplicationSummaries);
    const profilePhotos = await getProfilePhotosBatchDynamicData(batchNum);
    consultantProfileBatchDynamicData.set('profilePhotos', profilePhotos!);
    const attachment = await getAttachmentsBatchDynamicData(batchNum);
    consultantProfileBatchDynamicData.set('attachments', attachment!);
    return consultantProfileBatchDynamicData;
}