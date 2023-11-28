const axios = require('axios');
const https = require('https');
const fs = require('fs').promises;

process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection', error);
  process.exit(1);
});

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPOSITORY = process.env.REPOSITORY || 'Cloud4RM/ResourceManagementDocumentation';
const REVIEWERS = process.env.REVIEWERS ? JSON.parse(process.env.REVIEWERS) : [];
const TARGET_BRANCH = process.env.TARGET_BRANCH || 'generatedSkillTestScenarios';
const LOCAL_TEST_CASE_MARKDOWN_FOLDER = process.env.LOCAL_TEST_CASE_MARKDOWN_FOLDER || `${__dirname}/../../target/TestCases`;
const GIT_TEST_CASE_MARKDOWN_FOLDER = process.env.GIT_TEST_CASE_MARKDOWN_FOLDER || 'Functional/TestCaseDocument/RM_AllApps_TestCase';
const CREATE_PR = !!process.env.CREATE_PR || false;

function getAxiosInstance() {
  return axios.create({
    baseURL: 'https://github.tools.sap/api/v3/',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
    validateStatus: () => true, // Do not throw if there is an error
  });
}

async function getFileFromBranch(axiosInstance, branchName, fileName) {
  const res = await axiosInstance.get(`/repos/${REPOSITORY}/contents/${GIT_TEST_CASE_MARKDOWN_FOLDER}/${fileName}`, {
    params: {
      ref: `refs/heads/${branchName}`,
    },
  });

  switch (res.status) {
    case 200:
      return res.data;
    case 404:
      return { name: fileName };
    default:
      throw new Error(`Unexpected error while searching for the master file ${fileName}: ${JSON.stringify(res.data)}`);
  }
}

async function getBranchInfo(axiosInstance, branchName) {
  const res = await axiosInstance.get(`/repos/${REPOSITORY}/git/refs/heads/${branchName}`);

  switch (res.status) {
    case 200:
      return res.data;
    case 404:
      return null;
    default:
      throw new Error(`Unexpected error while searching for the branch ${branchName}: ${JSON.stringify(res.data)}`);
  }
}

async function createBranch(axiosInstance, baseHash, branchName) {
  const res = await axiosInstance.post(`/repos/${REPOSITORY}/git/refs`, {
    ref: `refs/heads/${branchName}`,
    sha: baseHash,
  });

  if (res.status === 201) {
    return res.data;
  }

  throw new Error(`Unexpected error while creating the branch ${branchName} on the base ${baseHash}: ${JSON.stringify(res.data)}`);
}

async function ensureBranch(axiosInstance, baseHash, branchName) {
  const branch = await getBranchInfo(axiosInstance, branchName);

  if (!branch) {
    console.log(`Creating branch ${TARGET_BRANCH}`);
    await createBranch(axiosInstance, baseHash, branchName);
  }
}

async function getPullRequestForBranch(axiosInstance, branchName) {
  const res = await axiosInstance.get(`/repos/${REPOSITORY}/pulls`);

  if (res.status !== 200) {
    throw new Error(`Unexpected error while creating the pull request for the branch ${branchName}: ${JSON.stringify(res.data)}`);
  }

  return res.data.find((pr) => pr.head.ref === branchName);
}

async function createPullRequest(axiosInstance, branchName) {
  const res = await axiosInstance.post(`/repos/${REPOSITORY}/pulls`, {
    title: 'Update test case documents for the skill domain',
    body: 'This pull request was automatically created by the [end to end test case generation utility](https://github.tools.sap/Cloud4RM/ResourceManagementDocumentation/blob/master/POC\'s/E2E%20Test%20Case%20Generation/E2ETestCaseGeneration.md). The changes incorporate the latest version of the [End to End Tests of the Skill domain](https://github.tools.sap/Cloud4RM/Skill/tree/master/tests/end-to-end).',
    head: branchName,
    base: 'master',
  });

  if (res.status === 201) {
    return res.data;
  }

  throw new Error(`Unexpected error while creating the pull request for the branch ${branchName}: ${JSON.stringify(res.data)}`);
}

async function requestPullRequestReview(axiosInstance, pr, reviewers) {
  const res = await axiosInstance.post(`/repos/${REPOSITORY}/pulls/${pr.number})/requested_reviewers`, {
    reviewers,
  });

  if (res.status === 201) {
    return res.data;
  }

  throw new Error(`Unexpected error while requesting a review for the pull request ${pr.number}: ${JSON.stringify(res.data)}`);
}

async function upsertFile(axiosInstance, branchName, baseHash, fileName, content) {
  const res = await axiosInstance.put(`/repos/${REPOSITORY}/contents/${GIT_TEST_CASE_MARKDOWN_FOLDER}/${fileName}`, {
    message: `Update ${fileName}`,
    sha: baseHash,
    content,
    branch: branchName,
  });

  if (res.status < 300) {
    return res.data;
  }

  throw new Error(`Unexpected error while upserting the file ${fileName}: ${JSON.stringify(res.data)}`);
}

async function processFile(axiosInstance, masterBranch, targetBranch, localFileName) {
  const localContent = await fs.readFile(`${LOCAL_TEST_CASE_MARKDOWN_FOLDER}/${localFileName}`);
  const encodedLocalContent = Buffer.from(localContent).toString('base64');

  const gitFile = await getFileFromBranch(axiosInstance, targetBranch ? TARGET_BRANCH : 'master', localFileName);

  if (!gitFile.content) {
    console.log(`File ${localFileName} is new`);

    await ensureBranch(axiosInstance, masterBranch.object.sha, TARGET_BRANCH);
    const result = await upsertFile(axiosInstance, TARGET_BRANCH, undefined, localFileName, encodedLocalContent);
    console.log(`"${result.commit.message}" (${result.commit.sha})`);
    return true;
  }

  // Base64-encoded data from GitHub is split into different lines
  if ((gitFile.content || '').replace(/\r?\n|\r/g, '') !== encodedLocalContent) {
    console.log(`File ${localFileName} is changed`);

    await ensureBranch(axiosInstance, masterBranch.object.sha, TARGET_BRANCH);
    const result = await upsertFile(axiosInstance, TARGET_BRANCH, gitFile.sha, localFileName, encodedLocalContent);
    console.log(`"${result.commit.message}" (${result.commit.sha})`);
    return true;
  }

  console.log(`File ${localFileName} is unchanged`);
  return false;
}

async function main() {
  console.log(`Pushing the test scenario Markdown files to ${REPOSITORY}...`);

  const axiosInstance = getAxiosInstance();

  const masterBranch = await getBranchInfo(axiosInstance, 'master');
  const targetBranch = await getBranchInfo(axiosInstance, TARGET_BRANCH);

  const fileNames = await fs.readdir(LOCAL_TEST_CASE_MARKDOWN_FOLDER);

  let hasChangedFiles = false;
  for (const fileName of fileNames) {
    hasChangedFiles = await processFile(axiosInstance, masterBranch, targetBranch, fileName) || hasChangedFiles;
  }

  if (CREATE_PR && hasChangedFiles) {
    let pr = await getPullRequestForBranch(axiosInstance, TARGET_BRANCH);
    if (!pr) {
      console.log(`Creating pull request for branch ${TARGET_BRANCH}`);
      pr = await createPullRequest(axiosInstance, TARGET_BRANCH);

      if (REVIEWERS.length > 0) {
        await requestPullRequestReview(axiosInstance, pr, REVIEWERS);
      }
    }
    console.log(pr.html_url);
  }

  console.log('Done');
}
main();
