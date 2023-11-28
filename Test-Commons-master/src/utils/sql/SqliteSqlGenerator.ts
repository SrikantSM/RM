import { EOL } from 'os';
import {
  TYPE_BOOLEAN, TYPE_NUMBER, TYPE_STRING, TYPE_TIMESTAMP, TYPE_BINARY,
} from '../ColumnTypes';
import { BaseSqlGenerator } from './BaseSqlGenerator';

export class SqliteSqlGenerator extends BaseSqlGenerator {
  public generateInsertStatement(tableName: string, attributes: Map<string, string>, entities: any[]): string {
    if (entities.length === 0) {
      return '';
    }

    const columnNames = Array.from(attributes.keys()).map(this.convertToColumnName);

    const insertStatements = entities
      .map((entity) => {
        const values = Array.from(attributes.entries())
          .map(([name, type]: string[]) => this.getLiteralForType(this.getValue(entity, name), type));
        return `INSERT INTO ${tableName} (${columnNames.join(', ')}) VALUES (${values.join(', ')})`;
      });

    return insertStatements.join(`;${EOL}`);
  }

  private formatDate(date: Date): string {
    return `'${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}'`;
  }

  getLiteralForType(value: any, type?: string): string {
    switch (type) {
      case TYPE_BOOLEAN:
        if (value === true) {
          return '1';
        }
        return '0';
      case TYPE_TIMESTAMP:
        if (value === undefined || value === null) {
          return 'NULL';
        }
        if ((typeof value === 'string' || value instanceof Date) && !Number.isNaN(new Date(value).getTime())) {
          return this.formatDate(new Date(value));
        }
        throw new Error('Invalid Date');
      case TYPE_NUMBER:
        if (value === undefined || value === null) {
          return 'NULL';
        }
        return `${value}`;
      case TYPE_STRING:
        if (value !== undefined && value !== null) {
          const cast = `${value}`; // explicitly cast to string
          return `'${cast.replace(/'/g, '\'\'')}'`; // escape single quotes
        }
        return 'NULL';
      case TYPE_BINARY:
        if (value !== undefined && value !== null) {
          const cast = `${value}`; // explicitly cast to string
          return `X'${cast.replace(/'/g, '\'\'')}'`; // escape single quotes
        }
        return 'NULL';
      default:
        if (value !== undefined && value !== null) {
          return `'${value}'`;
        }
        return 'NULL';
    }
  }
}
