package com.sap.c4p.rm.processor.workforce.dao;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import com.sap.resourcemanagement.employee.Attachment;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.replicationdao.MDIObjectReplicationStatusDAO;
import com.sap.c4p.rm.replicationdao.ReplicationFailureDAO;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationSummary;
import com.sap.resourcemanagement.consultantprofile.integration.ReplicationFailures;
import com.sap.resourcemanagement.employee.Headers;
import com.sap.resourcemanagement.employee.ProfilePhoto;
import com.sap.resourcemanagement.workforce.workforceperson.WorkforcePersons;

public class WorkforceReplicationDAOTest extends InitMocks {
    private static final Marker WORKFORCE_REPLICATION_MARKER = LoggingMarker.WORKFORCE_REPLICATION.getMarker();

    @Mock
    EmpHeaderDAO empHeaderDAO;

    @Mock
    WorkforcePersonDAO workforcePersonDAO;

    @Mock
    AvailabilityReplicationSummaryDAO availabilityReplicationSummaryDAO;

    @Mock
    ReplicationFailureDAO replicationFailureDAO;

    @Mock
    MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;

    @Mock
    ProfilePhotoDAO profilePhotoDAO;

    @Mock
    AttachmentDAO attachmentDAO;

    @Autowired
    @InjectMocks
    WorkforceReplicationDAOImpl classUnderTest;

    @Test
    @DisplayName("test save for create event of OneMDS with no availabilitySummary")
    public void testSaveForCreateEventOfOneMDSWithNoAvailabilitySummary() {
        Headers employeeHeaders = Headers.create();
        String employeeId = UUID.randomUUID().toString();
        employeeHeaders.setId(employeeId);
        ProfilePhoto profilePhoto = ProfilePhoto.create();
        profilePhoto.setId("profilePhotoId");
        profilePhoto.setEmployeeId(employeeId);
        Attachment attachment = Attachment.create();
        attachment.setId("attachmentId");
        attachment.setEmployeeId(employeeId);
        WorkforcePersons workforcePerson = WorkforcePersons.create();
        this.classUnderTest.save(employeeHeaders, workforcePerson, null, profilePhoto, attachment);
        verify(this.empHeaderDAO, times(1)).save(employeeHeaders);
        verify(this.workforcePersonDAO, times(1)).save(workforcePerson);
        verify(this.profilePhotoDAO, times(1)).save(profilePhoto);
        verify(this.attachmentDAO, times(1)).save(attachment);
        verify(this.mdiObjectReplicationStatusDAO, times(1)).delete(MDIEntities.WORKFORCE_PERSON, employeeId);
        verify(this.availabilityReplicationSummaryDAO, times(0)).save(null);
    }

    @Test
    @DisplayName("test save for create event of OneMDS with null profile photo")
    public void testSaveForCreateEventOfOneMDSWithNullProfilePhoto() {
        Headers employeeHeaders = Headers.create();
        String employeeId = UUID.randomUUID().toString();
        employeeHeaders.setId(employeeId);
        ProfilePhoto profilePhoto = null;
        Attachment attachment = Attachment.create();
        attachment.setId("attachmentId");
        attachment.setEmployeeId(employeeId);
        WorkforcePersons workforcePerson = WorkforcePersons.create();
        AvailabilityReplicationSummary availabilityReplicationSummary = AvailabilityReplicationSummary.create();
        List<AvailabilityReplicationSummary> availabilityReplicationSummaryList = Collections
                .singletonList(availabilityReplicationSummary);
        this.classUnderTest.save(employeeHeaders, workforcePerson, availabilityReplicationSummaryList, profilePhoto, attachment);
        verify(this.empHeaderDAO, times(1)).save(employeeHeaders);
        verify(this.workforcePersonDAO, times(1)).save(workforcePerson);
        verify(this.profilePhotoDAO, times(0)).save(null);
        verify(this.attachmentDAO, times(1)).save(attachment);
        verify(this.mdiObjectReplicationStatusDAO, times(1)).delete(MDIEntities.WORKFORCE_PERSON, employeeId);
        verify(this.availabilityReplicationSummaryDAO, times(0)).save(null);
    }

