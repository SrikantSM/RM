package com.sap.c4p.rm.skill.controllers;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.services.skillimport.CsvSkillImporter;
import com.sap.c4p.rm.skill.services.validators.SingleSkillSourceValidator;
import com.sap.c4p.rm.skill.utils.HttpStatus;

import skillservice.Skills;

/**
 * Controller to define an HTTP endpoint for the file upload
 */
@Controller
@RequestMapping("/api/internal/upload")
public class FileUploadController {

  private final CsvSkillImporter csvSkillImporter;

  private final SingleSkillSourceValidator singleSkillSourceValidator;

  @Autowired
  public FileUploadController(final CsvSkillImporter csvSkillImporter,
      final SingleSkillSourceValidator singleSkillSourceValidator) {
    this.csvSkillImporter = csvSkillImporter;
    this.singleSkillSourceValidator = singleSkillSourceValidator;
  }

  /**
   * Defines an HTTP endpoint to upload {@link Skills} via exactly one CSV file
   *
   * @param files
   * @param language
   * @return {@link ResponseEntity}
   * @throws IOException
   */
  @PostMapping(path = "/skills/csv", produces = MediaType.APPLICATION_JSON_VALUE)
  @ResponseBody
  @Secured("Skills.Upload")
  public ResponseEntity<String> handleFileUploadService(final @RequestParam("file") MultipartFile[] files,
      final @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language) throws IOException {

    if (singleSkillSourceValidator.checkIfRMSkillsCreationAllowed().equals(Boolean.FALSE)) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.CREATION_VIA_RMAPPS_RESTRICTED);
    }

    if (files.length > 1) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.MULTIPLE_FILES_ARE_NOT_SUPPORTED);
    } else if (files.length == 0) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.NO_FILE_SPECIFIED);
    } else {
      this.csvSkillImporter.triggerAsyncImport(files[0], language);
    }

    return ResponseEntity.ok().build();
  }
}
