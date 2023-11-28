using sap.common as common from '@sap/cds/common';
using com.sap.resourceManagement.skill as rm from '../../db';
using User from '@sap/cds/common';

service FileUploadService @(requires: 'Skills.Upload'){

  @readonly
  entity Languages as projection on common.Languages;

  @odata.singleton
  entity UploadJob as projection on rm.UploadJob;

  @odata.singleton
  @cds.persistence.skip
  @readonly
  entity WhoAmI {
    key userName : User;
  };
}