    @Test
    @DisplayName("test save for create event of OneMDS with profile photo")
    public void testSaveForCreateEventOfOneMDSWithProfilePhoto() {
        Headers employeeHeaders = Headers.create();
        String employeeId = UUID.randomUUID().toString();
        employeeHeaders.setId(employeeId);
        ProfilePhoto profilePhoto = ProfilePhoto.create();
        profilePhoto.setId("profilePhotoId");
        profilePhoto.setEmployeeId(employeeId);
        Attachment attachment = null;
        WorkforcePersons workforcePerson = WorkforcePersons.create();
        this.classUnderTest.save(employeeHeaders, workforcePerson, null, profilePhoto, attachment);
        verify(this.empHeaderDAO, times(1)).save(employeeHeaders);
        verify(this.workforcePersonDAO, times(1)).save(workforcePerson);
        verify(this.profilePhotoDAO, times(1)).save(profilePhoto);
        verify(this.attachmentDAO, times(0)).save(null);
        verify(this.mdiObjectReplicationStatusDAO, times(1)).delete(MDIEntities.WORKFORCE_PERSON, employeeId);
    }

    @Test
    @DisplayName("test save for create event of OneMDS with availabilitySummary")
    public void testSaveForCreateEventOfOneMDSWithAvailabilitySummary() {
        Headers employeeHeaders = Headers.create();
        String employeeId = UUID.randomUUID().toString();
        employeeHeaders.setId(employeeId);
        ProfilePhoto profilePhoto = ProfilePhoto.create();
        profilePhoto.setId("profilePhotoId");
        profilePhoto.setEmployeeId(employeeId);
        Attachment attachment = Attachment.create();
        attachment.setId("attachmentId");
        attachment.setEmployeeId(employeeId);
        WorkforcePersons workforcePerson = WorkforcePersons.create();
        AvailabilityReplicationSummary availabilityReplicationSummary = AvailabilityReplicationSummary.create();
        List<AvailabilityReplicationSummary> availabilityReplicationSummaryList = Collections
                .singletonList(availabilityReplicationSummary);
        this.classUnderTest.save(employeeHeaders, workforcePerson,
                Collections.singletonList(availabilityReplicationSummary), profilePhoto, attachment);
        verify(this.empHeaderDAO, times(1)).save(employeeHeaders);
        verify(this.workforcePersonDAO, times(1)).save(workforcePerson);
        verify(this.profilePhotoDAO, times(1)).save(profilePhoto);
        verify(this.attachmentDAO, times(1)).save(attachment);
        verify(this.mdiObjectReplicationStatusDAO, times(1)).delete(MDIEntities.WORKFORCE_PERSON, employeeId);
        verify(this.availabilityReplicationSummaryDAO, times(1)).save(availabilityReplicationSummaryList);
    }

    @Test
    @DisplayName("test save for update/include event of OneMDS with no employee and availabilitySummary")
    public void testSaveForUpdateIncludeEventOfOneMDSWithNoEmployeeAndAvailabilitySummary() {
        Headers employeeHeaders = Headers.create();
        employeeHeaders.setId("employeeId");
        ProfilePhoto profilePhoto = ProfilePhoto.create();
        profilePhoto.setId("profilePhotoId");
        profilePhoto.setEmployeeId("employeeId");
        Attachment attachment = Attachment.create();
        attachment.setId("attachmentId");
        attachment.setEmployeeId("employeeId");
        WorkforcePersons workforcePerson = WorkforcePersons.create();
        ReplicationFailures replicationFailures = ReplicationFailures.create();
        when(this.empHeaderDAO.isExists("employeeId")).thenReturn(Boolean.FALSE);
        this.classUnderTest.save(employeeHeaders, workforcePerson, null, profilePhoto, attachment, replicationFailures);
        verify(this.empHeaderDAO, times(1)).save(employeeHeaders);
        verify(this.workforcePersonDAO, times(1)).save(workforcePerson);
        verify(this.profilePhotoDAO, times(1)).save(profilePhoto);
        verify(this.attachmentDAO, times(1)).save(attachment);
        verify(this.replicationFailureDAO, times(1)).update(WORKFORCE_REPLICATION_MARKER, replicationFailures);
        verify(this.availabilityReplicationSummaryDAO, times(0)).save(null);
    }

