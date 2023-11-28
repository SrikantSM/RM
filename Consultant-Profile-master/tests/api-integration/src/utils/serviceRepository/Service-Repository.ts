import { AxiosInstance, AxiosResponse } from 'axios';
import { Context } from 'mocha';
import { context } from 'mocha-typescript';
import {
    AssignmentBucketRepository,
    AssignmentsRepository,
    AuthType,
    AvailabilityReplicationErrorRepository,
    AvailabilityReplicationSummaryRepository,
    AvailabilitySummaryStatusRepository,
    CatalogRepository,
    Catalogs2SkillsRepository,
    CostCenterRepository,
    CostCenterAttributeRepository,
    CustomerRepository,
    EmailRepository,
    EmployeeHeaderRepository,
    ExternalWorkExperienceRepository,
    ExternalWorkExperienceSkillRepository,
    FillTimeDimProcedure,
    JobDetailRepository,
    OrganizationDetailRepository,
    OrganizationHeaderRepository,
    PhoneRepository,
    ProficiencyLevelRepository,
    ProficiencySetRepository,
    ProfileDetailRepository,
    ProjectRepository,
    ProjectRoleRepository,
    ProjectRoleTextRepository,
    ResourceCapacityRepository,
    ResourceHeaderRepository,
    ResourceRequestRepository,
    RoleAssignmentRepository,
    SkillAssignmentRepository,
    SkillRepository,
    SkillRequirementRepository,
    SkillTextRepository,
    WorkAssignmentDetailRepository,
    WorkAssignmentRepository,
    WorkforcePersonRepository,
    WorkPackageRepository,
    PhotoRepository,
    BookedCapacityAggregateRepository,
    ProfilePhotoRepository,
    ResourceOrganizationsRepository,
    ResourceOrganizationItemsRepository,
    WorkforceAvailabilityRepository,
    AttachmentRepository,
    DemandRepository,
} from 'test-commons';
import { UserType } from './UserType';
import { ApiIntegrationTestEnvironment } from '../ApiIntegrationTestEnvironment';
import { Environment } from '../Environment';
import { CFServiceType } from './CFServiceType';

type Headers = { [s: string]: string; };
type ResponseType = { data: null, status: 0, statusText: '', headers: null, config: {}, };

export const TEST_TIMEOUT = 1 * 60 * 2000;
export const TEST_TIMEOUT_TIME_GENERATION = 1 * 80 * 1000;

export abstract class ServiceEndPointsRepository {
    @context mocha: Context | null = null;

    protected responses: AxiosResponse<ResponseType>[] = [];

    protected readonly oDataPrefix: string = 'odata/v4';

    private static environmentPreparationStatus: boolean = false;

    private static dbRepositoryPreparationStatus: boolean = false;

    private static healthCheckServiceClientPreparationStatus: boolean = false;

    private static jobSchedulerServiceClientPreparationStatus: boolean = false;

    private static applicationServiceClientPreparationStatus: boolean = false;

    private static apiServiceClientPreparationStatus: boolean = false;

    private static replicationScheduleServiceClientPreparationStatus: boolean = false;

    private static workforceAvailabilityServiceClientPreparationStatus: boolean = false;

    // Test environment
    protected static apiIntegrationTestEnvironment = new ApiIntegrationTestEnvironment();

    protected static testEnvironmentInstance: Environment;

    protected static subDomain: string;

    // srv service client
    protected static configExpertSrvBearerServiceClient: AxiosInstance;

    protected static consultantSrvBearerServiceClient: AxiosInstance;

    protected static resourceManagerSrvBearerServiceClient: AxiosInstance;

    protected static notInDBSrvBearerServiceClient: AxiosInstance;

    protected static consultantSrvBasicServiceClient: AxiosInstance;

    protected static srvHealthCheckServiceClient: AxiosInstance;

    // integration-srv service client
    protected static consultantIntegrationSrvServiceClient: AxiosInstance;

    protected static integrationSrvHealthCheckServiceClient: AxiosInstance;

    protected static jobSchedulerServiceClient: AxiosInstance;

    protected static xsUaaServiceClient: AxiosInstance;

    protected static consultantProfileXsUaaServiceClient: AxiosInstance;

    protected static configExpertIntegrationSrvServiceClient: AxiosInstance;

    protected static auditLogServiceClient: AxiosInstance;

