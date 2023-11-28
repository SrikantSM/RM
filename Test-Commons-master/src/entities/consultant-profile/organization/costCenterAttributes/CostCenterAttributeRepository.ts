import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { CostCenterAttribute } from './CostCenterAttribute';

export class CostCenterAttributeRepository extends EntityRepository<CostCenterAttribute> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_ORGANIZATION_COSTCENTERATTRIBUTES';
  }

  get keyAttributeName(): string {
    return 'parent';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['validFrom', TYPE_STRING],
      ['validTo', TYPE_STRING],
      ['ID', TYPE_STRING],
      ['name', TYPE_STRING],
      ['description', TYPE_STRING],
      ['responsible', TYPE_STRING],
      ['parent', TYPE_STRING],
    ]);
  }
}