    @Test
    @DisplayName("test save for update/include event of OneMDS with employee and availabilitySummary")
    public void testSaveForUpdateIncludeEventOfOneMDSWithEmployeeAndAvailabilitySummary() {
        Headers employeeHeaders = Headers.create();
        employeeHeaders.setId("employeeId");
        ProfilePhoto profilePhoto = ProfilePhoto.create();
        profilePhoto.setId("profilePhotoId");
        profilePhoto.setEmployeeId("employeeId");
        Attachment attachment = Attachment.create();
        attachment.setId("attachmentId");
        attachment.setEmployeeId("employeeId");
        WorkforcePersons workforcePerson = WorkforcePersons.create();
        AvailabilityReplicationSummary availabilityReplicationSummary = AvailabilityReplicationSummary.create();
        List<AvailabilityReplicationSummary> availabilityReplicationSummaryList = Collections
                .singletonList(availabilityReplicationSummary);
        ReplicationFailures replicationFailures = ReplicationFailures.create();
        when(this.empHeaderDAO.isExists("employeeId")).thenReturn(Boolean.TRUE);
        this.classUnderTest.save(employeeHeaders, workforcePerson,
                Collections.singletonList(availabilityReplicationSummary), profilePhoto, attachment, replicationFailures);
        verify(this.empHeaderDAO, times(1)).save(employeeHeaders);
        verify(this.workforcePersonDAO, times(1)).save(workforcePerson);
        verify(this.profilePhotoDAO, times(1)).save(profilePhoto);
        verify(this.attachmentDAO, times(1)).save(attachment);
        verify(this.replicationFailureDAO, times(1)).update(WORKFORCE_REPLICATION_MARKER, replicationFailures);
        verify(this.availabilityReplicationSummaryDAO, times(1)).save(availabilityReplicationSummaryList);
    }

    @Test
    @DisplayName("test save for update/include event of OneMDS with employee availabilitySummary and null profile photo")
    public void testSaveForUpdateIncludeEventOfOneMDSWithEmployeeAndAvailabilitySummaryNullProfilePhoto() {
        Headers employeeHeaders = Headers.create();
        employeeHeaders.setId("employeeId");
        ProfilePhoto profilePhoto = null;
        Attachment attachment = Attachment.create();
        attachment.setId("attachmentId");
        attachment.setEmployeeId("employeeId");
        WorkforcePersons workforcePerson = WorkforcePersons.create();
        AvailabilityReplicationSummary availabilityReplicationSummary = AvailabilityReplicationSummary.create();
        List<AvailabilityReplicationSummary> availabilityReplicationSummaryList = Collections
                .singletonList(availabilityReplicationSummary);
        ReplicationFailures replicationFailures = ReplicationFailures.create();
        when(this.empHeaderDAO.isExists("employeeId")).thenReturn(Boolean.TRUE);
        this.classUnderTest.save(employeeHeaders, workforcePerson,
                Collections.singletonList(availabilityReplicationSummary), profilePhoto, attachment, replicationFailures);
        verify(this.empHeaderDAO, times(1)).save(employeeHeaders);
        verify(this.workforcePersonDAO, times(1)).save(workforcePerson);
        verify(this.profilePhotoDAO, times(0)).save(null);
        verify(this.attachmentDAO, times(1)).save(attachment);
        verify(this.replicationFailureDAO, times(1)).update(WORKFORCE_REPLICATION_MARKER, replicationFailures);
        verify(this.availabilityReplicationSummaryDAO, times(1)).save(availabilityReplicationSummaryList);
    }

    @Test
    @DisplayName("test save for create event of OneMDS with null attachment")
    public void testSaveForCreateEventOfOneMDSWithNullAttachment() {
        Headers employeeHeaders = Headers.create();
        String employeeId = UUID.randomUUID().toString();
        employeeHeaders.setId(employeeId);
        ProfilePhoto profilePhoto = ProfilePhoto.create();
        profilePhoto.setId("profilePhotoId");
        profilePhoto.setEmployeeId("employeeId");
        Attachment attachment = null;
        WorkforcePersons workforcePerson = WorkforcePersons.create();
        AvailabilityReplicationSummary availabilityReplicationSummary = AvailabilityReplicationSummary.create();
        List<AvailabilityReplicationSummary> availabilityReplicationSummaryList = Collections
            .singletonList(availabilityReplicationSummary);
        this.classUnderTest.save(employeeHeaders, workforcePerson, availabilityReplicationSummaryList, profilePhoto, attachment);
        verify(this.empHeaderDAO, times(1)).save(employeeHeaders);
        verify(this.workforcePersonDAO, times(1)).save(workforcePerson);
        verify(this.profilePhotoDAO, times(1)).save(profilePhoto);
        verify(this.attachmentDAO, times(0)).save(null);
        verify(this.mdiObjectReplicationStatusDAO, times(1)).delete(MDIEntities.WORKFORCE_PERSON, employeeId);
        verify(this.availabilityReplicationSummaryDAO, times(0)).save(null);
    }

