import {
  HanaSqlGenerator, SqlGenerator, StatementExecutor, TYPE_NUMBER, TYPE_STRING, TYPE_TIMESTAMP,
} from '../../../utils';
import { DraftEnabledEntityRepository } from '../../DraftEnabledEntityRepository';
import { EntityDraftMode } from '../../EntityDraftMode.enum';
import { AlternativeLabelRepository } from '../alternativeLabel/AlternativeLabelRepository';
import { Catalogs2SkillsRepository } from '../catalog/Catalogs2SkillsRepository';
import { ProficiencySetRepository } from '../proficiencySet';
import { Skill } from './Skill';
import { SkillTextRepository } from './SkillTextRepository';

export class SkillRepository extends DraftEnabledEntityRepository<Skill> {
  public constructor(statementExecutor: StatementExecutor, readonly skillTextRepository: SkillTextRepository, readonly alternativeLabelRepository: AlternativeLabelRepository, readonly catalogs2SkillsRepository: Catalogs2SkillsRepository, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_SKILL_SKILLS';
  }

  get draftTableName(): string {
    return 'SKILLSERVICE_SKILLS_DRAFTS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['createdAt', TYPE_TIMESTAMP],
      ['modifiedAt', TYPE_TIMESTAMP],
      ['modifiedBy', TYPE_STRING],
      ['ID', TYPE_STRING],
      ['OID', TYPE_STRING],
      ['externalID', TYPE_STRING],
      ['commaSeparatedAlternativeLabels', TYPE_STRING],
      ['description', TYPE_STRING],
      ['name', TYPE_STRING],
      ['lifecycleStatus_code', TYPE_NUMBER],
      ['proficiencySet_ID', TYPE_STRING],
    ]);
  }

  public async insertOne(skill: Skill, draftMode: EntityDraftMode = EntityDraftMode.ACTIVE_ONLY, draftAdministrativeUser: string | null = null): Promise<any> {
    return this.insertMany([skill], draftMode, draftAdministrativeUser);
  }

  public async insertMany(skills: Skill[], draftMode: EntityDraftMode = EntityDraftMode.ACTIVE_ONLY, draftAdministrativeUser: string | null = null, batchSize: number = this.defaultBatchSize): Promise<any> {
    return super.insertMany(skills.map((s) => this.addDefaultProficiencySet(s)), draftMode, draftAdministrativeUser, batchSize);
  }

  private addDefaultProficiencySet(skill: Skill): Skill {
    return {
      proficiencySet_ID: ProficiencySetRepository.defaultProficiencySetId,
      ...skill,
    };
  }

  public async deleteMany(skills: Skill[], draftMode: EntityDraftMode = EntityDraftMode.BOTH): Promise<any> {
    await this.skillTextRepository.deleteManyForSkills(skills, draftMode);
    await this.alternativeLabelRepository.deleteManyForSkills(skills, draftMode);
    await this.catalogs2SkillsRepository.deleteManyForSkills(skills, draftMode);

    await super.deleteMany(skills, draftMode);
  }

  public async deleteManyByData(skills: Skill[], draftMode: EntityDraftMode = EntityDraftMode.BOTH): Promise<any> {
    const selectedSkills: Skill[] = await this.selectByData(['ID'], skills, draftMode) as Skill[];

    await this.skillTextRepository.deleteManyForSkills(selectedSkills, draftMode);
    await this.alternativeLabelRepository.deleteManyForSkills(selectedSkills, draftMode);
    await this.catalogs2SkillsRepository.deleteManyForSkills(selectedSkills, draftMode);

    await super.deleteManyByData(skills, draftMode);
  }
}
