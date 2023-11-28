sap.ui.define(function () {
  "use strict";
  return {
    messageStripVisibleSuccess: function (sState, sJobOwner, sCurrentUser) {
      return (sJobOwner !== undefined && sCurrentUser !== undefined && sJobOwner === sCurrentUser && sState === "success");
    },

    messageStripVisibleWarning: function (sState, sJobOwner, sCurrentUser) {
      return (sJobOwner !== undefined && sCurrentUser !== undefined && sJobOwner === sCurrentUser && sState === "warning");
    },

    messageStripVisibleInterrupt: function (sState, sJobOwner, sCurrentUser) {
      return (sJobOwner !== undefined && sCurrentUser !== undefined && sJobOwner === sCurrentUser && sState === "interrupted");
    },

    messageStripVisibleError: function (sState, sJobOwner, sCurrentUser) {
      return (sJobOwner !== undefined && sCurrentUser !== undefined && sJobOwner === sCurrentUser && sState === "error");
    },

    messageStripTextError: function (sErrorMessage) {
      return sErrorMessage || this.getView().getModel("i18n").getResourceBundle().getText("uploadError");
    },

    messageStripVisibleRunning: function (sState, sJobOwner, sCurrentUser) {
      return (sJobOwner !== undefined && sCurrentUser !== undefined && sJobOwner === sCurrentUser && sState === "running");
    },

    messageStripVisibleLastUpdatedBy: function (sState, sJobOwner, sCurrentUser) {
      return (sJobOwner !== undefined && sCurrentUser !== undefined && sJobOwner !== sCurrentUser && sState !== "running" && sState !== "initial");
    },

    messageStripVisibleUploadRunningBy: function (sState, sJobOwner, sCurrentUser) {
      return (sJobOwner !== undefined && sCurrentUser !== undefined && sJobOwner !== sCurrentUser && sState === "running");
    },

    uploadButtonEnabled: function (sState, bBusy) {
      return (sState !== undefined && sState !== "running" && bBusy !== true);
    },

    uploadErrorAffectedEntityVisible: function (sAffectedEntity) {
      return sAffectedEntity !== null;
    },

    uploadErrorCountSingularVisible: function (iUploadErrorCount) {
      return iUploadErrorCount === 1;
    },

    uploadErrorCountPluralVisible: function (iUploadErrorCount) {
      return (iUploadErrorCount || 0) > 1;
    },

    messageStripInterrupt: function (skillsTotalCount, createdSkillsCount, updatedSkillsCount, failedSkillsCount, unprocessedSkillsCount) {
      var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
      return oResourceBundle.getText("uploadInterrupt", [skillsTotalCount - unprocessedSkillsCount, createdSkillsCount, updatedSkillsCount, failedSkillsCount, unprocessedSkillsCount]);
    },

    uploadErrorMessageSubTitle: function (iCount, sAffectedEntity) {
      var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

      if (sAffectedEntity !== null) {
        return oResourceBundle.getText("errorDialogAffectedEntity", sAffectedEntity);
      } else if (iCount === 1) {
        return oResourceBundle.getText("errorDialogAffectedCountSingular", iCount);
      } else {
        return oResourceBundle.getText("errorDialogAffectedCountPlural", iCount);
      }
    },

    uploadErrorTypeGroupName: function (sUploadErrorType) {
      var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
      switch (sUploadErrorType) {
      case "2-parsing":
        return oResourceBundle.getText("uploadErrorTypeParsing");
      case "3-save":
        return oResourceBundle.getText("uploadErrorTypeSave");
      case "4-missingCatalog":
        return oResourceBundle.getText("uploadErrorTypeMissingCatalog");
      default:
        return "";
      }
    },

    uploadErrorTypeType: function (sUploadErrorType) {
      switch (sUploadErrorType) {
      case "2-parsing":
        return "Error";
      case "3-save":
        return "Warning";
      case "4-missingCatalog":
        return "Information";
      default:
        return "Error";
      }
    }
  };
});
