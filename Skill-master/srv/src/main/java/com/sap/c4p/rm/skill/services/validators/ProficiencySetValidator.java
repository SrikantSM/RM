package com.sap.c4p.rm.skill.services.validators;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
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
import com.sap.c4p.rm.skill.repositories.DefaultLanguageRepository;
import com.sap.c4p.rm.skill.repositories.LanguageRepository;
import com.sap.c4p.rm.skill.repositories.ProficiencyLevelRepository;
import com.sap.c4p.rm.skill.repositories.ProficiencySetRepository;
import com.sap.c4p.rm.skill.services.DefaultProficiencySetService;
import com.sap.c4p.rm.skill.utils.HttpStatus;
import com.sap.c4p.rm.skill.utils.ValuePath;

import com.sap.resourcemanagement.config.DefaultLanguages;

import proficiencyservice.ProficiencyLevels;
import proficiencyservice.ProficiencyLevelsTexts;
import proficiencyservice.ProficiencyLevelsTexts_;
import proficiencyservice.ProficiencyLevels_;
import proficiencyservice.ProficiencySets;
import proficiencyservice.ProficiencySets_;

@Service
public class ProficiencySetValidator extends InjectionValidator<ProficiencySets, ProficiencySets_> {

  private static final Logger LOGGER = LoggerFactory.getLogger(ProficiencySetValidator.class);
  private static final Marker MARKER = LoggingMarker.VALIDATION.getMarker();
  static final int MAX_LEVEL_COUNT = 50;
  private final LanguageRepository languageRepository;
  private final DefaultLanguageRepository defaultLanguageRepository;
  private final ProficiencySetRepository proficiencySetRepository;
  private final ProficiencyLevelRepository proficiencyLevelRepository;
  private final Messages messages;

  @Autowired
  public ProficiencySetValidator(final LanguageRepository languageRepository,
      final DefaultLanguageRepository defaultLanguageRepository,
      final ProficiencySetRepository proficiencySetRepository,
      final ProficiencyLevelRepository proficiencyLevelRepository, final Messages messages) {
    super(messages, ProficiencySets_.class);
    this.languageRepository = languageRepository;
    this.defaultLanguageRepository = defaultLanguageRepository;
    this.proficiencySetRepository = proficiencySetRepository;
    this.proficiencyLevelRepository = proficiencyLevelRepository;
    this.messages = messages;
  }

  public void validate(final ProficiencySets proficiencySet) {
    // API validations (no field at UI, thus throwing)
    this.validateIfDefaultProficiencySet(proficiencySet);
    this.validateProficiencyLevelDeletion(proficiencySet);
    this.validateRanks(proficiencySet);
    this.validateMaxCountProficiencyLevel(proficiencySet);
    // Other validations (messaging, non-throwing)
    this.validateNameUniqueness(proficiencySet);
    this.validateMinOneProficiencyLevel(proficiencySet);
    this.validateProficiencyLevelTextLanguageExistence(proficiencySet);
    this.validateProficiencyLevelTextDefaultLanguage(proficiencySet);
    this.validateProficiencyLevelTextCount(proficiencySet);
    this.validateLevelNamesUniqueness(proficiencySet);
    this.validateForInjection(proficiencySet);

    this.messages.throwIfError();
  }

  @Override
  List<ValuePath<String, ProficiencySets_>> extractValuesForHtmlInjection(final ProficiencySets proficiencySet) {
    final Stream<ValuePath<String, ProficiencySets_>> fields = Stream.of(
        new ValuePath<>(proficiencySet.getName(), ProficiencySets_::name),
        new ValuePath<>(proficiencySet.getDescription(), ProficiencySets_::description));
    final List<ProficiencyLevels> levels = Optional.ofNullable(proficiencySet.getProficiencyLevels())
        .orElseGet(Collections::emptyList);
    final Stream<ValuePath<String, ProficiencySets_>> subEntityFields = levels.stream().flatMap(level -> {
      final List<ProficiencyLevelsTexts> texts = Optional.ofNullable(level.getTexts())
          .orElseGet(Collections::emptyList);
      return texts.stream().flatMap(
          text -> Stream.of(new ValuePath<>(text.getName(), t -> this.getLevelTextsPath(t, level, text).name()),
              new ValuePath<>(text.getDescription(), t -> this.getLevelTextsPath(t, level, text).description())));
    });
    return Stream.concat(fields, subEntityFields).filter(Objects::nonNull).collect(Collectors.toList());
  }

