package com.sap.c4p.rm.skill.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import com.sap.c4p.rm.skill.services.SkillFileDownloadService;
import com.sap.c4p.rm.skill.services.validators.LanguageCodeValidator;

import skillservice.Skills;

/**
 * Controller to define an HTTP endpoint for the file download
 */
@Controller
@RequestMapping("/api/internal/download")
public class FileDownloadController {

  private final SkillFileDownloadService skillFileDownloadService;
  private final LanguageCodeValidator languageCodeValidator;

  @Autowired
  public FileDownloadController(final SkillFileDownloadService skillFileDownloadService,
      final LanguageCodeValidator languageCodeValidator) {
    this.skillFileDownloadService = skillFileDownloadService;
    this.languageCodeValidator = languageCodeValidator;
  }

  /**
   * Defines an HTTP endpoint to download {@link Skills} as a CSV file
   *
   * @param language The language of skills to be downloaded
   */
  @GetMapping(path = "/skills/csv")
  @ResponseBody
  @Secured("Skills.Download")
  public ResponseEntity<StreamingResponseBody> handleFileDownloadService(
      final @RequestParam(value = "language", required = false) String downloadLanguage) {
    this.languageCodeValidator.validate(downloadLanguage);
    return this.skillFileDownloadService.handleDownload(downloadLanguage);
  }
}
