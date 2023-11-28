import {
  HanaSqlGenerator, SqlGenerator, StatementExecutor, TYPE_STRING,
} from '../../../utils';
import { DraftEnabledEntityRepository } from '../../DraftEnabledEntityRepository';
import { EntityDraftMode } from '../../EntityDraftMode.enum';
import { ProficiencyLevel } from './ProficiencyLevel';
import { ProficiencyLevelText } from './ProficiencyLevelText';

export class ProficiencyLevelTextRepository extends DraftEnabledEntityRepository<ProficiencyLevelText> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_SKILL_PROFICIENCYLEVELS_TEXTS';
  }

  get draftTableName(): string {
    return 'PROFICIENCYSERVICE_PROFICIENCYLEVELS_TEXTS_DRAFTS';
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

  public async deleteManyForProficiencyLevels(proficiencyLevels: ProficiencyLevel[], draftMode: EntityDraftMode = EntityDraftMode.BOTH): Promise<any> {
    if (proficiencyLevels.length === 0) {
      return null;
    }

    const proficiencyLevelIds = proficiencyLevels.map((proficiencyLevel) => ({ ID: proficiencyLevel.ID }));

    const statement = `${this.sqlGenerator.generateSelectUnion(
      this.sqlGenerator.generateSelectStatement(this.tableName, [this.keyAttributeName], this.sqlGenerator.generateWhereEqualsClause('ID', this.attributeNames.get('ID'), proficiencyLevelIds)),
      this.sqlGenerator.generateSelectStatement(this.draftTableName, [this.keyAttributeName], this.sqlGenerator.generateWhereEqualsClause('ID', this.attributeNames.get('ID'), proficiencyLevelIds)),
    )};`;

    const proficiencyLevelTexts: ProficiencyLevelText[] = await this.statementExecutor.execute(statement);

    return this.deleteMany(proficiencyLevelTexts, draftMode);
  }
}
