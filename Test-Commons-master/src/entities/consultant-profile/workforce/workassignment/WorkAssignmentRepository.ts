import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_BOOLEAN,
  TYPE_STRING,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { WorkAssignment } from './WorkAssignment';

export class WorkAssignmentRepository extends EntityRepository<WorkAssignment> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_WORKFORCE_WORKASSIGNMENT_WORKASSIGNMENTS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['workAssignmentID', TYPE_STRING],
      ['externalID', TYPE_STRING],
      ['parent', TYPE_STRING],
      ['startDate', TYPE_STRING],
      ['endDate', TYPE_STRING],
      ['isContingentWorker', TYPE_BOOLEAN],
    ]);
  }
}
