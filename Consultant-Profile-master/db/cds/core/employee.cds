namespace com.sap.resourceManagement.employee;

using { managed, sap.common.CodeList } from '@sap/cds/common';
using com.sap.resourceManagement.employee.availability      as availability    from './availability';
using com.sap.resourceManagement.employee.priorExperience   as priorExperience from './priorExperience';
using com.sap.resourceManagement.employee.qualifications    as qualifications  from './qualifications';
using com.sap.resourceManagement.workforce.workAssignment   as workAssignment  from '../worker/WorkAssignments';
using com.sap.resourceManagement.workforce.workforcePerson  as workforcePerson from '../worker/WorkforcePersons';
using com.sap.resourceManagement.workforce.workforceCommon  as workforceCommon from '../worker/WorkforceCommon';
using com.sap.resourceManagement.organization as organization from '../core/organization';


@cds.search : {profile.firstName,profile.lastName,profile.costCenter,profile.costCenterDescription,profile.workerExternalID,profile.officeLocation,profile.workerType.name,skills.skill.name,roles.role.name}
entity Headers : managed {
    key ID                      : cds.UUID;
        virtual commaSeparatedSkills: String(4000);
        virtual commaSeparatedRoles: String(4000);
        @odata.navigable : false
        worker                  : Association to one workforcePerson.WorkforcePersons on worker.ID = ID;
        profile                 : Association to one ProfileData on profile.ID = ID;
        profilePhoto            : Composition of one ProfilePhoto on profilePhoto.employee = $self;
        attachment              : Composition of one Attachment on attachment.employee = $self;
        skills                  : Composition of many qualifications.SkillAssignments on skills.employee = $self;
        roles                   : Composition of many priorExperience.RoleAssignments on roles.employee = $self;
        externalWorkExperience  : Composition of many priorExperience.ExternalWorkExperience on externalWorkExperience.employee = $self;
        internalWorkExperience  : Association to many priorExperience.InternalWorkExperience on internalWorkExperience.employee = $self;
        periodicAvailability    : Association to many availability.PeriodicAvailability on periodicAvailability.workforcePersonID = ID;
        periodicUtilization     : Association to many availability.PeriodicUtilization on periodicUtilization.workforcePersonID = ID;
        utilization             : Association to one availability.Utilization on utilization.workforcePersonID = ID;
}

entity ProfilePhoto : managed {
    key ID                      : cds.UUID;
        employee_ID             : cds.UUID;
        profileImage            : LargeBinary    @Core.MediaType : 'image/jpeg' @Core.AcceptableMediaTypes: ['image/jpeg', 'image/png'] @Core.ContentDisposition: {Type: 'inline' , Filename: fileName};
        profileThumbnail        : LargeBinary    @Core.MediaType : 'image/jpeg' @Core.AcceptableMediaTypes: ['image/jpeg', 'image/png'] @Core.ContentDisposition: {Type: 'inline'};
        fileName                : String;
        employee                : Association to employee.Headers on employee.ID = employee_ID;
}

entity Attachment : managed {
    key ID                      : cds.UUID;
        employee_ID             : cds.UUID;
        content                 : LargeBinary @Core.MediaType : 'application/pdf' @odata.mediaContentType: null @Core.AcceptableMediaTypes : ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] @Core.ContentDisposition: {Type : 'attachment', Filename: fileName};   
        fileName                : String default '';
        employee                : Association to employee.Headers on employee.ID = employee_ID;
}

entity ConsultantProfilePhoto as select from ProfilePhoto {
    ID,
    employee_ID,
    profileImage,
    profileThumbnail
};

entity LastActiveProfileDetail as select from workforcePerson.ProfileDetails {
    *,
    ROW_NUMBER() OVER (PARTITION BY parent ORDER BY validFrom DESC) as profilenumber
} where validFrom <= $now;

