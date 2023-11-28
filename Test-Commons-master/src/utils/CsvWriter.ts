import csvWriter = require('fast-csv');
import fs = require('fs');

export class CsvWriter {
  public createCsvFile(targetFilePath: string, data: any) {
    const ws: fs.WriteStream = fs.createWriteStream(targetFilePath);

    return new Promise(
      (resolve, reject) => {
        csvWriter
          .write(data, { headers: true })
          .pipe(ws)
          .on('finish', resolve)
          .on('error', reject);
      },
    );
  }
}
