import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { OrganizationDetail } from './OrganizationDetail';

export class OrganizationDetailRepository extends EntityRepository<OrganizationDetail> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_ORGANIZATION_DETAILS';
  }

  get keyAttributeName(): string {
    return 'code';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['code', TYPE_STRING],
      ['unitKey', TYPE_STRING],
      ['unitType', TYPE_STRING],
      ['compositeUnitKey', TYPE_STRING],
    ]);
  }
}
