import { CsvParser } from "test-commons";
import { testEnvironment, EntityRepositoryGetterMap } from "../utils";
import { assert } from "chai";

var csvParser = new CsvParser();
var filesToUpload: { TableName: string; FilePath: string }[];

setTimeout(async function () {

    const environment = await testEnvironment.getEnvironment();
    filesToUpload = await csvParser.parseFile('../demoDataVariant/' + environment.dataVariant + '/config/UploadCSVtoDBTables.csv', ',');

    describe('Upload CSV Data to DB Tables', async function () {

        filesToUpload.forEach(function (fileToUpload) {
            it('Uploading data to ' + fileToUpload.TableName + ' from ' + fileToUpload.FilePath, async function () {
                this.timeout(10*60*1000);
                var entityRepository = await testEnvironment[EntityRepositoryGetterMap[fileToUpload.TableName]]();
                assert.isOk(entityRepository, ' getter method for corresponding entityRepository is not maintained in idenx.ts')
                var entityData = await csvParser.parseFile('../demoDataVariant/' + environment.dataVariant + '/data/' + fileToUpload.FilePath, ',');
                assert.isNotEmpty(entityData, 'Could not parse file ');
                try {
                    await entityRepository.insertMany(entityData);
                } catch (e) {
                    assert.isNotOk(e, ' Data could not be inserted in DB');
                }
            });
        });
    });
    run();
}, 3000);