entity ProfileDataBuilder as select from workforcePerson.WorkforcePersons mixin {
    defaultEmail          : Association to one workforcePerson.Emails on defaultEmail.parent = $projection.ID and defaultEmail.isDefault = true;
    defaultPhone          : Association to one workforcePerson.Phones on defaultPhone.parent = $projection.ID and defaultPhone.isDefault = true;
    profilePhoto          : Association to one workforcePerson.Photos on profilePhoto.parent = $projection.ID and profilePhoto.type.code = '1';
    currentProfileDetail  : Association to one LastActiveProfileDetail on currentProfileDetail.parent = $projection.ID and currentProfileDetail.profilenumber = 1;
    currentWorkAssignment : Association to one workAssignment.PrimaryWorkAssignments on currentWorkAssignment.parent = $projection.ID and currentWorkAssignment.validFrom <= $now and currentWorkAssignment.validTo > $now;
} into {
    key ID,
		isBusinessPurposeCompleted,
        externalID,
        defaultEmail,
        defaultPhone,
        currentProfileDetail,
        currentWorkAssignment,
        profilePhoto
};

entity ProfileData as select from ProfileDataBuilder mixin {
    toManager    : Association to ManagerProfileData on toManager.externalID = $projection.managerExternalID and toManager.validFrom <= $now and toManager.validTo > $now;
    toWorkerType : Association to one workAssignment.WorkerType on toWorkerType.isContingentWorker =  $projection.isContingentWorker;
} into {
    key ID,
        externalID as workerExternalID,
        defaultEmail.address as emailAddress,
        profilePhoto.imageURL as profilePhotoURL,
        cast ( '+' || defaultPhone.number as String) as mobilePhoneNumber: String,
        cast ( currentProfileDetail.fullName || ' (' || externalID || ')' as String) as name : String,
        currentProfileDetail.initials as initials : String,
        currentProfileDetail.firstName as firstName : String,
        currentProfileDetail.lastName as lastName : String,
        currentProfileDetail.fullName as fullName : String,
        cast ('Project Team Member' as String) as dataSubjectRole: String,
        currentWorkAssignment.currentJD.jobTitle as role,
        currentWorkAssignment.currentJD.supervisorWorkAssignmentExternalID as managerExternalID,
        currentWorkAssignment.currentJD.country_name as officeLocation,
        cast ( currentWorkAssignment.currentJD.resourceOrg.name || ' (' || currentWorkAssignment.currentJD.resourceOrg.ID || ')' as String) as resourceOrg: String,
        currentWorkAssignment.currentJD.resourceOrg.ID as resourceOrgId,
        currentWorkAssignment.currentJD.costCenter.costCenterID  as costCenter: String,
        currentWorkAssignment.currentJD.costCenter.costCenterAttributes.description as costCenterDescription: String,
        toManager,
        currentWorkAssignment.isContingentWorker as isContingentWorker,
        toWorkerType as workerType,
};

extend workforcePerson.ProfileDetails with {
    fullName : String
}

extend organization.CostCenters {
    costCenterDesc : String
}

entity ManagerProfileData as select from workAssignment.WorkAssignments mixin {
    toWorkerProfile : Association to ProfileData on toWorkerProfile.managerExternalID = $projection.externalID;
} into {
    key externalID,
        parent as managerId,
        toProfileData.defaultEmail.address as mangerEmailAddress,
        cast ( '+' || toProfileData.defaultPhone.number as String) as managerMobilePhoneNumber: String,
        cast ( toProfileData.currentProfileDetail.firstName || ' ' || toProfileData.currentProfileDetail.lastName || ' (' || externalID || ')' as String) as managerName: String,
        startDate as validFrom,
        endDate as validTo,
        toWorkerProfile
};

//This view is created for PDM
entity JobDetais as select from workAssignment.JobDetails as jd JOIN workAssignment.WorkAssignments as wa ON jd.parent = wa.ID{
    key jd.ID as ID,
        jd.validFrom as startDate,
        jd.validTo as endDate,
        jd.jobExternalID as jobExternalID,
        jd.jobTitle as jobTitle,
        jd.costCenter.costCenterID as costCenterExternalID,
        wa.startDate as workAssignmentStartDate,
        wa.endDate as workAssignmentEndDate,
        wa.isContingentWorker as isContingentWorker,
        wa.externalID as workAssignmentExternalID,
        wa.parent as employee_ID
};
