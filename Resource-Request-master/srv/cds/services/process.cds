using com.sap.resourceManagement as rm from '../../../db/cds/index';
using com.sap.resourceManagement.config as config from '@sap/rm-consultantProfile/db';
using com.sap.resourceManagement.skill as skills from '@sap/rm-skill/db';
using com.sap.resourceManagement.config as staffingStatus from '@sap/rm-assignment/db';
using com.sap.resourceManagement.employee as employee from '@sap/rm-consultantProfile/db';
using com.sap.resourceManagement.resource as resource from '@sap/rm-consultantProfile/db';
using com.sap.resourceManagement.workforce.workAssignment as workAssignment from '@sap/rm-consultantProfile/db';
using com.sap.resourceManagement.assignment as assignment from '@sap/rm-assignment/db';
using com.sap.resourceManagement.organization as organization from '@sap/rm-consultantProfile/db';
using com.sap.resourceManagement.config as resourceOrg from '@sap/rm-centralServices/db';

service ProcessResourceRequestService @(requires : ['Asgt.Edit']) {
  @cds.redirection.target : true
  entity ResourceRequests @(restrict : [{
    grant : [
      'READ',
      'setMyResponsibilityResourceRequest',
      'forwardResourceRequest',
      'resolveResourceRequest'
    ],
    to    : 'Asgt.Edit',
    where : 'processingResourceOrg_ID = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null'
  }])                     @readonly                as projection on rm.resourceRequest.ResourceRequestsView {
    *,
    demand.workItemName,
    case
      when
        isS4Cloud = true
      then
        false
      else
        true
    end as isS4CloudNegation : Boolean
  } actions {
    @Common.SideEffects      : {TargetProperties : [
      'resourceManager',
      'processor'
    ]}
    action setMyResponsibilityResourceRequest(processor : Boolean not null, resourceManager : Boolean not null) returns ResourceRequests;
    @Common.SideEffects      : {TargetProperties : [
      'requestedResourceOrg',
      'processingResourceOrg'
    ]}
    @Common.SideEffects      : {TargetEntities : [matchingCandidates]}
    action forwardResourceRequest(requestedResourceOrg_ID : String, processingResourceOrg_ID : String)          returns ResourceRequests;


    // @Common.IsActionCritical : true
    @Common.SideEffects      : {TargetProperties : [
      'requestStatus',
      'isResolved',
      'staffing/isAssignmentNotDeletable'
    ]}
    @Common.IsActionCritical : true
    action resolveResourceRequest()                                                                             returns ResourceRequests;
  };

  entity SkillsConsumption                         as projection on skills.SkillsConsumption;
  entity EffortDistributionTypes                   as projection on rm.resourceRequest.EffortDistributionTypes;

  @Capabilities.SearchRestrictions.Searchable : false
  entity SkillRequirements                         as projection on rm.resourceRequest.SkillRequirements;

  entity ProficiencyLevelsConsumption              as projection on skills.ProficiencyLevelsConsumption;
  entity SkillImportanceCodes @readonly            as projection on rm.resourceRequest.SkillImportanceCodes;
  entity Priorities @readonly                      as projection on rm.resourceRequest.Priorities;
  entity StaffingStatusCodes @readonly             as projection on staffingStatus.StaffingStatus;
  entity StaffingStatuses @readonly                as projection on rm.resourceRequest.StaffingStatuses;
  entity AssignmentStatus @readonly                as projection on assignment.AssignmentStatus;

  // resourceRequest added, so assicioaion inside assignmentView can expose it!
  // entity ResourceRequest @readonly                as projection on rm.resourceRequest.ResourceRequests;

  @Capabilities.SearchRestrictions.Searchable : false
  entity Staffing       @readonly                  as projection on assignment.AssignmentsDetailsView {
    *,
    ResourceDetails.fullName          as resourceName,
    ResourceDetails.workforcePersonID as workforcePersonID,
    ResourceDetails.initials          as initials,
    ResourceDetails.workerType.name   as workerTypeName,
    assignmentStatus.name             as assignmentStatusText
  } actions {

    // For better performance, the side effect shall explicitly tell, which properties and entities shall be fetched.
    // But due to a missing requirement in the oData Model / UI5 layer the down navigation to a entity does not work this cannot be used yet.
    //@Common.SideEffects : { TargetProperties : [ resourceRequest.staffingStatus.bookedCapacity, resourceRequest.staffingStatus.staffingStatus ] }
    // Workaround: Get the entire request. This will also GET all its child entities (like staffing and matchingCandidates)
    @Common.SideEffects              : {TargetEntities : [resourceRequest]}
    @Common.IsActionCritical         : true
    action DeleteAssignment();

    @Common.SideEffects              : {TargetEntities : [resourceRequest]}
    @cds.odata.bindingparameter.name : '_it'
    action ChangeAssignment(

                        @title                    : '{i18n>ASSIGNMENT_START}'
                        @UI.ParameterDefaultValue : _it.startDate
                        @Common.FieldControl      : #Mandatory
    assignedStart : Date,

                        @title                    : '{i18n>ASSIGNMENT_END}'
                        @UI.ParameterDefaultValue : _it.endDate
                        @Common.FieldControl      : #Mandatory
    assignedEnd : Date,

                        //Note:
                        //Need to ad this field in assignment.cds AssignmentsView
                        //(bookedCapacityInMinutes / 60) as bookedCapacityInHours: Integer

                        @title                    : '{i18n>ASSIGNMENT_DURATION}'
                        @UI.ParameterDefaultValue : _it.bookedCapacityInHours
                        @Common.FieldControl      : #Mandatory
    assignedDuration : Integer,

    assignmentStatus : Integer

    );
  };

  entity RequestStatuses @readonly                 as projection on rm.resourceRequest.RequestStatuses;
  entity ReleaseStatuses @readonly                 as projection on rm.resourceRequest.ReleaseStatuses;
  entity EmployeeProfiles @readonly                as select from employee.ProfileData;

  entity MatchingCandidates                        as projection on rm.resourceRequest.MatchingCandidatesView {
    *,
    resources.initials          as initials,
    resources.workerType.name   as workerTypeName
  } actions {

    // For better performance, the side effect shall explicitly tell, which properties and entities shall be fetched.
    // But due to a missing requirement in the oData Model / UI5 layer the down navigation to a entity does not work this cannot be used yet.
    //@Common.SideEffects : { TargetProperties  : [ resourceRequest.staffingStatus.bookedCapacity, resourceRequest.staffingStatus.staffingStatus, resourceRequest.staffingStatus.remainingCapacity ],
    //                        TargetEntities    : [ resourceRequest.staffing, resourceRequest.matchingCandidates ] }
    // Workaround: Get the entire request. This will also GET all its child entities (like staffing and matchingCandidates)
    @Common.SideEffects              : {TargetEntities : [resourceRequest]}
    @cds.odata.bindingparameter.name : '_it'
    action AssignForSpecificPeriod(

    @title                    : '{i18n>ASSIGNMENT_START}'
    @UI.ParameterDefaultValue : _it.resourceRequestStartDate
    @Common.FieldControl      : #Mandatory
    assignedStart : Date,

    @title                    : '{i18n>ASSIGNMENT_END}'
    @UI.ParameterDefaultValue : _it.resourceRequestEndDate
    @Common.FieldControl      : #Mandatory
    assignedEnd : Date,

    @title                    : '{i18n>ASSIGNMENT_DURATION}'
    @Common.FieldControl      : #Mandatory
    assignedDuration : Integer,

    assignmentStatus : Integer

    );

    @Common.SideEffects              : {TargetEntities : [resourceRequest]}
    @cds.odata.bindingparameter.name : '_it'
    action AssignAsRequested(

    );

  };

  @Capabilities.SearchRestrictions.Searchable : true
  @cds.redirection.target                     : true
  entity DeliveryOrganizations @(restrict : [{
    grant : ['READ'],
    to    : 'Asgt.Edit'
  }])                          @readonly           as projection on organization.DeliveryOrganizations;

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
  entity BillingRoles @readonly                    as select from rm.project.BillingRoles;

  @Capabilities.SearchRestrictions.Searchable : true
  entity Demands @readonly                         as
    select from rm.project.Demands {
      *,
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

  entity BillingCategory @readonly                 as select from rm.project.BillingCategories;
  entity ResourceDetails @readonly                 as select from resource.ResourceDetails;
  entity WorkerType @readonly                      as select from workAssignment.WorkerType;
  entity ConsultantProfileHeaders @readonly        as select from employee.Headers;
  entity ReferenceObjectType @readonly      as projection on rm.integration.ReferenceObjectTypes;
  entity ReferenceObject @readonly          as projection on rm.integration.ReferenceObjects;

  @Capabilities.SearchRestrictions.Searchable : true
  entity DeliveryOrganizationCostCenters @readonly as select from organization.DeliveryOrganizationCostCenters;

  @cds.redirection.target : ProcessResourceRequestService.UnrestrictedResourceOrganizationsConsumption
  entity UnrestrictedResourceOrganizationsConsumption @(restrict : [{
    grant : 'READ',
    where : 'ID = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null'
  }])                                              as select from resourceOrg.UnRestrictedResourceOrganizationsView;

}
