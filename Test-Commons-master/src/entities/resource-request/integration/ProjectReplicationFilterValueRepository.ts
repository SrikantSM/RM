import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { ProjectReplicationFilterValues } from './ProjectReplicationFilterValues';

export class ProjectReplicationFilterValueRepository extends EntityRepository<ProjectReplicationFilterValues> {
  public constructor(
    statementExecutor: StatementExecutor,
    sqlGenerator: SqlGenerator = new HanaSqlGenerator(),
  ) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_CONFIG_PROJECTREPLICATIONFILTERVALUES';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', 'string'],
      ['serviceorganization_code', 'string'],
      ['parent_ID', 'string'],
    ]);
  }
}
