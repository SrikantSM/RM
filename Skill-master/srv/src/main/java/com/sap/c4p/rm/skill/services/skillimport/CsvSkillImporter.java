package com.sap.c4p.rm.skill.services.skillimport;

import java.io.IOException;

import org.springframework.core.io.InputStreamSource;
import org.springframework.web.multipart.MultipartFile;

import skillservice.Skills;

public interface CsvSkillImporter {

  /**
   * Triggers the reading of the given {@link InputStreamSource} as a CSV file.
   * After checking it's consistency, the {@link Skills} contained in the data
   * will be extracted and stored in the database. If the storing is unsuccessful,
   * the respective skill is stored as a draft
   *
   *
   * @param file     {@link MultipartFile} to be imported
   * @param language {@link String} representing the language of the given data
   * @throws IOException
   */
  void triggerAsyncImport(final MultipartFile file, final String language) throws IOException;
}
