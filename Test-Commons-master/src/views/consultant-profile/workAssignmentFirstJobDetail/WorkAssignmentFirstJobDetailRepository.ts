import { ViewRepository } from '../../ViewRepository';
import { WorkAssignmentFirstJobDetail } from './WorkAssignmentFirstJobDetail';
import {
  StatementExecutor,
  SqlGenerator,
  HanaSqlGenerator,
  TYPE_STRING,
  TYPE_NUMBER,
} from '../../../utils';

export class WorkAssignmentFirstJobDetailRepository extends ViewRepository<WorkAssignmentFirstJobDetail> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_WORKFORCE_WORKASSIGNMENT_WORKASSIGNMENTFIRSTJOBDETAILS';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['VALIDFROM', TYPE_STRING],
      ['VALIDTO', TYPE_STRING],
      ['PARENT', TYPE_STRING],
      ['COSTCENTEREXTERNALID', TYPE_STRING],
      ['JOBDETAILSEQUENCENUMBER', TYPE_NUMBER],
      ['STATUS_CODE', TYPE_STRING],
      ['SUPERVISORWORKASSIGNMENTEXTERNALID', TYPE_STRING],
    ]);
  }
}
