import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
  TYPE_NUMBER,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { JobDetail } from './JobDetail';

export class JobDetailRepository extends EntityRepository<JobDetail> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_WORKFORCE_WORKASSIGNMENT_JOBDETAILS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['costCenterexternalID', TYPE_STRING],
      ['supervisorWorkAssignmentExternalID', TYPE_STRING],
      ['jobTitle', TYPE_STRING],
      ['parent', TYPE_STRING],
      ['legalEntityExternalID', TYPE_STRING],
      ['eventSequence', TYPE_NUMBER],
      ['country_code', TYPE_STRING],
      ['validFrom', TYPE_STRING],
      ['validTo', TYPE_STRING],
      ['status_code', TYPE_STRING],
    ]);
  }
}
