const xmlhttprequest = require('xmlhttprequest');
const fs = require('fs');
class SupaHelper {
    constructor() {
        this.baseUrl = 'http://localhost:8080/supa';
        this.sleepTime = browser.testrunner.config.params.stopSleepTime;
    }

    sendRequest(endPoint) {
        const url = this.baseUrl + endPoint;
        console.log("Calling: " + url);
        var XMLHttpRequest = xmlhttprequest.XMLHttpRequest;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, false);
        xmlHttp.send();
        console.log("Response Status: " + xmlHttp.status);
        console.log("Response Text: " + xmlHttp.responseText);
        return xmlHttp;
    }

    sendPOSTRequest(endPoint, content) {
        const url = this.baseUrl + endPoint;
        console.log("Calling: " + url);
        var XMLHttpRequest = xmlhttprequest.XMLHttpRequest;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", url, false);
        xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlHttp.send(content);
        console.log("Response Status: " + xmlHttp.status);
        console.log("Response Text: " + xmlHttp.responseText);
        return xmlHttp;
    }

    configureSupa(cfgFile) {
        console.log('Configure SUPA with file: ' + cfgFile);
        return this.sendRequest('/configure?_config_file=' + cfgFile).status;
    }

    getSupaState() {
        const supaState = this.sendRequest('/getState').responseText;
        console.log('SUPA state: ' + supaState);
        return supaState;
    }

    startSupaMeasurement(stepName) {
        console.log('Start SUPA measurement for step: ' + stepName);
        this.sendRequest('/startMeasurement?step=' + stepName);
    }

    stopSupaMeasurement(sleepTime) {
        sleepTime = sleepTime || this.sleepTime;
        this.sleep(sleepTime);
        console.log('Stop SUPA measurement');
        this.sendRequest('/stopMeasurement');
    }

    finishMeasurement() {
        console.log('Finish measurement');
        this.sendRequest('/finish');
    }

    uploadToIPA(ipaProject, ipaScenario, ipaVariant, ipaRelease, ipaComment, ipaUser, ipaPassword) {
        console.log('IPA Upload');
        var poststr = 'project=' + ipaProject + '&scenario=' + ipaScenario + '&variant=' + ipaVariant + '&release=' + ipaRelease + '&comment=' + ipaComment + '&username=' + ipaUser + '&password=' + ipaPassword;
        return this.sendPOSTRequest('/uploadResultEx', poststr).status;
    }

    exitSupa() {
        console.log('Exit SUPA');
        this.sendRequest('/exit');
    }

    sleep(delay) {
        // disabled radix check to use default value
        // eslint-disable-next-line radix
        delay = parseInt(delay);
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay){
            //wait
        }
    }

    addDynamicData(cfgFile, key, value) {
        console.log("Adding '" + key + "' to supa config file.");
        fs.appendFileSync(cfgFile,"\n" + key + " = " + value );
        console.log("Added  '" + key + "' to supa config file!");
    }

    generateSupaExcel() {
        console.log('Generate SUPA Excel');
        this.sendRequest('/generateExcel');
    }
}

module.exports = { SupaHelper };
