namespace com.sap.resourceManagement.integration;

using com.sap.resourceManagement.project.Demands as demand from '../project/index';
using com.sap.resourceManagement.organization as organization from '@sap/rm-consultantProfile/db';
using { managed } from '@sap/cds/common.cds';

entity ProjectReplicationStatus {
    key type          : Association to ReplicationType;
        startTime     : DateTime;
        status        : Association to RunStatus;
        projectSync   : Composition of many ProjectSync on projectSync.type = $self;
};

entity ProjectSync {
    key type    : Association to ProjectReplicationStatus;
    key project : String(24);
    key serviceOrganization: Association to organization.Headers;
        status  : Association to RunStatus;

};

entity ReplicationType {
    key code        : Integer enum {
            Initial = 1;
            Delta = 2;
            Delete = 3;
        };
        description : String;
};

entity RunStatus {
    key code        : Integer enum {
            New = 0;
            Error = 1;
            Processing = 2;
            Completed = 3;
            Closed = 4;
        };
        description : localized String;
};

// Only demands for which a new request has been published but supply is yet to be replicated
entity SupplySync {
    key demand : cds.UUID;
};

entity SupplySyncDetails as select from SupplySync mixin {
    demandDetails : Association to demand on demandDetails.ID = demand;
} into {
    demand,
    demandDetails.externalID     as resourceDemand,
    demandDetails.workPackage.ID as workPackage
};


@cds.autoexpose
@Common.ValueList
entity ReferenceObjectTypes {
    key code        : Integer enum {
            None        = 0;
            Project     = 1;
        } default 0;
        name : localized String;
}


entity ReferenceObjects : managed {
  key ID              : UUID;
      displayId       : String(40);
      name            : String(256);
      typeCode        : Association to  ReferenceObjectTypes;
      startDate       : Date;
      endDate         : Date;
}
