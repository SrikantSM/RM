import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { ResourceOrganizationItems } from './ResourceOrganizationItems';

export class ResourceOrganizationItemsRepository extends EntityRepository<ResourceOrganizationItems> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_CONFIG_RESOURCEORGANIZATIONITEMS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['resourceOrganization_ID', TYPE_STRING],
      ['costCenterId', TYPE_STRING],
    ]);
  }
}
