import { CloudFoundryClient, DatabaseClient } from './connection';
import {
  AlternativeLabelRepository, AssignmentBucketRepository, AssignmentsRepository, BillingCategoryRepository, BillingRoleRepository, CapacityRequirementRepository, CustomerRepository, DefaultLanguageRepository, DemandCapacityRequirementRepository, DemandRepository, EmailRepository, EmployeeHeaderRepository, ExternalWorkExperienceRepository, ExternalWorkExperienceSkillRepository, JobDetailRepository, LanguageRepository, LifecycleStatusRepository, LifecycleStatusTextRepository, OrganizationDetailRepository, OrganizationHeaderRepository, OrganizationStatusRepository, ResourceOrganizationsRepository, ResourceOrganizationItemsRepository, ResourceOrganizationsTextsRepository, PhoneRepository, ProfileDetailRepository, ProjectRepository, ProjectRoleRepository, ProjectRoleTextRepository, RoleLifecycleStatusRepository, RoleLifecycleStatusTextRepository, MonthsOfTheYearRepository, MonthsOfTheYearTextRepository, ResourceCapacityRepository, ResourceHeaderRepository, ResourceKindsRepository, ResourceRequestRepository, ResourceTypesRepository, RoleAssignmentRepository, SkillAssignmentRepository, SkillRepository, SkillRequirementRepository, SkillTextRepository, TimeDimensionDataRepository, WorkAssignmentRepository, WorkforcePersonRepository, WorkPackageRepository, WorkPlaceAddressRepository, CostCenterAttributeRepository, CostCenterRepository, CostCenterValidityRepository, SupplySyncRepository, AvailabilityReplicationSummaryRepository, AvailabilityReplicationErrorRepository, AvailabilitySummaryStatusRepository, AvailabilitySummaryStatusTextRepository, WorkAssignmentDetailRepository, ResourceSupplyRepository, CatalogRepository, Catalogs2SkillsRepository, ProficiencySetRepository, ProficiencyLevelRepository, ProficiencyLevelTextRepository, ProjectSyncRepository, ProjectReplicationFilterRepository, ProjectReplicationTasksRepository, ProjectReplicationFilterValueRepository, ProjectReplicationStatusRepository, PhotoRepository, OneMDSDeltaTokenInfoRepository, BookedCapacityAggregateRepository, BusinessPurposeCompletionDetailsRepository, ProfilePhotoRepository, AttachmentRepository, ReferenceObjectTypeRepository, WorkforceAvailabilityRepository,
} from './entities';
import { ReferenceObjectRepository } from './entities/resource-request/integration/ReferenceObjectRepository';
import { UserResourceOrganizationRepository } from './entities/resource-request/resourceRequest/UserResourceOrganizationRepository';
import { matchingCandidates, authorizedResourceOrganizations } from './functions/resource-request';
import {
  AvailabilityProcedure, ComputeCalWeekProcedure, FillTimeDimProcedure, RoleMatchProcedure, SetSessionContextProcedure, SkillProcedure, UtilizationProcedure,
} from './procedures';
import { CsvWriter, DeleteDataUtil, SessionVariableProcessor } from './utils';
import {
  StaffingStatusRepository, WorkAssignmentFirstJobDetailRepository, AvailabilityReplicationViewRepository, BsoDetailsRepository,
} from './views';

export interface IEnvironment {
  cfUser: string;
  cfPassword: string;
  spaceGuid: string;
  landscape: string;
  srvAppName: string;
  tenantId?: string;
  tenantSubdomain?: string;
}

export class TestEnvironment<T extends IEnvironment> {
  private cloudFoundryClient: Promise<CloudFoundryClient> | null = null;

  private databaseClient: Promise<DatabaseClient> | null = null;

  private sessionVariableProcessor: Promise<SessionVariableProcessor> | null = null;

  private skillRepository: Promise<SkillRepository> | null = null;

  private catalogRepository: Promise<CatalogRepository> | null = null;

  private catalogs2SkillsRepository: Promise<Catalogs2SkillsRepository> | null = null;

  private proficiencySetRepository: Promise<ProficiencySetRepository> | null = null;

  private proficiencyLevelRepository: Promise<ProficiencyLevelRepository> | null = null;

  private proficiencyLevelTextRepository: Promise<ProficiencyLevelTextRepository> | null = null;

  private languageRepository: Promise<LanguageRepository> | null = null;

  private defaultLanguageRepository: Promise<DefaultLanguageRepository> | null = null;

  private alternativeLabelRepository: Promise<AlternativeLabelRepository> | null = null;

  private skillTextRepository: Promise<SkillTextRepository> | null = null;

  private lifecycleStatusRepository: Promise<LifecycleStatusRepository> | null = null;

  private lifecycleStatusTextRepository: Promise<LifecycleStatusTextRepository> | null = null;

  private emailRepository: Promise<EmailRepository> | null = null;

  private photoRepository: Promise<PhotoRepository> | null = null;

  private phoneRepository: Promise<PhoneRepository> | null = null;

  private jobDetailRepository: Promise<JobDetailRepository> | null = null;

  private workforcePersonRepository: Promise<WorkforcePersonRepository> | null = null;

  private organizationHeaderRepository: Promise<OrganizationHeaderRepository> | null = null;

  private organizationDetailRepository: Promise<OrganizationDetailRepository> | null = null;

  private referenceObjectRepository: Promise<ReferenceObjectRepository> | null = null;

  private referenceObjectTypeRepository: Promise<ReferenceObjectTypeRepository> | null = null;

  private resourceOrganizationsRepository: Promise<ResourceOrganizationsRepository> | null = null;

  private resourceOrganizationItemsRepository: Promise<ResourceOrganizationItemsRepository> | null = null;

  private resourceOrganizationsTextsRepository: Promise<ResourceOrganizationsTextsRepository> | null = null;

  private organizationStatusRepository: Promise<OrganizationStatusRepository> | null = null;

  private costCenterAttributeRepository: Promise<CostCenterAttributeRepository> | null = null;

  private costCenterRepository: Promise<CostCenterRepository> | null = null;

