const Excel = require('exceljs');
var workbook = new Excel.Workbook();
var FormulaParser = require('hot-formula-parser').Parser;
const { ExpectedData, VariationLimit } = require('./Configuration');
var parser = new FormulaParser();
const fs = require('fs');

class ResultAnalyzer {
    constructor(sScenarioName) {
        this.scenarioName = sScenarioName;
        this.metrics = Object.keys(VariationLimit);
        this.expectedData = ExpectedData[sScenarioName];
        // We need the row with the first column as Step so that we get the metric names and index mapping.
        this.stepsInScenario = ["Step"];
        Object.keys(this.expectedData).forEach(val => this.stepsInScenario.push(val));
        this.regressions = [];
        this.generalTrend = [];
    }

    /**
   * Parse Formulas using parser
   * @param {Object} oWorksheet WorkSheet Object
   * @param {String} sCellLabel Cell Label
   * @returns {String} Value
   */
    getCellResult(oWorksheet, sCellLabel) {
        if (oWorksheet.getCell(sCellLabel).formula) {
            return parser.parse(oWorksheet.getCell(sCellLabel).formula).result;
        } else {
            return oWorksheet.getCell(sCellLabel.label).value;
        }
    }

    /**
   * Read Data from excel and parse them based on formulas
   * @param {String} sFileName File Name
   * @param {String} sSheetName Sheet Name
   * @returns {Object} Captured values for all steps
   */
    async readDataFromExcel(sFileName, sSheetName) {
        const data = {};
        await workbook.xlsx.readFile(sFileName);
        var worksheet = workbook.getWorksheet(sSheetName);

        // Parser Configuration for formulas refering to a particular cell
        parser.on('callCellValue', function (cellCoord, done) {
            if (worksheet.getCell(cellCoord.label).formula) {
                done(parser.parse(worksheet.getCell(cellCoord.label).formula).result);
            } else {
                done(worksheet.getCell(cellCoord.label).value);
            }
        });

        // Parser Configuration for formulas refering to a range
        parser.on('callRangeValue', function (startCellCoord, endCellCoord, done) {
            var fragment = [];
            for (var row = startCellCoord.row.index; row <= endCellCoord.row.index; row++) {
                var colFragment = [];
                for (var col = startCellCoord.column.index; col <= endCellCoord.column.index; col++) {
                    colFragment.push(worksheet.getRow(row + 1).getCell(col + 1).value);
                }
                fragment.push(colFragment);
            }
            if (fragment) {
                done(fragment);
            }
        });

        // Read
        var that = this;
        worksheet.eachRow(function (row) {
            // Keep updating records based on the value in step column
            // This way for the individual steps we will end up having the values present in the last occurance of step name in excel. (Which is Summary)
            // row.values[1] has the step name
            if (that.stepsInScenario.includes(row.values[1])) {
                data[row.values[1]] = row.values;
            }
        });

        // Read Data from formula
        Object.keys(data).forEach(step => {
            let individualData = data[step];
            individualData.forEach((value, index) => {
                if (typeof value == "object") {
                    if (Object.keys(value).includes("formula")) {
                        const actualValueFromFormula = this.getCellResult(worksheet, value.formula);
                        data[step][index] = actualValueFromFormula;
                    }
                }
            });

        });
        /*
    The data here is an object with key as step name and value as an array of values present in excel
    */
        return data;
    }

