import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
  TYPE_BOOLEAN,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { Phone } from './Phone';

export class PhoneRepository extends EntityRepository<Phone> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_WORKFORCE_WORKFORCEPERSON_PHONES';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['number', TYPE_STRING],
      ['parent', TYPE_STRING],
      ['isDefault', TYPE_BOOLEAN],
    ]);
  }
}
