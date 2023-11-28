import { SqlGenerator, StatementExecutor, DataQueryBaseRepository } from '../utils';

export abstract class EntityRepository<T> extends DataQueryBaseRepository<T> {
  protected readonly defaultBatchSize: number = 1000;

  public constructor(readonly statementExecutor: StatementExecutor, readonly sqlGenerator: SqlGenerator) {
    super(statementExecutor, sqlGenerator);
  }

  public async insertOne(entity: T): Promise<any> {
    return this.insertMany([entity]);
  }

  public async insertMany(entities: T[], batchSize: number = this.defaultBatchSize): Promise<any> {
    const statements = [];
    for (let i = 0; i < entities.length; i += batchSize) {
      const insertStatement = `${this.sqlGenerator.generateInsertStatement(this.tableName, this.attributeNames, entities.slice(i, i + batchSize))};`;
      statements.push(insertStatement);
    }
    return this.executeAllStatements(statements);
  }

  public async deleteOne(entity: T): Promise<any> {
    return this.deleteMany([entity]);
  }

  public async deleteMany(entities: T[], batchSize: number = this.defaultBatchSize): Promise<any> {
    const statements = [];
    for (let i = 0; i < entities.length; i += batchSize) {
      const whereClause = this.sqlGenerator.generateWhereEqualsClause(this.keyAttributeName, this.attributeNames.get(this.keyAttributeName), entities.slice(i, i + batchSize));
      const deleteStatement = `${this.sqlGenerator.generateDeleteStatement(this.tableName, whereClause)};`;
      statements.push(deleteStatement);
    }
    return this.executeAllStatements(statements);
  }

  public async deleteManyByData(entities: T[], batchSize: number = this.defaultBatchSize): Promise<any> {
    const statements = [];
    for (let i = 0; i < entities.length; i += batchSize) {
      const whereClause = this.sqlGenerator.generateWhereConditionForData(this.attributeNames, entities.slice(i, i + batchSize));
      const deleteStatement = `${this.sqlGenerator.generateDeleteStatement(this.tableName, whereClause)}`;
      statements.push(deleteStatement);
    }
    return this.executeAllStatements(statements);
  }

  protected async executeAllStatements(statements: string[]) {
    const executeResults = Promise.all(statements.map(async (statement) => {
      const executeResult = await this.statementExecutor.execute(statement)
        .catch((error) => { console.error(error); throw error; });
      return executeResult;
    }));
    return executeResults;
  }

  abstract get keyAttributeName(): string;
}