  private costCenterValidityRepository: Promise<CostCenterValidityRepository> | null = null;

  private profileDetailRepository: Promise<ProfileDetailRepository> | null = null;

  private workPlaceAddressRepository: Promise<WorkPlaceAddressRepository> | null = null;

  private employeeHeaderRepository: Promise<EmployeeHeaderRepository> | null = null;

  private projectRoleRepository: Promise<ProjectRoleRepository> | null = null;

  private projectRoleTextRepository: Promise<ProjectRoleTextRepository> | null = null;

  private roleLifecycleStatusRepository: Promise<RoleLifecycleStatusRepository> | null = null;

  private roleLifecycleStatusTextRepository: Promise<RoleLifecycleStatusTextRepository> | null = null;

  private monthsOfTheYearRepository: Promise<MonthsOfTheYearRepository> | null = null;

  private monthsOfTheYearTextRepository: Promise<MonthsOfTheYearTextRepository> | null = null;

  private resourceHeaderRepository: Promise<ResourceHeaderRepository> | null = null;

  private resourceCapacityRepository: Promise<ResourceCapacityRepository> | null = null;

  private resourceKindsRepository: Promise<ResourceKindsRepository> | null = null;

  private resourceTypesRepository: Promise<ResourceTypesRepository> | null = null;

  private timeDimensionDataRepository: Promise<TimeDimensionDataRepository> | null = null;

  private workAssignmentRepository: Promise<WorkAssignmentRepository> | null = null;

  private workAssignmentDetailRepository: Promise<WorkAssignmentDetailRepository> | null = null;

  private billingCategoryRepository: Promise<BillingCategoryRepository> | null = null;

  private billingRoleRepository: Promise<BillingRoleRepository> | null = null;

  private customerRepository: Promise<CustomerRepository> | null = null;

  private projectRepository: Promise<ProjectRepository> | null = null;

  private projectSyncRepository: Promise<ProjectSyncRepository> | null = null;

  private workPackageRepository: Promise<WorkPackageRepository> | null = null;

  private demandRepository: Promise<DemandRepository> | null = null;

  private demandCapacityRequirementRepository: Promise<DemandCapacityRequirementRepository> | null = null;

  private supplySyncRepository: Promise<SupplySyncRepository> | null = null;

  private resourceRequestRepository: Promise<ResourceRequestRepository> | null = null;

  private skillRequirementRepository: Promise<SkillRequirementRepository> | null = null;

  private capacityRequirementRepository: Promise<CapacityRequirementRepository> | null = null;

  private userResourceOrganizationRepository: Promise<UserResourceOrganizationRepository> | null = null;

  private assignmentsRepository: Promise<AssignmentsRepository> | null = null;

  private assignmentBucketRepository: Promise<AssignmentBucketRepository> | null = null;

  private resourceSupplyRepository: Promise<ResourceSupplyRepository> | null = null;

  private projectReplicationFilterRepository: Promise<ProjectReplicationFilterRepository> | null = null;

  private projectReplicationTasksRepository: Promise<ProjectReplicationTasksRepository> | null = null;

  private projectReplicationFilterValueRepository: Promise<ProjectReplicationFilterValueRepository> | null = null;

  private projectReplicationStatusRepository: Promise<ProjectReplicationStatusRepository> | null = null;

  private externalWorkExperienceRepository: Promise<ExternalWorkExperienceRepository> | null = null;

  private externalWorkExperienceSkillRepository: Promise<ExternalWorkExperienceSkillRepository> | null = null;

  private roleAssignmntRepository: Promise<RoleAssignmentRepository> | null = null;

  private skillAssignmentRepository: Promise<SkillAssignmentRepository> | null = null;

  private availabilityReplicationSummaryRepository: Promise<AvailabilityReplicationSummaryRepository> | null = null;

  private availabilityReplicationErrorRepository: Promise<AvailabilityReplicationErrorRepository> | null = null;

  private availabilitySummaryStatusRepository: Promise<AvailabilitySummaryStatusRepository> | null = null;

  private availabilitySummaryStatusTextRepository: Promise<AvailabilitySummaryStatusTextRepository> | null = null;

  private availabilityReplicationViewRepository: Promise<AvailabilityReplicationViewRepository> | null = null;

  private fillTimeDimProcedure: Promise<FillTimeDimProcedure> | null = null;

  private computeCalWeekProcedure: Promise<ComputeCalWeekProcedure> | null = null;

  private availabilityProcedure: Promise<AvailabilityProcedure> | null = null;

  private roleMatchProcedure: Promise<RoleMatchProcedure> | null = null;

  private setSessionContextProcedure: Promise<SetSessionContextProcedure> | null = null;

  private skillProcedure: Promise<SkillProcedure> | null = null;

  private utilizationProcedure: Promise<UtilizationProcedure> | null = null;

  private workAssignmentFirstJobDetailRepository: Promise<WorkAssignmentFirstJobDetailRepository> | null = null;

  private csvWriter: CsvWriter | null = null;

  private deleteDataUtil: Promise<DeleteDataUtil> | null = null;

  private bsoDetailsRepository: Promise<BsoDetailsRepository> | null = null;

  private oneMDSDeltaTokenInfoRepository: Promise<OneMDSDeltaTokenInfoRepository> | null = null;

  private bookedCapacityAggregateRepository: Promise<BookedCapacityAggregateRepository> | null = null;

  private businessPurposeCompletionDetailsRepository: Promise<BusinessPurposeCompletionDetailsRepository> | null = null;

  private profilePhotoRepository: Promise<ProfilePhotoRepository> | null = null;

  private workforceAvailabilityRepository: Promise<WorkforceAvailabilityRepository> | null = null;

  private attachmentRepository: Promise<AttachmentRepository> | null = null;

  public constructor(private environment: T | null) { }

  public getEnvironment(): Promise<T> | T {
    if (!this.environment) {
      console.error('The environment is not set');
      return process.exit(1);
    }
    return this.environment;
  }

