const skillAppExpectation = {
  '0110_UploadSkills_Open the Manage Skills app': {
    'Client CPU Time [s]': 3.382,
    'End to End Response Time [s]': 2.352,
    'Number of Sequential Http Round Trips': 2.25,
    'Time to Visually Complete [s]': 2.346,
    'Time to Last Significant Change [s]': 2.186,
    'Dynatrace APM CPU Time [s]': 0.027,
  },
  '0120_UploadSkills_Press the upload button': {
    'Client CPU Time [s]': 1.078,
    'End to End Response Time [s]': 1.128,
    'Number of Sequential Http Round Trips': 2,
    'Time to Visually Complete [s]': 2.22,
    'Time to Last Significant Change [s]': 1.032,
    'Dynatrace APM CPU Time [s]': 0.026,
  },
  '0130_UploadSkills_Press upload selected file': {
    // 'Client CPU Time [s]': '',
    // 'End to End Response Time [s]': '',
    'Number of Sequential Http Round Trips': 2,
    'Time to Visually Complete [s]': 1.451,
    'Time to Last Significant Change [s]': 0.723,
    'Dynatrace APM CPU Time [s]': 0.03,
  },
  '0140_UploadSkills_Wait for the asynchronous file upload to finish': {
    // 'Client CPU Time [s]': '',
    // 'End to End Response Time [s]': '',
    'Number of Sequential Http Round Trips': 8,
    'Time to Visually Complete [s]': 38.680,
    'Time to Last Significant Change [s]': 0.387,
    'Dynatrace APM CPU Time [s]': 0.037,
  },
  '0210_SkillSearch_Press enter to start the search': {
    'Client CPU Time [s]': 1.64,
    'End to End Response Time [s]': 1.753,
    'Number of Sequential Http Round Trips': 1,
    'Time to Visually Complete [s]': 1.6278,
    'Time to Last Significant Change [s]': 1.628,
    'Dynatrace APM CPU Time [s]': 0.026,
  },
  '0310_MaintainSkill_Press edit': {
    'Client CPU Time [s]': 2.792,
    'End to End Response Time [s]': 2.773,
    'Number of Sequential Http Round Trips': 2,
    'Time to Visually Complete [s]': 3.042,
    'Time to Last Significant Change [s]': 2.515,
    'Dynatrace APM CPU Time [s]': 0.042,
  },
  '0320_MaintainSkill_Press Save': {
    'Client CPU Time [s]': 1.87,
    'End to End Response Time [s]': 2.061,
    'Number of Sequential Http Round Trips': 3,
    'Time to Visually Complete [s]': 1.856,
    'Time to Last Significant Change [s]': 1.835,
    'Dynatrace APM CPU Time [s]': 0.039,
  },
};
const ExpectedData = {
  F4704_Skill: skillAppExpectation,
};

const VariationLimit = {
  'Canary_HANA_Cloud HANA CPU Time [s]': 0.1,
  'Client CPU Time [s]': 0.5,
  'End to End Response Time [s]': 0.5,
  'Time to Visually Complete [s]': 0.5,
  'Time to Last Significant Change [s]': 0.5,
  'Dynatrace APM CPU Time [s]': 0.1,
  'Number of Sequential Http Round Trips': 0.5,
};

module.exports = { ExpectedData, VariationLimit };
