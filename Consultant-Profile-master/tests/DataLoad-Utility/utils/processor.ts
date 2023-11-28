import { testEnvironment } from './index';
import {
    ProjectRoleRepository, ProjectRoleTextRepository, EmployeeHeaderRepository, CsvParser, ProjectRole, ProjectRoleText, EmployeeHeader, SkillRepository, AlternativeLabelRepository, OrganizationHeaderRepository, OrganizationDetailRepository, RoleAssignmentRepository, SkillAssignmentRepository, ResourceHeaderRepository, ResourceCapacityRepository, EmailRepository, JobDetailRepository, PhoneRepository, PhotoRepository, ProfileDetailRepository, WorkAssignmentRepository, WorkforcePersonRepository, Skill, AlternativeLabel, OrganizationHeader, OrganizationDetail, RoleAssignment, SkillAssignment, ResourceHeader, ResourceCapacity, Email, Photo, JobDetail, Phone, ProfileDetail, WorkAssignment, WorkforcePerson, SkillTextRepository, SkillText, CostCenter, CostCenterRepository, WorkAssignmentDetailRepository, WorkAssignmentDetail, CatalogRepository, Catalogs2SkillsRepository, ProficiencySetRepository, ProficiencyLevelRepository, ProficiencyLevelTextRepository, ProficiencySet, ProficiencyLevel, ProficiencyLevelText, Catalog, Catalogs2Skills, ResourceOrganizationsRepository, ResourceOrganizations, ResourceOrganizationItemsRepository, ResourceOrganizationItems, CostCenterAttribute, CostCenterAttributeRepository } from 'test-commons';
import { employeeHeaderFileName, workforcePersonFileName, emailFileName, photosFileName, phoneFileName, profileDetailFileName, workAssignmentFileName, jobDetailFileName, resourceHeaderFileName, resourceCapacityFileName, roleAssignmentFileName, skillAssignmentFileName, organizationHeaderFileName, organizationDetailFileName, projectRoleFileName, projectRoleTextFileName, skillFileName, alternativeLabelFileName, _yearAheadDate, _startingDate, allCountryInfo, costCenterTobeIgnoredForResourceCapacity, skillTextFileName, costCenterFileName, workAssignmentDetailFileName, proficiencySetFileName, proficiencyLevelFileName, proficiencyLevelTextFileName, catalogFileName, catalog2SkillFileName, resourceOrganizationFileName, resourceOrganizationItemsFileName, costCenterAttributeFileName } from '../src/config';

let employeeHeaderRepository: EmployeeHeaderRepository;
let workforcePersonRepository: WorkforcePersonRepository;
let emailRepository: EmailRepository;
let phoneRepository: PhoneRepository;
let photoRepository: PhotoRepository;
let profileDetailRepository: ProfileDetailRepository;
let workAssignmentRepository: WorkAssignmentRepository;
let workAssignmentDetailRepository: WorkAssignmentDetailRepository;
let jobDetailRepository: JobDetailRepository;
let resourceHeaderRepository: ResourceHeaderRepository;
let resourceCapacityRepository: ResourceCapacityRepository;
let roleAssignmentRepository: RoleAssignmentRepository;
let skillAssignmentRepository: SkillAssignmentRepository;
let organizationHeaderRepository: OrganizationHeaderRepository;
let organizationDetailRepository: OrganizationDetailRepository;
let costCenterRepository: CostCenterRepository;
let costCenterAttributeRepository: CostCenterAttributeRepository;
let projectRoleRepository: ProjectRoleRepository;
let projectRoleTextRepository: ProjectRoleTextRepository;
let skillRepository: SkillRepository;
let alternativeLabelRepository: AlternativeLabelRepository;
let skillTextRepository: SkillTextRepository;
let catalogRepository: CatalogRepository;
let catalog2SkillRepository: Catalogs2SkillsRepository;
let proficiencySetRepository: ProficiencySetRepository;
let proficiencyLevelRepository: ProficiencyLevelRepository;
let proficiencyLevelTextRepository: ProficiencyLevelTextRepository;
let resourceOrganizationRepository: ResourceOrganizationsRepository;
let resourceOrganizationItemsRepository: ResourceOrganizationItemsRepository;

const countrySpecificWorkingHoursInMinutes: Map<string, number> = new Map<string, number>();
const countrySpecificholiday: Map<string, Date[]> = new Map<string, Date[]>();

function prepareCountryData() {
    console.log("Preparing Country Specific Data");
    allCountryInfo.forEach(countryInfo => {
        countrySpecificWorkingHoursInMinutes.set(countryInfo.getCode(), countryInfo.getWorkingMinutesPerWeek());
        countrySpecificholiday.set(countryInfo.getCode(), countryInfo.getHolidays());
    });
    console.log("Country Specific Data Preparation completed");
}

