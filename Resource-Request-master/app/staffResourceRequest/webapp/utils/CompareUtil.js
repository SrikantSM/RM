sap.ui.define(["sap/m/MessageToast"], function(MessageToast) {
	const SCREEN_MAX_SIZES = {
		PHONE: 720,
		TABLET: 1080,
		DESKTOP: 1680
	};

	const ITEMS_COUNT_PER_SCREEN_SIZE = {
		PHONE: 1,
		TABLET: 2,
		DESKTOP: 3,
		FULLSCREEN: 4
	};
	return {
		// /**
		//  * Adds the page count.
		//  * @public
		//  * @param {int} iWidth size of window.
		//  * @return {int} iPagesCount with added days.
		//  */

		getPagesCount: function(iWidth, iSelectedItems) {
			const iAllProducts = iSelectedItems;
			let iPagesCount;
			// this = that;

			if (iWidth <= SCREEN_MAX_SIZES.PHONE) {
				iPagesCount = ITEMS_COUNT_PER_SCREEN_SIZE.PHONE;
			} else if (iWidth <= SCREEN_MAX_SIZES.TABLET) {
				iPagesCount = ITEMS_COUNT_PER_SCREEN_SIZE.TABLET;
			} else if (iWidth <= SCREEN_MAX_SIZES.DESKTOP) {
				iPagesCount = ITEMS_COUNT_PER_SCREEN_SIZE.DESKTOP;
			} else {
				iPagesCount = ITEMS_COUNT_PER_SCREEN_SIZE.FULLSCREEN;
			}

			if (iAllProducts && iPagesCount > iAllProducts) {
				iPagesCount = iAllProducts;
			}

			return iPagesCount;
		},

		getObjectStatusCriticality: function(percentageValue) {
			let criticality;
			if (percentageValue >= 80) {
				criticality = "Success";
			} else if (percentageValue >= 50 && percentageValue < 80) {
				criticality = "Warning";
			} else {
				criticality = "Error";
			}
			return criticality;
		},

		getMicrochartCriticality: function(percentageValue) {
			let criticality;
			if (percentageValue >= 80) {
				criticality = "Good";
			} else if (percentageValue >= 50 && percentageValue < 80) {
				criticality = "Critical";
			} else {
				criticality = "Error";
			}
			return criticality;
		},

		checkIsDesktop: function(iPagesCount) {
			return iPagesCount === ITEMS_COUNT_PER_SCREEN_SIZE.DESKTOP;
		},

		setTextForAction: function(aSelectedContexts, i18nBundle, oCompareButton) {
			if (aSelectedContexts.length === 0) {
				oCompareButton.setText(i18nBundle.getText("COMPARE"));
			} else {
				oCompareButton.setText(i18nBundle.getText("COMPARE") + " (" + aSelectedContexts.length + ")");
			}
		}
	};
});
