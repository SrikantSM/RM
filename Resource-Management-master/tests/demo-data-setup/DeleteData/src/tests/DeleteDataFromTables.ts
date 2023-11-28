import { CsvParser, DeleteDataUtil, HanaSqlGenerator } from "test-commons";
import { testEnvironment } from "../utils";
import { assert } from "chai";

var csvParser = new CsvParser();
var deleteDataUtil: DeleteDataUtil;

setTimeout(async function () {

    const environment = await testEnvironment.getEnvironment();
    var deleteTablesList: { 'TableName': string }[] = await csvParser.parseFile('../demoDataVariant/' + environment.dataVariant + '/config/CleanDBTables.csv', ',');
    const databaseClient = await testEnvironment.getDatabaseClient();
    const SqlGenerator = new HanaSqlGenerator();
    deleteDataUtil = new DeleteDataUtil(databaseClient, SqlGenerator);

    describe('Delete Data from Tables', async function () {

        deleteTablesList.forEach(function (tableToClean) {
            it('Deleting data from ' + tableToClean.TableName, async function () {
                this.timeout(5000);
                let deleteResponse = await deleteDataUtil.deleteDataFromDBTables([tableToClean.TableName]);
                assert.isAtLeast(deleteResponse[0], 0, 'Could not delete data from table  ' + tableToClean);
            });
        });
    });
    run();
}, 3000);