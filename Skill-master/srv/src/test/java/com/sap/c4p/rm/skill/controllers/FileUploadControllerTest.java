package com.sap.c4p.rm.skill.controllers;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import java.io.IOException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.multipart.MultipartFile;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.skill.services.skillimport.CsvSkillImporter;
import com.sap.c4p.rm.skill.services.validators.SingleSkillSourceValidator;
import com.sap.c4p.rm.skill.utils.SkillTestHelper;

class FileUploadControllerTest {

  /** object under test */
  private FileUploadController cut;

  /** mock handler */
  private CsvSkillImporter mockCsvSkillImporter;

  private SingleSkillSourceValidator mockSingleSkillSourceValidator;

  @BeforeEach
  void setUp() throws IOException {
    this.mockCsvSkillImporter = mock(CsvSkillImporter.class);
    this.mockSingleSkillSourceValidator = mock(SingleSkillSourceValidator.class);
    this.cut = new FileUploadController(this.mockCsvSkillImporter, this.mockSingleSkillSourceValidator);
  }

  @Test
  @DisplayName("check if handleFileUpload() delegates to service successfully in case provided array of MultipartFiles has correct size")
  void handleFileUploadSuccess() throws IOException {
    final MultipartFile mockFile = mock(MultipartFile.class);
    final MultipartFile[] files = new MultipartFile[] { mockFile };
    when(this.mockSingleSkillSourceValidator.checkIfRMSkillsCreationAllowed()).thenReturn(Boolean.TRUE);
    this.cut.handleFileUploadService(files, SkillTestHelper.LANGUAGE_CODE_EN);

    verify(this.mockCsvSkillImporter, times(1)).triggerAsyncImport(mockFile, SkillTestHelper.LANGUAGE_CODE_EN);

  }

  @Test
  @DisplayName("File upload exception when MDI is activated")
  void fileUploadExcWhenMDIIsActivated() throws IOException {
    final MultipartFile mockFile = mock(MultipartFile.class);
    final MultipartFile[] files = new MultipartFile[] { mockFile };
    when(this.mockSingleSkillSourceValidator.checkIfRMSkillsCreationAllowed()).thenReturn(Boolean.FALSE);

    assertThrows(ServiceException.class, () -> {
      this.cut.handleFileUploadService(files, SkillTestHelper.LANGUAGE_CODE_EN);
    }, "handleFileUpload() did not throw ServiceException although too many files have been provided");

  }

  @Test
  @DisplayName("check if handleFileUpload() throws ServiceException in case > 1 files are provided")
  void handleFileUploadTooManyFiles() throws IOException {
    final MultipartFile mockFile = mock(MultipartFile.class);
    final MultipartFile[] files = new MultipartFile[] { mockFile, mockFile };
    when(this.mockSingleSkillSourceValidator.checkIfRMSkillsCreationAllowed()).thenReturn(Boolean.TRUE);
    assertThrows(ServiceException.class, () -> {
      this.cut.handleFileUploadService(files, SkillTestHelper.LANGUAGE_CODE_EN);
    }, "handleFileUpload() did not throw ServiceException although too many files have been provided");
  }

  @Test
  @DisplayName("check if handleFileUpload() throws ServiceException in case an empty array of MultipartFiles is provided")
  void handleFileUploadNoFiles() throws IOException {
    final MultipartFile[] files = new MultipartFile[0];
    when(this.mockSingleSkillSourceValidator.checkIfRMSkillsCreationAllowed()).thenReturn(Boolean.TRUE);
    assertThrows(ServiceException.class, () -> {
      this.cut.handleFileUploadService(files, SkillTestHelper.LANGUAGE_CODE_EN);
    }, "handleFileUpload() did not throw ServiceException although no files have been provided");
  }
}
