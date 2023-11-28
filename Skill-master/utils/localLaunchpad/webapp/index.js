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
                title: 'C4P RM Skill',
                isVisible: true,
                isGroupLocked: false,
                tiles: [
                  {
                    id: 'skill',
                    tileType: 'sap.ushell.ui.tile.StaticTile',
                    properties: {
                      title: 'Skills',
                      info: '',
                      icon: 'sap-icon://customize',
                      targetURL: '#Skill-Display',
                    },
                  },
                  {
                    id: 'skill-upload',
                    tileType: 'sap.ushell.ui.tile.StaticTile',
                    properties: {
                      title: 'Upload Skills',
                      info: '',
                      icon: 'sap-icon://upload',
                      targetURL: '#Skill-Upload',
                    },
                  },
                  {
                    id: 'skill-download',
                    tileType: 'sap.ushell.ui.tile.StaticTile',
                    properties: {
                      title: 'Download Skills',
                      info: '',
                      icon: 'sap-icon://download',
                      targetURL: '#Skill-Download',
                    },
                  },
                  {
                    id: 'skill-catalog',
                    tileType: 'sap.ushell.ui.tile.StaticTile',
                    properties: {
                      title: 'Skill Catalogs',
                      info: '',
                      icon: 'sap-icon://course-book',
                      targetURL: '#SkillCatalog-Display',
                    },
                  },
                  {
                    id: 'skill-proficiency',
                    tileType: 'sap.ushell.ui.tile.StaticTile',
                    properties: {
                      title: 'Proficiency Sets',
                      info: '',
                      icon: 'sap-icon://badge',
                      targetURL: '#Proficiency-Display',
                    },
                  },
                ],
              },
            ],
            groups: [
              {
                id: 'extensions',
                title: 'C4P RM Skill',
                isVisible: true,
                isGroupLocked: false,
                tiles: [
                  {
                    id: 'skill',
                    tileType: 'sap.ushell.ui.tile.StaticTile',
                    properties: {
                      title: 'Skills',
                      info: '',
                      icon: 'sap-icon://customize',
                      targetURL: '#Skill-Display',
                    },
                  },
                  {
                    id: 'skill-upload',
                    tileType: 'sap.ushell.ui.tile.StaticTile',
                    properties: {
                      title: 'Upload Skills',
                      info: '',
                      icon: 'sap-icon://upload',
                      targetURL: '#Skill-Upload',
                    },
                  },
                  {
                    id: 'skill-download',
                    tileType: 'sap.ushell.ui.tile.StaticTile',
                    properties: {
                      title: 'Download Skills',
                      info: '',
                      icon: 'sap-icon://download',
                      targetURL: '#Skill-Download',
                    },
                  },
                  {
                    id: 'skill-catalog',
                    tileType: 'sap.ushell.ui.tile.StaticTile',
                    properties: {
                      title: 'Skill Catalogs',
                      info: '',
                      icon: 'sap-icon://course-book',
                      targetURL: '#SkillCatalog-Display',
                    },
                  },
                  {
                    id: 'skill-proficiencies',
                    tileType: 'sap.ushell.ui.tile.StaticTile',
                    properties: {
                      title: 'Proficiency Sets',
                      info: '',
                      icon: 'sap-icon://badge',
                      targetURL: '#Proficiency-Display',
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
              SkillDisplay: {
                semanticObject: 'Skill',
                action: 'Display',
                title: 'Manage Skills',
                signature: {
                  parameters: {},
                  additionalParameters: 'allowed',
                },
                resolutionResult: {
                  applicationType: 'SAPUI5',
                  additionalInformation: 'SAPUI5.Component=skill',
                  url: 'ui/skill',
                },
              },
              SkillUpload: {
                semanticObject: 'Skill',
                action: 'Upload',
                title: 'Upload Skills',
                signature: {
                  parameters: {},
                  additionalParameters: 'allowed',
                },
                resolutionResult: {
                  applicationType: 'SAPUI5',
                  additionalInformation: 'SAPUI5.Component=skill-upload',
                  url: 'ui/skill-upload',
                },
              },
              SkillDownload: {
                semanticObject: 'Skill',
                action: 'Download',
                title: 'Download Skills',
                signature: {
                  parameters: {},
                  additionalParameters: 'allowed',
                },
                resolutionResult: {
                  applicationType: 'SAPUI5',
                  additionalInformation: 'SAPUI5.Component=skill-download',
                  url: 'ui/skill-download',
                },
              },
              SkillCatalogDisplay: {
                semanticObject: 'SkillCatalog',
                action: 'Display',
                title: 'Manage Skill Catalogs',
                signature: {
                  parameters: {},
                  additionalParameters: 'allowed',
                },
                resolutionResult: {
                  applicationType: 'SAPUI5',
                  additionalInformation: 'SAPUI5.Component=skill-catalog',
                  url: 'ui/skill-catalog',
                },
              },
              ProficiencyDisplay: {
                semanticObject: 'Proficiency',
                action: 'Display',
                title: 'Manage Proficiency Sets',
                signature: {
                  parameters: {},
                  additionalParameters: 'allowed',
                },
                resolutionResult: {
                  applicationType: 'SAPUI5',
                  additionalInformation: 'SAPUI5.Component=skill-proficiency',
                  url: 'ui/skill-proficiency',
                },
              },
            },
          },
        },
      },
      Container: {
        adapter: {
          config: {
            id: 'ConfigurationExpert',
            firstName: 'Configuration',
            lastName: 'Expert',
            fullName: 'ConfigurationExpert',
          },
        },
      },
    },
  });

  sap.ushell.bootstrap('local').then(() => {
    sap.ushell.Container.createRenderer().placeAt('content');
  });
});
