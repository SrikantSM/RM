import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { ProjectSync } from './ProjectSync';

export class ProjectSyncRepository extends EntityRepository<ProjectSync> {
  public constructor(
    statementExecutor: StatementExecutor,
    sqlGenerator: SqlGenerator = new HanaSqlGenerator(),
  ) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_INTEGRATION_PROJECTSYNC';
  }

  get keyAttributeName(): string {
    return 'project';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['project', 'string'],
      ['type_type_code', 'integer'],
      ['status_code', 'integer'],
      ['serviceOrganization_code', 'string'],
    ]);
  }
}
