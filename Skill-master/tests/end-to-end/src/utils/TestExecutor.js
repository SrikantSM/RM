const fs = require('fs').promises;
const testHelper = require('./TestHelper');

class TestExecutor {
  constructor() {
    this.tableHeader = ['Test Step Name', 'Instruction', 'Expected Result'];
    this.apps = new Map();
    this.currentTable = {};

    const customReporter = {
      jasmineDone: async (result) => {
        if (!testHelper.failedOne) {
          await this.finish();
        }
      },
    };
    jasmine.getEnv().addReporter(customReporter);
  }

  describeTestCase(table, description, testSteps) {
    const currentTable = this.getTable(table.appName, table.tableTitle);
    describe(description, () => {
      this.currentTable = currentTable;
      testSteps();
    });
  }

  getTable(appName, tableTitle) {
    if (!this.apps.has(appName)) {
      this.apps.set(appName, new Map());
    }
    const tables = this.apps.get(appName);

    if (!tables.has(tableTitle)) {
      tables.set(tableTitle, []);
    }

    return tables.get(tableTitle);
  }

  step(name, instruction, expected, tests) {
    const LINEBREAK_REGEX = /(\r\n|\n|\r)/gm;
    this.currentTable.push([
      name.replace(LINEBREAK_REGEX, ''),
      instruction.replace(LINEBREAK_REGEX, ''),
      expected.replace(LINEBREAK_REGEX, ''),
    ]);
    if (!process.argv.includes('--params.skipTests')) {
      tests();
    }
  }

  generateMarkdownHeader(appName, tables) {
    let headerString = `# ${appName}\n`;
    headerString += `This document contains steps that needs to be followed for testing the "${appName}" app.\n\n`;
    headerString += '## Scenarios\n';

    tables.forEach((content, title) => {
      headerString += `- [${title}](#${title.toLowerCase().replace(/ /g, '-')})\n`;
    });

    return headerString;
  }

  generateMarkdownTable(tables) {
    let tableString = '';

    tables.forEach((content, title) => {
      tableString += `## ${title}\n\n`;
      for (const headerCell of this.tableHeader) {
        tableString += `| ${headerCell} `;
      }
      tableString += '|\n|----------------|-------------|-----------------|\n';
      for (const row of content) {
        for (const cell of row) {
          tableString += `| ${cell} `;
        }
        tableString += '|\n';
      }
      tableString += '\n';
    });

    return tableString.substring(0, tableString.length - 1);
  }

  async finish() {
    const directory = `${__dirname}/../../target/TestCases`;
    try {
      await fs.access(directory);
    } catch (e) {
      await fs.mkdir(directory);
    }

    this.apps.forEach(async (tables, appName) => {
      if (appName !== null) {
        console.log(`Writing test case descriptions to target/TestCases/${appName.replace(/ /g, '')}.md`);
        await fs.writeFile(`${directory}/${appName.replace(/ /g, '')}.md`, `${this.generateMarkdownHeader(appName, tables)}\n${this.generateMarkdownTable(tables)}`);
      }
    });
  }
}

const testExecutor = new TestExecutor();

module.exports.describeTestCase = testExecutor.describeTestCase.bind(testExecutor);
module.exports.step = testExecutor.step.bind(testExecutor);