    @Test
    @DisplayName("test save for create event of OneMDS with attachment")
    public void testSaveForCreateEventOfOneMDSWithAttachment() {
        Headers employeeHeaders = Headers.create();
        String employeeId = UUID.randomUUID().toString();
        employeeHeaders.setId(employeeId);
        ProfilePhoto profilePhoto = null;
        Attachment attachment = Attachment.create();
        attachment.setId("attachmentId");
        attachment.setEmployeeId("employeeId");
        WorkforcePersons workforcePerson = WorkforcePersons.create();
        this.classUnderTest.save(employeeHeaders, workforcePerson, null, profilePhoto, attachment);
        verify(this.empHeaderDAO, times(1)).save(employeeHeaders);
        verify(this.workforcePersonDAO, times(1)).save(workforcePerson);
        verify(this.profilePhotoDAO, times(0)).save(null);
        verify(this.attachmentDAO, times(1)).save(attachment);
        verify(this.mdiObjectReplicationStatusDAO, times(1)).delete(MDIEntities.WORKFORCE_PERSON, employeeId);
    }

    @Test
    @DisplayName("test save for update/include event of OneMDS with employee availabilitySummary and null attachment")
    public void testSaveForUpdateIncludeEventOfOneMDSWithEmployeeAndAvailabilitySummaryNullAttachment() {
        Headers employeeHeaders = Headers.create();
        employeeHeaders.setId("employeeId");
        ProfilePhoto profilePhoto = ProfilePhoto.create();
        profilePhoto.setId("profilePhotoId");
        profilePhoto.setEmployeeId("employeeId");
        Attachment attachment = null;
        WorkforcePersons workforcePerson = WorkforcePersons.create();
        AvailabilityReplicationSummary availabilityReplicationSummary = AvailabilityReplicationSummary.create();
        List<AvailabilityReplicationSummary> availabilityReplicationSummaryList = Collections
            .singletonList(availabilityReplicationSummary);
        ReplicationFailures replicationFailures = ReplicationFailures.create();
        when(this.empHeaderDAO.isExists("employeeId")).thenReturn(Boolean.TRUE);
        this.classUnderTest.save(employeeHeaders, workforcePerson,
            Collections.singletonList(availabilityReplicationSummary), profilePhoto, attachment, replicationFailures);
        verify(this.empHeaderDAO, times(1)).save(employeeHeaders);
        verify(this.workforcePersonDAO, times(1)).save(workforcePerson);
        verify(this.profilePhotoDAO, times(1)).save(profilePhoto);
        verify(this.attachmentDAO, times(0)).save(null);
        verify(this.replicationFailureDAO, times(1)).update(WORKFORCE_REPLICATION_MARKER, replicationFailures);
        verify(this.availabilityReplicationSummaryDAO, times(1)).save(availabilityReplicationSummaryList);
    }

    @Test
    @DisplayName("test save for update/include event of OneMDS with employee availabilitySummary and null profile photo and attachment")
    public void testSaveForUpdateIncludeEventOfOneMDSWithEmployeeAndAvailabilitySummaryNullPhotoAndAttachment() {
        Headers employeeHeaders = Headers.create();
        employeeHeaders.setId("employeeId");
        ProfilePhoto profilePhoto = null;
        Attachment attachment = null;
        WorkforcePersons workforcePerson = WorkforcePersons.create();
        AvailabilityReplicationSummary availabilityReplicationSummary = AvailabilityReplicationSummary.create();
        List<AvailabilityReplicationSummary> availabilityReplicationSummaryList = Collections
            .singletonList(availabilityReplicationSummary);
        ReplicationFailures replicationFailures = ReplicationFailures.create();
        when(this.empHeaderDAO.isExists("employeeId")).thenReturn(Boolean.TRUE);
        this.classUnderTest.save(employeeHeaders, workforcePerson,
            Collections.singletonList(availabilityReplicationSummary), profilePhoto, attachment, replicationFailures);
        verify(this.empHeaderDAO, times(1)).save(employeeHeaders);
        verify(this.workforcePersonDAO, times(1)).save(workforcePerson);
        verify(this.profilePhotoDAO, times(0)).save(null);
        verify(this.attachmentDAO, times(0)).save(null);
        verify(this.replicationFailureDAO, times(1)).update(WORKFORCE_REPLICATION_MARKER, replicationFailures);
        verify(this.availabilityReplicationSummaryDAO, times(1)).save(availabilityReplicationSummaryList);
    }

}
