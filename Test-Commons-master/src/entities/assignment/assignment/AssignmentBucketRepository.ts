import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
  TYPE_NUMBER,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { AssignmentBucket } from './AssignmentBucket';

export class AssignmentBucketRepository extends EntityRepository<AssignmentBucket> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTBUCKETS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['assignment_ID', TYPE_STRING],
      ['startTime', TYPE_STRING],
      ['bookedCapacityInMinutes', TYPE_NUMBER],
    ]);
  }
}
