const SkillUploadApp = require('./SkillUploadApp');

const messageStripGetterNormal = SkillUploadApp.messageStrip.getCurrent;
const messageStripGetterWithoutUploadJob = SkillUploadApp.messageStrip.getCurrentWithoutUploadJob;
const { uploadButton } = SkillUploadApp.fileUploadForm;
const customDataKeyUploadRunning = 'data-uploadrunning';
let uploadJobId = '';

/**
 * This callback returns a message strip element
 *
 * @callback messageStripGetterCallback
 * @returns {Element} element to work upon
 */

/**
 * This callback returns a goal state to wait for
 *
 * @callback goalStateGetterCallback
 * @returns {Promise<boolean>} goal state to match for
 */

/**
 * Perform an upload safely:
 * - Handle initial upload
 * - Wait for previous upload jobs
 * - Wait for the upload to finish
 * - Retry in situations where another upload was started and the UI hasn't updated to show it yet
 * @returns {Promise} with no value
 */
async function performUploadSafe() {
  try {
    await waitForPreviousJobToFinish();
    expect(uploadButton.asControl().getProperty('enabled')).toBe(true, 'Button must be enabled, so we can properly click it');
    await uploadButton.click();
    if (await concurrentUploadJobRunning()) {
      // if we have a concurrently running upload, we should retry at a later point in time.
      await browser.sleep(5000);
      console.log('Retrying upload as previous upload was aborted due to a concurrent upload');
      return performUploadSafe();
    }
    uploadJobId = await SkillUploadApp.uploadJobId();
    await waitForUploadToFinish();
  } catch (e) {
    // in case of any unexpected failure, fail:
    expect(true).toBe(false, e);
  }
  return undefined;
}

/**
 * Check if an upload job was started concurrently (e. g. by another parallel test run).
 * @returns {Promise<boolean>} true if an concurrent upload was running, false otherwise
 */
async function concurrentUploadJobRunning() {
  const isPresent = await safeIsPresent(messageStripGetterWithoutUploadJob);
  if (!isPresent) return false;
  const messageCode = await messageStripGetterWithoutUploadJob().getAttribute('data-messagecode');
  return messageCode === '409';
}

/**
 * Wait safely for the previous upload job to finish
 * - Handle initial upload, when there is no previous job
 * - Wait for previous upload job
 * - Give more time for the other test to fetch the results (defined by sleepTime)
 * - Recurse, to reduce the risk that a parallel test started another job in the meantime
 * @param {number} sleepTime in ms
 * @returns {Promise} with no value
 */
async function waitForPreviousJobToFinish(sleepTime = 5000) {
  // if there is a message strip from a previous job
  if (await safeIsPresent(messageStripGetterNormal) === true) {
    // if that job is still running
    if (await isUploadInProgress()) {
      // wait for upload from other test to finish
      await waitForNoUploadInProgress();
      // wait some more, so the other test has time to receive the result
      await browser.sleep(sleepTime);
      // recurse to reduce the risk that a parallel job started in the meantime
      return waitForPreviousJobToFinish(sleepTime);
    }
  }
  return undefined;
}

/**
 * An upload can be either running by the own user (info strip) or by another user (warning strip). In both cases,
 * a custom data DOM attribute in the message strip indicates that an upload is running
 * @returns {Promise<boolean>} whether an upload is currently running
 */
async function isUploadInProgress() {
  return !!(await safeGetAttribute(messageStripGetterNormal, customDataKeyUploadRunning));
}

/**
 * Wait safely for the upload job to finish
 * - Wait a bit, so the MessageStrip is the one for the current upload
 * - Wait for the job to finish
 * @param {number} initialWait in ms
 * @param {number} cycleSleep How long to sleep between each check? (in ms)
 * @param {number} maxTotalSleep How long to sleep in total before aborting with error? (in ms)
 * @returns {Promise} with no value
 */
async function waitForUploadToFinish(initialWait = 1000, cycleSleep = 100, maxTotalSleep = 10000) {
  // wait a bit for message strip to be refreshed for the current upload, so we don't jump to any conclusions about being ready
  await browser.sleep(initialWait);
  // wait for upload to finish
  await waitForNoUploadInProgress(cycleSleep, maxTotalSleep);
}

/**
 * Wait for the message strip to be in a different state than 'Information'
 * @param {number} cycleSleep How long to sleep between each check? (in ms)
 * @param {number} maxTotalSleep How long to sleep in total before aborting with error? (in ms)
 * @returns {Promise} with no value
 */
