import { v4 as uuid } from 'uuid';
import { EntityFieldMapping } from './EntityFieldMapping';
import { CsvParser } from 'test-commons';

export class Uniquifier {
    private generatedUUIDRepository: Map<string, string>;
    private csvParser: CsvParser;

    public constructor() {
        this.generatedUUIDRepository = new Map<string, string>();
        this.csvParser = new CsvParser();
    }

    public async getRecords(csvPath: string, entityName: string): Promise<any> {

        let entityRecordsFromCSV: any[] = await this.csvParser.parseFile(csvPath, ',');
        let entityFieldsToUniquify: string[] = this.getEntityFieldsToUniquify(entityName);

        if (entityFieldsToUniquify.length != 0) {
            entityRecordsFromCSV.forEach((recordFromCsv: any) => {
                entityFieldsToUniquify.forEach(fieldToUniquify => {
                    if (!this.generatedUUIDRepository.has(recordFromCsv[fieldToUniquify])) {
                        this.generatedUUIDRepository.set(recordFromCsv[fieldToUniquify], uuid());
                    }
                    recordFromCsv[fieldToUniquify] = this.generatedUUIDRepository.get(recordFromCsv[fieldToUniquify]);
                    if (entityName == 'ResourceRequest' && fieldToUniquify == 'ID') {
                        recordFromCsv['displayId'] = recordFromCsv[fieldToUniquify].substring(recordFromCsv[fieldToUniquify].length - 10);
                    }
                })
            })
        }
        return entityRecordsFromCSV;
    }

    public getEntityFieldsToUniquify(entityName: string): string[] {
        let entityFieldsToUniquify: string[] = [];
        for (let i = 0; i < EntityFieldMapping.length; i++) {
            if (EntityFieldMapping[i].entityName == entityName) {
                entityFieldsToUniquify = EntityFieldMapping[i].entityFieldsToUniquify;
                break;
            }
        }
        return entityFieldsToUniquify;
    }
}