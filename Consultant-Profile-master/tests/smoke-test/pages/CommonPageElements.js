var elements = {
    consultantProfileTile: element(by.control({
    	  controlType: "sap.m.GenericTile",
    	  properties: {header: "My Project Experience"}
    })),

	editButton: element(by.control({
		controlType: "sap.uxap.ObjectPageDynamicHeaderTitle"
	})).element(by.control({
		controlType: "sap.m.Button",
		properties: {
			text: "Edit"
		}
	}))
};

var actions = {
    openMyProjectExperienceListApp: async function () {
         elements.consultantProfileTile.click();
    }
};

module.exports = {
	elements: elements,
    actions: actions
};