  @Override
  List<ValuePath<String, ProficiencySets_>> extractValuesForCsvInjection(final ProficiencySets proficiencySet) {
    final Stream<ValuePath<String, ProficiencySets_>> fields = Stream.of(
        new ValuePath<>(proficiencySet.getName(), ProficiencySets_::name),
        new ValuePath<>(proficiencySet.getDescription(), ProficiencySets_::description));
    final List<ProficiencyLevels> levels = Optional.ofNullable(proficiencySet.getProficiencyLevels())
        .orElseGet(Collections::emptyList);
    final Stream<ValuePath<String, ProficiencySets_>> subEntityFields = levels.stream().flatMap(level -> {
      final List<ProficiencyLevelsTexts> texts = Optional.ofNullable(level.getTexts())
          .orElseGet(Collections::emptyList);
      return texts.stream().flatMap(
          text -> Stream.of(new ValuePath<>(text.getName(), t -> this.getLevelTextsPath(t, level, text).name()),
              new ValuePath<>(text.getDescription(), t -> this.getLevelTextsPath(t, level, text).description())));
    });
    return Stream.concat(fields, subEntityFields).filter(Objects::nonNull).collect(Collectors.toList());
  }

  @Override
  String getMessageKeyForHtmlInjection() {
    return MessageKeys.PROF_SET_CONTAINS_HTML_TAG;
  }

  @Override
  String getMessageKeyForCsvInjection() {
    return MessageKeys.PROF_SET_NAME_CONTAINS_FORBIDDEN_FIRST_CHARACTER;
  }

  private ProficiencyLevels_ getLevelsPath(final ProficiencySets_ p, final ProficiencyLevels level) {
    return p.proficiencyLevels(l -> l.ID().eq(level.getId()).and(l.IsActiveEntity().eq(Boolean.FALSE)));
  }

  private ProficiencyLevelsTexts_ getLevelTextsPath(final ProficiencySets_ p, final ProficiencyLevels level,
      final ProficiencyLevelsTexts text) {
    return this.getLevelsPath(p, level)
        .texts(t -> t.ID_texts().eq(text.getIDTexts()).and(t.IsActiveEntity().eq(Boolean.FALSE)));
  }

  public void validateProficiencyLevelTextLanguageExistence(final ProficiencySets proficiencySets) {
    if (proficiencySets.getProficiencyLevels() == null || proficiencySets.getProficiencyLevels().isEmpty()) {
      return;
    }

    proficiencySets.getProficiencyLevels().forEach(proficiencyLevel -> {
      final Set<String> missingLanguages = this.findNotExistingLanguages(proficiencyLevel);

      if (missingLanguages.isEmpty()) {
        return;
      }

      proficiencyLevel.getTexts().forEach(text -> {
        if (missingLanguages.contains(text.getLocale())) {
          this.messages.error(MessageKeys.LANGUAGE_MUST_EXIST).target("in", ProficiencySets_.class,
              p -> this.getLevelTextsPath(p, proficiencyLevel, text).locale());
          LOGGER.info(MARKER, "proficiency level {}/{} contains text in non-existing language <{}>",
              proficiencyLevel.getId(), proficiencyLevel.getName(), text.getLocale());
        }
      });
    });
  }

  private Set<String> findNotExistingLanguages(final ProficiencyLevels level) {
    final List<ProficiencyLevelsTexts> texts = level.getTexts();
    final Set<String> uniqueLanguageCodes = new HashSet<>();

    if (texts != null && !texts.isEmpty()) {
      texts.stream().map(ProficiencyLevelsTexts::getLocale).map(s -> s == null ? "" : s)
          .forEach(uniqueLanguageCodes::add);
    }

    final Set<String> existingLanguageSet = this.languageRepository
        .findExistingActiveLanguageCodes(uniqueLanguageCodes.toArray(new String[0]));

    uniqueLanguageCodes.removeAll(existingLanguageSet);
    return uniqueLanguageCodes;
  }

