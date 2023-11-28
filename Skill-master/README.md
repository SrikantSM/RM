# Skill
 
## Domain Pipeline Status
[![](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Skill~Pipeline-Skill-MTA~Build-Local~Build/badge/icon?subject=MTA%20Build)](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Skill~Pipeline-Skill-MTA~Build-Local~Build)
[![](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Skill~Pipeline-Skill-Deploy~to~Test~Space-Deploy/badge/icon?subject=Test%20Deployment)](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Skill~Pipeline-Skill-Deploy~to~Test~Space-Deploy/)

[![](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Skill~Pipeline-Skill-UI~Integration~Tests-Run~OPA5~Tests/badge/icon?subject=UI%20Integration%20Tests)](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Skill~Pipeline-Skill-UI~Integration~Tests-Run~OPA5~Tests/)
[![](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Skill~Pipeline-Skill-API~Integration~Tests-Run~Mocha~Tests/badge/icon?subject=API%20Integration%20Tests)](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Skill~Pipeline-Skill-API~Integration~Tests-Run~Mocha~Tests/)
[![](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Skill~Pipeline-Skill-End~to~End~Tests~in~Chrome~Linux-Run~UIVeri5~Tests~in~Chrome~Linux/badge/icon?subject=End%20to%20End%20Tests%20%28Chrome%20Linux%29)](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/job/Resource~Management~Domains~-~~Skill~Pipeline-Skill-End~to~End~Tests~in~Chrome~Linux-Run~UIVeri5~Tests~in~Chrome~Linux/)

[![Quality Gate Status](https://sonar.wdf.sap.corp/api/project_badges/measure?project=com.sap.c4p.rm%3Askill-srv&metric=alert_status)](https://sonar.wdf.sap.corp/dashboard?id=com.sap.c4p.rm%3Askill-srv)

## Documentation
[How to setup the local development environment](https://github.tools.sap/Cloud4RM/ResourceManagementDocumentation/blob/master/Project%20set-up%20and%20ongoing%20management/DevelopmentSetup/localDevelopment.md)

[Information about Skills and Catalogs](https://github.wdf.sap.corp/I014309/rmproto/blob/016-further-cleanup-persona-specific-logic/documentation/dataModel/skills.md)

## Other repositories
[Resource-Management (Umbrella)](https://github.tools.sap/Cloud4RM/Resource-Management)

[ResourceManagementDocumentation](https://github.tools.sap/Cloud4RM/ResourceManagementDocumentation/)

## Pipeline tools

[Master Pipeline](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/view/Resource%20Management%20Domains%20-%20%20Skill%20Pipeline/)

[Pull Request Pipeline](https://c4prm.codepipes.wdf.sap.corp/job/c4p-rm/view/Pull%20Request%20-%20Resource%20Management%20Domains%20-%20%20Skill%20Pipeline/)

[Black Duck](https://sap.blackducksoftware.com/api/projects/1835e167-4bd3-406c-a30b-f8b9af98c655)

[Checkmarx](https://cx.wdf.sap.corp/CxWebClient/portal#/projectState/64322/Summary)

[Fortify](https://fortify.tools.sap/ssc/html/ssc/version/23014/fix/null/?filterSet=a243b195-0a59-3f8b-1403-d55b7a7d78e6)

[SonarQube](https://sonar.wdf.sap.corp/dashboard?id=com.sap.c4p.rm%3Askill-srv)

[Whitesource](https://saas.whitesourcesoftware.com/Wss/WSS.html#!product;id=426127)

## Folder structure

| Folder                   | Purpose                                 |
| ------------------------ | --------------------------------------- |
| `app/`                   | UI5 apps                                |
| `approuter/`             | Proxy between the UI and the service    |
| `db/`                    | Skill-specific CDS model definitions    |
| `flp-content/`           | Fiori launchpad configuration           |
| `srv/`                   | All service-related files               |
| `srv/cds/`               | CDS service definitions and annotations |
| `srv/src/`               | Java service source code                |
| `tests/api-integration/` | API integration test setup (Mocha)      |
| `tests/end-to-end/`      | End-to-End test setup (UIVeri5)         |
| `tests/ui-integration/`  | UI integration test setup (OPA5)        |
| `ui-deployer/`           | UI5 app deployer                        |
| `utils/`                 | Utilities for local testing             |

