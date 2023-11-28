using com.sap.resourceManagement as rm from '../../../db/cds/index';
using com.sap.resourceManagement.skill as skills from '@sap/rm-skill/db';
using com.sap.resourceManagement.config as config from '@sap/rm-consultantProfile/db';
using com.sap.resourceManagement.config as staffingStatus from '@sap/rm-assignment/db';
using com.sap.resourceManagement.assignment as assignment from '@sap/rm-assignment/db';
using com.sap.resourceManagement.employee as employee from '@sap/rm-consultantProfile/db';
using com.sap.resourceManagement.resource as resource from '@sap/rm-consultantProfile/db';
using com.sap.resourceManagement.organization as organization from '@sap/rm-consultantProfile/db';
using com.sap.resourceManagement.config as resourceOrg from '@sap/rm-centralServices/db';

service ManageResourceRequestService @(requires : ['RsceReq.Edit']) {
  
  @UI.DeleteHidden        : {$edmJson : {$Or : [
    {$Path : 'releaseStatus/isPublished'},
    {$Path : 'isS4Cloud'}
  ]}}
  @cds.redirection.target : true
  entity ResourceRequests @(restrict : [{
    grant : [
      'READ',
      'WRITE',
      'publishResourceRequest',
      'withdrawResourceRequest'
    ],
    to    : 'RsceReq.Edit',
    where : 'requestedResourceOrg_ID = $user.RequestedResourceOrganization or $user.RequestedResourceOrganization is null'
  }])                                              as projection on rm.resourceRequest.ResourceRequests
  {
    *,
    demand.workItemName,
    7 as resourceRequestFieldControl : Integer,      // 7 - Field Control (Edit Mode)
    3 as projectRoleFieldControl : Integer           // 3 - Field Control (Optional)
  }
  actions {
    @Common.SideEffects      : {TargetProperties : [
      'isS4Cloud',
      'releaseStatus'
    ]}
    @Core.OperationAvailable : IsActiveEntity
    action publishResourceRequest()  returns ResourceRequests;
    @Common.SideEffects      : {TargetProperties : [
      'isS4Cloud',
      'releaseStatus'
    ]}
    @Core.OperationAvailable : IsActiveEntity
    action withdrawResourceRequest() returns ResourceRequests;
  };

  entity ResourceRequestCapacities                 as projection on rm.resourceRequest.CapacityRequirements;

  @cds.redirection.target : true
  entity SkillsConsumption                         as projection on skills.SkillsConsumption;

  entity ProficiencyLevelsConsumption              as projection on skills.ProficiencyLevelsConsumption;

  entity SkillsConsumptionVH                       as projection on rm.resourceRequest.SkillsConsumptionVH {
    *,
    '' as commaSeparatedCatalogs : String
  };

  @UI.CreateHidden        : resourceRequest.releaseStatus.isPublished
  @UI.DeleteHidden        : resourceRequest.releaseStatus.isPublished
  @Capabilities.SearchRestrictions.Searchable : false
  entity SkillRequirements                         as projection on rm.resourceRequest.SkillRequirements {
    *,
    skill : redirected to SkillsConsumption,
    7   as skillFieldControl : Integer
  };

  entity Catalogs2SkillsConsumption                as projection on skills.Catalogs2SkillsConsumption excluding {
    skill
  };

  entity CatalogsConsumption                       as projection on skills.CatalogsConsumption;
  entity SkillImportanceCodes @readonly            as projection on rm.resourceRequest.SkillImportanceCodes;
  entity Priorities @readonly                      as projection on rm.resourceRequest.Priorities;


  entity ReferenceObjectType @readonly      as projection on rm.integration.ReferenceObjectTypes;

  entity ReferenceObject @readonly                 as projection on rm.integration.ReferenceObjects;




  @Capabilities.SearchRestrictions.Searchable : false
  entity Staffing @readonly           as projection on assignment.AssignmentsView {
    *,
    ResourceDetails.fullName          as resourceName,
    ResourceDetails.workforcePersonID as workforcePersonID,
    ResourceDetails.initials          as initials,
    ResourceDetails.workerType.name   as workerTypeName,
    false as assignmentProposalFlag : Boolean

  } actions {

    @Core.OperationAvailable : assignmentProposalFlag
    @Common.IsActionCritical : true
    @Common.SideEffects      : {TargetProperties : [
          'assignmentStatus','assignmentProposalFlag'
        ]}
    action acceptAssignmentProposal() returns Staffing;

    @Core.OperationAvailable : assignmentProposalFlag
    @Common.IsActionCritical : true
    @Common.SideEffects      : {TargetProperties : [
              'assignmentStatus','assignmentProposalFlag'
        ]}
    action rejectAssignmentProposal() returns Staffing;
  };

  entity ResourceDetails @readonly                 as projection on resource.ResourceDetails;
  entity StaffingStatusCodes @readonly             as projection on staffingStatus.StaffingStatus;
  entity StaffingStatuses @readonly                as projection on rm.resourceRequest.StaffingStatuses;
  entity RequestStatuses @readonly                 as projection on rm.resourceRequest.RequestStatuses;
  entity EmployeeProfiles @readonly                as select from employee.ProfileData;
  entity EffortDistributionTypes @readonly         as projection on rm.resourceRequest.EffortDistributionTypes;
  entity AssignmentStatus @readonly                as projection on assignment.AssignmentStatus;

  entity ReleaseStatuses @readonly                 as
    select from rm.resourceRequest.ReleaseStatuses {
      code,
      description,
      case
        when
          code = 1
        then
          true
        else
          false
      end as isPublished : Boolean,
      case
        when
          code = 0
        then
          true
        else
          false
      end as isWithdrawn : Boolean
    };

  // To be deleted
  @Capabilities.SearchRestrictions.Searchable : true
  @cds.redirection.target                     : true
  entity DeliveryOrganizations @(restrict : [{
    grant : ['READ'],
    to    : 'RsceReq.Edit'
  }])

  @readonly                                        as projection on organization.DeliveryOrganizations;

  @Capabilities.SearchRestrictions.Searchable : true
  entity DeliveryOrganizationCostCenters @readonly as projection on organization.DeliveryOrganizationCostCenters;

  @Capabilities.SearchRestrictions.Searchable : true
  entity ProjectRoles @readonly                    as projection on config.ProjectRolesView {
    *,
    @odata.Type : 'Edm.String'
    ID
  };

  @Capabilities.SearchRestrictions.Searchable : true
  entity Projects @readonly                        as select from rm.project.Projects;

  @Capabilities.SearchRestrictions.Searchable : true
  entity WorkPackages @readonly                    as select from rm.project.WorkPackages;

  @Capabilities.SearchRestrictions.Searchable : true
  entity Customers @readonly                       as select from rm.project.Customers;

  @Capabilities.SearchRestrictions.Searchable : true
  entity Demands @(restrict : [{
    grant : ['READ'],
    to    : 'RsceReq.Edit'
  }])            @readonly                         as
    select from rm.project.Demands {
      *,
      @odata.Type : 'Edm.String'
      ID,
      billingRole.name         as billingRoleName,
      workPackage.name         as workPackageName,
      workPackage.project.name as projectName,
    }
    excluding {
      externalID
    }
    order by
      projectName,
      workPackageName,
      billingRoleName asc;

  @Capabilities.SearchRestrictions.Searchable : true
  entity BillingRoles @readonly                    as select from rm.project.BillingRoles;

  entity BillingCategory @readonly                 as select from rm.project.BillingCategories;
  entity ConsultantProfileHeaders @readonly        as select from employee.Headers;

  @cds.redirection.target : ManageResourceRequestService.UnrestrictedResourceOrganizationsConsumption
  entity UnrestrictedResourceOrganizationsConsumption @(restrict : [{
    grant : 'READ',
    where : 'ID = $user.RequestedResourceOrganization or $user.RequestedResourceOrganization is null'
  }])                                              as select from resourceOrg.UnRestrictedResourceOrganizationsView;
}
