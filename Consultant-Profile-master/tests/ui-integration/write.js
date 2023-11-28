const {
    StatementFileWriter,
    SqliteSqlGenerator,
    EmailRepository,
    JobDetailRepository,
    PhoneRepository,
    PhotoRepository,
    WorkforcePersonRepository,
    OrganizationDetailRepository,
    OrganizationHeaderRepository,
    OrganizationStatusRepository,
    CostCenterRepository,
    CostCenterAttributeRepository,
    ProfileDetailRepository,
    WorkAssignmentRepository,
    WorkAssignmentDetailRepository,
    EmployeeHeaderRepository,
    ProjectRoleRepository,
    ProjectRoleTextRepository,
    ExternalWorkExperienceSkillRepository,
    ExternalWorkExperienceRepository,
    ResourceHeaderRepository,
    ResourceCapacityRepository,
    TimeDimensionDataRepository,
    RoleAssignmentRepository,
    RoleLifecycleStatusRepository,
    MonthsOfTheYearRepository,
    SkillAssignmentRepository,
    AlternativeLabelRepository,
    SkillTextRepository,
    SkillRepository,
    CatalogRepository,
    Catalogs2SkillsRepository,
    AssignmentsRepository,
    LifecycleStatusRepository,
    DefaultLanguageRepository,
    LanguageRepository,
    AvailabilityReplicationSummaryRepository,
    AvailabilitySummaryStatusRepository,
    AvailabilityReplicationErrorRepository,
    AssignmentBucketRepository,
    CustomerRepository,
    WorkPackageRepository,
    ProjectRepository,
    SkillRequirementRepository,
    CapacityRequirementRepository,
    ResourceRequestRepository,
    ProficiencySetRepository,
    ProficiencyLevelRepository,
    ProficiencyLevelTextRepository,
    BookedCapacityAggregateRepository,
    AssignmentStatusRepository,
    ProfilePhotoRepository,
    ResourceOrganizationsRepository,
    ResourceOrganizationItemsRepository,
    WorkerTypeRepository,
    AttachmentRepository,
} = require('test-commons');

const { emails } = require('./data/emails');
const { photos } = require('./data/photos');
const { phones } = require('./data/phones');
const { jobDetails } = require('./data/jobDetails');
const { workforcePersons } = require('./data/workforcePersons');
const { employeeHeaders } = require('./data/employeeHeaders');
const { organizationDetails } = require('./data/organizationDetails');
const { organizationHeaders } = require('./data/organizationHeaders');
const { organizationStatus } = require('./data/organizationStatus');
const { costCenters } = require('./data/costCenters');
const { costCenterAttributes } = require('./data/costCenterAttributes');
const { profileDetails } = require('./data/profileDetails');
const { workAssignments } = require('./data/workAssignments');
const { workAssignmentDetails } = require('./data/workAssignmentDetails');
const { projectRoles } = require('./data/projectRoles');
const { projectRolesTexts } = require('./data/projectRolesTexts');
const { roleAssignments } = require('./data/roleAssignments');
const { roleLifecycleStatus } = require('./data/roleLifecycleStatus');
const { monthsOfTheYear } = require('./data/monthsOfTheYear');
const { skills } = require('./data/skills');
const { alternativeLabels } = require('./data/alternativeLabels');
const { skillTexts } = require('./data/skillTexts');
const { skillAssignments } = require('./data/skillAssignments');
const { catalogs } = require('./data/skillCatalogs');
const { catalogs2skills } = require('./data/skillCatalogs2skills');
const { externalWorkExperienceSkills } = require('./data/externalWorkExperienceSkills');
const { externalWorkExperiences } = require('./data/externalWorkExperiences');
const { resourceHeaders } = require('./data/resourceHeaders');
const { assignments } = require('./data/assignments');
const { skillLifecycleStatus } = require('./data/skillLifecycleStatus');
const { defaultLanguages } = require('./data/defaultLanguages');
const { languages } = require('./data/languages');
const { availabilityReplicationSummary } = require('./data/availabilityReplicationSummary');
const { availabilitySummaryStatus } = require('./data/availabilitySummaryStatus');
const { availabilityReplicationError } = require('./data/availabilityReplicationError');
const { assignmentBucket } = require('./data/assignmentBucket');
const { customers } = require('./data/customers');
const { workpackage } = require('./data/workPackage');
const { project } = require('./data/project');
const { skillRequirements } = require('./data/skillRequirements');
const { capacityRequirements } = require('./data/capacityRequirements');
const { resourceRequestData } = require('./data/resourceRequest');
const { proficiencySetData } = require('./data/proficiencySets');
const { proficiencyLevelData } = require('./data/proficiencyLevels');
const { proficiencyTextData } = require('./data/proficiencyTexts');
const { bookedCapacityAggregate } = require('./data/bookedCapacityAggregate');
const { assignmentStatus } = require('./data/assignmentStatus');
const { profilePhotos } = require('./data/profilePhotos');
const { resourceOrganizations } = require('./data/resourceOrganizations');
const { resourceOrganizationItems } = require('./data/resourceOrganizationItems');
const { workerType } = require('./data/workerType');
const { attachments } = require('./data/attachments');

