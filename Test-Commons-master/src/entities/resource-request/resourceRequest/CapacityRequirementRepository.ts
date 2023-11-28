import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
  TYPE_NUMBER,
} from '../../../utils';
import { DraftEnabledEntityRepository } from '../../DraftEnabledEntityRepository';
import { CapacityRequirement } from './CapacityRequirement';
import { ResourceRequest } from './ResourceRequest';
import { EntityDraftMode } from '../../EntityDraftMode.enum';

export class CapacityRequirementRepository extends DraftEnabledEntityRepository<
CapacityRequirement
> {
  public constructor(
    statementExecutor: StatementExecutor,
    sqlGenerator: SqlGenerator = new HanaSqlGenerator(),
  ) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_RESOURCEREQUEST_CAPACITYREQUIREMENTS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get draftTableName(): string {
    return 'MANAGERESOURCEREQUESTSERVICE_RESOURCEREQUESTCAPACITIES_DRAFTS';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['resourceRequest_ID', TYPE_STRING],
      ['startDate', TYPE_STRING],
      ['endDate', TYPE_STRING],
      ['startTime', TYPE_STRING],
      ['endTime', TYPE_STRING],
      ['requestedCapacity', TYPE_STRING],
      ['requestedUnit', TYPE_NUMBER],
      ['requestedCapacityInMinutes', TYPE_STRING],
    ]);
  }

  public async deleteManyForResourceRequest(
    resourceRequests: ResourceRequest[],
    draftMode: EntityDraftMode = EntityDraftMode.BOTH,
  ): Promise<any> {
    if (resourceRequests.length === 0) {
      return null;
    }

    const resourceRequestsIds = resourceRequests.map((resourceRequest) => ({
      resourceRequest_ID: resourceRequest.ID,
    }));

    const statement = `${this.sqlGenerator.generateSelectUnion(
      this.sqlGenerator.generateSelectStatement(
        this.tableName,
        [this.keyAttributeName],
        this.sqlGenerator.generateWhereEqualsClause(
          'resourceRequest_ID',
          this.attributeNames.get('resourceRequest_ID'),
          resourceRequestsIds,
        ),
      ),
      this.sqlGenerator.generateSelectStatement(
        this.draftTableName,
        [this.keyAttributeName],
        this.sqlGenerator.generateWhereEqualsClause(
          'resourceRequest_ID',
          this.attributeNames.get('resourceRequest_ID'),
          resourceRequestsIds,
        ),
      ),
    )};`;

    const capacityRequirements: CapacityRequirement[] = await this.statementExecutor.execute(
      statement,
    );

    return this.deleteMany(capacityRequirements, draftMode);
  }
}