    // Database repositories
    protected static emailRepository: EmailRepository;

    protected static photoRepository: PhotoRepository;

    protected static employeeHeaderRepository: EmployeeHeaderRepository;

    protected static jobDetailRepository: JobDetailRepository;

    protected static organizationHeaderRepository: OrganizationHeaderRepository;

    protected static organizationDetailRepository: OrganizationDetailRepository;

    protected static costCenterRepository: CostCenterRepository;

    protected static costCenterAttributeRepository: CostCenterAttributeRepository;

    protected static phoneRepository: PhoneRepository;

    protected static profileDetailRepository: ProfileDetailRepository;

    protected static proficiencyLevelRepository: ProficiencyLevelRepository;

    protected static proficiencySetRepository: ProficiencySetRepository;

    protected static projectRoleRepository: ProjectRoleRepository;

    protected static roleAssignmentRepository: RoleAssignmentRepository;

    protected static skillAssignmentRepository: SkillAssignmentRepository;

    protected static skillRepository: SkillRepository;

    protected static skillTextRepository: SkillTextRepository;

    protected static workAssignmentRepository: WorkAssignmentRepository;

    protected static workAssignmentDetailRepository: WorkAssignmentDetailRepository;

    protected static workforcePersonRepository: WorkforcePersonRepository;

    protected static externalWorkExperienceRepository: ExternalWorkExperienceRepository;

    protected static externalWorkExperienceSkillsRepository: ExternalWorkExperienceSkillRepository;

    protected static assignmentsRepository: AssignmentsRepository;

    protected static resourceCapacityRepository: ResourceCapacityRepository;

    protected static resourceHeaderRepository: ResourceHeaderRepository;

    protected static assignmentBucketRepository: AssignmentBucketRepository;

    protected static fillTimeDimProcedure: FillTimeDimProcedure;

    protected static projectRoleTextRepository: ProjectRoleTextRepository;

    protected static availabilityReplicationSummaryRepository: AvailabilityReplicationSummaryRepository;

    protected static availabilityReplicationErrorRepository: AvailabilityReplicationErrorRepository;

    protected static availabilitySummaryStatusRepository: AvailabilitySummaryStatusRepository;

    protected static customerRepository: CustomerRepository;

    protected static workPackageRepository: WorkPackageRepository;

    protected static projectRepository: ProjectRepository;

    protected static skillRequirementRepository: SkillRequirementRepository;

    protected static resourceRequestRepository: ResourceRequestRepository;

    protected static catalogRepository: CatalogRepository;

    protected static catalogs2SkillsRepository: Catalogs2SkillsRepository;

    protected static bookedCapacityAggregateRepository: BookedCapacityAggregateRepository;

    protected static profilePhotoRepository: ProfilePhotoRepository;

    protected static resourceOrganizationsRepository : ResourceOrganizationsRepository;

    protected static resourceOrganizationItemsRepository : ResourceOrganizationItemsRepository;

    protected static workforceAvailabilityRepository : WorkforceAvailabilityRepository;

    protected static attachmentRepository: AttachmentRepository;

    protected static demandRepository: DemandRepository;

    after() {
        if (this.mocha?.currentTest?.state === 'failed' && this.responses.length > 0) {
            this.printResponse();
        }
    }

