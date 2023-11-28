import { promises as fs } from 'fs';
import { EOL } from 'os';
import { StatementExecutor } from './sql/StatementExecutor';

export class StatementFileWriter implements StatementExecutor {
  constructor(private readonly filePath: string) {
  }

  public async clearFile() {
    await fs.writeFile(this.filePath, '');
  }

  public async execute(statement: string): Promise<any> {
    return this.appendFile(statement);
  }

  public async prepare(statement: string): Promise<any> {
    return this.appendFile(statement);
  }

  public async tx<T>(task: () => Promise<T>): Promise<T> {
    console.warn('Transactions are not supported by the StatementFileWriter, task is executed without any transaction handling');
    return task();
  }

  private async appendFile(statement: string): Promise<any> {
    await fs.writeFile(this.filePath, statement + EOL, { flag: 'a' });
  }
}
