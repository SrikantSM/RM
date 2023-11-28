namespace com.sap.resourceManagement.config;
using { 
	User,
	sap.common.CodeList
} from '@sap/cds/common';

/*
 * Aspect to capture a subset of adminstrative data
 */
aspect managed {
  createdAt : Timestamp @cds.on.insert: $now;
  modifiedAt : Timestamp @cds.on.insert: $now @cds.on.update: $now;
  modifiedBy : User @cds.on.insert: $user @cds.on.update: $user;
};

entity RoleLifecycleStatus : CodeList {
  key code : Integer;
}; 

@fiori.draft.enabled
entity ProjectRoles : managed {
    key ID          : cds.UUID;
        code        : String(4) @mandatory;
        name        : localized String(30) @mandatory;
        description : localized String(255);
        roleLifecycleStatus_code : Integer not null default 0;
        roleLifecycleStatus : Association to one RoleLifecycleStatus on roleLifecycleStatus.code = roleLifecycleStatus_code;
};

entity ProjectRolesView as select from ProjectRoles {
    key ID          as ID,
        code        as code,
        name        as name,
        description as description,
        roleLifecycleStatus_code,
        roleLifecycleStatus,
        texts,
    	localized
};

view UnRestrictedRolesConsumption as select from ProjectRolesView {
    ID                       as ID,
    code                     as code,
    name                     as name,
    description              as description,
    roleLifecycleStatus_code,
    roleLifecycleStatus,
    localized
} where
    roleLifecycleStatus.code = 0;
