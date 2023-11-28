namespace com.sap.resourceManagement.workforce.workforcePerson;

using { cuid, managed, Country, Language } from '@sap/cds/common';

using com.sap.resourceManagement.workforce.workAssignment       as workAssignment from './WorkAssignments';
using com.sap.resourceManagement.workforce.workforceCodelists   as workforceCodelists from './WorkforceCodelists';
using com.sap.resourceManagement.workforce.workforceCommon      as workforceCommon from './WorkforceCommon';
using com.sap.resourceManagement.workforce.workforceTypes as workforceTypes from './WorkforceTypes';

entity WorkforcePersons : cuid, managed {
    externalID                      : String(100) not null;
	// This field is to notify that the worker has been marked for deletion from the Resource-Management solution
    isBusinessPurposeCompleted      : Boolean;
    businessPurposeCompletionDetail : Composition of one BusinessPurposeCompletionDetails on businessPurposeCompletionDetail.ID = $self.ID;
    workAssignments                 : Composition of many workAssignment.WorkAssignments on workAssignments.parent = $self.ID;
    biographicalDetail              : Composition of one BiographicalDetails on biographicalDetail.ID = $self.ID;
    userAccount                     : Composition of one SourceUserAccounts on userAccount.ID = $self.ID;
    photos                          : Composition of many Photos on photos.parent = $self.ID;
    personalDetails                 : Composition of many PersonalDetails on personalDetails.parent = $self.ID;
    profileDetails                  : Composition of many ProfileDetails on profileDetails.parent = $self.ID;
    privateAddresses                : Composition of many PrivateAddresses on privateAddresses.parent = $self.ID;
    emails                          : Composition of many Emails on emails.parent = $self.ID;
    phones                          : Composition of many Phones on phones.parent = $self.ID;
}

entity BusinessPurposeCompletionDetails : cuid {
    businessPurposeCompletionDate : Date;
}

entity BiographicalDetails : cuid, managed {
    dateOfBirth : Date;
    dateOfDeath : Date;
}

entity SourceUserAccounts : cuid, managed {
    userName : String(100) not null;
}

entity Photos : workforceCommon.composites {
    imageURL      : workforceTypes.URL not null;
    type          : workforceCodelists.PhotoTypeCode;
    isMediaStream : Boolean;
}

entity PersonalDetails : workforceCommon.temporalComposites {
    formOfAddress     : workforceCodelists.FormOfAddressCode;
    gender            : workforceCodelists.GenderCode;
    nationality       : Country;
    secondNationality : Country;
    thirdNationality  : Country;
    maritalStatus     : workforceCodelists.MaritalStatusCode;
}

@assert.unique: {
  uniqueValidProfile: [ ID, validFrom ],
}
entity ProfileDetails : workforceCommon.temporalCompositesWithoutAnnotation {
    script                  : workforceCodelists.ScriptNameCode;
    firstName               : String(128);
    middleName              : String(128);
    lastName                : String(128);
    formalName              : String(4000);
    initials                : String(128);
    academicTitle           : workforceCodelists.AcademicTitleCode;
    additionalAcademicTitle : workforceCodelists.AcademicTitleCode;
    nameSuffix              : workforceCodelists.FamilyNameSuffixCode;
    namePrefix              : workforceCodelists.FamilyNamePrefixCode;
    nativePreferredLanguage : Language;
    birthName               : String(128);
    preferredName           : String(128);
    businessFirstName       : String(128);
    businessLastName        : String(128);
    partnerName             : String(128);
    partnerNamePrefix       : String(128);
    secondLastName          : String(128);
}

entity Emails : workforceCommon.composites {
    isDefault : Boolean;
    address   : workforceTypes.EmailAddress;
    usage     : workforceCodelists.EmailUsageCode;
}

entity Phones : workforceCommon.composites {
    isDefault: Boolean;
    number   : workforceTypes.PhoneNumber;
    country  : workforceTypes.CountryCode;
    usage    : workforceCodelists.PhoneUsageCode;
}

entity PrivateAddresses : workforceCommon.temporalComposites, workforceCodelists.ScriptedPersonAddress {
    usage : workforceCodelists.AddressUsageCode;
}

// Moved from WorkAssignment.cds
// moved from capinternal.cds
extend entity WorkforcePersons with {
        @cds.api.ignore WorkforcePersons_CHANGETIME               : Timestamp;
        @cds.api.ignore BiographicalDetails_CHANGETIME            : Timestamp;
        @cds.api.ignore SourceUserAccounts_CHANGETIME             : Timestamp;
        @cds.api.ignore Photos_CHANGETIME                         : Timestamp;
        @cds.api.ignore Emails_CHANGETIME                         : Timestamp;
        @cds.api.ignore Phones_CHANGETIME                         : Timestamp;
        @cds.api.ignore PersonalDetails_CHANGETIME                : Timestamp;
        @cds.api.ignore ProfileDetails_CHANGETIME                 : Timestamp;
        @cds.api.ignore PrivateAddresses_CHANGETIME               : Timestamp;
        @cds.api.ignore WorkAssignments_CHANGETIME                : Timestamp;
        @cds.api.ignore WorkAssignmentDetails_CHANGETIME          : Timestamp;
        @cds.api.ignore JobDetails_CHANGETIME                     : Timestamp;
        @cds.api.ignore PaymentDetails_CHANGETIME                 : Timestamp;
        @cds.api.ignore WorkAssignmentPrivateAddresses_CHANGETIME : Timestamp;
        @cds.api.ignore SystemOfRecordKeys_CHANGETIME             : Timestamp;
}
