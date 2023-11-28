import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { ProfileDetail } from './ProfileDetail';

export class ProfileDetailRepository extends EntityRepository<ProfileDetail> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_WORKFORCE_WORKFORCEPERSON_PROFILEDETAILS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['firstName', TYPE_STRING],
      ['lastName', TYPE_STRING],
      ['fullName', TYPE_STRING],
      ['initials', TYPE_STRING],
      ['parent', TYPE_STRING],
      ['validFrom', TYPE_STRING],
      ['validTo', TYPE_STRING],
    ]);
  }
}
