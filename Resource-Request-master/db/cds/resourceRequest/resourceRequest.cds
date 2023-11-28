namespace com.sap.resourceManagement.resourceRequest;

using {
  managed,
  User,
  sap.common.CodeList
} from '@sap/cds/common.cds';
using com.sap.resourceManagement.project as project from '../project/index';
using com.sap.resourceManagement.resourceRequest as staffingStatus from './staffingStatus';
using com.sap.resourceManagement.organization as organization from '@sap/rm-consultantProfile/db';
using com.sap.resourceManagement.resource as resource from '@sap/rm-consultantProfile/db';
using com.sap.resourceManagement.config as config from '@sap/rm-consultantProfile/db';
using com.sap.resourceManagement.skill as skill from '@sap/rm-skill/db';
using com.sap.resourceManagement.employee as employee from '@sap/rm-consultantProfile/db';
using com.sap.resourceManagement.assignment as assignment from '@sap/rm-assignment/db';
using com.sap.resourceManagement.resourceRequest as skillCompare from './resourceComparison/skillCompare';
using com.sap.resourceManagement.resourceRequest as availabilityCompare from './resourceComparison/availabilityCompare';
using com.sap.resourceManagement.config as resourceOrg from '@sap/rm-centralServices/db/resource-organization.cds';
using com.sap.resourceManagement.integration as integration from '../integration/index';

@assert.unique.displayId : [displayId]
entity ResourceRequests : managed {
  key ID                                  : UUID;
      displayId                           : String(10);
      name                                : String(256);
      isS4Cloud                           : Boolean default true;
      demand                              : Association to project.Demands;
      workpackage                         : Association to project.WorkPackages;
      project                             : Association to project.Projects;
      projectRole                         : Association to config.ProjectRolesView;
      priority                            : Association to Priorities                @mandatory;
      referenceObjectType                 : Association to integration.ReferenceObjectTypes;
      referenceObject                     : Association to integration.ReferenceObjects;
      requestedResourceOrg                : Association to one resourceOrg.ResourceOrganizationsView;
      processingResourceOrg               : Association to one resourceOrg.ResourceOrganizationsView;
      requestStatus                       : Association to RequestStatuses           @mandatory;
      releaseStatus                       : Association to ReleaseStatuses           @mandatory;
      staffingDetails                     : Association to many assignment.AssignmentsView
                                              on staffingDetails.resourceRequest_ID = ID;
      staffingStatus                      : Association to staffingStatus.StaffingStatuses
                                              on staffingStatus.ID = ID;
      effortDistributionType              : Association to EffortDistributionTypes
                                              on effortDistributionType_code = effortDistributionType.code;
      effortDistributionType_code         : EffortDistributionTypes : code default 0 @mandatory;
      resourceManager                     : User;
      processor                           : User;
      resourceKind                        : Association to resource.Kinds;
      startDate                           : Date                                     @mandatory;
      endDate                             : Date                                     @mandatory;
      startTime                           : Timestamp                                @mandatory;
      endTime                             : Timestamp                                @mandatory;
      requestedCapacity                   : Decimal(10, 2)                           @mandatory;
      requestedUnit                       : String(22)                               @mandatory;
      requestedCapacityInMinutes          : Integer                                  @mandatory;
      description                         : String(1024);
      capacityRequirements                : Composition of many CapacityRequirements
                                              on capacityRequirements.resourceRequest = $self;
      skillRequirements                   : Composition of many SkillRequirements
                                              on skillRequirements.resourceRequest = $self;
      virtual referenceObjectFieldControl : Integer;
};

entity CapacityRequirements : managed {
  key ID                         : UUID                            @mandatory;
      resourceRequest            : Association to ResourceRequests @mandatory;
      startDate                  : Date                            @mandatory;
      endDate                    : Date                            @mandatory;
      startTime                  : Timestamp                       @mandatory;
      endTime                    : Timestamp                       @mandatory;
      requestedCapacity          : Decimal(10, 2)                  @mandatory;
      requestedUnit              : String(22)                      @mandatory;
      requestedCapacityInMinutes : Integer                         @mandatory;
};

entity SkillRequirements : managed {
  key ID                                   : UUID;
      resourceRequest                      : Association to ResourceRequests                            @mandatory;
      skill                                : Association to skill.SkillsConsumption                     @mandatory;
      importance                           : Association to one SkillImportanceCodes                    @mandatory;
      proficiencyLevel                     : Association to skill.ProficiencyLevelsConsumption not null @mandatory;
      comment                              : String;
      virtual proficiencyLevelFieldControl : Integer;
};

view SkillRequirementsView as
  select from SkillRequirements {
    resourceRequest.ID                      as resourceRequestId,
    skill.ID                                as skillId,
    proficiencyLevel.ID                     as proficiencyLevelId,
    importance.code                         as importanceCode,
    comment,
    proficiencyLevel.rank                   as proficiencyLevelRank,
    proficiencyLevel.proficiencySet.maxRank as proficiencySetMaxRank,
  };

