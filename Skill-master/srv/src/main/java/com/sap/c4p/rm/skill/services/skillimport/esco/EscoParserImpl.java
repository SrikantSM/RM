package com.sap.c4p.rm.skill.services.skillimport.esco;

import java.util.ArrayList;
import java.util.Arrays;

import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sap.c4p.rm.skill.esco.EscoCsvColumn;
import com.sap.c4p.rm.skill.repositories.ProficiencySetRepository;
import com.sap.c4p.rm.skill.utils.LifecycleStatusCode;

import skillservice.AlternativeLabels;
import skillservice.Skills;
import skillservice.SkillsTexts;

@Service
class EscoParserImpl implements EscoParser {
  private ProficiencySetRepository proficiencySetRepository;

  public static final String UNRESTRICTED = "unrestricted";
  public static final String RESTRICTED = "restricted";
  public static final String NEW_LINE_REGEX = "\\r?\\n";

  @Autowired
  public EscoParserImpl(final ProficiencySetRepository proficiencySetRepository) {
    this.proficiencySetRepository = proficiencySetRepository;
  }

  @Override
  public EscoParserResult parseSkill(final CSVRecord csvRecord, final String languageCode) {
    final String description = csvRecord.get(EscoCsvColumn.DESCRIPTION.getName());
    final String skillTextName = csvRecord.get(EscoCsvColumn.PREFERRED_LABEL.getName());
    final String[] alternativeLabelNames = csvRecord.get(EscoCsvColumn.ALTERNATIVE_LABELS.getName())
        .split(EscoParserImpl.NEW_LINE_REGEX);
    final String[] catalogNames = csvRecord.isSet(EscoCsvColumn.CATALOGS.getName())
        ? csvRecord.get(EscoCsvColumn.CATALOGS.getName()).split(EscoParserImpl.NEW_LINE_REGEX)
        : null;
    final String externalID = csvRecord.get(EscoCsvColumn.EXTERNAL_ID.getName());
    final Skills skill = this.createSkill(externalID);

    skill.getTexts().add(this.createSkillsTexts(skillTextName, description, languageCode));
    this.setLifecycleStatusCode(csvRecord, skill);
    final String proficiencySetName = csvRecord.isSet(EscoCsvColumn.PROFICIENCY_SET.getName())
        ? csvRecord.get(EscoCsvColumn.PROFICIENCY_SET.getName())
        : null;
    Arrays.stream(alternativeLabelNames).map(String::trim).filter(label -> !label.isEmpty())
        .map(label -> this.createAlternativeLabel(label, languageCode))
        .forEach(label -> skill.getAlternativeLabels().add(label));
    this.proficiencySetRepository.findByName(proficiencySetName, true)
        .ifPresent(e -> skill.setProficiencySetId(e.getId()));

    String[] trimmedCatalogNames = catalogNames != null
        ? Arrays.stream(catalogNames).map(String::trim).filter(name -> !name.isEmpty()).toArray(String[]::new)
        : null;

    return new EscoParserResult(externalID, skill, trimmedCatalogNames);
  }

  /**
   * Creates a {@link Skills} from the given properties
   *
   * @param externalID
   * @return {@link Skills}
   */
  private Skills createSkill(final String externalID) {
    final Skills skill = Skills.create();
    skill.setTexts(new ArrayList<>());
    skill.setAlternativeLabels(new ArrayList<>());
    skill.setExternalID(externalID);
    return skill;
  }

  /**
   * Creates a new {@link SkillsTexts} from the given properties
   *
   * @param name
   * @param skillDescription
   * @param locale
   * @return {@link SkillsTexts}
   */
  private SkillsTexts createSkillsTexts(final String name, final String skillDescription, final String locale) {
    final SkillsTexts text = SkillsTexts.create();
    text.setName(name);
    text.setDescription(skillDescription);
    text.setLocale(locale);
    return text;
  }

  /**
   * Creates a new {@link AlternativeLabels} from the given properties
   *
   * @param name
   * @param languageCode
   * @return {@link AlternativeLabels}
   */
  private AlternativeLabels createAlternativeLabel(final String name, final String languageCode) {
    final AlternativeLabels label = AlternativeLabels.create();
    label.setName(name);
    label.setLanguageCode(languageCode);
    return label;
  }

  /**
   * Reads the lifecycle status code from a {@link CSVRecord} and stores it in a
   * given {@link Skills}
   *
   * @param csvRecord {@link CSVRecord} to read the lifecycle status from
   * @param skill     {@link Skills} to store the lifecycle status into
   */
  private void setLifecycleStatusCode(final CSVRecord csvRecord, final Skills skill) {
    skill.setLifecycleStatusCode(LifecycleStatusCode.UNRESTRICTED.getCode());

    if (csvRecord.isSet(EscoCsvColumn.USAGE.getName())) {
      String status = csvRecord.get(EscoCsvColumn.USAGE.getName());

      if (status.equalsIgnoreCase(EscoParserImpl.RESTRICTED)) {
        skill.setLifecycleStatusCode(LifecycleStatusCode.RESTRICTED.getCode());
      }
    }
  }
}
