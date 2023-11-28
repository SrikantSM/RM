import { MyProjectExperienceHeader } from './MyProjectExperienceHeader';
import { ProfileData } from './ProfileData';
import { SkillMasterList } from './SkillMasterList';
import { ProficiencyLevels } from './ProficiencyLevels';

export interface Skills {
    ID?: string;
    skill_ID?: string;
    employee_ID: string;
    HasDraftEntity?: boolean;
    HasActiveEntity?: boolean;
    IsActiveEntity?: boolean;
    modifiedAt?: Date;
    createdAt?: Date;
    createdBy?: string;
    modifiedBy?: string;
    skill?: SkillMasterList;
    employee?: MyProjectExperienceHeader;
    profile?: ProfileData;
    proficiencyLevel_ID?: String;
    proficiencyLevel?: ProficiencyLevels;
    proficiencyLevelEditMode?: number;
}
