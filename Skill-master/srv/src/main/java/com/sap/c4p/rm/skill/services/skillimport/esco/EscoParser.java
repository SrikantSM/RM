package com.sap.c4p.rm.skill.services.skillimport.esco;

import org.apache.commons.csv.CSVRecord;

import skillservice.AlternativeLabels;
import skillservice.Skills;

/**
 * Parser to create {@link Skills}, {@link Skills_texts}, and
 * {@link AlternativeLabels} from ESCO CSV records
 */
interface EscoParser {

  /**
   * Parses and returns a {@link EscoParserResult} representing the parsed skill
   * and its associated catalogs
   *
   * @param csvRecord    {@link CSVRecord} that was already validated
   * @param languageCode
   * @return {@link EscoParserResult}
   */
  EscoParserResult parseSkill(final CSVRecord csvRecord, final String languageCode);
}
