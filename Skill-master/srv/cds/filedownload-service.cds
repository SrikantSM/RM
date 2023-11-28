using sap.common as common from '@sap/cds/common';

service FileDownloadService @(requires: 'Skills.Download'){

  @readonly
  entity Languages as projection on common.Languages;

}
