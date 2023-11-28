using com.sap.resourceManagement as rm from '../../db';

service ProjectExperienceService  @(requires: 'System'){

    @Capabilities: {
    InsertRestrictions.Insertable: false,
    UpdateRestrictions.Updatable: false,
    DeleteRestrictions.Deletable: false
    }
    entity Profiles @(restrict : [{
        grant: ['READ'], 
        to: 'System'
    }]) as projection on rm.profile.Profiles;

    @Capabilities: {
    InsertRestrictions.Insertable: false,
    UpdateRestrictions.Updatable: false,
    DeleteRestrictions.Deletable: false
    }
    entity PrimaryWorkAssignment @(restrict : [{
        grant: ['READ'], 
        to: 'System'
    }]) as projection on rm.profile.PrimaryWorkAssignment;

    @Capabilities: {
    InsertRestrictions.Insertable: true,
    UpdateRestrictions.Updatable: true,
    DeleteRestrictions.Deletable: true
    }
    entity SkillAssignments @(restrict : [{
        grant : ['READ', 'WRITE'],
        to: 'System'
    }]) as projection on rm.profile.SkillAssignments; 

    @Capabilities: {
    InsertRestrictions.Insertable: true,
    UpdateRestrictions.Updatable: true,
    DeleteRestrictions.Deletable: true
    }
    entity ExternalWorkExperience @(restrict : [{
        grant: ['READ', 'WRITE'],
        to: 'System'
    }]) as projection on rm.profile.ExternalWorkExperience;

    @Capabilities: {
    InsertRestrictions.Insertable: true,
    UpdateRestrictions.Updatable: true,
    DeleteRestrictions.Deletable: true
    }
    entity ExternalWorkExperienceSkillAssignments @(restrict : [{
        grant: ['READ', 'WRITE'],
        to: 'System'
    }]) as projection on rm.profile.ExternalWorkExperienceSkillAssignments;

}