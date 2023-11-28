package com.sap.c4p.rm.workforceavailabilityservice.validations;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.function.Consumer;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Answers;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.processor.workforce.dao.WorkforcePersonDAO;
import com.sap.c4p.rm.processor.workforce.dao.WorkAssignmentDAO;
import com.sap.c4p.rm.utils.commonvalidations.CommonValidator;
import com.sap.cds.Result;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.request.RequestContext;
import com.sap.resourcemanagement.employee.workforceavailability.WorkforceAvailabilitySupplement;
import com.sap.resourcemanagement.employee.workforceavailability.WorkforceAvailabilityTimeInterval;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments;
import com.sap.resourcemanagement.workforce.workforceperson.WorkforcePersons;

import workforceavailabilityservice.WorkforceAvailability;

public class WorkforceAvailabilityServiceValidatorTest extends InitMocks{
	
	@Mock
    private CommonValidator mockCommonValidator;

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private Messages messages;
    
    @Mock
    CacheManager mockCacheManager;

    @Mock
    private PersistenceService mockPersistenceService;

    @Mock
    private Result mockResult;
    
    @Mock
    private WorkAssignments mockWorkAssignments;
    
    @Mock
    private WorkforcePersons mockWorkforcePersons;
    
    @Mock
    private WorkforcePersonDAO mockWorforcePersonDAO;
    
    @Mock
    private WorkAssignmentDAO mockWorkAssignmentDAO;
    
    @Captor
    private ArgumentCaptor<Consumer<RequestContext>> consumerArgumentCaptor;

    @Autowired
    @InjectMocks
    private WorkforceAvailabilityServiceValidator classUnderTest;
    
    @BeforeEach
    void setUp() {
    	this.classUnderTest = new WorkforceAvailabilityServiceValidator(mockCommonValidator, messages, mockPersistenceService, mockWorforcePersonDAO, mockWorkAssignmentDAO);
    	
    	LocalDate availabilityDate = LocalDate.of(2023, 03, 28);
    	LocalTime intervalStartTime = LocalTime.of(9, 0, 0);
    	LocalTime intervalEndTime = LocalTime.of(12, 0, 0);
    	LocalTime supplementStartTime = LocalTime.of(12, 0, 0);
    	LocalTime supplementEndTime = LocalTime.of(17, 0, 0);
    	Collection<WorkforceAvailabilityTimeInterval> availabilityIntervals = new ArrayList<WorkforceAvailabilityTimeInterval>();
    	Collection<WorkforceAvailabilitySupplement> availabilitySupplements = new ArrayList<WorkforceAvailabilitySupplement>();
    	
    	WorkforceAvailabilityTimeInterval timeInterval = WorkforceAvailabilityTimeInterval.create();
    	timeInterval.setIntervalStart(intervalStartTime);
    	timeInterval.setIntervalEnd(intervalEndTime);
    	timeInterval.setContribution("03:00");
    	availabilityIntervals.add(timeInterval);
    	
    	WorkforceAvailabilitySupplement supplement = WorkforceAvailabilitySupplement.create();
    	supplement.setIntervalStart(supplementStartTime);
    	supplement.setIntervalEnd(supplementEndTime);
    	supplement.setContribution("05:00");
    	availabilitySupplements.add(supplement);
    	
    	WorkforceAvailability availability = WorkforceAvailability.create();
    	availability.setWorkAssignmentID("testWorkAssignmentID");
    	availability.setAvailabilityDate(availabilityDate);
    	availability.setWorkforcePersonId("testWorkforcePersonID");
    	availability.setNormalWorkingTime("08:00");
    	availability.setAvailabilityIntervals(availabilityIntervals);
    	availability.setAvailabilitySupplements(availabilitySupplements);
    }
    
