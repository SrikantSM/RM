const xmlhttprequest = require('xmlhttprequest');
const fs = require('fs');

module.exports = class SupaHelper {
  constructor(measuringEnabled) {
    this.baseUrl = 'http://localhost:8080/supa';
    this.defaultSleepTime = Number(browser.testrunner.config.params.stopSleepTime);
    this.measuringEnabled = !!measuringEnabled;
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

  /**
   * Measure different metrics with SUPA while functionToMeasure is executed. Won't measure anything if measuring was not
   * enabled for this SUPA Helper instance.
   *
   * @param {String} stepName the corresponding step name as defined in the SUPA properties file
   * @param {Function} functionToMeasure Ideally a single uiveri5 action like .click() to measure
   * @param {Number} timeToWaitMs optional parameter which can be used to terminate the measurement after a given duration in milliseconds.
   *   A default waiting time will be used if not given which should be sufficient in most cases.
   * @returns {Promise<void>} with no value which resolves after the function is executed and the measurement is stopped
   */
  async measureIfRequired(stepName, functionToMeasure, timeToWaitMs) {
    if (this.measuringEnabled) {
      this.startSupaMeasurement(stepName);
    }
    await functionToMeasure();
    if (this.measuringEnabled) {
      await this.stopSupaMeasurement(timeToWaitMs);
    }
  }

  startSupaMeasurement(stepName) {
    this.sendRequest(`/startMeasurement?step=${stepName}`);
    this.measurementStartTime = Date.now();
    console.log(`Started SUPA measurement for step: ${stepName}`);
  }

  async stopSupaMeasurement(timeToWaitMs = this.defaultSleepTime) {
    if (timeToWaitMs > 0) {
      await this.sleep(timeToWaitMs);
    }
    console.log(`Stopping SUPA measurement after ${Date.now() - this.measurementStartTime} ms`);
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

  async sleep(sleepTime) {
    return new Promise((resolve) => setTimeout(resolve, sleepTime));
  }

  generateSupaExcel() {
    console.log('Generate SUPA Excel');
    this.sendRequest('/generateExcel');
  }

  addCredentials(cfgFile, key, value) {
    console.log(`Adding '${key}' to supa config file.`);
    fs.appendFileSync(cfgFile, `${key} = ${value}\n`);
    console.log(`Added  '${key}' to supa config file!`);
  }
};
