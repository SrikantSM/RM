package com.sap.c4p.rm.consultantprofile.availabilityservice;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import org.apache.commons.csv.CSVRecord;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.csvcolumns.CapacityCsvColumn;
import com.sap.c4p.rm.consultantprofile.exceptions.AvailabilityUploadException;
import com.sap.c4p.rm.consultantprofile.exceptions.TrackException;
import com.sap.c4p.rm.consultantprofile.utils.HttpStatus;
import com.sap.c4p.rm.consultantprofile.utils.commonvalidations.CommonValidator;

import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationView;

public class CsvInputValidatorTest extends InitMocks {

    @Mock
    private CommonValidator mockCommonValidator;

    @Autowired
    @InjectMocks
    private CsvInputValidator cut;

    @Test
    @DisplayName("validateInputForFileDownload: Throws ServiceException with start date is null")
    void validateInputForFileDownloadTest1() {
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        ServiceException exception = assertThrows(ServiceException.class,
                () -> this.cut.validateInputForFileDownload(null, "2020-01-31", "1010", "WRK01"));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
    }

    @Test
    @DisplayName("validateInputForFileDownload: Throws ServiceException with end date is null")
    void validateInputForFileDownloadTest2() {
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        ServiceException exception = assertThrows(ServiceException.class,
                () -> this.cut.validateInputForFileDownload("2020-01-01", null, "1010", "WRK01"));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
    }

    @Test
    @DisplayName("validateInputForFileDownload: Throws ServiceException with start date invalid format")
    void validateInputForFileDownloadTest3() {
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        ServiceException exception = assertThrows(ServiceException.class,
                () -> this.cut.validateInputForFileDownload("2020/01-01", "2020-01-31", "1010", "WRK01"));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
    }

    @Test
    @DisplayName("validateInputForFileDownload: Throws ServiceException with end date invalid format")
    void validateInputForFileDownloadTest4() {
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        ServiceException exception = assertThrows(ServiceException.class,
                () -> this.cut.validateInputForFileDownload("2020-01-01", "2020/01-31", "1010", "WRK01"));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
    }

    @Test
    @DisplayName("validateInputForFileDownload: Throws ServiceException with costcenter is null")
    void validateInputForFileDownloadTest11() {
        ServiceException exception = assertThrows(ServiceException.class,
                () -> this.cut.validateInputForFileDownload("2020-01-01", "2020-01-31", null, "WRK01"));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
    }

    @Test
    @DisplayName("validateInputForFileDownload: Throws ServiceException with costcenter length greater than 10")
    void validateInputForFileDownloadTest5() {
        ServiceException exception = assertThrows(ServiceException.class,
                () -> this.cut.validateInputForFileDownload("2020-01-01", "2020-01-31", "TestingLength", "WRK01"));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
    }

    @Test
    @DisplayName("validateInputForFileDownload: Throws ServiceException when workforce person Id contains script tag.")
    void validateInputForFileDownloadTest6() {
        String script = "<script>";
        when(mockCommonValidator.validateFreeTextforScripting("1010")).thenReturn(true);
        ServiceException exception = assertThrows(ServiceException.class,
                () -> this.cut.validateInputForFileDownload("2020-01-01", "2020-01-31", "1010", script));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
    }

    @Test
    @DisplayName("validateInputForFileDownload: Throws ServiceException when Costcenter contains script tag.")
    void validateInputForFileDownloadTest7() {
        String costCenter = "<script>";
        ServiceException exception = assertThrows(ServiceException.class,
                () -> this.cut.validateInputForFileDownload("2020-01-01", "2020-01-31", costCenter, "WRK01"));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
    }

    @Test
    @DisplayName("validateInputForFileDownload: Throws ServiceException when StartDate contains script tag.")
    void validateInputForFileDownloadTest8() {
        String startDate = "<script>";
        when(mockCommonValidator.validateFreeTextforScripting("1010")).thenReturn(true);
        when(mockCommonValidator.validateFreeTextforScripting("WRK01")).thenReturn(true);
        ServiceException exception = assertThrows(ServiceException.class,
                () -> this.cut.validateInputForFileDownload(startDate, "2020-01-31", "1010", "WRK01"));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
    }

