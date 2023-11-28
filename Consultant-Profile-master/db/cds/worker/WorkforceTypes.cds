namespace com.sap.resourceManagement.workforce.workforceTypes;

type URI : String(2000);
type URL : URI;
type PhoneNumber : String(132);
type EmailAddress : String(256);

type CountryCode : {
    code : String(2);
};

type OrganizationalUnit {
    externalId : String(128);
}
type ControllingAreaId : String(4);
