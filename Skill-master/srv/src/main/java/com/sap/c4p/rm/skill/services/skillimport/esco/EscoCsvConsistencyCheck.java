package com.sap.c4p.rm.skill.services.skillimport.esco;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.apache.commons.csv.CSVRecord;

import com.sap.cds.services.ServiceException;

/**
 * Consistency check for ESCO CSV files
 */
interface EscoCsvConsistencyCheck {
  /**
   * Checks consistency of a CSV header.
   *
   * Checks whether the following column headers are available:
   * <ol>
   * <li>{@code description}</li>
   * <li>{@code preferredLabel}</li>
   * <li>{@code conceptUri}</li>
   * <li>{@code conceptType}</li>
   * <li>{@code skillType}</li>
   * </ol>
   *
   * In case any of the two column headers is missing, a {@link ServiceException}
   * will be returned
   *
   * @param header {@link Set} of {@link String}s that represent the actual CSV
   *               header
   * @return {@link Optional} of {@link ServiceException} to signal parsing errors
   */
  Optional<ServiceException> checkHeader(final Set<String> header);

  /**
   * Check consistency of a CSV record.
   *
   * Checks whether the following columns are filled correctly:
   * <ol>
   * <li>{@code description}: anything</li>
   * <li>{@code preferredLabel}: anything</li>
   * <li>{@code conceptUri}: anything</li>
   * <li>{@code conceptType}: KnowledgeSkillCompetence</li>
   * <li>{@code skillType}: skill/competence</li>
   * </ol>
   *
   * In case any of these columns do not have a valid value, a parsing error is
   * added to the returned {@link List}
   *
   * @param csvRecord {@link CSVRecord} to check
   * @return {@link List} of {@link ServiceException}s to signal parsing errors
   */
  List<ServiceException> checkRecord(CSVRecord csvRecord);
}
