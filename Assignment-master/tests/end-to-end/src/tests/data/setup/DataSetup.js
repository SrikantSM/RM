const testEnvironment = require("../../../utils");
const { CsvParser } = require("test-commons");

let assignmentsRepository = null;
let assignmentBucketRepository = null;
let employeeHeaderRepository = null;
let resourceHeaderRepository = null;
let resourceCapacityRepository = null;
let workAssignmentsRepository = null;
let workforcePersonRepository = null;
let profileDetailRepository = null;
let projectRoleRepository = null;
let organizationDetailRepository = null;
let organizationHeaderRepository = null;
let jobDetailRepository = null;
let phoneRepository = null;
let emailRepository = null;
let workPlaceAddressRepository = null;
let costCenterRepository = null;
let projectRepository = null;
let demandRepository = null;
let resourceSupplyRepository = null;
let workPackageRepository = null;
let resourceRequestRepository = null;
let bookedCapacityAggregateRepository = null;
let customerRepository = null;
let resourceOrganizationRepository = null;
let resourceOrganizationItemsRepository = null;
let capacityRequirementRepository = null;
let photoRepository = null;
let profilePhotoRepository = null;
let referenceObjectRepository = null;
let referenceObjectTypeRepository = null;
const {
	CapacityGridView,
	EmployeeHeader,
	ResourceHeaderRepository,
	ResourceCapacityRepository,
	ResourceHeader,
	ResourceCapacity,
	Assignments,
	AssignmentBucket,
	AssignmentsRepository,
	AssignmentBucketRepository,
	WorkAssignment,
	EmployeeHeaderRepository,
	WorkAssignmentRepository,
	WorkforcePerson,
	WorkforcePersonRepository,
	OrganizationDetailRepository,
	OrganizationHeaderRepository,
	JobDetailRepository,
	ProjectRepository,
	ProjectRoleRepository,
	DemandRepository,
	ResourceSupplyRepository,
	WorkPackageRepository,
	ResourceRequestRepository,
	CustomerRepository,
	ResourceOrganizationsRepository,
	ResourceOrganizationItemsRepository,
	CapacityRequirementRepository,
	PhotoRepository,
	ProfilePhotoRepository,
	ReferenceObjectRepository,
	ReferenceObjectTypeRepository
} = require("test-commons");

const { assignments } = require("../assignments");
const { assignmentBucket } = require("../assignmentBucket");
const { employeeHeaders } = require("../employeeHeaders");
const { resourceHeader } = require("../resourceHeader");
const { workAssignments } = require("../workAssignments");
const { workforcePersons } = require("../workforcePersons");
const { resourceCapacity } = require("../resourceCapacity");
const { profileDetails } = require("../profileDetails");
const { projectRoles, projectRoleDescription } = require("../projectRoles");
const { organizationDetails, allUnitKeys } = require("../organizationDetails");
const { organizationHeaders } = require("../organizationHeaders");
const { jobDetails } = require("../jobDetails");

const { emails, allEmailAddressData } = require("../emails");
const { phones } = require("../phones");
const { workPlaceAddresses } = require("../workPlaceAddresses");
const { costCenters } = require("../costCenter");
const { projects } = require("../projects");
const { demands } = require("../demands");
const { supply } = require("../supply");
const { workPackages } = require("../workPackages");
const { resourceRequests, allDisplayId } = require("../resourceRequests");
const { bookedCapacityAggregate } = require("../bookedCapacityAggregate");
const { customer } = require("../customer");
const { resOrgs } = require("../resourceOrganizations");
const { resOrgItems } = require("../resourceOrganizationItems");
const { capacityRequirement } = require("../capacityRequirement");
const { referenceObject } = require("../referenceObject");
console.log(referenceObject)
const { referenceObjectType } = require("../referenceObjectType");

const { photos } = require("../photos");
const { getProfilePhotosBatchDynamicData } = require("../profilePhotos");
let profilePhotos;

