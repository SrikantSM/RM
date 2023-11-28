import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { SupplySync } from './SupplySync';

export class SupplySyncRepository extends EntityRepository<
SupplySync
> {
  public constructor(
    statementExecutor: StatementExecutor,
    sqlGenerator: SqlGenerator = new HanaSqlGenerator(),
  ) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_INTEGRATION_SUPPLYSYNC';
  }

  get keyAttributeName(): string {
    return 'demand';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['demand', 'string'],
    ]);
  }
}
