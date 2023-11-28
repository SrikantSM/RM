import { MyProjectExperienceHeader } from './MyProjectExperienceHeader';
import { ProficiencyLevels } from './ProficiencyLevels';
import { ProfileData } from './ProfileData';
import { SkillMasterList } from './SkillMasterList';

export interface InternalWorkExperience {
    assignment_ID: string;
    resourceRequest_ID: string;
    assignmentStatus: string;
    requestName: string;
    requestDisplayId: string;
    companyName: string;
    customerName: string;
    rolePlayed: string;
    assignedCapacity: number;
    convertedAssignedCapacity: string;
    startDate: string;
    endDate: string;
    employee_ID: string;
    internalWorkExperienceSkills?: InternalWorkExperienceSkills[];
    employee?: MyProjectExperienceHeader;
    profile?: ProfileData;
    workItemName: string;
}

export interface InternalWorkExperienceSkills {
    assignment_ID: string;
    skillId: string;
    proficiencyLevelId: string;
    employee_ID: string;
    skill?: SkillMasterList[];
    proficiencyLevel?: ProficiencyLevels[];
    profile?: ProfileData[];
}