export async function initializeRepositories() {
    console.log("Preparing the Repository");
    employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
    workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
    emailRepository = await testEnvironment.getEmailRepository();
    photoRepository = await testEnvironment.getPhotoRepository();
    phoneRepository = await testEnvironment.getPhoneRepository();
    profileDetailRepository = await testEnvironment.getProfileDetailRepository();
    workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
    workAssignmentDetailRepository = await testEnvironment.getWorkAssignmentDetailRepository();
    jobDetailRepository = await testEnvironment.getJobDetailRepository();
    resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
    resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
    roleAssignmentRepository = await testEnvironment.getRoleAssignmentRepository();
    skillAssignmentRepository = await testEnvironment.getSkillAssignmentRepository();
    organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
    organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
    costCenterRepository = await testEnvironment.getCostCenterRepository();
    costCenterAttributeRepository = await testEnvironment.getCostCenterAttributeRepository();
    projectRoleRepository = await testEnvironment.getProjectRoleRepository();
    projectRoleTextRepository = await testEnvironment.getProjectRoleTextRepository();
    skillRepository = await testEnvironment.getSkillRepository();
    alternativeLabelRepository = await testEnvironment.getAlternativeLabelRepository();
    skillTextRepository = await testEnvironment.getSkillTextRepository();
    catalogRepository = await testEnvironment.getCatalogRepository();
    catalog2SkillRepository = await testEnvironment.getCatalogs2SkillsRepository();
    proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
    proficiencyLevelRepository = await testEnvironment.getProficiencyLevelRepository();
    proficiencyLevelTextRepository = await testEnvironment.getProficiencyLevelTextRepository();
    resourceOrganizationRepository = await testEnvironment.getResourceOrganizationsRepository();
    resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();
    console.log("Repository Preparation completed");
}

export async function prepareData() {
    console.log("Preparing the Data");
    const loader = [
        { key: employeeHeaderRepository, value: await getData<EmployeeHeader>(employeeHeaderFileName) },
        { key: workforcePersonRepository, value: await getData<WorkforcePerson>(workforcePersonFileName) },
        { key: emailRepository, value: await getData<Email>(emailFileName) },
        { key: photoRepository, value: await getData<Photo>(photosFileName) },
        { key: phoneRepository, value: await getData<Phone>(phoneFileName) },
        { key: profileDetailRepository, value: await getData<ProfileDetail>(profileDetailFileName) },
        { key: workAssignmentRepository, value: await getData<WorkAssignment>(workAssignmentFileName) },
        { key: workAssignmentDetailRepository, value: await getData<WorkAssignmentDetail>(workAssignmentDetailFileName)},
        { key: jobDetailRepository, value: await getData<JobDetail>(jobDetailFileName) },
        { key: resourceHeaderRepository, value: await getData<ResourceHeader>(resourceHeaderFileName) },
        { key: resourceCapacityRepository, value: await getData<ResourceCapacity>(resourceCapacityFileName) },
        { key: roleAssignmentRepository, value: await getData<RoleAssignment>(roleAssignmentFileName) },
        { key: skillAssignmentRepository, value: await getData<SkillAssignment>(skillAssignmentFileName) },
        { key: organizationHeaderRepository, value: await getData<OrganizationHeader>(organizationHeaderFileName) },
        { key: organizationDetailRepository, value: await getData<OrganizationDetail>(organizationDetailFileName) },
        { key: costCenterRepository, value: await getData<CostCenter>(costCenterFileName) },
        { key: costCenterAttributeRepository, value: await getData<CostCenterAttribute>(costCenterAttributeFileName)},
        { key: projectRoleRepository, value: await getData<ProjectRole>(projectRoleFileName) },
        { key: projectRoleTextRepository, value: await getData<ProjectRoleText>(projectRoleTextFileName) },
        { key: proficiencySetRepository, value: await getData<ProficiencySet>(proficiencySetFileName) },
        { key: proficiencyLevelRepository, value: await getData<ProficiencyLevel>(proficiencyLevelFileName) },
        { key: proficiencyLevelTextRepository, value: await getData<ProficiencyLevelText>(proficiencyLevelTextFileName) },
        { key: skillRepository, value: await getData<Skill>(skillFileName) },
        { key: alternativeLabelRepository, value: await getData<AlternativeLabel>(alternativeLabelFileName) },
        { key: skillTextRepository, value: await getData<SkillText>(skillTextFileName) },
        { key: catalogRepository, value: await getData<Catalog>(catalogFileName) },
        { key: catalog2SkillRepository, value: await getData<Catalogs2Skills>(catalog2SkillFileName) },
        { key: resourceOrganizationRepository, value: await getData<ResourceOrganizations>(resourceOrganizationFileName) },
        { key: resourceOrganizationItemsRepository, value: await getData<ResourceOrganizationItems>(resourceOrganizationItemsFileName) },
    ];
    console.log("Data Preparation completed");
    return loader;
}

