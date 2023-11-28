package com.sap.c4p.rm.consultantprofile.handlers;

import java.io.IOException;
import java.io.StringWriter;

import org.apache.commons.csv.CSVFormat;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.consultantprofile.csvcolumns.BsoCsvColumn;

/**
 * This class handles download CSV template from Service Org App
 */
@Component
public class ServiceOrgFileDownloadHandler {

    public String handleDownload() throws IOException {

        StringWriter out = new StringWriter();

        CSVFormat.DEFAULT.withHeader(BsoCsvColumn.CODE.getName(), BsoCsvColumn.DESCRIPTION.getName(),
                BsoCsvColumn.IS_DELIVERY.getName(), BsoCsvColumn.COMPANY_CODE.getName(),
                BsoCsvColumn.COST_CENTER.getName()).print(out);

        String csvFileContent = out.toString();
        out.close();

        return csvFileContent;
    }
}
