namespace com.sap.resourceManagement.employee.workforceAvailability;

using { sap.common.CodeList } from '@sap/cds/common';
using com.sap.resourceManagement.workforce.workforcePerson  as workforcePerson from '../worker/WorkforcePersons';

/**
 * Represent day-wise availability of an employee considering
 * Work Schedule, Holiday Calendar and Temporary Changes. Also,
 * provides absence (time off) information as a composition
 * aspect. Workforce availability is used for staffing and
 * resource planning of employees.
 */
@assert.unique: {
  uniqueAvailability: [ workAssignmentID, workforcePerson, availabilityDate ],
  uniqueId: [ id ],
}
entity WorkforceAvailability {
      /**
       * WorkforceAvailability identifier.
       */
      id                      :      cds.UUID;
      /**
       * Reference to the work assignment this availability record
       * depends on.
       */
      @mandatory
  key workAssignmentID        :      String(100) not null;
      /**
       * The reference to the WorkforcePerson this availability
       * record depends on.
       */
      @mandatory
      workforcePerson         :      Association to one workforcePerson.WorkforcePersons not null;
      /**
       * Day to which the availability relates.
       */
      @mandatory
  key availabilityDate        :      Date not null;
      /**
       * Availability of an employee considering work schedule,
       * temporary changes and holiday class.
       */
      @mandatory
      normalWorkingTime       :      WorkforceAvailabilityContribution  not null;
      /**
       * Availability of an employee considering work schedule and
       * temporary changes without consideration of holiday class.
       * Ignored as in RM we do not process this.
       */
      @cds.api.ignore
      scheduledTime           :      WorkforceAvailabilityContribution;
      /**
       * Regular shift for a day e.g. EARLY, LATE, NIGHT etc.
       * Ignored as in RM we do not process this.
       */
      @cds.api.ignore
      shiftCode               :      ShiftCode;
      /**
       * Determine the type of the holiday.
       * Ignored as in RM we do not process this.
       */
      @cds.api.ignore
      holidayCode             :      HolidayCode;
      /**
       * List of available/non-available time intervals of
       * planned/regular working times of the day. Can be empty in
       * certain use cases. For DURATION based employees this will be
       * empty, for clock-time users it will be filled with regular
       * shift timings and break times.
       */
      @mandatory
      availabilityIntervals   : many WorkforceAvailabilityTimeInterval;
      /**
       * List of contributions to availability, for example absences.
       * Can be empty.
       */
      @mandatory
      availabilitySupplements : many WorkforceAvailabilitySupplement;
}

/**
 * Available / non-available time intervals of planned/regular
 * working times of the day.
 */
type WorkforceAvailabilityTimeInterval {
  /**
   * Category of the described interval.
   * Ignored as in RM we do not process this.
   */
  @cds.api.ignore
  category                      : String(1);
  /**
   * Start of the time interval, a time of day in format
   * “hh:mm:ss” without timezone information. Example:
   * “09:00:00”.
   */
  @mandatory
  intervalStart                 : Time;
  /**
   * End of the time interval, a time of day in format “hh:mm:ss”
   * without timezone information. Example: “18:00:00”.
   */
  @mandatory
  intervalEnd                   : Time;
  /**
   * Supplied/consumed availability hours of the time interval
   * Examples: 09:00 for 9 hours "gross" availability between
   * 08:00 and 18:00 -01:00 for 1 hour break between 12:00 and
   * 14:00.
   */
  @mandatory
  contribution                  : WorkforceAvailabilityContribution;
  /**
   * Indicates that the time interval starts after midnight, i.e.
   * on the next day Example: break from 01:00 - 01:30 on a night
   * shift that started on the availabilityDate.
   * Ignored as in RM we do not process this.
   */
  @cds.api.ignore
  intervalStartsOnSubsequentDay : Boolean;
  /**
   * Indicates that the time interval starts before midnight,
   * i.e. on the previous day Example: work from 23:00 - 07:00 on
   * a night shift that is logically assigned to the
   * availabilityDate.
   * Ignored as in RM we do not process this.
   */
  @cds.api.ignore
  intervalStartsOnPrecedingDay  : Boolean;
}

/**
 * Contributions to availability, for example absences.
 */
type WorkforceAvailabilitySupplement {
  /**
   * The category of the availability supplement, e.g., absence
   * or planned training.
   * Ignored as in RM we do not process this.
   */
  @cds.api.ignore
  category             : String(1);
  /**
   * Indicates whether worker is approachable or not and will be
   * used by planning applications.
   * Ignored as in RM we do not process this.
   */
  @cds.api.ignore
  isWorkerApproachable : Boolean;
  /**
   * The category of the availability supplement, e.g., planned
   * training.
   * Ignored as in RM we do not process this.
   */
  @cds.api.ignore
  type                 : String(100);
  /**
   * Start of the time interval, a time of day in format
   * “hh:mm:ss” without timezone information. Example:
   * “09:00:00”.
   */
  @mandatory
  intervalStart        : Time;
  /**
   * End of the time interval, a time of day in format “hh:mm:ss”
   * without timezone information. Example: “18:00:00”.
   */
  @mandatory
  intervalEnd          : Time;
  /**
   * Supplied/consumed availability hours Example: -02:00 for a 2
   * hours absence.
   */
  @mandatory
  contribution         : WorkforceAvailabilityContribution;
}

/**
 * This type denotes an availability duration in an “shh:mm”
 * format. s is a sign with values “+” or “-“. It is optional
 * with default value “+”. h, m and n are decimal digits. m can
 * take values 0-5 Trailing zeroes cannot be omitted, 4 digits
 * must always be given. Examples: “08:00” for 8 hours
 * normalWorkingTime, “-02:00” for 2 hours absence or “-00:30”
 * for a 30 minutes break.
 */
type WorkforceAvailabilityContribution : String(6);

entity ShiftCodes : CodeList {
  key code : String(128);
}

type ShiftCode : Association to one ShiftCodes;

entity HolidayCodes : CodeList {
  key code : String(128);
}

type HolidayCode : Association to one HolidayCodes;