async function waitForNoUploadInProgress(cycleSleep = 100, maxTotalSleep = 10000) {
  return waitingLoop(async () => (await isUploadInProgress() === false), 'MessageStrip indicates no upload in progress', cycleSleep, maxTotalSleep);
}

/**
 * Wait for a goal (specified by an async function returning a boolean) to be reached, waiting between checking.
 * This method is useful for waiting for completion of long-running background tasks that exceed UIVeri5's timeouts
 * @param {goalStateGetterCallback} asyncGoalFn Function defining the goal state
 * @param {string} conditionMessage Message (logged in waiting and error cases)
 * @param {number} cycleSleep How long to sleep between each check? (in ms)
 * @param {number} maxTotalSleep How long to sleep in total before aborting with error? (in ms)
 * @returns {Promise} with no value
 */
async function waitingLoop(asyncGoalFn, conditionMessage, cycleSleep, maxTotalSleep) {
  const maxCycles = maxTotalSleep / cycleSleep;
  let i = 1;
  while (!(await asyncGoalFn())) {
    if (i > maxCycles) {
      throw new Error(`Condition "${conditionMessage}" not met in time`);
    }
    console.log(`waiting, as "${conditionMessage}" is not yet fulfilled (cycle ${i}/${maxCycles})`);
    browser.sleep(cycleSleep);
    i += 1;
  }
}

/**
 * Avoid the "StaleElementReferenceError" // "not part of a control DOM representation tree" (depending on chrome version) issue:
 * asControl() gets the control of the currently visible message strip. If the strip then is updated, becomes invisible and replaced by a new one, getProperty might throw that error.
 * In this case, we must just try again so the messageStripGetter targets the new one.
 * @param {messageStripGetterCallback} messageStripGetter to get safely
 * @param {string} attributeName to get safely
 * @returns {Promise} with no value
 */
async function safeGetAttribute(messageStripGetter, attributeName) {
  try {
    return await messageStripGetter().getAttribute(attributeName);
  } catch (error) {
    if (error.toString().includes('StaleElementReferenceError') || error.toString().includes('not part of a control DOM representation tree')) {
      console.log('retrying to getAttribute, as the control was removed from the DOM during the operation');
      return safeGetAttribute(messageStripGetter, attributeName);
    }
    throw error;
  }
}

/**
 * Avoid the "NoSuchElementError" issue when checking for message strip presence:
 * If no strip is visible, a NoSuchElementError might be thrown. We must return false in this case.
 * @param {messageStripGetterCallback} messageStripGetter returns a message strip to work upon
 * @returns {Promise} with no value
 */
async function safeIsPresent(messageStripGetter) {
  try {
    return await messageStripGetter().isPresent();
  } catch (error) {
    if (error.toString().includes('NoSuchElementError')) {
      console.log('NoSuchElementError with isPresent, returning false');
      return false;
    }
    throw error;
  }
}

/**
 * Assert the message strip type safely, only if there wasn't another upload in between
 * @param {String} expectedType The type of the message strip, e. g. Warning
 * @param {String} previousUploadJobId Optionally to hand over in case performUploadSafe wasn't used for the upload
 * @returns {Promise} with no value
 */
async function assertMessageStripTypeSafe(expectedType, previousUploadJobId) {
  console.log(`previousUploadJobId: <${previousUploadJobId}>, uploadJobId: <${uploadJobId}>`);
  uploadJobId = previousUploadJobId || uploadJobId;
  const [currentUploadJobId, actualType] = await Promise.all([
    SkillUploadApp.uploadJobId(),
    messageStripGetterNormal().asControl().getProperty('type'),
  ]);
  if (currentUploadJobId === uploadJobId) {
    expect(actualType).toBe(expectedType);
  } else if (!uploadJobId) {
    console.warn('[WARNING] Recorded upload job id is empty. No comparison possible!');
  } else {
    console.warn(`[WARNING] The MessageStrip type can't be validated because another upload with id <${currentUploadJobId}>
      has been started before the UI was updated to show the result message strip for
      this upload with id <${uploadJobId}>.`);
  }
}

module.exports.performUploadSafe = performUploadSafe;
module.exports.waitForUploadToFinish = waitForUploadToFinish;
module.exports.assertMessageStripTypeSafe = assertMessageStripTypeSafe;
