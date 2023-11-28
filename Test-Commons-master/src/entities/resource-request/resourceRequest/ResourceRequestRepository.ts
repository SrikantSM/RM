import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
} from '../../../utils';
import { DraftEnabledEntityRepository } from '../../DraftEnabledEntityRepository';
import { EntityDraftMode } from '../../EntityDraftMode.enum';
import { ResourceRequest } from './ResourceRequest';
import { SkillRequirementRepository } from './SkillRequirementRepository';
import { CapacityRequirementRepository } from './CapacityRequirementRepository';

export class ResourceRequestRepository extends DraftEnabledEntityRepository<
ResourceRequest
> {
  public constructor(
    statementExecutor: StatementExecutor,
    readonly skillRequirementRepository: SkillRequirementRepository,
    readonly capacityRequirementRepository: CapacityRequirementRepository,
    sqlGenerator: SqlGenerator = new HanaSqlGenerator(),
  ) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_RESOURCEREQUEST_RESOURCEREQUESTS';
  }

  get draftTableName(): string {
    return 'MANAGERESOURCEREQUESTSERVICE_RESOURCEREQUESTS_DRAFTS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', 'string'],
      ['displayId', 'string'],
      ['isS4Cloud', 'boolean'],
      ['demand_ID', 'string'],
      ['workpackage_ID', 'string'],
      ['project_ID', 'string'],
      ['projectRole_ID', 'string'],
      ['priority_code', 'string'],
      ['requestedResourceOrg_ID', 'string'],
      ['processingResourceOrg_ID', 'string'],
      ['requestStatus_code', 'number'],
      ['releaseStatus_code', 'number'],
      ['resourceKind_code', 'string'],
      ['startDate', 'string'],
      ['endDate', 'string'],
      ['startTime', 'string'],
      ['endTime', 'string'],
      ['requestedCapacity', 'number'],
      ['requestedUnit', 'string'],
      ['requestedCapacityInMinutes', 'number'],
      ['name', 'string'],
      ['description', 'string'],
      ['resourceManager', 'string'],
      ['processor', 'string'],
      ['referenceObject_ID', 'string'],
      ['referenceObjectType_code', 'number'],
    ]);
  }

  public async deleteMany(
    resourceRequests: ResourceRequest[],
    draftMode: EntityDraftMode = EntityDraftMode.BOTH,
  ): Promise<any> {
    await this.skillRequirementRepository.deleteManyForResourceRequest(
      resourceRequests,
      draftMode,
    );
    await this.capacityRequirementRepository.deleteManyForResourceRequest(
      resourceRequests,
      draftMode,
    );

    await super.deleteMany(resourceRequests, draftMode);
  }

  public async updateMany(
    attributeToUpdate: string,
    updateToValue: any,
    entities: [],
  ): Promise<any> {
    const whereClause = this.sqlGenerator.generateWhereConditionForData(this.attributeNames, entities);
    const updateStatement = `${this.sqlGenerator.generateUpdateStatement(this.tableName, this.sqlGenerator.convertToColumnName(attributeToUpdate), updateToValue, whereClause)}`;
    await this.statementExecutor.execute(updateStatement);
  }

  public async getdisplayId(): Promise<any> {
    const odisplayId = await this.statementExecutor.execute('SELECT DISPLAY_ID.NEXTVAL FROM DUMMY');
    return String(odisplayId[0]['DISPLAY_ID.NEXTVAL']).padStart(10, '0');
  }
}
