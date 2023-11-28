using com.sap.resourceManagement.consultantProfile as rm from '../../db';
using com.sap.resourceManagement.workforce.workAssignment as workAssignment from '../../db';

service AvailabilityUploadService @(requires : 'authenticated-user'){

  	@readonly
    entity AvailabilityUploadData @(
		restrict     : [
      {
        grant : ['READ'],
        to    : 'Availability.Upload'
      },
	  {
        grant : ['READ'],
        to    : 'Availability.Download'
      } ]
	)  as
    	projection on rm.integration.AvailabilityReplicationView;

    @readonly
    entity AvailabilitySummaryStatus @(
		restrict     : [
      {
        grant : ['READ'],
        to    : 'Availability.Upload'
      },
	  {
        grant : ['READ'],
        to    : 'Availability.Download'
      } ]
	) as
    	select from rm.integration.AvailabilitySummaryStatus{
    	code,
    	name,
    	descr,
    	//Color code
    	cast (
      case
    		when code = 0 then 0
			  when code = 1 then 3
			  when code = 2 then 2
			  else 1
		  end
      as Integer) as criticality: Integer
    };

	@readonly
    entity AvailabilitySummaryStatus_texts @(
		restrict     : [
      {
        grant : ['READ'],
        to    : 'Availability.Upload'
      },
	  {
        grant : ['READ'],
        to    : 'Availability.Download'
      } ]
	) as projection on rm.integration.AvailabilitySummaryStatus.texts;

	@readonly
	entity AvailabilityUploadErrors @(
		restrict     : [
      {
        grant : ['READ'],
        to    : 'Availability.Upload'
      },
	  {
        grant : ['READ'],
        to    : 'Availability.Download'
      } ]
	) as projection on rm.integration.AvailabilityErrorMessagesView;

    @readonly
    entity AvailabilityCostCenter @(
		restrict     : [
      {
        grant : ['READ'],
        to    : 'Availability.Upload'
      },
	  {
        grant : ['READ'],
        to    : 'Availability.Download'
      } ]
	) as projection on rm.integration.CostCenterMasterList;

    @readonly
    entity AvailabilityCostCenterDisplay @(
		restrict     : [
      {
        grant : ['READ'],
        to    : 'Availability.Upload'
      },
	  {
        grant : ['READ'],
        to    : 'Availability.Download'
      } ]
	) as projection on rm.integration.AvailabilityCostCenterDisplay;

    @readonly
    entity AvailabilityWorkForcePersonID @(
		restrict     : [
      {
        grant : ['READ'],
        to    : 'Availability.Upload'
      },
	  {
        grant : ['READ'],
        to    : 'Availability.Download'
      } ]
	) as projection on rm.integration.AvailabilityWorkForcePersonID;

    @readonly
    entity AvailabilityResourceOrg @(
		restrict     : [
      {
        grant : ['READ'],
        to    : 'Availability.Upload'
      },
	  {
        grant : ['READ'],
        to    : 'Availability.Download'
      } ]
	) as projection on rm.integration.AvailabilityResourceOrg;

    @readonly
    entity AvailabilityPeriodicCount @(
		restrict     : [
      {
        grant : ['READ'],
        to    : 'Availability.Upload'
      },
	    {
        grant : ['READ'],
        to    : 'Availability.Download'
      } ]
	  ) as projection on rm.integration.AvailabilityPeriodicCountView;

    @readonly
    entity WorkerType @(restrict : [
      {
        grant : ['READ'],
        to    : 'Availability.Upload'
      },
	    {
        grant : ['READ'],
        to    : 'Availability.Download'
      } 
    ]) as projection on workAssignment.WorkerType;

}
