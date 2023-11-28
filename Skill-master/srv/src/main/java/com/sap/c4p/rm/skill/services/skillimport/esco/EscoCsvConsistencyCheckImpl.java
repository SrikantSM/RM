package com.sap.c4p.rm.skill.services.skillimport.esco;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.skill.esco.EscoCsvColumn;
import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.repositories.ProficiencySetRepository;
import com.sap.c4p.rm.skill.utils.HttpStatus;
import com.sap.c4p.rm.skill.utils.LifecycleStatusCode;

@Service
class EscoCsvConsistencyCheckImpl implements EscoCsvConsistencyCheck {

  private final ProficiencySetRepository proficiencySetRepository;

  @Autowired
  public EscoCsvConsistencyCheckImpl(final ProficiencySetRepository proficiencySetRepository) {
    this.proficiencySetRepository = proficiencySetRepository;
  }

  @Override
  public Optional<ServiceException> checkHeader(final Set<String> header) {
    final List<String> mandatoryHeaders = Arrays.asList(EscoCsvColumn.DESCRIPTION.getName(),
        EscoCsvColumn.PREFERRED_LABEL.getName(), EscoCsvColumn.EXTERNAL_ID.getName(),
        EscoCsvColumn.CONCEPT_TYPE.getName(), EscoCsvColumn.SKILL_TYPE.getName());

    final Set<String> missingHeaders = mandatoryHeaders.stream().filter(e -> !header.contains(e))
        .collect(Collectors.toSet());

    if (!missingHeaders.isEmpty()) {
      return Optional.of(new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.CSV_COLUMNS_MISSING,
          String.join(", ", missingHeaders)));
    }
    return Optional.empty();
  }

  @Override
  public List<ServiceException> checkRecord(final CSVRecord csvRecord) {
    final List<ServiceException> parsingExceptions = new LinkedList<>();

    if (!csvRecord.isConsistent()) {
      parsingExceptions.add(new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.CSV_PARSER_INCONSISTENT_RECORD));
    }

    if (this.isColumnValueEmpty(csvRecord, EscoCsvColumn.DESCRIPTION.getName())) {
      parsingExceptions.add(new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.CSV_PARSER_EMPTY_DESCRIPTION));
    }

    if (this.isColumnValueEmpty(csvRecord, EscoCsvColumn.PREFERRED_LABEL.getName())) {
      parsingExceptions.add(new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.CSV_PARSER_EMPTY_PREFERRED_LABEL));
    }

    if (this.isColumnValueEmpty(csvRecord, EscoCsvColumn.EXTERNAL_ID.getName())) {
      parsingExceptions.add(new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.CSV_PARSER_EMPTY_CONCEPT_URI));
    }

    if (this.isColumnValueNotEqualsTo("KnowledgeSkillCompetence", csvRecord, EscoCsvColumn.CONCEPT_TYPE.getName())) {
      parsingExceptions.add(new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.CSV_PARSER_INVALID_CONCEPT_TYPE));
    }

    if (this.isColumnValueNotEqualsTo("skill/competence", csvRecord, EscoCsvColumn.SKILL_TYPE.getName())) {
      parsingExceptions.add(new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.CSV_PARSER_INVALID_SKILL_TYPE));
    }

    Optional<String> usage = this.getOptionalColumnValue(csvRecord, EscoCsvColumn.USAGE.getName());

    usage.ifPresent(u -> {
      if (!u.isEmpty() && !LifecycleStatusCode.RESTRICTED.getDescription().equals(u)
          && !LifecycleStatusCode.UNRESTRICTED.getDescription().equals(u)) {
        parsingExceptions.add(new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.CSV_PARSER_INVALID_USAGE_VALUE));
      }
    });

    Optional<String> proficiencySetName = this.getOptionalColumnValue(csvRecord,
        EscoCsvColumn.PROFICIENCY_SET.getName());

    proficiencySetName.ifPresent(n -> {
      if (n.isEmpty()) {
        parsingExceptions
            .add(new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.CSV_PARSER_EMPTY_PROFICIENCY_SET));
      } else if (!this.proficiencySetRepository.findByName(n, true).isPresent()) {
        parsingExceptions
            .add(new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.CSV_PARSER_PROFICIENCY_SET_NOT_EXISTS, n));
      }
    });

    return parsingExceptions;
  }

  private boolean isColumnValueEmpty(CSVRecord csvRecord, String columnName) {
    return !csvRecord.isSet(columnName) || csvRecord.get(columnName).isEmpty();
  }

  private boolean isColumnValueNotEqualsTo(String expectedValue, CSVRecord csvRecord, String columnName) {
    return !csvRecord.isSet(columnName) || !expectedValue.equals(csvRecord.get(columnName));
  }

  private Optional<String> getOptionalColumnValue(CSVRecord csvRecord, String columnName) {
    return csvRecord.isSet(columnName) ? Optional.of(csvRecord.get(columnName)) : Optional.empty();
  }
}
