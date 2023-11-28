import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { AvailabilityReplicationError } from './AvailabilityReplicationError';

export class AvailabilityReplicationErrorRepository extends EntityRepository<AvailabilityReplicationError> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_CONSULTANTPROFILE_INTEGRATION_AVAILABILITYREPLICATIONERROR';
  }

  get keyAttributeName(): string {
    return 'resourceId';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['resourceId', TYPE_STRING],
      ['startDate', TYPE_STRING],
      ['s4costCenterId', TYPE_STRING],
      ['workAssignmentExternalId', TYPE_STRING],
      ['availabilityErrorMessage_code', TYPE_STRING],
      ['errorParam1', TYPE_STRING],
      ['errorParam2', TYPE_STRING],
      ['errorParam3', TYPE_STRING],
      ['errorParam4', TYPE_STRING],
      ['csvRecordIndex', TYPE_STRING],
      ['invalidKeys', TYPE_STRING],
    ]);
  }
}
