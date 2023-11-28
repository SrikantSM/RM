import {
  StatementExecutor,
  SqlGenerator,
  HanaSqlGenerator,
  TYPE_STRING,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { BusinessPurposeCompletionDetails } from './BusinessPurposeCompletionDetails';

export class BusinessPurposeCompletionDetailsRepository extends EntityRepository<BusinessPurposeCompletionDetails> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_WORKFORCE_WORKFORCEPERSON_BUSINESSPURPOSECOMPLETIONDETAILS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['businessPurposeCompletionDate', TYPE_STRING],
    ]);
  }
}
