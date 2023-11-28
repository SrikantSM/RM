import { CountryConfig } from '../utils/Country';

const allCountryInfo: CountryConfig[] = new Array<CountryConfig>();
const costCenterTobeIgnoredForResourceCapacity = "DE01_CC02";
const _startingDate = new Date("2020-01-01");            // Starting Date to prepare the resources capacity
const _yearAheadDate = new Date("2021-01-10");           // Ending Date to prepare the resources capacity

const inCountryCode = "IN";                              // Country Code for India
const inWorkingMinutesPerDay = 480;                      // Working Minutes in week for india
const inHolidays: Date[] = [                             // Add Holidays for India during the _startindDate and _yearAheadDate
    new Date("2020-01-15"),
    new Date("2020-02-21"),
    new Date("2020-03-25"),
    new Date("2020-04-10"),
    new Date("2020-05-01"),
    new Date("2020-05-25"),
    new Date("2020-10-02"),
    new Date("2020-10-26"),
    new Date("2020-11-16"),
    new Date("2020-12-25"),
];
allCountryInfo.push(new CountryConfig(inCountryCode, inWorkingMinutesPerDay, inHolidays));

const deCountryCode = "DE";                              // Country Code for Germany
const deWorkingMinutesPerDay = 480;                      // Working Minutes in week for Germany
const deHolidays: Date[] = [                             // Add Holidays for Germany during the _startindDate and _yearAheadDate
    new Date("2020-01-01"),
    new Date("2020-01-06"),
    new Date("2020-02-25"),
    new Date("2020-04-10"),
    new Date("2020-05-01"),
    new Date("2020-05-21"),
    new Date("2020-06-01"),
    new Date("2020-06-11"),
    new Date("2020-11-18"),
    new Date("2020-12-25"),
];
allCountryInfo.push(new CountryConfig(deCountryCode, deWorkingMinutesPerDay, deHolidays));

const caCountryCode = "CA";                              // Country Code for Canada
const caWorkingMinutesPerDay = 480;                      // Working Minutes in week for Canada
const caHolidays: Date[] = [                             // Add Holidays for Canada during the _startindDate and _yearAheadDate
    new Date("2020-01-01"),
    new Date("2020-01-06"),
    new Date("2020-04-10"),
    new Date("2020-05-25"),
    new Date("2020-08-03"),
    new Date("2020-09-07"),
    new Date("2020-10-12"),
    new Date("2020-12-25"),
];
allCountryInfo.push(new CountryConfig(caCountryCode, caWorkingMinutesPerDay, caHolidays));

const usCountryCode = "US";                              // Country Code for USA
const usWorkingMinutesPerDay = 480;                      // Working Minutes in week for USA
const usHolidays: Date[] = [                             // Add Holidays for USA during the _startindDate and _yearAheadDate
    new Date("2020-01-01"),
    new Date("2020-01-20"),
    new Date("2020-05-25"),
    new Date("2020-07-03"),
    new Date("2020-09-07"),
    new Date("2020-11-11"),
    new Date("2020-11-26"),
    new Date("2020-12-25"),
];
allCountryInfo.push(new CountryConfig(usCountryCode, usWorkingMinutesPerDay, usHolidays));

// CSV Files Name for entities
export const alternativeLabelFileName = "AlternativeLabels";
export const catalogFileName = "Catalogs";
export const catalog2SkillFileName = "Catalogs2Skills";
export const emailFileName = "Emails";
export const photosFileName = "Photos";
export const employeeHeaderFileName = "EmployeeHeaders";
export const jobDetailFileName = "JobDetails";
export const organizationDetailFileName = "OrganizationDetails";
export const organizationHeaderFileName = "OrganizationHeaders";
export const costCenterFileName = "costCenter";
export const phoneFileName = "Phones";
export const proficiencySetFileName = "ProficiencySets";
export const proficiencyLevelFileName = "ProficiencyLevels";
export const proficiencyLevelTextFileName = "ProficiencyLevelTexts"
export const profileDetailFileName = "ProfileDetails";
export const projectRoleFileName = "ProjectRoles";
export const projectRoleTextFileName = "ProjectRoleTexts";
export const resourceCapacityFileName = "ResourceCapacities";
export const resourceHeaderFileName = "ResourceHeaders";
export const roleAssignmentFileName = "RoleAssignments";
export const skillAssignmentFileName = "SkillAssignments";
export const skillFileName = "Skills";
export const skillTextFileName = "SkillTexts";
export const workAssignmentFileName = "WorkAssignments";
export const workAssignmentDetailFileName = 'WorkAssignmentDetails';
export const workforcePersonFileName = "WorkforcePersons";
export const resourceOrganizationFileName = "ResourceOrganizations";
export const resourceOrganizationItemsFileName = "ResourceOrganizationItems";
export const costCenterAttributeFileName = "CostCenterAttributes";

export {
    _startingDate,
    _yearAheadDate,
    allCountryInfo,
    costCenterTobeIgnoredForResourceCapacity
};
