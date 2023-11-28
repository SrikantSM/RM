import {
  HanaSqlGenerator, SqlGenerator, StatementExecutor, TYPE_STRING,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { OrganizationStatus } from './OrganizationStatus';

export class OrganizationStatusRepository extends EntityRepository<OrganizationStatus> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_ORGANIZATION_ORGANIZATIONSTATUS';
  }

  get keyAttributeName(): string {
    return 'code';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['code', TYPE_STRING],
      ['name', TYPE_STRING],
    ]);
  }
}
