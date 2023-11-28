import { StatementExecutor, SqlGenerator, DataQueryBaseRepository } from '../utils';

export abstract class ViewRepository<T> extends DataQueryBaseRepository<T> {
  public constructor(readonly statementExecutor: StatementExecutor, readonly sqlGenerator: SqlGenerator) {
    super(statementExecutor, sqlGenerator);
  }

  public async selectAll(): Promise<T[]> {
    const selectStatement = `${this.sqlGenerator.generateSelectStatement(this.tableName, [...this.attributeNames.keys()])}`;

    return this.normalizeColumnNames(await this.statementExecutor.execute(selectStatement)) as T[]; // we know that this is total
  }
}
