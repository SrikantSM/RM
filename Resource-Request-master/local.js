const fs = require('fs');
const {
    exec
} = require('child_process');
const path = require('path');

main();

async function main() {
    try {
      console.log('Setting up the local configuration');
      await writeDatabaseEnvironmentVariablesToFile(getDatabaseDeployerName(), 'db/default-env.json');
      await writeServiceEnvironmentVariablesToFile(getServiceAppName(), 'srv/default-env.json');
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  async function writeDatabaseEnvironmentVariablesToFile(appName, filename) {
    const environment = await readEnvironmentVariables(appName);
  
    // Necessary changes to work locally as described in https://github.wdf.sap.corp/xs2/hdideploy.js/issues/533
    delete environment.VCAP_SERVICES.hana[0].credentials.certificate;
    environment.VCAP_SERVICES.hana[0].credentials.encrypt = true;
  
    writeEnvironmentVariablesToFile(environment, filename);
  }
  
  async function writeServiceEnvironmentVariablesToFile(appName, filename) {
    const environment = await readEnvironmentVariables(appName);
  
    writeEnvironmentVariablesToFile(environment, filename);
  }
  
  async function writeEnvironmentVariablesToFile(environment, filename) {
    const environmentVariables = {};
    environmentVariables['VCAP_SERVICES'] = environment.VCAP_SERVICES;
    environmentVariables['VCAP_APPLICATION'] = environment.VCAP_APPLICATION;
    const stringifiedEnvironment = JSON.stringify(environmentVariables, null, 2);
  
    console.info('Writing default environment to file:', filename);
    ensureDirectoryExists(filename);
    fs.writeFileSync(filename, stringifiedEnvironment);
  }
  
  async function readEnvironmentVariables(appName) {
    let promise = new Promise(function (resolve, reject) {
      exec('cf env ' + appName, (err, stdout, stderr) => {
        if (err) {
          return reject(err);
        }
        const trimmed = stdout.replace(/[\n\r]/g, '').trim();
        const VCAP_SERVICES = JSON.parse(/"VCAP_SERVICES": ([\s\S]*}\s*]\s*}\s*)\s*}/.exec(trimmed)[1]);
        const VCAP_APPLICATION = JSON.parse(/"VCAP_APPLICATION": ([\s\S]*}\s*)\s*}/.exec(trimmed)[1]);
        let destinations = /destinations:(\s*\[[\s\S]*}\s*\])/.exec(trimmed);
        if (destinations != null) {
          destinations = JSON.parse(destinations[1]);
        }
        resolve({ VCAP_SERVICES, VCAP_APPLICATION, destinations });
      })
    });
    return promise;
  }
  
  function getDatabaseDeployerName() {
    const fileContent = fs.readFileSync('mta.yaml', 'utf8');
    const result = /^ *- name: ([\S]*)((?!- name).|((\n|(\r\n)|\r)))*type: hdb$/gm.exec(fileContent)[1];
    return result;
  }
  
  function getServiceAppName() {
    const fileContent = fs.readFileSync('mta.yaml', 'utf8');
    const result = /^ *- name: ([\S]*)((?!- name).|((\n|(\r\n)|\r)))*type: java$/gm.exec(fileContent)[1];
    return result;
  }
  
  function ensureDirectoryExists(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return;
    }
    ensureDirectoryExists(dirname);
    fs.mkdirSync(dirname);
  }