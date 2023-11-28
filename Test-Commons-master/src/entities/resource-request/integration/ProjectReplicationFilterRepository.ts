import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { ProjectReplicationFilter } from './ProjectReplicationFilter';

export class ProjectReplicationFilterRepository extends EntityRepository<ProjectReplicationFilter> {
  public constructor(
    statementExecutor: StatementExecutor,
    sqlGenerator: SqlGenerator = new HanaSqlGenerator(),
  ) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_CONFIG_PROJECTREPLICATIONFILTERS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', 'string'],
      ['referencedate', 'date'],
      ['taskstatus_code', 'integer'],
    ]);
  }
}
