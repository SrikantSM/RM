package com.sap.c4p.rm.handlers;

import static com.sap.c4p.rm.utils.Constants.CREATE_OPERATION;
import static com.sap.c4p.rm.utils.Constants.UPDATE_OPERATION;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.auditlog.AuditLogUtil;
import com.sap.c4p.rm.workforceavailabilityservice.validations.WorkforceAvailabilityServiceValidator;
import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.request.UserInfo;
import com.sap.resourcemanagement.employee.workforceavailability.WorkforceAvailabilitySupplement;
import com.sap.resourcemanagement.employee.workforceavailability.WorkforceAvailabilityTimeInterval;
import com.sap.resourcemanagement.resource.Capacity;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.api.v2.AuditedDataSubject;

import workforceavailabilityservice.WorkforceAvailability;
import workforceavailabilityservice.WorkforceAvailability_;

public class WorkforceAvailabilityServiceEventHandlerTest extends InitMocks{
	
	private static final String WORKFORCE_AVAILABILITY_OBJECT_TYPE = "WorkforceAvailability";
	private static final String AVAILABILITY_SERVICE_IDENTIFIER = "WorkforceAvailabilityService";
	
	@Mock
    private WorkforceAvailabilityServiceValidator workforceAvailabilityServiceValidator;
	
	@Mock
    @Qualifier(WorkforceAvailability_.CDS_NAME)
    private CqnService mockAvailabilityService;
	
    @Mock
    private EventContext mockEventContext;
    
    @Mock
    private Result mockResult;
    
    @Mock
    private PersistenceService mockPersistenceService;
    
    @Mock
    private UserInfo userInfo;
    
    @Mock
    private WorkforceAvailability mockWorkforceAvailability;

    @Mock
    private CqnSelect mockCqnSelect;
    
    @Mock
    private AuditLogMessageFactory auditLogFactory;
    
    @Mock
    private AuditLogUtil mockAuditLogUtil;
    
    @Mock
    private AuditedDataSubject mockAuditedDataSubject;
    
    @Autowired
    @InjectMocks
    @Spy
    private WorkforceAvailabilityServiceEventHandler classUnderTest;
    
    @Test
    @DisplayName("test creation of workforce availability")
    void testBeforeCreateAvailability() throws IOException {
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
    	
        HashMap<String, String> entity = new HashMap<>();
        String availabilityDateString = availability.getAvailabilityDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        entity.put("workAssignmentID", availability.getWorkAssignmentID());
        entity.put("availabilityDate", availabilityDateString);
        entity.put("workforcePerson_ID", availability.getWorkforcePersonId());
        entity.put("normalWorkingTime", availability.getNormalWorkingTime());
        entity.put("availabilityIntervals", convertAvailabilityIntervalsToString(availability.getAvailabilityIntervals()));
        entity.put("availabilitySupplements", convertAvailabilitySupplementsToString(availability.getAvailabilitySupplements()));
        when(mockEventContext.getEvent()).thenReturn(CqnService.EVENT_CREATE);
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTest).getAuditedDataSubject(any());
    	
    	when(mockEventContext.getUserInfo()).thenReturn(userInfo);
    	when(userInfo.getTenant()).thenReturn("testTenant");
    	doNothing().when(workforceAvailabilityServiceValidator).checkAvailabilityForXss(availability);
    	doNothing().when(workforceAvailabilityServiceValidator).validateNormalWorkingTime(Mockito.anyString(), Mockito.any());
    	doNothing().when(workforceAvailabilityServiceValidator).validateWorkforcePersonActive(Mockito.anyString());
    	doNothing().when(workforceAvailabilityServiceValidator).validateAvailabilityDate(Mockito.anyString(), Mockito.anyString(), Mockito.anyString(), Mockito.any());
    	doNothing().when(workforceAvailabilityServiceValidator).validateAvailability(Mockito.anyInt(), Mockito.anyInt(), Mockito.anyInt(), Mockito.any(), Mockito.anyString());
    	
        classUnderTest.beforeCreateAvailability(mockEventContext, availability);
    	
