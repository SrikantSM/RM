import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
  TYPE_BOOLEAN,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { Email } from './Email';

export class EmailRepository extends EntityRepository<Email> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_WORKFORCE_WORKFORCEPERSON_EMAILS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['address', TYPE_STRING],
      ['parent', TYPE_STRING],
      ['isDefault', TYPE_BOOLEAN],
    ]);
  }
}
