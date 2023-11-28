import {
  HanaSqlGenerator, SqlGenerator, StatementExecutor, TYPE_STRING,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { WorkforceAvailability } from './WorkforceAvailability';

export class WorkforceAvailabilityRepository extends EntityRepository<WorkforceAvailability> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_EMPLOYEE_WORKFORCEAVAILABILITY_WORKFORCEAVAILABILITY';
  }

  get keyAttributeName(): string {
    return 'workAssignmentID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['workAssignmentID', TYPE_STRING],
      ['workforcePerson_ID', TYPE_STRING],
      ['availabilityDate', TYPE_STRING],
      ['normalWorkingTime', TYPE_STRING],
      ['availabilityIntervals', TYPE_STRING],
      ['availabilitySupplements', TYPE_STRING],
    ]);
  }
}
