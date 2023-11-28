import { MyProjectExperienceHeader } from './MyProjectExperienceHeader';
import { ProfileData } from './ProfileData';
import { SkillMasterList } from './SkillMasterList';
import { ProficiencyLevels } from './ProficiencyLevels';

export interface ExternalWorkExperience {
    ID: string;
    IsActiveEntity?: boolean;
    HasActiveEntity?: boolean;
    HasDraftEntity?: boolean;
    modifiedAt?: string;
    createdAt?: string;
    createdBy?: string;
    modifiedBy?: string;
    companyName: string;
    projectName: string;
    workPackage?: string;
    customer?: string;
    rolePlayed: string;
    startDate?: string;
    endDate?: string;
    comments: string;
    employee_ID: string;
    externalWorkExperienceSkills?: ExternalWorkExperienceSkills[];
    employee?: MyProjectExperienceHeader[];
    profile?: ProfileData[];
}

export interface ExternalWorkExperienceSkills {
    ID: string;
    IsActiveEntity?: boolean;
    HasActiveEntity?: boolean;
    HasDraftEntity?: boolean;
    modifiedAt?: string;
    createdAt?: string;
    createdBy?: string;
    modifiedBy?: string;
    workExperience_ID: string;
    skill_ID?: string;
    employee_ID: string;
    workExperience?: ExternalWorkExperience[];
    skill?: SkillMasterList[];
    profile?: ProfileData[];
    proficiencyLevel_ID?: string;
    proficiencyLevel?: ProficiencyLevels;
    proficiencyLevelEditMode?: number;
}
