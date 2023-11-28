import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
} from '../../../../utils';
import { DraftEnabledEntityRepository } from '../../../DraftEnabledEntityRepository';
import { EntityDraftMode } from '../../../EntityDraftMode.enum';
import { ProjectRole } from './ProjectRole';
import { ProjectRoleText } from './ProjectRoleText';

export class ProjectRoleTextRepository extends DraftEnabledEntityRepository<ProjectRoleText> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_CONFIG_PROJECTROLES_TEXTS';
  }

  get draftTableName(): string {
    return 'PROJECTROLESERVICE_ROLES_TEXTS_DRAFTS';
  }

  get keyAttributeName(): string {
    return 'ID_texts';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID_texts', TYPE_STRING],
      ['ID', TYPE_STRING],
      ['locale', TYPE_STRING],
      ['name', TYPE_STRING],
      ['description', TYPE_STRING],
    ]);
  }

  public async deleteManyForProjectRoles(roles: ProjectRole[], draftMode: EntityDraftMode = EntityDraftMode.BOTH): Promise<any> {
    if (roles.length === 0) {
      return null;
    }

    const roleIds = roles.map((role) => ({ ID: role.ID }));

    const statement = `${this.sqlGenerator.generateSelectUnion(
      this.sqlGenerator.generateSelectStatement(this.tableName, [this.keyAttributeName], this.sqlGenerator.generateWhereEqualsClause('ID', this.attributeNames.get('ID'), roleIds)),
      this.sqlGenerator.generateSelectStatement(this.draftTableName, [this.keyAttributeName], this.sqlGenerator.generateWhereEqualsClause('ID', this.attributeNames.get('ID'), roleIds)),
    )};`;

    const texts: ProjectRoleText[] = await this.statementExecutor.execute(statement);

    return this.deleteMany(texts, draftMode);
  }
}
