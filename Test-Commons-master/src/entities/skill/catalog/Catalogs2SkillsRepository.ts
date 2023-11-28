import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
} from '../../../utils';
import { DraftEnabledEntityRepository } from '../../DraftEnabledEntityRepository';
import { Catalogs2Skills } from './Catalogs2Skills';
import { Skill } from '../skill/Skill';
import { Catalog } from './Catalog';
import { EntityDraftMode } from '../../EntityDraftMode.enum';

export class Catalogs2SkillsRepository extends DraftEnabledEntityRepository<Catalogs2Skills> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_SKILL_CATALOGS2SKILLS';
  }

  get draftTableName(): string {
    return 'CATALOGSERVICE_CATALOGS2SKILLS_DRAFTS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['skill_ID', TYPE_STRING],
      ['catalog_ID', TYPE_STRING],
    ]);
  }

  public async deleteManyForSkills(skills: Skill[], draftMode: EntityDraftMode = EntityDraftMode.BOTH): Promise<any> {
    if (skills.length === 0) {
      return null;
    }

    const skillIds = skills.map((skill) => ({ skill_ID: skill.ID }));

    const statement = `${this.sqlGenerator.generateSelectUnion(
      this.sqlGenerator.generateSelectStatement(this.tableName, [this.keyAttributeName], this.sqlGenerator.generateWhereEqualsClause('skill_ID', this.attributeNames.get('skill_ID'), skillIds)),
      this.sqlGenerator.generateSelectStatement(this.draftTableName, [this.keyAttributeName], this.sqlGenerator.generateWhereEqualsClause('skill_ID', this.attributeNames.get('skill_ID'), skillIds)),
    )};`;

    const catalogs2Skills: Catalogs2Skills[] = await this.statementExecutor.execute(statement);

    return this.deleteMany(catalogs2Skills, draftMode);
  }

  public async deleteManyForCatalogs(catalogs: Catalog[], draftMode: EntityDraftMode = EntityDraftMode.BOTH): Promise<any> {
    if (catalogs.length === 0) {
      return null;
    }

    const catalogIds = catalogs.map((catalog) => ({ catalog_ID: catalog.ID }));

    const statement = `${this.sqlGenerator.generateSelectUnion(
      this.sqlGenerator.generateSelectStatement(this.tableName, [this.keyAttributeName], this.sqlGenerator.generateWhereEqualsClause('catalog_ID', this.attributeNames.get('catalog_ID'), catalogIds)),
      this.sqlGenerator.generateSelectStatement(this.draftTableName, [this.keyAttributeName], this.sqlGenerator.generateWhereEqualsClause('catalog_ID', this.attributeNames.get('catalog_ID'), catalogIds)),
    )};`;

    const catalogs2Skills: Catalogs2Skills[] = await this.statementExecutor.execute(statement);

    return this.deleteMany(catalogs2Skills, draftMode);
  }
}
