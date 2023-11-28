const { spawn } = require('child_process');
const fs = require('fs').promises;
const environment = require('./src/utils').testEnvironment.getEnvironment();

process.on('unhandledRejection', (up) => { throw up; });

async function main() {
  // Create temporary copies of the properties files so that the credentials are written to ignored versions
  const propertyFiles = ['F4704_Skill.properties'];
  for (const propertyFile of propertyFiles) {
    await fs.copyFile(`${__dirname}/${propertyFile}`, `${__dirname}/supatemp_${propertyFile}`);
  }

  const process = spawn('docker', [
    'run',
    '-it',
    '--rm',
    '-e ENV_SUPA=1',
    `-e SUPA_TESTS_LANDSCAPE=${environment.landscape}`,
    `-e SUPA_TESTS_SPACE_GUID=${environment.spaceGuid}`,
    `-e SUPA_TESTS_SRV_APP_NAME=${environment.srvAppName}`,
    `-e SUPA_TESTS_APPROUTER_URL=${environment.approuterUrl}`,
    `-e SUPA_TESTS_CF_USER=${environment.cfUser}`,
    `-e SUPA_TESTS_CF_PASSWORD=${environment.cfPassword}`,
    `-e SUPA_TESTS_APP_USER=${environment.appUser}`,
    `-e SUPA_TESTS_APP_PASSWORD=${environment.appPassword}`,
    `-e SUPA_TESTS_WARMUP_CYCLES=${environment.warmupCycles}`,
    `-e SUPA_TESTS_MEASUREMENT_CYCLES=${environment.measurementCycles}`,
    `-e SUPA_TESTS_STOP_SLEEP_TIME=${environment.stopSleepTime}`,
    `-e SUPA_TESTS_IPA_PROJECT=${environment.ipaProject}`,
    `-e SUPA_TESTS_IPA_VARIANT=${environment.ipaVariant}`,
    `-e SUPA_TESTS_IPA_RELEASE=${environment.ipaRelease}`,
    `-e SUPA_TESTS_IPA_USER=${environment.ipaUser}`,
    `-e SUPA_TESTS_IPA_PASSWORD=${environment.ipaPassword}`,
    `-e SUPA_TESTS_HANA_SERVER=${environment.hanaServer}`,
    `-e SUPA_TESTS_HANA_USER=${environment.hanaUser}`,
    `-e SUPA_TESTS_HANA_PASSWORD=${environment.hanaPassword}`,
    `-e SUPA_TESTS_MONITORED_HANA_USER=${environment.monitoredHanaUser}`,
    `-e SUPA_TESTS_DYNATRACE_API_TOKEN=${environment.dynatraceApiToken}`,
    '-w /home/supa/testautomation/tests/SUPA',
    `-v ${__dirname}/../../:/home/supa/testautomation`,
    'docker.wdf.sap.corp:50000/performance_scalability/supa_performance_test_uiveri5:latest',
    'uiveri5-config.js',
    '--params.cfgfile=supatemp_F4704_Skill.properties',
  ], {
    shell: true,
    stdio: 'inherit',
  });

  // Delete temporary properties file
  process.on('exit', () => propertyFiles.forEach((file) => fs.unlink(`${__dirname}/supatemp_${file}`)));
}

main();
