import { v4 as uuid } from 'uuid';
import {
  SqlGenerator, TYPE_BOOLEAN, TYPE_STRING, TYPE_TIMESTAMP, StatementExecutor,
} from '../utils';
import { EntityRepository } from './EntityRepository';
import { EntityDraftMode } from './EntityDraftMode.enum';

export abstract class DraftEnabledEntityRepository<T> extends EntityRepository<T> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator) {
    super(statementExecutor, sqlGenerator);
  }

  public async insertOne(entity: T, draftMode: EntityDraftMode = EntityDraftMode.ACTIVE_ONLY, draftAdministrativeUser: string | null = null): Promise<any> {
    return this.insertMany([entity], draftMode, draftAdministrativeUser);
  }

  public async insertMany(entities: T[], draftMode: EntityDraftMode = EntityDraftMode.ACTIVE_ONLY, draftAdministrativeUser: string | null = null, batchSize: number = this.defaultBatchSize): Promise<any> {
    if (draftMode === EntityDraftMode.ACTIVE_ONLY || draftMode === EntityDraftMode.BOTH) {
      await super.insertMany(entities, batchSize);
    }
    if (draftMode === EntityDraftMode.DRAFT_ONLY || draftMode === EntityDraftMode.BOTH) {
      const { draftEntities, draftAdministrativeData } = await this.createDraftData(entities, draftMode, draftAdministrativeUser);
      await this.insertDrafts(draftEntities, batchSize);
      await this.insertDraftAdministrativeData(draftAdministrativeData, batchSize);
    }
  }

  public async deleteOne(entity: T, draftMode: EntityDraftMode = EntityDraftMode.BOTH): Promise<any> {
    return this.deleteMany([entity], draftMode);
  }

  public async deleteMany(entities: T[], draftMode: EntityDraftMode = EntityDraftMode.BOTH, batchSize: number = this.defaultBatchSize): Promise<any> {
    if (draftMode === EntityDraftMode.DRAFT_ONLY || draftMode === EntityDraftMode.BOTH) {
      await this.deleteDraftAdministrativeData(entities, batchSize);
      await this.deleteDrafts(entities, batchSize);
    }
    if (draftMode === EntityDraftMode.ACTIVE_ONLY || draftMode === EntityDraftMode.BOTH) {
      await super.deleteMany(entities, batchSize);
    }
  }

  public async deleteManyByData(entities: T[], draftMode: EntityDraftMode = EntityDraftMode.BOTH, batchSize: number = this.defaultBatchSize): Promise<any> {
    if (draftMode === EntityDraftMode.DRAFT_ONLY || draftMode === EntityDraftMode.BOTH) {
      await this.deleteDraftAdministrativeDataByData(entities, batchSize);
      await this.deleteDraftsByData(entities, batchSize);
    }
    if (draftMode === EntityDraftMode.ACTIVE_ONLY || draftMode === EntityDraftMode.BOTH) {
      await super.deleteManyByData(entities, batchSize);
    }
  }

  public selectAllByData(entities: Partial<T>[], draftMode: EntityDraftMode = EntityDraftMode.ACTIVE_ONLY) {
    return this.selectByData([...this.attributeNames.keys()], entities, draftMode) as Promise<T[]>;
  }

  public async selectByData(attributeList: string[], entities: Partial<T>[], draftMode: EntityDraftMode = EntityDraftMode.ACTIVE_ONLY) {
    let selectedDataActive: Partial<T>[] = [];
    let selectedDataDraft: Partial<T>[] = [];
    if (draftMode === EntityDraftMode.ACTIVE_ONLY || draftMode === EntityDraftMode.BOTH) {
      selectedDataActive = await super.selectByData(attributeList, entities);
    }
    if (draftMode === EntityDraftMode.DRAFT_ONLY || draftMode === EntityDraftMode.BOTH) {
      const whereClause = this.sqlGenerator.generateWhereConditionForData(this.attributeNames, entities);
      const selectStatement = `${this.sqlGenerator.generateSelectStatement(this.draftTableName, attributeList, whereClause)}`;
      selectedDataDraft = this.normalizeColumnNames(await this.statementExecutor.execute(selectStatement));
    }
    return [...selectedDataActive, ...selectedDataDraft];
  }

  private async createDraftData(entities: any[], draftMode: EntityDraftMode, draftAdministrativeUser: string | null) {
    if (draftAdministrativeUser === null) {
      console.warn('When creating Drafts, you must provide a User owning the draft as last parameter');
    }

    const draftEntities: any[] = [];
    const draftAdministrativeData: any[] = [];

    for (const entity of entities) {
      let hasActiveEntity = draftMode === EntityDraftMode.BOTH;

      if (!hasActiveEntity) {
        const results = await this.selectByData([this.keyAttributeName], [{ [this.keyAttributeName]: entity[this.keyAttributeName] } as any]);
        hasActiveEntity = results.length > 0;
      }

      const draftUUID = uuid();
      draftEntities.push({
        ...entity,
        isActiveEntity: false,
        hasActiveEntity,
        hasDraftEntity: true,
        draftAdministrativeData_draftUUID: draftUUID,
      });
      draftAdministrativeData.push({
        draftUUID,
        createdByUser: draftAdministrativeUser,
        inProcessByUser: draftAdministrativeUser,
        creationDateTime: new Date(),
        lastChangedByUser: draftAdministrativeUser,
        lastChangeDateTime: new Date(),
      });
    }
    return { draftEntities, draftAdministrativeData };
  }

  private async insertDrafts(draftData: any[], batchSize: number = this.defaultBatchSize) {
    const statements = [];
    for (let i = 0; i < draftData.length; i += batchSize) {
      const insertStatement = `${this.sqlGenerator.generateInsertStatement(this.draftTableName, this.draftAttributeNames, draftData.slice(i, i + batchSize))};`;
      statements.push(insertStatement);
    }
    return this.executeAllStatements(statements);
  }

  private async insertDraftAdministrativeData(draftAdministrativeData: any[], batchSize: number = this.defaultBatchSize) {
    const statements = [];
    for (let i = 0; i < draftAdministrativeData.length; i += batchSize) {
      const insertStatement = `${this.sqlGenerator.generateInsertStatement(this.draftAdministrativeDataTableName, this.draftAdministrativeDataAttributeNames, draftAdministrativeData.slice(i, i + batchSize))};`;
      statements.push(insertStatement);
    }
    return this.executeAllStatements(statements);
  }

  private async deleteDrafts(draftData: T[], batchSize: number = this.defaultBatchSize): Promise<any> {
    const statements = [];
    for (let i = 0; i < draftData.length; i += batchSize) {
      const whereClause = this.sqlGenerator.generateWhereEqualsClause(this.keyAttributeName, this.attributeNames.get(this.keyAttributeName), draftData.slice(i, i + batchSize));
      const deleteStatement = `${this.sqlGenerator.generateDeleteStatement(this.draftTableName, whereClause)};`;
      statements.push(deleteStatement);
    }
    return this.executeAllStatements(statements);
  }

  private async deleteDraftsByData(draftData: T[], batchSize: number = this.defaultBatchSize): Promise<any> {
    const statements = [];
    for (let i = 0; i < draftData.length; i += batchSize) {
      const whereClause = this.sqlGenerator.generateWhereConditionForData(this.attributeNames, draftData.slice(i, i + batchSize));
      const deleteStatement = `${this.sqlGenerator.generateDeleteStatement(this.draftTableName, whereClause)};`;
      statements.push(deleteStatement);
    }
    return this.executeAllStatements(statements);
  }

  private async deleteDraftAdministrativeData(draftAdministrativeData: T[], batchSize: number = this.defaultBatchSize): Promise<any> {
    const statements = [];
    for (let i = 0; i < draftAdministrativeData.length; i += batchSize) {
      const subSelectStatement = this.sqlGenerator.generateSelectStatement(this.draftTableName, ['DRAFTADMINISTRATIVEDATA_DRAFTUUID'], this.sqlGenerator.generateWhereEqualsClause(this.keyAttributeName, this.attributeNames.get(this.keyAttributeName), draftAdministrativeData.slice(i, i + batchSize)));
      const whereClause = this.sqlGenerator.generateWhereInClause('DRAFTUUID', subSelectStatement);
      const deleteStatement = `${this.sqlGenerator.generateDeleteStatement(this.draftAdministrativeDataTableName, whereClause)};`;
      statements.push(deleteStatement);
    }
    return this.executeAllStatements(statements);
  }

  private async deleteDraftAdministrativeDataByData(draftAdministrativeData: T[], batchSize: number = this.defaultBatchSize): Promise<any> {
    const statements = [];
    for (let i = 0; i < draftAdministrativeData.length; i += batchSize) {
      const subSelectStatement = this.sqlGenerator.generateSelectStatement(this.draftTableName, ['DRAFTADMINISTRATIVEDATA_DRAFTUUID'], this.sqlGenerator.generateWhereConditionForData(this.attributeNames, draftAdministrativeData.slice(i, i + batchSize)));
      const whereClause = this.sqlGenerator.generateWhereInClause('DRAFTUUID', subSelectStatement);
      const deleteStatement = `${this.sqlGenerator.generateDeleteStatement(this.draftAdministrativeDataTableName, whereClause)};`;
      statements.push(deleteStatement);
    }
    return this.executeAllStatements(statements);
  }

  abstract get draftTableName(): string;

  get draftAttributeNames(): Map<string, string> {
    return new Map([
      ...this.attributeNames,
      ['isActiveEntity', TYPE_BOOLEAN],
      ['hasActiveEntity', TYPE_BOOLEAN],
      ['hasDraftEntity', TYPE_BOOLEAN],
      ['draftAdministrativeData_draftUUID', TYPE_STRING],
    ]);
  }

  get draftAdministrativeDataTableName(): string {
    return 'DRAFT_DRAFTADMINISTRATIVEDATA';
  }

  get draftAdministrativeDataAttributeNames(): Map<string, string> {
    return new Map([
      ['draftUUID', TYPE_STRING],
      ['createdByUser', TYPE_STRING],
      ['inProcessByUser', TYPE_STRING],
      ['creationDateTime', TYPE_TIMESTAMP],
      ['lastChangedByUser', TYPE_STRING],
      ['lastChangeDateTime', TYPE_TIMESTAMP],
    ]);
  }
}
