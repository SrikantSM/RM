import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { UserResourceOrganization } from './UserResourceOrganization';

export class UserResourceOrganizationRepository extends EntityRepository<UserResourceOrganization> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_RESOURCEREQUEST_USERRESOURCEORGANIZATIONS';
  }

  get keyAttributeName(): string {
    return 'RESOURCEORGANIZATION';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['RESOURCEORGANIZATION', TYPE_STRING],
    ]);
  }
}
