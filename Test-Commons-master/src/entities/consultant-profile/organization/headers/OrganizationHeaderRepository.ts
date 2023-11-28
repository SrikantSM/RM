import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { OrganizationHeader } from './OrganizationHeader';

export class OrganizationHeaderRepository extends EntityRepository<OrganizationHeader> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_ORGANIZATION_HEADERS';
  }

  get keyAttributeName(): string {
    return 'code';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['code', TYPE_STRING],
      ['isDelivery', TYPE_STRING],
      ['description', TYPE_STRING],
    ]);
  }
}