    	verify(this.workforceAvailabilityServiceValidator, times(1)).checkAvailabilityForXss(availability);
    	verify(this.workforceAvailabilityServiceValidator, times(1)).validateNormalWorkingTime(Mockito.anyString(), Mockito.any());
    	verify(this.workforceAvailabilityServiceValidator, times(1)).validateWorkforcePersonActive(Mockito.anyString());
    	verify(this.workforceAvailabilityServiceValidator, times(1)).validateAvailabilityDate(Mockito.anyString(), Mockito.anyString(), Mockito.anyString(), Mockito.any());
    	verify(this.workforceAvailabilityServiceValidator, times(1)).validateAvailability(Mockito.anyInt(), Mockito.anyInt(), Mockito.anyInt(), Mockito.any(), Mockito.anyString());
    	verify(mockEventContext, times(1)).put(Mockito.anyString(), Mockito.any());
        verify(this.mockAuditLogUtil, times(1)).prepareDataModificationAuditMessage(mockEventContext, WORKFORCE_AVAILABILITY_OBJECT_TYPE, AVAILABILITY_SERVICE_IDENTIFIER, CREATE_OPERATION, entity, null, mockAuditedDataSubject);
    }
    
    @Test
    @DisplayName("test updation of workforce availability")
    void testBeforeUpdateAvailability() throws IOException {
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

        HashMap<String, String> entity = new HashMap<>();
        String availabilityDateString = availability.getAvailabilityDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        entity.put("workAssignmentID", availability.getWorkAssignmentID());
        entity.put("availabilityDate", availabilityDateString);
        entity.put("workforcePerson_ID", availability.getWorkforcePersonId());
        entity.put("normalWorkingTime", availability.getNormalWorkingTime());
        entity.put("availabilityIntervals", convertAvailabilityIntervalsToString(availability.getAvailabilityIntervals()));
        entity.put("availabilitySupplements", convertAvailabilitySupplementsToString(availability.getAvailabilitySupplements()));
        HashMap<String, String> oldEntity = new HashMap<>();
        String existingAvailabilityDateString = availability.getAvailabilityDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        oldEntity.put("workAssignmentID", "testWorkAssignmentID");
        oldEntity.put("availabilityDate", existingAvailabilityDateString);
        oldEntity.put("workforcePerson_ID", "testWorkforcePersonID");
        oldEntity.put("normalWorkingTime", "09:00");
        oldEntity.put("availabilityIntervals", convertAvailabilityIntervalsToString(availabilityIntervals));
        oldEntity.put("availabilitySupplements", convertAvailabilitySupplementsToString(availabilitySupplements));
        when(mockEventContext.getEvent()).thenReturn(CqnService.EVENT_UPDATE);
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTest).getAuditedDataSubject(any());
    	
    	when(mockEventContext.getUserInfo()).thenReturn(userInfo);
    	when(userInfo.getTenant()).thenReturn("testTenant");
    	when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
    	when(mockResult.first(WorkforceAvailability.class)).thenReturn(Optional.of(mockWorkforceAvailability));
    	when(mockWorkforceAvailability.getAvailabilityIntervals()).thenReturn(availabilityIntervals);
    	when(mockWorkforceAvailability.getAvailabilitySupplements()).thenReturn(availabilitySupplements);
    	when(mockWorkforceAvailability.getNormalWorkingTime()).thenReturn("09:00");
    	when(mockWorkforceAvailability.getWorkforcePersonId()).thenReturn("testWorkforcePersonID");
    	when(mockWorkforceAvailability.getWorkAssignmentID()).thenReturn("testWorkAssignmentID");
    	when(mockWorkforceAvailability.getAvailabilityDate()).thenReturn(availabilityDate);
    	doNothing().when(workforceAvailabilityServiceValidator).checkAvailabilityForXss(availability);
    	doNothing().when(workforceAvailabilityServiceValidator).validateNormalWorkingTime(Mockito.anyString(), Mockito.any());
    	doNothing().when(workforceAvailabilityServiceValidator).validateAvailability(Mockito.anyInt(), Mockito.anyInt(), Mockito.anyInt(), Mockito.any(), Mockito.anyString());
    	
        classUnderTest.beforeUpdateAvailability(mockEventContext, availability);
    	
    	verify(this.workforceAvailabilityServiceValidator, times(1)).checkAvailabilityForXss(availability);
    	verify(this.workforceAvailabilityServiceValidator, times(1)).validateNormalWorkingTime(Mockito.anyString(), Mockito.any());
    	verify(this.workforceAvailabilityServiceValidator, times(1)).validateAvailability(Mockito.anyInt(), Mockito.anyInt(), Mockito.anyInt(), Mockito.any(), Mockito.anyString());
    	verify(mockEventContext, times(1)).put(Mockito.anyString(), Mockito.any());
    	verify(this.mockAuditLogUtil, times(1)).prepareDataModificationAuditMessage(mockEventContext, WORKFORCE_AVAILABILITY_OBJECT_TYPE, AVAILABILITY_SERVICE_IDENTIFIER, UPDATE_OPERATION, entity, oldEntity, mockAuditedDataSubject);
    }
    
//    @Test
//    @DisplayName("test upsert of capacity in after handler during availability creation")
//    void testAfterCreateAvailability() {
//    	LocalDate date = LocalDate.parse("9999-12-31");
//    	Instant instant = date.atStartOfDay(ZoneId.of("UTC")).toInstant();
//    	WorkforceAvailability availability = WorkforceAvailability.create();
//    	
//		Capacity capacity = Capacity.create();
//		capacity.setResourceId("testAssignmentGuid");
//		capacity.setStartTime(instant);
//		capacity.setEndTime(instant);
//		capacity.setPlannedNonWorkingTimeInMinutes(0);
//		capacity.setWorkingTimeInMinutes(480);
//		mockEventContext.put("createCapacity", capacity);
//    	
//    	when(mockEventContext.get("createCapacity")).thenReturn(capacity);
//        classUnderTest.afterCreateAvailability(mockEventContext, availability);
//    	verify(mockPersistenceService, times(1)).run(any(CqnUpsert.class));
//    }
    
    @Test
    @DisplayName("test upsert of capacity in after handler during availability updation")
    void testAfterUpdateAvailability() {
    	WorkforceAvailability availability = WorkforceAvailability.create();
		Capacity capacity = Capacity.create();
		mockEventContext.put("updateCapacity", capacity);

    	when(mockEventContext.get("updateCapacity")).thenReturn(capacity);
        classUnderTest.afterUpdateAvailability(mockEventContext, availability);
    	verify(mockPersistenceService, times(1)).run(any(CqnUpdate.class));
    }
    
    private String convertAvailabilityIntervalsToString(Collection<WorkforceAvailabilityTimeInterval> intervals) {
        StringBuilder intervalString = new StringBuilder();
        for (WorkforceAvailabilityTimeInterval interval : intervals)
        	intervalString.append(interval.toJson());
        return intervalString.toString();
    }
    
    private String convertAvailabilitySupplementsToString(Collection<WorkforceAvailabilitySupplement> supplements) {
        StringBuilder supplementString = new StringBuilder();
        for (WorkforceAvailabilitySupplement supplement : supplements)
        	supplementString.append(supplement.toJson());
        return supplementString.toString();
    }
}
