import {
  StatementExecutor,
  SqlGenerator,
  HanaSqlGenerator,
  TYPE_STRING,
  TYPE_BOOLEAN,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { WorkAssignmentDetail } from './WorkAssignmentDetail';

export class WorkAssignmentDetailRepository extends EntityRepository<WorkAssignmentDetail> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_WORKFORCE_WORKASSIGNMENT_WORKASSIGNMENTDETAILS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['parent', TYPE_STRING],
      ['validFrom', TYPE_STRING],
      ['validTo', TYPE_STRING],
      ['isPrimary', TYPE_BOOLEAN],
    ]);
  }
}
