/**
 * Make sure the Filter Bar is expanded
 * @param {{ expandButton: Element }} filterBar Object of matchers for the filterBar, including expandButton
 * @returns {undefined}
 */
async function ensureExpanded(filterBar) {
  if (await filterBar.expandButton.isPresent()) {
    await filterBar.expandButton.click();
  }
}

/**
 * Search for e.g. the testRunID, making sure the filterBar was expanded before
 * @param {{ expandButton: Element, searchField: Element, searchFieldPress: Element, goButton: Element }} filterBar Object of matchers for the filterBar, including expandButton, searchField, searchFieldPress and goButton
 * @param {string} searchText text to search for
 * @returns {undefined}
 */
async function searchFor(filterBar, searchText) {
  await ensureExpanded(filterBar);
  await filterBar.searchField.clear();
  if (searchText) {
    await filterBar.searchField.sendKeys(searchText);
  }
  await filterBar.searchFieldPress.click();
  await filterBar.goButton.click();
}

/**
 * Filter for a text in a given field
 * @param {{ expandButton: Element, goButton: Element }} filterBar Object of matchers for the filterBar, including expandButton and goButton
 * @param {object} filterField Field element to enter filter text
 * @param {string} filterText text to search for
 * @returns {undefined}
 */
async function filterFor(filterBar, filterField, filterText) {
  await ensureExpanded(filterBar);
  await filterField.clear();
  if (filterText) {
    await filterField.sendKeys(filterText);
  }
  await filterBar.goButton.click();
}

module.exports.searchFor = searchFor;
module.exports.filterFor = filterFor;
module.exports.ensureExpanded = ensureExpanded;
