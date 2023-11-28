export interface StatementExecutor {
  execute(statement: string): Promise<any>;
  prepare(statement: string): Promise<any>;
  tx<T>(task: () => Promise<T>): Promise<T>;
}