  public async getCloudFoundryClient(): Promise<CloudFoundryClient> {
    if (!this.cloudFoundryClient) {
      this.cloudFoundryClient = Promise.resolve().then(async () => {
        try {
          const environment = await this.getEnvironment();

          console.log('Creating CloudFoundryClient');
          return new CloudFoundryClient({
            username: environment.cfUser,
            password: environment.cfPassword,
            spaceGuid: environment.spaceGuid,
            landscape: environment.landscape,
          });
        } catch (err) {
          console.error('CloudFoundryClient could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.cloudFoundryClient;
  }

  public async getDatabaseClient(): Promise<DatabaseClient> {
    if (!this.databaseClient) {
      this.databaseClient = Promise.resolve().then(async () => {
        const environment = await this.getEnvironment();
        const cloudFoundryClient = await this.getCloudFoundryClient();

        try {
          console.log('Creating DatabaseClient');
          return new DatabaseClient(
            cloudFoundryClient,
            environment.srvAppName,
            environment.tenantId,
          );
        } catch (err) {
          console.error('DatabaseClient could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.databaseClient;
  }

  public async getSessionVariableProcessor() {
    if (!this.sessionVariableProcessor) {
      this.sessionVariableProcessor = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating SessionVariableProcessor');
          return new SessionVariableProcessor(databaseClient);
        } catch (err) {
          console.error('SessionVariableProcessor could not be created', err);
          process.exit(1);
        }
      });
    }
    return this.sessionVariableProcessor;
  }

  public async getSkillRepository(): Promise<SkillRepository> {
    if (!this.skillRepository) {
      this.skillRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();
        const skilTextRepository = await this.getSkillTextRepository();
        const alternativeLabelRepository = await this.getAlternativeLabelRepository();
        const catalogs2SkillsRepository = await this.getCatalogs2SkillsRepository();

        try {
          console.log('Creating SkillRepository');
          return new SkillRepository(databaseClient, skilTextRepository, alternativeLabelRepository, catalogs2SkillsRepository);
        } catch (err) {
          console.error('SkillRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.skillRepository;
  }

  public async getCatalogRepository(): Promise<CatalogRepository> {
    if (!this.catalogRepository) {
      this.catalogRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();
        const catalogs2SkillsRepository = await this.getCatalogs2SkillsRepository();

        try {
          console.log('Creating CatalogRepository');
          return new CatalogRepository(databaseClient, catalogs2SkillsRepository);
        } catch (err) {
          console.error('CatalogRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.catalogRepository;
  }

  public async getCatalogs2SkillsRepository(): Promise<Catalogs2SkillsRepository> {
    if (!this.catalogs2SkillsRepository) {
      this.catalogs2SkillsRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating Catalogs2SkillsRepository');
          return new Catalogs2SkillsRepository(databaseClient);
        } catch (err) {
          console.error('Catalogs2SkillsRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.catalogs2SkillsRepository;
  }

  public async getProficiencySetRepository(): Promise<ProficiencySetRepository> {
    if (!this.proficiencySetRepository) {
      this.proficiencySetRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();
        const proficiencyLevelRepository = await this.getProficiencyLevelRepository();

        try {
          console.log('Creating ProficiencySetRepository');
          return new ProficiencySetRepository(databaseClient, proficiencyLevelRepository);
        } catch (err) {
          console.error('ProficiencySetRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.proficiencySetRepository;
  }

  public async getProficiencyLevelRepository(): Promise<ProficiencyLevelRepository> {
    if (!this.proficiencyLevelRepository) {
      this.proficiencyLevelRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();
        const proficiencyLevelTextRepository = await this.getProficiencyLevelTextRepository();

        try {
          console.log('Creating ProficiencyLevelRepository');
          return new ProficiencyLevelRepository(databaseClient, proficiencyLevelTextRepository);
        } catch (err) {
          console.error('ProficiencyLevelRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.proficiencyLevelRepository;
  }

  public async getProficiencyLevelTextRepository(): Promise<ProficiencyLevelTextRepository> {
    if (!this.proficiencyLevelTextRepository) {
      this.proficiencyLevelTextRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ProficiencyLevelTextRepository');
          return new ProficiencyLevelTextRepository(databaseClient);
        } catch (err) {
          console.error('ProficiencyLevelTextRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.proficiencyLevelTextRepository;
  }

  public async getLifecycleStatusRepository(): Promise<LifecycleStatusRepository> {
    if (!this.lifecycleStatusRepository) {
      this.lifecycleStatusRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating LifecycleStatusRepository');
          return new LifecycleStatusRepository(databaseClient);
        } catch (err) {
          console.error('LifecycleStatusRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.lifecycleStatusRepository;
  }

  public async getLifecycleStatusTextRepository(): Promise<LifecycleStatusTextRepository> {
    if (!this.lifecycleStatusTextRepository) {
      this.lifecycleStatusTextRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating LifecycleStatusTextRepository');
          return new LifecycleStatusTextRepository(databaseClient);
        } catch (err) {
          console.error('LifecycleStatusTextRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.lifecycleStatusTextRepository;
  }

  public async getLanguageRepository(): Promise<LanguageRepository> {
    if (!this.languageRepository) {
      this.languageRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating LanguageRepository');
          return new LanguageRepository(databaseClient);
        } catch (err) {
          console.error('LanguageRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.languageRepository;
  }

  public async getDefaultLanguageRepository(): Promise<DefaultLanguageRepository> {
    if (!this.defaultLanguageRepository) {
      this.defaultLanguageRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating DefaultLanguageRepository');
          return new DefaultLanguageRepository(
            databaseClient,
          );
        } catch (err) {
          console.error('DefaultLanguageRepository could not be created', err);
          process.exit(1);
        }
      });
    }
    return this.defaultLanguageRepository;
  }

  public async getSkillTextRepository(): Promise<SkillTextRepository> {
    if (!this.skillTextRepository) {
      this.skillTextRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating SkillTextRepository');
          return new SkillTextRepository(databaseClient);
        } catch (err) {
          console.error('SkillTextRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.skillTextRepository;
  }

  public async getAlternativeLabelRepository(): Promise<AlternativeLabelRepository> {
    if (!this.alternativeLabelRepository) {
      this.alternativeLabelRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating AlternativeLabelRepository');
          return new AlternativeLabelRepository(databaseClient);
        } catch (err) {
          console.error('AlternativeLabelRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.alternativeLabelRepository;
  }

  public async getEmailRepository(): Promise<EmailRepository> {
    if (!this.emailRepository) {
      this.emailRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating EmailRepository');
          return new EmailRepository(databaseClient);
        } catch (err) {
          console.error('EmailRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.emailRepository;
  }

  public async getPhotoRepository(): Promise<PhotoRepository> {
    if (!this.photoRepository) {
      this.photoRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating PhotoRepository');
          return new PhotoRepository(databaseClient);
        } catch (err) {
          console.error('PhotoRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.photoRepository;
  }

  public async getPhoneRepository(): Promise<PhoneRepository> {
    if (!this.phoneRepository) {
      this.phoneRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating PhoneRepository');
          return new PhoneRepository(databaseClient);
        } catch (err) {
          console.error('PhoneRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.phoneRepository;
  }

  public async getJobDetailRepository(): Promise<JobDetailRepository> {
    if (!this.jobDetailRepository) {
      this.jobDetailRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating JobDetailRepository');
          return new JobDetailRepository(databaseClient);
        } catch (err) {
          console.error('JobDetailRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.jobDetailRepository;
  }

  public async getWorkforcePersonRepository(): Promise<WorkforcePersonRepository> {
    if (!this.workforcePersonRepository) {
      this.workforcePersonRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating WorkforcePersonRepository');
          return new WorkforcePersonRepository(databaseClient);
        } catch (err) {
          console.error('WorkforcePersonRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.workforcePersonRepository;
  }

  public async getOrganizationHeaderRepository(): Promise<OrganizationHeaderRepository> {
    if (!this.organizationHeaderRepository) {
      this.organizationHeaderRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating OrganizationHeaderRepository');
          return new OrganizationHeaderRepository(databaseClient);
        } catch (err) {
          console.error('OrganizationHeaderRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.organizationHeaderRepository;
  }

  public async getOrganizationDetailRepository(): Promise<OrganizationDetailRepository> {
    if (!this.organizationDetailRepository) {
      this.organizationDetailRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating OrganizationDetailRepository');
          return new OrganizationDetailRepository(databaseClient);
        } catch (err) {
          console.error('OrganizationDetailRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.organizationDetailRepository;
  }

  public async getReferenceObjectTypeRepository(): Promise<ReferenceObjectTypeRepository> {
    if (!this.referenceObjectTypeRepository) {
      this.referenceObjectTypeRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ReferenceObjectTypeRepository');
          return new ReferenceObjectTypeRepository(databaseClient);
        } catch (err) {
          console.error('ReferenceObjectTypeRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.referenceObjectTypeRepository;
  }

  public async getReferenceObjectRepository(): Promise<ReferenceObjectRepository> {
    if (!this.referenceObjectRepository) {
      this.referenceObjectRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ReferenceObjectRepository');
          return new ReferenceObjectRepository(databaseClient);
        } catch (err) {
          console.error('ReferenceObjectRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.referenceObjectRepository;
  }

  public async getResourceOrganizationsRepository(): Promise<ResourceOrganizationsRepository> {
    if (!this.resourceOrganizationsRepository) {
      this.resourceOrganizationsRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ResourceOrganizationsRepository');
          return new ResourceOrganizationsRepository(databaseClient);
        } catch (err) {
          console.error('ResourceOrganizationsRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.resourceOrganizationsRepository;
  }

  public async getResourceOrganizationItemsRepository(): Promise<ResourceOrganizationItemsRepository> {
    if (!this.resourceOrganizationItemsRepository) {
      this.resourceOrganizationItemsRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ResourceOrganizationItemsRepository');
          return new ResourceOrganizationItemsRepository(databaseClient);
        } catch (err) {
          console.error('ResourceOrganizationItemsRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.resourceOrganizationItemsRepository;
  }

  public async getResourceOrganizationsTextsRepository(): Promise<ResourceOrganizationsTextsRepository> {
    if (!this.resourceOrganizationsTextsRepository) {
      this.resourceOrganizationsTextsRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ResourceOrganizationsTextsRepository');
          return new ResourceOrganizationsTextsRepository(databaseClient);
        } catch (err) {
          console.error('ResourceOrganizationsTextsRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.resourceOrganizationsTextsRepository;
  }

  public async getOrganizationStatusRepository(): Promise<OrganizationStatusRepository> {
    if (!this.organizationStatusRepository) {
      this.organizationStatusRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating OrganizationStatusRepository');
          return new OrganizationStatusRepository(databaseClient);
        } catch (err) {
          console.error('OrganizationStatusRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.organizationStatusRepository;
  }

  public async getCostCenterAttributeRepository(): Promise<CostCenterAttributeRepository> {
    if (!this.costCenterAttributeRepository) {
      this.costCenterAttributeRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating CostCenterAttributeRepository');
          return new CostCenterAttributeRepository(databaseClient);
        } catch (err) {
          console.error('CostCenterAttributeRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.costCenterAttributeRepository;
  }

  public async getCostCenterRepository(): Promise<CostCenterRepository> {
    if (!this.costCenterRepository) {
      this.costCenterRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating CostCenterRepository');
          return new CostCenterRepository(databaseClient);
        } catch (err) {
          console.error('CostCenterRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.costCenterRepository;
  }

  public async getCostCenterValidityRepository(): Promise<CostCenterValidityRepository> {
    if (!this.costCenterValidityRepository) {
      this.costCenterValidityRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating CostCenterValidityRepository');
          return new CostCenterValidityRepository(databaseClient);
        } catch (err) {
          console.error('CostCenterValidityRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.costCenterValidityRepository;
  }

  public async getProfileDetailRepository(): Promise<ProfileDetailRepository> {
    if (!this.profileDetailRepository) {
      this.profileDetailRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ProfileDetailRepository');
          return new ProfileDetailRepository(databaseClient);
        } catch (err) {
          console.error('ProfileDetailRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.profileDetailRepository;
  }

  public async getWorkPlaceAddressRepository(): Promise<WorkPlaceAddressRepository> {
    if (!this.workPlaceAddressRepository) {
      this.workPlaceAddressRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating WorkPlaceAddressRepository');
          return new WorkPlaceAddressRepository(databaseClient);
        } catch (err) {
          console.error('WorkPlaceAddressRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.workPlaceAddressRepository;
  }

  public async getEmployeeHeaderRepository(): Promise<EmployeeHeaderRepository> {
    if (!this.employeeHeaderRepository) {
      this.employeeHeaderRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating EmployeeHeaderRepository');
          return new EmployeeHeaderRepository(databaseClient);
        } catch (err) {
          console.error('EmployeeHeaderRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.employeeHeaderRepository;
  }

  public async getProjectRoleRepository(): Promise<ProjectRoleRepository> {
    if (!this.projectRoleRepository) {
      this.projectRoleRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();
        const projectRoleTextRepository = await this.getProjectRoleTextRepository();

        try {
          console.log('Creating ProjectRoleRepository');
          return new ProjectRoleRepository(databaseClient, projectRoleTextRepository);
        } catch (err) {
          console.error('ProjectRoleRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.projectRoleRepository;
  }

  public async getProjectRoleTextRepository(): Promise<ProjectRoleTextRepository> {
    if (!this.projectRoleTextRepository) {
      this.projectRoleTextRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ProjectRoleTextRepository');
          return new ProjectRoleTextRepository(databaseClient);
        } catch (err) {
          console.error('ProjectRoleTextRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.projectRoleTextRepository;
  }

  public async getRoleLifecycleStatusRepository(): Promise<RoleLifecycleStatusRepository> {
    if (!this.roleLifecycleStatusRepository) {
      this.roleLifecycleStatusRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating Role LifecycleStatusRepository');
          return new RoleLifecycleStatusRepository(databaseClient);
        } catch (err) {
          console.error('Role LifecycleStatusRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.roleLifecycleStatusRepository;
  }

  public async getRoleLifecycleStatusTextRepository(): Promise<RoleLifecycleStatusTextRepository> {
    if (!this.roleLifecycleStatusTextRepository) {
      this.roleLifecycleStatusTextRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating Role LifecycleStatusTextRepository');
          return new RoleLifecycleStatusTextRepository(databaseClient);
        } catch (err) {
          console.error('Role LifecycleStatusTextRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.roleLifecycleStatusTextRepository;
  }

  public async getMonthsOfTheYearRepository(): Promise<MonthsOfTheYearRepository> {
    if (!this.monthsOfTheYearRepository) {
      this.monthsOfTheYearRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating MonthsOfTheYearRepository');
          return new MonthsOfTheYearRepository(databaseClient);
        } catch (err) {
          console.error('MonthsOfTheYearRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.monthsOfTheYearRepository;
  }

  public async getMonthsOfTheYearTextRepository(): Promise<MonthsOfTheYearTextRepository> {
    if (!this.monthsOfTheYearTextRepository) {
      this.monthsOfTheYearTextRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating MonthsOfTheYearTextRepository');
          return new MonthsOfTheYearTextRepository(databaseClient);
        } catch (err) {
          console.error('MonthsOfTheYearTextRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.monthsOfTheYearTextRepository;
  }

  public async getResourceHeaderRepository(): Promise<ResourceHeaderRepository> {
    if (!this.resourceHeaderRepository) {
      this.resourceHeaderRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ResourceHeaderRepository');
          return new ResourceHeaderRepository(databaseClient);
        } catch (err) {
          console.error('ResourceHeaderRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.resourceHeaderRepository;
  }

  public async getResourceCapacityRepository(): Promise<ResourceCapacityRepository> {
    if (!this.resourceCapacityRepository) {
      this.resourceCapacityRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ResourceCapacityRepository');
          return new ResourceCapacityRepository(databaseClient);
        } catch (err) {
          console.error('ResourceCapacityRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.resourceCapacityRepository;
  }

  public async getResourceKindsRepository(): Promise<ResourceKindsRepository> {
    if (!this.resourceKindsRepository) {
      this.resourceKindsRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ResourceKindsRepository');
          return new ResourceKindsRepository(databaseClient);
        } catch (err) {
          console.error('ResourceKindsRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.resourceKindsRepository;
  }

  public async getResourceTypesRepository(): Promise<ResourceTypesRepository> {
    if (!this.resourceTypesRepository) {
      this.resourceTypesRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ResourceTypesRepository');
          return new ResourceTypesRepository(databaseClient);
        } catch (err) {
          console.error('ResourceTypesRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.resourceTypesRepository;
  }

  public async getTimeDimensionsRepository(): Promise<TimeDimensionDataRepository> {
    if (!this.timeDimensionDataRepository) {
      this.timeDimensionDataRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating TimeDimensionDataRepository');
          return new TimeDimensionDataRepository(databaseClient);
        } catch (err) {
          console.error('TimeDimensionDataRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.timeDimensionDataRepository;
  }

  public async getWorkAssignmentRepository(): Promise<WorkAssignmentRepository> {
    if (!this.workAssignmentRepository) {
      this.workAssignmentRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating WorkAssignmentRepository');
          return new WorkAssignmentRepository(databaseClient);
        } catch (err) {
          console.error('WorkAssignmentRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.workAssignmentRepository;
  }

  public async getWorkAssignmentDetailRepository(): Promise<WorkAssignmentDetailRepository> {
    if (!this.workAssignmentDetailRepository) {
      this.workAssignmentDetailRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating WorkAssignmentDetailRepository');
          return new WorkAssignmentDetailRepository(databaseClient);
        } catch (err) {
          console.error('WorkAssignmentDetailRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.workAssignmentDetailRepository;
  }

  // Singleton implementation for ResourceRequest -> Project entities

  public async getBillingCategoryRepository(): Promise<BillingCategoryRepository> {
    if (!this.billingCategoryRepository) {
      this.billingCategoryRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating BillingCategoryRepository');
          return new BillingCategoryRepository(databaseClient);
        } catch (err) {
          console.error('BillingCategoryRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.billingCategoryRepository;
  }

  public async getBillingRoleRepository(): Promise<BillingRoleRepository> {
    if (!this.billingRoleRepository) {
      this.billingRoleRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating BillingRoleRepository');
          return new BillingRoleRepository(databaseClient);
        } catch (err) {
          console.error('BillingRoleRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.billingRoleRepository;
  }

  public async getCustomerRepository(): Promise<CustomerRepository> {
    if (!this.customerRepository) {
      this.customerRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating CustomerRepository');
          return new CustomerRepository(databaseClient);
        } catch (err) {
          console.error('CustomerRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.customerRepository;
  }

  public async getProjectRepository(): Promise<ProjectRepository> {
    if (!this.projectRepository) {
      this.projectRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ProjectRepository');
          return new ProjectRepository(databaseClient);
        } catch (err) {
          console.error('ProjectRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.projectRepository;
  }

  public async getWorkPackageRepository(): Promise<WorkPackageRepository> {
    if (!this.workPackageRepository) {
      this.workPackageRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating WorkPackageRepository');
          return new WorkPackageRepository(databaseClient);
        } catch (err) {
          console.error('WorkPackageRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.workPackageRepository;
  }

  public async getDemandRepository(): Promise<DemandRepository> {
    if (!this.demandRepository) {
      this.demandRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating DemandRepository');
          return new DemandRepository(databaseClient);
        } catch (err) {
          console.error('DemandRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.demandRepository;
  }

  public async getSupplySyncRepository(): Promise<SupplySyncRepository> {
    if (!this.supplySyncRepository) {
      this.supplySyncRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ProjectRepository');
          return new SupplySyncRepository(databaseClient);
        } catch (err) {
          console.error(' SupplySyncRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.supplySyncRepository;
  }

  public async getDemandCapacityRequirementRepository(): Promise<DemandCapacityRequirementRepository> {
    if (!this.demandCapacityRequirementRepository) {
      this.demandCapacityRequirementRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating DemandCapacityRequirementRepository');
          return new DemandCapacityRequirementRepository(databaseClient);
        } catch (err) {
          console.error(
            'DemandCapacityRequirementRepository could not be created',
            err,
          );
          return process.exit(1);
        }
      });
    }
    return this.demandCapacityRequirementRepository;
  }

  public async getResourceRequestRepository(): Promise<ResourceRequestRepository> {
    if (!this.resourceRequestRepository) {
      this.resourceRequestRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();
        const capacityRequirement = await this.getCapacityRequirementRepository();
        const skillRequirement = await this.getSkillRequirementRepository();

        try {
          console.log('Creating ResourceRequestRepository');
          return new ResourceRequestRepository(databaseClient, skillRequirement, capacityRequirement);
        } catch (err) {
          console.error(
            'ResourceRequestRepository could not be created',
            err,
          );
          return process.exit(1);
        }
      });
    }
    return this.resourceRequestRepository;
  }

  public async getProjectReplicationFilterRepository(): Promise<ProjectReplicationFilterRepository> {
    if (!this.projectReplicationFilterRepository) {
      this.projectReplicationFilterRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ProjectReplicationFilterRepository');
          return new ProjectReplicationFilterRepository(databaseClient);
        } catch (err) {
          console.error('ProjectReplicationFilterRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.projectReplicationFilterRepository;
  }

  public async getProjectReplicationTasksRepository(): Promise<ProjectReplicationTasksRepository> {
    if (!this.projectReplicationTasksRepository) {
      this.projectReplicationTasksRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ProjectReplicationTasksRepository');
          return new ProjectReplicationTasksRepository(databaseClient);
        } catch (err) {
          console.error('ProjectReplicationTasksRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.projectReplicationTasksRepository;
  }

  public async getProjectReplicationFilterValueRepository(): Promise<ProjectReplicationFilterValueRepository> {
    if (!this.projectReplicationFilterValueRepository) {
      this.projectReplicationFilterValueRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ProjectReplicationFilterValueRepository');
          return new ProjectReplicationFilterValueRepository(databaseClient);
        } catch (err) {
          console.error('ProjectReplicationFilterValueRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.projectReplicationFilterValueRepository;
  }

  public async getProjectReplicationStatusRepository(): Promise<ProjectReplicationStatusRepository> {
    if (!this.projectReplicationStatusRepository) {
      this.projectReplicationStatusRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ProjectReplicationStatusRepository');
          return new ProjectReplicationStatusRepository(databaseClient);
        } catch (err) {
          console.error('ProjectReplicationStatusRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.projectReplicationStatusRepository;
  }

  public async getProjectSyncRepository(): Promise<ProjectSyncRepository> {
    if (!this.projectSyncRepository) {
      this.projectSyncRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ProjectSyncRepository');
          return new ProjectSyncRepository(databaseClient);
        } catch (err) {
          console.error('ProjectSyncRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.projectSyncRepository;
  }

  public async getUserResourceOrganizationRepository(): Promise<UserResourceOrganizationRepository> {
    if (!this.userResourceOrganizationRepository) {
      this.userResourceOrganizationRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating UserResourceOrganizationDataRepository');
          return new UserResourceOrganizationRepository(databaseClient);
        } catch (err) {
          console.error('UserResourceOrganizationRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.userResourceOrganizationRepository;
  }

  public async getExternalWorkExperienceRepository(): Promise<ExternalWorkExperienceRepository> {
    if (!this.externalWorkExperienceRepository) {
      this.externalWorkExperienceRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ExternalWorkExperienceRepository');
          return new ExternalWorkExperienceRepository(databaseClient);
        } catch (err) {
          console.error('ExternalWorkExperienceRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.externalWorkExperienceRepository;
  }

  public async getExternalWorkExperienceSkillRepository(): Promise<ExternalWorkExperienceSkillRepository> {
    if (!this.externalWorkExperienceSkillRepository) {
      this.externalWorkExperienceSkillRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ExternalWorkExperienceSkillRepository');
          return new ExternalWorkExperienceSkillRepository(databaseClient);
        } catch (err) {
          console.error('ExternalWorkExperienceSkillRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.externalWorkExperienceSkillRepository;
  }

  public async getRoleAssignmentRepository(): Promise<RoleAssignmentRepository> {
    if (!this.roleAssignmntRepository) {
      this.roleAssignmntRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating RoleAssignmentRepository');
          return new RoleAssignmentRepository(databaseClient);
        } catch (err) {
          console.error('RoleAssignmentRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.roleAssignmntRepository;
  }

  public async getSkillAssignmentRepository(): Promise<SkillAssignmentRepository> {
    if (!this.skillAssignmentRepository) {
      this.skillAssignmentRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating SkillAssignmentRepository');
          return new SkillAssignmentRepository(databaseClient);
        } catch (err) {
          console.error('SkillAssignmentRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.skillAssignmentRepository;
  }

  public async getAvailabilityReplicationSummaryRepository(): Promise<AvailabilityReplicationSummaryRepository> {
    if (!this.availabilityReplicationSummaryRepository) {
      this.availabilityReplicationSummaryRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating AvailabilityReplicationSummaryRepository');
          return new AvailabilityReplicationSummaryRepository(databaseClient);
        } catch (err) {
          console.error('AvailabilityReplicationSummaryRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.availabilityReplicationSummaryRepository;
  }

  public async getAvailabilityReplicationErrorRepository(): Promise<AvailabilityReplicationErrorRepository> {
    if (!this.availabilityReplicationErrorRepository) {
      this.availabilityReplicationErrorRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating AvailabilityReplicationErrorRepository');
          return new AvailabilityReplicationErrorRepository(databaseClient);
        } catch (err) {
          console.error('AvailabilityReplicationErrorRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.availabilityReplicationErrorRepository;
  }

  public async getAvailabilitySummaryStatusRepository(): Promise<AvailabilitySummaryStatusRepository> {
    if (!this.availabilitySummaryStatusRepository) {
      this.availabilitySummaryStatusRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating AvailabilitySummaryStatusRepository');
          return new AvailabilitySummaryStatusRepository(databaseClient);
        } catch (err) {
          console.error('AvailabilitySummaryStatusRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.availabilitySummaryStatusRepository;
  }

  public async getAvailabilitySummaryStatusTextRepository(): Promise<AvailabilitySummaryStatusTextRepository> {
    if (!this.availabilitySummaryStatusTextRepository) {
      this.availabilitySummaryStatusTextRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating AvailabilitySummaryTextRepository');
          return new AvailabilitySummaryStatusTextRepository(databaseClient);
        } catch (err) {
          console.error('AvailabilitySummaryStatusTextRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.availabilitySummaryStatusTextRepository;
  }

  public async getAvailabilityReplicationViewRepository(): Promise<AvailabilityReplicationViewRepository> {
    if (!this.availabilityReplicationViewRepository) {
      this.availabilityReplicationViewRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating AvailabilityReplicationViewRepository');
          return new AvailabilityReplicationViewRepository(databaseClient);
        } catch (err) {
          console.error('AvailabilityReplicationViewRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.availabilityReplicationViewRepository;
  }

  public getCsvWriter(): CsvWriter {
    if (!this.csvWriter) {
      this.csvWriter = new CsvWriter();
    }
    return this.csvWriter;
  }

  public async getDeleteDataUtil(): Promise<DeleteDataUtil> {
    if (!this.deleteDataUtil) {
      this.deleteDataUtil = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating DeleteDataUtil');
          return new DeleteDataUtil(databaseClient);
        } catch (err) {
          console.error('DeleteDataUtil could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.deleteDataUtil;
  }

  public async getFillTimeDimProcedure(): Promise<FillTimeDimProcedure> {
    if (!this.fillTimeDimProcedure) {
      this.fillTimeDimProcedure = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating FillTimeDim Procedure');
          return new FillTimeDimProcedure(databaseClient);
        } catch (err) {
          console.error('FillTimeDimProcedure could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.fillTimeDimProcedure;
  }

  public async getComputeCalWeekProcedure(): Promise<ComputeCalWeekProcedure> {
    if (!this.computeCalWeekProcedure) {
      this.computeCalWeekProcedure = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ComputeCalWeek Procedure');
          return new ComputeCalWeekProcedure(databaseClient);
        } catch (err) {
          console.error('ComputeCalWeekProcedure could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.computeCalWeekProcedure;
  }

  public async getAssignmentsRepository(): Promise<AssignmentsRepository> {
    if (!this.assignmentsRepository) {
      this.assignmentsRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating AssignmentsRepository');
          return new AssignmentsRepository(databaseClient);
        } catch (err) {
          console.error('AssignmentsRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.assignmentsRepository;
  }

  public async getAssignmentBucketRepository(): Promise<AssignmentBucketRepository> {
    if (!this.assignmentBucketRepository) {
      this.assignmentBucketRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating AssignmentBucketRepository');
          return new AssignmentBucketRepository(databaseClient);
        } catch (err) {
          console.error('AssignmentBucketRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.assignmentBucketRepository;
  }

  public async getResourceSupplyRepository(): Promise<ResourceSupplyRepository> {
    if (!this.resourceSupplyRepository) {
      this.resourceSupplyRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ResourceSupplyRepository');
          return new ResourceSupplyRepository(databaseClient);
        } catch (err) {
          console.error('ResourceSupplyRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.resourceSupplyRepository;
  }

  public async getCapacityRequirementRepository(): Promise<CapacityRequirementRepository> {
    if (!this.capacityRequirementRepository) {
      this.capacityRequirementRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating CapacityRequirementRepository');
          return new CapacityRequirementRepository(databaseClient);
        } catch (err) {
          console.error('CapacityRequirementRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.capacityRequirementRepository;
  }

  public async getSkillRequirementRepository(): Promise<SkillRequirementRepository> {
    if (!this.skillRequirementRepository) {
      this.skillRequirementRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating SkillRequirementRepository');
          return new SkillRequirementRepository(
            databaseClient,
          );
        } catch (err) {
          console.error('SkillRequirementRepository could not be created', err);
          process.exit(1);
        }
      });
    }
    return this.skillRequirementRepository;
  }

  public async getAvailabilityProcedure(): Promise<AvailabilityProcedure> {
    if (!this.availabilityProcedure) {
      this.availabilityProcedure = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating AvailabilityProcedure');
          return new AvailabilityProcedure(databaseClient);
        } catch (err) {
          console.error('AvailabilityProcedure could not be created', err);
          process.exit(1);
        }
      });
    }
    return this.availabilityProcedure;
  }

  public async getRoleMatchProcedure(): Promise<RoleMatchProcedure> {
    if (!this.roleMatchProcedure) {
      this.roleMatchProcedure = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating RoleMatchProcedure');
          return new RoleMatchProcedure(databaseClient);
        } catch (err) {
          console.error('RoleMatchProcedure could not be created', err);
          process.exit(1);
        }
      });
    }
    return this.roleMatchProcedure;
  }

  public async getSetSessionContextProcedure(): Promise<SetSessionContextProcedure> {
    if (!this.setSessionContextProcedure) {
      this.setSessionContextProcedure = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating SetSessionContextProcedure');
          return new SetSessionContextProcedure(
            databaseClient,
          );
        } catch (err) {
          console.error('SetSessionContextProcedure could not be created', err);
          process.exit(1);
        }
      });
    }
    return this.setSessionContextProcedure;
  }

  public async getSkillProcedure(): Promise<SkillProcedure> {
    if (!this.skillProcedure) {
      this.skillProcedure = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating SkillProcedure');
          return new SkillProcedure(databaseClient);
        } catch (err) {
          console.error('SkillProcedure could not be created', err);
          process.exit(1);
        }
      });
    }
    return this.skillProcedure;
  }

  public async getUtilizationProcedure(): Promise<UtilizationProcedure> {
    if (!this.utilizationProcedure) {
      this.utilizationProcedure = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating UtilizationProcedure');
          return new UtilizationProcedure(databaseClient);
        } catch (err) {
          console.error('UtilizationProcedure could not be created', err);
          process.exit(1);
        }
      });
    }
    return this.utilizationProcedure;
  }

  public async getMatchingCandidates(resourceRequest_ID: string, resource_ID: string) {
    const databaseClient = await this.getDatabaseClient();
    return matchingCandidates(resourceRequest_ID, resource_ID, databaseClient);
  }

  public async getAuthorizedResourceOrganizations(resourceRequest_ID: string) {
    const databaseClient = await this.getDatabaseClient();
    return authorizedResourceOrganizations(resourceRequest_ID, databaseClient);
  }

  public async getStaffingStatus(ID: string) {
    const databaseClient = await this.getDatabaseClient();
    return StaffingStatusRepository(ID, databaseClient);
  }

  public async getWorkAssignmentFirstJobDetailRepository() {
    if (!this.workAssignmentFirstJobDetailRepository) {
      this.workAssignmentFirstJobDetailRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating WorkAssignmentFirstJobDetail Repository.');
          return new WorkAssignmentFirstJobDetailRepository(databaseClient);
        } catch (err) {
          console.error('WorkAssignmentFirstJobDetail Repository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.workAssignmentFirstJobDetailRepository;
  }

  public async getBsoDetailsRepository() {
    if (!this.bsoDetailsRepository) {
      this.bsoDetailsRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating BsoDetailsRepository Repository.');
          return new BsoDetailsRepository(databaseClient);
        } catch (err) {
          console.error('BsoDetailsRepository Repository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.bsoDetailsRepository;
  }

  public async getOneMDSDeltaTokenInfoRepository() {
    if (!this.oneMDSDeltaTokenInfoRepository) {
      this.oneMDSDeltaTokenInfoRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating OneMDSDeltaTokenInfoRepository Repository.');
          return new OneMDSDeltaTokenInfoRepository(databaseClient);
        } catch (err) {
          console.error('OneMDSDeltaTokenInfoRepository Repository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.oneMDSDeltaTokenInfoRepository;
  }

  public async getBookedCapacityAggregateRepository() {
    if (!this.bookedCapacityAggregateRepository) {
      this.bookedCapacityAggregateRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating BookedCapacityAggregateRepository Repository.');
          return new BookedCapacityAggregateRepository(databaseClient);
        } catch (err) {
          console.error('BookedCapacityAggregateRepository Repository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.bookedCapacityAggregateRepository;
  }

  public async getBusinessPurposeCompletionDetailsRepository(): Promise<BusinessPurposeCompletionDetailsRepository> {
    if (!this.businessPurposeCompletionDetailsRepository) {
      this.businessPurposeCompletionDetailsRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating BusinessPurposeCompletionDetailsRepository');
          return new BusinessPurposeCompletionDetailsRepository(databaseClient);
        } catch (err) {
          console.error('BusinessPurposeCompletionDetailsRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.businessPurposeCompletionDetailsRepository;
  }

  public async getProfilePhotoRepository(): Promise<ProfilePhotoRepository> {
    if (!this.profilePhotoRepository) {
      this.profilePhotoRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating ProfilePhotoRepository');
          return new ProfilePhotoRepository(databaseClient);
        } catch (err) {
          console.error('ProfilePhotoRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.profilePhotoRepository;
  }

  public async getWorkforceAvailabilityRepository(): Promise<WorkforceAvailabilityRepository> {
    if (!this.workforceAvailabilityRepository) {
      this.workforceAvailabilityRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating WorkforceAvailabilityRepository');
          return new WorkforceAvailabilityRepository(databaseClient);
        } catch (err) {
          console.error('WorkforceAvailabilityRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.workforceAvailabilityRepository;
  }

  public async getAttachmentRepository(): Promise<AttachmentRepository> {
    if (!this.attachmentRepository) {
      this.attachmentRepository = Promise.resolve().then(async () => {
        const databaseClient = await this.getDatabaseClient();

        try {
          console.log('Creating AttachmentRepository');
          return new AttachmentRepository(databaseClient);
        } catch (err) {
          console.error('AttachmentRepository could not be created', err);
          return process.exit(1);
        }
      });
    }
    return this.attachmentRepository;
  }
}
