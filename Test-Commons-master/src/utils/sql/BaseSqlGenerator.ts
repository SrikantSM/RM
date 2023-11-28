import { SqlGenerator } from './SqlGenerator';

export abstract class BaseSqlGenerator implements SqlGenerator {
  public abstract generateInsertStatement(tableName: string, attributes: Map<string, string>, entities: any[]): string;

  public generateDeleteStatement(tableName: string, whereClause: string): string {
    return `DELETE FROM ${tableName} ${whereClause}`;
  }

  public generateUpdateStatement(tableName: string, attributeName: string, value: any, whereClause: string): string {
    return `UPDATE ${tableName} SET ${attributeName} = ${value} ${whereClause}`;
  }

  public generateSelectStatement(tableName: string, attributeNames: string[], whereClause?: string): string {
    if (whereClause === undefined) {
      return `SELECT ${attributeNames.join(', ')} FROM ${tableName}`;
    }
    return `SELECT ${attributeNames.join(', ')} FROM ${tableName} ${whereClause}`;
  }

  public generateSelectUnion(firstSelectStatement: string, secondSelectStatement: string): string {
    return `${firstSelectStatement} UNION ${secondSelectStatement}`;
  }

  public generateWhereEqualsClause(attributeName: string, attributeType: string | undefined, entities: any[]): string {
    if (entities.length === 0) {
      return 'WHERE 0 = 1';
    }

    const expressions = entities.map((entity) => {
      const keyValue = this.getLiteralForType(this.getValue(entity, attributeName), attributeType);
      return `${this.convertToColumnName(attributeName)} = ${keyValue}`;
    });

    return `WHERE ${expressions.join(' OR ')}`;
  }

  public generateWhereConditionForData(attributeNames: Map<string, string>, entities: any[]): string {
    if (entities.length === 0) {
      return 'WHERE 0 = 1';
    }

    const expressions = entities.map((entity) => {
      const intermediateExpression: string[] = [];
      for (const [key, value] of Object.entries(entity)) {
        const keyValue = this.getLiteralForType(value, attributeNames.get(key));
        intermediateExpression.push(`${this.convertToColumnName(key)} = ${keyValue}`);
      }
      return `( ${intermediateExpression.join(' AND ')} )`;
    });

    return `WHERE ${expressions.join(' OR ')}`;
  }

  public generateWhereInClause(attributeName: string, subSelectStatement: string): string {
    return `WHERE ${attributeName} IN (${subSelectStatement})`;
  }

  public convertToColumnName(attributeName: string): string {
    return attributeName.toUpperCase();
  }

  public convertFromColumnName(columnName: string, attributeNames: string[]): string {
    return attributeNames.find((name) => name.toLowerCase() === columnName.toLowerCase()) || columnName;
  }

  getValue(entity: any, attributeName: string): any {
    if (entity === null || entity === undefined) {
      return null;
    }
    if (entity[attributeName] !== null && entity[attributeName] !== undefined) {
      return entity[attributeName];
    }
    if (entity[this.convertToColumnName(attributeName)] !== null && entity[this.convertToColumnName(attributeName)] !== undefined) {
      return entity[this.convertToColumnName(attributeName)];
    }
    return null;
  }

  abstract getLiteralForType(value: any, type?: string): string;

  public generateDeleteAllStatement(tableName: string): string {
    return `DELETE FROM ${tableName}`;
  }
}