    protected static async prepareDbRepository() {
        if (!ServiceEndPointsRepository.dbRepositoryPreparationStatus) {
            console.log('preparing DB Respositories');
            this.prepareEnvironment();

            // Database Repositories
            ServiceEndPointsRepository.emailRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getEmailRepository();
            ServiceEndPointsRepository.photoRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getPhotoRepository();
            ServiceEndPointsRepository.employeeHeaderRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getEmployeeHeaderRepository();
            ServiceEndPointsRepository.jobDetailRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getJobDetailRepository();
            ServiceEndPointsRepository.organizationHeaderRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getOrganizationHeaderRepository();
            ServiceEndPointsRepository.organizationDetailRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getOrganizationDetailRepository();
            ServiceEndPointsRepository.costCenterRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getCostCenterRepository();
            ServiceEndPointsRepository.costCenterAttributeRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getCostCenterAttributeRepository();
            ServiceEndPointsRepository.phoneRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getPhoneRepository();
            ServiceEndPointsRepository.profileDetailRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getProfileDetailRepository();
            ServiceEndPointsRepository.projectRoleRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getProjectRoleRepository();
            ServiceEndPointsRepository.roleAssignmentRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getRoleAssignmentRepository();
            ServiceEndPointsRepository.skillAssignmentRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getSkillAssignmentRepository();
            ServiceEndPointsRepository.skillRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getSkillRepository();
            ServiceEndPointsRepository.skillTextRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getSkillTextRepository();
            ServiceEndPointsRepository.proficiencyLevelRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getProficiencyLevelRepository();
            ServiceEndPointsRepository.proficiencySetRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getProficiencySetRepository();
            ServiceEndPointsRepository.workAssignmentRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getWorkAssignmentRepository();
            ServiceEndPointsRepository.workAssignmentDetailRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getWorkAssignmentDetailRepository();
            ServiceEndPointsRepository.workforcePersonRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getWorkforcePersonRepository();
            ServiceEndPointsRepository.resourceCapacityRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getResourceCapacityRepository();
            ServiceEndPointsRepository.resourceHeaderRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getResourceHeaderRepository();
            ServiceEndPointsRepository.externalWorkExperienceRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getExternalWorkExperienceRepository();
            ServiceEndPointsRepository.externalWorkExperienceSkillsRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getExternalWorkExperienceSkillRepository();
            ServiceEndPointsRepository.assignmentsRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getAssignmentsRepository();
            ServiceEndPointsRepository.assignmentBucketRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getAssignmentBucketRepository();
            ServiceEndPointsRepository.fillTimeDimProcedure = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getFillTimeDimProcedure();
            ServiceEndPointsRepository.projectRoleTextRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getProjectRoleTextRepository();
            ServiceEndPointsRepository.availabilityReplicationSummaryRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getAvailabilityReplicationSummaryRepository();
            ServiceEndPointsRepository.availabilityReplicationErrorRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getAvailabilityReplicationErrorRepository();
            ServiceEndPointsRepository.availabilitySummaryStatusRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getAvailabilitySummaryStatusRepository();
            ServiceEndPointsRepository.customerRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getCustomerRepository();
            ServiceEndPointsRepository.workPackageRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getWorkPackageRepository();
            ServiceEndPointsRepository.projectRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getProjectRepository();
            ServiceEndPointsRepository.resourceRequestRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getResourceRequestRepository();
            ServiceEndPointsRepository.skillRequirementRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getSkillRequirementRepository();
            ServiceEndPointsRepository.catalogRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getCatalogRepository();
            ServiceEndPointsRepository.catalogs2SkillsRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getCatalogs2SkillsRepository();
            ServiceEndPointsRepository.bookedCapacityAggregateRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getBookedCapacityAggregateRepository();
            ServiceEndPointsRepository.profilePhotoRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getProfilePhotoRepository();
            ServiceEndPointsRepository.resourceOrganizationsRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getResourceOrganizationsRepository();
            ServiceEndPointsRepository.resourceOrganizationItemsRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getResourceOrganizationItemsRepository();
            ServiceEndPointsRepository.workforceAvailabilityRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getWorkforceAvailabilityRepository();
            ServiceEndPointsRepository.attachmentRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getAttachmentRepository();
            ServiceEndPointsRepository.demandRepository = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getDemandRepository();
            ServiceEndPointsRepository.dbRepositoryPreparationStatus = true;
            console.log('DB Repositories Preparation Complete');
        }
    }

    protected static async prepareHealthCheckServiceClient() {
        if (!ServiceEndPointsRepository.healthCheckServiceClientPreparationStatus) {
            await this.prepareEnvironment();
            ServiceEndPointsRepository.srvHealthCheckServiceClient = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.prepareServiceClient(ServiceEndPointsRepository.testEnvironmentInstance.srvAppName, UserType.NONE, AuthType.None, 'srvHealthCheckServiceClient');
            ServiceEndPointsRepository.integrationSrvHealthCheckServiceClient = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.prepareServiceClient(ServiceEndPointsRepository.testEnvironmentInstance.integrationSrvAppName, UserType.NONE, AuthType.None, 'integrationSrvHealthCheckServiceClient');
            ServiceEndPointsRepository.consultantSrvBasicServiceClient = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.prepareServiceClient(ServiceEndPointsRepository.testEnvironmentInstance.srvAppName, UserType.CONSULTANT, AuthType.Bearer, 'consultantSrvBasicServiceClient');
            ServiceEndPointsRepository.consultantIntegrationSrvServiceClient = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.prepareServiceClient(ServiceEndPointsRepository.testEnvironmentInstance.integrationSrvAppName, UserType.CONSULTANT, AuthType.Bearer, 'consultantIntegrationSrvServiceClient');
            ServiceEndPointsRepository.healthCheckServiceClientPreparationStatus = true;
        }
    }

