import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
  TYPE_BOOLEAN,
  TYPE_NUMBER,
} from '../../../utils';
import { ViewRepository } from '../../ViewRepository';
import { AvailabilityReplicationView } from './AvailabilityReplicationView';

export class AvailabilityReplicationViewRepository extends ViewRepository<AvailabilityReplicationView> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_CONSULTANTPROFILE_INTEGRATION_AVAILABILITYREPLICATIONVIEW';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['resourceId', TYPE_STRING],
      ['workAssignmentExternalId', TYPE_STRING],
      ['name', TYPE_STRING],
      ['firstName', TYPE_STRING],
      ['lastName', TYPE_STRING],
      ['isBusinessPurposeCompleted', TYPE_BOOLEAN],
      ['s4costCenterId', TYPE_STRING],
      ['workAssignmentStartDate', TYPE_STRING],
      ['workAssignmentEndDate', TYPE_STRING],
      ['workForcePersonExternalId', TYPE_STRING],
      ['availabilitySummaryStatus_code', TYPE_NUMBER],

    ]);
  }
}
