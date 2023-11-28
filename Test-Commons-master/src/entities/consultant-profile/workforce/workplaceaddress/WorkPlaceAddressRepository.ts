import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { WorkPlaceAddress } from './WorkPlaceAddress';

export class WorkPlaceAddressRepository extends EntityRepository<WorkPlaceAddress> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_WORKFORCE_WORKASSIGNMENT_WORKPLACEADDRESSES';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['parent', TYPE_STRING],
      ['officeLocation', TYPE_STRING],
      ['validFrom', TYPE_STRING],
      ['validTo', TYPE_STRING],
    ]);
  }
}
