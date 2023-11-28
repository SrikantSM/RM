const fs = require('fs').promises;
const { exec } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

const FOREGROUND_RESET = '\x1b[0m';
const FOREGROUND_BRIGHT = '\x1b[1m';
const FOREGROUND_BLUE = FOREGROUND_BRIGHT + '\x1b[34m';
const FOREGROUND_CYAN = FOREGROUND_BRIGHT + '\x1b[36m';
const FOREGROUND_GREEN = FOREGROUND_BRIGHT + '\x1b[32m';
const FOREGROUND_YELLOW = FOREGROUND_BRIGHT + '\x1b[33m';

const paths = {
  umbrella: {
    mtaYaml: __dirname + '/../../mta.yaml',
    approuter: __dirname + '/../../approuter',
    db: __dirname + '/../../db',
    crossDomainE2ETests: __dirname + '/../../tests/cross-domain-e2e/default-env.json',
  },
  domain: {
    mtaYaml: __dirname + '/../mta.yaml',
    emptyPostmanEnvironment: __dirname + '/../utils/Empty.postman_environment.json',
    srv: __dirname + '/../srv',
    utils: __dirname + '/../utils',
    apiIntegrationTests: __dirname + '/../tests/api-integration/default-env.json',
    endToEndTests: __dirname + '/../tests/end-to-end/default-env.json',
  }
}

main();

