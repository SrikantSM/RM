/* !
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library resourceRequestLibrary.
 */
sap.ui.define(["sap/ui/core/library"], // library dependency
	function() {
		/**
		 *
		 *
		 * @namespace
		 * @name resourceRequestLibrary
		 * @author SAP SE
		 * @version 1.0.0
		 * @public
		 */

		// delegate further initialization of this library to the Core
		sap.ui.getCore().initLibrary({
			name: "resourceRequestLibrary",
			version: "1.0.0",
			dependencies: ["sap.ui.core"],
			noLibraryCSS: true,
			types: [],
			interfaces: [],
			controls: [],
			elements: []
		});

		/* eslint-disable */
		return resourceRequestLibrary;
		/* eslint-enable */
	}, /* bExport= */ false);
