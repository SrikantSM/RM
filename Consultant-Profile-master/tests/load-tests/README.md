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
7. Make sure you have cf cli version 6.10, if not you can download it from [here](https://cli.run.pivotal.io/stable?release=windows64&version=6.10.0&source=github-rel) or [here](https://github.com/cloudfoundry/cli/releases?page=10).
8. Install Statistics plugin if you do not already have, refer [this](https://github.com/swisscom/cf-statistics-plugin) for installation.
9. You must raise a CAM request [here](https://bc.spc.ondemand.com/sap/bc/webdynpro/a1sspc/cam_wd_central?item=request&profile=C4PRM%20DT%20User#) for the profile C4PRM DT User to procure access to the Dynatrace tool.
10. You must also be a 'Space Developer' for c4p-rm/test-load space.

## Steps for executing the load tests on MyResourcesService
1. Open the MyResourcesService-Read.jmx file (get this file from github and place it under W:\apache-jmeter-5.4.1) in the jmeter tool.
2. Ensure that server url, xsuaa client id and client secret values are correctly set in the 'User Defined Variables' config element of MyResourcesService-Read test plan. You can fetch the correct values from the environment variables of the `consultantProfile-srv` application in the `test-load` space.
3. Ensure that second Thread Group's properties like 'Number of Threads', 'Ramp-up period', 'Duration' are set properly. If required disable the 'HTTP Request' samples that are not required for execution from the second thread group's parallel controller. 
4. Get the 'Employee_ID' csv file from github and place it under 'W:\apache-jmeter-5.4.1'. We need to populate the data in Employee_ID.csv, for this use the [Database Explorer](https://hana-cockpit.cfapps.sap.hana.ondemand.com/hrtt/sap/hana/cst/catalog/cockpit-index.html?databaseid=C599071) and navigate to view the data of the COM_SAP_RESOURCEMANAGEMENT_EMPLOYEE_HEADER table. Download top 1000 values of data and paste it in the csv file.
5. Ensure that CSV Data Set Config element under the second thread group has correct csv file path and the data (must be specific to the space on which tests are executed) in the csv is correct.
6. Ensure that the listners like 'View Results in Table/Tree', 'Aggregate Graph' etc are cleared before executing the test.
7. Under parallel controller, enable the config file of the API which you want to test and disable all others.
8. Once all the above steps are done, then execute the load test from the command line. Open the command prompt at jmeter's bin folder level (For example at W:\apache-jmeter-5.4.1\apache-jmeter-5.4.1\bin). Use the command "jmeter -n –t {path to jmx file} -l {path to jtl file}" (For example "jmeter -n –t ../../MyResourcesService-Read.jmx -l ../../MyResourcesService-Skills-10.jtl") to start the execution.
9. Ensure that the jtl result files created after the test execution are copied to share point or 'Performance' channel's (under 'RM Team BLR Valiant' team) LoadTests/JTL Results folder if required.
10. To view the results of jtl, browse the jtl file from any of the listners (For example Aggregate Graph listner of jmx to view throughput, avg response time etc).
11. Maintain different jtl file names (in the command for executing the tests) for different test executions/runs, to ensure results of one execution doesn't get appended to the other.
12. **If the load testing is retriggered for the same number of users, for example 10, due to any incorrect readings or for any other reason, don't forget to delete the specific jtl file before proceeding as it will keep on appending result to previous result.**

## Steps for executing the load tests on ProjectExperienceService
1. Open the ProjectExperienceService-Read.jmx file (get this file from github and place it under W:\apache-jmeter-5.4.1) in the jmeter tool.
2. Ensure that server url, xsuaa client id and client secret values are correctly set in the 'User Defined Variables' config element of MyResourcesService-Read test plan. You can fetch the correct values from the environment variables of the `consultantProfile-srv` application in the `test-load` space.
3. For ProjectExperienceService-SkillAssignments-Edit.jmx, ensure that the values of the profile ID, skill ID & proficiency level ID are valid values. To validate the same use the [Database Explorer](https://hana-cockpit.cfapps.sap.hana.ondemand.com/hrtt/sap/hana/cst/catalog/cockpit-index.html?databaseid=C599071) and navigate to the respective tables & fetch the values.
4. Ensure that second Thread Group's properties like 'Number of Threads', 'Ramp-up period', 'Duration' are set properly. If required disable the 'HTTP Request' samples that are not required for execution from the second thread group's parallel controller. 
5. Ensure that the listners like 'View Results in Table/Tree', 'Aggregate Graph' etc are cleared before executing the test.
6. Under parallel controller, enable the config file of the API which you want to test and disable all others.
7. Once all the above steps are done, then execute the load test from the command line. Open the command prompt at jmeter's bin folder level (For example at W:\apache-jmeter-5.4.1\apache-jmeter-5.4.1\bin). Use the command "jmeter -n –t {path to jmx file} -l {path to jtl file}" (For example "jmeter -n –t ../../ProjectExperienceService-Something.jmx -l ../../ProjectExperienceService-Something-10.jtl") to start the execution.
8. Ensure that the jtl result files created after the test execution are copied to share point or 'Performance' channel's (under 'RM Team BLR Valiant' team) LoadTests/JTL Results folder if required.
9. To view the results of jtl, browse the jtl file from any of the listners (For example Aggregate Graph listner of jmx to view throughput, avg response time etc).
10. Maintain different jtl file names (in the command for executing the tests) for different test executions/runs, to ensure results of one execution doesn't get appended to the other.



## Steps on how to collect the metrics during/after the load test:

1. Duplicate any of the past excel files from the RM Team BLR Valiant teams channel (Performance < Load Tests) to have the format in which we need to take measurements.

2. Taking Cloud Foundry measurements:
- Do a cf login and go to the desired test space.
- Execute command cf statistics consultantProfile-srv to start monitoring the cf cpu and memory and then run the test.
- Once you start the test, take average readings of CPU and memory.

3. Taking Hana CPU measurements:
- Go to the desired test space and click on SAP Hana cloud on the left side bar. You will see an instance of SAP HANA, under actions go to SAP Hana Cockpit then, go to monitor performance under CPU Usage. Set the time frame to the same your test ran for and take the average reading.

4. Taking Dynatrace measurements:
- Go to [Dynatrace](https://apm.cf.sap.hana.ondemand.com/e/2049d6e7-2742-42f5-8c12-e7569a505aa0/#smartscape). Under Applications & Microservices on the left navigate to Services. Search for consultantProfile-srv by applying a filter for Tag for the desired space, click on our the consultantProfile-srv service. Click Apache Tomcat button and to view the process we wish to monitor.
- Set the time frame to the duration the test ran for and under system performance tab take the reading of CPU and Memory.
- Go to JVM Metrics tab and check the suspension percentage. 'Heap Memory' graph will show various Minor GCs which got triggered while execution whereas 'Tenured Gen' graph will show if any Major GCs triggered, take these readings in the excel.
- Go to further details tab and take the screenshot of all the four graphs. These graphs show DB Hikari pool connections. Note all the readings in the Excel.
5. After the test is completed, in Apache JMeter go to Aggregate Graph and clear by clicking on the broom button if there are any previous readings left. Put the path to JTL file which was generated while the test ran. It will show number of samples, Average response time, 90th percent and throughput. Write down all these in the excel file.
