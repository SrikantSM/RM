import { PrimaryWorkAssignment } from './PrimaryWorkAssignment';
import { SkillAssignments } from './SkillAssignments';
import { ExternalWorkExperience } from './ExternalWorkExperience';

export interface Profiles {
    ID: string;
    workforcePersonExternalID?: string;
    emailAddress: string;
    mobileNumber?: string;
    firstName?: string;
    lastName?: string;
    changedAt?: string | null;
    _primaryWorkAssignment?: PrimaryWorkAssignment;
    _skillAssignments?: SkillAssignments[];
    _externalWorkExperience?: ExternalWorkExperience[];
}
