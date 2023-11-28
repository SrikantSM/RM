import { ViewRepository } from '../../ViewRepository';
import { BsoDetails } from './bsoDetails';
import {
  StatementExecutor,
  SqlGenerator,
  HanaSqlGenerator,
  TYPE_STRING,
} from '../../../utils';

export class BsoDetailsRepository extends ViewRepository<BsoDetails> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'BUSINESSSERVICEORGSERVICE_BSODETAILS';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['code', TYPE_STRING],
      ['isSales', TYPE_STRING],
      ['isDelivery', TYPE_STRING],
      ['description', TYPE_STRING],
      ['costCenter', TYPE_STRING],
      ['companyCode', TYPE_STRING],
      ['controllingArea', TYPE_STRING],
      ['costCenterUUID', TYPE_STRING],

    ]);
  }
}