    protected static async prepareJobSchedulerServiceClient() {
        if (!ServiceEndPointsRepository.jobSchedulerServiceClientPreparationStatus) {
            await this.prepareEnvironment();
            ServiceEndPointsRepository.jobSchedulerServiceClient = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.prepareServiceClient(ServiceEndPointsRepository.testEnvironmentInstance.integrationSrvAppName, UserType.CF_SERVICE, AuthType.X509Certificate, 'jobSchedulerServiceClient', CFServiceType.JOB_SCHEDULER);
            ServiceEndPointsRepository.xsUaaServiceClient = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.prepareServiceClient(ServiceEndPointsRepository.testEnvironmentInstance.integrationSrvAppName, UserType.CF_SERVICE, AuthType.X509Certificate, 'xsUaaServiceClient', CFServiceType.XSUAA);
            ServiceEndPointsRepository.jobSchedulerServiceClientPreparationStatus = true;
        }
    }

    protected static async prepareReplicationScheduleServiceClient() {
        if (!ServiceEndPointsRepository.replicationScheduleServiceClientPreparationStatus) {
            await this.prepareEnvironment();
            ServiceEndPointsRepository.configExpertIntegrationSrvServiceClient = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.prepareServiceClient(ServiceEndPointsRepository.testEnvironmentInstance.integrationSrvAppName, UserType.CONFIGURATIONEXPERT, AuthType.Bearer, 'configExpertIntegrationSrvServiceClient');
            ServiceEndPointsRepository.consultantIntegrationSrvServiceClient = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.prepareServiceClient(ServiceEndPointsRepository.testEnvironmentInstance.integrationSrvAppName, UserType.CONSULTANT, AuthType.Bearer, 'consultantIntegrationSrvServiceClient');
            ServiceEndPointsRepository.replicationScheduleServiceClientPreparationStatus = true;
        }
    }

    protected static async prepareApplicationServiceClient() {
        if (!ServiceEndPointsRepository.applicationServiceClientPreparationStatus) {
            await this.prepareEnvironment();
            ServiceEndPointsRepository.configExpertSrvBearerServiceClient = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.prepareServiceClient(ServiceEndPointsRepository.testEnvironmentInstance.srvAppName, UserType.CONFIGURATIONEXPERT, AuthType.Bearer, 'configExpertSrvBearerServiceClient');
            ServiceEndPointsRepository.consultantSrvBearerServiceClient = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.prepareServiceClient(ServiceEndPointsRepository.testEnvironmentInstance.srvAppName, UserType.CONSULTANT, AuthType.Bearer, 'consultantSrvBearerServiceClient');
            ServiceEndPointsRepository.resourceManagerSrvBearerServiceClient = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.prepareServiceClient(ServiceEndPointsRepository.testEnvironmentInstance.srvAppName, UserType.RESOURCEMANAGER_VALIANT, AuthType.Bearer, 'resourceManagerSrvBearerServiceClient');
            ServiceEndPointsRepository.notInDBSrvBearerServiceClient = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.prepareServiceClient(ServiceEndPointsRepository.testEnvironmentInstance.srvAppName, UserType.NOT_IN_DB, AuthType.Bearer, 'notInDBSrvBearerServiceClient');
            ServiceEndPointsRepository.applicationServiceClientPreparationStatus = true;
        }
    }

    protected static async prepareAPIServiceClient() {
        if (!ServiceEndPointsRepository.apiServiceClientPreparationStatus) {
            await this.prepareEnvironment();
            ServiceEndPointsRepository.consultantProfileXsUaaServiceClient = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.prepareServiceClient(ServiceEndPointsRepository.testEnvironmentInstance.srvAppName, UserType.CF_SERVICE, AuthType.X509Certificate, 'consultantProfileXsUaaServiceClient', CFServiceType.XSUAA);
            ServiceEndPointsRepository.consultantSrvBearerServiceClient = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.prepareServiceClient(ServiceEndPointsRepository.testEnvironmentInstance.srvAppName, UserType.CONSULTANT, AuthType.Bearer, 'consultantSrvBearerServiceClient');
            ServiceEndPointsRepository.auditLogServiceClient = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.prepareServiceClient(ServiceEndPointsRepository.testEnvironmentInstance.srvAppName, UserType.CF_SERVICE, AuthType.X509Certificate, 'auditLogServiceClient', CFServiceType.AUDIT_LOG);
            ServiceEndPointsRepository.apiServiceClientPreparationStatus = true;
        }
    }

