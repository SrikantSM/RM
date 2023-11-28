import { MyProjectExperienceHeader } from './MyProjectExperienceHeader';
import { ProfileData } from './ProfileData';
import { RoleMasterList } from './RoleMasterList';

export interface Roles {
    ID: string;
    role_ID?: string;
    employee_ID: string;
    HasDraftEntity?: boolean;
    HasActiveEntity?: boolean;
    IsActiveEntity?: boolean;
    modifiedAt?: Date;
    createdAt?: Date;
    createdBy?: string;
    modifiedBy?: string;
    role?: RoleMasterList;
    employee?: MyProjectExperienceHeader;
    profile?: ProfileData;
}
