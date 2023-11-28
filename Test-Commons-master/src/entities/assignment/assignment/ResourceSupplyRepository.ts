import {
  HanaSqlGenerator, SqlGenerator, StatementExecutor, TYPE_STRING,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { ResourceSupply } from './ResourceSupply';

export class ResourceSupplyRepository extends EntityRepository<ResourceSupply> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_SUPPLY_RESOURCESUPPLY';
  }

  get keyAttributeName(): string {
    return 'assignment_ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['assignment_ID', TYPE_STRING],
      ['resourceSupply_ID', TYPE_STRING],
    ]);
  }
}
