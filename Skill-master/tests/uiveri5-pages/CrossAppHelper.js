async function performCrossNavigation(semanticLink) {
  await semanticLink.click();
  // element(by.control({
  //   id: /application-.+---idInfoPanel--idPersonalizationButton/,
  // })).click();
  // element(by.control({
  //   controlType: 'sap.ui.mdc.link.PanelListItem',
  //   ancestor: { controlType: 'sap.m.Dialog' },
  // })).element(by.control({
  //   controlType: 'sap.m.Link',
  // })).click();
}

module.exports.performCrossNavigation = performCrossNavigation;
