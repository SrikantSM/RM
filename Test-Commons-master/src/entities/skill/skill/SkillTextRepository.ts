import {
  HanaSqlGenerator, SqlGenerator, StatementExecutor, TYPE_STRING,
} from '../../../utils';
import { DraftEnabledEntityRepository } from '../../DraftEnabledEntityRepository';
import { EntityDraftMode } from '../../EntityDraftMode.enum';
import { Skill } from './Skill';
import { SkillText } from './SkillText';

export class SkillTextRepository extends DraftEnabledEntityRepository<SkillText> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_SKILL_SKILLS_TEXTS';
  }

  get draftTableName(): string {
    return 'SKILLSERVICE_SKILLS_TEXTS_DRAFTS';
  }

  get keyAttributeName(): string {
    return 'ID_texts';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID_texts', TYPE_STRING],
      ['ID', TYPE_STRING],
      ['locale', TYPE_STRING],
      ['commaSeparatedAlternativeLabels', TYPE_STRING],
      ['name', TYPE_STRING],
      ['description', TYPE_STRING],
    ]);
  }

  public async deleteManyForSkills(skills: Skill[], draftMode: EntityDraftMode = EntityDraftMode.BOTH): Promise<any> {
    if (skills.length === 0) {
      return null;
    }

    const skillIds = skills.map((skill) => ({ ID: skill.ID }));

    const statement = `${this.sqlGenerator.generateSelectUnion(
      this.sqlGenerator.generateSelectStatement(this.tableName, [this.keyAttributeName], this.sqlGenerator.generateWhereEqualsClause('ID', this.attributeNames.get('ID'), skillIds)),
      this.sqlGenerator.generateSelectStatement(this.draftTableName, [this.keyAttributeName], this.sqlGenerator.generateWhereEqualsClause('ID', this.attributeNames.get('ID'), skillIds)),
    )};`;

    const texts: SkillText[] = await this.statementExecutor.execute(statement);

    return this.deleteMany(texts, draftMode);
  }
}
