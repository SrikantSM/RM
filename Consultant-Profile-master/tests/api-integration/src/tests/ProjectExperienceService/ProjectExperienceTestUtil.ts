import {
    EmployeeHeader, WorkforcePerson, Email, Phone, ProfileDetail, CostCenter, JobDetail, WorkAssignment, Skill, SkillAssignment, ProficiencyLevel, ExternalWorkExperience, WorkforceAvailability,
} from 'test-commons';
import { WorkforceAvailability as WorkforceAvailabilityEntity, WorkforceAvailabilityInterval, WorkforceAvailabilitySupplement } from '../../serviceEntities/workforceAvailabillityService';
import {
    PrimaryWorkAssignment, Profiles, SkillAssignments, ExternalWorkExperience as ExternalWorkExperienceServiceEntity, ExternalWorkExperienceSkillAssignments,
} from '../../serviceEntities/projectExperienceService';

export class ProjectExperienceTestUtil {
    static async parseBatchResponse(responseBody: String, isArray: Boolean) {
        if (isArray) {
            const startResponse = responseBody.indexOf('"value":');
            const responseObject = responseBody.substring(startResponse + 8, responseBody.length - 18);
            return responseObject;
        }
        const startResponse = responseBody.indexOf('{"@context"');
        const completeResponseObject = responseBody.substring(startResponse, responseBody.length - 16);
        const responseObjectJson = JSON.parse(completeResponseObject);
        delete responseObjectJson['@context'];
        delete responseObjectJson['@metadataEtag'];
        return JSON.stringify(responseObjectJson);
    }

    static async parseBatchErrorResponse(responseBody: String) {
        const startResponse = responseBody.indexOf('{"error"');
        const completeResponseObject = responseBody.substring(startResponse, responseBody.length - 16);
        const responseObjectJson = JSON.parse(completeResponseObject);
        return JSON.stringify(responseObjectJson);
    }

    static async parseBatchResponseStatus(responseBody: String) {
        const regex = /HTTP\/1.1.*\r\n/i;
        const found = responseBody.match(regex);
        if (found) {
            const responseCodeString = found.toString();
            const startResponseCode = responseCodeString.indexOf('HTTP/1.1');
            const responseCode = responseCodeString.substring(startResponseCode + 9, found[0].length - 2);
            return responseCode;
        }
        return '';
    }

    static prepareBatchGetPayload(endpoint: string) {
        const batchContents = [];
        batchContents.push('--batch-123');
        batchContents.push('Content-Type: application/http');
        batchContents.push('');
        batchContents.push(`GET ${endpoint} HTTP/1.1`);
        batchContents.push('');
        batchContents.push('');
        batchContents.push('--batch-123--');
        const batchBody = batchContents.join('\n');
        return batchBody;
    }

    static prepareBatchPayload(method: string, endpoint: string, body: string) {
        const batchContents = [];
        batchContents.push('--batch-123');
        batchContents.push('Content-Type: application/http');
        batchContents.push('');
        batchContents.push(`${method} ${endpoint} HTTP/1.1`);
        batchContents.push('Content-Type: application/json');
        batchContents.push('');
        batchContents.push(body);
        batchContents.push('');
        batchContents.push('--batch-123--');
        const batchBody = batchContents.join('\n');
        return batchBody;
    }

    static prepareProfile(employeeHeader: EmployeeHeader, workforcePerson: WorkforcePerson, email: Email, phone: Phone, profileDetail: ProfileDetail) {
        const preparedProfile: Profiles = {
            ID: employeeHeader.ID,
            workforcePersonExternalID: workforcePerson.externalID,
            firstName: profileDetail.firstName,
            lastName: profileDetail.lastName,
            emailAddress: email.address,
            mobileNumber: `+${phone.number}`,
            changedAt: null,
        };
        return preparedProfile;
    }

    static preparePrimaryWorkAssignment(workAssignment: WorkAssignment, jobDetail: JobDetail, costCenter: CostCenter) {
        const preparedPrimaryWorkAssignment: PrimaryWorkAssignment = {
            profileID: workAssignment.parent,
            jobTitle: jobDetail.jobTitle,
            managerWorkAssignmentExternalID: jobDetail.supervisorWorkAssignmentExternalID,
            officeLocation: 'Germany',
            costCenterID: costCenter.costCenterID,
            costCenterDisplayName: costCenter.displayName,
            workAssignmentID: workAssignment.workAssignmentID,
            resourceID: workAssignment.ID,
        };
        return preparedPrimaryWorkAssignment;
    }

    static prepareSkillAssignments(skillAssignment: SkillAssignment, skill: Skill, proficiencyLevel: ProficiencyLevel) {
        const preparedSkillAssignment: SkillAssignments = {
            ID: skillAssignment.ID,
            profileID: skillAssignment.employee_ID,
            skillID: skillAssignment.skill_ID,
            proficiencyLevelID: proficiencyLevel.ID,
            skillName: skill.name,
            proficiencyLevelName: proficiencyLevel.name,
            skillUsage: skill.lifecycleStatus_code,
            changedAt: null,
            changedBy: null,
        };
        return preparedSkillAssignment;
    }

    static prepareSkillAssignmentsRequestBody(skillAssignmentID: string, profileID?: string, skillID?: string, proficiencyLevelID?: string) {
        const preparedSkillAssignment = {} as SkillAssignments;
        if (skillAssignmentID) {
            preparedSkillAssignment.ID = skillAssignmentID;
        }
        if (profileID) {
            preparedSkillAssignment.profileID = profileID;
        }
        if (skillID) {
            preparedSkillAssignment.skillID = skillID;
        }
        if (proficiencyLevelID) {
            preparedSkillAssignment.proficiencyLevelID = proficiencyLevelID;
        }
        return preparedSkillAssignment;
    }

