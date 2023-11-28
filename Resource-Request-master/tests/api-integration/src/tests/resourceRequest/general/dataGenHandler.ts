import {
  ProjectRepository,
  CustomerRepository,
  WorkPackageRepository,
  BillingCategoryRepository,
  BillingRoleRepository,
  ProjectRoleRepository,
  DemandRepository,
  OrganizationDetailRepository,
  OrganizationHeaderRepository,
  ResourceOrganizationsRepository,
  ResourceOrganizationItemsRepository,
  ResourceRequestRepository,
  AlternativeLabelRepository,
  SkillRepository,
  SkillRequirementRepository,
  EmployeeHeaderRepository,
  WorkforcePersonRepository,
  WorkAssignmentRepository,
  SkillAssignmentRepository,
  RoleAssignmentRepository,
  ResourceHeaderRepository,
  ResourceCapacityRepository,
  ProfileDetailRepository,
  JobDetailRepository,
  CostCenterRepository,
  SupplySyncRepository,
  ProficiencySetRepository,
  ProficiencyLevelRepository,
} from 'test-commons';
import { testEnvironment } from '../../../utils';

import * as data from './data';

let projectRepository: ProjectRepository;
let customerRepository: CustomerRepository;
let workPackageRepository: WorkPackageRepository;
let billingCategoryRepository: BillingCategoryRepository;
let billingRoleRepository: BillingRoleRepository;
let projectRoleRepository: ProjectRoleRepository;
let demandRepository: DemandRepository;
let organizationDetailsRepository: OrganizationDetailRepository;
let organizationHeaderRepository: OrganizationHeaderRepository;
let resourceOrganizationsRepository: ResourceOrganizationsRepository;
let resourceOrganizationItemsRepository: ResourceOrganizationItemsRepository;
let resourceRequestRepository: ResourceRequestRepository;
let skillLabelRepository: AlternativeLabelRepository;
let skillRepository: SkillRepository;
let skillRequirementRepository: SkillRequirementRepository;
let employeeHeaderRepository: EmployeeHeaderRepository;
let workerRepository: WorkforcePersonRepository;
let workAssignmentsRepository: WorkAssignmentRepository;
let skillAssignmentRepository: SkillAssignmentRepository;
let roleAssignmentRepository: RoleAssignmentRepository;
let resourceHeaderRepository: ResourceHeaderRepository;
let resourceCapacityRepository: ResourceCapacityRepository;
let profileDetailRepository: ProfileDetailRepository;
let jobDetailRepository: JobDetailRepository;
let costCenterRepository: CostCenterRepository;
let supplySyncRepository: SupplySyncRepository;
let proficiencySetRepository: ProficiencySetRepository;
let proficiencyLevelRepository: ProficiencyLevelRepository;

async function createRepository() {
  projectRepository = await testEnvironment.getProjectRepository();
  customerRepository = await testEnvironment.getCustomerRepository();
  workPackageRepository = await testEnvironment.getWorkPackageRepository();
  billingCategoryRepository = await testEnvironment.getBillingCategoryRepository();
  billingRoleRepository = await testEnvironment.getBillingRoleRepository();
  projectRoleRepository = await testEnvironment.getProjectRoleRepository();
  demandRepository = await testEnvironment.getDemandRepository();
  organizationDetailsRepository = await testEnvironment.getOrganizationDetailRepository();
  organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
  resourceOrganizationsRepository = await testEnvironment.getResourceOrganizationsRepository();
  resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();
  resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
  skillLabelRepository = await testEnvironment.getAlternativeLabelRepository();
  skillRepository = await testEnvironment.getSkillRepository();
  skillRequirementRepository = await testEnvironment.getSkillRequirementRepository();
  employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
  workerRepository = await testEnvironment.getWorkforcePersonRepository();
  workAssignmentsRepository = await testEnvironment.getWorkAssignmentRepository();
  skillAssignmentRepository = await testEnvironment.getSkillAssignmentRepository();
  roleAssignmentRepository = await testEnvironment.getRoleAssignmentRepository();
  resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
  resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
  profileDetailRepository = await testEnvironment.getProfileDetailRepository();
  jobDetailRepository = await testEnvironment.getJobDetailRepository();
  costCenterRepository = await testEnvironment.getCostCenterRepository();
  supplySyncRepository = await testEnvironment.getSupplySyncRepository();
  proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
  proficiencyLevelRepository = await testEnvironment.getProficiencyLevelRepository();
}

