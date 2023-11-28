import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
} from '../../../utils';
import { DraftEnabledEntityRepository } from '../../DraftEnabledEntityRepository';
import { SkillRequirement } from './SkillRequirement';
import { ResourceRequest } from './ResourceRequest';
import { EntityDraftMode } from '../../EntityDraftMode.enum';

export class SkillRequirementRepository extends DraftEnabledEntityRepository<
SkillRequirement
> {
  public constructor(
    statementExecutor: StatementExecutor,
    sqlGenerator: SqlGenerator = new HanaSqlGenerator(),
  ) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_RESOURCEREQUEST_SKILLREQUIREMENTS';
  }

  get draftTableName(): string {
    return 'MANAGERESOURCEREQUESTSERVICE_SKILLREQUIREMENTS_DRAFTS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', 'string'],
      ['RESOURCEREQUEST_ID', 'string'],
      ['SKILL_ID', 'string'],
      ['IMPORTANCE_CODE', 'string'],
      ['PROFICIENCYLEVEL_ID', 'string'],
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

    const skillRequirements: SkillRequirement[] = await this.statementExecutor.execute(
      statement,
    );

    return this.deleteMany(skillRequirements, draftMode);
  }
}
