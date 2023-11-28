package com.sap.c4p.rm.consultantprofile.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.StringJoiner;
import java.util.function.Function;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;

import com.sap.cds.Result;

import com.sap.c4p.rm.consultantprofile.availabilityservice.dao.IAvailabilityDAO;
import com.sap.c4p.rm.consultantprofile.csvcolumns.CapacityCsvColumn;

import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityDownloadView;

public class AvailabilityFileDownloadHandlerTest {

    private AvailabilityFileDownloadHandler cut;
    private List<AvailabilityDownloadView> testSummary = new ArrayList<>();
    private Result mockResult;
    public static final String CSV_LINE_SEPARATOR = "\r\n";

    public static final String RESOURCE_ID = "07822776-8132-4212-b402-ee51dc38a97c";
    public static final String WORKFORCEPERSON_ID = "";
    public static final String FIRSTNAME = "";
    public static final String LASTNAME = "";
    public static final String S4COSTCENTER_ID = "101";
    public static final String WORKASSIGNMENTEXTERNAL_ID = "HR01";
    public static final String STARTDATE = "2020-01-01";
    public static final String ENDDATE = "2020-01-01";
    public static final int PLANNEDWORKINGHOURS = 8;
    public static final int NONWORKINGHOURS = 0;

    @Mock
    private IAvailabilityDAO availabilityDao;

    /**
     * initialize object under test
     *
     * @throws IOException
     */
    @BeforeEach
    public void setUp() throws IOException {
        initializeAvailabilitySummary();
        prepareMockObjects();
    }

    @Test
    public void handleFileDownloadSuccess() throws IOException {
        String expectedCsvHeader = createCsvLine(CapacityCsvColumn.RESOURCE_ID.getName(),
                CapacityCsvColumn.WORKFORCEPERSON_ID.getName(), CapacityCsvColumn.FIRSTNAME.getName(),
                CapacityCsvColumn.LASTNAME.getName(), CapacityCsvColumn.S4COSTCENTER_ID.getName(),
                CapacityCsvColumn.WORKASSIGNMENTEXTERNAL_ID.getName(), CapacityCsvColumn.STARTDATE.getName(),
                CapacityCsvColumn.PLANNEDWORKINGHOURS.getName(), CapacityCsvColumn.NONWORKINGHOURS.getName());

        String expectedCsvContent = createCsvLine(RESOURCE_ID, WORKFORCEPERSON_ID, FIRSTNAME, LASTNAME, S4COSTCENTER_ID,
                WORKASSIGNMENTEXTERNAL_ID, STARTDATE) + "," + PLANNEDWORKINGHOURS + "," + NONWORKINGHOURS;

        System.out.println("expectedCsvContent " + expectedCsvContent);

        String[] result = this.cut.handleDownload(STARTDATE, ENDDATE, S4COSTCENTER_ID, WORKFORCEPERSON_ID,
                PLANNEDWORKINGHOURS, NONWORKINGHOURS).split(CSV_LINE_SEPARATOR, 2);
        String resultCsvHeader = result[0];

        assertEquals(2, result.length);
        assertEquals(expectedCsvHeader, resultCsvHeader);
    }

    private void initializeAvailabilitySummary() {
        testSummary = createTestEntities(1, i -> {
            AvailabilityDownloadView newSummary = AvailabilityDownloadView.create();
            newSummary.setResourceId("07822776-8132-4212-b402-ee51dc38a97c");
            newSummary.setWorkAssignmentEndDate(ENDDATE);
            newSummary.setWorkAssignmentStartDate(STARTDATE);
            newSummary.setWorkAssignmentExternalId(WORKASSIGNMENTEXTERNAL_ID);
            newSummary.setWorkForcePersonExternalId("");
            newSummary.setIsBusinessPurposeCompleted(false);
            return newSummary;
        });
    }

    private void prepareMockObjects() {
        mockResult = mock(Result.class);
        IAvailabilityDAO availabilityDao = Mockito.mock(IAvailabilityDAO.class);
        when(availabilityDao.fetchAvailabilitySummaryDownload(S4COSTCENTER_ID)).thenReturn(testSummary);
        when(availabilityDao.fetchWorkAssignmentsForEmployeeDownload(WORKFORCEPERSON_ID)).thenReturn(testSummary);
        this.cut = new AvailabilityFileDownloadHandler(availabilityDao);
    }

    public static <T> List<T> createTestEntities(int numberOfTestEntities,
            Function<Integer, T> entityCreationFunction) {
        List<T> entities = new ArrayList<>();
        for (int i = 0; i < numberOfTestEntities; i++) {
            entities.add(entityCreationFunction.apply(i));
        }
        return entities;
    }

    private String createCsvLine(String... columns) {
        StringJoiner stringJoiner = new StringJoiner(",");
        for (String column : columns) {
            stringJoiner.add(column);
        }
        return stringJoiner.toString();
    }

}
