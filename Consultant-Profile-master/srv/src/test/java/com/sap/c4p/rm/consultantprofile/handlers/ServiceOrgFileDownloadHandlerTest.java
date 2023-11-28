package com.sap.c4p.rm.consultantprofile.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;
import java.util.StringJoiner;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.sap.c4p.rm.consultantprofile.csvcolumns.BsoCsvColumn;

public class ServiceOrgFileDownloadHandlerTest {

    private ServiceOrgFileDownloadHandler cut;

    /**
     * initialize object under test
     *
     * @throws IOException
     */
    @BeforeEach
    public void setUp() throws IOException {

        this.cut = new ServiceOrgFileDownloadHandler();
    }

    @Test
    public void handleFileDownloadSuccess() throws IOException {
        String expectedCsvHeader = createCsvLine(BsoCsvColumn.CODE.getName(), BsoCsvColumn.DESCRIPTION.getName(),
                BsoCsvColumn.IS_DELIVERY.getName(), BsoCsvColumn.COMPANY_CODE.getName(),
                BsoCsvColumn.COST_CENTER.getName());

        String[] result = this.cut.handleDownload().trim().split("\r\n", 2);
        String resultCsvHeader = result[0];

        assertEquals(1, result.length);
        assertEquals(expectedCsvHeader, resultCsvHeader);
    }

    private String createCsvLine(String... columns) {
        StringJoiner stringJoiner = new StringJoiner(",");
        for (String column : columns) {
            stringJoiner.add(column);
        }
        return stringJoiner.toString();
    }

}
