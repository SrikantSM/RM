using com.sap.resourceManagement as rm from '../../db';
using sap.common as common from '@sap/cds/common';

service ProjectRoleService @(requires : 'authenticated-user'){
  @Capabilities : {
    Insertable : true,
    Updatable  : true,
    Deletable  : false
  }
  entity Roles @(
      restrict     : [
      {
        grant : ['READ'],
        to    : 'ProjRole.Read'
      },
      {
        grant : ['DRAFT_NEW','DRAFT_PATCH','DRAFT_CANCEL','draftEdit','draftPrepare', 'draftActivate',
                'CREATE','UPDATE','UPSERT','DELETE','restrict','removeRestriction', 'createRoleWithDialog' ], to    : 'ProjRole.Edit'
      }
      ],
      Common       : {
        Label          : ![Role],
        SemanticObject : ![Roles]
      },
      //Restricting(removing) sort on description
      Capabilities : {SortRestrictions : {NonSortableProperties : [description]}}
    )as projection on rm.config.ProjectRoles actions {

	//Create role with dialog
	@cds.odata.bindingparameter.collection
    action createRoleWithDialog (
      // TODO: Enable once OData singletons are supported
      // (https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/380)
      // locale: String(14) not null @readonly,
      code: String(4) not null,
	  name: String(30),
      description: String(255) 
    ) returns Roles;

    @Common.SideEffects      : {
      TargetProperties : [
        'roleLifecycleStatus'
        ]}
        //Display Popover when user perform action
    @Common.IsActionCritical : true
    @Core.OperationAvailable : IsActiveEntity
    action restrict() returns            Roles;

    @Common.SideEffects      : {
      TargetProperties : [
        'roleLifecycleStatus'
        ]}
        //Display Popover when user perform action
    @Common.IsActionCritical : true
    @Core.OperationAvailable : IsActiveEntity
      action removeRestriction() returns Roles;

    }

  annotate Roles with @odata.draft.enabled;

  @readonly
  entity RoleLifecycleStatus @(restrict : [{
    grant : ['READ'],
    to    : 'ProjRole.Read'
  }]) as select from rm.config.RoleLifecycleStatus {
      code,
      name,
      descr,
      cast (
      case
	  // when roleLifecycle status is unrestriced
	  // isUnrestricted flag is set to true
        when code = 0 then true
        else false
      end 
      as Boolean) as isUnrestricted : Boolean,
      cast (
      case
	  // when roleLifecycle status is restriced
	  // isrestricted flag is set to true
        when code = 1 then true
        else false
      end
      as Boolean) as isRestricted   : Boolean,
      cast (
      case
      // Criticality color code
      // 1 - Red and 3 - Green
        when code = 0 then 3
        else 1
      end
      as Integer) as criticality    : Integer
    };

  entity RoleLifecycleStatus_texts @(
    readOnly : true
    ) as projection on rm.config.RoleLifecycleStatus.texts;

  @readonly
  entity RoleCodes @(restrict : [{
    grant : ['READ'],
    to    : 'ProjRole.Read'
  }])as projection on rm.config.ProjectRolesView {
    ID, code
  };

  @readonly
  entity Languages as projection on common.Languages;

  entity Roles_texts
  as projection on rm.config.ProjectRoles.texts;
}
