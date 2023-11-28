import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
  TYPE_NUMBER,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { ResourceOrganizations } from './ResourceOrganizations';

export class ResourceOrganizationsRepository extends EntityRepository<ResourceOrganizations> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_CONFIG_RESOURCEORGANIZATIONS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['displayId', TYPE_STRING],
      ['name', TYPE_STRING],
      ['description', TYPE_STRING],
      ['serviceOrganization_code', TYPE_STRING],
      ['lifeCycleStatus_code', TYPE_NUMBER],
    ]);
  }
}
