import {
  HanaSqlGenerator, SqlGenerator, StatementExecutor, TYPE_BOOLEAN, TYPE_STRING,
} from '../../../utils';
import { DraftEnabledEntityRepository } from '../../DraftEnabledEntityRepository';
import { EntityDraftMode } from '../../EntityDraftMode.enum';
import { ProficiencySet } from './ProficiencySet';
import { ProficiencyLevelRepository } from './ProficiencyLevelRepository';

export class ProficiencySetRepository extends DraftEnabledEntityRepository<ProficiencySet> {
  public constructor(statementExecutor: StatementExecutor, readonly proficiencyLevelRepository: ProficiencyLevelRepository, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_SKILL_PROFICIENCYSETS';
  }

  get draftTableName(): string {
    return 'PROFICIENCYSERVICE_PROFICIENCYSETS_DRAFTS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['OID', TYPE_STRING],
      ['name', TYPE_STRING],
      ['description', TYPE_STRING],
      ['isCustom', TYPE_BOOLEAN],
    ]);
  }

  static get defaultProficiencySetId(): string {
    return '8a2cc2c3-4a46-47f0-ae67-2ac67c673aae';
  }

  public async deleteMany(proficiencySets: ProficiencySet[], draftMode: EntityDraftMode = EntityDraftMode.BOTH): Promise<any> {
    await this.proficiencyLevelRepository.deleteManyForProficiencySets(proficiencySets, draftMode);
    await super.deleteMany(proficiencySets, draftMode);
  }

  public async deleteManyByData(proficiencySets: ProficiencySet[], draftMode: EntityDraftMode = EntityDraftMode.BOTH): Promise<any> {
    const selectedProficiencySets: ProficiencySet[] = await this.selectByData(['ID'], proficiencySets, draftMode) as ProficiencySet[];

    await this.proficiencyLevelRepository.deleteManyForProficiencySets(selectedProficiencySets, draftMode);

    await super.deleteManyByData(proficiencySets, draftMode);
  }

  public async ensureDefaultProficiency(): Promise<any> {
    await this.ensureDefaultProficiencySet();
    await this.proficiencyLevelRepository.ensureDefaultProficiencyLevel(ProficiencySetRepository.defaultProficiencySetId);
  }

  async ensureDefaultProficiencySet(): Promise<any> {
    const previousSet = await this.selectByData(['ID'], [{ ID: ProficiencySetRepository.defaultProficiencySetId }]);
    if (previousSet.length > 0) {
      return;
    }

    await this.insertOne({
      ID: ProficiencySetRepository.defaultProficiencySetId,
      name: 'Not specified',
      description: 'This proficiency set is empty. It is the default proficiency set for skills. This proficiency set can\'t be modified',
      isCustom: false,
    }, EntityDraftMode.ACTIVE_ONLY);
  }
}