    @Test
    @DisplayName("Check availablity attributes for XSS")
    void checkAvailabilityForXSSTest() {
    	LocalDate availabilityDate = LocalDate.of(2023, 03, 28);
    	
    	WorkforceAvailability availability = WorkforceAvailability.create();
    	availability.setWorkAssignmentID("testWorkAssignmentID");
    	availability.setWorkforcePersonId("testWorkforcePersonID");
    	availability.setNormalWorkingTime("08:00");
    	availability.setAvailabilityDate(availabilityDate);
        when(mockCommonValidator.validateFreeTextforScripting(any())).thenReturn(true);
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkAvailabilityForXss(availability));
        verify(this.messages, times(0)).throwIfError();
    }
    
    @Test
    @DisplayName("Check availability attributes for XSS - work assignment id is forbidden")
    void checkAvailabilityForXSSTestWorkAssignmentIDForbidden() {
    	LocalDate availabilityDate = LocalDate.of(2023, 03, 28);
    	
    	WorkforceAvailability availability = WorkforceAvailability.create();
    	availability.setWorkAssignmentID("<test>");
    	availability.setWorkforcePersonId("testWorkforcePersonID");
    	availability.setNormalWorkingTime("08:00");
    	availability.setAvailabilityDate(availabilityDate);
    	when(mockCommonValidator.validateFreeTextforScripting("<test>")).thenReturn(false);
    	when(mockCommonValidator.validateFreeTextforScripting("testWorkforcePersonID")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("08:00")).thenReturn(true);
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkAvailabilityForXss(availability));
        verify(this.messages, times(1)).throwIfError();
    }
    
    @Test
    @DisplayName("Check availability attributes for XSS - workforce person id is forbidden")
    void checkAvailabilityForXSSTestWorkforcePersonIDForbidden() {
    	LocalDate availabilityDate = LocalDate.of(2023, 03, 28);
    	
    	WorkforceAvailability availability = WorkforceAvailability.create();
    	availability.setWorkAssignmentID("testWorkassignmentID");
    	availability.setWorkforcePersonId("<test>");
    	availability.setNormalWorkingTime("08:00");
    	availability.setAvailabilityDate(availabilityDate);
    	when(mockCommonValidator.validateFreeTextforScripting("<test>")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("testWorkforcePersonID")).thenReturn(false);
    	when(mockCommonValidator.validateFreeTextforScripting("08:00")).thenReturn(true);
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkAvailabilityForXss(availability));
        verify(this.messages, times(1)).throwIfError();
    }
    
    
    @Test
    @DisplayName("Check availability attributes for XSS - normal working time is forbidden")
    void checkAvailabilityForXSSTestNormalWorkingTimeForbidden() {
    	LocalDate availabilityDate = LocalDate.of(2023, 03, 28);
    	
    	WorkforceAvailability availability = WorkforceAvailability.create();
    	availability.setWorkAssignmentID("testWorkassignmentID");
    	availability.setWorkforcePersonId("testWorkforcePersonID");
    	availability.setNormalWorkingTime("<test>");
    	availability.setAvailabilityDate(availabilityDate);
    	when(mockCommonValidator.validateFreeTextforScripting("<test>")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("testWorkforcePersonID")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("08:00")).thenReturn(false);
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkAvailabilityForXss(availability));
        verify(this.messages, times(1)).throwIfError();
    }
    
    @Test
    @DisplayName("Check validity of normal working time")
    void validateNormalWorkingTimeTest() {
    	String time = "08:00";
    	LocalDate availabilityDate = LocalDate.of(2023, 03, 28);
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateNormalWorkingTime(time, availabilityDate));
    	verify(this.messages, times(0)).throwIfError();
    }
    
    @Test
    @DisplayName("Check validity of normal working time - normal working time zero")
    void validateNormalWorkingTimeZeroTest() {
    	String time = "00:00";
    	LocalDate availabilityDate = LocalDate.of(2023, 03, 28);
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateNormalWorkingTime(time, availabilityDate));
        verify(this.messages, times(1)).throwIfError();
    }
    
    @Test
    @DisplayName("Check validity of normal working time - normal working time invalid")
    void validateNormalWorkingTimeInvalidTest() {
    	String time = "24:00";
    	LocalDate availabilityDate = LocalDate.of(2023, 03, 28);
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateNormalWorkingTime(time, availabilityDate));
    	verify(this.messages, times(1)).throwIfError();
    }
    
    @Test
    @DisplayName("Check validity of availability interval contribution time")
    void validateIntervalContributionTimeTest() {
    	String time = "08:00";
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateIntervalsContributionTime(time));
    	verify(this.messages, times(0)).throwIfError();
    }
    
    @Test
    @DisplayName("Check validity of availability interval contribution time - contribution time invalid")
    void validateIntervalContributionTimeInvalidTest() {
    	String time = "24:00";
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateIntervalsContributionTime(time));
    	verify(this.messages, times(1)).throwIfError();
    }
    
    @Test
    @DisplayName("Check validity of availability supplement contribution time")
    void validateSupplementContributionTimeTest() {
    	String time = "08:00";
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateSupplementContributionTime(time));
    	verify(this.messages, times(0)).throwIfError();
    }
    
    @Test
    @DisplayName("Check validity of availability supplement contribution time - contribution time invalid")
    void validateSupplementContributionTimeInvalidTest() {
    	String time = "24:00";
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateSupplementContributionTime(time));
        verify(this.messages, times(1)).throwIfError();
    }
    
    @Test
    @DisplayName("check validity of interval start, end and contribution")
    void validateIntervalStartEndDifferenceEqualToContributionTest() {
    	LocalTime intervalStart = LocalTime.of(9, 0, 0);
    	LocalTime intervalEnd = LocalTime.of(13, 0, 0);
    	String contribution = "04:00";
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateIntervalStartEndDifferenceEqualToContribution(intervalStart, intervalEnd, contribution));
        verify(this.messages, times(0)).throwIfError();
    }
    
    @Test
    @DisplayName("check validity of interval start, end and contribution - start time after than end time")
    void validateIntervalStartLessThanEndTest() {
    	LocalTime intervalStart = LocalTime.of(14, 0, 0);
    	LocalTime intervalEnd = LocalTime.of(13, 0, 0);
    	String contribution = "04:00";
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateIntervalStartEndDifferenceEqualToContribution(intervalStart, intervalEnd, contribution));
        verify(this.messages, times(1)).throwIfError();
    }
    
    @Test
    @DisplayName("check validity of interval start, end and contribution - contribution not equal to difference")
    void validateIntervalStartEndDifferenceNotEqualToContributionTest() {
    	LocalTime intervalStart = LocalTime.of(10, 0, 0);
    	LocalTime intervalEnd = LocalTime.of(13, 0, 0);
    	String contribution = "04:00";
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateIntervalStartEndDifferenceEqualToContribution(intervalStart, intervalEnd, contribution));
        verify(this.messages, times(1)).throwIfError();
    }
    
    
    @Test
    @DisplayName("check validity of interval start, end and contribution")
    void validateSupplementStartEndDifferenceEqualToContributionTest() {
    	LocalTime intervalStart = LocalTime.of(9, 0, 0);
    	LocalTime intervalEnd = LocalTime.of(13, 0, 0);
    	String contribution = "04:00";
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateSupplementStartEndDifferenceEqualToContribution(intervalStart, intervalEnd, contribution));
        verify(this.messages, times(0)).throwIfError();
    }
    
    @Test
    @DisplayName("check validity of interval start, end and contribution - start time after than end time")
    void validateSupplementStartLessThanEndTest() {
    	LocalTime intervalStart = LocalTime.of(14, 0, 0);
    	LocalTime intervalEnd = LocalTime.of(13, 0, 0);
    	String contribution = "04:00";
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateSupplementStartEndDifferenceEqualToContribution(intervalStart, intervalEnd, contribution));
        verify(this.messages, times(1)).throwIfError();
    }
    
    @Test
    @DisplayName("check validity of interval start, end and contribution - contribution not equal to difference")
    void validateSupplementStartEndDifferenceNotEqualToContributionTest() {
    	LocalTime intervalStart = LocalTime.of(10, 0, 0);
    	LocalTime intervalEnd = LocalTime.of(13, 0, 0);
    	String contribution = "04:00";
        Assertions.assertDoesNotThrow(() -> classUnderTest.validateSupplementStartEndDifferenceEqualToContribution(intervalStart, intervalEnd, contribution));
        verify(this.messages, times(1)).throwIfError();
    }
    
    @Test
    @DisplayName("check validity of availability payload")
    void validateAvailablityTest() {
    	LocalDate availabilityDate = LocalDate.of(2023, 04, 03);
    	Assertions.assertDoesNotThrow(() -> classUnderTest.validateAvailability(480, 120, 360, availabilityDate, "testNormalWorkingTime"));
    	verify(this.messages, times(0)).throwIfError();
    }
    
    @Test
    @DisplayName("check validity of availability payload - both availability supplement and availablity interval are zero")
    void validateAvailablitySupplementAndIntervalBothZeroTest() {
    	LocalDate availabilityDate = LocalDate.of(2023, 04, 03);
    	Assertions.assertDoesNotThrow(() -> classUnderTest.validateAvailability(480, 0, 0, availabilityDate, "testNormalWorkingTime"));
    	verify(this.messages, times(2)).throwIfError();
    }
    
    @Test
    @DisplayName("check validity of availability payload - partial data")
    void validateAvailablityPartialDateTest() {
    	LocalDate availabilityDate = LocalDate.of(2023, 04, 03);
    	Assertions.assertDoesNotThrow(() -> classUnderTest.validateAvailability(480, 120, 120, availabilityDate, "testNormalWorkingTime"));
    	verify(this.messages, times(1)).throwIfError();
    }
    
    @Test
    @DisplayName("check validity of availability payload - overbooked")
    void validateAvailablityOverbookedTest() {
    	LocalDate availabilityDate = LocalDate.of(2023, 04, 03);
    	Assertions.assertDoesNotThrow(() -> classUnderTest.validateAvailability(480, 360, 360, availabilityDate, "testNormalWorkingTime"));
    	verify(this.messages, times(1)).throwIfError();
    }
    
    @Test
    @DisplayName("check validity of availability date against job details start and end date")
    void validateAvailabilityDateTest() {
    	LocalDate availabilityDate = LocalDate.of(2023, 04, 03);
    	LocalDate startDate = LocalDate.of(2022, 01, 01);
    	LocalDate endDate = LocalDate.of(2024, 01, 01);
    	when(mockWorkAssignmentDAO.getWorkAssignmentGuidStartDateAndEndDate(Mockito.anyString(), Mockito.anyString(), Mockito.anyString())).thenReturn(mockWorkAssignments);
    	when(mockWorkAssignments.getStartDate()).thenReturn(startDate);
    	when(mockWorkAssignments.getStartDate()).thenReturn(endDate);
    	classUnderTest.validateAvailabilityDate("testExternalID", "testWorkforcePersonID", "testTenant", availabilityDate);
    }
    
    @Test
    @DisplayName("check validity of availability date against job details start and end date - work assignment ID and workforce person ID combination doesn't match")
    void validateAvailabilityDateNullTest() {
    	LocalDate availabilityDate = LocalDate.of(2023, 04, 03);
    	when(mockWorkAssignmentDAO.getWorkAssignmentGuidStartDateAndEndDate(Mockito.anyString(), Mockito.anyString(), Mockito.anyString())).thenReturn(null);
    	Assertions.assertDoesNotThrow(() -> classUnderTest.validateAvailabilityDate("testExternalID", "testWorkforcePersonID", "testTenant", availabilityDate));
    	verify(this.messages, times(1)).throwIfError();
    }
    
    @Test
    @DisplayName("check validity of availability date against job details start and end date")
    void validateAvailabilityDateAvailablityDateOutOfRangeTest() {
    	LocalDate startDate = LocalDate.of(2018, 01, 01);
    	LocalDate endDate = LocalDate.of(2018, 01, 02);
    	LocalDate availabilityDate = LocalDate.of(2023, 04, 03);
    	
    	when(mockWorkAssignmentDAO.getWorkAssignmentGuidStartDateAndEndDate(Mockito.anyString(), Mockito.anyString(), Mockito.anyString())).thenReturn(mockWorkAssignments);
    	when(mockWorkAssignments.getStartDate()).thenReturn(startDate);
    	when(mockWorkAssignments.getStartDate()).thenReturn(endDate);
    	Assertions.assertDoesNotThrow(() -> classUnderTest.validateAvailabilityDate("testExternalID", "testWorkforcePersonID", "testTenant", availabilityDate));
    	verify(this.messages, times(1)).throwIfError();
    }
    
    @Test
    @DisplayName("Test get work assignment guid")
    void getWorkAssignmentGuidTest() {
    	WorkAssignments workAssignments = WorkAssignments.create("testWorkAssignmentID");
    	when(mockWorkAssignmentDAO.getWorkAssignmentGuidStartDateAndEndDate(Mockito.anyString(), Mockito.anyString(), Mockito.anyString())).thenReturn(mockWorkAssignments);
    	when(mockWorkAssignments.getId()).thenReturn("testWorkAssignmentID");
    	String workAssignmentGuid = classUnderTest.getWorkAssignmentGuid("testExternalID", "testWorkforcePersonID", "testTenant");
    	Assertions.assertEquals(workAssignmentGuid, workAssignments.getId());
    }
    
    @Test
    @DisplayName("Test get work assignment guid - work assignment ID and workforce person ID combination doesn't match")
    void getWorkAssignmentGuidNullTest() {    	
    	when(mockWorkAssignmentDAO.getWorkAssignmentGuidStartDateAndEndDate(Mockito.anyString(), Mockito.anyString(), Mockito.anyString())).thenReturn(null);   	
    	Assertions.assertDoesNotThrow(() -> classUnderTest.getWorkAssignmentGuid("testExternalID", "testWorkforcePersonID", "testTenant"));
    	verify(this.messages, times(1)).throwIfError();
    }
    
	  @Test
	  @DisplayName("check validity of workforce person - isBusinessPurposeCompleted equals true")
	  void validateWorkforcePersonActiveIsBusinessPurposeCompletedTrueTest() {
	  	when(mockWorforcePersonDAO.getIsBusinessPurposeCompletedForWorkforcePerson(Mockito.anyString())).thenReturn(false);
	  	classUnderTest.validateWorkforcePersonActive("testWorkforcePersonID");
	  	verify(this.messages, times(0)).throwIfError();
	  }
	  
	  @Test
	  @DisplayName("check validity of workforce person")
	  void validateWorkforcePersonActiveTest() {
	  	when(mockWorforcePersonDAO.getIsBusinessPurposeCompletedForWorkforcePerson(Mockito.anyString())).thenReturn(true);
	  	classUnderTest.validateWorkforcePersonActive("testWorkforcePersonID");
	  	Assertions.assertDoesNotThrow(() -> classUnderTest.validateWorkforcePersonActive("testWorkforcePersonID"));
    	verify(this.messages, times(2)).throwIfError();
	  }
}
