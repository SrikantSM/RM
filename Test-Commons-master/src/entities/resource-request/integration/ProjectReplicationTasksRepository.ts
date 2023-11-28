import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { ProjectReplicationTasks } from './ProjectReplicationTasks';

export class ProjectReplicationTasksRepository extends EntityRepository<ProjectReplicationTasks> {
  public constructor(
    statementExecutor: StatementExecutor,
    sqlGenerator: SqlGenerator = new HanaSqlGenerator(),
  ) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_CONFIG_PROJECTREPLICATIONTASKS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', 'string'],
      ['referenceDate', 'date'],
      ['taskStatus_code', 'int'],
      ['serviceOrganization_code', 'string'],
    ]);
  }
}
