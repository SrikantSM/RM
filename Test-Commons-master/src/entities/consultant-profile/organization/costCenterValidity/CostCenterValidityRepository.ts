import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
  TYPE_BOOLEAN,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { CostCenterValidity } from './CostCenterValidity';

export class CostCenterValidityRepository extends EntityRepository<CostCenterValidity> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_ORGANIZATION_COSTCENTERVALIDITY';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['validFrom', TYPE_STRING],
      ['validTo', TYPE_STRING],
      ['parent', TYPE_STRING],
      ['isValid', TYPE_BOOLEAN],
    ]);
  }
}
