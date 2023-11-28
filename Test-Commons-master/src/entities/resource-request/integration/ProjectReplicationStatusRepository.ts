import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { ProjectReplicationStatus } from './ProjectReplicationStatus';

export class ProjectReplicationStatusRepository extends EntityRepository<ProjectReplicationStatus> {
  public constructor(
    statementExecutor: StatementExecutor,
    sqlGenerator: SqlGenerator = new HanaSqlGenerator(),
  ) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_INTEGRATION_PROJECTREPLICATIONSTATUS';
  }

  get keyAttributeName(): string {
    return 'type_code';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['startTime', 'string'],
      ['type_code', 'string'],
      ['status_code', 'string'],
    ]);
  }
}
