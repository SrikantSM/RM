import {
    TimeDimensionDataRepository,
    EmployeeHeaderRepository,
    WorkAssignmentRepository,
    CustomerRepository,
    ProjectRoleRepository,
    ProjectRepository,
    WorkPackageRepository,
    ResourceRequestRepository,
    AssignmentsRepository,
    AssignmentBucketRepository,
    SkillRepository,
    SkillRequirementRepository,
    ComputeCalWeekProcedure,
    FillTimeDimProcedure,
    JobDetailRepository,
    SessionVariableProcessor,
    WorkAssignmentFirstJobDetailRepository,
    SkillTextRepository,
    OrganizationHeaderRepository,
} from 'test-commons';
import { dbIntegrationTestEnvironment } from './index';

export class DBTestRepository {
    private static dbRepositoryPreparationStatus: boolean = false;

    protected static assignmentBucketRepository: AssignmentBucketRepository;

    protected static assignmentRepository: AssignmentsRepository;

    protected static customerRepository: CustomerRepository;

    protected static employeeHeaderRepository: EmployeeHeaderRepository;

    protected static skillTextRepository: SkillTextRepository;

    protected static projectRoleRepository: ProjectRoleRepository;

    protected static projectRepository: ProjectRepository;

    protected static resourceRequestRepository: ResourceRequestRepository;

    protected static workAssignmentRepository: WorkAssignmentRepository;

    protected static workPackageRepository: WorkPackageRepository;

    protected static skillRepository: SkillRepository;

    protected static skillRequirementRepository: SkillRequirementRepository;

    protected static timeDimensionDataRepository: TimeDimensionDataRepository;

    protected static computeCalWeekProcedureRepository: ComputeCalWeekProcedure;

    protected static fillTimeDimensionProcedureRepository: FillTimeDimProcedure;

    protected static jobDetailRepository: JobDetailRepository;

    protected static workAssignmentFirstJobDetailRepository: WorkAssignmentFirstJobDetailRepository;

    protected static sessionVariableProcessor: SessionVariableProcessor;

    protected static organizationHeaderRepository: OrganizationHeaderRepository;

    static async prepareDbRepository() {
        if (!DBTestRepository.dbRepositoryPreparationStatus) {
            console.log('preparing DB Respositories');
            DBTestRepository.assignmentBucketRepository = await dbIntegrationTestEnvironment.getAssignmentBucketRepository();
            DBTestRepository.assignmentRepository = await dbIntegrationTestEnvironment.getAssignmentsRepository();
            DBTestRepository.customerRepository = await dbIntegrationTestEnvironment.getCustomerRepository();
            DBTestRepository.employeeHeaderRepository = await dbIntegrationTestEnvironment.getEmployeeHeaderRepository();
            DBTestRepository.skillTextRepository = await dbIntegrationTestEnvironment.getSkillTextRepository();
            DBTestRepository.projectRoleRepository = await dbIntegrationTestEnvironment.getProjectRoleRepository();
            DBTestRepository.projectRepository = await dbIntegrationTestEnvironment.getProjectRepository();
            DBTestRepository.resourceRequestRepository = await dbIntegrationTestEnvironment.getResourceRequestRepository();
            DBTestRepository.workAssignmentRepository = await dbIntegrationTestEnvironment.getWorkAssignmentRepository();
            DBTestRepository.workPackageRepository = await dbIntegrationTestEnvironment.getWorkPackageRepository();
            DBTestRepository.skillRepository = await dbIntegrationTestEnvironment.getSkillRepository();
            DBTestRepository.skillRequirementRepository = await dbIntegrationTestEnvironment.getSkillRequirementRepository();
            DBTestRepository.timeDimensionDataRepository = await dbIntegrationTestEnvironment.getTimeDimensionsRepository();
            DBTestRepository.computeCalWeekProcedureRepository = await dbIntegrationTestEnvironment.getComputeCalWeekProcedure();
            DBTestRepository.fillTimeDimensionProcedureRepository = await dbIntegrationTestEnvironment.getFillTimeDimProcedure();
            DBTestRepository.jobDetailRepository = await dbIntegrationTestEnvironment.getJobDetailRepository();
            DBTestRepository.sessionVariableProcessor = await dbIntegrationTestEnvironment.getSessionVariableProcessor();
            DBTestRepository.workAssignmentFirstJobDetailRepository = await dbIntegrationTestEnvironment.getWorkAssignmentFirstJobDetailRepository();
            DBTestRepository.organizationHeaderRepository = await dbIntegrationTestEnvironment.getOrganizationHeaderRepository();
            DBTestRepository.dbRepositoryPreparationStatus = true;
            console.log('DB Repositories Preparation Complete');
        }
    }
}
