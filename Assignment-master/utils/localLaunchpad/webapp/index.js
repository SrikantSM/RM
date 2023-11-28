sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ushell/services/Container"
], function (ObjectPath) {
    "use strict";

    // define ushell config
    ObjectPath.set(["sap-ushell-config"], {
        defaultRenderer: "fiori2",
        bootstrapPlugins: {
            "RuntimeAuthoringPlugin": {
                component: "sap.ushell.plugins.rta",
                config: {
                    validateAppVersion: false
                }
            },
            "PersonalizePlugin": {
                component: "sap.ushell.plugins.rta-personalize",
                config: {
                    validateAppVersion: false
                }
            }
        },
        renderers: {
            fiori2: {
                componentData: {
                    config: {
                        enableSearch: false,
                        rootIntent: "Shell-home"
                    }
                }
            }
        },
        services: {
            NavTargetResolution: {
                config: {
                    "runStandaloneAppFolderWhitelist": {
                        "*": true
                    },
                    "allowTestUrlComponentConfig": true,
                    "enableClientSideTargetResolution": true
                }
            },
            SupportTicket: {
                // switched off as the local adapter is not connected to a ticket system
                config: {
                    enabled: false
                }
            },
            EndUserFeedback: {
                adapter: {
                    config: {
                        enabled: false
                    }
                }
            },
            SmartNavigation: {
                config: {
                    isTrackingEnabled: true
                }
            },
            "LaunchPage": {
                "adapter": {
                    "config": {
                        "catalogs": [{
                            "id": "extensions",
                            "title": "C4P RM Assignment",
                            "isVisible": true,
                            "isGroupLocked": false,
                            "tiles": [
                                {
                                    "id": "capacityGridUi",
                                    "tileType": "sap.ushell.ui.tile.StaticTile",
                                    "properties": {
                                        "title": "Manage Resource Utilization",
                                        "info": "",
                                        "icon": "sap-icon://collaborate",
                                        "targetURL": "#capacity-Display"
                                    }
                                }
                            ]
                        }],
                        "groups": [{
                            "id": "extensions",
                            "title": "C4P RM Assignment",
                            "isVisible": true,
                            "isGroupLocked": false,
                            "tiles": [
                                {
                                    "id": "capacityGridUi",
                                    "tileType": "sap.ushell.ui.tile.StaticTile",
                                    "properties": {
                                        "title": "Manage Resource Utilization",
                                        "info": "",
                                        "icon": "sap-icon://collaborate",
                                        "targetURL": "#capacity-Display"
                                    }
                                }
                            ]
                        }]
                    }
                }
            },
            "ClientSideTargetResolution": {
                "adapter": {
                    "config": {
                        "inbounds": {
                            "CapacityGrid": {
                                "semanticObject": "capacity",
                                "action": "Display",
                                "title": "Manage Resource Utilization",
                                "signature": {
                                    "parameters": {},
                                    "additionalParameters": "allowed"
                                },
                                "resolutionResult": {
                                    "applicationType": "SAPUI5",
                                    "additionalInformation": "SAPUI5.Component=capacityGridUi",
                                    "url": "ui/capacityGridUi"
                                }
                            }
                        }
                    }
                }
            },
            "Container": {
                "adapter": {
                    "config": {
                        "id": "ResourceManager",
                        "firstName": "Resource",
                        "lastName": "Manager",
                        "fullName": "ResourceManager"
                    }
                }
            }
        }
    });

    sap.ushell.bootstrap("local").then(function () {
        sap.ushell.Container.createRenderer().placeAt("content");
    });
});