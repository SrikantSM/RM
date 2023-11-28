package com.sap.c4p.rm.skill.services.validators;

import static java.lang.Boolean.FALSE;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.repositories.CatalogRepository;
import com.sap.c4p.rm.skill.repositories.DefaultLanguageRepository;
import com.sap.c4p.rm.skill.repositories.LanguageRepository;
import com.sap.c4p.rm.skill.repositories.ProficiencySetRepository;
import com.sap.c4p.rm.skill.repositories.SkillRepository;
import com.sap.c4p.rm.skill.utils.HttpStatus;
import com.sap.c4p.rm.skill.utils.ValuePath;

import com.sap.resourcemanagement.config.DefaultLanguages;

import catalogservice.Catalogs;
import skillservice.AlternativeLabels;
import skillservice.AlternativeLabels_;
import skillservice.Skills;
import skillservice.SkillsTexts;
import skillservice.SkillsTexts_;
import skillservice.Skills_;

@Service
public class SkillValidator extends InjectionValidator<Skills, Skills_> {
  private static final Logger LOGGER = LoggerFactory.getLogger(SkillValidator.class);
  private static final Marker MARKER = LoggingMarker.VALIDATION.getMarker();
  private final SkillRepository skillRepository;
  private final LanguageRepository languageRepository;
  private final DefaultLanguageRepository defaultLanguageRepository;
  private final ProficiencySetRepository proficiencySetRepository;
  private final CatalogRepository catalogRepository;
  private final Messages messages;

  @Autowired
  public SkillValidator(final SkillRepository skillRepository, final LanguageRepository languageRepository,
      final DefaultLanguageRepository defaultLanguageRepository,
      final ProficiencySetRepository proficiencySetRepository, final Messages messages,
      final CatalogRepository catalogRepository) {
    super(messages, Skills_.class);
    this.skillRepository = skillRepository;
    this.languageRepository = languageRepository;
    this.defaultLanguageRepository = defaultLanguageRepository;
    this.proficiencySetRepository = proficiencySetRepository;
    this.messages = messages;
    this.catalogRepository = catalogRepository;
  }

  public void validate(final Skills skill) {
    // API validations (no field at UI, thus throwing)
    this.validateExternalIDUniqueness(skill);
    this.validateProficiencySetExistence(skill);
    // Other validations (messaging, non-throwing)
    this.validateForInjection(skill);
    this.validateLabelLanguageExistence(skill);
    this.validateSkillTextDefaultLanguage(skill);
    this.validateSkillTextCount(skill);

    this.messages.throwIfError();
  }