let emailRepository = null;
let photoRepository = null;
let workforcePersonRepository = null;
let jobDetailRepository = null;
let phoneRepository = null;
let employeeHeaderRepository = null;
let organizationDetailRepository = null;
let organizationHeaderRepository = null;
let organizationStatusRepository = null;
let costCenterRepository = null;
let costCenterAttributeRepository = null;
let profileDetailRepository = null;
let workAssignmentsRepository = null;
let workAssignmentDetailRepository = null;
let projectRoleRepository = null;
let projectRoleTextRepository = null;
let roleAssignmentRepository = null;
let roleLifecycleStatusRepository = null;
let monthsOfTheYearRepository = null;
let skillRepository = null;
let catalogRepository = null;
let catalogs2SkillsRepository = null;
let alternativeLabelRepository = null;
let skillAssignmentRepository = null;
let externalWorkExperienceSkillRepository = null;
let externalWorkExperienceRepository = null;
let resourceCapacityRepository = null;
let resourceHeaderRepository = null;
let assignmentsRepository = null;
let skillTextRepository = null;
let timeDimensionDataRepository = null;
let lifecycleStatusRepository = null;
let defaultLanguageRepository = null;
let languageRepository = null;
let availabilityReplicationSummaryRepository = null;
let availabilitySummaryStatusRepository = null;
const timeDimensionData = [];
const resourceCapacityData = [];
let availabilityReplicationErrorRepository = null;
let assignmentBucketRepository = null;
let customerRepository = null;
let workPackageRepository = null;
let projectRepository = null;
let skillRequirementRepository = null;
let capacityRequirementRepository = null;
let resourceRequestRepository = null;
let proficiencyLevelRepository = null;
let proficiencySetRepository = null;
let proficiencyLevelTextRepository = null;
let bookedCapacityAggregateRepository = null;
let assignmentStatusRepository = null;
let profilePhotoRepository = null;
let resourceOrganizationsRepository = null;
let resourceOrganizationItemsRepository = null;
let workerTypeRepository = null;
let attachmentRepository = null;

const writer = new StatementFileWriter('data.sql');
writer.clearFile();

