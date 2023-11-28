import {
  HanaSqlGenerator, SqlGenerator, StatementExecutor, TYPE_STRING,
} from '../../../utils';
import { DraftEnabledEntityRepository } from '../../DraftEnabledEntityRepository';
import { EntityDraftMode } from '../../EntityDraftMode.enum';
import { Catalog } from './Catalog';
import { Catalogs2SkillsRepository } from './Catalogs2SkillsRepository';

export class CatalogRepository extends DraftEnabledEntityRepository<Catalog> {
  public constructor(statementExecutor: StatementExecutor, readonly catalogs2SkillsRepository: Catalogs2SkillsRepository, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_SKILL_CATALOGS';
  }

  get draftTableName(): string {
    return 'CATALOGSERVICE_CATALOGS_DRAFTS';
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
    ]);
  }

  public async deleteMany(catalogs: Catalog[], draftMode: EntityDraftMode = EntityDraftMode.BOTH): Promise<any> {
    await this.catalogs2SkillsRepository.deleteManyForCatalogs(catalogs, draftMode);

    await super.deleteMany(catalogs, draftMode);
  }
}
