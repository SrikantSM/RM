package com.sap.c4p.rm.skill.services.validators;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

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
import com.sap.c4p.rm.skill.repositories.SkillRepository;
import com.sap.c4p.rm.skill.utils.HttpStatus;
import com.sap.c4p.rm.skill.utils.ValuePath;

import catalogservice.Catalogs;
import catalogservice.Catalogs2Skills;
import catalogservice.Catalogs_;
import catalogservice.Skills_;
import skillservice.SkillsTexts;

@Service
public class CatalogValidator extends InjectionValidator<Catalogs, Catalogs_> {
  private static final Logger LOGGER = LoggerFactory.getLogger(CatalogValidator.class);
  private static final Marker MARKER = LoggingMarker.VALIDATION.getMarker();
  private final CatalogRepository catalogRepository;
  private final SkillRepository skillRepository;
  private final Messages messages;

  @Autowired
  public CatalogValidator(final CatalogRepository catalogRepository, final SkillRepository skillRepository,
      final Messages messages) {
    super(messages, Catalogs_.class);
    this.messages = messages;
    this.catalogRepository = catalogRepository;
    this.skillRepository = skillRepository;
  }

  public void validate(final Catalogs catalog) {
    this.validateSkillExists(catalog);
    this.validateForInjection(catalog);
    this.validateNameUniqueness(catalog);
    this.validateSkillUniqueness(catalog);

    this.messages.throwIfError();
  }

  public void validateNameUniqueness(final Catalogs catalog) {
    if (catalog.getName() == null || catalog.getName().isEmpty()) {
      return;
    }

    final long count = this.catalogRepository.countOtherActiveEntitiesWithSameName(catalog);

    if (count > 0) {
      this.messages.error(MessageKeys.CATALOG_NAME_EXISTS).target("in", Catalogs_.class, Catalogs_::name);
      LOGGER.info(MARKER, "catalog with name <{}> already exists", catalog.getName());
    }
  }

  public void validateSkillExists(final Catalogs catalog) {
    if (catalog.getSkillAssociations() != null) {
      catalog.getSkillAssociations().forEach(c2s -> {
        if (c2s.getSkillId() == null) {
          LOGGER.info(MARKER, "catalog <{}> contains empty skill assignment with catalogs2Skills id <{}>",
              catalog.getName(), c2s.getId());
          this.messages.error(MessageKeys.SKILL_ASSIGNMENT_EMPTY).target("in", Catalogs_.class,
              c -> this.getLabelsPath(c, c2s).name());
        } else if (!this.skillRepository.findById(c2s.getSkillId(), Boolean.TRUE, skillservice.Skills_::ID)
            .isPresent()) {
          LOGGER.info(MARKER, "skill with id <{}> does not exist", c2s.getSkillId());
          this.messages.error(MessageKeys.SKILL_MUST_EXIST, c2s.getSkillId()).target("in", Catalogs_.class,
              c -> this.getLabelsPath(c, c2s).name());
        }
      });
    }
  }

  public void validateSkillUniqueness(final Catalogs catalog) {
    if (catalog.getSkillAssociations() == null) {
      return;
    }
    Set<String> skillIds = new HashSet<>();
    for (Catalogs2Skills c2s : catalog.getSkillAssociations()) {
      if (!skillIds.add(c2s.getSkillId())) {
        // will not throw if the skill does not exist, which is checked by
        // a different validation
        this.skillRepository.findByIdLocalized(c2s.getSkillId(), Boolean.TRUE).ifPresent(skill -> {
          String skillName = Optional.ofNullable(skill.getLocalized()).map(SkillsTexts::getName)
              .orElse(skill.getName());
          this.messages.error(MessageKeys.CATALOG_SKILL_UNIQUENESS, skillName).target("in", Catalogs_.class,
              c -> this.getLabelsPath(c, c2s).name());
          LOGGER.info(MARKER, "duplicate skill in catalog {}/{}", catalog.getId(), catalog.getName());
        });
      }
    }
  }

  private Skills_ getLabelsPath(final Catalogs_ c, final Catalogs2Skills c2s) {
    return c.skillAssociations(l -> l.ID().eq(c2s.getId()).and(l.IsActiveEntity().eq(Boolean.FALSE))).skill();
  }

  public void validateDeletion(final Optional<Catalogs> catalog) {
    if (!catalog.isPresent() || !catalog.get().getSkillAssociations().isEmpty()) {
      if (LOGGER.isInfoEnabled()) {
        LOGGER.info(MARKER, "catalog {} cannot be deleted, it still contains skills",
            catalog.map(Catalogs::getName).orElse("<n/a>"));
      }
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.CATALOG_DELETION_REFUSED);
    }
  }

  @Override
  List<ValuePath<String, Catalogs_>> extractValuesForHtmlInjection(final Catalogs catalog) {
    return Arrays.asList(new ValuePath<>(catalog.getName(), Catalogs_::name),
        new ValuePath<>(catalog.getDescription(), Catalogs_::description));
  }

  @Override
  List<ValuePath<String, Catalogs_>> extractValuesForCsvInjection(final Catalogs catalog) {
    return Arrays.asList(new ValuePath<>(catalog.getName(), Catalogs_::name));
  }

  @Override
  String getMessageKeyForHtmlInjection() {
    return MessageKeys.CATALOG_CONTAINS_HTML_TAG;
  }

  @Override
  String getMessageKeyForCsvInjection() {
    return MessageKeys.FORBIDDEN_FIRST_CHARACTER_CATALOG;
  }
}
