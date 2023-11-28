sap.ui.define(
  ['sap/base/util/ObjectPath', 'sap/ushell/services/Container'],
  function (ObjectPath) {
    'use strict';

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
                  title: 'C4P RM Resource-Request',
                  isVisible: true,
                  isGroupLocked: false,
                  tiles: [
                    {
                      id: 'manageResourceRequest',
                      tileType: 'sap.ushell.ui.tile.StaticTile',
                      properties: {
                        title: 'Manage Resource Requests',
                        info: '',
                        icon: 'sap-icon://account',
                        targetURL: '#ResourceRequest-Manage',
                      },
                    },
                    {
                      id: 'staffResourceRequest',
                      tileType: 'sap.ushell.ui.tile.StaticTile',
                      properties: {
                        title: 'Staff Resource Requests',
                        info: '',
                        icon: 'sap-icon://employee-approvals',
                        targetURL: '#ResourceRequest-Display',
                      },
                    },
                  ],
                },
              ],
              groups: [
                {
                  id: 'extensions',
                  title: 'C4P RM Resource-Request',
                  isVisible: true,
                  isGroupLocked: false,
                  tiles: [
                    {
                      id: 'manageResourceRequest',
                      tileType: 'sap.ushell.ui.tile.StaticTile',
                      properties: {
                        title: 'Manage Resource Requests',
                        info: '',
                        icon: 'sap-icon://account',
                        targetURL: '#ResourceRequest-Manage',
                      },
                    },
                    {
                      id: 'staffResourceRequest',
                      tileType: 'sap.ushell.ui.tile.StaticTile',
                      properties: {
                        title: 'Staff Resource Requests',
                        info: '',
                        icon: 'sap-icon://employee-approvals',
                        targetURL: '#ResourceRequest-Display',
                      },
                    },
                  ],
                },
              ],
            },
          },
        },
        ClientSideTargetResolution: {
          adapter: {
            config: {
              inbounds: {
                manageResourceRequest: {
                  semanticObject: 'ResourceRequest',
                  action: 'Manage',
                  title: 'Manage Resource Requests',
                  signature: {
                    parameters: {},
                    additionalParameters: 'allowed',
                  },
                  resolutionResult: {
                    applicationType: 'SAPUI5',
                    additionalInformation:
                      'SAPUI5.Component=manageResourceRequest',
                    url: 'ui/manageResourceRequest',
                  },
                },
                staffResourceRequest: {
                  semanticObject: 'ResourceRequest',
                  action: 'Display',
                  title: 'Staff Resource Requests',
                  signature: {
                    parameters: {},
                    additionalParameters: 'allowed',
                  },
                  resolutionResult: {
                    applicationType: 'SAPUI5',
                    additionalInformation:
                      'SAPUI5.Component=staffResourceRequest',
                    url: 'ui/staffResourceRequest',
                  },
                },
              },
            },
          },
        },
        Container: {
          adapter: {
            config: {
              id: 'opaUser',
              firstName: 'opa',
              lastName: 'User',
              fullName: 'opaUser',
            },
          },
        },
      },
    });

    sap.ushell.bootstrap('local').then(function () {
      sap.ushell.Container.createRenderer().placeAt('content');
    });
  }
);
