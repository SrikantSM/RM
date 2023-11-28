sap.ui.require([
  "sap/fe/test/JourneyRunner",
  "sap/fe/test/Shell",
  "skill/test/integration/pages/MainListReport",
  "skill/test/integration/pages/MainObjectPage"
], function (JourneyRunner, Shell, MainListReport, MainObjectPage) {
  "use strict";
  var oJourneyRunner = new JourneyRunner({
    launchUrl: sap.ui.require.toUrl("skill/app") + ".html", // MANDATORY: Compare resource root definitions in karma.base.conf.js
    launchParameters: {
      serverDelay: 0,
      responderOn: true,
      demoApp: "skill",
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
    "skill/test/integration/MainJourney",
    "skill/test/integration/ErrorJourney",
    "skill/test/integration/ActionJourney"
  );
});