    /**
  Filter out only required metrics from all metrics and structure them properly
  @param {Object} oData Has All the metrics present in the excel
  @returns {Object} oUpdatedData It has only thoise metrics which are required for coparison based on stepsInScenrio
  */
    filterAndStructureData(oData) {
    // Keep only those metrics which we want to use.
        const oUpdatedData = {};
        this.stepsInScenario.forEach(step => {
            if (step != "Step") {oUpdatedData[step] = {};}
        });
        oData["Step"].forEach((metric, index) => {
            if (this.metrics.includes(metric)) {
                this.stepsInScenario.forEach(step => {
                    if (step != "Step" && oData[step]) {oUpdatedData[step][metric] = oData[step][index];}
                });
            }
        });
        return oUpdatedData;
    }
    /**
   * This function checks and reports for violation, missing metrics, metrics with missing values.
   * It also provides information about general trend.
   * @param {Object} oObservedData The observed data
   */
    compareData(oObservedData) {
        Object.keys(this.expectedData).forEach((step) => {
            Object.keys(this.expectedData[step]).forEach((metric) => {
                // Check if metric was present in excel or not.
                if (!Object.keys(oObservedData[step]).includes(metric)) {
                    this.reportMissing(step, metric);
                } else if (oObservedData[step][metric] == "N/A" || oObservedData[step][metric] == "") {
                    // Check if value for metric was present in excel or not.

                    this.reportMissing(step, metric);
                } else {
                    // Report General Trend
                    this.reportGeneralTrend(step, metric, oObservedData[step][metric], this.expectedData[step][metric]);

                    // Check and report Violation
                    if (this.checkViolation(metric, oObservedData[step][metric], this.expectedData[step][metric])) {
                        this.reportViolation(step, metric, oObservedData[step][metric], this.expectedData[step][metric]);
                    }
                }

            });
        });
    }
    /**
   * Check violation based of variation limit
   * @param {*} sMetric Metric to comapre
   * @param {*} nObservedValue Observed Value
   * @param {*} nExpectedValue Expected Value
   * @returns {Boolean} true if there is violation
   */
    checkViolation(sMetric, nObservedValue, nExpectedValue) {
    // Check if variation limit is maintained for the metric or not
        if (!Object.keys(VariationLimit).includes(sMetric)) {
            this.reportMissing(sMetric, "variationLimit");
            // We return false as we already add the error in error list.
            return false;
        }
        // Check for violation
        return nObservedValue - nExpectedValue > VariationLimit[sMetric];
    }

    reportViolation(sStep, sMetric, nObserved, nExpected) {
    // Report the violated step
        this.regressions.push({
            "Step": sStep,
            "Metric": sMetric,
            "Observed": nObserved,
            "Expected": nExpected,
            "Variation": nObserved - nExpected,
            "Allowed Variation": VariationLimit[sMetric]
        });
    }

    reportGeneralTrend(sStep, sMetric, nObserved, nExpected) {
        var status = "Neutral";
        if (Math.abs(nObserved - nExpected) > VariationLimit[sMetric]) {
            if (nObserved < nExpected) {
                status = "Improved";
            } else {
                status = "Degraded";
            }
        }
        this.generalTrend.push({
            "Step": sStep,
            "Metric": sMetric,
            "Observed": nObserved,
            "Expected": nExpected,
            "Trend": status
        });
    }

    reportMissing(sStep, sMetric) {
    // Report the missing metric
        this.regressions.push({
            "Step": sStep,
            "Metric": sMetric,
            "Observed": "Missing"
        });
    }

    /**
   * Provides path of the excel file generated for this measurement.
   * @returns {String} Path of the excel file generated
   */
    getExcelFileName() {
    // For local file uncomment below line
    // return "2201.xlsx";
        var basePath = "/home/supa/supaData/results";
        var filePath = basePath;
        var folders = fs.readdirSync(basePath);

        // Finfd folder which has the result
        folders.forEach(folder => {
            if (folder.startsWith(this.scenarioName)) {
                filePath = `${basePath}/${folder}/${folder}.xlsx`;
            }
        });

        // In case there is no folder that starts with Scenario Name we terminate the flow
        if (basePath == filePath) {
            console.log("Could not find excel");
            process.exit(1);
        }
        console.log("Using File: " + filePath);
        return filePath;
    }

    async identifyRegression() {
    // Get Excel File Path
        var excelFilePath = this.getExcelFileName();

        // Read Data From Excel
        let data = await this.readDataFromExcel(excelFilePath, "MeasuredData");

        // Filter out important data only
        const filteredData = this.filterAndStructureData(data);
        console.log("Data for this measurement: ");
        console.log(filteredData);

        // Compare data with expectation
        this.compareData(filteredData);

        // Print general trend.
        console.log("General Trend");
        console.table(this.generalTrend);

        // Check if any regressions are there
        if (this.regressions.length > 0) {
            console.log("Regressions: ");
            console.table(this.regressions);
            return true;
        }
        return false;
    }

}

// new ResultAnalyzer("F4723_ManageResourceRequest").identifyRegression();

module.exports = { ResultAnalyzer };