  public void validateNameUniqueness(final ProficiencySets proficiencySet) {
    if (proficiencySet.getName() == null || proficiencySet.getName().isEmpty()) {
      return;
    }

    final long count = this.proficiencySetRepository.countOtherActiveEntitiesWithSameName(proficiencySet);

    if (count > 0) {
      this.messages.error(MessageKeys.PROFICIENCY_SET_NAME_EXISTS).target("in", ProficiencySets_.class,
          ProficiencySets_::name);
      LOGGER.info(MARKER, "proficiency set with name <{}> already exists", proficiencySet.getName());
    }
  }

  public void validateLevelNamesUniqueness(final ProficiencySets proficiencySet) {
    if (proficiencySet.getProficiencyLevels() == null) {
      return;
    }

    final Map<String, Set<String>> labels = new HashMap<>();

    proficiencySet.getProficiencyLevels().forEach(proficiencyLevel -> {
      if (proficiencyLevel.getTexts() == null) {
        return;
      }

      proficiencyLevel.getTexts().forEach(text -> {
        if (!labels.containsKey(text.getLocale())) {
          labels.put(text.getLocale(), new HashSet<>());
        }

        if (!labels.get(text.getLocale()).add(text.getName())) {
          this.messages.error(MessageKeys.DUPLICATED_PROFICIENCY_LEVEL_NAMES, text.getName()).target("in",
              ProficiencySets_.class, p -> this.getLevelTextsPath(p, proficiencyLevel, text).name());
          LOGGER.info(MARKER, "proficiency set {}/{} contains duplicate level names", proficiencySet.getId(),
              proficiencySet.getName());
        }
      });
    });
  }

