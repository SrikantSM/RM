export interface ProfileData {
    ID: string;
    dataSubjectRole?: string;
    workerExternalID?: string;
    emailAddress?: string;
    profilePhotoURL?: string;
    firstName?: string;
    lastName?: string;
    initials?: string;
    mobilePhoneNumber?: string;
    name?: string;
    role?: string;
    managerExternalID?: string;
    officeLocation?: string;
    resourceOrg?: string;
    resourceOrgId?: string;
    costCenterDescription?: string;
    costCenter?: string;
    toManager?: ManagerProfileData;
    isContingentWorker?: boolean;
    workerType?: WorkerType;
    fullName?: string;
}

export interface ManagerProfileData {
    externalID: string;
    managerId: string;
    mangerEmailAddress: string;
    managerMobilePhoneNumber?: string;
    managerName?: string;
    toWorkerProfile?: ProfileData[];
    validFrom?: string;
    validTo?: string;
}

export interface WorkerType {
    name: string,
    descr: null,
    isContingentWorker: boolean,
}