async function main() {
  try {
    console.info(`Setting up the ${FOREGROUND_BLUE}local environment${FOREGROUND_RESET}`);

    const cloudFoundryEnvironments = await getCloudFoundryEnvironments();

    const umbrellaApprouterName = await getAppNameForPath(cloudFoundryEnvironments, paths.umbrella.mtaYaml, 'approuter');
    const domainApprouterName = await getAppNameForPath(cloudFoundryEnvironments, paths.domain.mtaYaml, 'approuter');
    const umbrellaDatabaseName = await getAppNameForPath(cloudFoundryEnvironments, paths.umbrella.mtaYaml, 'db');
    const domainDatabaseName = await getAppNameForPath(cloudFoundryEnvironments, paths.domain.mtaYaml, '\\.\\.\\/db');
    const umbrellaAssignmentServiceName = await getAppNameForPath(cloudFoundryEnvironments, paths.umbrella.mtaYaml, 'Assignment\\/srv');
    const domainServiceName = await getAppNameForPath(cloudFoundryEnvironments, paths.domain.mtaYaml, 'srv');

    const umbrellaApprouterEnvironment = cloudFoundryEnvironments.get(umbrellaApprouterName.deployed);
    const domainApprouterEnvironment = cloudFoundryEnvironments.get(domainApprouterName.deployed);
    const umbrellaDatabaseEnvironment = cloudFoundryEnvironments.get(umbrellaDatabaseName.deployed);
    const domainDatabaseEnvironment = cloudFoundryEnvironments.get(domainDatabaseName.deployed);
    const umbrellaAssignmentServiceEnvironment = cloudFoundryEnvironments.get(umbrellaAssignmentServiceName.deployed);
    const domainServiceEnvironment = cloudFoundryEnvironments.get(domainServiceName.deployed);

    const apiIntegrationTestEnvironment = createApiIntegrationTestEnvironment(domainServiceName.declared, domainServiceEnvironment);
    const endToEndTestEnvironment = createEndToEndTestEnvironment(domainServiceName.declared, domainServiceEnvironment, domainApprouterEnvironment || umbrellaApprouterEnvironment);
    const crossDomainE2ETestTestEnvironment = createCrossDomainE2ETestEnvironment(domainServiceName.declared, umbrellaAssignmentServiceEnvironment, umbrellaApprouterEnvironment);

    await writePropertiesToFile([umbrellaApprouterEnvironment ? umbrellaApprouterName.deployed : domainApprouterName.deployed], null, `${paths.umbrella.approuter}/default-env.json`, umbrellaApprouterEnvironment || domainApprouterEnvironment);
    await writePropertiesToFile([umbrellaDatabaseEnvironment ? umbrellaDatabaseName.deployed : domainDatabaseName.deployed], null, `${paths.umbrella.db}/default-env.json`, umbrellaDatabaseEnvironment || domainDatabaseEnvironment);
    await writePropertiesToFile([domainServiceName.deployed], null, `${paths.domain.srv}/default-env.json`, domainServiceEnvironment);

    await writePropertiesToFile([domainServiceName.deployed], `${paths.domain.apiIntegrationTests}.example`, paths.domain.apiIntegrationTests, apiIntegrationTestEnvironment);
    await writePropertiesToFile([domainServiceName.deployed, domainApprouterEnvironment ? domainApprouterName.deployed : umbrellaApprouterName.deployed], `${paths.domain.endToEndTests}.example`, paths.domain.endToEndTests, endToEndTestEnvironment);
    await writePropertiesToFile([umbrellaAssignmentServiceName.deployed, umbrellaApprouterName.deployed], `${paths.umbrella.crossDomainE2ETests}.example`, paths.umbrella.crossDomainE2ETests, crossDomainE2ETestTestEnvironment);

    if (existsSync(paths.domain.emptyPostmanEnvironment)) {
      const postmanEnvironment = await createPostmanEnvironment(domainApprouterEnvironment ? domainApprouterName.declared : umbrellaApprouterName.declared, domainServiceEnvironment || umbrellaSkillServiceEnvironment, domainDatabaseEnvironment || umbrellaDatabaseEnvironment, domainApprouterEnvironment || umbrellaApprouterEnvironment);
      await writePropertiesToFile([domainServiceEnvironment ? domainServiceName.deployed : umbrellaAssignmentServiceName.deployed, domainApprouterEnvironment ? domainApprouterName.deployed : umbrellaApprouterName.deployed], null, `${paths.domain.utils}/${(postmanEnvironment || { name: '*' }).name}.postman_environment.json`, postmanEnvironment);
    } else {
      console.info(`Skipping ${FOREGROUND_YELLOW}Postman environment${FOREGROUND_RESET} generation as ${path.normalize(paths.domain.emptyPostmanEnvironment)} does not exist`)
    }
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

async function getAppNameForPath(environments, yamlPath, relativeAppPath) {
  const regex = `^[\\s]*-[\\s]*name:[\\s]([\\S]*)((?!- name).|((\\n|(\\r\\n)|\\r)))*path:[\\s]*"?${relativeAppPath}"?[\\s]*$`;
  const fileContent = await fs.readFile(yamlPath, 'utf8');
  const result = new RegExp(regex, 'gm').exec(fileContent)[1];

  // Try to find the active app name
  const name = {
    declared: result,
    deployed: result,
  };
  if (environments.has(name.deployed)) {
    return name;
  }

  // Try to find an app name deployed with the legacy blue-green deployment
  if (!environments.has(name.deployed)) {
    name.deployed = `${name.declared}-blue`
  }
  if (!environments.has(name.deployed)) {
    name.deployed = `${name.declared}-green`
  }
  if (environments.has(name.deployed)) {
    console.log(`Using app deployed with the legacy blue-green deployment: ${FOREGROUND_CYAN}${name.deployed}${FOREGROUND_RESET}. The suffix will be stripped when writing to environment files.`);
    return name;
  }

  // Try to find an app name with an ongoing blue-green deployment
  if (!environments.has(name.deployed)) {
    name.deployed = `${name.declared}-idle`
  }
  if (!environments.has(name.deployed)) {
    name.deployed = `${name.declared}-live`
  }
  if (environments.has(name.deployed)) {
    console.log(`Using app with an ongoing blue-green deployment: ${FOREGROUND_CYAN}${name.deployed}${FOREGROUND_RESET}. ${FOREGROUND_YELLOW}The credentials might be invalid after the deployment is complete.${FOREGROUND_RESET} The suffix will be stripped when writing to environment files.`);
    return name;
  }

  return name;
}

async function getCloudFoundryEnvironments() {
  const targetOutput = await execCommand('cf target');
  const spaceName = /space:\W*(.*)/.exec(targetOutput)[1];
  const spaceOutput = await execCommand(`cf space ${spaceName} --guid`);
  const spaceGuid = spaceOutput.trim();
  const appsResponse = JSON.parse(await execCommand(`cf curl "/v2/apps?q=space_guid:${spaceGuid}"`));

  const environments = new Map();

  for (const app of appsResponse.resources) {
    const cfEnvResponse = await execCommand(`cf curl ${app.metadata.url}/env`);
    const groupedVariables = JSON.parse(cfEnvResponse);

    const environmentVariables = {}

    for (const variableGroup of Object.keys(groupedVariables)) {
      Object.assign(environmentVariables, groupedVariables[variableGroup]);
    }

    environments.set(app.entity.name, environmentVariables);
  }

  return environments;
}

function createApiIntegrationTestEnvironment(appName, serviceEnvironment) {
  if (!serviceEnvironment) {
    return null;
  }
  return {
    API_INTEGRATION_TESTS_LANDSCAPE: 'sap',
    API_INTEGRATION_TESTS_SPACE_GUID: serviceEnvironment.VCAP_APPLICATION.space_id,
    API_INTEGRATION_TESTS_APP_NAME: appName
  };
}

function createEndToEndTestEnvironment(srvAppName, serviceEnvironment, approuterEnvironment) {
  if (!serviceEnvironment || !approuterEnvironment) {
    return null;
  }
  return {
    END_TO_END_TESTS_LANDSCAPE: 'sap',
    END_TO_END_TESTS_SPACE_GUID: serviceEnvironment.VCAP_APPLICATION.space_id,
    END_TO_END_TESTS_SRV_APP_NAME: srvAppName,
    END_TO_END_TESTS_APPROUTER_URL: `https://${approuterEnvironment.VCAP_APPLICATION.uris[0]}`
  };
}

function createCrossDomainE2ETestEnvironment(srvAppName, serviceEnvironment, approuterEnvironment) {
  if (!serviceEnvironment || !approuterEnvironment) {
    return null;
  }
  return {
    CROSS_DOMAIN_E2E_TESTS_LANDSCAPE: 'sap',
    CROSS_DOMAIN_E2E_TESTS_SPACE_GUID: serviceEnvironment.VCAP_APPLICATION.space_id,
    CROSS_DOMAIN_E2E_TESTS_SRV_APP_NAME: srvAppName,
    CROSS_DOMAIN_E2E_TESTS_APPROUTER_URL: `https://${approuterEnvironment.VCAP_APPLICATION.uris[0]}`
  };
}

async function getServiceKey(binding) {
  const instanceName = binding.instance_name;
  let output;

  try {
    output = await execCommand(`cf service-key ${instanceName} local-setup`);
  } catch (e) {
    // try to create key only when necessary to improve performance
    console.log(`Creating service-key 'local-setup' for '${instanceName}'`);
    await execCommand(`cf create-service-key ${instanceName} local-setup`);
    output = await execCommand(`cf service-key ${instanceName} local-setup`);
  }

  const parsed = JSON.parse(output.substring(output.indexOf("\n") + 1));
  return parsed;
}

async function createPostmanEnvironment(approuterName, serviceEnvironment, dbEnvironment, approuterEnvironment) {
  if (!serviceEnvironment || !approuterEnvironment) {
    return null;
  }

  const xsuaaKey = await getServiceKey(serviceEnvironment.VCAP_SERVICES['xsuaa'][0]);
  const saasRegistryKey = await getServiceKey(approuterEnvironment.VCAP_SERVICES['saas-registry'][0]);

  const managedHanaKey = await getServiceKey(dbEnvironment.VCAP_SERVICES['managed-hana'][0]);
  const [, managedHanaUrl, managedHanaBinding] = /(https:\/\/[^/]*)\/managed\/managed_instances\/(.*)/.exec(managedHanaKey.get_all_managed_instances_url);

  let serviceManagerKey = {};
  if (serviceEnvironment.VCAP_SERVICES['service-manager']) {
    serviceManagerKey = await getServiceKey(serviceEnvironment.VCAP_SERVICES['service-manager'][0]);
  } else {
    console.log('Service Manager doesn\'t yet exist, skipping');
  }

  const newValues = [
    {
      key: 'appUser',
      value: '',
      enabled: false
    },
    {
      key: 'appPassword',
      value: '',
      enabled: false
    },
    {
      key: 'serviceUrl',
      value: 'https://' + serviceEnvironment.VCAP_APPLICATION.uris[0],
      enabled: true
    },
    {
      key: 'spaceName',
      value: serviceEnvironment.VCAP_APPLICATION.space_name,
      enabled: true
    },
    {
      key: 'tenantId',
      value: xsuaaKey.tenantid,
      enabled: true
    },
    {
      key: 'xsuaaUrl',
      value: xsuaaKey.url,
      enabled: true
    },
    {
      key: 'xsuaaClientId',
      value: xsuaaKey.clientid,
      enabled: true
    },
    {
      key: 'xsuaaClientSecret',
      value: xsuaaKey.clientsecret,
      enabled: true
    },
    {
      key: 'saasRegistryUrl',
      value: saasRegistryKey.saas_registry_url,
      enabled: true
    },
    {
      key: 'saasRegistryClientId',
      value: saasRegistryKey.clientid,
      enabled: true
    },
    {
      key: 'saasRegistryClientSecret',
      value: saasRegistryKey.clientsecret,
      enabled: true
    },
    {
      key: 'managedHanaUrl',
      value: managedHanaUrl,
      enabled: true
    },
    {
      key: 'managedHanaBinding',
      value: managedHanaBinding,
      enabled: true
    },
    {
      key: 'managedHanaUser',
      value: managedHanaKey.user,
      enabled: true
    },
    {
      key: 'managedHanaPassword',
      value: managedHanaKey.password,
      enabled: true
    },
    {
      key: 'serviceManagerUrl',
      value: serviceManagerKey.sm_url,
      enabled: true,
    },
    {
      key: 'serviceManagerClientId',
      value: serviceManagerKey.clientid,
      enabled: true,
    },
    {
      key: 'serviceManagerClientSecret',
      value: serviceManagerKey.clientsecret,
      enabled: true,
    }
  ];

  const values = JSON.parse(await fs.readFile(paths.domain.emptyPostmanEnvironment, 'utf8')).values;

  newValues.forEach((newValue) => {
    const correspondingEmptyValue = values.find((value) => value.key === newValue.key);

    if (correspondingEmptyValue) {
      correspondingEmptyValue.value = newValue.value;
      correspondingEmptyValue.enabled = newValue.enabled;
    } else {
      values.push(newValue)
    }
  })

  return {
    name: `${serviceEnvironment.VCAP_APPLICATION.organization_name}-${serviceEnvironment.VCAP_APPLICATION.space_name}-${approuterName.replace('-approuter', '')} (generated)`,
    values
  };
}

async function execCommand(command) {
  return new Promise(function (resolve, reject) {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }
      resolve(stdout);
    })
  });
}

