## UIVeri5
The framework used for UI end-to-end tests is UIVeri5, which itself is heavily based on protractor, an end-to-end testing framework for Angular UI's.

## Setups and Documentation	
You can find out more about these frameworks and how to use them here:

Github of UIVeri5:
https://github.com/SAP/ui5-uiveri5

Protractor API (useful for actually writing tests):
http://www.protractortest.org/#/api

Sports One Example:
https://github.wdf.sap.corp/Sports/sports-visualtest

Consent Repository Example:
https://github.wdf.sap.corp/foundation-apps/ConsentManagementDev/blob/master/visual/

## Writing tests
One spec should contain **one end-to-end test scenario**. You should check the **style guide** for how to organize protractor tests here: https://github.com/angular/protractor/blob/master/docs/style-guide.md.

UIVeri5 adds some **additional locators** to the build-in locators in protractor. You can find more information about them here:
https://github.com/SAP/ui5-uiveri5/blob/master/docs/usage/locators.md

## Running the tests
First of all the required node modules have to be installed via `npm install`.
... Go to Resource-Management->Assignment->tests->end-to-end in your commnad prompt or terminal
... run `npm install`

### Credentials in default-env.json
After that you can maintain credentials in the file `default-env.json`, which can be created as a copy of [default-env.json.example](default-env.json.example). Copy [default-env.json.example] and paste at the same level with the name `default-env.json`.

Now the tests can be executed by running `npm test` or `npm start`.

These test will run in your dev-space (which you would have specified in `default-env.json`).

## Running the tests Locally in your developer IDE (for e.g. VS Code)
First of all the required node modules have to be installed via `npm install`.
... Go to Resource-Management->Assignment->tests->end-to-end in your commnad prompt or terminal
... run `npm install`

### Credentials in default-env.json
After that you can maintain credentials in the file `default-env.json`, which can be created as a copy of [default-env.json.example](default-env.json.example). Copy [default-env.json.example] and paste at the same level with the name `default-env.json`.

after that go to file `Resource-Management/Assignment/tests/end-to-end/uiveri5-config.js` in your vscode. Search for the option chromeOptions and uncomment the line `//args : [  'start-maximized' ], //for local testing`. also comment out the other line.

Now the tests can be executed by running `npm test` or `npm start`.

The chrome would open automatically. It will execute the test one-by-one while you witness the test run. Please note that in order to keep the test running locally, you need to keep your browser on the screen all the time.

### Passing credentials via the command line
Another alternative is to pass credentials directly from the command line. You can either use your own user or a technical user for this. To use the `uiveri5` command line executable, `uiveri5` needs to be installed globally.

```bash
npm install @ui5/uiveri5 -g
```

```bash
uiveri5 --params.appUser=<<email>> --params.appPassword=<<password>> --params.appURL=<<URL to Launchpad>>
```

**Note: The test spec to execute must be set manually for this approach to work**

## Debugging the tests
In order to debug the test locally, put the debugger in visual studio code. you can also write `debugger;` statement in the code where you want debugger to stop.

Now go to `package.json`, click on the arrow "Debug" and select "Debug" option to start your test in debug mode. Wait for the debugger to hit.

If the avove step has any issue, make sure you have below settings in place.
If you want to debug the tests, here is the launch configuration for **Visual Studio Code**, which you can add to your `launch.json`. `${workspaceFolder}/tests/end-to-end` should point to this directory.

```js
{
    "type": "node",
    "request": "launch",
    "name": "Run End to End Tests",
    "runtimeExecutable": "npm",
    "runtimeArgs": [
        "run", "debug"
    ],
    "port": 9229,
    "cwd": "${workspaceFolder}/tests/end-to-end"
}
```

More useful information about debugging can be found here: https://github.com/angular/protractor/blob/master/docs/debugging.md

## Options tried to improve E2E run time.
Few options have been tried to improve End-to-end test total run time. However they did not work to the satisfactory level to reduce total run time. 

### Creatig the data only once and reuse for all test test cases
We tried to create the data at the begining of the execution and resuse the data for all the test case. However this did not improve the run time drastically. with the benefits we get with this option, it is better to stick with the current option

### Login only once rather than for every test
We treid to perform login only once in the begining and perform all the test cases using browser refresh rather doing the login at every step.

Both above options together did not improve the performance a lot these option can be find in PR `dev/ImproveE2EDNM`