export async function deleteData() {
  await projectRepository.deleteMany(data.projects);
  await customerRepository.deleteMany(data.customers);
  await workPackageRepository.deleteMany(data.workPackages);
  await billingCategoryRepository.deleteMany(data.billingCategories);
  await billingRoleRepository.deleteMany(data.billingRoles);
  await projectRoleRepository.deleteMany(data.projectRoles);
  await demandRepository.deleteMany(data.demands);
  await organizationHeaderRepository.deleteMany(data.organizationHeaders);
  await organizationDetailsRepository.deleteMany(data.organizationDetails);
  await resourceOrganizationsRepository.deleteMany(data.resourceOrganizationData);
  await resourceOrganizationItemsRepository.deleteMany(data.resourceOrganizationItemsData);
  await resourceRequestRepository.deleteMany(data.resourceRequest);
  await skillRequirementRepository.deleteOne(data.skillRequirements);
  await skillLabelRepository.deleteMany(data.skillLabelData);
  await skillRepository.deleteMany(data.skillsData);
  await proficiencyLevelRepository.deleteMany(data.proficiencyLevelData);
  await proficiencySetRepository.deleteMany(data.proficiencySetData);
  await employeeHeaderRepository.deleteMany(data.employeeHeaderData);
  await workerRepository.deleteMany(data.workerData);
  await workAssignmentsRepository.deleteMany(data.workAssignmentData);
  await skillAssignmentRepository.deleteMany(data.skillAssignmentData);
  await roleAssignmentRepository.deleteMany(data.roleAssignmentData);
  await resourceHeaderRepository.deleteMany(data.resourceHeaderData);
  await resourceCapacityRepository.deleteMany(data.resourceCapacityData);
  await profileDetailRepository.deleteMany(data.ProfileDetails);
  await jobDetailRepository.deleteMany(data.jobDetailData);
  await costCenterRepository.deleteMany(data.costCenterData);
  await supplySyncRepository.deleteMany(data.supplySyncData);
  console.log('Default data deletion completed.');
}

export async function insertData() {
  await createRepository();
  await deleteData();
  await projectRepository.insertMany(data.projects);
  await customerRepository.insertMany(data.customers);
  await workPackageRepository.insertMany(data.workPackages);
  await billingCategoryRepository.insertMany(data.billingCategories);
  await billingRoleRepository.insertMany(data.billingRoles);
  await projectRoleRepository.insertMany(data.projectRoles);
  await demandRepository.insertMany(data.demands);
  await organizationHeaderRepository.insertMany(data.organizationHeaders);
  await organizationDetailsRepository.insertMany(data.organizationDetails);
  await resourceOrganizationsRepository.insertMany(data.resourceOrganizationData);
  await resourceOrganizationItemsRepository.insertMany(data.resourceOrganizationItemsData);
  await proficiencySetRepository.ensureDefaultProficiency();
  await proficiencySetRepository.insertMany(data.proficiencySetData);
  await proficiencyLevelRepository.insertMany(data.proficiencyLevelData);
  await skillRepository.insertMany(data.skillsData);
  await skillLabelRepository.insertMany(data.skillLabelData);
  await employeeHeaderRepository.insertMany(data.employeeHeaderData);
  await workerRepository.insertMany(data.workerData);
  await workAssignmentsRepository.insertMany(data.workAssignmentData);
  await skillAssignmentRepository.insertMany(data.skillAssignmentData);
  await roleAssignmentRepository.insertMany(data.roleAssignmentData);
  await resourceHeaderRepository.insertMany(data.resourceHeaderData);
  await resourceCapacityRepository.insertMany(data.resourceCapacityData);
  await profileDetailRepository.insertMany(data.ProfileDetails);
  await jobDetailRepository.insertMany(data.jobDetailData);
  await costCenterRepository.insertMany(data.costCenterData);
  console.log('Default data insertion completed.');
}
