import { HanaSqlGenerator, SqlGenerator, StatementExecutor } from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { Assignments } from './Assignments';

export class AssignmentsRepository extends EntityRepository<Assignments> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', 'string'],
      ['bookedCapacityInMinutes', 'number'],
      ['assignmentstatus_code', 'number'],
      ['resourceRequest_ID', 'string'],
      ['resource_ID', 'string'],
    ]);
  }
}
