import { promises as fs } from 'fs';
import { v4 as uuid } from 'uuid';

import csv = require('fast-csv');

/**
 * Class to parse entities contained in a CSV file.
 */
export class CsvParser {
  /**
   * Reads a file, parses the content, and transforms the result to T
   *
   * Placeholders defined with {uuid()} will be replaced by a dynamically generated UUID
   *
   * @param {string} filePath path to the CSV file to read and parse
   * @param {string} delimiter delimiter to separate columns (default is ',')
   * @param {string} testRunId generated UUID provided by class TestHelper added to values of UI relevant fields
   * @returns {Promise<T[]>} representing the data contained in the CSV file
   */
  public async parseFile<T>(filePath: string, delimiter: string = ',', testRunId?: string): Promise<T[]> {
    let fileContent = await fs.readFile(filePath, 'utf-8');
    fileContent = fileContent.replace(/\{uuid\(\)\}/g, () => uuid());
    if (testRunId) {
      fileContent = fileContent.replace(/\{testRunId\}/g, testRunId);
    }

    return new Promise(
      (resolve, reject) => {
        const rows: any = [];
        const stream = csv
          .parse({
            objectMode: true,
            delimiter,
            quote: '"',
            ignoreEmpty: true,
            trim: true,
            headers: true,
          })
          .on('error', (error: Error) => reject(error))
          .on('data', (row: csv.ParserRow) => rows.push(row))
          .on('end', () => resolve(rows));

        stream.write(fileContent);
        stream.end();
      },
    );
  }
}
