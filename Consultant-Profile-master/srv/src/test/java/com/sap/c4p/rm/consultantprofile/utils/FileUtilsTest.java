package com.sap.c4p.rm.consultantprofile.utils;

import org.apache.commons.io.output.ByteArrayOutputStream;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

public class FileUtilsTest {

    @DisplayName("Verify compression goes through for an input file")
    @Test
    void compressUsingGZipTest() throws IOException {
        Path testFilePath = Paths.get("src/test/resources/test-attachments/test-resume.pdf");
        byte[] inputArray = Files.readAllBytes(testFilePath);
        ByteArrayOutputStream inputFile = new ByteArrayOutputStream();
        inputFile.write(inputArray);
        ByteArrayOutputStream compressedOutput = FileUtils.compressUsingGzip(inputFile);
        assertNotNull(compressedOutput);
    }

    @DisplayName("Verify decompression goes through for an input file")
    @Test
    void decompressUsingGZipTest() throws IOException {
        Path testFilePath = Paths.get("src/test/resources/test-attachments/compressed-sdd.gz");
        byte[] inputArray = Files.readAllBytes(testFilePath);
        ByteArrayOutputStream inputFile = new ByteArrayOutputStream();
        inputFile.write(inputArray);
        ByteArrayOutputStream decompressedOutput = FileUtils.decompressUsingGzip(inputFile.toInputStream());
        assertNotNull(decompressedOutput);
    }

    @DisplayName("Verify decompression throws error for file")
    @Test
    void decompressUsingGZipExceptionTest() throws IOException {
        Path testFilePath = Paths.get("src/test/resources/test-attachments/test-resume.pdf");
        byte[] inputArray = Files.readAllBytes(testFilePath);
        ByteArrayOutputStream inputFile = new ByteArrayOutputStream();
        inputFile.write(inputArray);
        ByteArrayOutputStream decompressedOutput = FileUtils.decompressUsingGzip(inputFile.toInputStream());
        assertNull(decompressedOutput);
    }

}