// Initializing all the repositories
console.log('Initializing all the repositories');
emailRepository = new EmailRepository(writer, new SqliteSqlGenerator());
photoRepository = new PhotoRepository(writer, new SqliteSqlGenerator());
workAssignmentsRepository = new WorkAssignmentRepository(writer, new SqliteSqlGenerator());
workAssignmentDetailRepository = new WorkAssignmentDetailRepository(writer, new SqliteSqlGenerator());
workforcePersonRepository = new WorkforcePersonRepository(writer, new SqliteSqlGenerator());
jobDetailRepository = new JobDetailRepository(writer, new SqliteSqlGenerator());
profileDetailRepository = new ProfileDetailRepository(writer, new SqliteSqlGenerator());
phoneRepository = new PhoneRepository(writer, new SqliteSqlGenerator());
employeeHeaderRepository = new EmployeeHeaderRepository(writer, new SqliteSqlGenerator());
organizationDetailRepository = new OrganizationDetailRepository(writer, new SqliteSqlGenerator());
organizationHeaderRepository = new OrganizationHeaderRepository(writer, new SqliteSqlGenerator());
organizationStatusRepository = new OrganizationStatusRepository(writer, new SqliteSqlGenerator());
costCenterRepository = new CostCenterRepository(writer, new SqliteSqlGenerator());
costCenterAttributeRepository = new CostCenterAttributeRepository(writer, new SqliteSqlGenerator());
projectRoleRepository = new ProjectRoleRepository(writer, new ProjectRoleTextRepository(), new SqliteSqlGenerator());
projectRoleTextRepository = new ProjectRoleTextRepository(writer, new SqliteSqlGenerator());
roleAssignmentRepository = new RoleAssignmentRepository(writer, new SqliteSqlGenerator());
roleLifecycleStatusRepository = new RoleLifecycleStatusRepository(writer, new SqliteSqlGenerator());
monthsOfTheYearRepository = new MonthsOfTheYearRepository(writer, new SqliteSqlGenerator());
alternativeLabelRepository = new AlternativeLabelRepository(writer, new SqliteSqlGenerator());
skillTextRepository = new SkillTextRepository(writer, new SqliteSqlGenerator());
skillRepository = new SkillRepository(writer, skillTextRepository, alternativeLabelRepository, catalogs2SkillsRepository, new SqliteSqlGenerator());
catalogs2SkillsRepository = new Catalogs2SkillsRepository(writer, new SqliteSqlGenerator());
catalogRepository = new CatalogRepository(writer, catalogs2SkillsRepository, new SqliteSqlGenerator());
skillAssignmentRepository = new SkillAssignmentRepository(writer, new SqliteSqlGenerator());
externalWorkExperienceSkillRepository = new ExternalWorkExperienceSkillRepository(writer, new SqliteSqlGenerator());
externalWorkExperienceRepository = new ExternalWorkExperienceRepository(writer, new SqliteSqlGenerator());
resourceCapacityRepository = new ResourceCapacityRepository(writer, new SqliteSqlGenerator());
resourceHeaderRepository = new ResourceHeaderRepository(writer, new SqliteSqlGenerator());
timeDimensionDataRepository = new TimeDimensionDataRepository(writer, new SqliteSqlGenerator());
assignmentsRepository = new AssignmentsRepository(writer, new SqliteSqlGenerator());
lifecycleStatusRepository = new LifecycleStatusRepository(writer, new SqliteSqlGenerator());
defaultLanguageRepository = new DefaultLanguageRepository(writer, new SqliteSqlGenerator());
languageRepository = new LanguageRepository(writer, new SqliteSqlGenerator());
availabilityReplicationSummaryRepository = new AvailabilityReplicationSummaryRepository(writer, new SqliteSqlGenerator());
availabilitySummaryStatusRepository = new AvailabilitySummaryStatusRepository(writer, new SqliteSqlGenerator());
availabilityReplicationErrorRepository = new AvailabilityReplicationErrorRepository(writer, new SqliteSqlGenerator());
assignmentBucketRepository = new AssignmentBucketRepository(writer, new SqliteSqlGenerator());
customerRepository = new CustomerRepository(writer, new SqliteSqlGenerator());
workPackageRepository = new WorkPackageRepository(writer, new SqliteSqlGenerator());
projectRepository = new ProjectRepository(writer, new SqliteSqlGenerator());
skillRequirementRepository = new SkillRequirementRepository(writer, new SqliteSqlGenerator());
capacityRequirementRepository = new CapacityRequirementRepository(writer, new SqliteSqlGenerator());
resourceRequestRepository = new ResourceRequestRepository(writer, skillRequirementRepository, capacityRequirementRepository, new SqliteSqlGenerator());
proficiencyLevelTextRepository = new ProficiencyLevelTextRepository(writer, new SqliteSqlGenerator());
proficiencyLevelRepository = new ProficiencyLevelRepository(writer, proficiencyLevelTextRepository, new SqliteSqlGenerator());
proficiencySetRepository = new ProficiencySetRepository(writer, proficiencyLevelRepository, new SqliteSqlGenerator());
bookedCapacityAggregateRepository = new BookedCapacityAggregateRepository(writer, new SqliteSqlGenerator());
assignmentStatusRepository = new AssignmentStatusRepository(writer, new SqliteSqlGenerator());
profilePhotoRepository = new ProfilePhotoRepository(writer, new SqliteSqlGenerator());
resourceOrganizationsRepository = new ResourceOrganizationsRepository(writer, new SqliteSqlGenerator());
resourceOrganizationItemsRepository = new ResourceOrganizationItemsRepository(writer, new SqliteSqlGenerator());
workerTypeRepository = new WorkerTypeRepository(writer, new SqliteSqlGenerator());
attachmentRepository = new AttachmentRepository(writer, new SqliteSqlGenerator());
console.log('All repositories initialized.');

