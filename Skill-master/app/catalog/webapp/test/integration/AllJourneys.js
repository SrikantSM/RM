sap.ui.require([
  "sap/fe/test/JourneyRunner",
  "sap/fe/test/Shell",
  "skill-catalog/test/integration/pages/MainListReport",
  "skill-catalog/test/integration/pages/MainObjectPage"
], function (JourneyRunner, Shell, MainListReport, MainObjectPage) {
  "use strict";
  var oJourneyRunner = new JourneyRunner({
    launchUrl: sap.ui.require.toUrl("skill-catalog/app") + ".html",
    launchParameters: {
      serverDelay: 0,
      responderOn: true,
      demoApp: "skill-catalog",
      "sap-ui-language": sap.ui.getCore().getConfiguration().getLanguage()
    },
    opaConfig: {
      // if possible, read from karma config and convert back to seconds
      // eslint-disable-next-line no-undef
      timeout: (__karma__ && __karma__.config.opaTimeout && (__karma__.config.opaTimeout / 1000)) || 15
    },
    pages: {
      onTheMainPage: MainListReport, onTheDetailPage: MainObjectPage, onTheShell: new Shell()
    }
  });

  oJourneyRunner.run(
    "skill-catalog/test/integration/MainJourney"
  );
});
