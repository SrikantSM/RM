namespace com.sap.resourceManagement.skill.integration;
using { cuid, managed, sap.common.CodeList } from '@sap/cds/common';


entity OneMDSDeltaTokenInfo : managed {
    key entityName             : String(75);
        deltaToken             : String;
        isInitialLoadCandidate : Boolean default false;
        performInitialLoad     : Boolean default false;
}

entity MDIObjectReplicationStatus: cuid {
    key entityName : String(75);
        excludeStatus: Boolean;
}

entity ReplicationFailureStatus {
    key code        : Integer enum {
            open       = 0;
            inProgress = 1;
            closed     = 2;
        } default 0;
        description : String;
}


entity ReplicationErrorMessages {
    key code         : String(12); // RM_CP_004
        errorMessage : String(255); // Record doesn't have mandatory {0} value in {1}.
        description  : String(255);
}

entity ReplicationFailures : managed {
    key versionId                : cds.UUID;
    key instanceId               : String(128);
        externalId               : String(100); // Represents WorkforceCapabilityId for which the replication has failed.
        event                    : String(20) not null;
        replicationType          : String(50) not null;
        replicationErrorMessage  : Association to ReplicationErrorMessages;
        errorParam1              : String(100);
        errorParam2              : String(100);
        errorParam3              : String(100);
        errorParam4              : String(100);
        replicationFailureStatus : Association to one ReplicationFailureStatus;
}
