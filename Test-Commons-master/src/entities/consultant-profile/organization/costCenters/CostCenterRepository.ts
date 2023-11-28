import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { CostCenter } from './CostCenter';

export class CostCenterRepository extends EntityRepository<CostCenter> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_ORGANIZATION_COSTCENTERS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['costCenterID', TYPE_STRING],
      ['displayName', TYPE_STRING],
      ['costCenterDesc', TYPE_STRING],
      ['logicalSystem', TYPE_STRING],
      ['companyCode', TYPE_STRING],
      ['controllingArea', TYPE_STRING],
    ]);
  }
}
