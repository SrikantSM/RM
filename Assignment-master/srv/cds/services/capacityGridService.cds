using com.sap.resourceManagement.capacityGrid as capacityGrid from '../../../db/cds/index';
using com.sap.resourceManagement.organization as organization from '@sap/rm-consultantProfile/db';
using com.sap.resourceManagement.capacityGridAssignment as capacityGridAssignment from '../../../db/cds/index';
using com.sap.resourceManagement.assignment as assignment from '../../../db/cds/index';

using com.sap.resourceManagement.resource as resource from '@sap/rm-consultantProfile/db';
using com.sap.resourceManagement.config as config from '@sap/rm-consultantProfile/db';
using com.sap.resourceManagement.config as resourceOrg from '@sap/rm-centralServices/db';

using com.sap.resourceManagement as rm from '@sap/rm-resourceRequest/db';

@cds.query.limit: { default: 0, max: 0 }
service CapacityService @(requires : 'UtilOvw.Read') {
  
  @Capabilities.SearchRestrictions.Searchable : true
  entity ResourceOrganizations @(restrict : [{
    grant : ['READ'],
    to    : 'UtilOvw.Read',
    where : '(resourceOrganizationDisplayId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null)'
  }]) @readonly as projection on capacityGrid.ResourceOrganizations;

  @Capabilities.SearchRestrictions.Searchable : true
  @cds.sql.search.mode : 'generic'
  entity ResourceOrganizationCostCenters @(restrict : [{
    grant : ['READ'],
    to    : 'UtilOvw.Read',
    where : '(resourceOrganizationDisplayId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null)'
  }]) @readonly as projection on capacityGrid.ResourceOrganizationItems;


  @Capabilities.SearchRestrictions.Searchable : true
  entity ResourceDetails @readonly @(restrict : [{
    grant : ['READ'],
    to    : 'UtilOvw.Read',
    where : '(resourceOrgCode = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null)'
  }]) as projection on resource.ResourceDetails
  {
    resource_ID,
    firstName,
    lastName,
    fullName,
    costCenterID,
    resourceOrgCode
  };

  @Capabilities.SearchRestrictions.Searchable : true
  entity SkillsConsumptionVH                       as projection on rm.resourceRequest.SkillsConsumptionVH{
    *,
    '' as commaSeparatedCatalogs: String
  };

  @Capabilities.SearchRestrictions.Searchable : true
  @cds.search: {ID, name}
  entity ProjectsVH @readonly @(restrict : [{
    grant : ['READ'],
    to    : 'Asgt.Edit'
  }]) as projection on rm.project.Projects excluding {serviceOrganization};

  @Capabilities.SearchRestrictions.Searchable : true
  entity ProjectRoles @readonly @(restrict : [{
    grant : ['READ'],
    to    : 'Asgt.Edit',
  }]) as projection on config.ProjectRolesView {
    ID as projectRole_ID,
    code,
    name,
    description
  };

  @Capabilities.SearchRestrictions.Searchable : true
  entity WorkerTypesVH @readonly @(restrict : [{
    grant : ['READ'],
    to    : 'Asgt.Edit'
  }]) as projection on capacityGrid.WorkerTypes;

  @Capabilities.SearchRestrictions.Searchable : true
  entity RequestsVH @readonly @(restrict : [{
    grant : ['READ'],
    to    : 'Asgt.Edit'
  }]) as projection on capacityGrid.RequestsGridVH; 

  @Capabilities.SearchRestrictions.Searchable : true
  entity CustomerVH @readonly @(restrict : [{
    grant : ['READ'],
    to    : 'Asgt.Edit'
  }]) as select from rm.project.Customers;

  entity ReferenceObjectType @readonly @(restrict : [{
    grant : ['READ'],
    to    : 'Asgt.Edit'
  }]) as projection on rm.integration.ReferenceObjectTypes;

  entity ReferenceObject @readonly @(restrict : [{
    grant : ['READ'],
    to    : 'Asgt.Edit'
  }]) as projection on rm.integration.ReferenceObjects;

  @cds.errors.combined: false
  entity AssignmentsDetailsForCapacityGrid @(restrict : [
    {
      grant : ['READ'],
      to    : 'UtilOvw.Read',
      where : 'resourceOrgCode = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null'
    },
    {
      grant : ['CREATE','READ','UPDATE','UPSERT','DELETE','DRAFT_NEW','DRAFT_PATCH','DRAFT_CANCEL','draftEdit','draftPrepare','draftActivate'],
      to    : 'Asgt.Edit',
      where : 'resourceOrgCode = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null'
    }
  ])                                     as projection on capacityGridAssignment.AssignmentsDetailsForCapacityGrid;

  entity AssignmentBucketsYearMonthAggregate @(restrict : [
    {
      grant : ['READ'],
      to    : 'UtilOvw.Read'
    },
    {
      grant : ['WRITE'],
      to    : 'Asgt.Edit'
    }
  ])                                     as projection on capacityGridAssignment.AssignmentBucketsYearMonth;

  entity AssignmentBucketsYearWeekAggregate @(restrict : [
    {
      grant : ['READ'],
      to    : 'UtilOvw.Read'
    },
    {
      grant : ['WRITE'],
      to    : 'Asgt.Edit'
    }
  ])                                     as projection on capacityGridAssignment.AssignmentBucketsYearWeek;

  entity AssignmentBucketsPerDay @(restrict : [
    {
      grant : ['READ'],
      to    : 'UtilOvw.Read'
    },
    {
      grant : ['WRITE'],
      to    : 'Asgt.Edit'
    }
  ])                                     as projection on capacityGridAssignment.AssignmentBucketsPerDay{
    *,

  };

  entity RequestDetailsForEachAssignment  @(restrict : [
    {
      grant : ['READ'],
      to    : 'UtilOvw.Read'
    }
  ]) as projection on capacityGridAssignment.RequestDetailsForEachAssignment;

  entity ResourceAssignment @(restrict : [
    {
      grant : ['READ'],
      to    : 'UtilOvw.Read',
      where : 'resourceOrgCode = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null'
    }
  ]) as projection on assignment.AssignmentValidityView;

  entity capacityGridHeaderTemporal @(restrict : [{
    grant : ['READ'],
    to    : 'UtilOvw.Read',
    where : 'resourceOrganizationId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null'
  }])                                    as projection on capacityGrid.capacityGridHeaderTemporal;
  entity capacityGridMonthlyUtilizationTemporal @(restrict : [{
    grant : ['READ'],
    to    : 'UtilOvw.Read',
    where : 'resourceOrganizationId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null'
  }])                                    as projection on capacityGrid.capacityGridMonthlyUtilizationTemporalView;
  
  entity capacityGridHeaderKPITemporal @(restrict : [{
    grant : ['READ'],
    to    : 'UtilOvw.Read',
    where : 'resourceOrganizationId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null'
  }])                                    as projection on capacityGrid.capacityGridHeaderKPITemporal;

  entity capacityGridDailyUtilizationTemporal @(restrict : [{
    grant : ['READ'],
    to    : 'UtilOvw.Read',
    where : 'resourceOrganizationId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null'
  }])                                    as projection on capacityGrid.capacityGridDailyUtilizationTemporalView;

  entity capacityGridWeeklyUtilizationTemporal @(restrict : [{
    grant : ['READ'],
    to    : 'UtilOvw.Read',
    where : 'resourceOrganizationId = $user.ProcessingResourceOrganization or $user.ProcessingResourceOrganization is null'
  }])                                    as projection on capacityGrid.capacityGridWeeklyUtilizationTemporalView;

  entity AssignmentStatus as projection on assignment.AssignmentStatus;

  entity averageResourceUtilizationFor12WeeksTileResponse @(restrict: [{
    grant: ['READ'],
    to   : 'UtilOvw.Read'
  }]) {
        // The standard OData response is an array of JSON objects.
        // The ID is required as a workaround to extract the first element of the response.
        // GET averageResourceUtilizationFor12WeeksTileResponse(ID) would return a JSON object.
        // ID is populated with a hardcoded UUID value in the handler implementation and in UI.
    key ID           : cds.UUID;
        number       : Integer;
        numberFactor : String;
        numberState  : String;
  };

}