generateResourceCapacity();
emailRepository.insertMany(emails);
photoRepository.insertMany(photos);
workAssignmentsRepository.insertMany(workAssignments);
workAssignmentDetailRepository.insertMany(workAssignmentDetails);
organizationDetailRepository.insertMany(organizationDetails);
phoneRepository.insertMany(phones);
organizationHeaderRepository.insertMany(organizationHeaders);
organizationStatusRepository.insertMany(organizationStatus);
costCenterRepository.insertMany(costCenters);
costCenterAttributeRepository.insertMany(costCenterAttributes);
workforcePersonRepository.insertMany(workforcePersons);
jobDetailRepository.insertMany(jobDetails);
employeeHeaderRepository.insertMany(employeeHeaders);
profileDetailRepository.insertMany(profileDetails);
projectRoleRepository.insertMany(projectRoles);
projectRoleTextRepository.insertMany(projectRolesTexts);
roleAssignmentRepository.insertMany(roleAssignments);
roleLifecycleStatusRepository.insertMany(roleLifecycleStatus);
monthsOfTheYearRepository.insertMany(monthsOfTheYear);
skillRepository.insertMany(skills);
alternativeLabelRepository.insertMany(alternativeLabels);
skillTextRepository.insertMany(skillTexts);
catalogs2SkillsRepository.insertMany(catalogs2skills);
catalogRepository.insertMany(catalogs);
skillAssignmentRepository.insertMany(skillAssignments);
externalWorkExperienceSkillRepository.insertMany(externalWorkExperienceSkills);
externalWorkExperienceRepository.insertMany(externalWorkExperiences);
resourceHeaderRepository.insertMany(resourceHeaders);
assignmentsRepository.insertMany(assignments);
lifecycleStatusRepository.insertMany(skillLifecycleStatus);
defaultLanguageRepository.insertMany(defaultLanguages);
languageRepository.insertMany(languages);
availabilityReplicationSummaryRepository.insertMany(availabilityReplicationSummary);
availabilityReplicationErrorRepository.insertMany(availabilityReplicationError);
availabilitySummaryStatusRepository.insertMany(availabilitySummaryStatus);
assignmentBucketRepository.insertMany(assignmentBucket);
customerRepository.insertMany(customers);
workPackageRepository.insertMany(workpackage);
projectRepository.insertMany(project);
skillRequirementRepository.insertMany(skillRequirements);
capacityRequirementRepository.insertMany(capacityRequirements);
resourceRequestRepository.insertMany(resourceRequestData);
proficiencyLevelTextRepository.insertMany(proficiencyTextData);
proficiencySetRepository.insertMany(proficiencySetData);
proficiencyLevelRepository.insertMany(proficiencyLevelData);
bookedCapacityAggregateRepository.insertMany(bookedCapacityAggregate);
assignmentStatusRepository.insertMany(assignmentStatus);
profilePhotoRepository.insertMany(profilePhotos);
resourceOrganizationsRepository.insertMany(resourceOrganizations);
resourceOrganizationItemsRepository.insertMany(resourceOrganizationItems);
workerTypeRepository.insertMany(workerType);
attachmentRepository.insertMany(attachments);
setTimeout(() => {
    resourceCapacityRepository.insertMany(resourceCapacityData);
}, 1000);
setTimeout(() => {
    timeDimensionDataRepository.insertMany(timeDimensionData);
}, 5000);
console.log('Initial data setup completed');

