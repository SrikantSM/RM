const manageAppExpectation = {
    '010_Open Manage Resource Request App': {
        'Canary_HANA_Cloud HANA CPU Time [s]': 4.257,
        'Client CPU Time [s]': 3.371,
        'End to End Response Time [s]': 3.430,
        'Number of Sequential Http Round Trips': 2.125,
        'Time to Visually Complete [s]': 3.302,
        'Time to Last Significant Change [s]': 3.302,
        'Dynatrace APM CPU Time [s]': 0.0269
    },
    '020_Filter Resource Request list page': {
        'Canary_HANA_Cloud HANA CPU Time [s]': 2.690,
        'Client CPU Time [s]': 2.268,
        'End to End Response Time [s]': 3.330,
        'Number of Sequential Http Round Trips': 1,
        'Time to Visually Complete [s]': 5.653,
        'Time to Last Significant Change [s]': 2.279,
        'Dynatrace APM CPU Time [s]': 0.051
    },
    '030_Select Resource Request': {
        'Canary_HANA_Cloud HANA CPU Time [s]': 0.067,
        'Client CPU Time [s]': 1.553,
        'End to End Response Time [s]': 1.387,
        'Number of Sequential Http Round Trips': 1.889,
        'Time to Visually Complete [s]': 1.417,
        'Time to Last Significant Change [s]': 1.171,
        'Dynatrace APM CPU Time [s]': 0.043
    },
    '040_Enrich Resource Request and Save': {
        'Canary_HANA_Cloud HANA CPU Time [s]': 0.064,
        'Client CPU Time [s]': 0.649,
        'End to End Response Time [s]': 1.168,
        'Number of Sequential Http Round Trips': 2,
        'Time to Visually Complete [s]': 1.161,
        'Time to Last Significant Change [s]': 1.050,
        'Dynatrace APM CPU Time [s]': 0.076
    },
    '050_Publish The Resource Request': {
        'Canary_HANA_Cloud HANA CPU Time [s]': 0.010,
        'Client CPU Time [s]': 0.193,
        'End to End Response Time [s]': 0.4,
        'Number of Sequential Http Round Trips': 1,
        'Time to Visually Complete [s]': 0.436,
        'Time to Last Significant Change [s]': 0.436,
        'Dynatrace APM CPU Time [s]': 0.058
    },
    '060_Withdraw The Resource Request': {
        'Canary_HANA_Cloud HANA CPU Time [s]': 0.011,
        'Client CPU Time [s]': 0.19,
        'End to End Response Time [s]': 0.412,
        'Number of Sequential Http Round Trips': 1,
        'Time to Visually Complete [s]': 0.388,
        'Time to Last Significant Change [s]': 0.388,
        'Dynatrace APM CPU Time [s]': 0.067
    },
    '070_Open Staffed Resource Request': {
        'Canary_HANA_Cloud HANA CPU Time [s]': 0.059,
        'Client CPU Time [s]': 0.979,
        'End to End Response Time [s]': 1.350,
        'Number of Sequential Http Round Trips': 1,
        'Time to Visually Complete [s]': 1.376,
        'Time to Last Significant Change [s]': 0.454,
        'Dynatrace APM CPU Time [s]': 0.036
    }
};
const staffAppExpectation = {
    '010_Open Staff Resource Request App': {
        'Canary_HANA_Cloud HANA CPU Time [s]': 1.268,
        'Client CPU Time [s]': 2.715,
        'End to End Response Time [s]': 2.071,
        'Number of Sequential Http Round Trips': 2,
        'Time to Visually Complete [s]': 1.893,
        'Time to Last Significant Change [s]': 1.949,
        'Dynatrace APM CPU Time [s]': 0.025
    },
    '020_Filter Resource Request list page': {
        'Canary_HANA_Cloud HANA CPU Time [s]': 1.235,
        'Client CPU Time [s]': 2.065,
        'End to End Response Time [s]': 2.276,
        'Number of Sequential Http Round Trips': 1.1,
        'Time to Visually Complete [s]': 2.286,
        'Time to Last Significant Change [s]': 1.274,
        'Dynatrace APM CPU Time [s]': 0.041
    },
    '030_Request Details': {
        'Canary_HANA_Cloud HANA CPU Time [s]': 0.032,
        'Client CPU Time [s]': 1.756,
        'End to End Response Time [s]': 1.444,
        'Number of Sequential Http Round Trips': 2,
        'Time to Visually Complete [s]': 1.523,
        'Time to Last Significant Change [s]': 1.360,
        'Dynatrace APM CPU Time [s]': 0.037
    },
    '035_Load Matching Candidates': {
        'Canary_HANA_Cloud HANA CPU Time [s]': 3.569,
        'Client CPU Time [s]': 2.393,
        'End to End Response Time [s]': 2.509,
        'Number of Sequential Http Round Trips': 2,
        'Time to Visually Complete [s]': 2.357,
        'Time to Last Significant Change [s]': 2.306,
        'Dynatrace APM CPU Time [s]': 0.046
    },
    '040_Pick The Resource Request': {
        'Canary_HANA_Cloud HANA CPU Time [s]': 0.006,
        'Client CPU Time [s]': 0.446,
        'End to End Response Time [s]': 0.754,
        'Number of Sequential Http Round Trips': 1,
        'Time to Visually Complete [s]': 0.748,
        'Time to Last Significant Change [s]': 0.748,
        'Dynatrace APM CPU Time [s]': 0.053
    },
    '050_Forward The Resource Request': {
        'Canary_HANA_Cloud HANA CPU Time [s]': 0.010,
        'Client CPU Time [s]': 0.474,
        'End to End Response Time [s]': 0.799,
        'Number of Sequential Http Round Trips': 1,
        'Time to Visually Complete [s]': 0.813,
        'Time to Last Significant Change [s]': 0.813,
        'Dynatrace APM CPU Time [s]': 0.061
    },
    '060_Resolve the Resource Request': {
        'Canary_HANA_Cloud HANA CPU Time [s]': 0.007,
        'Client CPU Time [s]': 0.509,
        'End to End Response Time [s]': 0.995,
        'Number of Sequential Http Round Trips': 1,
        'Time to Visually Complete [s]': 0.956,
        'Time to Last Significant Change [s]': 0.764,
        'Dynatrace APM CPU Time [s]': 0.052
    }
};

const ExpectedData = {
    "F4723_ManageResourceRequest": manageAppExpectation,
    "F4725_StaffResourceRequest": staffAppExpectation
};

const VariationLimit = {
    'Canary_HANA_Cloud HANA CPU Time [s]': 0.1,
    'Client CPU Time [s]': 0.5,
    'End to End Response Time [s]': 0.5,
    'Time to Visually Complete [s]': 0.5,
    'Time to Last Significant Change [s]': 0.5,
    'Dynatrace APM CPU Time [s]': 0.1,
    'Number of Sequential Http Round Trips': 0.5
};


module.exports = { ExpectedData, VariationLimit };
