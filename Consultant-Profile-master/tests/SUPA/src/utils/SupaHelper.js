const xmlhttprequest = require('xmlhttprequest');
const fs = require('fs');

class SupaHelper {
    constructor() {
        this.baseUrl = 'http://localhost:8080/supa';
        this.sleepTime = browser.testrunner.config.params.stopSleepTime;
    }

    sendRequest(endPoint) {
        const url = this.baseUrl + endPoint;
        console.log(`Calling: ${url}`);
        const { XMLHttpRequest } = xmlhttprequest;
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', url, false);
        xmlHttp.send();
        console.log(`Response Status: ${xmlHttp.status}`);
        console.log(`Response Text: ${xmlHttp.responseText}`);
        return xmlHttp;
    }

    sendPOSTRequest(endPoint, content) {
        const url = this.baseUrl + endPoint;
        console.log(`Calling: ${url}`);
        const { XMLHttpRequest } = xmlhttprequest;
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open('POST', url, false);
        xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlHttp.send(content);
        console.log(`Response Status: ${xmlHttp.status}`);
        console.log(`Response Text: ${xmlHttp.responseText}`);
        return xmlHttp;
    }

    configureSupa(cfgFile) {
        console.log(`Configure SUPA with file: ${cfgFile}`);
        this.sendRequest(`/configure?_config_file=${cfgFile}`);
    }

    getSupaState() {
        const supaState = this.sendRequest('/getState').responseText;
        console.log(`SUPA state: ${supaState}`);
        return supaState;
    }

    startSupaMeasurement(stepName) {
        console.log(`Start SUPA measurement for step: ${stepName}`);
        this.sendRequest(`/startMeasurement?step=${stepName}`);
    }

    stopSupaMeasurement(sleepTime) {
        console.log('Stop SUPA measurement start time: ', new Date().toLocaleTimeString());
        sleepTime = sleepTime || this.sleepTime;
        this.sleep(sleepTime);
        console.log('After sleep in stopSupaMeasurement: ', new Date().toLocaleTimeString());
        this.sendRequest('/stopMeasurement');
    }

    finishMeasurement() {
        console.log('Finish measurement');
        this.sendRequest('/finish');
    }

    uploadToIPA(ipaProject, ipaScenario, ipaVariant, ipaRelease, ipaComment, ipaUser, ipaPassword) {
        console.log('IPA Upload');
        const poststr = `project=${ipaProject}&scenario=${ipaScenario}&variant=${ipaVariant}&release=${ipaRelease}&comment=${ipaComment}&username=${ipaUser}&password=${ipaPassword}`;
        this.sendPOSTRequest('/uploadResultEx', poststr);
    }

    exitSupa() {
        console.log('Exit SUPA');
        this.sendRequest('/exit');
    }

    sleep(delay) {
        delay = parseInt(delay, 10);
        const start = new Date().getTime();
        while (new Date().getTime() < start + delay);
    }

    addCredentials(cfgFile, key, value) {
        console.log(`Adding '${key}' to supa config file.`);
        fs.appendFileSync(cfgFile, `${key} = ${value}\n`);
        console.log(`Added  '${key}' to supa config file!`);
    }
}

module.exports = { SupaHelper };
