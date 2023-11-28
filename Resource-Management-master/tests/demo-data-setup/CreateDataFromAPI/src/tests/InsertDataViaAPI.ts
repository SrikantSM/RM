import { testEnvironment } from "../utils";
import { CsvParser } from "test-commons";
import * as serviceClasses from '../serviceClasses';

var getServiceInstance = function (className: string): any {
    return new (<any>serviceClasses)[className]();
}

var csvParser = new CsvParser();

setTimeout(async function () {

    const environment = await testEnvironment.getEnvironment();
    var domainScope = process.env.DOMAIN || 'Assignment';
    var apiList: { 'complex': string, 'service': string, 'api': string, payloadFilePath: string }[] = await csvParser.parseFile('../demoDataVariant/' + environment.dataVariant + '/config/' + domainScope + 'APIList.csv', ',');
    if(!apiList.length) {
        run();
    }
    var testRun = 0;
    apiList.forEach(async function (api) {
        var serviceInstance = getServiceInstance(api.service);
        await serviceInstance.setup();
        const payloadList: Object[] = await csvParser.parseFile('../demoDataVariant/' + environment.dataVariant + '/data/' + api.payloadFilePath, ',');
        testRun += 1;
        describe(testRun + '. Calling API ' + api.service + "." + api.api, function () {
            payloadList.forEach(payload => {
                it('Call API with payload (' + JSON.stringify(payload) + ') ', function () {
                    this.timeout(5000);
                    serviceInstance.runAPIs(payload);
                });
            });
        });
        if(testRun === apiList.length) {
            run();
        }
    });
}, 3000);