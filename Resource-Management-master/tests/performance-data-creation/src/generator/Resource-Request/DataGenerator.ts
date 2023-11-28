import { TestEnvironment, IEnvironment, Project, WorkPackage, Demand, DemandCapacityRequirement, ResourceRequest, CapacityRequirement, SkillRequirement, ResourceOrganizations, ResourceOrganizationItems } from 'test-commons';

export async function getInsertStaticDataResourceRequestEntitiesPromises(testEnvironmentInstance: TestEnvironment<IEnvironment>, data: any): Promise<any> {
  console.log('getInsertStaticDataResourceRequestEntitiesPromises is called.');

  const billingCategory = (await (await testEnvironmentInstance.getBillingCategoryRepository()).insertMany(data.billingCategories));
  const billingRole = (await (await testEnvironmentInstance.getBillingRoleRepository()).insertMany(data.billingRoles));
  const customer = (await (await testEnvironmentInstance.getCustomerRepository()).insertMany(data.customers));

  return Promise.all([billingCategory, billingRole, customer]);
}

export async function getInsertDynamicDataResourceRequestEntitiesPromises(testEnvironmentInstance: TestEnvironment<IEnvironment>, data: Map<string, any[]>): Promise<any> {
  console.log('getInsertDynamicDataResourceRequestEntitiesPromises is called.');
  const testResOrgData: ResourceOrganizations[] = data.get('resourceOrganization')!;
  const testResOrg = (await (await testEnvironmentInstance.getResourceOrganizationsRepository()).insertMany(testResOrgData));

  const testResOrgItemsData: ResourceOrganizationItems[] = data.get('resourceOrganizationItem')!;
  const testResOrgItems = (await (await testEnvironmentInstance.getResourceOrganizationItemsRepository()).insertMany(testResOrgItemsData));

  const projectData: Project[] = data.get('project')!;
  const project = (await (await testEnvironmentInstance.getProjectRepository()).insertMany(projectData));

  const testProjectData: Project[] = data.get('testProject')!;
  const testProject = (await (await testEnvironmentInstance.getProjectRepository()).insertMany(testProjectData));

  const workPackageData: WorkPackage[] = data.get('workPackage')!;
  const workPackage = (await (await testEnvironmentInstance.getWorkPackageRepository()).insertMany(workPackageData));

  const testWorkPackageData: WorkPackage[] = data.get('testWorkPackage')!;
  const testWorkPackage = (await (await testEnvironmentInstance.getWorkPackageRepository()).insertMany(testWorkPackageData));

  const demandData: Demand[] = data.get('demand')!;
  const demand = (await (await testEnvironmentInstance.getDemandRepository()).insertMany(demandData));

  const testDemandData: Demand[] = data.get('testDemand')!;
  const testDemand = (await (await testEnvironmentInstance.getDemandRepository()).insertMany(testDemandData));

  const demandCapacityRequirementData: DemandCapacityRequirement[] = data.get('demandCapacityRequirement')!;
  const demandCapacityRequirement = (await (await testEnvironmentInstance.getDemandCapacityRequirementRepository()).insertMany(demandCapacityRequirementData));

  const testDemandCapacityRequirementData: DemandCapacityRequirement[] = data.get('testDemandCapacityRequirement')!;
  const testDemandCapacityRequirement = (await (await testEnvironmentInstance.getDemandCapacityRequirementRepository()).insertMany(testDemandCapacityRequirementData));

  const resourceRequestData: ResourceRequest[] = data.get('resourceRequest')!;
  const resourceRequest = (await (await testEnvironmentInstance.getResourceRequestRepository()).insertMany(resourceRequestData));

  const testResourceRequestData: ResourceRequest[] = data.get('testResourceRequest')!;
  const testResourceRequest = (await (await testEnvironmentInstance.getResourceRequestRepository()).insertMany(testResourceRequestData));

  const resourceRequestCapacityRequirementData: CapacityRequirement[] = data.get('resourceRequestCapacityRequirement')!;
  const resourceRequestCapacityRequirement = (await (await testEnvironmentInstance.getCapacityRequirementRepository()).insertMany(resourceRequestCapacityRequirementData));

  const resourceRequestSkillRequirementData: SkillRequirement[] = data.get('resourceRequestSkillRequirement')!;
  const resourceRequestSkillRequirement = (await (await testEnvironmentInstance.getSkillRequirementRepository()).insertMany(resourceRequestSkillRequirementData));

  return Promise.all([project, testProject, workPackage, testWorkPackage, demand, testDemand, demandCapacityRequirement, testDemandCapacityRequirement, resourceRequest, testResourceRequest, resourceRequestCapacityRequirement, resourceRequestSkillRequirement, testResOrg, testResOrgItems]);
}
