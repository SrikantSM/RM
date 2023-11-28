sap.ui.require([
  "sap/fe/test/JourneyRunner",
  "sap/fe/test/Shell",
  "skill-proficiency/test/integration/pages/MainListReport",
  "skill-proficiency/test/integration/pages/MainObjectPage",
  "skill-proficiency/test/integration/pages/SubObjectPage"
], function (JourneyRunner, Shell, MainListReport, MainObjectPage, SubObjectPage) {
  "use strict";
  var oJourneyRunner = new JourneyRunner({
    launchUrl: sap.ui.require.toUrl("skill-proficiency/app") + ".html",
    launchParameters: {
      serverDelay: 0,
      responderOn: true,
      demoApp: "skill-proficiency",
      "sap-ui-language": sap.ui.getCore().getConfiguration().getLanguage()
    },
    opaConfig: {
      // if possible, read from karma config and convert back to seconds
      // eslint-disable-next-line no-undef
      timeout: (__karma__ && __karma__.config.opaTimeout && (__karma__.config.opaTimeout / 1000)) || 15
    },
    pages: {
      onTheMainPage: MainListReport, onTheDetailPage: MainObjectPage, onTheSubObjectPage: SubObjectPage, onTheShell: new Shell()
    }
  });

  oJourneyRunner.run(
    "skill-proficiency/test/integration/MainJourney",
    "skill-proficiency/test/integration/DragAndDropJourney",
    "skill-proficiency/test/integration/MoveButtonVisibilityJourney",
    "skill-proficiency/test/integration/ErrorJourney"
  );
});