  public void validateProficiencyLevelTextDefaultLanguage(final ProficiencySets proficiencySet) {
    if (proficiencySet.getProficiencyLevels() == null) {
      return;
    }

    final DefaultLanguages defaultLanguage = this.defaultLanguageRepository.findActiveEntityByRank(0)
        .orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.NO_DEFAULT_LANGUAGE));

    proficiencySet.getProficiencyLevels().forEach(proficiencyLevel -> {
      if (proficiencyLevel.getTexts() == null) {
        return;
      }

      final Optional<ProficiencyLevelsTexts> defaultText = proficiencyLevel.getTexts().stream()
          .filter(s -> defaultLanguage.getLanguageCode().equals(s.getLocale())).findFirst();

      // Validate that there is a text for the default language
      if (!defaultText.isPresent()) {
        this.messages.error(MessageKeys.PROFICIENCY_LEVEL_NO_DEFAULT_LANGUAGE_TEXT, defaultLanguage.getLanguageCode())
            .target("in", ProficiencySets_.class, p -> this.getLevelsPath(p, proficiencyLevel));
        LOGGER.info(MARKER, "proficiency level {}/{} does not have a name and description in the default language {}",
            proficiencyLevel.getId(), proficiencyLevel.getName(), defaultLanguage.getLanguageCode());
      }
    });
  }

  public void validateProficiencyLevelTextCount(final ProficiencySets proficiencySet) {
    if (proficiencySet.getProficiencyLevels() == null) {
      return;
    }

    proficiencySet.getProficiencyLevels().forEach(proficiencyLevel -> {
      final Set<String> locales = new HashSet<>();

      if (proficiencyLevel.getTexts() == null) {
        return;
      }

      proficiencyLevel.getTexts().forEach(text -> {
        if (text.getLocale() != null && !text.getLocale().isEmpty() && !locales.add(text.getLocale())) {
          // locale already present, add error DUPLICATED_NAME_OR_DESCRIPTION on locale
          this.messages.error(MessageKeys.DUPLICATE_PROFICIENCY_LEVEL_TEXT_LOCALE).target("in", ProficiencySets_.class,
              p -> this.getLevelTextsPath(p, proficiencyLevel, text).locale());
          LOGGER.info(MARKER, "name and description for proficiency level {}/{} already exist for locale {}",
              proficiencySet.getId(), proficiencySet.getName(), text.getLocale());
        }
      });
    });
  }

  public void validateProficiencyLevelDeletion(final ProficiencySets proficiencySet) {
    if (proficiencySet.getProficiencyLevels() == null) {
      return;
    }

    final Set<String> draftProficiencyLevelsIds = proficiencySet.getProficiencyLevels().stream()
        .map(ProficiencyLevels::getId).collect(Collectors.toSet());

    final Set<String> activeProficiencyLevelsIds = this.proficiencyLevelRepository
        .findLevelsByProficiencySetId(proficiencySet.getId(), Boolean.TRUE).stream().map(ProficiencyLevels::getId)
        .collect(Collectors.toSet());

    activeProficiencyLevelsIds.removeAll(draftProficiencyLevelsIds);

    if (!activeProficiencyLevelsIds.isEmpty()) {
      LOGGER.info(MARKER, "active proficiency levels {} cannot be deleted", activeProficiencyLevelsIds);
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.PROFICIENCY_LEVEL_DELETION_RESTRICTION);
    }
  }

  /**
   * Validate that the ranks of the levels in the set are "sane". This means: a)
   * All ranks must be >= 1. b) No duplicate ranks c) no gaps, i.e. 1, 2, 4, 5
   *
   * @param proficiencySet ProficiencySet expanded on its ProficiencyLevels with
   *                       at least the rank-column filled
   */
  public void validateRanks(final ProficiencySets proficiencySet) {
    if (proficiencySet.getProficiencyLevels() == null) {
      return;
    }

    final Set<Integer> rankSet = proficiencySet.getProficiencyLevels().stream().map(ProficiencyLevels::getRank)
        .collect(Collectors.toSet());

    if (rankSet.size() != proficiencySet.getProficiencyLevels().size()) {
      // duplicate ranks
      LOGGER.info(MARKER, "ranking in proficiency set {}/{} is invalid - duplicate ranks", proficiencySet.getId(),
          proficiencySet.getName());
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.PROFICIENCY_LEVEL_RANKS_INVALID);
    }

    for (int i = 1; i <= rankSet.size(); i++) {
      if (!rankSet.contains(i)) {
        // missing entry in the row (might also mean: there were negative numbers or 0)
        LOGGER.info(MARKER, "invalid rank used in proficiency set {}/{}", proficiencySet.getId(),
            proficiencySet.getName());
        throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.PROFICIENCY_LEVEL_RANKS_INVALID);
      }
    }
  }

  public void validateIfDefaultProficiencySet(final ProficiencySets proficiencySet) {
    if (proficiencySet.getId() != null
        && proficiencySet.getId().equalsIgnoreCase(DefaultProficiencySetService.DEFAULT_PROFICIENCY_SET_ID)) {
      LOGGER.info(MARKER, "the default proficiency set {}/{} cannot be changed", proficiencySet.getId(),
          proficiencySet.getName());
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.DEFAULT_PROFICIENCY_SET_NOT_CHANGEABLE);
    }
  }

  public void validateMinOneProficiencyLevel(final ProficiencySets proficiencySet) {
    if (proficiencySet.getProficiencyLevels() == null || proficiencySet.getProficiencyLevels().isEmpty()) {
      this.messages.error(MessageKeys.PROFICIENCY_SET_HAS_NO_PROFICIENCY_LEVEL).target("in", ProficiencySets_.class,
          ProficiencySets_::ID);
      LOGGER.info(MARKER, "proficiency set {}/{} does not have a level", proficiencySet.getId(),
          proficiencySet.getName());
    }
  }

  void validateMaxCountProficiencyLevel(final ProficiencySets proficiencySet) {
    if (proficiencySet.getProficiencyLevels() == null) {
      return;
    }
    if (proficiencySet.getProficiencyLevels().size() > MAX_LEVEL_COUNT) {
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.PROFICIENCY_LEVEL_MAX_COUNT, MAX_LEVEL_COUNT);
    }
  }
}
