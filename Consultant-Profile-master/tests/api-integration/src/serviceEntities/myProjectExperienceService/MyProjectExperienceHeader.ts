import { ProfileData } from './ProfileData';
import { RoleMasterList } from './RoleMasterList';
import { SkillMasterList } from './SkillMasterList';

export interface MyProjectExperienceHeader {
    ID: string;
    commaSeparatedSkills?: string;
    commaSeparatedRoles?: string;
    IsActiveEntity?: boolean;
    HasActiveEntity?: boolean;
    HasDraftEntity?: boolean;
    modifiedAt?: Date;
    createdAt?: Date;
    createdBy?: string;
    modifiedBy?: string;
    skills?: SkillMasterList[];
    roles?: RoleMasterList[];
    profile?: ProfileData;
}