    @Test
    @DisplayName("validateInputForFileDownload: Throws ServiceException when EndDate contains script tag.")
    void validateInputForFileDownloadTest9() {
        String endDate = "<script>";
        when(mockCommonValidator.validateFreeTextforScripting("1010")).thenReturn(true);
        when(mockCommonValidator.validateFreeTextforScripting("WRK01")).thenReturn(true);
        when(mockCommonValidator.validateFreeTextforScripting("2020-01-01")).thenReturn(true);
        ServiceException exception = assertThrows(ServiceException.class,
                () -> this.cut.validateInputForFileDownload("2020-01-01", endDate, "1010", "WRK01"));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
    }

    @Test
    @DisplayName("validateInputForFileDownload: Throws ServiceException when StartDate greater than EndDate.")
    void validateInputForFileDownloadTest10() {
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        ServiceException exception = assertThrows(ServiceException.class,
                () -> this.cut.validateInputForFileDownload("2020-02-01", "2020-01-31", "1010", "WRK01"));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
    }

    @Test
    @DisplayName("validateInputForFileDownload: No Exception is raised when StartDate is less than EndDate and rest of elements are is correct format.")
    void validateInputForFileDownloadTest12() {
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        assertDoesNotThrow(() -> this.cut.validateInputForFileDownload("2020-01-01", "2020-01-31", "1010", "WRK01"));
    }

    @Test
    @DisplayName("Is BusinessPurposeCompleted: Throws AvailabilityUploadException when Business purpose completed flag is set to true.")
    void validateIsWPBusinessPurposeCompleted1() {
        List<AvailabilityReplicationView> assignments = createTestEntities(1, i -> {
            final AvailabilityReplicationView mockAvailability = AvailabilityReplicationView.create();
            mockAvailability.setResourceId("bbaa29a2-f0bd-4d51-80c9-c74a7b37c65d");
            mockAvailability.setWorkAssignmentExternalId("WORKASSIGNMENT1");
            mockAvailability.setWorkForcePersonExternalId("EXTN1");
            mockAvailability.setWorkAssignmentStartDate("2020-01-10");
            mockAvailability.setWorkAssignmentEndDate("2020-01-31");
            mockAvailability.setIsBusinessPurposeCompleted(true);
            return mockAvailability;
        });
        AvailabilityUploadException exception = assertThrows(AvailabilityUploadException.class,
                () -> this.cut.isWPBusinessPurposeCompleted(assignments.get(0)));
        assertEquals(HttpStatus.BAD_REQUEST, exception.httpStatus());
    }

    @Test
    @DisplayName("Is BusinessPurposeCompleted: No Exception is raised when Business purpose completed flag is set to false.")
    void validateIsWPBusinessPurposeCompleted2() {
        List<AvailabilityReplicationView> assignments = createTestEntities(1, i -> {
            final AvailabilityReplicationView mockAvailability = AvailabilityReplicationView.create();
            mockAvailability.setResourceId("bbaa29a2-f0bd-4d51-80c9-c74a7b37c65d");
            mockAvailability.setWorkAssignmentExternalId("WORKASSIGNMENT1");
            mockAvailability.setWorkForcePersonExternalId("EXTN1");
            mockAvailability.setWorkAssignmentStartDate("2020-01-10");
            mockAvailability.setWorkAssignmentEndDate("2020-01-31");
            mockAvailability.setIsBusinessPurposeCompleted(false);
            return mockAvailability;
        });
        assertDoesNotThrow(() -> this.cut.isWPBusinessPurposeCompleted(assignments.get(0)));
    }

    @Test
    @DisplayName("WorkAssignment empty: Throws AvailabilityUploadException when work assignment is not present.")
    void validateIsNullWorkAssignment1() {
        AvailabilityUploadException exception = assertThrows(AvailabilityUploadException.class,
                () -> this.cut.isNullWorkAssignment(null));
        assertEquals(HttpStatus.BAD_REQUEST, exception.httpStatus());
    }

    @Test
    @DisplayName("WorkAssignment empty: No Exception is raised when workassignment is present.")
    void validateIsNullWorkAssignment2() {
        assertDoesNotThrow(() -> this.cut.isNullWorkAssignment(AvailabilityReplicationView.create()));
    }

    @Test
    @DisplayName("ResourceId empty: Throws TrackException when workassignment is not present.")
    void validateIsNullResourceId1() {
        TrackException exception = assertThrows(TrackException.class, () -> this.cut.isNullResourceId(null));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
    }