entity SkillsConsumptionVH as
  select from skill.SkillsConsumption {
    *,
    ID,
    externalID,
    alternativeLabels,
    commaSeparatedAlternativeLabels,
    description,
    name,
    lifecycleStatus.code,
    lifecycleStatus,
    texts,
    localized
  }
  where
    lifecycleStatus.code = 0;

entity SkillImportanceCodes {
  key code : Integer enum {
        Mandatory = 1;
        Preferred = 2;
      };
      name : localized String;
}

entity Priorities {
  key code : Integer enum {
        Low      = 0;
        Medium   = 1;
        High     = 2;
        VeryHigh = 3;
      };
      name : localized String;
};

entity RequestStatuses {
  key code        : Integer enum {
        Open     = 0;
        Resolved = 1;
      };
      description : localized String;
};

entity ReleaseStatuses {
  key code        : Integer enum {
        NotPublished = 0;
        Published    = 1;
      };
      description : localized String;
};

entity EffortDistributionTypes {
  key code        : Integer enum {
        TotalHrs  = 0;
        DailyHrs  = 1;
        WeeklyHrs = 2;
      };
      description : localized String;
};

@cds.persistence.exists
entity MatchingCandidates1 {
  key resourceRequest_ID                 : UUID;
  key resource_ID                        : UUID;
      resourceRequestStartDate           : Date;
      resourceRequestEndDate             : Date;
      resourceName                       : String(257);
      remainingCapacity                  : Decimal(10, 2);
      availabilityMatchPercentage        : Decimal(6, 2);
      skillMatchPercentage               : Decimal(6, 2);
      utilizationPercentage              : Decimal(6, 2);
      totalMatchPercentage               : Decimal(6, 2);
      virtual commaSeparatedProjectRoles : String(4000);
}

view MatchingCandidatesView as
  select from MatchingCandidates1
  mixin {
    resourceRequest     : Association to ResourceRequestsView
                            on resourceRequest.ID = $projection.resourceRequest_ID;
    resources           : Association to resource.ResourceDetails
                            on resources.resource_ID = $projection.resource_ID;
    matchedProjectRoles : Association to many employee.priorExperience.RoleAssignments
                            on matchedProjectRoles.employee_ID = $projection.workforcePersonID
  }
  into {
    key resourceRequest_ID,
    key resource_ID,
        resourceRequestStartDate,
        resourceRequestEndDate,
        resourceName,
        remainingCapacity,
        availabilityMatchPercentage,
        skillMatchPercentage,
        utilizationPercentage,
        totalMatchPercentage,
        resources.workforcePersonID as workforcePersonID,
        resourceRequest,
        resources,
        commaSeparatedProjectRoles,
        matchedProjectRoles
  };

view ResourceRequestsView as
  select from ResourceRequests
  mixin {
    matchingCandidates  : Association to many MatchingCandidatesView
                            on matchingCandidates.resourceRequest = $self;
    staffing            : Association to many assignment.AssignmentsDetailsView
                            on staffing.resourceRequest = $self;
    skillCompare        : Association to many skillCompare.CompareResourceSkills
                            on skillCompare.resourceRequestId = ID;
    availabilityCompare : Association to many availabilityCompare.CompareResourceAvailability
                            on availabilityCompare.resourceRequestId = ID;


  }
  into {
    *,
    staffing,
    //'' as resourceRequest_ID : String, //temporary till FE issue # 2270136819 is reolved. Un necessary key field call by FE
    //'' as resource_ID : String,
    case
      when
        requestStatus.code = 1
      then
        true
      else
        false
    end as isResolved : Boolean,
    matchingCandidates,
    skillCompare,
    availabilityCompare
  }
  where
    releaseStatus.code = 1;

view ResourceRequestDetails as
  select from ResourceRequests {
    key ID                          as Id,
        displayId,
        name,
        isS4Cloud,
        startDate,
        endDate,
        requestedCapacity,
        requestedCapacityInMinutes,
        requestedUnit,
        requestStatus,
        releaseStatus,
        project.serviceOrganization as serviceOrganization,
        project.ID                  as projectId,
        project.name                as projectName,
        workpackage.ID              as workPackageId,
        workpackage.name            as workPackageName,
        project.customer.ID         as customerId,
        project.customer.name       as customerName,
        project.startDate           as projectStartDate,
        project.endDate             as projectEndDate,
        projectRole.ID              as projectRoleId,
        projectRole.name            as projectRoleName,
        workpackage.startDate       as workPackageStartDate,
        workpackage.endDate         as workPackageEndDate,
        demand.workItemName         as workItemName,
        referenceObject.displayId   as referenceObjectId,
        referenceObject.name        as referenceObjectName,
        referenceObjectType         as referenceObjectType,
        referenceObjectType.name    as referenceObjectTypeName,
        resourceManager,
        processor,
        requestedResourceOrg,
        processingResourceOrg
  };