    protected static async prepareWorkforceAvailabilityServiceClient() {
        if (!ServiceEndPointsRepository.workforceAvailabilityServiceClientPreparationStatus) {
            await this.prepareEnvironment();
            ServiceEndPointsRepository.consultantProfileXsUaaServiceClient = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.prepareServiceClient(ServiceEndPointsRepository.testEnvironmentInstance.integrationSrvAppName, UserType.CF_SERVICE, AuthType.X509Certificate, 'consultantProfileXsUaaServiceClient', CFServiceType.XSUAA);
            ServiceEndPointsRepository.consultantSrvBearerServiceClient = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.prepareServiceClient(ServiceEndPointsRepository.testEnvironmentInstance.integrationSrvAppName, UserType.CONSULTANT, AuthType.Bearer, 'consultantSrvBearerServiceClient');
            ServiceEndPointsRepository.auditLogServiceClient = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.prepareServiceClient(ServiceEndPointsRepository.testEnvironmentInstance.integrationSrvAppName, UserType.CF_SERVICE, AuthType.X509Certificate, 'auditLogServiceClient', CFServiceType.AUDIT_LOG);
            ServiceEndPointsRepository.workforceAvailabilityServiceClientPreparationStatus = true;
        }
    }

    private static async prepareEnvironment() {
        if (!ServiceEndPointsRepository.environmentPreparationStatus) {
            // Test environment
            ServiceEndPointsRepository.testEnvironmentInstance = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getEnvironment();
            ServiceEndPointsRepository.subDomain = await ServiceEndPointsRepository.apiIntegrationTestEnvironment.getSubDomain();
            ServiceEndPointsRepository.environmentPreparationStatus = true;
        }
    }

    private trimString(s: any): any {
        if (typeof s === 'string') {
            return s.substring(0, 60) + ((s.length > 60) ? '...' : '');
        }
        return s;
    }

    private trimHeaders(headers: Headers): Headers {
        return Object.entries(headers)
            .map(([key, val]) => [key, this.trimString(val)])
            .reduce((acc: Headers, [key, val]) => {
                acc[key] = val;
                return acc;
            }, {});
    }

    private printResponse(): void {
        console.log('=================================================After Failure===========================================');
        this.responses.forEach((response) => {
            console.log('--------------------------------------------------------------------------------------------------------');
            const afterFailureDetails = {
                request: `${response.config.method} ${response.config.url}`,
                'request headers': this.trimHeaders(response.config.headers),
                'request data': response.config.data,
                'response status': response.status,
                'response headers': this.trimHeaders(response.headers),
                'response data': response.data,
            };
            console.table(JSON.stringify(afterFailureDetails, null, 2));
            console.log('--------------------------------------------------------------------------------------------------------');
        });
        console.log('========================================================================================================');
    }

    protected static async get(serviceClient: AxiosInstance, uri: string) {
        return serviceClient.get(uri);
    }

    protected static async post(serviceClient: AxiosInstance, uri: string, data: any, header?: any) {
        if (header !== undefined) {
            return serviceClient.post(uri, data, header);
        }
        return serviceClient.post(uri, data);
    }

    protected static async patch(serviceClient: AxiosInstance, uri: string, data: any) {
        return serviceClient.patch(uri, data);
    }

    protected static async put(serviceClient: AxiosInstance, uri: string, data: any) {
        return serviceClient.put(uri, data);
    }

    protected static async putWithBinaryBody(serviceClient: AxiosInstance, uri: string, data: any, header?: any) {
        if (header !== undefined) {
            return serviceClient.put(uri, Buffer.from(data), header);
        }
        return serviceClient.put(uri, Buffer.from(data));
    }

    protected static async delete(serviceClient: AxiosInstance, uri: string) {
        return serviceClient.delete(uri);
    }
}