async function getData<T>(fileName: string): Promise<T[]> {
    const parser = new CsvParser();
    let data: any;
    switch (fileName) {
        case resourceCapacityFileName:
            data = await generateResourceCapacity();
            break;
        default:
            data = await parser.parseFile<T>('csv/' + fileName + '.csv', ',');
            break;
    }
    return data;
}

export async function dataLoader(loader: any) {
    console.log("Loading the Data");
    await (await testEnvironment.getDatabaseClient()).tx(async () => {
        for (const { key, value } of loader) {
            let result: any;
            if (value.length > 0) {
                try {
                    result = await key.insertMany(value);
                }
                catch (e) {
                    console.log(e.message);
                    return;
                }
                console.log(value.length + " records loaded into " + key.constructor.name);
            }
            else {
                console.log("No records loaded into " + key.constructor.name);
            }
        }
        console.log("Data Load completed");
    });
}

export async function dataUnloader(loader: any) {
    console.log("Unloading the Data");
    await (await testEnvironment.getDatabaseClient()).tx(async () => {
        for (const { key, value } of loader) {
            try {
                await key.deleteMany(value);
            }
            catch (e) {
                console.log(e.message);
            }
        }
        console.log("Data Unload completed");
    });
}

export async function generateResourceCapacity() {
    prepareCountryData();
    const jobDetailData = await getData<JobDetail>(jobDetailFileName);
    const workAssignmentData = await getData<WorkAssignment>(workAssignmentFileName);
    let resourceCapacityData: ResourceCapacity[] = new Array<ResourceCapacity>();
    workAssignmentData.forEach(workAssignment => {
        const { costCenter, countryCode } = getWorkAssignmentCostCenter(workAssignment.ID, jobDetailData);
        if (costCenter !== costCenterTobeIgnoredForResourceCapacity) {
            if(workAssignment.endDate !== "9999-12-31")
                resourceCapacityData = resourceCapacityData.concat(genResourceCapacityData(workAssignment.ID, countryCode, new Date(workAssignment.startDate), new Date(workAssignment.endDate)));
            else
                resourceCapacityData = resourceCapacityData.concat(genResourceCapacityData(workAssignment.ID, countryCode, new Date(workAssignment.startDate)));
        }
    });
    return resourceCapacityData;
}

function getWorkAssignmentCostCenter(resourceID: string, jobDetailData: JobDetail[]): { costCenter: string, countryCode: string } {
    let _costCenter: string = "";
    let _countryCode: string = "";
    jobDetailData.forEach((jobDetail) => {
        if (jobDetail.parent === resourceID) {
            _costCenter = jobDetail.costCenterexternalID;
            _countryCode = jobDetail.country_code;
            return { _costCenter, _countryCode };
        }
    });
    return { costCenter: _costCenter, countryCode: _countryCode };
}

function genResourceCapacityData(resourceID: string, countryCode: string, validFrom: Date, validTo: Date = _yearAheadDate) {
    const allResourceCapacity: ResourceCapacity[] = new Array<ResourceCapacity>();
    const _workingTimeInMinutes: number = countrySpecificWorkingHoursInMinutes.get(countryCode) || 0;
    const _holidayList = countrySpecificholiday.get(countryCode);
    for (const currentDate = validFrom; currentDate <= _yearAheadDate; currentDate.setDate(currentDate.getDate() + 1)) {
        const _startTime = currentDate.toISOString().slice(0, 10) + " 00:00:00.000";
        const _nextDate = new Date(currentDate);
        const _endTime = new Date(_nextDate.setDate(currentDate.getDate() + 1)).toISOString().slice(0, 10) + " 00:00:00.000";
        if (!(isWeekend(currentDate) || isHoliday(currentDate, _holidayList))) {
            const csdbvj: ResourceCapacity = {
                resource_id: resourceID,
                startTime: _startTime,
                endTime: _endTime,
                overTimeInMinutes: 0,
                plannedNonWorkingTimeInMinutes: 0,
                bookedTimeInMinutes: 0,
                workingTimeInMinutes: _workingTimeInMinutes
            };
            allResourceCapacity.push(csdbvj);
        }
    }
    return allResourceCapacity;
}

function isHoliday(toBeCheckedDate: Date, holidayList: Date[] | undefined) {
    let isHolidayFlag: boolean = false;
    if (holidayList !== undefined) {
        holidayList.forEach(holiday => {
            if (holiday.getDate() === toBeCheckedDate.getDate()) {
                isHolidayFlag = true;
            }
        });
    }
    return isHolidayFlag;
}

function isWeekend(toBeCheckedDate: Date) {
    const dayOfDate = toBeCheckedDate.getDay();
    return (dayOfDate === 0 || dayOfDate === 6);
}
