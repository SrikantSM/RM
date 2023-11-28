# Load Tests Execution
This document contains steps that needs to be followed for executing load tests in a remote system.

## Tools Required
* Remote desktop access. Refer to [this](https://citrix-access.global.corp.sap/Citrix/OfficeWeb/) to start the SAP Desktop (EMEA region)
* Jmeter within the SAP Desktop
* JMeter Plugins Manager within the SAP Desktop

## Steps for installing the required tools
1. Open [this](https://citrix-access.global.corp.sap/Citrix/OfficeWeb/) url and then open the SAP Desktop (EMEA region) from the web page.
2. Once the remote desktop started successfully, open the chrome (search in the remote desktop) for installing jmeter. Download the latest binary zip from [this](https://jmeter.apache.org/download_jmeter.cgi) and extract it to "apache-jmeter-5.4.1\" and place it under 'TSWork (W:)' drive in the remote desktop.
3. Download the 'JMeter Plugins Manager' jar file from [this](https://jmeter-plugins.org/wiki/PluginsManager/) page. Once it is successfully downloaded, put it into JMeter's lib/ext directory (For example into this 'W:\apache-jmeter-5.4.1\apache-jmeter-5.4.1\lib\ext' in your remote desktop)
4. Start the jmeter by opening the 'jmeter' windows batch file from the jmeter's bin folder (For example W:\apache-jmeter-5.4.1\apache-jmeter-5.4.1\bin)
5. Once jmeter is started, click on 'Options' then select 'Plugins Manager'. Plugins Manager popup should open, then click on 'Available Plugins' and search for 'Parallel Controller & Sampler'. Select the 'Parallel Controller & Sampler' checkbox and then click on 'Apply Changes and Restart JMeter' button in the button.
6. Once the jmeter successfully restarts, try opening any of the jmx file from the load-tests folder to validate the sucessful installation of tools. If no error is displayed upon opening the jmx then your installation is successful.

## Steps for executing the load tests on CapacityGridAPIService
1. Open the CapacityGridAPI.jmx file (get this file from github and place it under W:\apache-jmeter-5.4.1) from the jmeter.
2. Ensure that server url, xsuaa client id and client secret values are correct under the 'User Defined Variables' config element of CapacityGridAPI test plan.
3. Ensure that second Thread Group's properties like 'Number of Threads', 'Ramp-up period', 'Duration' are set properly. If required disable the 'HTTP Request' samples that are not required for execution from the second thread group's parallel controller. 
4. Ensure that CSV Data Set Config element under the second thread group has correct csv file path and the data (must be specific to the space on which tests are executed) in the csv is correct.
5. Ensure that the listners like 'View Results in Table/Tree', 'Aggregate Graph' etc are cleared before executing the test.
6. Once all the above steps are done, then execute the load test from the command line. Open the command prompt at jmeter's bin folder level (For example at W:\apache-jmeter-5.4.1\apache-jmeter-5.4.1\bin). Use the command "jmeter -n –t {path to jmx file} -l {path to jtl file}" (For example "jmeter -n –t ../../MyResourcesService-Read.jmx -l ../../MyResourcesService-Skills-10.jtl") to start the execution.
7. Ensure that the jtl result files created after the test execution are copied to LoadTests/JTL Results folder if required in Assignment Domain folder .
8. To view the results of jtl, browse the jtl file from any of the listners (For example Aggregate Graph listner of jmx to view throughput, avg response time etc).
9. Maintain different jtl file names (in the command for executing the tests) for different test executions/runs, to ensure results of one execution doesn't get appended to the other.
