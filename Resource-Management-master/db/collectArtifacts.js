const fs = require('fs');
const path = require('path');

if (fs.existsSync('../package.json')) {
  console.log('Collecting native database artifacts from submodules');
  for (const submodule of getSubmodules()) {
    collectArtifactsFrom(submodule);
  }
  console.log('Done collecting native database artifacts from submodules');

  console.log('Creating undeploy.json');
  fetchUndeployJson();
  console.log('Done creating undeploy.json');
} else {
  console.log('Skipping collecting of native artifacts');
}

/**
 * Returns all submodules referenced in the index.cds file
 * @yields {name: string, dbFolder: string}
 * @returns {undefined}
 */
function* getSubmodules() {
  const indexCds = fs.readFileSync('index.cds');
  const regex = /using .*? from *'(@sap\/(rm-.*)\/db\/)'/g;
  let match;

  do {
    match = regex.exec(indexCds);
    if (match) {
      yield {
        name: match[2],
        dbFolder: path.join('..', 'node_modules', match[1]),
      };
    }
  } while (match);
}

/**
 * Collects all native database artifacts from the submodule to the src/gen folder
 * @param {{name: string, dbFolder: string}} submodule to collect
 * @returns {undefined}
 */
function collectArtifactsFrom(submodule) {
  const source = path.join(submodule.dbFolder, 'src');
  const destination = path.join('src', 'gen', submodule.name);

  if (fs.existsSync(destination)) {
    removeRecursively(destination);
  }

  if (fs.existsSync(source)) {
    copyRecursively(source, destination, (sourceFile, destinationFile) => {
      if (
        sourceFile.endsWith(`${path.sep}gen`)
        || sourceFile.endsWith(`${path.sep}.hdiignore`)
      ) {
        return false;
      }
      console.log(`${sourceFile} -> ${destinationFile}`);
      return true;
    });
  }
}

/**
 * Removes a directory recursively
 * @param {string} directory to remove
 * @returns {undefined}
 */
function removeRecursively(directory) {
  if (fs.existsSync(directory)) {
    for (const child of fs.readdirSync(directory)) {
      const fullChild = path.join(directory, child);

      if (fs.lstatSync(fullChild).isDirectory()) {
        removeRecursively(fullChild);
      } else {
        fs.unlinkSync(fullChild);
      }
    }
    fs.rmdirSync(directory);
  }
}

/**
 * This callback filters which files should be copied
 *
 * @callback sourceDestinationFilterCallback
 * @param {string} source file name
 * @param {string} destination file name
 * @returns {boolean} filter result
 */

/**
 * Copies a directory recursively only using the files matching the filter
 *
 * @param {string} source to copy from
 * @param {string} destination to copy to
 * @param {sourceDestinationFilterCallback} filter to decide which file to copy
 * @returns {undefined}
 */
function copyRecursively(source, destination, filter) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }

  if (fs.lstatSync(source).isDirectory()) {
    for (const child of fs.readdirSync(source)) {
      const fullSource = path.join(source, child);
      const fullDestination = path.join(destination, child);

      if (!filter(fullSource, fullDestination)) {
        continue;
      }

      if (fs.lstatSync(fullSource).isDirectory()) {
        copyRecursively(fullSource, fullDestination, filter);
      } else {
        fs.copyFileSync(fullSource, fullDestination);
      }
    }
  }
}

/**
 * Copies the undeploy.json from each submodule, merges it with the umbrella undeploy.json, and converts each element to the required folder structure as in umbrella
 * @returns {undefined}
 */
function fetchUndeployJson() {
  const undeployDestination = 'undeploy.json';
  const umbrellaUndeployDestination = 'umbrellaUndeploy.json';
  let undeployContent = [];

  if (fs.existsSync(umbrellaUndeployDestination)) {
    undeployContent = [
      `=== START: ${umbrellaUndeployDestination} ===`,
      ...JSON.parse(fs.readFileSync(umbrellaUndeployDestination)),
      `=== END: ${umbrellaUndeployDestination} ===`,
    ];
  }

  for (const submodule of getSubmodules()) {
    const undeploySource = path.join(submodule.dbFolder, undeployDestination);

    if (fs.existsSync(undeploySource)) {
      const undeploySubmoduleContent = JSON.parse(
        fs.readFileSync(undeploySource),
      );

      const updatedUndeploy = undeploySubmoduleContent.map((element) => {
        if (!element.startsWith('src/gen/') && element.startsWith('src/')) {
          return `${element.substr(0, 4)}gen/${submodule.name}/${element.substr(4)}`;
        }
        return element;
      });

      // adds converted folder-structure to the undeploy array
      // also adding same undeploy content as submodules for domain usecase
      undeployContent = [
        ...undeployContent,
        `=== START: ${undeploySource} ===`,
        ...undeploySubmoduleContent,
        ...updatedUndeploy,
        `=== END: ${undeploySource} ===`,
      ];
    }
  }
  try {
    fs.writeFileSync(undeployDestination, JSON.stringify(undeployContent));
  } catch (err) {
    console.log('Error creating undeploy.json', err);
  }
}