    static prepareAvailability(availability: WorkforceAvailability) {
        const preparedAvailability: WorkforceAvailabilityEntity = {
            id: availability.id,
            workAssignmentID: availability.workAssignmentID,
            workforcePerson_ID: availability.workforcePerson_ID,
            availabilityDate: availability.availabilityDate,
            normalWorkingTime: availability.normalWorkingTime,
            availabilityIntervals: availability.availabilityIntervals,
            availabilitySupplements: availability.availabilitySupplements,
        };
        return preparedAvailability;
    }

    static prepareExternalWorkExperience(externalWorkExperience: ExternalWorkExperience) {
        const preparedExternalWorkExperience: ExternalWorkExperienceServiceEntity = {
            ID: externalWorkExperience.ID,
            profileID: externalWorkExperience.employee_ID,
            company: externalWorkExperience.companyName,
            project: externalWorkExperience.projectName,
            customer: externalWorkExperience.customer,
            role: externalWorkExperience.rolePlayed,
            startDate: externalWorkExperience.startDate,
            endDate: externalWorkExperience.endDate,
            comments: externalWorkExperience.comments,
            changedAt: null,
            changedBy: null,
        };
        return preparedExternalWorkExperience;
    }

    static prepareExternalWorkExperienceRequestBody(ExternalWorkExperienceID: string, profileID?: string, company?: string, project?: string, role?: string, startDate?: string, endDate?: string) {
        const preparedExternalWorkExperience = {} as ExternalWorkExperienceServiceEntity;
        if (ExternalWorkExperienceID) {
            preparedExternalWorkExperience.ID = ExternalWorkExperienceID;
        }
        if (profileID) {
            preparedExternalWorkExperience.profileID = profileID;
        }
        if (company) {
            preparedExternalWorkExperience.company = company;
        }
        if (project) {
            preparedExternalWorkExperience.project = project;
        }
        if (role) {
            preparedExternalWorkExperience.role = role;
        }
        if (startDate) {
            preparedExternalWorkExperience.startDate = startDate;
        }
        if (endDate) {
            preparedExternalWorkExperience.endDate = endDate;
        }
        return preparedExternalWorkExperience;
    }

    static prepareExternalWorkExperienceSkillAssignments(externalWorkExperience: ExternalWorkExperience, skillAssignment: SkillAssignment, skill: Skill, proficiencyLevel: ProficiencyLevel) {
        const preparedSkillAssignment: ExternalWorkExperienceSkillAssignments = {
            ID: skillAssignment.ID,
            externalWorkExperienceID: externalWorkExperience.ID,
            profileID: skillAssignment.employee_ID,
            skillID: skillAssignment.skill_ID,
            proficiencyLevelID: proficiencyLevel.ID,
            skillName: skill.name,
            proficiencyLevelName: proficiencyLevel.name,
            skillUsage: skill.lifecycleStatus_code,
            changedAt: null,
            changedBy: null,
        };
        return preparedSkillAssignment;
    }

    static prepareExternalWorkExperienceSkillAssignmentsRequestBody(ExternalWorkExperienceSkillAssignmentID: string, externalWorkExperienceID?: string, profileID?: string, skillID?: string, proficiencyLevelID?: string) {
        const preparedExternalWorkExperienceSkillAssignment = {} as ExternalWorkExperienceSkillAssignments;
        if (ExternalWorkExperienceSkillAssignmentID) {
            preparedExternalWorkExperienceSkillAssignment.ID = ExternalWorkExperienceSkillAssignmentID;
        }
        if (externalWorkExperienceID) {
            preparedExternalWorkExperienceSkillAssignment.externalWorkExperienceID = externalWorkExperienceID;
        }
        if (profileID) {
            preparedExternalWorkExperienceSkillAssignment.profileID = profileID;
        }
        if (skillID) {
            preparedExternalWorkExperienceSkillAssignment.skillID = skillID;
        }
        if (proficiencyLevelID) {
            preparedExternalWorkExperienceSkillAssignment.proficiencyLevelID = proficiencyLevelID;
        }
        return preparedExternalWorkExperienceSkillAssignment;
    }

    static prepareAvailabilityRequestBody(AvailabilityID?: string, workAssignmentID?: string, workforcePerson_ID?: string, availabilityDate?: string, normalWorkingTime?: string, availabilityIntervals?: WorkforceAvailabilityInterval[], availabilitySupplements?: WorkforceAvailabilitySupplement[]) {
        const preparedAvailability = {} as WorkforceAvailabilityEntity;
        if (AvailabilityID) {
            preparedAvailability.id = AvailabilityID;
        }
        if (workAssignmentID) {
            preparedAvailability.workAssignmentID = workAssignmentID;
        }
        if (workforcePerson_ID) {
            preparedAvailability.workforcePerson_ID = workforcePerson_ID;
        }
        if (availabilityDate) {
            preparedAvailability.availabilityDate = availabilityDate;
        }
        if (normalWorkingTime) {
            preparedAvailability.normalWorkingTime = normalWorkingTime;
        }
        if (availabilityIntervals) {
            preparedAvailability.availabilityIntervals = availabilityIntervals;
        }
        if (availabilitySupplements) {
            preparedAvailability.availabilitySupplements = availabilitySupplements;
        }
        return preparedAvailability;
    }
}
