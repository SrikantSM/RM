import {
  HanaSqlGenerator, SqlGenerator, StatementExecutor, TYPE_NUMBER, TYPE_STRING,
} from '../../../utils';
import { DraftEnabledEntityRepository } from '../../DraftEnabledEntityRepository';
import { EntityDraftMode } from '../../EntityDraftMode.enum';
import { ProficiencyLevel } from './ProficiencyLevel';
import { ProficiencySet } from './ProficiencySet';
import { ProficiencyLevelTextRepository } from './ProficiencyLevelTextRepository';

export class ProficiencyLevelRepository extends DraftEnabledEntityRepository<ProficiencyLevel> {
  public constructor(statementExecutor: StatementExecutor, readonly proficiencyLevelTextRepository: ProficiencyLevelTextRepository, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_SKILL_PROFICIENCYLEVELS';
  }

  get draftTableName(): string {
    return 'PROFICIENCYSERVICE_PROFICIENCYLEVELS_DRAFTS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['odmUUID', TYPE_STRING],
      ['name', TYPE_STRING],
      ['description', TYPE_STRING],
      ['rank', TYPE_NUMBER],
      ['proficiencySet_ID', TYPE_STRING],
    ]);
  }

  static get defaultProficiencyLevelId(): string {
    return '8e88cf20-f5f2-40dc-8b8e-e63d8bc868ee';
  }

  public async deleteMany(proficiencyLevels: ProficiencyLevel[], draftMode: EntityDraftMode = EntityDraftMode.BOTH): Promise<any> {
    await this.proficiencyLevelTextRepository.deleteManyForProficiencyLevels(proficiencyLevels, draftMode);
    await super.deleteMany(proficiencyLevels, draftMode);
  }

  public async deleteManyByData(proficiencyLevels: ProficiencyLevel[], draftMode: EntityDraftMode = EntityDraftMode.BOTH): Promise<any> {
    const selectedProficiencyLevels: ProficiencyLevel[] = await this.selectByData(['ID'], proficiencyLevels, draftMode) as ProficiencyLevel[];

    await this.proficiencyLevelTextRepository.deleteManyForProficiencyLevels(selectedProficiencyLevels, draftMode);

    await super.deleteManyByData(proficiencyLevels, draftMode);
  }

  public async deleteManyForProficiencySets(proficiencySets: ProficiencySet[], draftMode: EntityDraftMode = EntityDraftMode.BOTH): Promise<any> {
    if (proficiencySets.length === 0) {
      return null;
    }

    const proficiencySetIds = proficiencySets.map((proficiencySet) => ({ proficiencySet_ID: proficiencySet.ID }));

    const statement = `${this.sqlGenerator.generateSelectUnion(
      this.sqlGenerator.generateSelectStatement(this.tableName, [this.keyAttributeName], this.sqlGenerator.generateWhereEqualsClause('proficiencySet_ID', this.attributeNames.get('proficiencySet_ID'), proficiencySetIds)),
      this.sqlGenerator.generateSelectStatement(this.draftTableName, [this.keyAttributeName], this.sqlGenerator.generateWhereEqualsClause('proficiencySet_ID', this.attributeNames.get('proficiencySet_ID'), proficiencySetIds)),
    )};`;

    const proficiencyLevels: ProficiencyLevel[] = await this.statementExecutor.execute(statement);

    return this.deleteMany(proficiencyLevels, draftMode);
  }

  async ensureDefaultProficiencyLevel(defaultProficiencySetId: string): Promise<any> {
    const previousLevel = await this.selectByData(['ID'], [{ ID: ProficiencyLevelRepository.defaultProficiencyLevelId }]);
    if (previousLevel.length > 0) {
      return;
    }

    await this.insertOne({
      ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
      proficiencySet_ID: defaultProficiencySetId,
      name: 'None',
      description: 'No proficiency levels exist for this skill.',
      rank: 1,
    }, EntityDraftMode.ACTIVE_ONLY);
  }
}
