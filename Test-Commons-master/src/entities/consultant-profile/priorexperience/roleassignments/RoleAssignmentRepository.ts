import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
} from '../../../../utils';
import { RoleAssignment } from './RoleAssignment';
import { DraftEnabledEntityRepository } from '../../../DraftEnabledEntityRepository';
import { EntityDraftMode } from '../../../EntityDraftMode.enum';

export class RoleAssignmentRepository extends DraftEnabledEntityRepository<RoleAssignment> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_EMPLOYEE_PRIOREXPERIENCE_ROLEASSIGNMENTS';
  }

  get draftTableName(): string {
    return 'MYPROJECTEXPERIENCESERVICE_ROLES_DRAFTS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['role_ID', TYPE_STRING],
      ['employee_ID', TYPE_STRING],
    ]);
  }

  public async deleteMany(roleAssignment: RoleAssignment[], draftMode: EntityDraftMode = EntityDraftMode.BOTH): Promise<any> {
    await super.deleteMany(roleAssignment, draftMode);
  }
}
