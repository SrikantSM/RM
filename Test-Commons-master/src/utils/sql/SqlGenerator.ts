export interface SqlGenerator {
  generateInsertStatement(tableName: string, attributes: Map<string, string>, entities: any[]): string;
  generateDeleteStatement(tableName: string, whereClause: string): string;
  generateSelectStatement(tableName: string, attributeNames: string[], whereClause?: string): string;
  generateUpdateStatement(tableName: string, attributeName: string | undefined, value: any, whereClause: string): string;

  generateSelectUnion(firstSelectStatement: string, secondSelectStatement: string): string;
  generateWhereEqualsClause(attributeName: string, attributeType: string | undefined, entities: any[]): string;
  generateWhereConditionForData(attributeNames: Map<String, String>, entities: any[]): string;
  generateWhereInClause(attributeName: string, subSelectStatement: string): string;
  generateDeleteAllStatement(tableName: string): string;

  convertToColumnName(attributeName: string): string;
  convertFromColumnName(columnName: string, attributeNames: string[]): string;
}