function generateResourceCapacity() {
    const now = new Date(Date.now());
    const resourceID = resourceHeaders[1].ID;

    for (let mon = 0; mon < 24; mon++) {
        const lastDayOfMonth = new Date(now.getFullYear(), mon + 1, 0);
        for (let date = 1; date <= lastDayOfMonth.getDate(); date++) {
            const currentDate = new Date(Date.UTC(now.getFullYear(), mon, date));
            const nextDate = new Date(Date.UTC(now.getFullYear(), mon, date + 1));
            const resourceCapacity = {
                resource_id: resourceID,
                startTime: currentDate.toJSON().replace('T00:00:00.000Z', ' 00:00:00.000'),
                workingTimeInMinutes: '480',
                overTimeInMinutes: '50',
                plannedNonWorkingTimeInMinutes: '25',
                bookedTimeInMinutes: '25',
                endTime: nextDate.toJSON().replace('T00:00:00.000Z', ' 00:00:00.000'),
            };
            const timeStamp = currentDate.toJSON();
            const dateTimeSAP = timeStamp.replace('T00:00:00.000Z', '000000').replace('-', '').replace('-', '');
            const currentYear = currentDate.getFullYear();
            const currentYearAsString = currentYear.toString();
            const month = currentDate.getMonth() + 1;
            const monthAsString = (`0${month}`).slice(-2).toString();
            const currentQuarter = Math.floor((month + 3) / 3);
            const currentWeek = (Math.ceil((((currentDate - new Date(now.getFullYear(), 0, 1)) / 86400000) - 1) / 7));
            const currentWeekAsString = currentWeek.toString();

            const timeDimension = {
                DATETIMESTAMP: timeStamp.replace('T00:00:00.000Z', ' 00:00:00.000'),
                DATE_SQL: timeStamp.replace('T00:00:00.000Z', ''),
                DATETIME_SAP: parseInt(dateTimeSAP, 10),
                DATE_SAP: parseInt(dateTimeSAP.substring(0, 8), 10),
                YEAR: currentYear,
                QUARTER: `Q${currentQuarter}`,
                MONTH: monthAsString,
                WEEK: currentWeek,
                WEEK_YEAR: currentYear,
                DAY_OF_WEEK: (currentDate.getDay() === 0) ? 7 : currentDate.getDay(),
                DAY: (`0${currentDate.getDate()}`).slice(-2).toString(),
                HOUR: '00',
                MINUTE: '00',
                HALF_HOUR_INDEX: '',
                QUARTER_HOUR_INDEX: '',
                CALQUARTER: parseInt(currentYearAsString + currentQuarter.toString(), 10),
                CALMONTH: parseInt(currentYearAsString + monthAsString, 10),
                CALWEEK: parseInt(currentYearAsString + currentWeekAsString, 10),
            };
            resourceCapacityData.push(resourceCapacity);
            timeDimensionData.push(timeDimension);
        }
    }
}
