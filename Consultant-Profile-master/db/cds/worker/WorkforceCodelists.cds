namespace com.sap.resourceManagement.workforce.workforceCodelists;

using { sap.common.CodeList, Country } from '@sap/cds/common';

entity PhotoTypeCodes : CodeList { key code : String(2); }
type PhotoTypeCode : Association to PhotoTypeCodes;

entity AddressUsageCodes : CodeList { key code : String(10); }
type AddressUsageCode : Association to AddressUsageCodes;

entity JobDetailStatusCodes : CodeList { key code : String(32); }
type JobDetailStatusCode : Association to JobDetailStatusCodes;

entity PaymentTypeCodes : CodeList { key code : String(8); }
type PaymentTypeCode : Association to PaymentTypeCodes;

entity PaymentMethodCodes : CodeList { key code : String(2); }
type PaymentMethodCode : Association to PaymentMethodCodes;

entity BankAccountTypeCodes : CodeList { key code : String(20); }
type BankAccountTypeCode : Association to BankAccountTypeCodes;

entity BankControlKeyCodes : CodeList { key code : String(2); }
type BankControlKeyCode : Association to BankControlKeyCodes;

entity EmailUsageCodes : CodeList { key code : String(10); }
type EmailUsageCode : Association to EmailUsageCodes;

entity PhoneUsageCodes : CodeList { key code : String(10); }
type PhoneUsageCode : Association to PhoneUsageCodes;

entity EventReasonCodes : CodeList { key code : String(255); }
type EventReasonCode : Association to EventReasonCodes;

entity EventCodes: CodeList { key code: String(255); }
type EventCode : Association to EventCodes;

entity MaritalStatusCodes : CodeList { key code : String(2); }
type MaritalStatusCode : Association to MaritalStatusCodes;

entity FormOfAddressCodes : CodeList { key code : String(4); }
type FormOfAddressCode : Association to FormOfAddressCodes;

entity GenderCodes : CodeList { key code : String(1); }
type GenderCode : Association to GenderCodes;

entity AcademicTitleCodes : CodeList { key code : String(4); }
type AcademicTitleCode : Association to AcademicTitleCodes;

entity FamilyNamePrefixCodes : CodeList { key code : String(4); }
type FamilyNamePrefixCode : Association to FamilyNamePrefixCodes;

entity FamilyNameSuffixCodes : CodeList { key code : String(4); }
type FamilyNameSuffixCode : Association to FamilyNameSuffixCodes;

entity PostalCodes : CodeList { key code : String(10); }
type PostalCode : Association to PostalCodes;

entity CountrySubdivisionCodes : CodeList { key code : String(6); }
type CountrySubdivisionCode : Association to CountrySubdivisionCodes;

entity ThoroughfareCodes : CodeList { key code : String(10); }
type ThoroughfareCode : Association to ThoroughfareCodes;

entity TownCodes : CodeList { key code : String(10); }
type TownCode : Association to TownCodes;

entity DistrictCodes : CodeList { key code : String(10); }
type DistrictCode : Association to DistrictCodes;

entity CompanyCodes : CodeList { key code : String(4); }
type CompanyCode : Association to CompanyCodes;

type DeliveryServiceType : String(64) enum {
    POBoxDelivery;
    PrivateBagDelivery;
    PosteRestanteDelivery;
    CompanyDelivery;
    WorkerCampElectricityMeterDelivery;
    WorkerCampBedDelivery;
    Other
};

type RegionInfo {
    primaryRegion   : CountrySubdivisionCode;
    secondaryRegion : CountrySubdivisionCode;
    tertiaryRegion  : CountrySubdivisionCode;
}

type ThoroughfareInfo {
    tfPrefix1    : String(256);
    tfPrefix2    : String(256);
    thoroughfare : ThoroughfareCode;
    tfSuffix1    : String(256);
    tfSuffix2    : String(256);
}

type PremisesInfo {
    houseNumber           : String(256);
    houseNumberSupplement : String(256);
}

type LocalityInfo : RegionInfo {
    town     : TownCode;
    district : DistrictCode;
}

type AddressedObjectInfo {
    floor  : String(256);
    door   : String(256);
    careOf : String(256);
}

type PostalAddress {
    physical    : PhysicalDeliveryAddress;
    alternative : AlternativeDeliveryAddress;
}

type CountryLevelInfo {
    country  : Country;
    postCode : PostalCode;
}

type PhysicalDeliveryAddress : CountryLevelInfo, LocalityInfo, ThoroughfareInfo, PremisesInfo, AddressedObjectInfo {}

type AlternativeDeliveryAddress : CountryLevelInfo, LocalityInfo {
    deliveryServiceType       : DeliveryServiceType;
    deliveryServiceQualifier  : String(256);
    deliveryServiceIdentifier : String(256);
}

entity ScriptNameCodes : CodeList { key code : String(4); }
type ScriptNameCode : Association to ScriptNameCodes;
type ScriptedObject { scriptNameCode : ScriptNameCode; }
type ScriptedPersonAddress : ScriptedObject, PostalAddress {}
