import {
  HanaSqlGenerator, SqlGenerator, StatementExecutor, TYPE_STRING, TYPE_NUMBER,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { AssignmentStatus } from './AssignmentStatus';

export class AssignmentStatusRepository extends EntityRepository<AssignmentStatus> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTSTATUS';
  }

  get keyAttributeName(): string {
    return 'code';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['code', TYPE_NUMBER],
      ['name', TYPE_STRING],
    ]);
  }
}
