using com.sap.resourceManagement as rm from '../../db';
service BusinessServiceOrgService @(requires : 'authenticated-user'){

	@readonly
	entity BSODetails @(
		restrict     : [
      {
        grant : ['READ'],
        to    : 'BusinessServiceOrg.Upload'
      },
	  {
        grant : ['READ'],
        to    : 'BusinessServiceOrg.Download'
      } ]
	) as projection on rm.organization.HeadersWithDetails excluding {
        organization, toCostcenter
    };

  @readonly
  entity ServiceOrganizationCode @(
		restrict     : [
      {
        grant : ['READ'],
        to    : 'BusinessServiceOrg.Upload'
      },
	  {
        grant : ['READ'],
        to    : 'BusinessServiceOrg.Download'
    } ]
	) as projection on rm.organization.ServiceOrganizationCode excluding {
        organization
    };

}