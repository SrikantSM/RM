sap.ui.define([
    'sap/base/util/ObjectPath',
    'sap/ushell/services/Container',
], (ObjectPath) => {
    // define ushell config
    ObjectPath.set(['sap-ushell-config'], {
        defaultRenderer: 'fiori2',
        bootstrapPlugins: {
            RuntimeAuthoringPlugin: {
                component: 'sap.ushell.plugins.rta',
                config: {
                    validateAppVersion: false,
                },
            },
            PersonalizePlugin: {
                component: 'sap.ushell.plugins.rta-personalize',
                config: {
                    validateAppVersion: false,
                },
            },
        },
        renderers: {
            fiori2: {
                componentData: {
                    config: {
                        enableSearch: false,
                        rootIntent: 'Shell-home',
                    },
                },
            },
        },
        services: {
            NavTargetResolution: {
                config: {
                    runStandaloneAppFolderWhitelist: {
                        '*': true,
                    },
                    allowTestUrlComponentConfig: true,
                    enableClientSideTargetResolution: true,
                },
            },
            SupportTicket: {
                // switched off as the local adapter is not connected to a ticket system
                config: {
                    enabled: false,
                },
            },
            EndUserFeedback: {
                adapter: {
                    config: {
                        enabled: false,
                    },
                },
            },
            SmartNavigation: {
                config: {
                    isTrackingEnabled: true,
                },
            },
            LaunchPage: {
                adapter: {
                    config: {
                        catalogs: [
                            {
                                id: 'extensions',
                                title: 'C4P RM Consultant Profile',
                                isVisible: true,
                                isGroupLocked: false,
                                tiles: [
                                    {
                                        id: 'myProjectExperienceUi',
                                        tileType: 'sap.ushell.ui.tile.StaticTile',
                                        properties: {
                                            title: 'My Project Experience',
                                            info: '',
                                            icon: 'sap-icon://my-view',
                                            targetURL: '#myProjectExperienceUi-Display'
                                        }
                                    },
                                    {
                                        id: 'projectRoleUi',
                                        tileType: 'sap.ushell.ui.tile.StaticTile',
                                        properties: {
                                            title: 'Manage Project Roles',
                                            info: '',
                                            icon: 'sap-icon://group',
                                            targetURL: '#projectRoleUi-Display'
                                        }
                                    },
                                    {
                                        id: 'availabilityUploadUi',
                                        tileType: 'sap.ushell.ui.tile.StaticTile',
                                        properties: {
                                            title: 'Maintain Availability Data',
                                            info: '',
                                            icon: 'sap-icon://gantt-bars',
                                            targetURL: '#availabilityUploadUi-Display'
                                        }
                                    },
                                    {
                                        id: 'availabilityUpload',
                                        tileType: 'sap.ushell.ui.tile.StaticTile',
                                        properties: {
                                            title: 'Maintain Availability Data Upload',
                                            info: '',
                                            icon: 'sap-icon://upload',
                                            targetURL: '#availabilityUpload-Upload'
                                        }
                                    },
                                    {
                                        id: 'availabilityDownload',
                                        tileType: 'sap.ushell.ui.tile.StaticTile',
                                        properties: {
                                            title: 'Maintain Availability Data Download',
                                            info: '',
                                            icon: 'sap-icon://download',
                                            targetURL: '#availabilityUpload-Download'
                                        }
                                    },
                                    {
                                        id: 'businessServiceOrgUi',
                                        tileType: 'sap.ushell.ui.tile.StaticTile',
                                        properties: {
                                            title: 'Maintain Service Organizations',
                                            info: '',
                                            icon: 'sap-icon://org-chart',
                                            targetURL: '#businessServiceOrgUi-Display'
                                        }
                                    },
                                    {
                                        id: 'businessServiceOrgUpload',
                                        tileType: 'sap.ushell.ui.tile.StaticTile',
                                        properties: {
                                            title: 'Upload Service Organizations',
                                            info: '',
                                            icon: 'sap-icon://group',
                                            targetURL: '#businessServiceOrgUi-upload'
                                        }
                                    },
                                    {
                                        id: 'replicationScheduleUi',
                                        tileType: 'sap.ushell.ui.tile.StaticTile',
                                        properties: {
                                            title: 'Manage Replication Schedules',
                                            info: '',
                                            icon: 'sap-icon://duplicate',
                                            targetURL: '#replicationScheduleUi-Display'
                                        }
                                    },
                                    {
                                        id: 'myAssignmentsUi',
                                        tileType: 'sap.ushell.ui.tile.StaticTile',
                                        properties: {
                                            title: 'My Assignments',
                                            info: '',
                                            icon: 'sap-icon://my-view',
                                            targetURL: '#myAssignmentsUi-Display'
                                        }
                                    }
                                ],
                            },
                        ],
                        groups: [
                            {
                                id: 'extensions',
                                title: 'C4P RM Consultant Profile',
                                isVisible: true,
                                isGroupLocked: false,
                                tiles: [
                                    {
                                        id: 'myProjectExperienceUi',
                                        tileType: 'sap.ushell.ui.tile.StaticTile',
                                        properties: {
                                            title: 'My Project Experience',
                                            info: '',
                                            icon: 'sap-icon://my-view',
                                            targetURL: '#myProjectExperienceUi-Display'
                                        }
                                    },
                                    {
                                        id: 'projectRoleUi',
                                        tileType: 'sap.ushell.ui.tile.StaticTile',
                                        properties: {
                                            title: 'Manage Project Roles',
                                            info: '',
                                            icon: 'sap-icon://group',
                                            targetURL: '#projectRoleUi-Display'
                                        }
                                    },
                                    {
                                        id: 'availabilityUploadUi',
                                        tileType: 'sap.ushell.ui.tile.StaticTile',
                                        properties: {
                                            title: 'Maintain Availability Data',
                                            info: '',
                                            icon: 'sap-icon://gantt-bars',
                                            targetURL: '#availabilityUploadUi-Display'
                                        }
                                    },
                                    {
                                        id: 'availabilityUpload',
                                        tileType: 'sap.ushell.ui.tile.StaticTile',
                                        properties: {
                                            title: 'Maintain Availability Data Upload',
                                            info: '',
                                            icon: 'sap-icon://upload',
                                            targetURL: '#availabilityUpload-Upload'
                                        }
                                    },
                                    {
                                        id: 'availabilityDownload',
                                        tileType: 'sap.ushell.ui.tile.StaticTile',
                                        properties: {
                                            title: 'Maintain Availability Data Download',
                                            info: '',
                                            icon: 'sap-icon://download',
                                            targetURL: '#availabilityUpload-Download'
                                        }
                                    },
                                    {
                                        id: 'businessServiceOrgUi',
                                        tileType: 'sap.ushell.ui.tile.StaticTile',
                                        properties: {
                                            title: 'Maintain Service Organizations',
                                            info: '',
                                            icon: 'sap-icon://org-chart',
                                            targetURL: '#businessServiceOrgUi-Display'
                                        }
                                    },
                                    {
                                        id: 'businessServiceOrgUpload',
                                        tileType: 'sap.ushell.ui.tile.StaticTile',
                                        properties: {
                                            title: 'Upload Service Organizations',
                                            info: '',
                                            icon: 'sap-icon://group',
                                            targetURL: '#businessServiceOrgUi-upload'
                                        }
                                    },
                                    {
                                        id: 'myResourcesUi',
                                        tileType: 'sap.ushell.ui.tile.StaticTile',
                                        properties: {
                                            title: 'My Resources',
                                            info: '',
                                            icon: 'sap-icon://my-view',
                                            targetURL: '#myResourcesUi-Display'
                                        }
                                    },
                                    {
                                        id: 'replicationScheduleUi',
                                        tileType: 'sap.ushell.ui.tile.StaticTile',
                                        properties: {
                                            title: 'Manage Replication Schedules',
                                            info: '',
                                            icon: 'sap-icon://duplicate',
                                            targetURL: '#replicationScheduleUi-Display'
                                        }
                                    },
                                    {
                                        id: 'myAssignmentsUi',
                                        tileType: 'sap.ushell.ui.tile.StaticTile',
                                        properties: {
                                            title: 'My Assignments',
                                            info: '',
                                            icon: 'sap-icon://my-view',
                                            targetURL: '#myAssignmentsUi-Display'
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                },
            },
            ClientSideTargetResolution: {
                adapter: {
                    config: {
                        inbounds: {
                            myProjectExperience: {
                                semanticObject: 'myProjectExperienceUi',
                                action: 'Display',
                                title: 'My Project Experience',
                                signature: {
                                    parameters: {},
                                    additionalParameters: 'allowed'
                                },
                                resolutionResult: {
                                    applicationType: 'SAPUI5',
                                    additionalInformation: 'SAPUI5.Component=myProjectExperienceUi',
                                    url: 'ui/myProjectExperienceUi'
                                }
                            },
                            projectRoleUi: {
                                semanticObject: 'projectRoleUi',
                                action: 'Display',
                                title: 'Manage Project Role',
                                signature: {
                                    parameters: {},
                                    additionalParameters: 'allowed'
                                },
                                resolutionResult: {
                                    applicationType: 'SAPUI5',
                                    additionalInformation: 'SAPUI5.Component=projectRoleUi',
                                    url: 'ui/projectRoleUi'
                                }
                            },
                            availabilityUploadUi: {
                                semanticObject: 'availabilityUploadUi',
                                action: 'Display',
                                title: 'Maintain Availability Data',
                                signature: {
                                    parameters: {},
                                    additionalParameters: 'allowed'
                                },
                                resolutionResult: {
                                    applicationType: 'SAPUI5',
                                    additionalInformation: 'SAPUI5.Component=availabilityUploadUi',
                                    url: 'ui/availabilityUploadUi'
                                }
                            },
                            availabilityUpload: {
                                semanticObject: 'availabilityUpload',
                                action: 'Upload',
                                title: 'Maintain Workforce Person Availability Data Upload',
                                signature: {
                                    parameters: {},
                                    additionalParameters: 'allowed'
                                },
                                resolutionResult: {
                                    applicationType: 'SAPUI5',
                                    additionalInformation: 'SAPUI5.Component=availabilityUpload',
                                    url: 'ui/availabilityUpload'
                                }
                            },
                            availabilityDownload: {
                                semanticObject: 'availabilityUpload',
                                action: 'Download',
                                title: 'Maintain Availability Data Download',
                                signature: {
                                    parameters: {},
                                    additionalParameters: 'allowed'
                                },
                                resolutionResult: {
                                    applicationType: 'SAPUI5',
                                    additionalInformation: 'SAPUI5.Component=availabilityDownload',
                                    url: 'ui/availabilityDownload'
                                }
                            },
                            businessServiceOrgUi: {
                                semanticObject: 'businessServiceOrgUi',
                                action: 'Display',
                                title: 'Maintain Service Organizations',
                                signature: {
                                    parameters: {},
                                    additionalParameters: 'allowed'
                                },
                                resolutionResult: {
                                    applicationType: 'SAPUI5',
                                    additionalInformation: 'SAPUI5.Component=businessServiceOrgUi',
                                    url: 'ui/businessServiceOrgUi'
                                }
                            },
                            businessServiceOrgUpload: {
                                semanticObject: 'businessServiceOrgUi',
                                action: 'upload',
                                title: 'Upload Service Organizations',
                                signature: {
                                    parameters: {},
                                    additionalParameters: 'allowed'
                                },
                                resolutionResult: {
                                    applicationType: 'SAPUI5',
                                    additionalInformation: 'SAPUI5.Component=businessServiceOrgUpload',
                                    url: 'ui/businessServiceOrgUpload'
                                }
                            },
                            ProjectExperience: {
                                semanticObject: 'myResourcesUi',
                                action: 'Display',
                                title: 'My Resources',
                                signature: {
                                    parameters: {},
                                    additionalParameters: 'allowed'
                                },
                                resolutionResult: {
                                    applicationType: 'SAPUI5',
                                    additionalInformation: 'SAPUI5.Component=myResourcesUi',
                                    url: 'ui/myResourcesUi'
                                }
                            },
                            replicationScheduleUi: {
                                semanticObject: 'replicationScheduleUi',
                                action: 'Display',
                                title: 'Manage Replication Schedules',
                                signature: {
                                    parameters: {},
                                    additionalParameters: 'allowed'
                                },
                                resolutionResult: {
                                    applicationType: 'SAPUI5',
                                    additionalInformation: 'SAPUI5.Component=replicationScheduleUi',
                                    url: 'ui/replicationScheduleUi'
                                }
                            },
                            myAssignmentsUi: {
                                semanticObject: 'myAssignmentsUi',
                                action: 'Display',
                                title: 'My Assignments',
                                signature: {
                                    parameters: {},
                                    additionalParameters: 'allowed'
                                },
                                resolutionResult: {
                                    applicationType: 'SAPUI5',
                                    additionalInformation: 'SAPUI5.Component=myAssignmentsUi',
                                    url: 'ui/myAssignmentsUi'
                                }
                            }
                        },
                    },
                },
            },
        }
    });

    sap.ushell.bootstrap('local').then(() => {
        sap.ushell.Container.createRenderer().placeAt('content');
    });
});
