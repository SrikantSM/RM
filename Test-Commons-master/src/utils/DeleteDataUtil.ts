import { HanaSqlGenerator, SqlGenerator, StatementExecutor } from './sql';

export class DeleteDataUtil {
  public constructor(
    readonly statementExecutor: StatementExecutor,
    readonly sqlGenerator: SqlGenerator = new HanaSqlGenerator(),
  ) {}

  public async deleteDataFromDBTables(tableNames: string[]): Promise<any> {
    const promises = tableNames.map((tableName) => this.statementExecutor.execute(
      this.sqlGenerator.generateDeleteAllStatement(tableName),
    ));
    return Promise.all(promises);
  }
}
