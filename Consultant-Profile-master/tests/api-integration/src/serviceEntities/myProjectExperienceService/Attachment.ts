import { MyProjectExperienceHeader } from './MyProjectExperienceHeader';

export interface Attachment {
    ID: string;
    employee_ID: string;
    IsActiveEntity?: boolean;
    modifiedAt?: string;
    createdAt?: string;
    createdBy?: string;
    modifiedBy?: string;
    employee?: MyProjectExperienceHeader;
    fileName?: string;
    'content@mediaContentType'?: string;
    HasActiveEntity?: boolean,
    HasDraftEntity?: boolean,
}
