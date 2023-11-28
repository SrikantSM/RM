import {
  HanaSqlGenerator, SqlGenerator, StatementExecutor, TYPE_STRING,
} from '../../../utils';
import { DraftEnabledEntityRepository } from '../../DraftEnabledEntityRepository';
import { EntityDraftMode } from '../../EntityDraftMode.enum';
import { Skill } from '../skill/Skill';
import { AlternativeLabel } from './AlternativeLabel';

export class AlternativeLabelRepository extends DraftEnabledEntityRepository<AlternativeLabel> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_SKILL_ALTERNATIVELABELS';
  }

  get draftTableName(): string {
    return 'SKILLSERVICE_ALTERNATIVELABELS_DRAFTS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['name', TYPE_STRING],
      ['skill_ID', TYPE_STRING],
      ['language_code', TYPE_STRING],
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

    const alternativeLabels: AlternativeLabel[] = await this.statementExecutor.execute(statement);

    return this.deleteMany(alternativeLabels, draftMode);
  }
}
