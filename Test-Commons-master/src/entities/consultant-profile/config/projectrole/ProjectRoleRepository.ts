import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
  TYPE_NUMBER,
} from '../../../../utils';
import { ProjectRole } from './ProjectRole';
import { ProjectRoleTextRepository } from './ProjectRoleTextRepository';
import { DraftEnabledEntityRepository } from '../../../DraftEnabledEntityRepository';
import { EntityDraftMode } from '../../../EntityDraftMode.enum';

export class ProjectRoleRepository extends DraftEnabledEntityRepository<ProjectRole> {
  public constructor(statementExecutor: StatementExecutor, readonly projectRoleTextRepository: ProjectRoleTextRepository, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_CONFIG_PROJECTROLES';
  }

  get draftTableName(): string {
    return 'PROJECTROLESERVICE_ROLES_DRAFTS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['code', TYPE_STRING],
      ['name', TYPE_STRING],
      ['description', TYPE_STRING],
      ['roleLifecycleStatus_code', TYPE_NUMBER],
    ]);
  }

  public async deleteMany(projectRoles: ProjectRole[], draftMode: EntityDraftMode = EntityDraftMode.BOTH): Promise<any> {
    await this.projectRoleTextRepository.deleteManyForProjectRoles(projectRoles, draftMode);

    await super.deleteMany(projectRoles, draftMode);
  }
}
