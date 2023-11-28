import { StatementExecutor } from './sql';

export class SessionVariableProcessor {
  public constructor(readonly statementExecutor: StatementExecutor) { }

  public async set(sessionVariable: string, sessionVariableValue: string) {
    const setSessionVariableStatement = `SET SESSION '${sessionVariable}'='${sessionVariableValue}'`;
    return this.statementExecutor.execute(setSessionVariableStatement);
  }

  public async unSet(sessionVariable: string) {
    const unSetSessionVariableStatement = `UNSET SESSION '${sessionVariable}'`;
    return this.statementExecutor.execute(unSetSessionVariableStatement);
  }
}
