import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
  TYPE_NUMBER,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { AvailabilityReplicationSummary } from './AvailabilityReplicationSummary';

export class AvailabilityReplicationSummaryRepository extends EntityRepository<AvailabilityReplicationSummary> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_CONSULTANTPROFILE_INTEGRATION_AVAILABILITYREPLICATIONSUMMARY';
  }

  get keyAttributeName(): string {
    return 'resourceId';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['resourceId', TYPE_STRING],
      ['workForcePersonExternalId', TYPE_STRING],
      ['costCenterId', TYPE_STRING],
      ['workAssignmentStartDate', TYPE_STRING],
      ['workAssignmentEndDate', TYPE_STRING],
      ['workAssignmentExternalId', TYPE_STRING],
      ['noOfRecordsProcessed', TYPE_NUMBER],
      ['noOfRecordsFailed', TYPE_NUMBER],
      ['noOfRecordsPassed', TYPE_NUMBER],
      ['availabilitySummaryStatus_code', TYPE_STRING],
    ]);
  }
}