module.exports = {
	initRepos: async function () {
		console.log("Initializing all the repositories");
		assignmentsRepository = await testEnvironment.getAssignmentsRepository();
		console.log("assignmentsRepository initialized");
		assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
		console.log("assignmentBucketRepository initialized");
		employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
		console.log("employeeHeaderRepository initialized");
		resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
		console.log("resourceHeaderRepository initialized");
		resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
		console.log("resourceCapacityRepository initialized");
		workAssignmentsRepository = await testEnvironment.getWorkAssignmentRepository();
		console.log("workAssignmentsRepository initialized");
		workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
		console.log("workforcePersonRepository initialized");
		profileDetailRepository = await testEnvironment.getProfileDetailRepository();
		console.log("profileDetailRepository initialized");
		organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
		console.log("organizationDetailRepository initialized");
		organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
		console.log("organizationHeaderRepository initialized");
		jobDetailRepository = await testEnvironment.getJobDetailRepository();
		console.log("jobDetailRepository initialized");
		phoneRepository = await testEnvironment.getPhoneRepository();
		console.log("phoneRepository initialized");
		emailRepository = await testEnvironment.getEmailRepository();
		console.log("emailRepository initialized");
		workPlaceAddressRepository = await testEnvironment.getWorkPlaceAddressRepository();
		console.log("workPlaceAddressRepository initialized");
		costCenterRepository = await testEnvironment.getCostCenterRepository();
		console.log("costCenterRepository initialized");
		projectRepository = await testEnvironment.getProjectRepository();
		console.log("ProjectRepository initalized");
		projectRoleRepository = await testEnvironment.getProjectRoleRepository();
		console.log("projectRoleRepository initialized");
		demandRepository = await testEnvironment.getDemandRepository();
		console.log("DemandRepository initalized");
		resourceSupplyRepository = await testEnvironment.getResourceSupplyRepository();
		console.log("SupplySyncRepository initalized");
		workPackageRepository = await testEnvironment.getWorkPackageRepository();
		console.log("WorkPackageRepository initalized");
		resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
		console.log("ResourceRequestRepositort initalized");
		bookedCapacityAggregateRepository = await testEnvironment.getBookedCapacityAggregateRepository();
		console.log("bookedCapacityAggregateRepository initalized");
		customerRepository = await testEnvironment.getCustomerRepository();
		console.log("customerRepository initalized");
		resourceOrganizationRepository = await testEnvironment.getResourceOrganizationsRepository();
		console.log("resoourceOrganizationRepository initialized");
		resourceOrganizationItemsRepository = await testEnvironment.getResourceOrganizationItemsRepository();
		console.log("resourceOrganizationItemsRepository initialized");
		capacityRequirementRepository = await testEnvironment.getCapacityRequirementRepository();
		console.log("capacityRequirementRepository initialized");
		photoRepository = await testEnvironment.getPhotoRepository();
		console.log("photoRepository initialized");
		profilePhotoRepository = await testEnvironment.getProfilePhotoRepository();
		console.log("profilePhotoRepository initialized");
		referenceObjectRepository = await testEnvironment.getReferenceObjectRepository();
		console.log("referenceObjectRepository initialized");
		referenceObjectTypeRepository = await testEnvironment.getReferenceObjectTypeRepository();
		console.log("referenceObjectTypeRepository initialized");
		console.log("All repositories initialized.");
	},

	cleanUpData: async function () {
		console.log("Initializing precautionary Data Cleanup");
		const toBeDeletedResourceRequestData = [];
		const toBeDeletedDemandData = [];
		const toBeDeletedWorkPackageData = [];
		const toBeDeletedProjectData = [];
		const toBeDeletedProjectRoleData = [];
		const toBeDeletedOrganizationHeaders = [];
		const assignmentData = [];
		const resourceRequestDataList = await resourceRequestRepository.selectByData(
			["ID", "demand_ID", "workpackage_ID", "project_ID", "projectRole_ID"],
			allDisplayId
		);
		resourceRequestDataList.forEach((requests) => {
			assignmentData.push({
				resourceRequest_ID: requests.ID
			});
			toBeDeletedResourceRequestData.push({
				ID: requests.ID
			});
			toBeDeletedDemandData.push({
				ID: requests.demand_ID
			});
			toBeDeletedWorkPackageData.push({
				ID: requests.workpackage_ID
			});
			toBeDeletedProjectData.push({
				ID: requests.project_ID
			});
			toBeDeletedProjectRoleData.push({
				ID: requests.projectRole_ID
			});
		});
		const toBeDeletedorganizationDetailData = toBeDeletedOrganizationHeaders;

		const organizationDetailList = await organizationDetailRepository.selectByData(["unitKey"], toBeDeletedorganizationDetailData);
		const toBeDeletedCostCenterData = [];
		organizationDetailList.forEach((orgDetails) => {
			toBeDeletedCostCenterData.push({
				costCenterID: orgDetails.unitKey
			});
		});
		const toBeDeletedJobDetailsData = [];
		const costCenterDataList = await costCenterRepository.selectByData(["ID"], toBeDeletedCostCenterData);
		costCenterDataList.forEach((costCenter) => {
			toBeDeletedJobDetailsData.push({
				costCenterexternalID: costCenter.ID
			});
		});
		const jobDetailsDataList = await jobDetailRepository.selectByData(["parent", "supervisorWorkAssignmentExternalID"], toBeDeletedJobDetailsData);
		const toBeDeletedWorkForcePersonData = [];
		const toBeDeletedWorkAssignmentData = [];
		jobDetailsDataList.forEach((jobDetail) => {
			toBeDeletedWorkForcePersonData.push({
				ID: jobDetail.supervisorWorkAssignmentExternalID
			});
			toBeDeletedWorkAssignmentData.push({
				ID: jobDetail.parent
			});
		});

		const workAssignmentDataList = await workAssignmentsRepository.selectByData(["parent", "ID"], toBeDeletedWorkAssignmentData);

		const toBeDeletedEmployeeHeaderData = [];
		const toBeDeletedEmailData = [];
		const toBeDeletedPhoneData = [];
		const toBeDeletedProfileDetailsData = [];
		const toBeDeletedPhotoData = [];
		const toBeDeletedProfilePhotoData = [];
		const toBeDeletedResourceHeaderData = [];
		const toBeDeletedWorkPlaceAdressData = [];
		workAssignmentDataList.forEach((workAssignment) => {
			toBeDeletedEmployeeHeaderData.push({
				ID: workAssignment.parent
			});
			toBeDeletedEmailData.push({
				parent: workAssignment.parent
			});
			toBeDeletedPhoneData.push({
				parent: workAssignment.parent
			});
			toBeDeletedPhotoData.push({
				parent: workAssignment.parent
			});
			toBeDeletedProfileDetailsData.push({
				parent: workAssignment.parent
			});
			toBeDeletedProfilePhotoData.push({
				employee_ID: workAssignment.parent
			});

			toBeDeletedResourceHeaderData.push({
				ID: workAssignment.ID
			});
			toBeDeletedWorkPlaceAdressData.push({
				parent: workAssignment.ID
			});
		});

		const assignmentDataList = await assignmentsRepository.selectByData(["ID", "resource_ID"], assignmentData);
		const toBeDeletedAssignmentData = [];
		const resourceData = [];
		const resourceCapacityData = [];
		const assignmentBucketDataList = [];
		const toBeDeletedSuplyData = [];
		assignmentDataList.forEach((assignments) => {
			toBeDeletedAssignmentData.push({
				ID: assignments.ID
			});
			resourceData.push({
				resourceID: assignments.resource_ID
			});
			assignmentBucketDataList.push({
				assignment_ID: assignments.ID
			});
			resourceCapacityData.push({
				resource_ID: assignments.resource_ID
			});
			toBeDeletedSuplyData.push({
				assignment_ID: assignments.ID
			});
		});

		const toBeDeletedBookedCapacityAggregate = resourceData;
		const toBeDeletedAssignmentBucketsData = assignmentBucketDataList;
		const toBeDeletedResourceCapacityData = resourceCapacityData;

		const toBeDeletedResOrgData = [];
		resOrgs.forEach((resOrg) => {
			toBeDeletedResOrgData.push({
				displayId: resOrg.displayId
			});
		});
		const toBeDeletedResOrgItemsData = [];
		resOrgItems.forEach((resOrgItem) => {
			toBeDeletedResOrgItemsData.push({
				costCenterId: resOrgItem.costCenterId
			});
		});

		// Data Cleaning Start
		await resourceSupplyRepository.deleteManyByData(toBeDeletedSuplyData);
		await emailRepository.deleteManyByData(toBeDeletedEmailData);
		await workforcePersonRepository.deleteMany(toBeDeletedWorkForcePersonData);
		await employeeHeaderRepository.deleteMany(toBeDeletedEmployeeHeaderData);
		await profileDetailRepository.deleteManyByData(toBeDeletedProfileDetailsData);
		await phoneRepository.deleteManyByData(toBeDeletedPhoneData);

		await workAssignmentsRepository.deleteMany(toBeDeletedWorkAssignmentData);
		await assignmentBucketRepository.deleteManyByData(toBeDeletedAssignmentBucketsData);
		await assignmentsRepository.deleteMany(toBeDeletedAssignmentData);
		await resourceHeaderRepository.deleteManyByData(toBeDeletedResourceHeaderData);
		await jobDetailRepository.deleteManyByData(toBeDeletedJobDetailsData);
		await resourceCapacityRepository.deleteManyByData(toBeDeletedResourceCapacityData);

		await projectRoleRepository.deleteMany(toBeDeletedProjectRoleData);

		await organizationHeaderRepository.deleteManyByData(toBeDeletedOrganizationHeaders);
		await organizationDetailRepository.deleteManyByData(toBeDeletedorganizationDetailData);
		await costCenterRepository.deleteManyByData(toBeDeletedCostCenterData);
		await workPlaceAddressRepository.deleteMany(toBeDeletedWorkPlaceAdressData);
		await demandRepository.deleteMany(toBeDeletedDemandData);
		await bookedCapacityAggregateRepository.deleteManyByData(toBeDeletedBookedCapacityAggregate);
		await resourceRequestRepository.deleteMany(toBeDeletedResourceRequestData);
		await workPackageRepository.deleteMany(toBeDeletedWorkPackageData);
		await projectRepository.deleteMany(toBeDeletedProjectData);
		await customerRepository.deleteMany(customer);
		await resourceOrganizationRepository.deleteManyByData(toBeDeletedResOrgData);
		await resourceOrganizationItemsRepository.deleteManyByData(toBeDeletedResOrgItemsData);
		await capacityRequirementRepository.deleteMany(capacityRequirement);
		await photoRepository.deleteManyByData(toBeDeletedPhotoData);
		await profilePhotoRepository.deleteManyByData(toBeDeletedProfilePhotoData);
		await referenceObjectRepository.deleteMany(referenceObject);
		await referenceObjectTypeRepository.deleteMany(referenceObjectType);
		console.log("Precautionary Data Cleanup is complete");
	},

	insertData: async function () {
		await assignmentsRepository.insertMany(assignments);
		console.log("assignments uploaded");
		await assignmentBucketRepository.insertMany(assignmentBucket);
		console.log("assignment buckets uploaded");
		await employeeHeaderRepository.insertMany(employeeHeaders);
		console.log("employeeHeaders uploaded");
		await organizationHeaderRepository.insertMany(organizationHeaders);
		console.log("organization Headers uploaded");
		await organizationDetailRepository.insertMany(organizationDetails);
		console.log("organization Details uploaded");
		await jobDetailRepository.insertMany(jobDetails);
		console.log("job Details uploaded");
		await resourceHeaderRepository.insertMany(resourceHeader);
		console.log("resourceHeader uploaded");
		await resourceCapacityRepository.insertMany(resourceCapacity);
		console.log("resourceCapacity uploaded");
		await workAssignmentsRepository.insertMany(workAssignments);
		console.log("workAssignments uploaded");
		await workforcePersonRepository.insertMany(workforcePersons);
		console.log("workforcePersons uploaded");
		await profileDetailRepository.insertMany(profileDetails);
		console.log("profile Details uploaded");
		await projectRoleRepository.insertMany(projectRoles);
		console.log("project role Details uploaded");
		await phoneRepository.insertMany(phones);
		console.log("phone Details uploaded");
		await emailRepository.insertMany(emails);
		console.log("email Details uploaded");
		await workPlaceAddressRepository.insertMany(workPlaceAddresses);
		console.log("workplace Details uploaded");
		await costCenterRepository.insertMany(costCenters);
		console.log("costCenter details uploaded");
		await projectRepository.insertMany(projects);
		console.log("projects uploaded");
		await demandRepository.insertMany(demands);
		console.log("demands uploaded");
		await resourceSupplyRepository.insertMany(supply);
		console.log("supply uploaded");
		await workPackageRepository.insertMany(workPackages);
		console.log("workPackages uploaded");
		await resourceRequestRepository.insertMany(resourceRequests);
		console.log("resourceRequests uploaded");
		await bookedCapacityAggregateRepository.insertMany(bookedCapacityAggregate);
		console.log("bookedCapacityAggregate uploaded");
		await customerRepository.insertMany(customer);
		console.log("customer uploaded");
		await resourceOrganizationRepository.insertMany(resOrgs);
		console.log("resOrgs uploaded");
		await resourceOrganizationItemsRepository.insertMany(resOrgItems);
		console.log("resOrgsItems uploaded");
		await capacityRequirementRepository.insertMany(capacityRequirement);
		console.log("capacityRequirement uploaded");
		await photoRepository.insertMany(photos);
		console.log("photoRepository uploaded");
		profilePhotos = await getProfilePhotosBatchDynamicData();
		await profilePhotoRepository.insertMany(profilePhotos);
		console.log("profilePhotoRepository uploaded");
		await referenceObjectRepository.insertMany(referenceObject);
		console.log("referenceObject uploaded");
		await referenceObjectTypeRepository.insertMany(referenceObjectType);
		console.log("referenceObjectTypeRepository uploaded");
		await console.log("Initial data setup completed in beforeAll() hook.");
	},

	deleteData: async function () {
		console.log("Cleanup task in afterAll() hook started.");
		await workAssignmentsRepository.deleteMany(workAssignments);
		console.log("workAssignments cleaned");
		await resourceHeaderRepository.deleteMany(resourceHeader);
		console.log("resourceHeader cleaned");
		await resourceCapacityRepository.deleteMany(resourceCapacity);
		console.log("resourceCapacity cleaned");
		await assignmentsRepository.deleteMany(assignments);
		console.log("assignments cleaned");
		await assignmentBucketRepository.deleteMany(assignmentBucket);
		console.log("assignment buckets cleaned");
		await employeeHeaderRepository.deleteMany(employeeHeaders);
		console.log("employeeHeaders cleaned");
		await workforcePersonRepository.deleteMany(workforcePersons);
		console.log("workforcePersons cleaned");
		await profileDetailRepository.deleteMany(profileDetails);
		console.log("profile Details cleaned");
		await organizationHeaderRepository.deleteMany(organizationHeaders);
		console.log("organization Headers cleaned");
		await organizationDetailRepository.deleteMany(organizationDetails);
		console.log("organization Details cleaned");
		await jobDetailRepository.deleteMany(jobDetails);
		console.log("job Details cleaned");
		await phoneRepository.deleteMany(phones);
		console.log("phone Details cleaned");
		await emailRepository.deleteMany(emails);
		console.log("email Details cleaned");
		await workPlaceAddressRepository.deleteMany(workPlaceAddresses);
		console.log("workplace Details cleaned");
		await costCenterRepository.deleteMany(costCenters);
		console.log("costCenter Details cleaned");
		await projectRepository.deleteMany(projects);
		console.log("projects cleaned");
		await projectRoleRepository.deleteMany(projectRoles);
		console.log("project role Details uploaded");
		await demandRepository.deleteMany(demands);
		console.log("demands cleaned");
		await resourceSupplyRepository.deleteMany(supply);
		console.log("supply cleaned");
		await workPackageRepository.deleteMany(workPackages);
		console.log("workPackages cleaned");
		await resourceRequestRepository.deleteMany(resourceRequests);
		console.log("resourceRequests cleaned");
		await bookedCapacityAggregateRepository.deleteMany(bookedCapacityAggregate);
		console.log("bookedCapacityAggregate cleaned");
		await customerRepository.deleteMany(customer);
		console.log("customerRepository cleaned");
		await resourceOrganizationRepository.deleteMany(resOrgs);
		console.log("resOrgs cleaned");
		await resourceOrganizationItemsRepository.deleteMany(resOrgItems);
		console.log("resOrgsItems cleaned");
		await capacityRequirementRepository.deleteMany(capacityRequirement);
		console.log("capacityRequirement cleaned");
		await photoRepository.deleteMany(photos);
		console.log("photos cleaned");
		await profilePhotoRepository.deleteMany(profilePhotos);
		console.log("profilePhotos cleaned");
		await referenceObjectRepository.deleteMany(referenceObject);
		console.log("referenceObject cleaned");
		await referenceObjectTypeRepository.deleteMany(referenceObjectType);
		console.log("referenceObjectType cleaned");
		console.log("Cleanup task in afterAll() hook completed.");
	},

	deleteAllAssignmentData: async function () {
		console.log("START deleteAllAssignmentData");
		const Temp = [];
		const toBeDeletedAssignmentData = [];
		assignments.forEach((assignment) => {
			toBeDeletedAssignmentData.push({
				ID: assignment.ID
			});
			Temp.push({
				assignment_ID: assignment.ID
			});
		});

		const toBeDeletedAssignmentBucketsData = [];
		const assignmentBucketsDataList = await assignmentBucketRepository.selectByData(["ID"], Temp);
		assignmentBucketsDataList.forEach((assignmentBuckets) => {
			toBeDeletedAssignmentBucketsData.push({
				ID: assignmentBuckets.ID
			});
		});

		await assignmentsRepository.deleteManyByData(toBeDeletedAssignmentData);
		await assignmentBucketRepository.deleteMany(toBeDeletedAssignmentBucketsData);

		console.log("END deleteAllAssignmentData");
	}
};