    @Test
    @DisplayName("ResourceId empty: No Exception is raised when workassignment is present.")
    void validateIsNullResourceId2() {
        assertDoesNotThrow(() -> this.cut.isNullResourceId(AvailabilityReplicationView.create()));
    }

    @Test
    @DisplayName("validateInputForFileUpload: Throws AvailabilityUploadException when more than 1 file is passed.")
    void validateInputForFileUploadTest1() {
        final MultipartFile[] files = new MultipartFile[2];
        final MultipartFile mockFile = mock(MultipartFile.class);
        files[0] = mockFile;
        files[1] = mockFile;
        ServiceException exception = assertThrows(ServiceException.class,
                () -> this.cut.validateInputForFileUpload(files, "1010"));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
    }

    @Test
    @DisplayName("validateInputForFileUpload: Throws AvailabilityUploadException when no file is passed.")
    void validateInputForFileUploadTest2() {
        final MultipartFile[] files = new MultipartFile[0];
        ServiceException exception = assertThrows(ServiceException.class,
                () -> this.cut.validateInputForFileUpload(files, "1010"));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
    }

    @Test
    @DisplayName("validateInputForFileUpload: Throws AvailabilityUploadException when costcenter length is greater than 10.")
    void validateInputForFileUploadTest3() {
        final MultipartFile[] files = new MultipartFile[1];
        final MultipartFile mockFile = mock(MultipartFile.class);
        files[0] = mockFile;
        ServiceException exception = assertThrows(ServiceException.class,
                () -> this.cut.validateInputForFileUpload(files, "101010101010"));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
    }

    @Test
    @DisplayName("validateInputForFileUpload: Throws AvailabilityUploadException when costcenter is null.")
    void validateInputForFileUploadTest4() {
        final MultipartFile[] files = new MultipartFile[1];
        final MultipartFile mockFile = mock(MultipartFile.class);
        files[0] = mockFile;
        ServiceException exception = assertThrows(ServiceException.class,
                () -> this.cut.validateInputForFileUpload(files, ""));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
    }

    @Test
    @DisplayName("validateInputForFileUpload: Throws AvailabilityUploadException when costcenter contain script tag.")
    void validateInputForFileUploadTest5() {
        final MultipartFile[] files = new MultipartFile[1];
        final MultipartFile mockFile = mock(MultipartFile.class);
        files[0] = mockFile;
        String costCenter = "<script>";
        when(mockCommonValidator.validateFreeTextforScripting(costCenter)).thenReturn(false);
        ServiceException exception = assertThrows(ServiceException.class,
                () -> this.cut.validateInputForFileUpload(files, costCenter));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
    }

    @Test
    @DisplayName("validateInputForFileUpload: No Exception raised when only one file is passed and costcenter is of correct format.")
    void validateInputForFileUploadTest6() {
        final MultipartFile[] files = new MultipartFile[1];
        final MultipartFile mockFile = mock(MultipartFile.class);
        files[0] = mockFile;
        String costCenter = "CC01";
        when(mockCommonValidator.validateFreeTextforScripting(costCenter)).thenReturn(true);
        assertDoesNotThrow(() -> this.cut.validateInputForFileUpload(files, costCenter));
    }

    @Test
    @DisplayName("validateColumnsContent: Throws TrackException with invalid resourceId.")
    void validateColumnsContent1() {
        CSVRecord mockCsvRecord = mock(CSVRecord.class);
        when(mockCsvRecord.get(CapacityCsvColumn.RESOURCE_ID.getName())).thenReturn("100");
        TrackException exception = assertThrows(TrackException.class,
                () -> this.cut.validateColumnsContent(mockCsvRecord));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
    }

