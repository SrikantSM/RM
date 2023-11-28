import { ExternalWorkExperienceSkillAssignments } from './ExternalWorkExperienceSkillAssignments';

export interface ExternalWorkExperience {
    ID?: string;
    profileID?: string;
    company?: string;
    project?: string;
    customer?: string | null;
    role?: string;
    startDate?: string;
    endDate?: string;
    comments?: string | null;
    _skillAssignments?: ExternalWorkExperienceSkillAssignments[];
    changedAt?: string | null;
    changedBy?: string | null;
}
