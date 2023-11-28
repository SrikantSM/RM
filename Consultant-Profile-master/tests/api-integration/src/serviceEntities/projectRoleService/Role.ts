export interface Role {
    ID: string;
    code?: string;
    name: string;
    description?: string;
    roleLifecycleStatus_code?: number;
    HasActiveEntity?: boolean;
    HasDraftEntity?: boolean;
    IsActiveEntity?: boolean;
    createdAt?: Date;
    modifiedAt?: Date;
    modifiedBy?: string;
}