  public void validateExternalIDUniqueness(final Skills skill) {
    if (skill.getExternalID() == null || skill.getExternalID().isEmpty()) {
      return;
    }

    final long count = this.skillRepository.countOtherActiveEntitiesWithSameExternalId(skill);

    if (count > 0) {
      // Should be shown in Dialog, hence throw without target
      LOGGER.info(MARKER, "skill with external id {} already exists", skill.getExternalID());
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.SKILL_EXISTS);
    }
  }

  public void validateLabelLanguageExistence(final Skills skill) {
    final Set<String> missingLanguages = this.findNotExistingLanguages(skill);

    if (missingLanguages.isEmpty()) {
      return;
    }

    final List<AlternativeLabels> alternativeLabels = skill.getAlternativeLabels();
    final List<SkillsTexts> texts = skill.getTexts();

    if (alternativeLabels != null) {
      alternativeLabels.forEach(alternativeLabel -> {
        if (missingLanguages.contains(alternativeLabel.getLanguageCode())) {
          this.messages.error(MessageKeys.LANGUAGE_MUST_EXIST).target("in", Skills_.class,
              s -> this.getLabelsPath(s, alternativeLabel).language_code());
          LOGGER.info(MARKER, "skill {}/{} contains alternative label with non-existing language {}", skill.getId(),
              skill.getName(), alternativeLabel.getLanguageCode());
        }
      });
    }

    if (texts != null) {
      texts.forEach(text -> {
        if (missingLanguages.contains(text.getLocale())) {
          this.messages.error(MessageKeys.LANGUAGE_MUST_EXIST).target("in", Skills_.class,
              s -> this.getTextsPath(s, text).locale());
          LOGGER.info(MARKER, "skill {}/{} contains text with non-existing language {}", skill.getId(), skill.getName(),
              text.getLocale());
        }
      });
    }
  }

  private Set<String> findNotExistingLanguages(final Skills skill) {
    final List<AlternativeLabels> alternativeLabels = skill.getAlternativeLabels();
    final List<SkillsTexts> texts = skill.getTexts();

    final Set<String> uniqueLanguageCodes = new HashSet<>();

    if (alternativeLabels != null && !alternativeLabels.isEmpty()) {
      alternativeLabels.stream().map(AlternativeLabels::getLanguageCode).map(s -> s == null ? "" : s)
          .forEach(uniqueLanguageCodes::add);
    }

    if (texts != null && !texts.isEmpty()) {
      texts.stream().map(SkillsTexts::getLocale).map(s -> s == null ? "" : s).forEach(uniqueLanguageCodes::add);
    }

    final Set<String> existingLanguageSet = this.languageRepository
        .findExistingActiveLanguageCodes(uniqueLanguageCodes.toArray(new String[0]));

    uniqueLanguageCodes.removeAll(existingLanguageSet);
    return uniqueLanguageCodes;
  }

  public void validateSkillTextDefaultLanguage(final Skills skill) {
    if (skill.getTexts() == null) {
      return;
    }

    final Optional<DefaultLanguages> defaultLanguage = this.defaultLanguageRepository.findActiveEntityByRank(0);

    if (!defaultLanguage.isPresent()) {
      LOGGER.info(MARKER, "no default language available");
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.NO_DEFAULT_LANGUAGE);
    } else {
      final Optional<SkillsTexts> defaultText = skill.getTexts().stream()
          .filter(s -> defaultLanguage.get().getLanguageCode().equals(s.getLocale())).findFirst();

      // Validate that there is a text for the default language
      if (!defaultText.isPresent()) {
        this.messages.error(MessageKeys.SKILL_NO_DEFAULT_LANGUAGE_TEXT, defaultLanguage.get().getLanguageCode())
            .target("in", Skills_.class, Skills_::ID);
        LOGGER.info(MARKER, "skill {}/{} does not have a text for the default language {}", skill.getId(),
            skill.getName(), defaultLanguage.get().getLanguageCode());
      }
    }
  }

  /**
   * Returns true if the catalog id is valid for a catalogs2skill assignment,
   * false otherwise.
   */
  public boolean isValidForCatalog2SkillAssignment(final String catalogId) {
    final Optional<Catalogs> catalog = this.catalogRepository.findCatalogByIdWithNameAndHasDraftEntity(catalogId);

    if (!catalog.isPresent()) {
      this.messages.error(MessageKeys.CATALOG2SKILL_ASSIGNMENT_FAILED);
      LOGGER.info(MARKER, "catalog {} cannot be assigned to skill", catalogId);
      return false;
    } else if (Boolean.TRUE.equals(catalog.get().getHasDraftEntity())) {
      this.messages.warn(MessageKeys.CATALOG2SKILL_ASSIGNMENT_WITH_DRAFT_CATALOG, catalog.get().getName());
      return false;
    }

    return true;
  }

  public void validateSkillTextCount(final Skills skill) {
    if (skill.getTexts() == null) {
      return;
    }

    // we shouldn't collect to set but rather add texts and then labels
    // individually, validating issues
    final Set<String> locales = new HashSet<>();

    skill.getTexts().forEach(text -> {
      if (text.getLocale() != null && !text.getLocale().isEmpty() && !locales.add(text.getLocale())) {
        // locale already present, add error DUPLICATED_NAME_OR_DESCRIPTION on locale
        this.messages.error(MessageKeys.DUPLICATE_SKILL_TEXT_LOCALE).target("in", Skills_.class,
            s -> this.getTextsPath(s, text).locale());
        LOGGER.info(MARKER, "skill {}/{} contains multiple texts for the same language", skill.getId(),
            skill.getName());
      }
    });

    skill.getAlternativeLabels().forEach(label -> {
      if (label.getLanguageCode() != null && !label.getLanguageCode().isEmpty()
          && !locales.contains(label.getLanguageCode())) {
        // locale not present, add error NON_EXISTING_NAME on language_code
        this.messages.error(MessageKeys.NON_EXISTING_SKILL_NAME).target("in", Skills_.class,
            s -> this.getLabelsPath(s, label).language_code());
        LOGGER.info(MARKER, "skill {}/{} contains alternative label with non-existing language", skill.getId(),
            skill.getName());
      }
    });
  }

  public void validateProficiencySetExistence(final Skills skill) {
    final String proficiencySetId = skill.getProficiencySetId();

    if (!skill.containsKey(Skills.PROFICIENCY_SET_ID)) {
      return; // skip validation on deep update without proficiency set change
    }

    if (proficiencySetId == null || proficiencySetId.isEmpty()) {
      this.messages.error(MessageKeys.SKILL_PROFICIENCY_SET_EMPTY).target("in", Skills_.class,
          Skills_::proficiencySet_ID);
      LOGGER.info(MARKER, "skill {}/{} does not have a proficiency set", skill.getId(), skill.getName());
    } else if (!this.proficiencySetRepository.findActiveEntityById(proficiencySetId).isPresent()) {
      this.messages.error(MessageKeys.SKILL_PROFICIENCY_SET_NOT_VALID).target("in", Skills_.class,
          Skills_::proficiencySet_ID);
      LOGGER.info(MARKER, "skill {}/{} is assigned to non-existing proficiency set id <{}>", skill.getId(),
          skill.getName(), proficiencySetId);
    }
  }

  @Override
  List<ValuePath<String, Skills_>> extractValuesForHtmlInjection(final Skills skill) {
    return this.extractValuesForInjection(skill);
  }

  @Override
  List<ValuePath<String, Skills_>> extractValuesForCsvInjection(final Skills skill) {
    return this.extractValuesForInjection(skill);
  }

  @Override
  String getMessageKeyForHtmlInjection() {
    return MessageKeys.SKILL_CONTAINS_HTML_TAG;
  }

  @Override
  String getMessageKeyForCsvInjection() {
    return MessageKeys.FORBIDDEN_FIRST_CHARACTER_SKILL;
  }

  private List<ValuePath<String, Skills_>> extractValuesForInjection(final Skills skill) {
    final List<SkillsTexts> texts = Optional.ofNullable(skill.getTexts()).orElseGet(Collections::emptyList);

    final List<AlternativeLabels> labels = Optional.ofNullable(skill.getAlternativeLabels())
        .orElseGet(Collections::emptyList);

    final Stream<ValuePath<String, Skills_>> fields = Stream
        .of(new ValuePath<>(skill.getExternalID(), Skills_::externalID));

    final Stream<ValuePath<String, Skills_>> textFields = texts.stream()
        .flatMap(text -> Stream.of(new ValuePath<>(text.getName(), s -> this.getTextsPath(s, text).name()),
            new ValuePath<>(text.getDescription(), s -> this.getTextsPath(s, text).description())));

    final Stream<ValuePath<String, Skills_>> labelFields = labels.stream()
        .map(label -> new ValuePath<>(label.getName(), s -> this.getLabelsPath(s, label).name()));

    return Stream.concat(fields, Stream.concat(textFields, labelFields)).collect(Collectors.toList());
  }

  /**
   * Helper method to create cds path to a text
   *
   * @param s    Structured Type given as root for path construction
   * @param text Text to be navigated to
   * @return Path to the given text
   */
  private SkillsTexts_ getTextsPath(final Skills_ s, final SkillsTexts text) {
    return s.texts(t -> t.ID_texts().eq(text.getIDTexts()).and(t.IsActiveEntity().eq(FALSE)));
  }

  /**
   * Helper method to create cds path to an alternative label
   *
   * @param s     Structured Type given as root for path construction
   * @param label AlternativeLabel to be navigated to
   * @return Path to the given label
   */
  private AlternativeLabels_ getLabelsPath(final Skills_ s, final AlternativeLabels label) {
    return s.alternativeLabels(l -> l.ID().eq(label.getId()).and(l.IsActiveEntity().eq(FALSE)));
  }
}