    @Test
    @DisplayName("validateColumnsContent: Throws TrackException resourceId is null.")
    void validateColumnsContent1_1() {
        CSVRecord mockCsvRecord = mock(CSVRecord.class);
        when(mockCsvRecord.get(CapacityCsvColumn.RESOURCE_ID.getName())).thenReturn("");
        TrackException exception = assertThrows(TrackException.class,
                () -> this.cut.validateColumnsContent(mockCsvRecord));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getErrorStatus());
    }

    @Test
    @DisplayName("validateColumnsContent: Throws AvailabilityUploadException when costcenter is null.")
    void validateColumnsContent2() {
        CSVRecord mockCsvRecord = mock(CSVRecord.class);
        String resourceId = "c22218a6-c594-4547-9853-ed2b14327bfc";
        when(mockCsvRecord.get(CapacityCsvColumn.RESOURCE_ID.getName())).thenReturn(resourceId);
        when(mockCsvRecord.get(CapacityCsvColumn.S4COSTCENTER_ID.getName())).thenReturn(null);

        AvailabilityUploadException exception = assertThrows(AvailabilityUploadException.class,
                () -> this.cut.validateColumnsContent(mockCsvRecord));
        assertEquals(HttpStatus.BAD_REQUEST, exception.httpStatus());
    }

    @Test
    @DisplayName("validateColumnsContent: Throws AvailabilityUploadException when costcenter length is greater than 10 ")
    void validateColumnsContent3() {
        CSVRecord mockCsvRecord = mock(CSVRecord.class);
        String resourceId = "c22218a6-c594-4547-9853-ed2b14327bfc";
        when(mockCsvRecord.get(CapacityCsvColumn.RESOURCE_ID.getName())).thenReturn(resourceId);
        when(mockCsvRecord.get(CapacityCsvColumn.S4COSTCENTER_ID.getName())).thenReturn("=cmd|’ /C calc’!A1");

        AvailabilityUploadException exception = assertThrows(AvailabilityUploadException.class,
                () -> this.cut.validateColumnsContent(mockCsvRecord));
        assertEquals(HttpStatus.BAD_REQUEST, exception.httpStatus());
    }

    @Test
    @DisplayName("validateColumnsContent: Throws AvailabilityUploadException when start date is in invalid format")
    void validateColumnsContent4() {
        CSVRecord mockCsvRecord = mock(CSVRecord.class);
        String resourceId = "c22218a6-c594-4547-9853-ed2b14327bfc";
        String costcenter = "CC001";
        when(mockCsvRecord.get(CapacityCsvColumn.RESOURCE_ID.getName())).thenReturn(resourceId);
        when(mockCsvRecord.get(CapacityCsvColumn.S4COSTCENTER_ID.getName())).thenReturn(costcenter);
        when(mockCsvRecord.get(CapacityCsvColumn.STARTDATE.getName())).thenReturn("2020/01-01");

        AvailabilityUploadException exception = assertThrows(AvailabilityUploadException.class,
                () -> this.cut.validateColumnsContent(mockCsvRecord));
        assertEquals(HttpStatus.BAD_REQUEST, exception.httpStatus());
    }

    @Test
    @DisplayName("validateColumnsContent: Throws AvailabilityUploadException when working hours in invalid format")
    void validateColumnsContent5() {
        CSVRecord mockCsvRecord = mock(CSVRecord.class);
        String resourceId = "c22218a6-c594-4547-9853-ed2b14327bfc";
        String costcenter = "CC001";
        String startDate = "2020-01-01";
        when(mockCsvRecord.get(CapacityCsvColumn.RESOURCE_ID.getName())).thenReturn(resourceId);
        when(mockCsvRecord.get(CapacityCsvColumn.S4COSTCENTER_ID.getName())).thenReturn(costcenter);
        when(mockCsvRecord.get(CapacityCsvColumn.STARTDATE.getName())).thenReturn(startDate);
        when(mockCsvRecord.get(CapacityCsvColumn.PLANNEDWORKINGHOURS.getName())).thenReturn("2.1");

        AvailabilityUploadException exception = assertThrows(AvailabilityUploadException.class,
                () -> this.cut.validateColumnsContent(mockCsvRecord));
        assertEquals(HttpStatus.BAD_REQUEST, exception.httpStatus());
    }

    @Test
    @DisplayName("validateColumnsContent: Throws AvailabilityUploadException when non-working hours in invalid format")
    void validateColumnsContent6() {
        CSVRecord mockCsvRecord = mock(CSVRecord.class);
        String resourceId = "c22218a6-c594-4547-9853-ed2b14327bfc";
        String costcenter = "CC001";
        String startDate = "2020-01-01";
        String workingHours = "2";
        when(mockCsvRecord.get(CapacityCsvColumn.RESOURCE_ID.getName())).thenReturn(resourceId);
        when(mockCsvRecord.get(CapacityCsvColumn.S4COSTCENTER_ID.getName())).thenReturn(costcenter);
        when(mockCsvRecord.get(CapacityCsvColumn.STARTDATE.getName())).thenReturn(startDate);
        when(mockCsvRecord.get(CapacityCsvColumn.PLANNEDWORKINGHOURS.getName())).thenReturn(workingHours);
        when(mockCsvRecord.get(CapacityCsvColumn.NONWORKINGHOURS.getName())).thenReturn("2.1");

        AvailabilityUploadException exception = assertThrows(AvailabilityUploadException.class,
                () -> this.cut.validateColumnsContent(mockCsvRecord));
        assertEquals(HttpStatus.BAD_REQUEST, exception.httpStatus());
    }

    @Test
    @DisplayName("validate24Hrs: Throws AvailabilityUploadException when working hours not in 24hrs format")
    void validate24Hrs1() {
        CSVRecord mockCsvRecord = mock(CSVRecord.class);
        String resourceId = "c22218a6-c594-4547-9853-ed2b14327bfc";
        String costcenter = "CC001";
        String startDate = "2020-01-01";
        when(mockCsvRecord.get(CapacityCsvColumn.RESOURCE_ID.getName())).thenReturn(resourceId);
        when(mockCsvRecord.get(CapacityCsvColumn.S4COSTCENTER_ID.getName())).thenReturn(costcenter);
        when(mockCsvRecord.get(CapacityCsvColumn.STARTDATE.getName())).thenReturn(startDate);
        when(mockCsvRecord.get(CapacityCsvColumn.PLANNEDWORKINGHOURS.getName())).thenReturn("26");
        AvailabilityUploadException exception = assertThrows(AvailabilityUploadException.class,
                () -> this.cut.validateColumnsContent(mockCsvRecord));
        assertEquals(HttpStatus.BAD_REQUEST, exception.httpStatus());
    }

    @Test
    @DisplayName("validate24Hrs: Throws AvailabilityUploadException when non-working hours not in 24hrs format")
    void validate24Hrs2() {
        CSVRecord mockCsvRecord = mock(CSVRecord.class);
        String resourceId = "c22218a6-c594-4547-9853-ed2b14327bfc";
        String costcenter = "CC001";
        String startDate = "2020-01-01";
        String workingHours = "2";
        when(mockCsvRecord.get(CapacityCsvColumn.RESOURCE_ID.getName())).thenReturn(resourceId);
        when(mockCsvRecord.get(CapacityCsvColumn.S4COSTCENTER_ID.getName())).thenReturn(costcenter);
        when(mockCsvRecord.get(CapacityCsvColumn.STARTDATE.getName())).thenReturn(startDate);
        when(mockCsvRecord.get(CapacityCsvColumn.PLANNEDWORKINGHOURS.getName())).thenReturn(workingHours);
        when(mockCsvRecord.get(CapacityCsvColumn.NONWORKINGHOURS.getName())).thenReturn("26");

        AvailabilityUploadException exception = assertThrows(AvailabilityUploadException.class,
                () -> this.cut.validateColumnsContent(mockCsvRecord));
        assertEquals(HttpStatus.BAD_REQUEST, exception.httpStatus());
    }

    @Test
    @DisplayName("validateColumnsContent: Throws AvailabilityUploadException when working hours and non-working hours not in 24hrs format")
    void validateColumnsContent7() {
        CSVRecord mockCsvRecord = mock(CSVRecord.class);
        String resourceId = "c22218a6-c594-4547-9853-ed2b14327bfc";
        String costcenter = "CC001";
        String startDate = "2020-01-01";
        String workingHours = "26";
        String nonWorkingHours = "36";
        when(mockCsvRecord.get(CapacityCsvColumn.RESOURCE_ID.getName())).thenReturn(resourceId);
        when(mockCsvRecord.get(CapacityCsvColumn.S4COSTCENTER_ID.getName())).thenReturn(costcenter);
        when(mockCsvRecord.get(CapacityCsvColumn.STARTDATE.getName())).thenReturn(startDate);
        when(mockCsvRecord.get(CapacityCsvColumn.PLANNEDWORKINGHOURS.getName())).thenReturn(workingHours);
        when(mockCsvRecord.get(CapacityCsvColumn.NONWORKINGHOURS.getName())).thenReturn(nonWorkingHours);

        AvailabilityUploadException exception = assertThrows(AvailabilityUploadException.class,
                () -> this.cut.validateColumnsContent(mockCsvRecord));
        assertEquals(HttpStatus.BAD_REQUEST, exception.httpStatus());
    }

    @Test
    @DisplayName("validateColumnsContent: No Exception is raised if the record content is good")
    void validateColumnsContent8() {
        CSVRecord mockCsvRecord = mock(CSVRecord.class);
        String resourceId = "c22218a6-c594-4547-9853-ed2b14327bfc";
        String costcenter = "CC001";
        String startDate = "2020-01-01";
        String workingHours = "8";
        String nonWorkingHours = "4";
        when(mockCsvRecord.get(CapacityCsvColumn.RESOURCE_ID.getName())).thenReturn(resourceId);
        when(mockCsvRecord.get(CapacityCsvColumn.S4COSTCENTER_ID.getName())).thenReturn(costcenter);
        when(mockCsvRecord.get(CapacityCsvColumn.STARTDATE.getName())).thenReturn(startDate);
        when(mockCsvRecord.get(CapacityCsvColumn.PLANNEDWORKINGHOURS.getName())).thenReturn(workingHours);
        when(mockCsvRecord.get(CapacityCsvColumn.NONWORKINGHOURS.getName())).thenReturn(nonWorkingHours);

        assertDoesNotThrow(() -> this.cut.validateColumnsContent(mockCsvRecord));
    }

    @Test
    @DisplayName("validateWorkAssignment: Throws AvailabilityUploadException when csvDate is before work assignment start date.")
    void validateWorkAssignment1() {
        List<AvailabilityReplicationView> assignments = createTestEntities(1, i -> {
            final AvailabilityReplicationView mockAvailability = AvailabilityReplicationView.create();
            mockAvailability.setResourceId("bbaa29a2-f0bd-4d51-80c9-c74a7b37c65d");
            mockAvailability.setWorkAssignmentExternalId("WORKASSIGNMENT1");
            mockAvailability.setWorkForcePersonExternalId("EXTN1");
            mockAvailability.setWorkAssignmentStartDate("2020-01-10");
            mockAvailability.setWorkAssignmentEndDate("2020-01-31");
            return mockAvailability;
        });

        AvailabilityUploadException exception = assertThrows(AvailabilityUploadException.class,
                () -> this.cut.validateWorkAssignment(assignments.get(0), "2020-01-01"));
        assertEquals(HttpStatus.BAD_REQUEST, exception.httpStatus());
    }

    @Test
    @DisplayName("validateWorkAssignment: Throws AvailabilityUploadException when csvDate is after work assignment end date.")
    void validateWorkAssignment2() {
        List<AvailabilityReplicationView> assignments = createTestEntities(1, i -> {
            final AvailabilityReplicationView mockAvailability = AvailabilityReplicationView.create();
            mockAvailability.setResourceId("bbaa29a2-f0bd-4d51-80c9-c74a7b37c65d");
            mockAvailability.setWorkAssignmentExternalId("WORKASSIGNMENT1");
            mockAvailability.setWorkForcePersonExternalId("EXTN1");
            mockAvailability.setWorkAssignmentStartDate("2020-01-10");
            mockAvailability.setWorkAssignmentEndDate("2020-01-31");
            return mockAvailability;
        });

        AvailabilityUploadException exception = assertThrows(AvailabilityUploadException.class,
                () -> this.cut.validateWorkAssignment(assignments.get(0), "2020-02-01"));
        assertEquals(HttpStatus.BAD_REQUEST, exception.httpStatus());
    }

    @Test
    @DisplayName("validateWorkAssignment: No exception is raised when csvDate is in work assignment start date and end date.")
    void validateWorkAssignment3() {
        List<AvailabilityReplicationView> assignments = createTestEntities(1, i -> {
            final AvailabilityReplicationView mockAvailability = AvailabilityReplicationView.create();
            mockAvailability.setResourceId("bbaa29a2-f0bd-4d51-80c9-c74a7b37c65d");
            mockAvailability.setWorkAssignmentExternalId("WORKASSIGNMENT1");
            mockAvailability.setWorkForcePersonExternalId("EXTN1");
            mockAvailability.setWorkAssignmentStartDate("2020-01-10");
            mockAvailability.setWorkAssignmentEndDate("2020-01-31");
            return mockAvailability;
        });

        assertDoesNotThrow(() -> this.cut.validateWorkAssignment(assignments.get(0), "2020-01-11"));
    }

    @Test
    @DisplayName("validateWorkAssignment: No exception is raised when csvDate is same as work assignment start date.")
    void validateWorkAssignment4() {
        List<AvailabilityReplicationView> assignments = createTestEntities(1, i -> {
            final AvailabilityReplicationView mockAvailability = AvailabilityReplicationView.create();
            mockAvailability.setResourceId("bbaa29a2-f0bd-4d51-80c9-c74a7b37c65d");
            mockAvailability.setWorkAssignmentExternalId("WORKASSIGNMENT1");
            mockAvailability.setWorkForcePersonExternalId("EXTN1");
            mockAvailability.setWorkAssignmentStartDate("2020-01-10");
            mockAvailability.setWorkAssignmentEndDate("2020-01-31");
            return mockAvailability;
        });

        assertDoesNotThrow(() -> this.cut.validateWorkAssignment(assignments.get(0), "2020-01-10"));
    }

    @Test
    @DisplayName("validateWorkAssignment: No exception is raised when csvDate is same as work assignment end date.")
    void validateWorkAssignment5() {
        List<AvailabilityReplicationView> assignments = createTestEntities(1, i -> {
            final AvailabilityReplicationView mockAvailability = AvailabilityReplicationView.create();
            mockAvailability.setResourceId("bbaa29a2-f0bd-4d51-80c9-c74a7b37c65d");
            mockAvailability.setWorkAssignmentExternalId("WORKASSIGNMENT1");
            mockAvailability.setWorkForcePersonExternalId("EXTN1");
            mockAvailability.setWorkAssignmentStartDate("2020-01-10");
            mockAvailability.setWorkAssignmentEndDate("2020-01-31");
            return mockAvailability;
        });

        assertDoesNotThrow(() -> this.cut.validateWorkAssignment(assignments.get(0), "2020-01-31"));
    }

    @Test
    @DisplayName("validateCostCenter: Throws AvailabilityUploadException when costcenter are not equal.")
    void validateCostCenter1() {
        AvailabilityUploadException exception = assertThrows(AvailabilityUploadException.class,
                () -> this.cut.validateCostCenter("CC01", "CC02"));
        assertEquals(HttpStatus.BAD_REQUEST, exception.httpStatus());
    }

    @Test
    @DisplayName("validateCostCenter: No Exception raised with equal values")
    void validateCostCenter2() {

        assertDoesNotThrow(() -> this.cut.validateCostCenter("CC01", "CC01"));
    }

    @Test
    @DisplayName("validateDateFormat: Assertion false with invalid date yyyy-MM-dd format")
    void validateDateFormat() {
        assertFalse(this.cut.validateDateFormat("20\20-02"));
    }

    @Test
    @DisplayName("validateDateFormat: Assertion true with valid date yyyy-MM-dd format")
    void validateDateFormat2() {
        assertTrue(this.cut.validateDateFormat("2020-01-01"));
    }

    @Test
    @DisplayName("validateDateFormat: Assertion false is null")
    void validateDateFormat3() {
        assertFalse(this.cut.validateDateFormat(null));
    }

    @Test
    @DisplayName("isStartDateGreater: Assertion true with start date greater than end date")
    void isStartDateGreater() {
        assertTrue(this.cut.isStartDateGreater("2020-02-01", "2020-01-31"));
    }

    @Test
    @DisplayName("isStartDateGreater: Assertion false with start date greater than end date")
    void isStartDateGreater2() {
        assertFalse(this.cut.isStartDateGreater("2020-01-01", "2020-01-31"));
    }

    @Test
    @DisplayName("isNumeric: Assertion true with string being numeric")
    void isNumeric() {
        assertTrue(this.cut.isNumeric("1234"));
    }

    @Test
    @DisplayName("isNumeric: Assertion false with string not numeric")
    void isNumeric2() {
        assertFalse(this.cut.isNumeric("abx123"));
    }

    @Test
    @DisplayName("isNumeric: Assertion false with string null")
    void isNumeric3() {
        assertFalse(this.cut.isNumeric(null));
    }

    @Test
    @DisplayName("isNumeric: Assertion false with empty string")
    void isNumeric4() {
        assertFalse(this.cut.isNumeric(""));
    }

    public static <T> List<T> createTestEntities(int numberOfTestEntities,
            Function<Integer, T> entityCreationFunction) {
        List<T> entities = new ArrayList<>();
        for (int i = 0; i < numberOfTestEntities; i++) {
            entities.add(entityCreationFunction.apply(i));
        }
        return entities;
    }
}
