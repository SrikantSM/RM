import { StatementExecutor } from './StatementExecutor';
import { SqlGenerator } from './SqlGenerator';

export abstract class DataQueryBaseRepository<T> {
  public constructor(readonly statementExecutor: StatementExecutor, readonly sqlGenerator: SqlGenerator) { }

  public async selectAllByData(entities: Partial<T>[]): Promise<T[]> {
    return this.selectByData([...this.attributeNames.keys()], entities) as Promise<T[]>; // we know that this is total
  }

  public async selectByData(attributeList: string[], entities: Partial<T>[]): Promise<Partial<T>[]> {
    const whereClause = this.sqlGenerator.generateWhereConditionForData(this.attributeNames, entities);
    const selectStatement = `${this.sqlGenerator.generateSelectStatement(this.tableName, attributeList, whereClause)}`;

    return this.normalizeColumnNames(await this.statementExecutor.execute(selectStatement));
  }

  normalizeColumnNames(results: any[]): Partial<T>[] {
    const attributeNames = [...this.attributeNames.keys()];
    return results.map((result) => Object.entries(result).reduce(
      (acc, [key, value]) => ({
        [this.sqlGenerator.convertFromColumnName(key, attributeNames)]: value,
        ...acc,
      } as Partial<T>),
      {},
    ));
  }

  abstract get tableName(): string;

  abstract get attributeNames(): Map<string, string>;
}
