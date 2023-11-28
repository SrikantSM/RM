sap.ui.define(
	[
		"capacityGridUi/reuse/controller/BaseComponentController",
		"sap/ui/core/message/Message",
		"sap/base/Log",
		"sap/m/MessageBox",
		"capacityGridUi/view/draft/DraftActions"
	],
	function (BaseComponentController, Message, Log, MessageBox, DraftActions) {
		"use strict";

		let MILLIS_PER_MINUTE = 60 * 1000;
		let TIMEOUT_MINUTES = 10;
		let INTERVAL_MINUTES = 1;
		let EVENTS = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];

		return BaseComponentController.extend("capacityGridUi.view.draft.DraftKeepAlive", {
			_fnRecordUserActivityBound: undefined,
			_iTimeoutTriggerCheckLock: undefined,
			_iTimeoutAddUserEvents: undefined,
			_iIntervalCheckAndRenewLock: undefined,
			_iTimeOfLastUserActivity: undefined,
			_iTimeout: undefined,
			_iInterval: undefined,

			// ~~~ public ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

			constructor: function () {
				BaseComponentController.apply(this, arguments);
				this.injectMembers();
				this._fnRecordUserActivityBound = this._recordUserActivity.bind(this);
				this._iTimeout = TIMEOUT_MINUTES * MILLIS_PER_MINUTE;
				this._iInterval = INTERVAL_MINUTES * MILLIS_PER_MINUTE;
				this._oLogger = Log.getLogger("capacityGridUi.view.table.DraftKeepAlive");
			},

			start: function () {
				this._oLogger.debug("start");
				this._recordUserActivity();
				this._iTimeoutTriggerCheckLock = setTimeout(this._triggerCheckLock.bind(this), this._iTimeout);
				this._iTimeoutAddUserEvents = setTimeout(this._addUserEvents.bind(this), this._iTimeout);
			},

			stop: function () {
				this._oLogger.debug("stop");
				if (this._iTimeoutTriggerCheckLock) {
					clearTimeout(this._iTimeoutTriggerCheckLock);
				}
				if (this._iTimeoutAddUserEvents) {
					clearTimeout(this._iTimeoutAddUserEvents);
				}
				if (this._iIntervalCheckAndRenewLock) {
					clearInterval(this._iIntervalCheckAndRenewLock);
				}
				this._removeUserEvents();
			},

			// this is for automated testing
			configure: function (iTimeout, iInterval) {
				this._oLogger.debug("configure");
				this._iTimeout = iTimeout;
				this._iInterval = iInterval;
			},

			// ~~~ private ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

			_triggerCheckLock: function () {
				this._oLogger.debug("_triggerCheckLock");
				this._iIntervalCheckAndRenewLock = setInterval(this._checkUserActive.bind(this), this._iInterval);
			},

			_addUserEvents: function () {
				this._oLogger.debug("_addUserEvents");
				EVENTS.forEach(
					function (sName) {
						window.document.addEventListener(sName, this._fnRecordUserActivityBound);
					}.bind(this)
				);
			},

			_removeUserEvents: function () {
				this._oLogger.debug("_removeUserEvents");
				EVENTS.forEach(
					function (sName) {
						window.document.removeEventListener(sName, this._fnRecordUserActivityBound);
					}.bind(this)
				);
			},

			_recordUserActivity: function () {
				this._iTimeOfLastUserActivity = Date.now();
			},

			_checkUserActive: function () {
				let iPassedMillis = Date.now() - this._iTimeOfLastUserActivity;
				let bUserActive = iPassedMillis < this._iInterval;
				this._oLogger.debug("_checkUserActive, active: " + bUserActive);
				if (bUserActive) {
					this._renewOutdatedDrafts();
				}
			},

			_renewOutdatedDrafts: function () {
				let iNow = Date.now();
				let aChangedAssignmentPaths = this.models.table.getChangedAssignmentPaths();
				for (let sAsgPath of aChangedAssignmentPaths) {
					let oAsg = this.models.table.getProperty(sAsgPath);
					if (!oAsg.draftExists) {
						continue;
					}
					let bOutdated = iNow - oAsg.draftTime > this._iTimeout;
					this._oLogger.debug("_renewDrafts, assignment " + oAsg.asgId + ": " + bOutdated);
					if (bOutdated) {
						let oPromise = this._sendRenewDraft(oAsg);
						oPromise
							.then(() => {
								this.models.table.setProperty(sAsgPath + "/draftTime", iNow);
							})
							.catch(this._onRenewError.bind(this, oAsg.asgId));
					}
				}
			},

			_sendRenewDraft: function (oAsg) {
				let sessionGuid = "$auto.test";
				let oPromise = oAsg.oContext.setProperty("action", DraftActions.EXTEND_EXPIRY, sessionGuid);
				return oPromise;
			},

			_onRenewError: function (sAsgId, oError) {
				MessageBox.error("Failed to renew draft for assignment " + sAsgId); // TODO i18n, old text RENEW_DRAFT_ERROR has wrong params
			}
		});
	}
);
