import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
  TYPE_BOOLEAN,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { WorkforcePerson } from './WorkforcePerson';

export class WorkforcePersonRepository extends EntityRepository<WorkforcePerson> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_WORKFORCE_WORKFORCEPERSON_WORKFORCEPERSONS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['externalID', TYPE_STRING],
      ['isBusinessPurposeCompleted', TYPE_BOOLEAN],
    ]);
  }
}