async function writePropertiesToFile(originApps, templateFilename, targetFilename, newProperties) {
  if (!newProperties) {
    console.info(`Skipping file ${FOREGROUND_YELLOW}${path.normalize(targetFilename)}${FOREGROUND_RESET} as there are no properties to set`);
    return;
  }

  const targetFileSection = `${FOREGROUND_GREEN}${path.normalize(targetFilename)}${FOREGROUND_RESET}`;
  const templateSection = ` by using the template ${FOREGROUND_CYAN}${path.normalize(templateFilename || '')}${FOREGROUND_RESET}`;
  const originAppList = originApps.filter(x => x).join(', ');
  const originAppSection = ` by using the environments of ${FOREGROUND_CYAN}${originAppList}${FOREGROUND_RESET}`

  console.info(`Writing to file ${targetFileSection}${originAppList ? originAppSection : ''}${templateFilename ? templateSection : ''}`);

  const properties = {};

  if (templateFilename && existsSync(templateFilename)) {
    Object.assign(properties, JSON.parse(await fs.readFile(templateFilename, 'utf8')));
  }

  if (existsSync(targetFilename)) {
    Object.assign(properties, JSON.parse(await fs.readFile(targetFilename, 'utf8')));
  }

  Object.assign(properties, newProperties);

  await fs.writeFile(targetFilename, JSON.stringify(properties, null, 2));
}


