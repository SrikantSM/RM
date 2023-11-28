import { MyProjectExperienceHeader } from './MyProjectExperienceHeader';
import { ProfileData } from './ProfileData';

export interface ProfilePhoto {
    ID: string;
    employee_ID: string;
    IsActiveEntity?: boolean;
    modifiedAt?: string;
    createdAt?: string;
    createdBy?: string;
    modifiedBy?: string;
    employee?: MyProjectExperienceHeader;
    fileName?: string;
    profile?: ProfileData;
    'profileImage@mediaContentType'?: string;
    'profileThumbnail@mediaContentType'?: string;
    HasActiveEntity?: boolean,
    HasDraftEntity?: boolean,
}
