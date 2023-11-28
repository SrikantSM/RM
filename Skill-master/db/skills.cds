namespace com.sap.resourceManagement.skill;

using {
  Language,
  User,
  sap.common.CodeList
} from '@sap/cds/common';
using from '../../db';
using com.sap.resourceManagement.config as config from '@sap/rm-centralServices/db';

/*
 * Aspect to capture a subset of adminstrative data
 */
aspect managed {
  createdAt  : Timestamp @cds.on.insert : $now;
  modifiedAt : Timestamp @cds.on.insert : $now  @cds.on.update  : $now;
  modifiedBy : User      @cds.on.insert : $user  @cds.on.update : $user;
};

@assert.unique.catalogSkill : [
  catalog_ID,
  skill_ID
]
entity Catalogs2Skills {
  key ID         : UUID;
      catalog_ID : UUID not null @mandatory;
      catalog    : Association to one Catalogs
                     on catalog.ID = catalog_ID;
      skill_ID   : UUID not null @mandatory;
      skill      : Association to one Skills
                     on skill.ID = skill_ID;
}

@assert.unique.name : [name]
@fiori.draft.enabled
entity Catalogs : managed {
  key ID                : UUID;
      OID         : String(128);
      name              : String(256)  @mandatory;
      description       : String(4000) @mandatory;
      skillAssociations : Composition of many Catalogs2Skills
                            on skillAssociations.catalog = $self;
};

entity LifecycleStatus : CodeList {
  key code : Integer;
};

@assert.unique.externalID : [externalID]
@fiori.draft.enabled
entity Skills : managed {
  key ID                              : UUID;
      OID                             : String(128);
      externalID                      : String(4000)           @mandatory;
      catalogAssociations             : Association to many Catalogs2Skills
                                          on catalogAssociations.skill = $self;
      alternativeLabels               : Composition of many AlternativeLabels
                                          on alternativeLabels.skill = $self;
      commaSeparatedAlternativeLabels : localized String(4000) @readonly;
      virtual commaSeparatedCatalogs  : String(4000);
      virtual commaSeparatedLanguages : String(4000);
      description                     : localized String(4000);
      name                            : localized String(256);
      lifecycleStatus_code            : Integer not null default 0;
      lifecycleStatus                 : Association to one LifecycleStatus
                                          on lifecycleStatus.code = lifecycleStatus_code;
      proficiencySet_ID               : UUID;
      proficiencySet                  : Association to one ProficiencySets
                                          on proficiencySet.ID = proficiencySet_ID;
};

@cds.persistence.exists
entity SkillsDownload {
  skillUUID            : String(4000);
  conceptUri           : String(4000);
  locale               : String(4000);
  preferredLabel       : String(4000);
  description          : String(4000);
  altLabels            : String(4000);
  usage                : String(4000);
  catalogs             : String(4000);
  proficiencySet       : String(4000);
  proficiencyLevelUUID : String(4000);
  proficiencyLevel     : String(4000);
  proficiencyLevelName : String(6000);
};

annotate skill.Skills.texts with {
  description @mandatory;
  name        @mandatory;
}

entity AlternativeLabels {
  key ID       : UUID;
      name     : String(256)   @mandatory;
      skill_ID : UUID not null @mandatory;
      skill    : Association to one Skills
                   on skill.ID = skill_ID;
      language : Language      @mandatory;
}

@assert.unique.name : [name]
@fiori.draft.enabled
entity ProficiencySets : managed {
  key ID                : UUID;
      OID         : String(128);
      name              : String(256) @mandatory;
      description       : String(4000);
      proficiencyLevels : Composition of many ProficiencyLevels
                            on proficiencyLevels.proficiencySet = $self;
      skills            : Association to many Skills
                            on skills.proficiencySet = $self;
      isCustom          : Boolean default true;
      lifecycleStatus_code            : Integer not null default 0;
      lifecycleStatus                 : Association to one LifecycleStatus
                                          on lifecycleStatus.code = lifecycleStatus_code;
}

@fiori.draft.enabled
entity ProficiencyLevels {
  key ID                              : UUID;
      odmUUID                         : UUID;
      proficiencySet_ID               : UUID not null @mandatory;
      proficiencySet                  : Association to one ProficiencySets
                                          on proficiencySet.ID = proficiencySet_ID;
      rank                            : Integer;
      name                            : localized String(256);
      description                     : localized String(4000);
      virtual commaSeparatedLanguages : String(4000);
}

annotate skill.ProficiencyLevels.texts with {
  description @mandatory;
  name        @mandatory;
}

entity UploadJob {
  key ID                     : UUID;
      state                  : String    @assert.range enum {
        initial;
        running;
        success;
        warning;
        error;
        interrupted
      };
      createdSkillsCount     : Integer;
      updatedSkillsCount     : Integer;
      failedSkillsCount      : Integer;
      unprocessedSkillsCount : Integer;
      skillsTotalCount       : Integer;
      jobOwner               : User      @cds.on.insert : $user;
      startedAt              : Timestamp @cds.on.insert : $now;
      modifiedAt             : Timestamp @cds.on.insert : $now  @cds.on.update : $now;
      uploadErrors           : Composition of many UploadErrors
                                 on uploadErrors.uploadJob = $self;
}

entity UploadErrors {
  key ID             : UUID;
      type           : String @assert.range enum {
        ![1-general];
        ![2-parsing];
        ![3-save];
        ![4-missingCatalog];
      };
      uploadJob      : Association to one UploadJob;
      count          : Integer;
      affectedEntity : String(4000);
      errorMessage   : String(256);
}

@odata.singleton
view DefaultLanguage as
  select from config.DefaultLanguages {
    language_code
  }
  where
    rank = 0;
