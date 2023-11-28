import {
  TYPE_BOOLEAN, TYPE_STRING, TYPE_TIMESTAMP, TYPE_BINARY,
} from '../ColumnTypes';
import { BaseSqlGenerator } from './BaseSqlGenerator';

export class HanaSqlGenerator extends BaseSqlGenerator {
  public generateInsertStatement(tableName: string, attributes: Map<string, string>, entities: any[]): string {
    if (entities.length === 0) {
      return '';
    }

    const dummySelectStatement = entities
      .map((entity) => `SELECT ${this.generateAsClauses(attributes, entity).join(', ')} FROM DUMMY`)
      .reduce((acc, cur) => (acc === '' ? cur : this.generateSelectUnion(acc, cur)), '');

    const columnNames = Array.from(attributes.keys()).map(this.convertToColumnName);

    const statement = `INSERT INTO ${tableName}
      (${columnNames.join(', ')})
      (${dummySelectStatement})`;

    return statement;
  }

  private generateAsClauses(attributeNames: Map<string, string>, entity: any): string[] {
    const attributeValues = Array.from(attributeNames.entries())
      .map(([name, type]: string[]) => ([name, type, this.getValue(entity, name)]));

    return attributeValues.map(([key, type, value]: string[]) => `${this.getLiteralForType(value, type)} AS ${this.convertToColumnName(key)}`);
  }

  private formatDate(date: Date): string {
    return `'${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}.${date.getUTCMilliseconds()}'`;
  }

  getLiteralForType(value: any, type?: string): string {
    switch (type) {
      case TYPE_BOOLEAN:
        if (value === true || value === 'true' || value === 'TRUE') {
          return 'TRUE';
        }
        if (value === false || value === 'false' || value === 'FALSE') {
          return 'FALSE';
        }
        return 'NULL';
      case TYPE_TIMESTAMP:
        if (value === undefined || value === null) {
          return 'NULL';
        }
        if ((typeof value === 'string' || value instanceof Date) && !Number.isNaN(new Date(value).getTime())) {
          return this.formatDate(new Date(value));
        }
        throw new Error('Invalid Date');
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
